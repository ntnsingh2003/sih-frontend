import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { INITIAL_PATIENTS, PatientQueueItem } from '../data/mockPatients';
import { ClinicalSummary, Patient, IntakeMode, UserRole } from '../types/clinical';
import { auditService } from '../services/auditService';

const STORAGE_KEY = 'medikiosk_active_patients_v2';
const AUTH_STORAGE_KEY = 'medikiosk_auth_staff_v1';

export type AppViewMode = 'LANDING' | 'LOGIN' | 'KIOSK' | 'DOCTOR' | 'DUAL_SIM';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  licenseNumber: string;
  department: string;
}

export const DEMO_STAFF_ACCOUNTS: StaffUser[] = [
  {
    id: 'usr-patel-01',
    name: 'Dr. Arun Patel, MD',
    email: 'dr.arun@aiims.edu',
    role: 'DOCTOR',
    licenseNumber: 'NMC/2018/04912',
    department: 'Cardiology & Emergency Triage'
  },
  {
    id: 'usr-sharma-02',
    name: 'Nurse Priya Sharma',
    email: 'priya.sharma@aiims.edu',
    role: 'NURSE',
    licenseNumber: 'INC/2021/8834',
    department: 'Acute OPD & Triage Bay'
  },
  {
    id: 'usr-verma-03',
    name: 'Dr. Vikram Sen, MS',
    email: 'admin.sen@aiims.edu',
    role: 'ADMIN',
    licenseNumber: 'NMC/2012/11029',
    department: 'Hospital Administration & Safety'
  }
];

export const DEFAULT_DOCTOR = DEMO_STAFF_ACCOUNTS[0];

interface ClinicalContextType {
  patients: PatientQueueItem[];
  selectedPatientId: string | null;
  activeView: AppViewMode;
  syncNotification: string | null;
  currentUser: StaffUser | null;
  preloadedPatient: Patient | null;
  preloadedMode: IntakeMode;
  addPatientSession: (newItem: PatientQueueItem) => void;
  updateSummary: (patientId: string, updatedSummary: ClinicalSummary) => void;
  updatePatientItem: (patientId: string, updater: (prev: PatientQueueItem) => PatientQueueItem) => void;
  selectPatient: (patientId: string) => void;
  setActiveView: (view: AppViewMode) => void;
  loginStaff: (user: StaffUser) => void;
  logoutStaff: () => void;
  loginPatient: (patient: Patient, mode: IntakeMode) => void;
  clearPreloadedPatient: () => void;
  resetDemoData: () => void;
  dismissSyncNotification: () => void;
}

const ClinicalContext = createContext<ClinicalContextType | undefined>(undefined);

// Web Audio API Sound Chime for New Patient Arrival
export const playArrivalChime = (isEmergency: boolean = false) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isEmergency ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    if (isEmergency) {
      // Rapid two-tone alert for emergency red flag
      playTone(880, ctx.currentTime, 0.18);
      playTone(660, ctx.currentTime + 0.2, 0.25);
    } else {
      // Gentle prestige hospital intake chime
      playTone(523.25, ctx.currentTime, 0.15); // C5
      playTone(659.25, ctx.currentTime + 0.15, 0.25); // E5
      playTone(783.99, ctx.currentTime + 0.35, 0.35); // G5
    }
  } catch (e) {
    // Browser audio policy restriction if unclicked
  }
};

export const ClinicalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Initial State with LocalStorage Persistence
  const [patients, setPatients] = useState<PatientQueueItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load persisted patients');
    }
    return INITIAL_PATIENTS;
  });

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(() => {
    return patients.length > 0 ? patients[0].patient.id : null;
  });

  const [activeView, setActiveViewInternal] = useState<AppViewMode>('LANDING');
  const [syncNotification, setSyncNotification] = useState<string | null>(null);

  // Authentication State: Starts as null so user must log in
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load persisted staff');
    }
    return null;
  });

  const [preloadedPatient, setPreloadedPatient] = useState<Patient | null>(null);
  const [preloadedMode, setPreloadedMode] = useState<IntakeMode>('ALLOPATHY');

  const loginStaff = (user: StaffUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {}
    auditService.recordLog(user.role, 'VIEW_SUMMARY', `Staff login successful: ${user.name} (${user.role})`, 'AUTH', 'SUCCESS');
    setActiveView('DOCTOR');
    setSyncNotification(`Authenticated as ${user.name} (${user.role}). Redirected to Doctor OPD.`);
  };

  const logoutStaff = () => {
    if (currentUser) {
      auditService.recordLog(currentUser.role, 'VIEW_SUMMARY', `Staff logout: ${currentUser.name}`, 'AUTH', 'SUCCESS');
    }
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setActiveView('LOGIN');
    setSyncNotification('Logged out successfully.');
  };

  const loginPatient = (patient: Patient, mode: IntakeMode) => {
    setPreloadedPatient(patient);
    setPreloadedMode(mode);
    auditService.recordLog('PATIENT', 'VIEW_SUMMARY', `Patient check-in/login: ${patient.name} (${patient.hospitalPatientId})`, patient.id, 'SUCCESS');
    setActiveView('KIOSK');
    setSyncNotification(`Patient session verified for ${patient.name}. Launching Kiosk Intake.`);
  };

  const clearPreloadedPatient = () => {
    setPreloadedPatient(null);
  };

  // 2. Persist whenever patients change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    } catch (e) {
      console.warn('Failed to persist patients to localStorage');
    }
  }, [patients]);

  // 3. Real-Time Multi-Device / Cross-Tab Sync via BroadcastChannel
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel('medikiosk_sync_bus');
        channel.onmessage = (event) => {
          const { type, payload } = event.data;
          if (type === 'NEW_PATIENT_ARRIVED') {
            const newItem: PatientQueueItem = payload;
            setPatients(prev => [newItem, ...prev.filter(p => p.patient.id !== newItem.patient.id)]);
            setSelectedPatientId(newItem.patient.id);
            const isRed = newItem.session.triagePriority === 'RED';
            playArrivalChime(isRed);
            setSyncNotification(
              isRed
                ? `🚨 CRITICAL ALERT: ${newItem.patient.name} (Token ${newItem.session.tokenNumber}) checked in with PRIORITY RED!`
                : `🔔 Cross-Terminal Sync: ${newItem.patient.name} (Token ${newItem.session.tokenNumber}) added to OPD Queue.`
            );
          } else if (type === 'SUMMARY_UPDATED') {
            const { patientId, summary } = payload;
            setPatients(prev =>
              prev.map(p => (p.patient.id === patientId ? { ...p, summary } : p))
            );
          } else if (type === 'RESET_DEMO') {
            setPatients(INITIAL_PATIENTS);
            setSelectedPatientId(INITIAL_PATIENTS[0].patient.id);
            setSyncNotification('ℹ️ Queue reset to initial hackathon demo state.');
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported');
    }

    return () => {
      if (channel) {
        channel.close();
      }
    };
  }, []);

  const setActiveView = (view: AppViewMode) => {
    setActiveViewInternal(view);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const addPatientSession = (newItem: PatientQueueItem) => {
    setPatients(prev => [newItem, ...prev]);
    setSelectedPatientId(newItem.patient.id);
    const isRed = newItem.session.triagePriority === 'RED';
    playArrivalChime(isRed);

    // Broadcast to other open tabs / simulator
    try {
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('medikiosk_sync_bus');
        channel.postMessage({ type: 'NEW_PATIENT_ARRIVED', payload: newItem });
        channel.close();
      }
    } catch (e) {
      // Fallback
    }

    setSyncNotification(
      `✅ Intake Token ${newItem.session.tokenNumber} issued for ${newItem.patient.name}. Synced to Hospital OPD Queue.`
    );
  };

  const updateSummary = (patientId: string, updatedSummary: ClinicalSummary) => {
    setPatients(prev =>
      prev.map(item =>
        item.patient.id === patientId ? { ...item, summary: updatedSummary } : item
      )
    );

    try {
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('medikiosk_sync_bus');
        channel.postMessage({
          type: 'SUMMARY_UPDATED',
          payload: { patientId, summary: updatedSummary }
        });
        channel.close();
      }
    } catch (e) {
      // Fallback
    }
  };

  const updatePatientItem = (patientId: string, updater: (prev: PatientQueueItem) => PatientQueueItem) => {
    setPatients(prev =>
      prev.map(item =>
        item.patient.id === patientId ? updater(item) : item
      )
    );
  };

  const selectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const resetDemoData = () => {
    setPatients(INITIAL_PATIENTS);
    setSelectedPatientId(INITIAL_PATIENTS[0].patient.id);
    localStorage.removeItem(STORAGE_KEY);
    try {
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('medikiosk_sync_bus');
        channel.postMessage({ type: 'RESET_DEMO' });
        channel.close();
      }
    } catch (e) {}

    auditService.recordLog('ADMIN', 'SYSTEM_RESET', 'Demo patient database restored to factory initial state', 'ALL', 'SUCCESS');
    setSyncNotification('Demo database restored to default 3 patients.');
  };

  const dismissSyncNotification = () => {
    setSyncNotification(null);
  };

  return (
    <ClinicalContext.Provider
      value={{
        patients,
        selectedPatientId,
        activeView,
        syncNotification,
        currentUser,
        preloadedPatient,
        preloadedMode,
        addPatientSession,
        updateSummary,
        updatePatientItem,
        selectPatient,
        setActiveView,
        loginStaff,
        logoutStaff,
        loginPatient,
        clearPreloadedPatient,
        resetDemoData,
        dismissSyncNotification
      }}
    >
      {children}
    </ClinicalContext.Provider>
  );
};

export const useClinical = () => {
  const context = useContext(ClinicalContext);
  if (!context) {
    throw new Error('useClinical must be used within a ClinicalProvider');
  }
  return context;
};

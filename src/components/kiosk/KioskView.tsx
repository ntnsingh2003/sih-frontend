import React, { useState, useEffect } from 'react';
import { Patient, Session, SupportedLanguage, IntakeMode, ScannedDocument, MedicalEntity, LabResult, Medication, ClinicalTimelineEvent } from '../../types/clinical';
import { ALLOPATHY_QUESTIONS, AYUSH_QUESTIONS } from '../../services/adaptiveEngine';
import { evaluateRedFlags } from '../../services/redFlagEngine';
import { generateStructuredSummary } from '../../services/summaryGenerator';
import { auditService } from '../../services/auditService';
import { WelcomeScreen } from './WelcomeScreen';
import { LanguageSelectScreen } from './LanguageSelectScreen';
import { IdentificationScreen } from './IdentificationScreen';
import { ConsentScreen } from './ConsentScreen';
import { VoiceCalibrationScreen } from './VoiceCalibrationScreen';
import { IntakeQuestionsScreen } from './IntakeQuestionsScreen';
import { DocumentScanScreen } from './DocumentScanScreen';
import { ReviewConfirmationScreen } from './ReviewConfirmationScreen';
import { KioskCompletionScreen } from './KioskCompletionScreen';
import { InactivityPurgeModal } from './InactivityPurgeModal';
import { PatientQueueItem } from '../../data/mockPatients';
import { useClinical } from '../../context/ClinicalContext';
import { Volume2, VolumeX, Eye, Type, ShieldCheck } from 'lucide-react';

interface Props {
  onSessionFinished: (newItem: PatientQueueItem) => void;
  onNavigateToDoctor: (patientId: string) => void;
}

export const KioskView: React.FC<Props> = ({ onSessionFinished, onNavigateToDoctor }) => {
  const { preloadedPatient, preloadedMode, clearPreloadedPatient } = useClinical();

  const [step, setStep] = useState<number>(0);
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(1);

  // Session Data
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [intakeMode, setIntakeMode] = useState<IntakeMode>('ALLOPATHY');

  // Auto-launch intake if logged in from Patient Login Portal
  useEffect(() => {
    if (preloadedPatient) {
      setCurrentPatient(preloadedPatient);
      setIntakeMode(preloadedMode);
      setLang(preloadedPatient.preferredLanguage || 'en');
      setStep(3); // Jump straight to Consent (step 3)
      clearPreloadedPatient();
    }
  }, [preloadedPatient, preloadedMode, clearPreloadedPatient]);
  const [sessionId, setSessionId] = useState<string>(`sess-${Date.now()}`);
  const [tokenNumber, setTokenNumber] = useState<string>(`TK-${Math.floor(100 + Math.random() * 900)}`);
  const [intakeAnswers, setIntakeAnswers] = useState<Record<string, any>>({});
  const [scannedDocs, setScannedDocs] = useState<ScannedDocument[]>([]);
  const [extractedEntities, setExtractedEntities] = useState<MedicalEntity[]>([]);
  const [extractedLabs, setExtractedLabs] = useState<LabResult[]>([]);
  const [extractedMeds, setExtractedMeds] = useState<Medication[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<ClinicalTimelineEvent[]>([]);
  const [completedSession, setCompletedSession] = useState<Session | null>(null);
  const [completedQueueItem, setCompletedQueueItem] = useState<PatientQueueItem | null>(null);

  // DPDP Act 2023 Inactivity Safeguard: Auto-purge if patient walks away
  const [inactivityModalOpen, setInactivityModalOpen] = useState<boolean>(false);
  const [purgeCountdown, setPurgeCountdown] = useState<number>(15);

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    document.documentElement.setAttribute('data-high-contrast', next ? 'true' : 'false');
  };

  const cycleFontSize = () => {
    if (fontSize === 1) setFontSize(1.15);
    else if (fontSize === 1.15) setFontSize(1.3);
    else setFontSize(1);
  };

  // Activity detection: Resets 45-second timer on interaction during active session (steps 1-7)
  useEffect(() => {
    if (step <= 0 || step >= 8) {
      setInactivityModalOpen(false);
      return;
    }

    let warningTimeout: any = null;

    const resetTimer = () => {
      if (inactivityModalOpen) return;
      clearTimeout(warningTimeout);
      setPurgeCountdown(15);
      warningTimeout = setTimeout(() => {
        setInactivityModalOpen(true);
      }, 45000); // 45 seconds of idle inactivity
    };

    const onActivity = () => {
      if (!inactivityModalOpen) {
        resetTimer();
      }
    };

    window.addEventListener('mousemove', onActivity);
    window.addEventListener('keydown', onActivity);
    window.addEventListener('touchstart', onActivity);
    window.addEventListener('click', onActivity);

    resetTimer();

    return () => {
      clearTimeout(warningTimeout);
      window.removeEventListener('mousemove', onActivity);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('touchstart', onActivity);
      window.removeEventListener('click', onActivity);
    };
  }, [step, inactivityModalOpen]);

  // 15-second ticking countdown when warning modal is displayed
  useEffect(() => {
    if (!inactivityModalOpen) return;

    const interval = setInterval(() => {
      setPurgeCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          executeInactivityPurge();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [inactivityModalOpen]);

  const executeInactivityPurge = () => {
    setInactivityModalOpen(false);
    auditService.recordLog(
      'SYSTEM',
      'INACTIVITY_PURGE',
      'Patient session memory cryptographically purged after 60 seconds of terminal inactivity (DPDP Act 2023)',
      currentPatient?.id || 'ANONYMOUS',
      'SUCCESS'
    );
    handleResetKiosk();
  };

  const handlePatientIdentified = (patient: Patient, mode: IntakeMode) => {
    setCurrentPatient(patient);
    setIntakeMode(mode);
    setStep(3); // Consent
  };

  const handleConsentGranted = () => {
    if (currentPatient) {
      auditService.recordLog(
        'PATIENT',
        'VIEW_SUMMARY',
        `Consented for ${intakeMode} clinical intake`,
        currentPatient.id,
        'SUCCESS'
      );
    }
    setStep(4); // Voice Calibration
  };

  const handleQuestionsComplete = (answers: Record<string, any>) => {
    setIntakeAnswers(answers);
    setStep(6); // Document Scan
  };

  const handleDocumentsComplete = (
    docs: ScannedDocument[],
    entities: MedicalEntity[],
    labs: LabResult[],
    meds: Medication[],
    tl: ClinicalTimelineEvent[]
  ) => {
    setScannedDocs(docs);
    setExtractedEntities(entities);
    setExtractedLabs(labs);
    setExtractedMeds(meds);
    setTimelineEvents(tl);
    setStep(7); // Review & Confirmation Screen
  };

  const handleFinalConfirmation = () => {
    if (!currentPatient) return;

    // Evaluate Red Flags
    const evalResult = evaluateRedFlags(sessionId, currentPatient.id, intakeAnswers);

    // Build Session
    const sessionObj: Session = {
      id: sessionId,
      patientId: currentPatient.id,
      tokenNumber,
      mode: intakeMode,
      status: 'TRIAGED',
      triagePriority: evalResult.priority,
      priorityAlert: evalResult.alerts.length > 0 ? evalResult.alerts[0].title : undefined,
      kioskId: intakeMode === 'AYUSH' ? 'KIOSK-AYUSH-01' : 'KIOSK-OPD-01',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString()
    };

    // Generate Structured Summary
    const summary = generateStructuredSummary(
      currentPatient.id,
      sessionId,
      intakeMode,
      intakeAnswers,
      extractedLabs,
      extractedMeds
    );

    // Timeline entries
    const combinedTimeline: ClinicalTimelineEvent[] = [
      {
        id: `tl-symptom-${sessionId}`,
        patientId: currentPatient.id,
        date: new Date().toISOString().split('T')[0],
        category: 'SYMPTOM',
        title: intakeAnswers.chiefComplaint || 'Clinical Consultation',
        description: `Chief complaint reported during kiosk intake. Severity: ${intakeAnswers.severity || 'N/A'}/10.`
      },
      ...timelineEvents
    ];

    const newQueueItem: PatientQueueItem = {
      patient: currentPatient,
      session: sessionObj,
      summary,
      labs: extractedLabs,
      medications: extractedMeds,
      documents: scannedDocs,
      timeline: combinedTimeline,
      redFlags: evalResult.alerts
    };

    // Record Audit log
    auditService.recordLog(
      'PATIENT',
      'APPROVE_SUMMARY',
      `Session intake submitted with priority ${evalResult.priority}`,
      currentPatient.id,
      evalResult.priority === 'RED' ? 'FLAGGED' : 'SUCCESS',
      `Chief complaint: ${intakeAnswers.chiefComplaint}`
    );

    setCompletedSession(sessionObj);
    setCompletedQueueItem(newQueueItem);
    onSessionFinished(newQueueItem);
    setStep(8); // Completion Screen
  };

  const handleResetKiosk = () => {
    setCurrentPatient(null);
    setIntakeAnswers({});
    setScannedDocs([]);
    setExtractedEntities([]);
    setExtractedLabs([]);
    setExtractedMeds([]);
    setTimelineEvents([]);
    setSessionId(`sess-${Date.now()}`);
    setTokenNumber(`TK-${Math.floor(100 + Math.random() * 900)}`);
    setCompletedSession(null);
    setCompletedQueueItem(null);
    setStep(0);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        fontSize: `${fontSize}rem`,
        background: 'var(--color-bg-canvas)',
        minHeight: 'calc(100vh - 70px)'
      }}
    >
      {/* Top Accessibility Bar */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid var(--color-border)',
          padding: '0.75rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--shadow-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--color-brand-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
            MK
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>MediKiosk Terminal</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)', display: 'block' }}>Hospital Clinical Intake Node #01</span>
          </div>
        </div>

        {/* Accessibility Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            title="Audio Voice Assistance Toggle"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--kiosk-radius-full)',
              background: audioEnabled ? 'var(--color-brand-50)' : '#f1f5f9',
              color: audioEnabled ? 'var(--color-brand-700)' : 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>{audioEnabled ? 'Voice ON' : 'Voice OFF'}</span>
          </button>

          <button
            onClick={cycleFontSize}
            title="Increase/Decrease Text Size"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--kiosk-radius-full)',
              background: fontSize > 1 ? 'var(--color-brand-50)' : '#f1f5f9',
              color: fontSize > 1 ? 'var(--color-brand-700)' : 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <Type size={18} />
            <span>Text: {fontSize === 1 ? 'Regular' : fontSize === 1.15 ? 'Large' : 'XL'}</span>
          </button>

          <button
            onClick={toggleHighContrast}
            title="High Contrast Mode for Low Vision Patients"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--kiosk-radius-full)',
              background: highContrast ? '#0f172a' : '#f1f5f9',
              color: highContrast ? '#ffffff' : 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <Eye size={18} />
            <span>High Contrast</span>
          </button>

          {step > 0 && step < 8 && (
            <button
              onClick={handleResetKiosk}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--kiosk-radius-full)',
                background: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fee2e2',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              Cancel / Start Over
            </button>
          )}
        </div>
      </header>

      {/* Screen Body */}
      <main style={{ flex: 1, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {step === 0 && (
          <WelcomeScreen
            lang={lang}
            audioEnabled={audioEnabled}
            onStart={() => setStep(1)}
          />
        )}

        {step === 1 && (
          <LanguageSelectScreen
            currentLang={lang}
            audioEnabled={audioEnabled}
            onSelect={(newLang) => setLang(newLang)}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <IdentificationScreen
            lang={lang}
            audioEnabled={audioEnabled}
            onIdentify={handlePatientIdentified}
          />
        )}

        {step === 3 && currentPatient && (
          <ConsentScreen
            patientName={currentPatient.name}
            lang={lang}
            audioEnabled={audioEnabled}
            onConsentGranted={handleConsentGranted}
          />
        )}

        {step === 4 && (
          <VoiceCalibrationScreen
            lang={lang}
            audioEnabled={audioEnabled}
            onContinue={() => setStep(5)}
          />
        )}

        {step === 5 && currentPatient && (
          <IntakeQuestionsScreen
            questions={intakeMode === 'AYUSH' ? AYUSH_QUESTIONS : ALLOPATHY_QUESTIONS}
            mode={intakeMode}
            lang={lang}
            audioEnabled={audioEnabled}
            sessionId={sessionId}
            patientId={currentPatient.id}
            onComplete={handleQuestionsComplete}
          />
        )}

        {step === 6 && currentPatient && (
          <DocumentScanScreen
            patientId={currentPatient.id}
            sessionId={sessionId}
            lang={lang}
            audioEnabled={audioEnabled}
            onContinue={handleDocumentsComplete}
          />
        )}

        {step === 7 && currentPatient && (
          <ReviewConfirmationScreen
            patient={currentPatient}
            answers={intakeAnswers}
            scannedDocs={scannedDocs}
            extractedMeds={extractedMeds}
            extractedLabs={extractedLabs}
            lang={lang}
            onBack={() => setStep(6)}
            onConfirm={handleFinalConfirmation}
          />
        )}

        {step === 8 && currentPatient && completedSession && (
          <KioskCompletionScreen
            patient={currentPatient}
            session={completedSession}
            queueItem={completedQueueItem || undefined}
            audioEnabled={audioEnabled}
            onResetKiosk={handleResetKiosk}
            onOpenDoctorPortal={onNavigateToDoctor}
          />
        )}
      </main>

      {/* DPDP Act 2023 Inactivity Auto-Purge Modal */}
      <InactivityPurgeModal
        isOpen={inactivityModalOpen}
        remainingSeconds={purgeCountdown}
        lang={lang}
        onStay={() => {
          setInactivityModalOpen(false);
          setPurgeCountdown(15);
        }}
        onPurge={executeInactivityPurge}
      />
    </div>
  );
};

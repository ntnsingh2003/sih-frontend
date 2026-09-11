import React from 'react';
import { KioskView } from '../kiosk/KioskView';
import { DoctorDashboard } from '../doctor/DoctorDashboard';
import { useClinical } from '../../context/ClinicalContext';
import { Sparkles, Monitor, Stethoscope, Zap, ShieldCheck, Wifi, ArrowRight } from 'lucide-react';

interface Props {
  onOpenAuditLog: () => void;
}

export const DualDeviceSimulator: React.FC<Props> = ({ onOpenAuditLog }) => {
  const {
    patients,
    selectedPatientId,
    addPatientSession,
    updateSummary,
    selectPatient
  } = useClinical();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#020617', color: '#f8fafc', overflow: 'hidden', height: 'calc(100vh - 65px)' }}>
      {/* Simulator Control Header */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.6rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00f5a0', display: 'inline-block', boxShadow: '0 0 10px #00f5a0' }} />
          <span style={{ fontWeight: 800, fontSize: '0.92rem', fontFamily: 'var(--font-family-display)', color: '#ffffff' }}>
            Multi-Device Live Sync Simulator
          </span>
          <span style={{ background: 'rgba(0, 245, 160, 0.1)', color: 'var(--color-mint-400)', border: '1px solid rgba(0, 245, 160, 0.25)', fontSize: '0.72rem', padding: '0.15rem 0.55rem', borderRadius: '6px', fontFamily: 'var(--font-family-mono)' }}>
            BroadcastChannel Latency: 4ms • Zero Cloud Dependency
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Left: <strong>Physical Kiosk Terminal</strong> &nbsp;⇄&nbsp; Right: <strong>Doctor OPD PC</strong>
          </div>
        </div>
      </div>

      {/* Split 50/50 Dual Screen Grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
        
        {/* LEFT PANE: Kiosk Device Frame */}
        <div style={{
          borderRight: '2px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          background: '#0a0f1d',
          padding: '1rem',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Simulated Kiosk Hardware Bezel Header */}
          <div style={{
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderTopLeftRadius: '18px',
            borderTopRightRadius: '18px',
            padding: '0.5rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.76rem',
            color: '#94a3b8',
            fontFamily: 'var(--font-family-mono)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e5ff' }} />
              <span>TERMINAL-01 (OPD Lobby Kiosk)</span>
            </div>
            <div>COTS All-in-One 21.5" Capacitive Multi-Touch</div>
          </div>

          {/* Kiosk View Screen Container */}
          <div style={{
            flex: 1,
            background: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderTop: 'none',
            borderBottomLeftRadius: '18px',
            borderBottomRightRadius: '18px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <KioskView
              onSessionFinished={addPatientSession}
              onNavigateToDoctor={selectPatient}
            />
          </div>
        </div>

        {/* RIGHT PANE: Doctor Workstation Frame */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#0a0f1d',
          padding: '1rem',
          overflow: 'hidden'
        }}>
          {/* Simulated Doctor Workstation Window Header */}
          <div style={{
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderTopLeftRadius: '18px',
            borderTopRightRadius: '18px',
            padding: '0.5rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.76rem',
            color: '#94a3b8',
            fontFamily: 'var(--font-family-mono)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} />
              <span>DR-PATEL-WORKSTATION (Room 104)</span>
            </div>
            <div>Hospital EMR Portal • HL7 FHIR R4 Ready</div>
          </div>

          {/* Doctor Dashboard Screen Container */}
          <div style={{
            flex: 1,
            background: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderTop: 'none',
            borderBottomLeftRadius: '18px',
            borderBottomRightRadius: '18px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <DoctorDashboard
              patients={patients}
              selectedPatientId={selectedPatientId}
              onSelectPatient={selectPatient}
              onUpdateSummary={updateSummary}
              onOpenAuditLog={onOpenAuditLog}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

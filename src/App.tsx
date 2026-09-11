import React, { useState } from 'react';
import { UserRole } from './types/clinical';
import { LandingPage } from './components/landing/LandingPage';
import { KioskView } from './components/kiosk/KioskView';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { DualDeviceSimulator } from './components/simulator/DualDeviceSimulator';
import { LoginPage } from './components/auth/LoginPage';
import { AuditLogModal } from './components/common/AuditLogModal';
import { ArchitectureModal } from './components/common/ArchitectureModal';
import { ClinicalProvider, useClinical, AppViewMode } from './context/ClinicalContext';
import { Monitor, Stethoscope, ShieldCheck, Database, Shield, Sparkles, Layers, RefreshCw, X, Bell, LogIn, LogOut, User } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    activeView,
    syncNotification,
    currentUser,
    logoutStaff,
    addPatientSession,
    updateSummary,
    updatePatientItem,
    selectPatient,
    setActiveView,
    resetDemoData,
    dismissSyncNotification
  } = useClinical();

  const [currentRole, setCurrentRole] = useState<UserRole>('DOCTOR');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  // Standalone dedicated Login Page (completely separate from Landing and internal app dashboard)
  if (activeView === 'LOGIN') {
    return <LoginPage />;
  }

  const isDarkTheme = activeView === 'DUAL_SIM';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: isDarkTheme ? 'var(--color-bg-dark)' : 'var(--color-bg-canvas)' }}>
      {/* Luxury Glassmorphic Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          background: isDarkTheme ? 'rgba(3, 7, 18, 0.88)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(226, 232, 240, 0.85)',
          padding: '0.65rem 1.8rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          zIndex: 100,
          boxShadow: isDarkTheme ? '0 10px 30px rgba(0, 0, 0, 0.6)' : '0 1px 3px rgba(15, 23, 42, 0.04)'
        }}
      >
        {/* Bespoke Luxury Medical Brand Logo */}
        <div
          onClick={() => setActiveView('LANDING')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.95rem', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 245, 160, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(0, 245, 160, 0.35)',
              position: 'relative'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3V21M3 12H21" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" fill="#00f5a0" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, fontSize: '1.28rem', letterSpacing: '-0.03em', color: isDarkTheme ? '#ffffff' : 'var(--color-text-main)' }}>
                MediKiosk
              </span>
              <span style={{
                background: isDarkTheme ? 'rgba(0, 245, 160, 0.1)' : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                color: isDarkTheme ? 'var(--color-mint-400)' : '#065f46',
                border: isDarkTheme ? '1px solid rgba(0, 245, 160, 0.3)' : '1px solid rgba(187, 247, 208, 0.8)',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-family-mono)',
                fontWeight: 700,
                padding: '0.15rem 0.55rem',
                borderRadius: '9999px',
                letterSpacing: '0.04em',
                boxShadow: isDarkTheme ? '0 0 12px rgba(0, 245, 160, 0.15)' : 'none'
              }}>
                PRESTIGE CLINICAL
              </span>
            </div>
            <span style={{ fontSize: '0.76rem', color: isDarkTheme ? '#94a3b8' : 'var(--color-text-muted)', fontWeight: 500, letterSpacing: '-0.01em' }}>
              Digital Clinical Intake & Interoperable Triage Core
            </span>
          </div>
        </div>

        {/* Header Right: Only Login Option */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {currentUser ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: isDarkTheme ? 'rgba(15, 23, 42, 0.7)' : '#ffffff',
              border: isDarkTheme ? '1px solid rgba(0, 245, 160, 0.3)' : '1.5px solid var(--color-border)',
              borderRadius: '12px',
              padding: '0.35rem 0.75rem',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f5a0', boxShadow: '0 0 6px #00f5a0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isDarkTheme ? '#f1f5f9' : 'var(--color-text-main)', lineHeight: 1.1 }}>
                  {currentUser.name}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                  {currentUser.role} • {currentUser.department.split('&')[0]}
                </span>
              </div>
              <button
                onClick={() => setActiveView(currentUser.role === 'PATIENT' ? 'KIOSK' : 'DOCTOR')}
                style={{
                  background: 'rgba(5, 150, 105, 0.12)',
                  border: '1px solid rgba(5, 150, 105, 0.3)',
                  borderRadius: '6px',
                  padding: '0.24rem 0.5rem',
                  color: '#059669',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  marginLeft: '0.25rem'
                }}
              >
                Dashboard
              </button>
              <button
                onClick={logoutStaff}
                title="Sign Out"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  padding: '0.24rem 0.5rem',
                  color: '#ef4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}
              >
                <LogOut size={11} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveView('LOGIN')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.58rem 1.4rem',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                transition: 'all 0.18s ease'
              }}
            >
              <LogIn size={15} />
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      {/* Real-Time Floating Sync Toast Banner */}
      {syncNotification && (
        <div style={{
          position: 'fixed',
          top: '75px',
          right: '25px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 245, 160, 0.4)',
          borderRadius: '14px',
          padding: '0.85rem 1.25rem',
          color: '#ffffff',
          boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 245, 160, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          zIndex: 999,
          maxWidth: '460px',
          fontSize: '0.88rem',
          fontWeight: 600,
          animation: 'slideIn 0.2s ease-out'
        }}>
          <Bell size={18} color="#00f5a0" style={{ flexShrink: 0 }} />
          <span style={{ flex: 1, lineHeight: '1.4' }}>{syncNotification}</span>
          <button
            onClick={dismissSyncNotification}
            style={{ color: '#94a3b8', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Viewport */}
      {activeView === 'LANDING' ? (
        <LandingPage
          onStartKiosk={() => setActiveView('KIOSK')}
          onOpenDoctor={() => setActiveView('DOCTOR')}
          onOpenLogin={() => setActiveView('LOGIN')}
          onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
          onOpenAudit={() => setIsAuditModalOpen(true)}
        />
      ) : activeView === 'KIOSK' ? (
        <KioskView
          onSessionFinished={addPatientSession}
          onNavigateToDoctor={(patientId) => {
            selectPatient(patientId);
            setActiveView('DOCTOR');
          }}
        />
      ) : activeView === 'DOCTOR' ? (
        <DoctorDashboard
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelectPatient={selectPatient}
          onUpdateSummary={updateSummary}
          onOpenAuditLog={() => setIsAuditModalOpen(true)}
          onAddPatientSession={addPatientSession}
          onUpdatePatientItem={updatePatientItem}
        />
      ) : (
        <DualDeviceSimulator
          onOpenAuditLog={() => setIsAuditModalOpen(true)}
        />
      )}

      {/* Modals */}
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ClinicalProvider>
      <AppContent />
    </ClinicalProvider>
  );
};

export default App;

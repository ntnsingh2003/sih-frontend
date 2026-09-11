import React, { useEffect, useState } from 'react';
import { ShieldAlert, RefreshCw, LogOut } from 'lucide-react';
import { SupportedLanguage } from '../../types/clinical';

interface Props {
  isOpen: boolean;
  remainingSeconds: number;
  lang: SupportedLanguage;
  onStay: () => void;
  onPurge: () => void;
}

export const InactivityPurgeModal: React.FC<Props> = ({
  isOpen,
  remainingSeconds,
  lang,
  onStay,
  onPurge
}) => {
  if (!isOpen) return null;

  const isHindi = lang === 'hi';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '560px',
        width: '100%',
        padding: '2.5rem',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 35px rgba(225, 29, 72, 0.3)',
        border: '2px solid var(--color-danger-500)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Countdown Progress Bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #f43f5e 0%, #e11d48 100%)',
          width: `${(remainingSeconds / 15) * 100}%`,
          transition: 'width 1s linear'
        }} />

        {/* Icon & Shield Badge */}
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
          color: '#e11d48',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          boxShadow: '0 0 24px rgba(225, 29, 72, 0.25)'
        }}>
          <ShieldAlert size={36} />
        </div>

        {/* DPDP Act Compliance Pill */}
        <span style={{
          background: 'rgba(225, 29, 72, 0.1)',
          color: '#be123c',
          border: '1px solid rgba(225, 29, 72, 0.3)',
          fontSize: '0.76rem',
          fontFamily: 'var(--font-family-mono)',
          fontWeight: 800,
          padding: '0.2rem 0.75rem',
          borderRadius: '9999px',
          letterSpacing: '0.04em'
        }}>
          DPDP ACT 2023 • HEALTH DATA PRIVACY SAFEGUARD
        </span>

        {/* Title */}
        <h2 style={{
          fontSize: '1.85rem',
          fontWeight: 800,
          color: '#0f172a',
          marginTop: '1.25rem',
          marginBottom: '0.75rem',
          letterSpacing: '-0.03em',
          fontFamily: 'var(--font-family-display)'
        }}>
          {isHindi ? 'क्या आप स्क्रीन पर हैं?' : 'Are You Still There?'}
        </h2>

        {/* Explanation */}
        <p style={{
          fontSize: '1.05rem',
          color: '#475569',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          {isHindi
            ? `आपकी स्वास्थ्य जानकारी की सुरक्षा के लिए, यह कियोस्क सत्र ${remainingSeconds} सेकंड में स्वतः साफ़ (Purge) कर दिया जाएगा।`
            : `To protect your confidential medical records from subsequent patients, this active session will automatically purge in ${remainingSeconds} seconds.`}
        </p>

        {/* Big Countdown Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '2.5rem',
          fontWeight: 900,
          fontFamily: 'var(--font-family-mono)',
          color: '#e11d48',
          background: '#fff1f2',
          border: '1.5px solid #fecdd3',
          padding: '0.4rem 1.8rem',
          borderRadius: '16px',
          marginBottom: '2rem'
        }}>
          <span>00:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onStay}
            style={{
              flex: 1,
              minWidth: '200px',
              background: 'linear-gradient(135deg, #00f5a0 0%, #00e5ff 100%)',
              color: '#03141a',
              fontFamily: 'var(--font-family-display)',
              fontWeight: 800,
              fontSize: '1.1rem',
              padding: '1.1rem 1.8rem',
              borderRadius: '14px',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              boxShadow: '0 0 30px rgba(0, 245, 160, 0.4)'
            }}
          >
            <RefreshCw size={20} />
            <span>{isHindi ? 'हाँ, मैं यहीं हूँ' : "Yes, I'm Still Here"}</span>
          </button>

          <button
            onClick={onPurge}
            style={{
              background: '#f1f5f9',
              color: '#475569',
              fontFamily: 'var(--font-family-display)',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '1.1rem 1.6rem',
              borderRadius: '14px',
              border: '1.5px solid #cbd5e1',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <LogOut size={18} />
            <span>{isHindi ? 'सत्र समाप्त करें' : 'Purge & Exit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

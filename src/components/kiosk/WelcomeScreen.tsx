import React, { useEffect } from 'react';
import { SupportedLanguage } from '../../types/clinical';
import { ArrowRight, Volume2, Globe2, ShieldCheck, Sparkles, Activity } from 'lucide-react';
import { speechService } from '../../services/speechService';

interface Props {
  lang: SupportedLanguage;
  onStart: () => void;
  audioEnabled: boolean;
}

export const WelcomeScreen: React.FC<Props> = ({ lang, onStart, audioEnabled }) => {
  useEffect(() => {
    if (audioEnabled) {
      const msg = lang === 'hi'
        ? 'मेडीकिओस्क में आपका स्वागत है। शुरू करने के लिए बड़ा हरा बटन दबाएं।'
        : 'Welcome to MediKiosk clinical intake. Tap the start button to begin.';
      speechService.speak(msg, lang);
    }
  }, [lang, audioEnabled]);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', padding: '2rem 1rem' }}>
      {/* Prestige Department Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.8) 0%, rgba(220, 252, 231, 0.6) 100%)',
        padding: '0.45rem 1.4rem',
        borderRadius: '9999px',
        color: '#064e3b',
        fontWeight: 700,
        fontSize: '0.9rem',
        marginBottom: '1.75rem',
        border: '1px solid rgba(187, 247, 208, 0.8)',
        boxShadow: '0 2px 8px rgba(6, 78, 59, 0.04)'
      }}>
        <Activity size={18} color="#059669" />
        <span>Executive Clinical Triage & Automated Intake</span>
      </div>

      <h1 style={{
        fontSize: '3.6rem',
        lineHeight: '1.12',
        marginBottom: '1.25rem',
        letterSpacing: '-0.04em',
        fontFamily: 'var(--font-family-hero)',
        fontWeight: 800,
        color: 'var(--color-text-main)'
      }}>
        Intelligent, Voice-Guided <br />
        <span style={{
          background: 'linear-gradient(135deg, #047857 0%, #059669 40%, #0284c7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Clinical OPD Intake
        </span>
      </h1>

      <p style={{
        fontSize: '1.25rem',
        color: 'var(--color-text-muted)',
        maxWidth: '680px',
        margin: '0 auto 2.8rem auto',
        lineHeight: '1.6',
        fontWeight: 400
      }}>
        Seamlessly document your chief complaints, symptoms, and previous prescriptions in your native language. Designed for rapid clinical prioritization.
      </p>

      {/* Massive Luxury Start Button */}
      <div style={{ marginBottom: '3.5rem' }}>
        <button
          onClick={onStart}
          className="kiosk-btn-primary"
          style={{
            fontSize: '1.45rem',
            padding: '1.35rem 3.8rem',
            borderRadius: '9999px',
            boxShadow: 'var(--shadow-aurora-glow), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
          }}
        >
          <span>START INTAKE / शुरू करें</span>
          <ArrowRight size={28} strokeWidth={2.5} />
        </button>
      </div>

      {/* Luxury Feature Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', textAlign: 'left' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(226, 232, 240, 0.9)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          gap: '1.1rem',
          alignItems: 'center',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--color-brand-50) 0%, var(--color-brand-100) 100%)',
            color: 'var(--color-brand-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid var(--color-brand-200)'
          }}>
            <Volume2 size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-main)' }}>Voice & Audio Guided</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>Designed for elderly & low-literacy citizens</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(226, 232, 240, 0.9)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          gap: '1.1rem',
          alignItems: 'center',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--color-accent-50) 0%, var(--color-accent-100) 100%)',
            color: 'var(--color-accent-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid rgba(204, 251, 241, 0.8)'
          }}>
            <Globe2 size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-main)' }}>Multilingual Indic Engine</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>Native Hindi, English & Regional Dialects</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(226, 232, 240, 0.9)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          gap: '1.1rem',
          alignItems: 'center',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
            color: '#e11d48',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid #fecdd3'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-main)' }}>Deterministic Triage</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>Instant emergency red-flag safety routing</div>
          </div>
        </div>
      </div>
    </div>
  );
};

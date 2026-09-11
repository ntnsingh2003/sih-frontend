import React, { useState, useEffect } from 'react';
import { SupportedLanguage } from '../../types/clinical';
import { ShieldCheck, Volume2, CheckCircle2, FileText, Bot, Camera } from 'lucide-react';
import { speechService } from '../../services/speechService';

interface Props {
  patientName: string;
  lang: SupportedLanguage;
  audioEnabled: boolean;
  onConsentGranted: () => void;
}

export const ConsentScreen: React.FC<Props> = ({ patientName, lang, audioEnabled, onConsentGranted }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [consentClinical, setConsentClinical] = useState(true);
  const [consentAI, setConsentAI] = useState(true);
  const [consentOCR, setConsentOCR] = useState(true);

  const consentExplanationEn = `Hello ${patientName}. MediKiosk uses digital voice and touch to prepare your clinical summary for the doctor. Your personal health information is kept confidential and strictly under clinical privilege. Do you consent to proceed?`;
  const consentExplanationHi = `नमस्ते ${patientName}। मेडीकिओस्क आपके डॉक्टर के लिए आपकी बीमारी का संक्षिप्त विवरण तैयार करने हेतु आवाज और टच का उपयोग करता है। आपकी जानकारी पूर्णतः सुरक्षित और गोपनीय है। क्या आप सहमत हैं?`;

  const playAudio = () => {
    setIsPlayingAudio(true);
    const text = lang === 'hi' ? consentExplanationHi : consentExplanationEn;
    speechService.speak(text, lang, () => {
      setIsPlayingAudio(false);
    });
  };

  useEffect(() => {
    if (audioEnabled) {
      playAudio();
    }
    return () => {
      speechService.stopSpeaking();
    };
  }, []);

  const allConsented = consentClinical && consentAI && consentOCR;

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.65rem',
          background: 'linear-gradient(135deg, var(--color-brand-50) 0%, #dcfce7 100%)',
          padding: '0.45rem 1.3rem',
          borderRadius: '9999px',
          color: 'var(--color-brand-800)',
          fontWeight: 700,
          fontSize: '0.9rem',
          marginBottom: '0.85rem',
          border: '1px solid rgba(187, 247, 208, 0.8)'
        }}>
          <ShieldCheck size={18} color="var(--color-brand-600)" />
          <span>Step 2: Informed Consent & Data Privacy (DPDP Act 2023)</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
          {lang === 'hi' ? 'रोगी सहमति एवं डेटा सुरक्षा' : 'Patient Informed Consent & Privacy'}
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
          {lang === 'hi'
            ? 'अपनी सुविधा अनुसार ऑडियो सुनें और सहमति स्वीकार करें।'
            : 'Listen to the audio explanation and grant consent for your clinical intake.'}
        </p>
      </div>

      {/* Audio Guidance Bar */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.9) 0%, rgba(204, 251, 241, 0.7) 100%)',
        border: '1.5px solid rgba(187, 247, 208, 0.9)',
        borderRadius: 'var(--radius-md)',
        padding: '1.4rem 1.6rem',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'var(--color-brand-600)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
          }}>
            <Volume2 size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.08rem', color: 'var(--color-brand-950)' }}>
              {lang === 'hi' ? 'ऑडियो सहमति स्पष्टीकरण' : 'Audio Consent Explanation'}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
              {lang === 'hi' ? 'कम साक्षरता व बुजुर्ग मरीजों के लिए सुलभ' : 'Engineered for low-literacy and elderly patients'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={playAudio}
          style={{
            background: isPlayingAudio ? 'var(--color-brand-600)' : '#ffffff',
            color: isPlayingAudio ? '#ffffff' : 'var(--color-brand-800)',
            border: '1.5px solid var(--color-brand-600)',
            borderRadius: '9999px',
            padding: '0.65rem 1.4rem',
            fontWeight: 700,
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <Volume2 size={17} />
          {isPlayingAudio ? (lang === 'hi' ? 'बोल रहा है...' : 'Speaking...') : (lang === 'hi' ? 'पुनः सुनें' : 'Play Explanation')}
        </button>
      </div>

      {/* Granular Consents */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.25rem' }}>
        <label style={{
          background: '#ffffff',
          border: consentClinical ? '2px solid var(--color-brand-600)' : '1.5px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '1.35rem 1.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.2rem',
          cursor: 'pointer',
          boxShadow: consentClinical ? '0 4px 16px -2px rgba(5, 150, 105, 0.1)' : 'var(--shadow-xs)',
          transition: 'all 0.16s ease'
        }}>
          <input
            type="checkbox"
            checked={consentClinical}
            onChange={(e) => setConsentClinical(e.target.checked)}
            style={{ width: '22px', height: '22px', accentColor: 'var(--color-brand-600)', cursor: 'pointer' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--color-brand-600)" />
              Clinical Intake & History Documentation
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Permit recording of chief complaints, symptoms, and medical history to present to the attending doctor.
            </div>
          </div>
        </label>

        <label style={{
          background: '#ffffff',
          border: consentAI ? '2px solid var(--color-brand-600)' : '1.5px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '1.35rem 1.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.2rem',
          cursor: 'pointer',
          boxShadow: consentAI ? '0 4px 16px -2px rgba(5, 150, 105, 0.1)' : 'var(--shadow-xs)',
          transition: 'all 0.16s ease'
        }}>
          <input
            type="checkbox"
            checked={consentAI}
            onChange={(e) => setConsentAI(e.target.checked)}
            style={{ width: '22px', height: '22px', accentColor: 'var(--color-brand-600)', cursor: 'pointer' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={18} color="var(--color-brand-600)" />
              AI Clinical Structuring & Triage Alert Generation
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Authorize AI natural language processing to formulate structured summaries and trigger safety alerts.
            </div>
          </div>
        </label>

        <label style={{
          background: '#ffffff',
          border: consentOCR ? '2px solid var(--color-brand-600)' : '1.5px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '1.35rem 1.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.2rem',
          cursor: 'pointer',
          boxShadow: consentOCR ? '0 4px 16px -2px rgba(5, 150, 105, 0.1)' : 'var(--shadow-xs)',
          transition: 'all 0.16s ease'
        }}>
          <input
            type="checkbox"
            checked={consentOCR}
            onChange={(e) => setConsentOCR(e.target.checked)}
            style={{ width: '22px', height: '22px', accentColor: 'var(--color-brand-600)', cursor: 'pointer' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera size={18} color="var(--color-brand-600)" />
              Prescription & Diagnostic Document OCR
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Permit optical character scanning and text extraction from past medical papers, prescriptions, and lab tests.
            </div>
          </div>
        </label>
      </div>

      <button
        type="button"
        disabled={!allConsented}
        onClick={onConsentGranted}
        className="kiosk-btn-primary"
        style={{ width: '100%', opacity: allConsented ? 1 : 0.6 }}
      >
        <CheckCircle2 size={24} />
        <span>I Agree & Give Consent / मैं सहमत हूँ (शुरू करें)</span>
      </button>
    </div>
  );
};

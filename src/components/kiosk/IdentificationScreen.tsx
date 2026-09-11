import React, { useState } from 'react';
import { Patient, IntakeMode, SupportedLanguage } from '../../types/clinical';
import { UserCheck, QrCode, CreditCard, Sparkles, Stethoscope, Flower2, Camera, CheckCircle2, ScanLine } from 'lucide-react';
import { speechService } from '../../services/speechService';

interface Props {
  lang: SupportedLanguage;
  onIdentify: (patient: Patient, mode: IntakeMode) => void;
  audioEnabled: boolean;
}

export const IdentificationScreen: React.FC<Props> = ({ lang, onIdentify, audioEnabled }) => {
  const [tab, setTab] = useState<'ABHA' | 'HOSPITAL_ID' | 'SCAN_CARD'>('ABHA');
  const [mode, setMode] = useState<IntakeMode>('ALLOPATHY');
  const [name, setName] = useState('Rajesh Kumar');
  const [phone, setPhone] = useState('9876543210');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [dob, setDob] = useState('1972-06-15');
  const [identifierValue, setIdentifierValue] = useState('91-4821-9943-1284@abdm');
  const [isCameraScanning, setIsCameraScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient: Patient = {
      id: `pat-${Date.now()}`,
      hospitalPatientId: tab === 'HOSPITAL_ID' ? identifierValue : `MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      abhaReference: tab === 'ABHA' || tab === 'SCAN_CARD' ? identifierValue : undefined,
      name,
      phone,
      gender,
      dateOfBirth: dob,
      preferredLanguage: lang,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (audioEnabled) {
      const msg = lang === 'hi'
        ? `नमस्ते ${name}, आपकी पहचान सत्यापित हो गई है।`
        : `Welcome ${name}. Your identity has been verified.`;
      speechService.speak(msg, lang);
    }

    onIdentify(patient, mode);
  };

  const loadDemoScenario = (scenarioNum: number) => {
    if (scenarioNum === 1) {
      // Scenario 1: Acute Chest Pain / Cardiac Red-Flag
      setName('Rajesh Kumar');
      setGender('MALE');
      setDob('1968-05-14');
      setPhone('9811044219');
      setIdentifierValue('91-4821-9943-1284@abdm');
      setMode('ALLOPATHY');
    } else if (scenarioNum === 2) {
      // Scenario 2: High Febrile Illness / Yellow-Flag Sepsis
      setName('Sunita Devi Sharma');
      setGender('FEMALE');
      setDob('1977-11-20');
      setPhone('9415078201');
      setIdentifierValue('MRN-2026-0914');
      setMode('ALLOPATHY');
    } else if (scenarioNum === 3) {
      // Scenario 3: AYUSH Dashavidha Pariksha
      setName('Anand Gopal Joshi');
      setGender('MALE');
      setDob('1984-08-14');
      setPhone('9823019382');
      setIdentifierValue('91-7721-0023-8831@abdm');
      setMode('AYUSH');
    } else {
      // Scenario 4: Chronic Diabetic Lab Followup
      setName('Meenakshi Sundaram');
      setGender('FEMALE');
      setDob('1964-02-18');
      setPhone('9840134902');
      setIdentifierValue('91-5512-4091-8812@abdm');
      setMode('ALLOPATHY');
    }
  };

  const simulateCameraScan = () => {
    setIsCameraScanning(true);
    setScanSuccess(false);
    setTimeout(() => {
      setName('Dr. Vikramaditya Rao');
      setGender('MALE');
      setDob('1980-03-22');
      setIdentifierValue('91-9921-5501-4492@abdm');
      setPhone('9988776655');
      setIsCameraScanning(false);
      setScanSuccess(true);
    }, 1800);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'var(--color-brand-50)', padding: '0.45rem 1.2rem', borderRadius: 'var(--kiosk-radius-full)', color: 'var(--color-brand-700)', fontWeight: 600, marginBottom: '0.75rem' }}>
          <UserCheck size={20} />
          <span>Step 1: Patient Identification / पहचान</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          {lang === 'hi' ? 'रोगी पहचान एवं परामर्श पद्धति' : 'Patient Verification & Consultation Mode'}
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
          {lang === 'hi'
            ? 'अपनी आभा (ABHA) आईडी, बारकोड स्कैन करें या नीचे दिए गए डेमो परिदृश्य चुनें।'
            : 'Enter your ABHA Health ID, scan your card, or choose a jury test scenario.'}
        </p>
      </div>

      {/* 1-Click Live Demo Scenario Launcher for SIH Evaluators */}
      <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, var(--color-brand-50) 100%)', border: '1.5px solid var(--color-brand-500)', borderRadius: 'var(--kiosk-radius-md)', padding: '0.9rem 1.25rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-brand-700)' }}>
            <Sparkles size={18} color="var(--color-brand-600)" />
            SIH Jury Demo Launcher (1-Click Presets):
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', fontWeight: 600 }}>Click any case to autofill</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
          <button type="button" onClick={() => loadDemoScenario(1)} style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem', borderRadius: '8px', background: '#fff', border: '1.5px solid #dc2626', color: '#991b1b', fontWeight: 700, textAlign: 'left' }}>
            ❤️ Case 1: Cardiac (Red Flag)
          </button>
          <button type="button" onClick={() => loadDemoScenario(2)} style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem', borderRadius: '8px', background: '#fff', border: '1.5px solid #d97706', color: '#92400e', fontWeight: 700, textAlign: 'left' }}>
            🌡️ Case 2: High Fever (Sepsis)
          </button>
          <button type="button" onClick={() => loadDemoScenario(3)} style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem', borderRadius: '8px', background: '#fff', border: '1.5px solid #059669', color: '#047857', fontWeight: 700, textAlign: 'left' }}>
            🌿 Case 3: AYUSH Dashavidha
          </button>
          <button type="button" onClick={() => loadDemoScenario(4)} style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem', borderRadius: '8px', background: '#fff', border: '1.5px solid #0284c7', color: '#0369a1', fontWeight: 700, textAlign: 'left' }}>
            🔬 Case 4: Diabetic Lab OCR
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#ffffff', border: '2px solid var(--color-border)', borderRadius: 'var(--kiosk-radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-card)' }}>
        {/* Mode Selector: Allopathy vs AYUSH */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label style={{ display: 'block', fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>
            Select Consultation Department / चिकित्सा पद्धति चुनें:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => setMode('ALLOPATHY')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem',
                borderRadius: 'var(--kiosk-radius-md)',
                border: mode === 'ALLOPATHY' ? '3px solid var(--color-brand-600)' : '2px solid var(--color-border)',
                background: mode === 'ALLOPATHY' ? 'var(--color-brand-50)' : '#ffffff',
                textAlign: 'left'
              }}
            >
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: mode === 'ALLOPATHY' ? 'var(--color-brand-600)' : 'var(--color-bg-card-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mode === 'ALLOPATHY' ? '#fff' : 'var(--color-text-muted)' }}>
                <Stethoscope size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Allopathy General OPD</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>Internal Medicine, Acute Triage</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode('AYUSH')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem',
                borderRadius: 'var(--kiosk-radius-md)',
                border: mode === 'AYUSH' ? '3px solid var(--color-brand-600)' : '2px solid var(--color-border)',
                background: mode === 'AYUSH' ? 'var(--color-brand-50)' : '#ffffff',
                textAlign: 'left'
              }}
            >
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: mode === 'AYUSH' ? 'var(--color-brand-600)' : 'var(--color-bg-card-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mode === 'AYUSH' ? '#fff' : 'var(--color-text-muted)' }}>
                <Flower2 size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>AYUSH / Ayurveda Mode</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>Dashavidha & Ashtavidha Pariksha</div>
              </div>
            </button>
          </div>
        </div>

        {/* Identification Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setTab('ABHA')}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: tab === 'ABHA' ? 'var(--color-brand-600)' : 'transparent',
              color: tab === 'ABHA' ? '#ffffff' : 'var(--color-text-muted)'
            }}
          >
            <QrCode size={17} />
            ABDM / ABHA ID
          </button>

          <button
            type="button"
            onClick={() => setTab('SCAN_CARD')}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: tab === 'SCAN_CARD' ? 'var(--color-brand-600)' : 'transparent',
              color: tab === 'SCAN_CARD' ? '#ffffff' : 'var(--color-text-muted)'
            }}
          >
            <Camera size={17} />
            Scan ABHA Card / QR Camera
          </button>

          <button
            type="button"
            onClick={() => setTab('HOSPITAL_ID')}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: tab === 'HOSPITAL_ID' ? 'var(--color-brand-600)' : 'transparent',
              color: tab === 'HOSPITAL_ID' ? '#ffffff' : 'var(--color-text-muted)'
            }}
          >
            <CreditCard size={17} />
            Hospital MRN Number
          </button>
        </div>

        {/* Scan Card Camera Simulator */}
        {tab === 'SCAN_CARD' && (
          <div style={{ background: '#f8fafc', border: '2px dashed var(--color-brand-600)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', width: '220px', height: '140px', margin: '0 auto 1rem auto', background: '#0f172a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', overflow: 'hidden' }}>
              <ScanLine size={48} className={isCameraScanning ? 'animate-pulse' : ''} color={scanSuccess ? '#10b981' : '#38bdf8'} />
              {isCameraScanning && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: '#ef4444', animation: 'micPulse 1s infinite' }} />
              )}
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {isCameraScanning ? 'Scanning Card QR Code via Optical Lens...' : scanSuccess ? '✅ ABHA Card Scanned & Verified Successfully!' : 'Hold your ABHA Card or Ayushman PMJAY Card in front of camera'}
            </div>
            <button
              type="button"
              disabled={isCameraScanning}
              onClick={simulateCameraScan}
              className="kiosk-btn-secondary"
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', minHeight: 'auto' }}
            >
              <Camera size={18} />
              <span>Simulate Live Camera Scan</span>
            </button>
          </div>
        )}

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              {tab === 'HOSPITAL_ID' ? 'Hospital MRN / Registration Number' : 'ABHA Address / Number (Mock ABDM Gateway)'}
            </label>
            <input
              type="text"
              required
              value={identifierValue}
              onChange={(e) => setIdentifierValue(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1.2rem',
                borderRadius: 'var(--kiosk-radius-md)',
                border: '2px solid var(--color-border)',
                fontSize: '1.1rem',
                fontFamily: 'inherit',
                fontWeight: 600
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              Patient Full Name / पूरा नाम
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1.2rem',
                borderRadius: 'var(--kiosk-radius-md)',
                border: '2px solid var(--color-border)',
                fontSize: '1.1rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              Mobile Phone / फोन नंबर
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1.2rem',
                borderRadius: 'var(--kiosk-radius-md)',
                border: '2px solid var(--color-border)',
                fontSize: '1.1rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              Gender / लिंग
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              style={{
                width: '100%',
                padding: '0.9rem 1.2rem',
                borderRadius: 'var(--kiosk-radius-md)',
                border: '2px solid var(--color-border)',
                fontSize: '1.1rem',
                fontFamily: 'inherit',
                background: '#fff'
              }}
            >
              <option value="MALE">Male (पुरुष)</option>
              <option value="FEMALE">Female (महिला)</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              Date of Birth / जन्म तिथि
            </label>
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1.2rem',
                borderRadius: 'var(--kiosk-radius-md)',
                border: '2px solid var(--color-border)',
                fontSize: '1.1rem',
                fontFamily: 'inherit',
                background: '#fff'
              }}
            />
          </div>
        </div>

        <button type="submit" className="kiosk-btn-primary" style={{ width: '100%' }}>
          <span>Confirm & Proceed to Consent / सहमति पर आगे बढ़ें</span>
        </button>
      </form>
    </div>
  );
};

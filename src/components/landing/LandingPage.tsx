import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  Sparkles,
  Zap,
  Globe2,
  Stethoscope,
  HeartPulse,
  Cpu,
  Layers,
  CheckCircle2,
  Lock,
  Hospital,
  TrendingDown,
  FileCode2,
  FileCheck,
  LogIn
} from 'lucide-react';

interface Props {
  onStartKiosk: () => void;
  onOpenDoctor: () => void;
  onOpenLogin: () => void;
  onOpenArchitecture: () => void;
  onOpenAudit: () => void;
}

export const LandingPage: React.FC<Props> = ({
  onStartKiosk,
  onOpenDoctor,
  onOpenLogin,
  onOpenArchitecture,
  onOpenAudit
}) => {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(240, 253, 250, 0.84) 50%, rgba(241, 245, 249, 0.90) 100%), url('/hospital_bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#0f172a',
      overflowX: 'hidden'
    }}>
      
      {/* Subtle Floating Ambient Glowing Orbs */}
      <div style={{
        position: 'absolute',
        top: '8%',
        left: '10%',
        width: '360px',
        height: '360px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '8%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.14) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      {/* 1. LUXURY HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '5.5rem 2rem 4.5rem 2rem',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          
          {/* Prestige Pill Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1.5px solid #a7f3d0',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            padding: '0.45rem 1.4rem',
            borderRadius: '9999px',
            marginBottom: '2.2rem',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 10px #10b981' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.06em', color: '#065f46', textTransform: 'uppercase', fontFamily: 'var(--font-family-mono)' }}>
              Next-Gen Autonomous Clinical Intake Platform
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 style={{
            fontSize: 'clamp(2.8rem, 5.8vw, 5rem)',
            lineHeight: '1.08',
            letterSpacing: '-0.04em',
            fontWeight: 800,
            marginBottom: '1.85rem',
            fontFamily: 'var(--font-family-hero)',
            color: '#0f172a'
          }}>
            <span>
              Engineered for Precision.
            </span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #059669 0%, #0284c7 50%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Built for Every Indian Citizen.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1.15rem, 2vw, 1.35rem)',
            color: '#475569',
            maxWidth: '820px',
            margin: '0 auto 3.2rem auto',
            lineHeight: '1.68',
            fontWeight: 400,
            fontFamily: 'var(--font-family-body)'
          }}>
            MediKiosk collapses lengthy hospital queues from 35 minutes to under 3 minutes through voice-first multilingual intake, real-time deterministic triage, paper prescription OCR, and HL7 FHIR interoperability.
          </p>

          {/* Action CTAs: Only Login Option */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '4.8rem' }}>
            <button
              onClick={onOpenLogin}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
                color: '#ffffff',
                fontFamily: 'var(--font-family-display)',
                fontWeight: 800,
                fontSize: '1.18rem',
                letterSpacing: '-0.02em',
                padding: '1.15rem 3rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.85rem',
                boxShadow: '0 8px 30px rgba(5, 150, 105, 0.4), 0 4px 15px rgba(2, 132, 199, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer'
              }}
            >
              <LogIn size={22} color="#ffffff" />
              <span>Sign In / Login</span>
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Floating Live Product Mockup Frame (Light Luxury Glassmorphic) */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.94)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.12), 0 0 35px rgba(16, 185, 129, 0.08)',
            maxWidth: '960px',
            margin: '0 auto',
            textAlign: 'left',
            position: 'relative',
            backdropFilter: 'blur(24px)'
          }}>
            {/* Window Top Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f43f5e' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fbbf24' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', fontFamily: 'var(--font-family-mono)', color: '#64748b', fontWeight: 600 }}>
                  medikiosk.clinical.internal // v1.0.0-PROD
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <span style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', fontSize: '0.75rem', padding: '0.2rem 0.65rem', borderRadius: '6px', fontWeight: 700, fontFamily: 'var(--font-family-mono)' }}>
                  ● ABDM M1/M2/M3 Sandbox Connected
                </span>
              </div>
            </div>

            {/* Interactive Preview Content */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.4rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
                <div style={{ color: '#059669', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-family-mono)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                  ACTIVE INTAKE SESSION
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem', fontFamily: 'var(--font-family-display)' }}>
                  Rajesh Kumar (54Y, M)
                </div>
                <div style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1rem' }}>
                  ABHA: 91-4821-9943-1284 • Token: TK-296
                </div>
                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', padding: '0.75rem', color: '#be123c', fontSize: '0.85rem', fontWeight: 700 }}>
                  ⚠️ PRIORITY RED: Acute Retrosternal Pressure radiating to Left Arm. Directed to Resuscitation Bay 104.
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.4rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
                <div style={{ color: '#0284c7', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-family-mono)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                  OCR ENTITY ENGINE
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'var(--font-family-display)' }}>
                  Extracted from Scanned Prescription
                </div>
                <div style={{ fontSize: '0.84rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div>💊 <strong>Telmisartan 40mg</strong> (OD Morning)</div>
                  <div>💊 <strong>Metformin 500mg</strong> (BD with meals)</div>
                  <div>🔬 <strong>HbA1c 8.6%</strong> <span style={{ color: '#dc2626', fontWeight: 800 }}>[ABNORMAL HIGH]</span></div>
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
                <div>
                  <div style={{ color: '#7c3aed', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-family-mono)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                    STANDARDS COMPLIANCE
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.6' }}>
                    HL7 FHIR R4 Bundle ready with Condition, Observation, and MedicationStatement resources.
                  </div>
                </div>
                <button
                  onClick={onStartKiosk}
                  style={{
                    background: '#f0fdf4',
                    color: '#065f46',
                    border: '1.5px solid #10b981',
                    borderRadius: '8px',
                    padding: '0.65rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    marginTop: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  Test Intake Live →
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. ENTERPRISE METRICS STRIP */}
      <section style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
        padding: '3.2rem 2rem'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '3.4rem', fontWeight: 900, fontFamily: 'var(--font-family-display)', color: '#059669', letterSpacing: '-0.04em' }}>
              93%
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
              Intake Time Reduction
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>From 35m paper queues to 2.4m</div>
          </div>

          <div>
            <div style={{ fontSize: '3.4rem', fontWeight: 900, fontFamily: 'var(--font-family-display)', color: '#0284c7', letterSpacing: '-0.04em' }}>
              6+
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
              Indic Languages Supported
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Hindi, English, Bengali, Tamil, Telugu, Marathi</div>
          </div>

          <div>
            <div style={{ fontSize: '3.4rem', fontWeight: 900, fontFamily: 'var(--font-family-display)', color: '#e11d48', letterSpacing: '-0.04em' }}>
              0%
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
              Unattended Red Flags
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Deterministic cardiac & sepsis rules</div>
          </div>

          <div>
            <div style={{ fontSize: '3.4rem', fontWeight: 900, fontFamily: 'var(--font-family-display)', color: '#d97706', letterSpacing: '-0.04em' }}>
              &lt; 3.5m
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
              Hospital ROI Payback
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Saves ₹6.6L/year in staffing costs</div>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID ARCHITECTURE */}
      <section style={{ padding: '5.5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', fontFamily: 'var(--font-family-mono)', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            System Capabilities
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', color: '#0f172a', letterSpacing: '-0.03em', fontWeight: 800, fontFamily: 'var(--font-family-hero)' }}>
            Engineered to Replace Unstructured Chaos
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
          
          {/* Bento Cell 1: Multilingual Voice First */}
          <div style={{
            gridColumn: 'span 7',
            background: 'rgba(255, 255, 255, 0.94)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            borderRadius: '24px',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 15px 35px -5px rgba(15, 23, 42, 0.08)',
            backdropFilter: 'blur(20px)'
          }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid #a7f3d0' }}>
                <Globe2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.65rem', color: '#0f172a', marginBottom: '0.75rem', fontWeight: 800 }}>
                Acoustic Indic Speech Recognition
              </h3>
              <p style={{ color: '#475569', lineHeight: '1.65', fontSize: '1.05rem' }}>
                Tailored for noisy Indian hospital lobbies (75 dB) using dual-MEMS directional beamforming. Elderly and illiterate citizens can simply speak in Hindi, Bengali, or English without touching a keyboard.
              </p>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ background: '#f1f5f9', padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>English (India)</span>
              <span style={{ background: '#f1f5f9', padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>हिन्दी (Hindi)</span>
              <span style={{ background: '#f1f5f9', padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>Touch-Tap Fallback</span>
            </div>
          </div>

          {/* Bento Cell 2: AYUSH Dashavidha Pariksha */}
          <div style={{
            gridColumn: 'span 5',
            background: 'rgba(255, 255, 255, 0.94)',
            border: '1.5px solid #a7f3d0',
            borderRadius: '24px',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 15px 35px -5px rgba(16, 185, 129, 0.1)',
            backdropFilter: 'blur(20px)'
          }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid #a7f3d0' }}>
                <Activity size={24} />
              </div>
              <h3 style={{ fontSize: '1.65rem', color: '#0f172a', marginBottom: '0.75rem', fontWeight: 800 }}>
                AYUSH & Ayurveda Mode
              </h3>
              <p style={{ color: '#475569', lineHeight: '1.65', fontSize: '1.02rem' }}>
                First-ever digital intake standardizing the classical <strong>Dashavidha Pariksha</strong> framework: Prakriti doshas, Agni digestive fire, Koshtha, and Vyayama stamina.
              </p>
            </div>
            <div style={{ marginTop: '1.5rem', color: '#059669', fontSize: '0.85rem', fontWeight: 800 }}>
              ✓ Complete clinical schema isolation
            </div>
          </div>

          {/* Bento Cell 3: Deterministic Red-Flag Triage */}
          <div style={{
            gridColumn: 'span 5',
            background: 'rgba(255, 255, 255, 0.94)',
            border: '1.5px solid #fecdd3',
            borderRadius: '24px',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 15px 35px -5px rgba(244, 63, 94, 0.08)',
            backdropFilter: 'blur(20px)'
          }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid #fecdd3' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.65rem', color: '#0f172a', marginBottom: '0.75rem', fontWeight: 800 }}>
                Zero-Hallucination Safety
              </h3>
              <p style={{ color: '#475569', lineHeight: '1.65', fontSize: '1.02rem' }}>
                Operates on deterministic rule matrices rather than open-ended generative guessing. Instant red alerts for heart attack and stroke risks.
              </p>
            </div>
            <div style={{ marginTop: '1.5rem', color: '#be123c', fontSize: '0.85rem', fontWeight: 800 }}>
              ✓ 100% Non-autonomous prescription rule
            </div>
          </div>

          {/* Bento Cell 4: Async OCR & Thermal Printing */}
          <div style={{
            gridColumn: 'span 7',
            background: 'rgba(255, 255, 255, 0.94)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            borderRadius: '24px',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 15px 35px -5px rgba(15, 23, 42, 0.08)',
            backdropFilter: 'blur(20px)'
          }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid #bae6fd' }}>
                <FileCode2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.65rem', color: '#0f172a', marginBottom: '0.75rem', fontWeight: 800 }}>
                Document OCR & Thermal Slip Engine
              </h3>
              <p style={{ color: '#475569', lineHeight: '1.65', fontSize: '1.05rem' }}>
                Converts physical prescriptions and CBC/Lipid lab reports into normalized medical entities via async Redis queue. Generates authentic 80mm thermal OPD passes with room routing and ABDM QR codes.
              </p>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ background: '#f1f5f9', padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>80mm ESC/POS Printer</span>
              <span style={{ background: '#f1f5f9', padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>HL7 FHIR R4 Bundle</span>
              <span style={{ background: '#f1f5f9', padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>DPDP Act 2023 Compliant</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. EXECUTIVE CTA BANNER */}
      <section style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        padding: '5.5rem 2rem',
        borderTop: '1px solid #e2e8f0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '1rem', fontFamily: 'var(--font-family-hero)' }}>
            Experience the Future of Indian OPD Intake
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '2.8rem' }}>
            Fully operational prototype tested and ready for deployment across AIIMS, District Civil Hospitals, and rural PHCs.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenLogin}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
                color: '#ffffff',
                fontFamily: 'var(--font-family-display)',
                fontWeight: 800,
                fontSize: '1.15rem',
                padding: '1.15rem 3rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.85rem',
                boxShadow: '0 8px 30px rgba(5, 150, 105, 0.35)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <LogIn size={20} />
              <span>Login to MediKiosk</span>
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. MINIMAL LUXURY FOOTER */}
      <footer style={{
        padding: '2.2rem 2rem',
        borderTop: '1px solid #e2e8f0',
        background: 'rgba(255, 255, 255, 0.95)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.84rem',
        color: '#64748b',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ fontWeight: 500 }}>
          MediKiosk Platform • Smart India Hackathon Prototype • MoHFW & Ministry of Ayush Aligned
        </div>
        <div style={{ display: 'flex', gap: '1.8rem' }}>
          <button onClick={onOpenAudit} style={{ color: '#059669', textDecoration: 'underline', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
            Audit Trail (08)
          </button>
          <button onClick={onOpenArchitecture} style={{ color: '#0284c7', textDecoration: 'underline', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
            Postgres Schema (05)
          </button>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;

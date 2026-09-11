import React, { useState, useEffect } from 'react';
import { useClinical, playArrivalChime } from '../../context/ClinicalContext';
import { 
  Tv, 
  Volume2, 
  VolumeX, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Maximize2,
  Calendar
} from 'lucide-react';

interface ActiveCounter {
  room: string;
  dept: string;
  doctor: string;
  servingToken: string;
  patientName: string;
  status: 'SERVING' | 'NEXT' | 'EMERGENCY';
}

export const QueueDisplayBoard: React.FC = () => {
  const { patients, setActiveView } = useClinical();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<string>('Token A-101 please proceed to Room 104 Cardiology');
  const [flashToken, setFlashToken] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Synthetic or live counters
  const counters: ActiveCounter[] = [
    {
      room: 'Room 104',
      dept: 'Cardiology & Triage',
      doctor: 'Dr. Arun Patel, MD',
      servingToken: patients[0]?.session.tokenNumber || 'A-101',
      patientName: patients[0]?.patient.name || 'Ramesh Verma',
      status: 'SERVING'
    },
    {
      room: 'Room 108',
      dept: 'General Medicine',
      doctor: 'Dr. Sunita Rao, MBBS',
      servingToken: 'M-205',
      patientName: 'Sunita Devi',
      status: 'SERVING'
    },
    {
      room: 'Room 202',
      dept: 'Pediatrics & Neonatal',
      doctor: 'Dr. K. Raghavan, DNB',
      servingToken: 'P-042',
      patientName: 'Master Aarav Kumar',
      status: 'SERVING'
    },
    {
      room: 'Counter 04',
      dept: 'Dispensary & Jan Aushadhi',
      doctor: 'Rajeev Nair, D.Pharm',
      servingToken: 'D-119',
      patientName: 'Mohammed Iqbal',
      status: 'SERVING'
    },
    {
      room: 'Room 312',
      dept: 'AYUSH & Holistic Wellness',
      doctor: 'Vaidya Harishankar Joshi',
      servingToken: 'Y-018',
      patientName: 'Geeta Ramakrishnan',
      status: 'SERVING'
    },
    {
      room: 'Emergency Bay',
      dept: 'Acute Red-Flag Resus',
      doctor: 'Dr. Meera Nambiar',
      servingToken: 'EM-009',
      patientName: 'Deepak Sharma',
      status: 'EMERGENCY'
    }
  ];

  const callTokenAudio = (token: string, room: string, dept: string) => {
    playArrivalChime(false);
    setFlashToken(true);
    setTimeout(() => setFlashToken(false), 2500);

    const announcement = `Token ${token.split('').join(' ')}, please proceed to ${room}, ${dept}`;
    setCurrentAnnouncement(announcement);

    if (speechEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(announcement);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #091e30 0%, #030712 100%)',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem 1.8rem',
      boxSizing: 'border-box'
    }}>
      {/* Top Header Bar for TV Display */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(2, 132, 199, 0.5)'
          }}>
            <Tv size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                AIIMS NEW DELHI • OPD CENTRAL QUEUE DISPLAY
              </span>
              <span style={{
                background: '#dc2626',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <Radio size={10} className="animate-pulse" /> LIVE TV STREAM
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
              ABDM Fast-Track Intake • Multi-Counter Digital Token System
            </div>
          </div>
        </div>

        {/* Controls & Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            style={{
              background: speechEnabled ? 'rgba(0, 245, 160, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: speechEnabled ? '1px solid #00f5a0' : '1px solid rgba(255, 255, 255, 0.2)',
              color: speechEnabled ? '#00f5a0' : '#94a3b8',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{speechEnabled ? 'Voice On' : 'Voice Muted'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.8rem'
            }}
          >
            <Maximize2 size={14} />
            <span>Fullscreen</span>
          </button>

          <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255, 255, 255, 0.15)', paddingLeft: '1.2rem' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'monospace', color: '#38bdf8' }}>
              {currentTime.toLocaleTimeString('en-IN')}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Announcement Flash Banner */}
      <div style={{
        background: flashToken 
          ? 'linear-gradient(90deg, #1e3a8a 0%, #065f46 100%)' 
          : 'linear-gradient(90deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
        border: flashToken ? '2px solid #00f5a0' : '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        padding: '1.1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        boxShadow: flashToken ? '0 0 35px rgba(0, 245, 160, 0.4)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '14px', 
            height: '14px', 
            borderRadius: '50%', 
            background: '#00f5a0', 
            boxShadow: '0 0 10px #00f5a0' 
          }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em', color: '#f8fafc' }}>
            📢 {currentAnnouncement}
          </span>
        </div>

        <button
          onClick={() => callTokenAudio(counters[0].servingToken, counters[0].room, counters[0].dept)}
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '0.55rem 1.25rem',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
          }}
        >
          <Volume2 size={16} />
          <span>Call Current Token</span>
        </button>
      </div>

      {/* Grid of Hospital Counters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {counters.map((c, i) => {
          const isEmergency = c.status === 'EMERGENCY';
          return (
            <div
              key={i}
              onClick={() => callTokenAudio(c.servingToken, c.room, c.dept)}
              style={{
                background: isEmergency 
                  ? 'rgba(153, 27, 27, 0.25)' 
                  : 'rgba(15, 23, 42, 0.75)',
                border: isEmergency 
                  ? '1.5px solid #ef4444' 
                  : '1.5px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isEmergency && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.66rem',
                  fontWeight: 900,
                  padding: '0.2rem 0.6rem',
                  borderBottomLeftRadius: '8px',
                  letterSpacing: '0.05em'
                }}>
                  ACUTE RED FLAG
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
                    {c.room}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {c.dept}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  color: '#94a3b8'
                }}>
                  {c.doctor}
                </div>
              </div>

              {/* Big Token Number */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '12px',
                padding: '0.85rem',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '0.65rem'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Now Serving / अब टोकन
                </div>
                <div style={{
                  fontSize: '2.8rem',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  color: isEmergency ? '#f87171' : '#38bdf8',
                  letterSpacing: '0.04em',
                  lineHeight: 1.1
                }}>
                  {c.servingToken}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#cbd5e1' }}>
                <span>Patient: <strong>{c.patientName}</strong></span>
                <span style={{ color: '#00f5a0', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Volume2 size={12} /> Tap to announce
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Queue Next 5 Patients Preview */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '14px',
        padding: '1rem 1.4rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        marginBottom: '1rem',
        overflowX: 'auto'
      }}>
        <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#94a3b8', whiteSpace: 'nowrap' }}>
          NEXT IN LINE:
        </span>
        {patients.slice(1, 6).map((item, idx) => (
          <div
            key={item.patient.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#38bdf8', fontSize: '0.9rem' }}>
              {item.session.tokenNumber}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#f1f5f9' }}>
              {item.patient.name}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
              (~{(idx + 1) * 6}m)
            </span>
          </div>
        ))}
      </div>

      {/* Scrolling Bottom Advisory Marquee */}
      <footer style={{
        marginTop: 'auto',
        background: 'rgba(0, 0, 0, 0.6)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.65rem 1.5rem',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.82rem',
        color: '#94a3b8'
      }}>
        <div style={{
          background: '#0284c7',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '0.68rem',
          padding: '0.15rem 0.5rem',
          borderRadius: '4px',
          whiteSpace: 'nowrap'
        }}>
          HOSPITAL NOTICE
        </div>
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
          <span>
            Please keep your ABHA QR code and Token slip ready. Wheelchair assistance available at Desk 1. PMBJP Jan Aushadhi generic dispensary open at Counter 04 until 8:00 PM.
          </span>
        </div>
      </footer>
    </div>
  );
};
export default QueueDisplayBoard;

import React, { useEffect, useRef, useState } from 'react';
import { Patient, Session, ClinicalSummary } from '../../types/clinical';
import { PatientQueueItem } from '../../data/mockPatients';
import {
  CheckCircle2,
  MapPin,
  ArrowRight,
  AlertTriangle,
  Printer,
  RotateCcw,
  QrCode,
  Clock,
  Hospital,
  Download,
  Share2,
  MessageCircle,
  Smartphone,
  FileCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService } from '../../services/speechService';
import { exportClinicalSummaryPDF } from '../../services/fhirService';
import { ShareReportModal } from '../common/ShareReportModal';

interface Props {
  patient: Patient;
  session: Session;
  queueItem?: PatientQueueItem;
  onResetKiosk: () => void;
  onOpenDoctorPortal: (patientId: string) => void;
  audioEnabled: boolean;
}

export const KioskCompletionScreen: React.FC<Props> = ({
  patient,
  session,
  queueItem,
  onResetKiosk,
  onOpenDoctorPortal,
  audioEnabled
}) => {
  const isRedFlag = session.triagePriority === 'RED';
  const isYellowFlag = session.triagePriority === 'YELLOW';
  const printSlipRef = useRef<HTMLDivElement>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Safe fallback summary if not passed via queueItem
  const activeSummary: ClinicalSummary = queueItem?.summary || {
    id: `sum-${session.id}`,
    patientId: patient.id,
    sessionId: session.id,
    chiefComplaint: 'Clinical OPD Consultation & Triage',
    hpiNarrative: 'Digital intake completed at MediKiosk smart terminal.',
    pastMedicalSurgical: 'None reported during kiosk intake.',
    drugAndAllergyHistory: 'No known drug allergies reported.',
    familyPersonalHistory: 'Non-contributory.',
    reviewOfSystemsSummary: 'General outpatient assessment.',
    priorInvestigationsSummary: 'No prior investigations attached.',
    isDraft: false,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const activeLabs = queueItem?.labs || [];
  const activeMeds = queueItem?.medications || [];

  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }

    if (audioEnabled) {
      if (isRedFlag) {
        speechService.speak(
          'Emergency priority notice. Please proceed immediately to Emergency Room 104.',
          patient.preferredLanguage
        );
      } else {
        speechService.speak(
          `Intake complete. Your token number is ${session.tokenNumber}. Please download or share your report, then proceed to OPD Counter 3.`,
          patient.preferredLanguage
        );
      }
    }
  }, []);

  const handlePrintSlip = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    exportClinicalSummaryPDF(patient, activeSummary, activeLabs, activeMeds);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const patientAge = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
  const roomLocation = isRedFlag
    ? 'Emergency Resuscitation Bay (Room 104, Ground Floor)'
    : session.mode === 'AYUSH'
    ? 'AYUSH OPD Room 08, 1st Floor'
    : 'Cardiology & General OPD Counter 03, 1st Floor';

  const shareText = `🏥 *AIIMS MediKiosk - Clinical OPD Report*
👤 *Patient:* ${patient.name} (${patientAge}Y / ${patient.gender})
🎫 *Token:* ${session.tokenNumber} | *Priority:* ${session.triagePriority}
📍 *Department:* ${session.mode === 'AYUSH' ? 'AYUSH Ayurveda OPD' : 'General Medicine & Cardiology'}
🏥 *Routed To:* ${roomLocation}
🪪 *ABHA ID:* ${patient.abhaReference || 'ABDM-VERIFIED'}
📋 *Complaint:* ${activeSummary.chiefComplaint}

🔗 *View & Download Verified Record:*
https://medikiosk.abdm.gov.in/records/${patient.id}?token=${session.tokenNumber}`;

  const handleDirectWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center', padding: '1rem 0 3rem 0' }}>
      {/* Priority Alert Banner if Red Flag */}
      {isRedFlag ? (
        <div
          className="red-flag-alert-card"
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--kiosk-radius-lg)',
            marginBottom: '2rem',
            textAlign: 'left',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            background: '#fef2f2',
            border: '2px solid #ef4444'
          }}
        >
          <AlertTriangle size={42} color="#dc2626" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ color: '#991b1b', fontWeight: 800, fontSize: '1.3rem' }}>
              PRIORITY EMERGENCY TRIAGE [RED ALERT] / आपातकालीन प्राथमिकता
            </div>
            <div style={{ color: '#7f1d1d', fontSize: '1rem', fontWeight: 600 }}>
              Due to acute clinical symptoms, you are prioritized for immediate medical attention.
            </div>
            <div style={{ color: '#b91c1c', fontWeight: 700, marginTop: '0.4rem' }}>
              📍 Proceed immediately to: {roomLocation}.
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--color-brand-50, #ecfdf5)',
            color: 'var(--color-brand-600, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}
        >
          <CheckCircle2 size={52} strokeWidth={2.5} />
        </div>
      )}

      <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.5rem', color: '#0f172a' }}>
        {isRedFlag ? 'Emergency Triage Pass Generated' : 'Clinical Intake Complete!'}
      </h1>
      <p style={{ fontSize: '1.15rem', color: '#475569', marginBottom: '1.5rem' }}>
        आपकी पर्ची और रिपोर्ट तैयार है। आप इसे तुरंत <strong>डाउनलोड</strong> कर सकते हैं या <strong>व्हाट्सएप्प</strong> पर पा सकते हैं।
      </p>

      {/* PATIENT DOWNLOAD & SHARE SPOTLIGHT CARD */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
          border: '2px solid #86efac',
          borderRadius: '16px',
          padding: '1.5rem 1.75rem',
          maxWidth: '680px',
          margin: '0 auto 2rem auto',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.15)',
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: '#059669', color: '#ffffff', padding: '0.4rem', borderRadius: '8px' }}>
              <FileCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#064e3b' }}>
                Patient Self-Service / अपनी रिपोर्ट प्राप्त करें
              </div>
              <div style={{ fontSize: '0.85rem', color: '#047857' }}>
                Download official PDF report or share directly to your phone via WhatsApp / SMS
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', background: '#dcfce7', color: '#166534', padding: '0.25rem 0.6rem', borderRadius: '12px', fontWeight: 700, border: '1px solid #86efac' }}>
            ABDM Compliant
          </span>
        </div>

        {/* Big Action Buttons for Patient */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem' }}>
          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            style={{
              padding: '0.9rem 1.1rem',
              borderRadius: '12px',
              border: 'none',
              background: '#059669',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#047857')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}
          >
            {downloadSuccess ? <Check size={20} color="#ffffff" /> : <Download size={20} />}
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div>{downloadSuccess ? 'Downloaded!' : 'Download Report'}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.9 }}>रिपोर्ट डाउनलोड (PDF)</div>
            </div>
          </button>

          {/* Quick WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleDirectWhatsApp}
            style={{
              padding: '0.9rem 1.1rem',
              borderRadius: '12px',
              border: 'none',
              background: '#25D366',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1eb857')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#25D366')}
          >
            <MessageCircle size={20} />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div>Send on WhatsApp</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.9 }}>व्हाट्सएप्प पर भेजें</div>
            </div>
          </button>

          {/* Full Share Options (Modal) */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            style={{
              padding: '0.9rem 1.1rem',
              borderRadius: '12px',
              border: '1.5px solid #0284c7',
              background: '#f0f9ff',
              color: '#0369a1',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.15)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e0f2fe')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f0f9ff')}
          >
            <Share2 size={20} color="#0284c7" />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div>Share Options</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.85 }}>SMS / QR / Link</div>
            </div>
          </button>
        </div>
      </div>

      {/* Authentic Thermal Receipt Simulation Box */}
      <div
        id="printable-token-slip"
        ref={printSlipRef}
        style={{
          background: '#ffffff',
          border: '2px solid #cbd5e1',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '460px',
          margin: '0 auto 2.25rem auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
          textAlign: 'center',
          fontFamily: 'monospace'
        }}
      >
        <div style={{ borderBottom: '2px dashed #94a3b8', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.15rem', fontWeight: 900 }}>
            <Hospital size={22} color="#0284c7" />
            <span>AIIMS APEX HEALTHCARE</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#64748b' }}>MediKiosk Digital OPD Triage Terminal</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Priority Badge */}
        <div style={{ marginBottom: '1rem' }}>
          <span
            style={{
              background: isRedFlag ? '#dc2626' : isYellowFlag ? '#d97706' : '#059669',
              color: '#ffffff',
              padding: '0.35rem 1.2rem',
              borderRadius: '20px',
              fontWeight: 900,
              fontSize: '0.9rem',
              letterSpacing: '0.05em'
            }}
          >
            TRIAGE: {session.triagePriority} PRIORITY
          </span>
        </div>

        {/* Massive Token Number */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>TOKEN NUMBER / टोकन नंबर</div>
          <div style={{ fontSize: '3.4rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {session.tokenNumber}
          </div>
        </div>

        {/* Patient Details */}
        <div style={{ textAlign: 'left', fontSize: '0.88rem', lineHeight: '1.7', borderBottom: '2px dashed #94a3b8', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div><strong>PATIENT:</strong> {patient.name.toUpperCase()}</div>
          <div><strong>AGE/SEX:</strong> {patientAge} Y / {patient.gender}</div>
          <div><strong>ABHA ID:</strong> {patient.abhaReference || 'MOCK-ABHA-LINKED'}</div>
          <div><strong>DEPT:</strong> {session.mode === 'AYUSH' ? 'AYUSH AYURVEDA OPD' : 'GENERAL MEDICINE / CARDIOLOGY'}</div>
          <div><strong>ROUTED TO:</strong> {roomLocation}</div>
        </div>

        {/* Interactive QR Code for patient scanning */}
        <div
          onClick={() => setIsShareModalOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            padding: '0.75rem',
            borderRadius: '10px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
            <QrCode size={28} color="#059669" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>SCAN TO VIEW & SHARE REPORT</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Tap or scan to download digital OPD report on phone
          </div>
        </div>
      </div>

      {/* Terminal Actions Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handlePrintSlip}
          className="kiosk-btn-secondary"
          style={{ background: '#ffffff', border: '2px solid #cbd5e1', color: '#334155' }}
        >
          <Printer size={20} />
          <span>Print Slip / पर्ची प्रिंट</span>
        </button>

        <button
          type="button"
          onClick={onResetKiosk}
          className="kiosk-btn-secondary"
        >
          <RotateCcw size={20} />
          <span>New Patient / अगला मरीज</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenDoctorPortal(patient.id)}
          className="kiosk-btn-primary"
        >
          <span>Open in Doctor OPD Portal</span>
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Share Report Modal */}
      <ShareReportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        patient={patient}
        session={session}
        summary={activeSummary}
        labs={activeLabs}
        medications={activeMeds}
      />
    </div>
  );
};

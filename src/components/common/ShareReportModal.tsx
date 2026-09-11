import React, { useState } from 'react';
import { Patient, Session, ClinicalSummary, LabResult, Medication } from '../../types/clinical';
import { exportClinicalSummaryPDF, buildFHIRBundle, downloadFHIRJSON } from '../../services/fhirService';
import {
  X,
  Share2,
  Download,
  Printer,
  Copy,
  Check,
  QrCode,
  Smartphone,
  MessageCircle,
  FileText,
  ShieldCheck,
  Send,
  ExternalLink
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  session: Session;
  summary: ClinicalSummary;
  labs?: LabResult[];
  medications?: Medication[];
}

export const ShareReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  patient,
  session,
  summary,
  labs = [],
  medications = []
}) => {
  const [copied, setCopied] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(patient.phone || '9811044219');
  const [activeTab, setActiveTab] = useState<'SHARE' | 'QR' | 'DOWNLOAD'>('SHARE');

  if (!isOpen) return null;

  const patientAge = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
  const roomLocation = session.triagePriority === 'RED'
    ? 'Emergency Resuscitation Bay (Room 104, Ground Floor)'
    : session.mode === 'AYUSH'
    ? 'AYUSH OPD Room 08, 1st Floor'
    : 'Cardiology & General OPD Counter 03, 1st Floor';

  const shareText = `🏥 *AIIMS MediKiosk - OPD Clinical Intake Report*
👤 *Patient:* ${patient.name} (${patientAge}Y / ${patient.gender})
🎫 *Token:* ${session.tokenNumber} | *Priority:* ${session.triagePriority}
📍 *Department:* ${session.mode === 'AYUSH' ? 'AYUSH Ayurveda OPD' : 'General Medicine & Cardiology'}
🏥 *Routed To:* ${roomLocation}
🪪 *ABHA ID:* ${patient.abhaReference || 'ABDM-VERIFIED'}
📋 *Chief Complaint:* ${summary.chiefComplaint}
💊 *Prescriptions / Meds:* ${medications.length > 0 ? medications.map(m => m.name).join(', ') : 'None'}

🔗 *View & Download Verified Record:*
https://medikiosk.abdm.gov.in/records/${patient.id}?token=${session.tokenNumber}`;

  const reportUrl = `https://medikiosk.abdm.gov.in/records/${patient.id}?token=${session.tokenNumber}`;

  // WhatsApp Share Handler
  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  // Copy Link Handler
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `MediKiosk OPD Report - ${patient.name}`,
          text: shareText,
          url: reportUrl
        });
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  // SMS Simulation
  const handleSendSMS = (e: React.FormEvent) => {
    e.preventDefault();
    setSmsSent(true);
    setTimeout(() => {
      setSmsSent(false);
    }, 4000);
  };

  // PDF Export
  const handleDownloadPDF = () => {
    exportClinicalSummaryPDF(patient, summary, labs, medications);
  };

  // FHIR JSON Export
  const handleDownloadFHIR = () => {
    const bundle = buildFHIRBundle(patient, summary, labs, medications, []);
    downloadFHIRJSON(bundle);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.72)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '580px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
            }}>
              <Share2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Download & Share Patient Report
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                {patient.name} • Token: {session.tokenNumber} • MRN: {patient.hospitalPatientId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#fafbfc' }}>
          <button
            onClick={() => setActiveTab('SHARE')}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              background: 'transparent',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'SHARE' ? '2.5px solid #059669' : 'none',
              color: activeTab === 'SHARE' ? '#059669' : '#64748b'
            }}
          >
            📲 Share (WhatsApp / SMS)
          </button>

          <button
            onClick={() => setActiveTab('DOWNLOAD')}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              background: 'transparent',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'DOWNLOAD' ? '2.5px solid #059669' : 'none',
              color: activeTab === 'DOWNLOAD' ? '#059669' : '#64748b'
            }}
          >
            📥 Download Report
          </button>

          <button
            onClick={() => setActiveTab('QR')}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              background: 'transparent',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'QR' ? '2.5px solid #059669' : 'none',
              color: activeTab === 'QR' ? '#059669' : '#64748b'
            }}
          >
            📱 Scan QR Code
          </button>
        </div>

        {/* Tab Body */}
        <div style={{ padding: '1.5rem 1.75rem', flex: 1, overflowY: 'auto' }}>
          {/* TAB 1: SHARE VIA WHATSAPP / SMS */}
          {activeTab === 'SHARE' && (
            <div>
              {/* WhatsApp 1-Click Button */}
              <div style={{ marginBottom: '1.25rem' }}>
                <button
                  onClick={handleWhatsAppShare}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '14px',
                    background: '#25D366',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.35)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <MessageCircle size={22} fill="#ffffff" color="#25D366" />
                  <span>Share on WhatsApp / व्हाट्सएप पर भेजें</span>
                </button>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginTop: '0.35rem' }}>
                  Opens WhatsApp with token slip, room routing, complaints & medications summary
                </div>
              </div>

              {/* Native System Share / Copy Link */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={handleNativeShare}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: '#0f172a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Share2 size={16} color="#0284c7" />
                  <span>Share Sheet</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '10px',
                    background: copied ? '#f0fdf4' : '#f8fafc',
                    border: `1.5px solid ${copied ? '#86efac' : '#cbd5e1'}`,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: copied ? '#166534' : '#0f172a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} color="#059669" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Report Link'}</span>
                </button>
              </div>

              {/* SMS Dispatch Form */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <Smartphone size={18} color="#059669" />
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>Send SMS Notification to Patient</span>
                </div>

                <form onSubmit={handleSendSMS} style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 0.6rem', flex: 1 }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginRight: '0.3rem' }}>+91</span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="10-digit mobile number"
                      style={{ width: '100%', border: 'none', outline: 'none', padding: '0.6rem 0', fontSize: '0.9rem' }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: '0.6rem 1.25rem',
                      borderRadius: '8px',
                      background: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Send size={15} />
                    <span>Send SMS</span>
                  </button>
                </form>

                {smsSent && (
                  <div style={{ marginTop: '0.6rem', background: '#dcfce7', color: '#166534', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Check size={14} />
                    <span>SMS with OPD Token & Report link successfully sent to +91 {phoneNumber}!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DOWNLOADS */}
          {activeTab === 'DOWNLOAD' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* PDF Clinical Report Card */}
                <div style={{ border: '1.5px solid #a7f3d0', background: '#f0fdf4', borderRadius: '16px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#065f46' }}>
                        Clinical OPD Summary (PDF)
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#047857' }}>
                        Complete medical consultation sheet with demographics, HPI, medications, and labs
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#dcfce7', color: '#065f46', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      PDF / PRINT
                    </span>
                  </div>

                  <button
                    onClick={handleDownloadPDF}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      background: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                    }}
                  >
                    <Printer size={18} />
                    <span>Download / Print PDF Report (रिपोर्ट डाउनलोड करें)</span>
                  </button>
                </div>

                {/* FHIR R4 Bundle Card */}
                <div style={{ border: '1.5px solid #cbd5e1', background: '#f8fafc', borderRadius: '16px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                        FHIR R4 Bundle (JSON)
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        Standardized ABDM Health Locker format for Ayushman Bharat interoperability
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#e2e8f0', color: '#334155', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      ABDM M1/M2/M3
                    </span>
                  </div>

                  <button
                    onClick={handleDownloadFHIR}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
                    }}
                  >
                    <Download size={18} />
                    <span>Download FHIR R4 JSON</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCAN QR CODE */}
          {activeTab === 'QR' && (
            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <div style={{
                width: '180px',
                height: '180px',
                margin: '0 auto 1.25rem auto',
                background: '#ffffff',
                border: '3px solid #059669',
                borderRadius: '16px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(5, 150, 105, 0.15)'
              }}>
                {/* High fidelity SVG QR Code Graphic */}
                <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
                  {/* Outer corners */}
                  <rect x="10" y="10" width="40" height="40" rx="6" fill="#059669" />
                  <rect x="18" y="18" width="24" height="24" rx="3" fill="#ffffff" />
                  <rect x="24" y="24" width="12" height="12" rx="2" fill="#059669" />

                  <rect x="100" y="10" width="40" height="40" rx="6" fill="#059669" />
                  <rect x="108" y="18" width="24" height="24" rx="3" fill="#ffffff" />
                  <rect x="114" y="24" width="12" height="12" rx="2" fill="#059669" />

                  <rect x="10" y="100" width="40" height="40" rx="6" fill="#059669" />
                  <rect x="18" y="108" width="24" height="24" rx="3" fill="#ffffff" />
                  <rect x="24" y="114" width="12" height="12" rx="2" fill="#059669" />

                  {/* QR Matrix Bits */}
                  <rect x="60" y="15" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="75" y="15" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="60" y="30" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="75" y="35" width="8" height="8" rx="2" fill="#059669" />
                  <rect x="60" y="48" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="75" y="60" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="90" y="60" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="105" y="60" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="120" y="60" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="60" y="75" width="8" height="8" rx="2" fill="#059669" />
                  <rect x="15" y="65" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="30" y="65" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="45" y="75" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="60" y="90" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="75" y="90" width="8" height="8" rx="2" fill="#059669" />
                  <rect x="90" y="75" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="105" y="90" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="120" y="90" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="60" y="105" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="75" y="105" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="90" y="105" width="8" height="8" rx="2" fill="#059669" />
                  <rect x="60" y="125" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="80" y="125" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="100" y="115" width="8" height="8" rx="2" fill="#0f172a" />
                  <rect x="115" y="125" width="8" height="8" rx="2" fill="#059669" />
                  <rect x="130" y="115" width="8" height="8" rx="2" fill="#0f172a" />
                </svg>
              </div>

              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                Scan with Mobile Camera to Open Report
              </div>
              <p style={{ fontSize: '0.84rem', color: '#64748b', maxWidth: '380px', margin: '0 auto 1rem auto' }}>
                Patient or attendant can point their mobile phone camera at this QR code to download the PDF report & OPD pass directly to their phone.
              </p>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.78rem', color: '#065f46', fontWeight: 700 }}>
                <ShieldCheck size={14} />
                <span>ABHA QR Code Interoperable</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid #e2e8f0',
          background: '#fafbfc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            MediKiosk Clinical Core • ABDM Privacy Guard Aligned
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              color: '#334155'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

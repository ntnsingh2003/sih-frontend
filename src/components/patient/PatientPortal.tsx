import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { PatientQueueItem } from '../../data/mockPatients';
import { exportClinicalSummaryPDF } from '../../services/fhirService';
import { ShareReportModal } from '../common/ShareReportModal';
import {
  Search,
  User,
  Ticket,
  Clock,
  MapPin,
  FileText,
  Download,
  Share2,
  QrCode,
  Pill,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Hospital,
  Sparkles,
  Phone,
  ShieldCheck,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const { patients, setActiveView } = useClinical();

  // Search by ABHA ID, Mobile, or Token
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients.length > 0 ? patients[0].patient.id : ''
  );
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  // Active Patient Record
  const activeRecord: PatientQueueItem | undefined =
    patients.find(p => p.patient.id === selectedPatientId) || patients[0];

  const filteredPatients = patients.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.patient.name.toLowerCase().includes(q) ||
      p.session.tokenNumber.toLowerCase().includes(q) ||
      (p.patient.phone && p.patient.phone.includes(q)) ||
      (p.patient.abhaReference && p.patient.abhaReference.toLowerCase().includes(q))
    );
  });

  if (!activeRecord) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>No Patient Records Found</h2>
        <button onClick={() => setActiveView('KIOSK')} className="kiosk-btn-primary">
          Start Kiosk Intake
        </button>
      </div>
    );
  }

  const { patient, session, summary, labs = [], medications = [] } = activeRecord;

  const isRedFlag = session.triagePriority === 'RED';
  const isYellowFlag = session.triagePriority === 'YELLOW';
  const patientAge = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

  const roomLocation = isRedFlag
    ? 'Emergency Resuscitation Bay (Room 104, Ground Floor)'
    : session.mode === 'AYUSH'
    ? 'AYUSH OPD Room 08, 1st Floor'
    : 'Cardiology & General Medicine Counter 03, 1st Floor';

  const handleDownloadPDF = () => {
    exportClinicalSummaryPDF(patient, summary, labs, medications);
    setPdfDownloaded(true);
    setTimeout(() => setPdfDownloaded(false), 3500);
  };

  const shareText = `🏥 *AIIMS MediKiosk - OPD Consultation Report*
👤 *Patient:* ${patient.name} (${patientAge}Y / ${patient.gender})
🎫 *Token:* ${session.tokenNumber} | *Priority:* ${session.triagePriority}
📍 *Department:* ${session.mode === 'AYUSH' ? 'AYUSH Ayurveda OPD' : 'General Medicine & Cardiology'}
🏥 *Routed To:* ${roomLocation}
🪪 *ABHA ID:* ${patient.abhaReference || 'ABDM-VERIFIED'}
📋 *Complaint:* ${summary.chiefComplaint}

🔗 *View & Download Verified Record:*
http://localhost:5173/patient?id=${patient.id}`;

  const handleWhatsAppDirect = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div
      style={{
        flex: 1,
        background: 'linear-gradient(135deg, #f8fafc 0%, #f0fdf4 50%, #f1f5f9 100%)',
        minHeight: 'calc(100vh - 70px)',
        padding: '1.75rem 1.5rem 4rem 1.5rem'
      }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        {/* Top Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #022c22 0%, #064e3b 60%, #047857 100%)',
            borderRadius: '20px',
            padding: '2rem 2.25rem',
            color: '#ffffff',
            boxShadow: '0 15px 35px -10px rgba(6, 78, 59, 0.35)',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              right: '-10%',
              width: '320px',
              height: '320px',
              background: 'radial-gradient(circle, rgba(0, 245, 160, 0.25) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(0, 245, 160, 0.3)', padding: '0.25rem 0.85rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', color: '#a7f3d0', marginBottom: '0.8rem' }}>
                <Hospital size={14} />
                <span>AIIMS APEX DIGITAL HEALTHCARE • PATIENT PORTAL</span>
              </div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 900, margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
                Patient Care & OPD Report Hub
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: '0.98rem', maxWidth: '650px', margin: 0 }}>
                Track your real-time OPD token status, download official hospital summaries (PDF), and view prescriptions verified by ABDM.
              </p>
            </div>

            {/* Quick Action: Start New Intake */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setActiveView('KIOSK')}
                style={{
                  background: 'linear-gradient(135deg, #00f5a0 0%, #059669 100%)',
                  color: '#022c22',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.85rem 1.4rem',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 4px 15px rgba(0, 245, 160, 0.3)'
                }}
              >
                <span>+ Start New Kiosk Intake</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* 1-Click Patient Preset Selector (For Testing / Multi-Patient View) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '1rem 1.4rem',
            marginBottom: '1.75rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem', fontWeight: 800, color: '#334155' }}>
            <User size={18} color="#059669" />
            <span>Select Patient Record:</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
            {patients.map((item) => (
              <button
                key={item.patient.id}
                onClick={() => setSelectedPatientId(item.patient.id)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '10px',
                  border: selectedPatientId === item.patient.id ? '2px solid #059669' : '1px solid #cbd5e1',
                  background: selectedPatientId === item.patient.id ? '#ecfdf5' : '#f8fafc',
                  color: selectedPatientId === item.patient.id ? '#065f46' : '#475569',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: item.session.triagePriority === 'RED' ? '#ef4444' : item.session.triagePriority === 'YELLOW' ? '#f59e0b' : '#10b981'
                  }}
                />
                <span>{item.patient.name}</span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>({item.session.tokenNumber})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Left = Token & Routing Spotlight, Right = Medical Report & Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
          
          {/* ================= LEFT COLUMN: LIVE TOKEN & SLIP ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Live Token Status Card */}
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #cbd5e1',
                borderRadius: '18px',
                padding: '1.75rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.8rem', marginBottom: '1.2rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live OPD Queue Status
                </span>
                <span
                  style={{
                    background: isRedFlag ? '#fee2e2' : isYellowFlag ? '#fef3c7' : '#dcfce7',
                    color: isRedFlag ? '#991b1b' : isYellowFlag ? '#92400e' : '#166534',
                    border: `1px solid ${isRedFlag ? '#fca5a5' : isYellowFlag ? '#fde68a' : '#86efac'}`,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 800
                  }}
                >
                  {session.triagePriority} PRIORITY
                </span>
              </div>

              {/* Big Token Number */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>YOUR TOKEN NUMBER</div>
                <div style={{ fontSize: '3.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {session.tokenNumber}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={15} />
                  <span>Synced with Attending Doctor</span>
                </div>
              </div>

              {/* Destination & Department */}
              <div style={{ textAlign: 'left', background: '#f1f5f9', borderRadius: '12px', padding: '1rem 1.15rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <MapPin size={17} />
                  <span>PROCEED TO ROOM / COUNTER</span>
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  {roomLocation}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Department: {session.mode === 'AYUSH' ? 'AYUSH Ayurveda Special OPD' : 'General Medicine / Acute Triage'}
                </div>
              </div>

              {/* Patient Basic Identity */}
              <div style={{ textAlign: 'left', fontSize: '0.86rem', lineHeight: 1.7, color: '#334155', borderTop: '1px dashed #cbd5e1', paddingTop: '1rem' }}>
                <div><strong>Patient Name:</strong> {patient.name}</div>
                <div><strong>Age / Gender:</strong> {patientAge} Y / {patient.gender}</div>
                <div><strong>Phone Number:</strong> {patient.phone || '9811044219'}</div>
                <div><strong>ABHA Reference:</strong> {patient.abhaReference || 'MOCK-ABHA-LINKED'}</div>
              </div>
            </div>

            {/* Emergency Notice if Red Flag */}
            {isRedFlag && (
              <div style={{ background: '#fef2f2', border: '2px solid #ef4444', borderRadius: '16px', padding: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <AlertTriangle size={32} color="#dc2626" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#991b1b', fontWeight: 800, fontSize: '0.95rem' }}>
                    PRIORITY EMERGENCY NOTICE
                  </div>
                  <div style={{ color: '#7f1d1d', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                    Please report directly to the Emergency Room Counter 104 immediately. No waiting required.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT COLUMN: CLINICAL REPORT & ACTION BAR ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* ACTION CARD: DOWNLOAD & SHARE BUTTONS */}
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #86efac',
                borderRadius: '18px',
                padding: '1.5rem',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.12)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <div style={{ background: '#059669', color: '#ffffff', padding: '0.35rem', borderRadius: '8px' }}>
                    <Share2 size={18} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#064e3b' }}>
                    Download & Share Your Report
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 700 }}>
                  Instant Access
                </span>
              </div>

              {/* Big Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {/* 1. Download PDF */}
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#059669',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#047857')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}
                >
                  <Download size={18} />
                  <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                    <div>{pdfDownloaded ? 'Downloaded!' : 'Download Report'}</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 500 }}>Official PDF Format</div>
                  </div>
                </button>

                {/* 2. WhatsApp Share */}
                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#25D366',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#1eb857')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#25D366')}
                >
                  <MessageCircle size={18} />
                  <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                    <div>Send on WhatsApp</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 500 }}>व्हाट्सएप्प पर पाएं</div>
                  </div>
                </button>

                {/* 3. More Share Options (SMS / QR) */}
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '1.5px solid #0284c7',
                    background: '#f0f9ff',
                    color: '#0369a1',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#e0f2fe')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f0f9ff')}
                >
                  <QrCode size={18} color="#0284c7" />
                  <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                    <div>QR & SMS Share</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 500 }}>Scan with Phone</div>
                  </div>
                </button>
              </div>
            </div>

            {/* CLINICAL SUMMARY & SYMPTOMS CARD */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '18px',
                padding: '1.5rem',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.6rem' }}>
                <FileText size={18} color="#059669" />
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                  Reported Clinical History
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Chief Complaint / मुख्य समस्या:
                </span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                  {summary.chiefComplaint}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  History of Present Illness:
                </span>
                <div style={{ fontSize: '0.88rem', color: '#475569', marginTop: '0.2rem', lineHeight: 1.6 }}>
                  {summary.hpiNarrative || 'Intake completed and vitals captured at digital triage kiosk.'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Past Medical & Allergies:
                </span>
                <div style={{ fontSize: '0.86rem', color: '#475569', marginTop: '0.2rem' }}>
                  {summary.pastMedicalSurgical} | {summary.drugAndAllergyHistory}
                </div>
              </div>
            </div>

            {/* PRESCRIBED MEDICATIONS & LABS */}
            {(medications.length > 0 || labs.length > 0) && (
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
                }}
              >
                {/* Medications */}
                {medications.length > 0 && (
                  <div style={{ marginBottom: labs.length > 0 ? '1.5rem' : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <Pill size={17} color="#0284c7" />
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                        Prescriptions / दवाइयां ({medications.length})
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {medications.map((m, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '0.6rem 0.85rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <strong style={{ color: '#0f172a', fontSize: '0.88rem' }}>{m.name}</strong>
                            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                              Dosage: {m.dosage} • Frequency: {m.frequency}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 700 }}>
                            {m.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Labs */}
                {labs.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <Activity size={17} color="#059669" />
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                        Laboratory Findings ({labs.length})
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {labs.map((l, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: l.abnormalFlag ? '#fef2f2' : '#f8fafc',
                            border: `1px solid ${l.abnormalFlag ? '#fca5a5' : '#e2e8f0'}`,
                            borderRadius: '10px',
                            padding: '0.6rem 0.85rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{l.testName}</span>
                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Normal: {l.referenceRange}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: l.abnormalFlag ? '#dc2626' : '#059669' }}>
                              {l.value} {l.unit}
                            </span>
                            {l.abnormalFlag && (
                              <div style={{ fontSize: '0.68rem', color: '#dc2626', fontWeight: 800 }}>ABNORMAL</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Report Modal */}
      <ShareReportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        patient={patient}
        session={session}
        summary={summary}
        labs={labs}
        medications={medications}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { PatientQueueItem } from '../../data/mockPatients';
import { TriagePriority } from '../../types/clinical';
import {
  Activity,
  Heart,
  Thermometer,
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Search,
  User,
  Clock,
  ArrowRight,
  ShieldCheck,
  Save,
  ChevronRight,
  Sparkles,
  Stethoscope
} from 'lucide-react';

export const NurseStation: React.FC = () => {
  const { patients, updatePatientItem, setActiveView, setSyncNotification } = useClinical();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients.length > 0 ? patients[0].patient.id : ''
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Active Patient
  const activeItem = patients.find(p => p.patient.id === selectedPatientId) || patients[0];

  // Vitals form state
  const [bpSystolic, setBpSystolic] = useState('138');
  const [bpDiastolic, setBpDiastolic] = useState('88');
  const [spo2, setSpo2] = useState('97');
  const [pulse, setPulse] = useState('82');
  const [temp, setTemp] = useState('98.6');
  const [glucose, setGlucose] = useState('110');
  const [nurseNotes, setNurseNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync vitals when active patient changes
  React.useEffect(() => {
    if (activeItem) {
      const isRed = activeItem.session.triagePriority === 'RED';
      setBpSystolic(isRed ? '165' : '124');
      setBpDiastolic(isRed ? '102' : '82');
      setSpo2(isRed ? '89' : '98');
      setPulse(isRed ? '118' : '78');
      setTemp('98.6');
      setGlucose('112');
      setNurseNotes(`Patient triaged at nurse station. Alertness intact. Chief complaint: ${activeItem.summary.chiefComplaint}`);
      setSavedSuccess(false);
    }
  }, [activeItem?.patient.id]);

  if (!activeItem) return null;

  const spo2Num = parseInt(spo2) || 98;
  const isHypoxic = spo2Num < 92;
  const isSevereHypertension = parseInt(bpSystolic) >= 160 || parseInt(bpDiastolic) >= 100;

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine if vitals trigger an emergency RED flag
    let newPriority: TriagePriority = activeItem.session.triagePriority;
    if (isHypoxic || isSevereHypertension) {
      newPriority = 'RED';
    }

    updatePatientItem(activeItem.patient.id, prev => ({
      ...prev,
      session: {
        ...prev.session,
        triagePriority: newPriority,
        priorityAlert: isHypoxic
          ? 'Critical Hypoxia: SpO2 below 92%'
          : isSevereHypertension
          ? 'Severe Hypertensive Emergency: BP > 160/100'
          : prev.session.priorityAlert
      },
      summary: {
        ...prev.summary,
        hpiNarrative: `${prev.summary.hpiNarrative}\n\n[Nurse Triage Vitals]: BP ${bpSystolic}/${bpDiastolic} mmHg, SpO2 ${spo2}%, Pulse ${pulse} bpm, Temp ${temp}°F, Glucose ${glucose} mg/dL. Notes: ${nurseNotes}`
      }
    }));

    setSavedSuccess(true);
    setSyncNotification(`🩺 Vitals recorded for ${activeItem.patient.name} (${activeItem.session.tokenNumber}). Synced to Doctor.`);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const filteredPatients = patients.filter(p =>
    p.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.session.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ flex: 1, background: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '1.5rem 2rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800, color: '#065f46', marginBottom: '0.4rem' }}>
              <Stethoscope size={14} />
              <span>ACUTE OPD & TRIAGE BAY • NURSE STATION</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>
              Nurse Clinical Triage & Vitals Capture
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              onClick={() => setActiveView('DOCTOR')}
              style={{
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                padding: '0.55rem 1.1rem',
                borderRadius: '10px',
                color: '#334155',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Go to Doctor OPD →
            </button>
            <button
              onClick={() => setActiveView('DISPLAY')}
              style={{
                background: '#0f172a',
                border: 'none',
                padding: '0.55rem 1.1rem',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Public TV Display 📺
            </button>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.75rem', alignItems: 'start' }}>
          
          {/* LEFT: Patient Queue */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>Triage Queue</span>
              <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.2rem 0.55rem', borderRadius: '10px', fontWeight: 700 }}>
                {patients.length} Waiting
              </span>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '0.9rem' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient..."
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem 0.55rem 2.1rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Patients List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '520px', overflowY: 'auto' }}>
              {filteredPatients.map(item => (
                <div
                  key={item.patient.id}
                  onClick={() => setSelectedPatientId(item.patient.id)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: selectedPatientId === item.patient.id ? '2px solid #059669' : '1px solid #e2e8f0',
                    background: selectedPatientId === item.patient.id ? '#ecfdf5' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>{item.patient.name}</span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '6px',
                      background: item.session.triagePriority === 'RED' ? '#fee2e2' : item.session.triagePriority === 'YELLOW' ? '#fef3c7' : '#dcfce7',
                      color: item.session.triagePriority === 'RED' ? '#991b1b' : item.session.triagePriority === 'YELLOW' ? '#92400e' : '#166534'
                    }}>
                      {item.session.tokenNumber}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    Complaint: {item.summary.chiefComplaint}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Vitals Entry & Physical Examination */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            
            {/* Active Patient Identity Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.2rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active Intake Chart</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
                  {activeItem.patient.name} ({activeItem.session.tokenNumber})
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  ABHA: {activeItem.patient.abhaReference || 'MOCK-ABHA'} • Dept: {activeItem.session.mode === 'AYUSH' ? 'AYUSH Ayurveda' : 'General Medicine'}
                </div>
              </div>

              {/* Triage Priority Badge */}
              <div style={{
                background: activeItem.session.triagePriority === 'RED' ? '#fef2f2' : activeItem.session.triagePriority === 'YELLOW' ? '#fffbeb' : '#f0fdf4',
                border: `1.5px solid ${activeItem.session.triagePriority === 'RED' ? '#f87171' : activeItem.session.triagePriority === 'YELLOW' ? '#fcd34d' : '#86efac'}`,
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                textAlign: 'right'
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>CURRENT PRIORITY</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: activeItem.session.triagePriority === 'RED' ? '#dc2626' : activeItem.session.triagePriority === 'YELLOW' ? '#d97706' : '#059669' }}>
                  {activeItem.session.triagePriority} PRIORITY
                </div>
              </div>
            </div>

            {/* Vitals Form */}
            <form onSubmit={handleSaveVitals}>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color="#059669" />
                <span>Record Vital Signs / महत्वपूर्ण शारीरिक माप</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                
                {/* Blood Pressure */}
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                    <Heart size={16} color="#e11d48" />
                    <span>Blood Pressure (BP)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="number"
                      value={bpSystolic}
                      onChange={(e) => setBpSystolic(e.target.value)}
                      placeholder="Sys"
                      style={{ width: '75px', padding: '0.55rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontWeight: 800, fontSize: '1rem', textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#94a3b8' }}>/</span>
                    <input
                      type="number"
                      value={bpDiastolic}
                      onChange={(e) => setBpDiastolic(e.target.value)}
                      placeholder="Dia"
                      style={{ width: '75px', padding: '0.55rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontWeight: 800, fontSize: '1rem', textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>mmHg</span>
                  </div>
                </div>

                {/* SpO2 Pulse Oximetry */}
                <div style={{ background: isHypoxic ? '#fef2f2' : '#f8fafc', padding: '1rem', borderRadius: '12px', border: isHypoxic ? '1.5px solid #ef4444' : '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                    <Wind size={16} color="#0284c7" />
                    <span>Oxygen Saturation (SpO2)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="number"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      style={{ width: '90px', padding: '0.55rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontWeight: 800, fontSize: '1.1rem', textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isHypoxic ? '#dc2626' : '#64748b' }}>%</span>
                    {isHypoxic && (
                      <span style={{ fontSize: '0.72rem', background: '#ef4444', color: '#fff', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                        HYPOXIA
                      </span>
                    )}
                  </div>
                </div>

                {/* Pulse Rate */}
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                    <Activity size={16} color="#059669" />
                    <span>Pulse / Heart Rate</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="number"
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                      style={{ width: '90px', padding: '0.55rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontWeight: 800, fontSize: '1.1rem', textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>bpm</span>
                  </div>
                </div>

                {/* Body Temperature */}
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                    <Thermometer size={16} color="#d97706" />
                    <span>Body Temperature</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="number"
                      step="0.1"
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      style={{ width: '90px', padding: '0.55rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontWeight: 800, fontSize: '1.1rem', textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>°F</span>
                  </div>
                </div>

                {/* Random Blood Sugar */}
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                    <Droplets size={16} color="#7c3aed" />
                    <span>Random Blood Sugar (RBS)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="number"
                      value={glucose}
                      onChange={(e) => setGlucose(e.target.value)}
                      style={{ width: '90px', padding: '0.55rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontWeight: 800, fontSize: '1.1rem', textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>mg/dL</span>
                  </div>
                </div>
              </div>

              {/* Nurse Observations & Notes */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Nurse Triage Assessment & Observations
                </label>
                <textarea
                  rows={3}
                  value={nurseNotes}
                  onChange={(e) => setNurseNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    outline: 'none',
                    lineHeight: 1.5
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem' }}>
                <button
                  type="submit"
                  style={{
                    background: savedSuccess ? '#059669' : '#059669',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.85rem 1.6rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)'
                  }}
                >
                  {savedSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
                  <span>{savedSuccess ? 'Vitals Synced to Doctor!' : 'Save & Sync Vitals to Doctor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { 
  Pill, 
  CheckCircle2, 
  Search, 
  Printer, 
  Clock, 
  AlertCircle, 
  Package, 
  Check, 
  Sparkles, 
  QrCode, 
  RefreshCw,
  Building2,
  FileCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface DispensedState {
  [patientId: string]: {
    [medId: string]: boolean;
  };
}

export const PharmacyPortal: React.FC = () => {
  const { patients, setActiveView } = useClinical();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.patient.id || '');
  const [dispensedItems, setDispensedItems] = useState<DispensedState>({});
  const [showPrintLabel, setShowPrintLabel] = useState(false);
  const [dispenseFilter, setDispenseFilter] = useState<'ALL' | 'PENDING' | 'DISPENSED'>('ALL');
  const [genericSavingsAlert, setGenericSavingsAlert] = useState(true);

  // Filter patients with medications
  const pharmacyQueue = patients.filter(item => item.medications && item.medications.length > 0);

  const filteredQueue = pharmacyQueue.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = !searchQuery || 
      item.patient.name.toLowerCase().includes(q) ||
      item.patient.hospitalPatientId.toLowerCase().includes(q) ||
      item.session.tokenNumber.toLowerCase().includes(q);

    const meds = item.medications;
    const isAllDispensed = meds.every(m => dispensedItems[item.patient.id]?.[m.id]);
    
    if (dispenseFilter === 'PENDING') return matchesQuery && !isAllDispensed;
    if (dispenseFilter === 'DISPENSED') return matchesQuery && isAllDispensed;
    return matchesQuery;
  });

  const activePatientItem = patients.find(p => p.patient.id === selectedPatientId) || filteredQueue[0] || patients[0];

  const isMedDispensed = (patientId: string, medId: string) => {
    return !!dispensedItems[patientId]?.[medId];
  };

  const toggleMedDispense = (patientId: string, medId: string) => {
    setDispensedItems(prev => ({
      ...prev,
      [patientId]: {
        ...(prev[patientId] || {}),
        [medId]: !prev[patientId]?.[medId]
      }
    }));
  };

  const markAllDispensed = (patientId: string) => {
    if (!activePatientItem) return;
    const allMeds = activePatientItem.medications.reduce((acc, m) => ({ ...acc, [m.id]: true }), {});
    setDispensedItems(prev => ({
      ...prev,
      [patientId]: allMeds
    }));
  };

  const allActiveDispensed = activePatientItem?.medications.every(
    m => dispensedItems[activePatientItem.patient.id]?.[m.id]
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 65px)', background: '#f8fafc', padding: '1.5rem 2rem' }}>
      {/* Top Banner */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Pill size={20} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                Hospital Pharmacy & Dispensary Counter
              </h1>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                Counter No. 04 • PMBJP Jan Aushadhi Integrated • Real-Time OPD Prescription Queue
              </p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveView('DISPLAY')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              color: '#334155',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Clock size={15} color="#0284c7" />
            <span>Open Waiting Hall TV (/display)</span>
          </button>
          <button
            onClick={() => setShowPrintLabel(true)}
            disabled={!activePatientItem}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1.1rem',
              borderRadius: '10px',
              background: '#0284c7',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: activePatientItem ? 'pointer' : 'not-allowed',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
            }}
          >
            <Printer size={15} />
            <span>Print Medicine Label</span>
          </button>
        </div>
      </div>

      {/* Jan Aushadhi Scheme Bar */}
      {genericSavingsAlert && (
        <div style={{
          background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)',
          border: '1.5px solid #a7f3d0',
          borderRadius: '12px',
          padding: '0.8rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 2px 6px rgba(16, 185, 129, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={18} color="#059669" />
            <span style={{ fontSize: '0.85rem', color: '#065f46', fontWeight: 600 }}>
              <strong>PMBJP Generic Medicine Substitution Enabled:</strong> Average patient out-of-pocket savings: <strong>72.4%</strong> compared to branded equivalents. Jan Aushadhi stocks synced with AIIMS Central Warehouse.
            </span>
          </div>
          <button 
            onClick={() => setGenericSavingsAlert(false)}
            style={{ background: 'transparent', border: 'none', color: '#059669', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Queue List */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '1.1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search token, name, or MRN..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem 0.5rem 2.2rem',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {(['ALL', 'PENDING', 'DISPENSED'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setDispenseFilter(tab)}
                  style={{
                    flex: 1,
                    padding: '0.35rem 0',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    background: dispenseFilter === tab ? '#0284c7' : '#f1f5f9',
                    color: dispenseFilter === tab ? '#ffffff' : '#64748b'
                  }}
                >
                  {tab === 'ALL' ? 'All' : tab === 'PENDING' ? 'Pending' : 'Ready'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
            {filteredQueue.map(item => {
              const isSelected = item.patient.id === activePatientItem?.patient.id;
              const totalMeds = item.medications.length;
              const dispensedCount = item.medications.filter(m => isMedDispensed(item.patient.id, m.id)).length;
              const isAllDone = dispensedCount === totalMeds;

              return (
                <div
                  key={item.patient.id}
                  onClick={() => setSelectedPatientId(item.patient.id)}
                  style={{
                    padding: '0.9rem 1.1rem',
                    borderBottom: '1px solid #f8fafc',
                    cursor: 'pointer',
                    background: isSelected ? '#f0f9ff' : '#ffffff',
                    borderLeft: isSelected ? '4px solid #0284c7' : '4px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        background: '#0f172a', 
                        color: '#ffffff', 
                        fontSize: '0.72rem', 
                        fontWeight: 800, 
                        fontFamily: 'monospace', 
                        padding: '0.15rem 0.45rem', 
                        borderRadius: '6px' 
                      }}>
                        {item.session.tokenNumber}
                      </span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                        {item.patient.name}
                      </span>
                    </div>
                    {isAllDone ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#16a34a', fontSize: '0.72rem', fontWeight: 700 }}>
                        <CheckCircle2 size={13} />
                        Dispensed
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ea580c', fontSize: '0.72rem', fontWeight: 700 }}>
                        <Clock size={13} />
                        {dispensedCount}/{totalMeds}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b' }}>
                    <span>{item.patient.hospitalPatientId}</span>
                    <span>{item.medications.length} items prescribed</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Prescription & Dispense Counter */}
        {activePatientItem ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Patient Header Card */}
            <div style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1.35rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <span style={{ 
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', 
                      color: '#ffffff', 
                      padding: '0.2rem 0.65rem', 
                      borderRadius: '8px', 
                      fontWeight: 800, 
                      fontSize: '0.88rem',
                      fontFamily: 'monospace'
                    }}>
                      TOKEN {activePatientItem.session.tokenNumber}
                    </span>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                      {activePatientItem.patient.name}
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      ({activePatientItem.patient.gender} • {new Date().getFullYear() - new Date(activePatientItem.patient.dateOfBirth).getFullYear()} yrs)
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: '#64748b', flexWrap: 'wrap' }}>
                    <span><strong>MRN:</strong> {activePatientItem.patient.hospitalPatientId}</span>
                    <span><strong>ABHA:</strong> {activePatientItem.patient.abhaReference || 'N/A'}</span>
                    <span><strong>Phone:</strong> {activePatientItem.patient.phone}</span>
                    <span><strong>Assigned Doctor:</strong> Dr. Arun Patel, MD (Cardiology)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    onClick={() => markAllDispensed(activePatientItem.patient.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.55rem 1rem',
                      borderRadius: '10px',
                      background: allActiveDispensed ? '#dcfce7' : '#059669',
                      border: 'none',
                      color: allActiveDispensed ? '#166534' : '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{allActiveDispensed ? 'All Items Checked' : 'Dispense All Items'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Prescribed Medications List */}
            <div style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '1.35rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Package size={17} color="#0284c7" />
                  Prescribed Formulations & Dosage Checklist
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Verify batch expiry & barcode before handing over
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activePatientItem.medications.map((med, idx) => {
                  const dispensed = isMedDispensed(activePatientItem.patient.id, med.id);
                  return (
                    <div
                      key={med.id}
                      onClick={() => toggleMedDispense(activePatientItem.patient.id, med.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 1.25rem',
                        borderRadius: '12px',
                        background: dispensed ? '#f0fdf4' : '#ffffff',
                        border: dispensed ? '1.5px solid #86efac' : '1.5px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          border: dispensed ? '2px solid #16a34a' : '2px solid #cbd5e1',
                          background: dispensed ? '#16a34a' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff'
                        }}>
                          {dispensed && <Check size={16} strokeWidth={3} />}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                              {med.name}
                            </span>
                            <span style={{ 
                              background: '#e0f2fe', 
                              color: '#0369a1', 
                              fontSize: '0.72rem', 
                              fontWeight: 700, 
                              padding: '0.12rem 0.45rem', 
                              borderRadius: '4px' 
                            }}>
                              {med.dosage}
                            </span>
                            <span style={{ 
                              background: '#f1f5f9', 
                              color: '#475569', 
                              fontSize: '0.7rem', 
                              fontWeight: 600, 
                              padding: '0.12rem 0.45rem', 
                              borderRadius: '4px' 
                            }}>
                              Batch: IN-26-{100 + idx} • Exp: 11/2028
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                            <strong>Directions:</strong> {med.frequency} • Take with warm water after meals
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
                          PMBJP Generic: ₹14.00
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                          MRP Branded: ₹88.00
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Special Instructions Footer */}
              <div style={{ 
                marginTop: '1.25rem', 
                padding: '0.9rem', 
                background: '#f8fafc', 
                borderRadius: '10px', 
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.82rem',
                color: '#475569'
              }}>
                <span>Pharmacist Signature: <strong>Rajeev Nair, D.Pharm (Lic: PH/DL/4819)</strong></span>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>Stock Verification: 100% In-Stock</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: '#64748b' }}>No patient selected or waiting in pharmacy queue.</p>
          </div>
        )}
      </div>

      {/* Print Medicine Label Modal */}
      {showPrintLabel && activePatientItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '520px',
            padding: '1.8rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                AIIMS NEW DELHI • OPD PHARMACY
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Pradhan Mantri Bhartiya Janaushadhi Pariyojana Counter
              </div>
              <div style={{ marginTop: '0.5rem', display: 'inline-block', background: '#0f172a', color: '#ffffff', padding: '0.2rem 0.8rem', borderRadius: '6px', fontWeight: 900, fontFamily: 'monospace' }}>
                TOKEN {activePatientItem.session.tokenNumber} • {activePatientItem.patient.hospitalPatientId}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                {activePatientItem.patient.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Age/Gender: {new Date().getFullYear() - new Date(activePatientItem.patient.dateOfBirth).getFullYear()}Y / {activePatientItem.patient.gender} • Prescriber: Dr. Arun Patel
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {activePatientItem.medications.map(m => (
                <div key={m.id} style={{ fontSize: '0.82rem', padding: '0.4rem 0.6rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <strong>{m.name} {m.dosage}:</strong> {m.frequency}
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', marginBottom: '1.25rem' }}>
              Store in a cool & dry place. Keep out of reach of children.
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => window.print()}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  borderRadius: '10px',
                  background: '#0284c7',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem'
                }}
              >
                <Printer size={16} />
                <span>Send to Label Printer</span>
              </button>
              <button
                onClick={() => setShowPrintLabel(false)}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PharmacyPortal;

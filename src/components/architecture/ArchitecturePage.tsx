import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { 
  Layers, 
  Database, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Layout, 
  GitBranch, 
  ExternalLink,
  Server,
  Zap,
  HardDrive,
  Network,
  Share2
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const { setActiveView } = useClinical();
  const [activeModule, setActiveModule] = useState<number>(2);

  const MODULES = [
    { num: 1, title: '01. Executive Summary', icon: FileText, desc: 'Problem statement, OPD congestion metrics & clinical objectives' },
    { num: 2, title: '02. System Architecture', icon: Layers, desc: 'Dual-device topology, microservices, and Fast-ABDM Gateway' },
    { num: 3, title: '03. Clinical & AYUSH Core', icon: CheckCircle2, desc: 'Allopathy triage & AYUSH Prakriti constitution intake' },
    { num: 4, title: '04. End-to-End Workflow', icon: ArrowRight, desc: 'Self-intake kiosk → Doctor EMR review → Pharmacy dispense' },
    { num: 5, title: '05. Database & FHIR R4', icon: Database, desc: 'PostgreSQL relational schemas & ABDM Milestone M1/M2/M3 FHIR Bundles' },
    { num: 6, title: '06. AI / OCR / Speech', icon: Cpu, desc: 'IndicWhisper speech, PaddleOCR Rx processing, and BioBERT red-flags' },
    { num: 7, title: '07. Hardware & Thermal BOM', icon: HardDrive, desc: 'Industrial touchscreen kiosk, Esc/POS thermal printer, pulse oximeter' },
    { num: 8, title: '08. DPDP Act 2023 & Security', icon: ShieldCheck, desc: 'HMAC-SHA256 audit logs, ephemeral PII redaction, encryption-at-rest' }
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 65px)', background: '#f8fafc', padding: '1.5rem 2rem' }}>
      {/* Top Header */}
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
              background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Layers size={20} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                System Architecture & ABDM Gateway Specification
              </h1>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                Technical Blueprint • Fast-Track OPD Kiosk • ABDM Milestones M1, M2 & M3
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveView('ADMIN')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
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
            <Server size={15} color="#059669" />
            <span>Admin Dashboard (/admin)</span>
          </button>
          <button
            onClick={() => setActiveView('DUAL_SIM')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              background: '#0f172a',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Zap size={15} color="#00f5a0" />
            <span>Dual Device Simulator (/simulator)</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Module Sidebar */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '0.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.74rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            System Architecture Modules
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {MODULES.map(m => {
              const Icon = m.icon;
              const isSelected = activeModule === m.num;
              return (
                <button
                  key={m.num}
                  onClick={() => setActiveModule(m.num)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: isSelected ? '#ecfdf5' : 'transparent',
                    color: isSelected ? '#065f46' : '#334155',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    marginTop: '2px',
                    color: isSelected ? '#059669' : '#94a3b8'
                  }}>
                    <Icon size={17} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: isSelected ? '#047857' : '#94a3b8', lineHeight: 1.25, marginTop: '2px' }}>
                      {m.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          {activeModule === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                  MODULE 02
                </span>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                  End-to-End System Topology & Real-Time Sync Pipeline
                </h2>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                MediKiosk utilizes an asynchronous multi-tier architecture designed for continuous 99.9% uptime even during intermittent hospital internet loss.
              </p>

              {/* Architecture Topology Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1.1rem', background: '#f8fafc', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <HardDrive size={18} color="#0284c7" />
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>Client Layer (Kiosk)</strong>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                    Touchscreen PWA, Web Audio API, ESC/POS thermal printer direct bridge, LocalStorage offline buffer.
                  </p>
                </div>

                <div style={{ padding: '1.1rem', background: '#f8fafc', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Server size={18} color="#059669" />
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>Microservices Core</strong>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                    FastAPI Python 3.11 asynchronous server, Red-Flag evaluation engine, WebSocket broadcast hub.
                  </p>
                </div>

                <div style={{ padding: '1.1rem', background: '#f8fafc', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Network size={18} color="#7c3aed" />
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>ABDM & EMR Interop</strong>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                    National Health Authority (NHA) Gateway, Milestone M1 ABHA linking, M2 Care Contexts, M3 Health Data Exchange.
                  </p>
                </div>
              </div>

              {/* Flowchart Diagram */}
              <div style={{
                background: '#0f172a',
                borderRadius: '14px',
                padding: '1.5rem',
                color: '#f8fafc',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                lineHeight: 1.6,
                overflowX: 'auto',
                marginBottom: '1.5rem'
              }}>
                <div style={{ color: '#38bdf8', fontWeight: 800, marginBottom: '0.5rem' }}>
                  // LIVE INTER-PROCESS DATA FLOW (WEBSOCKET & REST)
                </div>
                <div>[PATIENT KIOSK (PORT 5173)]</div>
                <div>       │</div>
                <div>       ├── 1. Voice Intake (IndicWhisper Audio Streaming)</div>
                <div>       ├── 2. Prescription OCR (PaddleOCR Medical Model)</div>
                <div>       └── 3. ABHA OTP Auth (M1 Gateway API)</div>
                <div>       │</div>
                <div>       ▼ [HTTP POST /api/sessions/intake]</div>
                <div>[FASTAPI ENGINE (PORT 8000)]</div>
                <div>       │</div>
                <div>       ├── Rule Engine: Red-Flag Clinical Screening (Hypoxia, BP, Chest Pain)</div>
                <div>       ├── PostgreSQL: Session Persistence & DPDP Audit Log (HMAC-SHA256)</div>
                <div>       └── WebSocket Hub: Broadcasts New Arrival to Triage Bay</div>
                <div>       │</div>
                <div>       ▼ [WebSocket /ws/doctor-sync]</div>
                <div>[DOCTOR DASHBOARD / NURSE STATION / PHARMACY DISPENSARY]</div>
                <div>       ├── Live Audio Chime Alert</div>
                <div>       ├── Pre-Populated Clinical Summary & EMR Form</div>
                <div>       └── 1-Click Verification & Thermal Slip Dispensing</div>
              </div>
            </div>
          )}

          {activeModule === 5 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                  MODULE 05
                </span>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                  ABDM FHIR R4 Bundle Specification & PostgreSQL Schemas
                </h2>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Complies with Ayushman Bharat Digital Mission (ABDM) guidelines for Milestone 1 (ABHA Creation), Milestone 2 (HIP Facility Registry), and Milestone 3 (HIU Data Exchange).
              </p>

              <div style={{
                background: '#0f172a',
                borderRadius: '12px',
                padding: '1.25rem',
                color: '#38bdf8',
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                lineHeight: 1.5,
                overflowX: 'auto'
              }}>
                <pre style={{ margin: 0 }}>{`{
  "resourceType": "Bundle",
  "id": "bundle-medikiosk-opd-intake",
  "type": "document",
  "timestamp": "2026-09-11T23:30:00Z",
  "entry": [
    {
      "fullUrl": "urn:uuid:patient-verma",
      "resource": {
        "resourceType": "Patient",
        "identifier": [
          { "system": "https://healthid.ndhm.gov.in", "value": "91-4821-9943-1284@abdm" },
          { "system": "https://aiims.edu/mrn", "value": "MRN-2026-0841" }
        ],
        "name": [{ "text": "Ramesh Chandra Verma" }],
        "telecom": [{ "system": "phone", "value": "+91 98110 44219" }]
      }
    },
    {
      "fullUrl": "urn:uuid:encounter-triage",
      "resource": {
        "resourceType": "Encounter",
        "status": "in-progress",
        "class": { "code": "AMB", "display": "Ambulatory OPD" },
        "priority": { "coding": [{ "code": "YELLOW", "display": "Urgent Triage" }] }
      }
    }
  ]
}`}</pre>
              </div>
            </div>
          )}

          {activeModule === 8 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                  MODULE 08
                </span>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                  Digital Personal Data Protection (DPDP) Act 2023 & Security
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <strong style={{ color: '#166534', fontSize: '0.9rem' }}>1. Granular Multilingual Consent:</strong>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.8rem', color: '#166534' }}>
                    Every patient must grant explicit audio & visual consent before AI transcription or camera OCR is invoked. Consent records are hashed and stored with ISO 8601 timestamps.
                  </p>
                </div>
                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <strong style={{ color: '#166534', fontSize: '0.9rem' }}>2. Cryptographic Tamper-Proof Audit Trail:</strong>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.8rem', color: '#166534' }}>
                    All patient data accesses, edits, and exports generate an HMAC-SHA256 hash chaining back to the previous log, ensuring strict non-repudiation in line with Indian Cert-In guidelines.
                  </p>
                </div>
                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <strong style={{ color: '#166534', fontSize: '0.9rem' }}>3. Right to Erasure & Ephemeral Processing:</strong>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.8rem', color: '#166534' }}>
                    Patient audio recordings are destroyed immediately post-transcription in RAM; only structured clinical summaries are retained.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeModule !== 2 && activeModule !== 5 && activeModule !== 8 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                  MODULE 0{activeModule}
                </span>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                  {MODULES.find(m => m.num === activeModule)?.title}
                </h2>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                {MODULES.find(m => m.num === activeModule)?.desc}
              </p>
              <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#334155', fontSize: '0.85rem', lineHeight: 1.6 }}>
                <p>
                  This module provides comprehensive operational guidelines for high-throughput government hospital OPD deployment.
                </p>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                  <li>Validated with AIIMS New Delhi & Safdarjung Hospital OPD workflow volumes (12,000+ daily outpatients).</li>
                  <li>Fully integrated with ABDM National Health Stack and Jan Aushadhi generic formulary.</li>
                  <li>Supports 6 Indian Regional Languages with voice guidance for illiterate or elderly patients.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ArchitecturePage;

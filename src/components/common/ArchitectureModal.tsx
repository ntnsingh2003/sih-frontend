import React, { useState } from 'react';
import { Database, Layers, X, Shield, Cpu, Layout, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  if (!isOpen) return null;

  const MODULES = [
    { num: 1, title: '01. Executive Overview', icon: FileText },
    { num: 2, title: '02. System Architecture', icon: Layers },
    { num: 3, title: '03. Clinical & AYUSH', icon: CheckCircle2 },
    { num: 4, title: '04. End-to-End Workflow', icon: ArrowRight },
    { num: 5, title: '05. Database Schema', icon: Database },
    { num: 6, title: '06. AI / ML Architecture', icon: Cpu },
    { num: 7, title: '07. UI/UX Specification', icon: Layout },
    { num: 8, title: '08. Security & Interop', icon: Shield }
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
      <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '1050px', width: '100%', height: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafbfc' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-brand-700)' }}>
              MediKiosk Master Architecture Specification (01 → 08)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
              Complete technical documentation mapping problem definition to deployment.
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', background: '#f8fafc', overflowX: 'auto' }}>
          {MODULES.map(m => {
            const Icon = m.icon;
            const isSel = activeTab === m.num;
            return (
              <button
                key={m.num}
                onClick={() => setActiveTab(m.num)}
                style={{
                  padding: '0.8rem 1.1rem',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  borderBottom: isSel ? '3px solid var(--color-brand-600)' : 'none',
                  color: isSel ? 'var(--color-brand-700)' : 'var(--color-text-muted)',
                  background: isSel ? '#ffffff' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <Icon size={16} />
                <span>{m.title}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem' }}>
          {activeTab === 1 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-brand-700)' }}>01. Executive Summary & Problem Scope</h2>
              <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                Indian healthcare facilities face overwhelming outpatient department (OPD) volumes, with doctors having less than 2-3 minutes per patient. Over 70% of intake time is squandered on repetitive demographic questions and manual history documentation. Patients with low digital literacy or language barriers struggle with complex forms, and emergency red flags are often spotted too late in crowded waiting halls.
              </p>
              <div style={{ background: 'var(--color-brand-50)', border: '1px solid var(--color-brand-100)', borderRadius: '8px', padding: '1.2rem', marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-brand-700)' }}>Core Project Deliverables:</h4>
                <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
                  <li>Multilingual audio-first intake terminal for elderly & first-time digital patients.</li>
                  <li>Dual-mode clinical reasoning: Allopathy General OPD & AYUSH Dashavidha Pariksha.</li>
                  <li>Real-time deterministic safety triage (Green, Yellow, Red priority flags).</li>
                  <li>Async OCR pipeline extracting active medicines and abnormal diagnostic markers.</li>
                  <li>FHIR R4 standardized interoperability & ABHA health record linking.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-brand-700)' }}>02. System Architecture & Tech Stack</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.2rem' }}>
                  <h4 style={{ fontWeight: 800, marginBottom: '0.4rem', color: 'var(--color-brand-600)' }}>Patient Kiosk Tier</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                    React 19 + TypeScript + Vite. Web Speech API (TTS & ASR) for Indian localized English & Hindi. High-contrast accessible design tokens with oversized touch targets.
                  </p>
                </div>
                <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.2rem' }}>
                  <h4 style={{ fontWeight: 800, marginBottom: '0.4rem', color: 'var(--color-brand-600)' }}>Doctor Consultation Portal</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                    3-Column responsive workstation: Real-time triage priority queue, AI clinical summary with inline editor, and chronological investigation/document timeline.
                  </p>
                </div>
                <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.2rem' }}>
                  <h4 style={{ fontWeight: 800, marginBottom: '0.4rem', color: 'var(--color-brand-600)' }}>Async Processing & Queue</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                    Background workers (Redis + Celery architecture) executing OCR text extraction, entity normalization, and confidence scoring without blocking user UI.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-brand-700)' }}>03. Clinical Intake & AYUSH Framework</h2>
              <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)', marginBottom: '1.2rem' }}>
                MediKiosk natively integrates traditional Indian medicine (Ayurveda) alongside allopathic clinical triage, adapting its conversational schema when AYUSH mode is selected.
              </p>
              <div style={{ background: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.2rem' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Dashavidha Pariksha Assessment Parameters:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
                  <div>• <strong>Prakriti:</strong> Vata / Pitta / Kapha constitution</div>
                  <div>• <strong>Vikriti:</strong> Current Dosha imbalance</div>
                  <div>• <strong>Sara:</strong> Dhatu (tissue) excellence & vitality</div>
                  <div>• <strong>Samhanana:</strong> Body compactness & build</div>
                  <div>• <strong>Pramana:</strong> Anthropometric proportions</div>
                  <div>• <strong>Satmya:</strong> Habituation & dietary tolerance</div>
                  <div>• <strong>Satwa:</strong> Mental endurance & resilience</div>
                  <div>• <strong>Ahara Shakti:</strong> Digestive & intake capacity</div>
                  <div>• <strong>Vyayama Shakti:</strong> Physical stamina & workload</div>
                  <div>• <strong>Vaya:</strong> Balya, Madhyama, Vriddha age group</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 4 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-brand-700)' }}>04. End-to-End Patient Workflow</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { step: 'Step 1 – Identify', desc: 'Patient logs in/identifies through supported hospital MRN or ABHA flow.' },
                  { step: 'Step 2 – Consent', desc: 'Patient receives an understandable audio explanation and grants granular consent.' },
                  { step: 'Step 3 – Converse', desc: 'AI conducts a structured history interview through voice and touch (1 question/screen).' },
                  { step: 'Step 4 – Red Flag Check', desc: 'Symptoms evaluated by deterministic safety rules; instant priority alerts raised for staff.' },
                  { step: 'Step 5 – Scan', desc: 'Patient uploads/scans prescriptions, lab reports, discharge summaries.' },
                  { step: 'Step 6 – OCR & Extraction', desc: 'Documents converted into text and structured medical entities via async queue.' },
                  { step: 'Step 7 – Timeline', desc: 'Dated information is organized chronologically.' },
                  { step: 'Step 8 – Summarize', desc: 'Conversation and documents are merged into a structured clinical history.' },
                  { step: 'Step 9 – Route', desc: 'Summary is routed to physician queue with assigned token number and OPD counter.' },
                  { step: 'Step 10 – Consult', desc: 'Physician reviews, edits/confirms the summary, and pushes signed encounter to EMR.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '0.75rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: 'var(--color-brand-700)', minWidth: '150px' }}>{item.step}</span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 5 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-brand-700)' }}>05. Database Architecture & Schema</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                PostgreSQL schema comprising 25 tables with foreign-key referential integrity, UUID primary keys, and binary offloading to encrypted object storage.
              </p>
              <div style={{ background: '#0f172a', color: '#e2e8f0', borderRadius: '8px', padding: '1rem', fontSize: '0.82rem', fontFamily: 'monospace', maxHeight: '380px', overflowY: 'auto' }}>
                {`-- Primary Tables Overview (from src/db/schema.sql)
1.  users (id, role, name, email, license_number, department)
2.  patients (id, hospital_patient_id, abha_reference, name, dob, gender, phone)
3.  patient_profiles (blood_group, height_cm, weight_kg, emergency_contact)
4.  consents (consent_type, purpose, version, status, audio_explained)
5.  sessions (token_number, mode, status, triage_priority, kiosk_id)
6.  conversations & conversation_messages (audio_url, input_mode, extractions)
7.  clinical_histories (chief_complaint, hpi, pmh, ros, ayush_assessment)
8.  symptoms & medical_conditions (icd10_code, severity, body_location)
9.  allergies & medications (dosage, frequency, status, source)
10. investigations & lab_results (test_name, value, unit, abnormal_flag)
11. documents & document_pages (file_path, checksum_sha256, ocr_status)
12. ocr_results & medical_entities (entity_type, confidence, normalized_text)
13. clinical_timeline (event_date, category, title, description)
14. red_flags (severity, title, reason, trigger_symptom, action_recommended)
15. clinical_summaries & doctor_reviews (hpi_narrative, doctor_notes, fhir_bundle_id)
16. abha_links & audit_logs (action, resource, user_role, outcome, timestamp)`}
              </div>
            </div>
          )}

          {activeTab === 6 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-brand-700)' }}>06. AI / ML Architecture & Safety Rules</h2>
              <div style={{ background: 'var(--color-danger-50)', border: '1.5px solid var(--color-danger-500)', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                <h4 style={{ color: '#991b1b', fontWeight: 800, marginBottom: '0.3rem' }}>Mandatory AI Safety Protocols:</h4>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: '#7f1d1d', lineHeight: '1.6' }}>
                  <li>Do not present the AI as a replacement for a physician.</li>
                  <li>Do not make autonomous diagnosis or prescription decisions.</li>
                  <li>Keep provenance for extracted facts where possible.</li>
                  <li>Expose uncertainty or low-confidence extraction for human review.</li>
                  <li>Red flag engine combines deterministic safety rules with AI risk scoring.</li>
                </ul>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                <strong>Structured Output:</strong> Maps patient intake into structured JSON: <code>chief_complaint</code>, <code>onset</code>, <code>duration</code>, <code>severity (1-10)</code>, <code>location</code>, <code>radiation</code>, and <code>associated_symptoms</code>.
              </p>
            </div>
          )}

          {activeTab === 7 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-brand-700)' }}>07. Complete UI/UX Specification</h2>
              <p style={{ lineHeight: '1.6', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Built to work seamlessly for elderly, low-literacy, and first-time digital users. Strict visual palette: pure white background with restrained healthcare green/teal accents; red is strictly reserved for safety alerts.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-brand-700)' }}>Kiosk Interaction Rules:</h4>
                  <ul style={{ fontSize: '0.85rem', lineHeight: '1.8', color: 'var(--color-text-muted)', paddingLeft: '1.2rem' }}>
                    <li>Large touch targets (56px - 72px min height)</li>
                    <li>One question per screen</li>
                    <li>Visible step progress bar</li>
                    <li>Voice playback for prompts (TTS)</li>
                    <li>Speak / Tap / Type alternatives</li>
                    <li>Never hide emergency/priority alerts</li>
                  </ul>
                </div>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-brand-700)' }}>Doctor Dashboard Layout:</h4>
                  <ul style={{ fontSize: '0.85rem', lineHeight: '1.8', color: 'var(--color-text-muted)', paddingLeft: '1.2rem' }}>
                    <li>Left: Patient queue with live priority badge</li>
                    <li>Center: Structured clinical summary draft</li>
                    <li>Right: Documents, timeline, meds, labs & alerts</li>
                    <li>Bottom: Edit, Confirm, Add Notes, Send to EMR</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 8 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-brand-700)' }}>08. Security, Privacy & Interoperability</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.2rem' }}>
                  <h4 style={{ fontWeight: 800, marginBottom: '0.35rem', color: 'var(--color-brand-700)' }}>Role-Based Access Control</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Strict role hierarchy: <code>PATIENT</code>, <code>DOCTOR</code>, <code>NURSE</code>, <code>TRIAGE_STAFF</code>, <code>ADMIN</code>, and <code>SUPER_ADMIN</code>.
                  </p>
                </div>
                <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.2rem' }}>
                  <h4 style={{ fontWeight: 800, marginBottom: '0.35rem', color: 'var(--color-brand-700)' }}>Ephemeral Voice Buffers</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Temporary voice buffers and raw scans cleared per configured retention policy post-submission.
                  </p>
                </div>
                <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.2rem' }}>
                  <h4 style={{ fontWeight: 800, marginBottom: '0.35rem', color: 'var(--color-brand-700)' }}>FHIR R4 & ABDM Interop</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Generates valid HL7 FHIR R4 Bundle JSON with Patient, Encounter, Condition, MedicationStatement, Observation, and DocumentReference.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

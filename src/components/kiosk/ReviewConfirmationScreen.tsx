import React from 'react';
import { Patient, SupportedLanguage, ScannedDocument, Medication, LabResult } from '../../types/clinical';
import { FileCheck, ArrowRight, ArrowLeft, CheckCircle2, User, Activity, AlertTriangle, Pill } from 'lucide-react';
import { evaluateRedFlags } from '../../services/redFlagEngine';

interface Props {
  patient: Patient;
  answers: Record<string, any>;
  scannedDocs: ScannedDocument[];
  extractedMeds: Medication[];
  extractedLabs: LabResult[];
  lang: SupportedLanguage;
  onConfirm: () => void;
  onBack: () => void;
}

export const ReviewConfirmationScreen: React.FC<Props> = ({
  patient,
  answers,
  scannedDocs,
  extractedMeds,
  extractedLabs,
  lang,
  onConfirm,
  onBack
}) => {
  const evalResult = evaluateRedFlags('temp', patient.id, answers);
  const isRed = evalResult.priority === 'RED';

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'var(--color-brand-50)', padding: '0.45rem 1.2rem', borderRadius: 'var(--kiosk-radius-full)', color: 'var(--color-brand-700)', fontWeight: 600, marginBottom: '0.75rem' }}>
          <FileCheck size={20} />
          <span>Review & Confirmation / अंतिम समीक्षा व पुष्टि</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          {lang === 'hi' ? 'अपनी दर्ज जानकारी की समीक्षा करें' : 'Review & Confirm Your Intake'}
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
          {lang === 'hi'
            ? 'कृपया सबमिट करने से पहले अपने मुख्य लक्षण और विवरण की जांच करें।'
            : 'Please review your captured symptoms and scanned records before generating your token.'}
        </p>
      </div>

      {isRed && (
        <div className="red-flag-alert-card" style={{ padding: '1.25rem', borderRadius: 'var(--kiosk-radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertTriangle size={32} color="#dc2626" />
          <div>
            <div style={{ fontWeight: 800, color: '#991b1b', fontSize: '1.05rem' }}>HIGH PRIORITY EMERGENCY CASE IDENTIFIED</div>
            <div style={{ fontSize: '0.9rem', color: '#7f1d1d' }}>
              Your recorded symptoms (Chest pain with radiation/diaphoresis) will automatically place you at Priority 1 in the doctor queue.
            </div>
          </div>
        </div>
      )}

      {/* Review Summary Card */}
      <div style={{ background: '#ffffff', border: '2px solid var(--color-border)', borderRadius: 'var(--kiosk-radius-lg)', padding: '1.75rem', marginBottom: '2rem', boxShadow: 'var(--shadow-card)' }}>
        {/* Patient Profile Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-brand-50)', color: 'var(--color-brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{patient.name}</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {patient.gender} • {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} Yrs • Phone: {patient.phone}
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '0.3rem 0.7rem', borderRadius: '8px', background: 'var(--color-brand-100)', color: 'var(--color-brand-700)', alignSelf: 'center' }}>
            ABHA: {patient.abhaReference || patient.hospitalPatientId}
          </span>
        </div>

        {/* Symptoms Section */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-brand-700)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={18} /> Chief Complaint & Symptoms Recorded:
          </h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}>
            <div><strong>Main Complaint:</strong> {answers.chiefComplaint || 'None specified'}</div>
            {answers.radiation && <div><strong>Pain Radiation:</strong> {answers.radiation}</div>}
            {answers.onset && <div><strong>Onset:</strong> {answers.onset}</div>}
            {answers.severity && <div><strong>Severity Rating:</strong> {answers.severity}/10</div>}
            {answers.associatedSymptoms && (
              <div><strong>Associated Symptoms:</strong> {Array.isArray(answers.associatedSymptoms) ? answers.associatedSymptoms.join(', ') : answers.associatedSymptoms}</div>
            )}
            {answers.pastMedicalHistory && (
              <div><strong>Known Comorbidities:</strong> {Array.isArray(answers.pastMedicalHistory) ? answers.pastMedicalHistory.join(', ') : answers.pastMedicalHistory}</div>
            )}
            {answers.ayushPrakriti && (
              <div style={{ marginTop: '0.4rem', color: '#047857' }}>
                <strong>AYUSH Assessment:</strong> Prakriti: {answers.ayushPrakriti} • Agni: {answers.ayushAgni} • Koshtha: {answers.ayushKoshtha}
              </div>
            )}
          </div>
        </div>

        {/* Scanned Items Summary */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-brand-700)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Pill size={18} /> Attached Documents & Extracted Regimen:
          </h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.92rem' }}>
            <div><strong>Documents Scanned:</strong> {scannedDocs.length > 0 ? scannedDocs.map(d => d.fileName).join(', ') : 'No documents attached'}</div>
            {extractedMeds.length > 0 && (
              <div style={{ marginTop: '0.35rem' }}>
                <strong>Extracted Medications:</strong> {extractedMeds.map(m => `${m.name} ${m.dosage}`).join(', ')}
              </div>
            )}
            {extractedLabs.length > 0 && (
              <div style={{ marginTop: '0.35rem' }}>
                <strong>Extracted Lab Markers:</strong> {extractedLabs.map(l => `${l.testName} (${l.value} ${l.unit})`).join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={onBack}
          className="kiosk-btn-secondary"
        >
          <ArrowLeft size={20} />
          <span>Back / वापस</span>
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="kiosk-btn-primary"
          style={{ minWidth: '320px' }}
        >
          <CheckCircle2 size={24} />
          <span>Confirm & Submit Session / अंतिम पुष्टि</span>
        </button>
      </div>
    </div>
  );
};

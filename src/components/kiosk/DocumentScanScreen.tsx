import React, { useState } from 'react';
import { SupportedLanguage, ScannedDocument, MedicalEntity, LabResult, Medication, ClinicalTimelineEvent } from '../../types/clinical';
import { Camera, Upload, FileText, CheckCircle2, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { processDocumentAsync, SAMPLE_DOCUMENTS } from '../../services/ocrEngine';
import { speechService } from '../../services/speechService';

interface Props {
  patientId: string;
  sessionId: string;
  lang: SupportedLanguage;
  audioEnabled: boolean;
  onContinue: (
    docs: ScannedDocument[],
    entities: MedicalEntity[],
    labs: LabResult[],
    meds: Medication[],
    timeline: ClinicalTimelineEvent[]
  ) => void;
}

export const DocumentScanScreen: React.FC<Props> = ({
  patientId,
  sessionId,
  lang,
  audioEnabled,
  onContinue
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatusText, setOcrStatusText] = useState('');
  const [scannedDocs, setScannedDocs] = useState<ScannedDocument[]>([]);
  const [extractedLabs, setExtractedLabs] = useState<LabResult[]>([]);
  const [extractedMeds, setExtractedMeds] = useState<Medication[]>([]);
  const [extractedEntities, setExtractedEntities] = useState<MedicalEntity[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<ClinicalTimelineEvent[]>([]);

  const handleScanSample = async (sampleType: 'PRESCRIPTION' | 'LAB') => {
    setIsProcessing(true);
    setOcrProgress(10);
    setOcrStatusText('Queuing document in Celery + Redis OCR processing queue...');

    if (audioEnabled) {
      speechService.speak(
        lang === 'hi' ? 'दस्तावेज स्कैन किया जा रहा है। कृपया प्रतीक्षा करें।' : 'Scanning document. Please hold on.',
        lang
      );
    }

    const fileMeta = sampleType === 'PRESCRIPTION'
      ? { name: 'apollo_prescription_dr_verma.pdf', size: 420000 }
      : { name: 'thyrocare_lipid_glycemic_report.pdf', size: 690000 };

    const result = await processDocumentAsync(fileMeta, patientId, sessionId, (status, progress) => {
      setOcrProgress(progress);
      if (progress < 40) {
        setOcrStatusText('Pre-processing image: Contrast normalization & de-skewing...');
      } else if (progress < 75) {
        setOcrStatusText('Running Optical Character Recognition (Tesseract OCR Engine)...');
      } else {
        setOcrStatusText('Extracting clinical entities: Dosages, lab markers, and dates...');
      }
    });

    setScannedDocs(prev => [...prev, result.document]);
    setExtractedLabs(prev => [...prev, ...result.extractedLabs]);
    setExtractedMeds(prev => [...prev, ...result.extractedMedications]);
    setExtractedEntities(prev => [...prev, ...result.entities]);
    setTimelineEvents(prev => [...prev, ...result.timelineEvents]);
    setIsProcessing(false);

    if (audioEnabled) {
      speechService.speak(
        lang === 'hi' ? 'दस्तावेज का विश्लेषण पूरा हुआ।' : 'Document analyzed successfully.',
        lang
      );
    }
  };

  const handleFinish = () => {
    onContinue(scannedDocs, extractedEntities, extractedLabs, extractedMeds, timelineEvents);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'var(--color-brand-50)', padding: '0.45rem 1.2rem', borderRadius: 'var(--kiosk-radius-full)', color: 'var(--color-brand-700)', fontWeight: 600, marginBottom: '0.75rem' }}>
          <Camera size={20} />
          <span>Step 5 & 6: Document Scan & AI OCR / पर्चे व जांच स्कैन</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          {lang === 'hi' ? 'पुरानी पर्ची या जांच रिपोर्ट स्कैन करें' : 'Scan Past Prescriptions & Lab Reports'}
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
          {lang === 'hi'
            ? 'अपनी पिछली दवाइयों की पर्ची या टेस्ट रिपोर्ट को स्कैनर पर रखें या त्वरित डेमो चुनें।'
            : 'Place your paper prescription or diagnostic test on the kiosk scanner bed.'}
        </p>
      </div>

      {/* Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: '#ffffff', border: '2px solid var(--color-border)', borderRadius: 'var(--kiosk-radius-lg)', padding: '1.75rem', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-brand-50)', color: 'var(--color-brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <FileText size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Prescription Document</h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Extracts active medications, dosages, frequency, and prescribing doctor info.
          </p>
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleScanSample('PRESCRIPTION')}
            className="kiosk-btn-secondary"
            style={{ width: '100%', fontSize: '1rem', padding: '0.8rem 1rem' }}
          >
            <Sparkles size={18} color="var(--color-brand-600)" />
            <span>Scan Doctor Prescription</span>
          </button>
        </div>

        <div style={{ background: '#ffffff', border: '2px solid var(--color-border)', borderRadius: 'var(--kiosk-radius-lg)', padding: '1.75rem', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-accent-50)', color: 'var(--color-accent-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <Camera size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Diagnostic Lab Panel</h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Extracts blood sugar, HbA1c, lipid profile, and flags abnormal values automatically.
          </p>
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleScanSample('LAB')}
            className="kiosk-btn-secondary"
            style={{ width: '100%', fontSize: '1rem', padding: '0.8rem 1rem' }}
          >
            <Sparkles size={18} color="var(--color-accent-600)" />
            <span>Scan Blood & Lipid Report</span>
          </button>
        </div>
      </div>

      {/* Async OCR Processing Progress Bar */}
      {isProcessing && (
        <div style={{ background: '#ffffff', border: '2px solid var(--color-brand-600)', borderRadius: 'var(--kiosk-radius-lg)', padding: '1.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Loader2 size={24} className="animate-spin" color="var(--color-brand-600)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-brand-700)' }}>
                Document OCR & Entity Extraction Running (Async Queue)
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>{ocrStatusText}</div>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-brand-600)' }}>{ocrProgress}%</span>
          </div>

          <div style={{ height: '10px', width: '100%', background: 'var(--color-border)', borderRadius: 'var(--kiosk-radius-full)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${ocrProgress}%`, background: 'linear-gradient(90deg, var(--color-brand-500), var(--color-accent-500))', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* Scanned Findings Preview */}
      {scannedDocs.length > 0 && (
        <div style={{ background: '#ffffff', border: '2px solid var(--color-border)', borderRadius: 'var(--kiosk-radius-lg)', padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={22} color="var(--color-brand-600)" />
              Extracted Clinical Insights ({scannedDocs.length} Scanned)
            </h3>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, background: 'var(--color-brand-50)', color: 'var(--color-brand-700)', padding: '0.3rem 0.8rem', borderRadius: '12px' }}>
              Status: Verified & Normalized
            </span>
          </div>

          {/* Medications extracted */}
          {extractedMeds.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Extracted Active Medications:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {extractedMeds.map((med, i) => (
                  <span key={i} style={{ background: '#f1f5f9', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    💊 {med.name} <span style={{ color: 'var(--color-brand-700)' }}>{med.dosage}</span> ({med.frequency})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Labs extracted */}
          {extractedLabs.length > 0 && (
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Extracted Lab Values & Flagged Status:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {extractedLabs.map((lab, i) => (
                  <div
                    key={i}
                    style={{
                      background: lab.abnormalFlag ? '#fef2f2' : '#f8fafc',
                      border: lab.abnormalFlag ? '1.5px solid #dc2626' : '1px solid var(--color-border)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      fontSize: '0.88rem'
                    }}
                  >
                    <div style={{ fontWeight: 700, color: lab.abnormalFlag ? '#991b1b' : 'var(--color-text-main)' }}>
                      {lab.testName}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.2rem 0', color: lab.abnormalFlag ? '#dc2626' : 'var(--color-brand-700)' }}>
                      {lab.value} {lab.unit}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)' }}>
                      Ref: {lab.referenceRange} {lab.abnormalFlag && '⚠️ HIGH'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleFinish}
          className="kiosk-btn-secondary"
        >
          <span>{scannedDocs.length === 0 ? 'Skip Document Scan / छोड़ें' : 'Add Another Document'}</span>
        </button>

        <button
          type="button"
          onClick={handleFinish}
          className="kiosk-btn-primary"
        >
          <span>Generate Summary & Submit / समीक्षा करें</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

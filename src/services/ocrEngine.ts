// MediKiosk Document Intelligence & Async OCR Engine (06. AI/ML Architecture)
import { ScannedDocument, MedicalEntity, LabResult, Medication, ClinicalTimelineEvent } from '../types/clinical';

export interface OCRProcessingResult {
  document: ScannedDocument;
  entities: MedicalEntity[];
  extractedLabs: LabResult[];
  extractedMedications: Medication[];
  timelineEvents: ClinicalTimelineEvent[];
}

export const SAMPLE_DOCUMENTS = [
  {
    id: 'doc-sample-prescription',
    docType: 'PRESCRIPTION' as const,
    fileName: 'apollo_prescription_dr_verma.pdf',
    fileSize: '412 KB',
    institutionName: 'Apollo Hospitals Clinical Center',
    doctorName: 'Dr. Rajiv Verma, MD (Cardiology)',
    extractedDate: '2026-08-14',
    rawText: `APOLLO HOSPITALS
Dept of Internal Medicine & Cardiology
Date: 14-Aug-2026
Patient: Rajesh Kumar, Male, 54Y

Rx:
1. Tab. Telmisartan 40mg - 1 tablet once daily in morning (OD) after food.
2. Tab. Metformin 500mg - 1 tablet twice daily (BD) with meals.
3. Tab. Atorvastatin 20mg - 1 tablet at night (HS).
4. Tab. Ecosprin 75mg - 1 tablet after lunch (OD).

Advice: Low salt, diabetic diet. Review in 1 month with Fasting Blood Sugar and Lipid Profile.
Signed: Dr. Rajiv Verma, MD`,
    labs: [],
    meds: [
      { name: 'Telmisartan', dosage: '40mg', frequency: 'Once daily (Morning)', duration: '30 days' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily with meals', duration: '30 days' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime', duration: '30 days' },
      { name: 'Ecosprin', dosage: '75mg', frequency: 'Once daily after lunch', duration: '30 days' }
    ],
    timeline: {
      category: 'PRESCRIPTION' as const,
      title: 'Prescription Renewed (Cardiology)',
      description: 'Tab Telmisartan 40mg, Metformin 500mg, Atorvastatin 20mg by Dr. Rajiv Verma at Apollo Hospitals.'
    }
  },
  {
    id: 'doc-sample-lab',
    docType: 'LAB_REPORT' as const,
    fileName: 'thyrocare_lipid_glycemic_report.pdf',
    fileSize: '680 KB',
    institutionName: 'Thyrocare Technologies Ltd',
    doctorName: 'Dr. Neha Sharma, MD (Pathologist)',
    extractedDate: '2026-08-20',
    rawText: `THYROCARE DIAGNOSTICS
Comprehensive Metabolic & Lipid Panel
Sample Date: 20-Aug-2026

INVESTIGATION                RESULT      UNIT        REFERENCE RANGE      STATUS
Fasting Blood Sugar          178.0       mg/dL       70.0 - 100.0         HIGH [ABNORMAL]
HbA1c (Glycated Hb)          8.6         %           4.0 - 5.6            HIGH [ABNORMAL]
Total Cholesterol            242.0       mg/dL       125.0 - 200.0        HIGH [ABNORMAL]
Triglycerides                198.0       mg/dL       < 150.0              HIGH [ABNORMAL]
HDL Cholesterol              38.0        mg/dL       40.0 - 60.0          LOW  [ABNORMAL]
Serum Creatinine             0.95        mg/dL       0.70 - 1.20          NORMAL
eGFR                         88.0        mL/min      > 60.0               NORMAL`,
    labs: [
      { testName: 'Fasting Blood Sugar', value: '178.0', unit: 'mg/dL', referenceRange: '70-100', abnormalFlag: true },
      { testName: 'HbA1c', value: '8.6', unit: '%', referenceRange: '4.0-5.6', abnormalFlag: true },
      { testName: 'Total Cholesterol', value: '242.0', unit: 'mg/dL', referenceRange: '125-200', abnormalFlag: true },
      { testName: 'Triglycerides', value: '198.0', unit: 'mg/dL', referenceRange: '<150', abnormalFlag: true },
      { testName: 'Serum Creatinine', value: '0.95', unit: 'mg/dL', referenceRange: '0.7-1.2', abnormalFlag: false }
    ],
    meds: [],
    timeline: {
      category: 'INVESTIGATION' as const,
      title: 'Metabolic & Lipid Panel (Elevated HbA1c & Fasting Glucose)',
      description: 'HbA1c was elevated at 8.6% and Fasting Sugar at 178 mg/dL; Dyslipidemia noted with Total Cholesterol 242 mg/dL.'
    }
  }
];

export function processDocumentAsync(
  file: { name: string; size: number },
  patientId: string,
  sessionId: string,
  onStatusUpdate: (status: 'PENDING' | 'PROCESSING' | 'COMPLETED', progress: number) => void
): Promise<OCRProcessingResult> {
  return new Promise((resolve) => {
    onStatusUpdate('PENDING', 15);

    setTimeout(() => {
      onStatusUpdate('PROCESSING', 50);

      setTimeout(() => {
        onStatusUpdate('PROCESSING', 85);

        setTimeout(() => {
          onStatusUpdate('COMPLETED', 100);

          const isLab = file.name.toLowerCase().includes('lab') || file.name.toLowerCase().includes('report') || file.name.toLowerCase().includes('thyrocare');
          const sample = isLab ? SAMPLE_DOCUMENTS[1] : SAMPLE_DOCUMENTS[0];
          const docId = `doc-${Date.now()}`;

          const doc: ScannedDocument = {
            id: docId,
            patientId,
            sessionId,
            docType: sample.docType,
            fileName: file.name,
            fileSize: `${Math.round(file.size / 1024) || 320} KB`,
            ocrStatus: 'COMPLETED',
            extractedDate: sample.extractedDate,
            institutionName: sample.institutionName,
            doctorName: sample.doctorName,
            rawText: sample.rawText,
            extractedEntitiesCount: sample.labs.length + sample.meds.length + 4,
            uploadedAt: new Date().toISOString()
          };

          const entities: MedicalEntity[] = [
            {
              id: `ent-1-${docId}`,
              documentId: docId,
              entityType: 'DATE',
              text: sample.extractedDate,
              normalizedText: sample.extractedDate,
              confidence: 0.99
            },
            ...sample.meds.map((m, idx) => ({
              id: `ent-med-${idx}-${docId}`,
              documentId: docId,
              entityType: 'MEDICATION' as const,
              text: `${m.name} ${m.dosage}`,
              normalizedText: m.name,
              confidence: 0.95
            })),
            ...sample.labs.map((l, idx) => ({
              id: `ent-lab-${idx}-${docId}`,
              documentId: docId,
              entityType: 'TEST_NAME' as const,
              text: `${l.testName}: ${l.value} ${l.unit}`,
              normalizedText: l.testName,
              confidence: 0.97
            }))
          ];

          const extractedLabs: LabResult[] = sample.labs.map((l, idx) => ({
            id: `lab-${idx}-${docId}`,
            patientId,
            testName: l.testName,
            value: l.value,
            unit: l.unit,
            referenceRange: l.referenceRange,
            abnormalFlag: l.abnormalFlag,
            testDate: sample.extractedDate,
            sourceDocumentId: docId
          }));

          const extractedMedications: Medication[] = sample.meds.map((m, idx) => ({
            id: `med-${idx}-${docId}`,
            patientId,
            name: m.name,
            dosage: m.dosage,
            frequency: m.frequency,
            duration: m.duration,
            status: 'ACTIVE',
            source: 'PRESCRIPTION_OCR',
            sourceDocumentId: docId
          }));

          const timelineEvents: ClinicalTimelineEvent[] = [
            {
              id: `tl-${docId}`,
              patientId,
              date: sample.extractedDate,
              category: sample.timeline.category,
              title: sample.timeline.title,
              description: sample.timeline.description,
              sourceDocId: docId
            }
          ];

          resolve({
            document: doc,
            entities,
            extractedLabs,
            extractedMedications,
            timelineEvents
          });
        }, 600);
      }, 700);
    }, 600);
  });
}

// MediKiosk Pre-loaded Mock Patients for Doctor Triage Queue & Kiosk Testing
import { Patient, Session, ClinicalSummary, LabResult, Medication, ScannedDocument, ClinicalTimelineEvent, RedFlagAlert } from '../types/clinical';

export interface PatientQueueItem {
  patient: Patient;
  session: Session;
  summary: ClinicalSummary;
  labs: LabResult[];
  medications: Medication[];
  documents: ScannedDocument[];
  timeline: ClinicalTimelineEvent[];
  redFlags: RedFlagAlert[];
}

export const INITIAL_PATIENTS: PatientQueueItem[] = [
  {
    patient: {
      id: 'pat-101',
      hospitalPatientId: 'MRN-2026-0841',
      abhaReference: '91-4821-9943-1284@abdm',
      name: 'Ramesh Chandra Verma',
      dateOfBirth: '1968-04-12',
      gender: 'MALE',
      phone: '+91 98110 44219',
      preferredLanguage: 'hi',
      createdAt: '2026-09-10T15:20:00Z',
      updatedAt: '2026-09-10T15:45:00Z'
    },
    session: {
      id: 'sess-001',
      patientId: 'pat-101',
      tokenNumber: 'TK-101',
      mode: 'ALLOPATHY',
      status: 'TRIAGED',
      triagePriority: 'RED',
      priorityAlert: 'CRITICAL ALERT: Suspected Acute Coronary Syndrome (Chest Pain + Arm Radiation)',
      kioskId: 'KIOSK-OPD-01',
      startTime: '2026-09-10T15:30:00Z'
    },
    summary: {
      id: 'sum-101',
      patientId: 'pat-101',
      sessionId: 'sess-001',
      chiefComplaint: 'Chest Pain and Heaviness',
      hpiNarrative: 'Patient presented with sudden retrosternal squeezing chest pain initiated today morning (~3 hours duration). Severity rated 8/10. Pain radiates distinctly to the left arm and jaw. Accompanied by cold diaphoresis and mild exertional breathlessness.',
      pastMedicalSurgical: 'Chronic Conditions: Known Hypertension for 6 years, Type 2 Diabetes Mellitus on oral hypoglycemics. Prior angioplasty: None.',
      drugAndAllergyHistory: 'Current Regimen: Tab Telmisartan 40mg OD, Tab Metformin 500mg BD. Allergies: No Known Drug Allergies (NKDA).',
      familyPersonalHistory: 'Father had acute MI at age 52. Non-smoker, occasional alcohol.',
      reviewOfSystemsSummary: 'Cardiovascular: Positive for severe chest pressure, diaphoresis. Respiratory: Exertional shortness of breath. Neurological: Intact.',
      priorInvestigationsSummary: 'Prior ECG from 6 months ago showed normal sinus rhythm. Fasting blood sugar historically around 160 mg/dL.',
      suggestedDifferentials: [
        'Acute Coronary Syndrome (STEMI / NSTEMI)',
        'Unstable Angina',
        'Acute Pericarditis / Aortic Dissection (Rule out)'
      ],
      isDraft: true,
      status: 'PENDING_REVIEW',
      createdAt: '2026-09-10T15:40:00Z',
      updatedAt: '2026-09-10T15:40:00Z'
    },
    labs: [
      {
        id: 'lab-101-1',
        patientId: 'pat-101',
        testName: 'Capillary Blood Glucose (Point of Care)',
        value: '194',
        unit: 'mg/dL',
        referenceRange: '70-140',
        abnormalFlag: true,
        testDate: '2026-09-10'
      }
    ],
    medications: [
      {
        id: 'med-101-1',
        patientId: 'pat-101',
        name: 'Telmisartan',
        dosage: '40mg',
        frequency: 'Once Daily (Morning)',
        status: 'ACTIVE',
        source: 'PRESCRIPTION_OCR'
      },
      {
        id: 'med-101-2',
        patientId: 'pat-101',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice Daily',
        status: 'ACTIVE',
        source: 'PRESCRIPTION_OCR'
      }
    ],
    documents: [
      {
        id: 'doc-101-1',
        patientId: 'pat-101',
        sessionId: 'sess-001',
        docType: 'PRESCRIPTION',
        fileName: 'apollo_clinic_prescription.pdf',
        fileSize: '340 KB',
        ocrStatus: 'COMPLETED',
        extractedDate: '2026-07-28',
        institutionName: 'Apollo Clinic Triage',
        doctorName: 'Dr. V. Singhal, MD',
        rawText: 'Tab Telmisartan 40mg OD, Tab Metformin 500mg BD. Advised salt restriction.',
        extractedEntitiesCount: 4,
        uploadedAt: '2026-09-10T15:35:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-101-1',
        patientId: 'pat-101',
        date: '2026-09-10',
        category: 'SYMPTOM',
        title: 'Acute Chest Pain & Radiation',
        description: 'Sudden onset 8/10 retrosternal pressure radiating to left arm with cold diaphoresis.'
      },
      {
        id: 'tl-101-2',
        patientId: 'pat-101',
        date: '2026-07-28',
        category: 'PRESCRIPTION',
        title: 'Hypertension & Diabetes Followup',
        description: 'Telmisartan 40mg and Metformin 500mg prescribed by Dr. V. Singhal.'
      }
    ],
    redFlags: [
      {
        id: 'rf-101',
        sessionId: 'sess-001',
        patientId: 'pat-101',
        severity: 'RED',
        title: 'CRITICAL ALERT: Suspected Acute Coronary Syndrome',
        reason: 'Severe retrosternal chest discomfort radiating to left arm with diaphoresis.',
        triggerSymptom: 'Chest Pain radiating to Left Arm, Sweating, Severity: 8/10',
        actionRecommended: 'PRIORITY RED: Immediate transfer to Resuscitation / ECG bay. 12-lead ECG stat.',
        triggeredAt: '2026-09-10T15:37:00Z'
      }
    ]
  },
  {
    patient: {
      id: 'pat-102',
      hospitalPatientId: 'MRN-2026-0914',
      abhaReference: '91-3312-8874-9021@abdm',
      name: 'Sunita Devi Sharma',
      dateOfBirth: '1977-11-20',
      gender: 'FEMALE',
      phone: '+91 94150 78201',
      preferredLanguage: 'hi',
      createdAt: '2026-09-10T15:50:00Z',
      updatedAt: '2026-09-10T16:05:00Z'
    },
    session: {
      id: 'sess-002',
      patientId: 'pat-102',
      tokenNumber: 'TK-102',
      mode: 'ALLOPATHY',
      status: 'TRIAGED',
      triagePriority: 'YELLOW',
      priorityAlert: 'MODERATE ALERT: High Febrile Illness with Systemic Rigors (Fever 5+ days)',
      kioskId: 'KIOSK-OPD-02',
      startTime: '2026-09-10T15:55:00Z'
    },
    summary: {
      id: 'sum-102',
      patientId: 'pat-102',
      sessionId: 'sess-002',
      chiefComplaint: 'High Fever, Cough & Body Aches',
      hpiNarrative: 'Patient reports high continuous fever accompanied by severe shivering and chills for past 4 days. Productive cough with yellowish sputum. Discomfort rated 7/10. Generalized weakness and loss of appetite.',
      pastMedicalSurgical: 'Hypothyroidism on Levothyroxine 50mcg. No prior surgeries.',
      drugAndAllergyHistory: 'Tab Thyronorm 50mcg daily. Allergies: Penicillin (causes cutaneous rash).',
      familyPersonalHistory: 'No family history of chronic pulmonary illness. Non-smoker.',
      reviewOfSystemsSummary: 'Respiratory: Productive cough, mild bilateral chest tightness. ENT: Sore throat.',
      priorInvestigationsSummary: 'Scanned Complete Blood Count indicates elevated Leukocyte count (WBC 14,800/mcL).',
      suggestedDifferentials: [
        'Acute Lower Respiratory Tract Infection / Bronchopneumonia',
        'Acute Febrile Syndrome / Dengue / Malaria',
        'Viral Influenza'
      ],
      isDraft: true,
      status: 'PENDING_REVIEW',
      createdAt: '2026-09-10T16:02:00Z',
      updatedAt: '2026-09-10T16:02:00Z'
    },
    labs: [
      {
        id: 'lab-102-1',
        patientId: 'pat-102',
        testName: 'Total Leukocyte Count (WBC)',
        value: '14800',
        unit: 'cells/mcL',
        referenceRange: '4000-11000',
        abnormalFlag: true,
        testDate: '2026-09-09'
      },
      {
        id: 'lab-102-2',
        patientId: 'pat-102',
        testName: 'Platelet Count',
        value: '185000',
        unit: '/mcL',
        referenceRange: '150000-450000',
        abnormalFlag: false,
        testDate: '2026-09-09'
      }
    ],
    medications: [
      {
        id: 'med-102-1',
        patientId: 'pat-102',
        name: 'Thyronorm',
        dosage: '50mcg',
        frequency: 'Once Daily (Empty Stomach)',
        status: 'ACTIVE',
        source: 'PATIENT_REPORTED'
      }
    ],
    documents: [
      {
        id: 'doc-102-1',
        patientId: 'pat-102',
        sessionId: 'sess-002',
        docType: 'LAB_REPORT',
        fileName: 'lal_pathlabs_cbc_report.pdf',
        fileSize: '490 KB',
        ocrStatus: 'COMPLETED',
        extractedDate: '2026-09-09',
        institutionName: 'Dr. Lal PathLabs',
        doctorName: 'Dr. A. Mehra, Pathologist',
        rawText: 'WBC Count: 14,800 /mcL (High). Platelets: 185,000 /mcL.',
        extractedEntitiesCount: 5,
        uploadedAt: '2026-09-10T15:58:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-102-1',
        patientId: 'pat-102',
        date: '2026-09-10',
        category: 'SYMPTOM',
        title: 'High Febrile Episode with Rigors',
        description: 'Persistent temperature 102.8F with chills and productive yellow cough.'
      },
      {
        id: 'tl-102-2',
        patientId: 'pat-102',
        date: '2026-09-09',
        category: 'INVESTIGATION',
        title: 'Elevated WBC on CBC',
        description: 'Total Leukocyte count elevated at 14,800 indicating active bacterial/inflammatory response.'
      }
    ],
    redFlags: [
      {
        id: 'rf-102',
        sessionId: 'sess-002',
        patientId: 'pat-102',
        severity: 'YELLOW',
        title: 'MODERATE ALERT: High Febrile Illness with Shivering',
        reason: 'Sustained pyrexia with rigors and leukocytosis warrants fast-track clinical evaluation.',
        triggerSymptom: 'Fever with chills > 4 days, Severity 7/10',
        actionRecommended: 'PRIORITY YELLOW: Fast-track vitals check, chest auscultation, evaluate for sepsis markers.',
        triggeredAt: '2026-09-10T16:00:00Z'
      }
    ]
  },
  {
    patient: {
      id: 'pat-103',
      hospitalPatientId: 'MRN-2026-1028',
      abhaReference: '91-7721-0023-8831@abdm',
      name: 'Anand Gopal Joshi',
      dateOfBirth: '1984-08-14',
      gender: 'MALE',
      phone: '+91 98230 19382',
      preferredLanguage: 'en',
      createdAt: '2026-09-10T16:15:00Z',
      updatedAt: '2026-09-10T16:25:00Z'
    },
    session: {
      id: 'sess-003',
      patientId: 'pat-103',
      tokenNumber: 'TK-103',
      mode: 'AYUSH',
      status: 'TRIAGED',
      triagePriority: 'GREEN',
      kioskId: 'KIOSK-AYUSH-01',
      startTime: '2026-09-10T16:18:00Z'
    },
    summary: {
      id: 'sum-103',
      patientId: 'pat-103',
      sessionId: 'sess-003',
      chiefComplaint: 'Amavata / Bilateral Knee & Lumbar Joint Stiffness',
      hpiNarrative: 'Patient seeks Ayurvedic OPD consultation for progressive morning joint stiffness in bilateral knees and lower back persisting for past 2 months. Exacerbated in cold damp weather; relieved partially by dry fomentation (Valuka Sweda).',
      pastMedicalSurgical: 'No history of major surgical intervention. Past episode of gastritis.',
      drugAndAllergyHistory: 'Taking Yograj Guggulu intermittently. No known drug allergies.',
      familyPersonalHistory: 'Maternal history of Sandhivata (Osteoarthritis). Vegetarian diet with irregular meal timings.',
      reviewOfSystemsSummary: 'Musculoskeletal: Bilateral knee crepitus, lumbar stiffness. Agni: Vishama (irregular digestion with gas).',
      priorInvestigationsSummary: 'Scanned X-Ray Lumbosacral spine shows mild L4-L5 disc space reduction.',
      ayushSummary: 'AYURVEDIC DASHAVIDHA PARIKSHA ASSESSMENT:\n• Prakriti: Vata-Pitta\n• Agni: Vishama Agni with Ama accumulation\n• Koshtha: Krura (habitual constipation)\n• Satwa: Madhyama\n• Vyayama Shakti: Moderate\n• Suggested Treatment Line: Deepana-Pachana, Nirgundi Taila Abhyanga, and Matra Basti protocol.',
      suggestedDifferentials: [
        'Amavata (Rheumatoid spectrum)',
        'Sandhigata Vata (Osteoarthritis)',
        'Kati Graha (Lumbago)'
      ],
      isDraft: true,
      status: 'PENDING_REVIEW',
      createdAt: '2026-09-10T16:22:00Z',
      updatedAt: '2026-09-10T16:22:00Z'
    },
    labs: [],
    medications: [
      {
        id: 'med-103-1',
        patientId: 'pat-103',
        name: 'Yograj Guggulu',
        dosage: '2 tablets',
        frequency: 'Twice daily with warm water',
        status: 'ACTIVE',
        source: 'PATIENT_REPORTED'
      }
    ],
    documents: [],
    timeline: [
      {
        id: 'tl-103-1',
        patientId: 'pat-103',
        date: '2026-09-10',
        category: 'SYMPTOM',
        title: 'Morning Joint Stiffness & Lumbar Pain',
        description: 'Duration 2 months, worsening during cold monsoon weather.'
      }
    ],
    redFlags: []
  }
];

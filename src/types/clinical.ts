// MediKiosk – Complete Type System corresponding to Database Architecture (05) and AI/ML (06)

export type UserRole = 'PATIENT' | 'DOCTOR' | 'NURSE' | 'TRIAGE_STAFF' | 'ADMIN' | 'SUPER_ADMIN' | 'SYSTEM';
export type AuditAction = 'VIEW_SUMMARY' | 'EDIT_SUMMARY' | 'APPROVE_SUMMARY' | 'OCR_DOCUMENT' | 'EXPORT_FHIR' | 'TRIGGER_RED_FLAG' | 'INACTIVITY_PURGE' | 'SYSTEM_RESET';

export type TriagePriority = 'GREEN' | 'YELLOW' | 'RED';

export type IntakeMode = 'ALLOPATHY' | 'AYUSH';

export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'mr';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email?: string;
  licenseNumber?: string;
  department?: string;
}

export interface Patient {
  id: string;
  hospitalPatientId: string;
  abhaReference?: string;
  name: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  preferredLanguage: SupportedLanguage;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientProfile {
  id: string;
  patientId: string;
  bloodGroup?: string;
  heightCm?: number;
  weightKg?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
}

export interface Consent {
  id: string;
  patientId: string;
  consentType: 'CLINICAL_INTAKE' | 'AI_ASSISTANCE' | 'DOCUMENT_OCR' | 'DATA_SHARING';
  purpose: string;
  version: string;
  timestamp: string;
  status: 'GRANTED' | 'REVOKED';
  audioExplained: boolean;
  signatureReference?: string;
}

export interface Session {
  id: string;
  patientId: string;
  tokenNumber: string;
  mode: IntakeMode;
  status: 'IDENTIFIED' | 'CONSENTED' | 'CONVERSING' | 'SCANNING' | 'SUBMITTED' | 'TRIAGED' | 'COMPLETED';
  triagePriority: TriagePriority;
  priorityAlert?: string;
  kioskId: string;
  startTime: string;
  endTime?: string;
}

export interface ConversationMessage {
  id: string;
  sessionId: string;
  sender: 'SYSTEM' | 'PATIENT';
  text: string;
  audioTimestamp?: string;
  inputMode: 'VOICE' | 'TOUCH_TAP' | 'TEXT';
  structuredExtraction?: Record<string, any>;
  timestamp: string;
}

export interface ClinicalHistory {
  id: string;
  patientId: string;
  sessionId: string;
  chiefComplaint: string;
  historyPresentIllness: {
    onset: string;
    duration: string;
    location?: string;
    character?: string;
    severity: number; // 1 to 10
    radiation?: string;
    aggravatingFactors?: string[];
    relievingFactors?: string[];
    associatedSymptoms: string[];
  };
  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  familyHistory: string[];
  personalHistory: {
    smoking: boolean;
    alcohol: boolean;
    diet: 'VEGETARIAN' | 'NON_VEGETARIAN' | 'VEGAN';
    sleepHours?: number;
    appetite?: string;
  };
  reviewOfSystems: {
    cardiovascular?: string;
    respiratory?: string;
    gastrointestinal?: string;
    neurological?: string;
    musculoskeletal?: string;
  };
  ayushAssessment?: DashavidhaPariksha;
  createdAt: string;
}

export interface DashavidhaPariksha {
  prakriti: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshic';
  vikriti: string; // Current Dosha imbalance
  sara: 'Pravara' | 'Madhyama' | 'Avara'; // Tissue excellence
  samhanana: 'Compact' | 'Moderate' | 'Frail'; // Body build/compactness
  pramana: 'Normal' | 'Disproportionate'; // Anthropometry
  satmya: 'Oka-satmya' | 'Desha-satmya' | 'Ritu-satmya'; // Habituation/tolerance
  satwa: 'Pravara (Strong)' | 'Madhyama (Moderate)' | 'Avara (Weak)'; // Mental endurance
  aharaShakti: 'Abhyavaharana (Good intake)' | 'Jarana (Good digestion)' | 'Manda (Sluggish)'; // Digestive capacity
  vyayamaShakti: 'High' | 'Moderate' | 'Low'; // Exercise/work capacity
  vaya: 'Balya (Youth)' | 'Madhyama (Middle)' | 'Vriddha (Elderly)'; // Age group
  agniType: 'Vishama' | 'Tikshna' | 'Manda' | 'Sama';
  koshtha: 'Krura' | 'Mrudu' | 'Madhyama';
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  status: 'ACTIVE' | 'DISCONTINUED';
  source: 'PATIENT_REPORTED' | 'PRESCRIPTION_OCR' | 'EHR';
  sourceDocumentId?: string;
}

export interface Allergy {
  id: string;
  patientId: string;
  allergen: string;
  category: 'MEDICATION' | 'FOOD' | 'ENVIRONMENTAL';
  reaction: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  verified: boolean;
}

export interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  abnormalFlag: boolean;
  testDate: string;
  sourceDocumentId?: string;
}

export interface ScannedDocument {
  id: string;
  patientId: string;
  sessionId: string;
  docType: 'PRESCRIPTION' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY' | 'RADIOLOGY' | 'OTHER';
  fileName: string;
  fileSize: string;
  thumbnailUrl?: string;
  ocrStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  extractedDate?: string;
  institutionName?: string;
  doctorName?: string;
  rawText?: string;
  extractedEntitiesCount?: number;
  uploadedAt: string;
}

export interface MedicalEntity {
  id: string;
  documentId: string;
  entityType: 'DIAGNOSIS' | 'MEDICATION' | 'TEST_NAME' | 'TEST_VALUE' | 'DATE' | 'DOSAGE';
  text: string;
  normalizedText: string;
  confidence: number;
}

export interface ClinicalTimelineEvent {
  id: string;
  patientId: string;
  date: string;
  category: 'SYMPTOM' | 'INVESTIGATION' | 'PRESCRIPTION' | 'HOSPITALIZATION';
  title: string;
  description: string;
  badgeColor?: string;
  sourceDocId?: string;
}

export interface RedFlagAlert {
  id: string;
  sessionId: string;
  patientId: string;
  severity: 'YELLOW' | 'RED';
  title: string;
  reason: string;
  triggerSymptom: string;
  actionRecommended: string;
  triggeredAt: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface ClinicalSummary {
  id: string;
  patientId: string;
  sessionId: string;
  chiefComplaint: string;
  hpiNarrative: string;
  pastMedicalSurgical: string;
  drugAndAllergyHistory: string;
  familyPersonalHistory: string;
  reviewOfSystemsSummary: string;
  priorInvestigationsSummary: string;
  ayushSummary?: string;
  suggestedDifferentials?: string[];
  isDraft: boolean;
  status: 'PENDING_REVIEW' | 'CONFIRMED' | 'REJECTED' | 'PUSHED_TO_EMR';
  consultationNotes?: string;
  addedPrescriptions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DoctorReview {
  id: string;
  summaryId: string;
  doctorId: string;
  doctorName: string;
  consultationNotes: string;
  differentialDiagnoses: string[];
  finalPlan: string;
  prescriptionsAdded: string[];
  approvedAt: string;
  emrSyncStatus: 'SYNCED' | 'PENDING' | 'ERROR';
  fhirBundleId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userRole: UserRole;
  patientId: string;
  action: AuditAction;
  resource: string;
  deviceIp: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'FLAGGED';
  details?: string;
}

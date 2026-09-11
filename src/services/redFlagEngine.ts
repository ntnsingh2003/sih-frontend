// MediKiosk Deterministic Red-Flag Safety Engine (06. AI/ML Architecture)
import { RedFlagAlert, TriagePriority } from '../types/clinical';

export interface EvaluationResult {
  priority: TriagePriority;
  alerts: RedFlagAlert[];
  safetyDisclaimers: string[];
}

export function evaluateRedFlags(sessionId: string, patientId: string, answers: Record<string, any>): EvaluationResult {
  const alerts: RedFlagAlert[] = [];
  const disclaimers: string[] = [
    'AI triage is a clinical assistive decision-support tool, NOT an autonomous medical diagnosis.',
    'All priority alerts must be immediately verified by certified nursing or emergency medical staff.'
  ];

  const chiefComplaint = answers.chiefComplaint || '';
  const radiation = answers.radiation || '';
  const associated = Array.isArray(answers.associatedSymptoms) ? answers.associatedSymptoms : [];
  const severity = Number(answers.severity) || 0;
  const onset = answers.onset || '';
  const pastHistory = Array.isArray(answers.pastMedicalHistory) ? answers.pastMedicalHistory : [];

  // RULE 1: Potential Acute Coronary Syndrome (ACS) / Myocardial Infarction
  if (
    chiefComplaint === 'Chest Pain' &&
    (radiation.includes('Left Arm') || associated.includes('Cold Sweating') || associated.includes('Breathlessness'))
  ) {
    alerts.push({
      id: `rf-acs-${Date.now()}`,
      sessionId,
      patientId,
      severity: 'RED',
      title: 'CRITICAL ALERT: Suspected Acute Coronary Syndrome',
      reason: 'Chest discomfort accompanied by radiation to left arm/jaw or diaphoresis (cold sweats). High probability of myocardial ischemia.',
      triggerSymptom: `Chest pain with radiation: "${radiation}", Associated: "${associated.join(', ')}"`,
      actionRecommended: 'PRIORITY RED: Direct patient immediately to Emergency / Triage Bay. Perform 12-lead ECG within 10 minutes. Check vitals (BP, SpO2, Pulse).',
      triggeredAt: new Date().toISOString()
    });
  }

  // RULE 2: Acute Respiratory Distress
  if (
    chiefComplaint === 'Breathlessness' ||
    (associated.includes('Breathlessness') && severity >= 8)
  ) {
    alerts.push({
      id: `rf-resp-${Date.now()}`,
      sessionId,
      patientId,
      severity: 'RED',
      title: 'CRITICAL ALERT: Acute Respiratory Compromise',
      reason: 'Severe difficulty breathing or rapid respiratory distress reported with high severity score.',
      triggerSymptom: `Breathlessness severity: ${severity}/10`,
      actionRecommended: 'PRIORITY RED: Check SpO2 immediately. Prepare supplemental oxygen therapy. Notify duty medical officer.',
      triggeredAt: new Date().toISOString()
    });
  }

  // RULE 3: Severe Sudden Headache with Dizziness / Neurological Red Flag
  if (
    chiefComplaint === 'Headache and Dizziness' &&
    (onset.includes('Today morning') || severity >= 9)
  ) {
    alerts.push({
      id: `rf-cva-${Date.now()}`,
      sessionId,
      patientId,
      severity: 'RED',
      title: 'PRIORITY ALERT: Acute Thunderclap Headache / Neurological Risk',
      reason: 'Sudden onset severe headache ("worst headache of life") or neurological vertigo reported.',
      triggerSymptom: `Headache onset: ${onset}, Severity: ${severity}/10`,
      actionRecommended: 'PRIORITY RED: Evaluate FAST stroke scale, check blood pressure, assess pupillary reflexes.',
      triggeredAt: new Date().toISOString()
    });
  }

  // RULE 4: Sepsis / High Infection Risk (YELLOW / MODERATE)
  if (associated.includes('Fever with Chills') && severity >= 7) {
    alerts.push({
      id: `rf-sepsis-${Date.now()}`,
      sessionId,
      patientId,
      severity: 'YELLOW',
      title: 'MODERATE ALERT: High Febrile Illness with Systemic Features',
      reason: 'High fever with severe rigors/chills warrants rapid evaluation for acute bacteremia or severe infection.',
      triggerSymptom: 'Fever with chills with severity >= 7/10',
      actionRecommended: 'PRIORITY YELLOW: Fast-track temperature and hemodynamic vitals. Schedule CBC, Peripheral Smear, and Urine R/M.',
      triggeredAt: new Date().toISOString()
    });
  }

  // RULE 5: High Risk Chronic Comorbidities with New Symptoms
  if (
    pastHistory.includes('Coronary Artery Disease') &&
    pastHistory.includes('Diabetes Mellitus Type 2') &&
    severity >= 6 &&
    alerts.length === 0
  ) {
    alerts.push({
      id: `rf-comorbid-${Date.now()}`,
      sessionId,
      patientId,
      severity: 'YELLOW',
      title: 'MODERATE ALERT: Vulnerable Diabetic & Cardiac Patient',
      reason: 'Patient presents with known CAD and Type 2 Diabetes; atypical presentations of acute events are common in diabetics.',
      triggerSymptom: 'CAD + Diabetes comorbidities with acute presentation',
      actionRecommended: 'PRIORITY YELLOW: Fast-track consultation, verify medication adherence, check capillary blood sugar.',
      triggeredAt: new Date().toISOString()
    });
  }

  // Calculate overall priority
  let overallPriority: TriagePriority = 'GREEN';
  if (alerts.some(a => a.severity === 'RED')) {
    overallPriority = 'RED';
  } else if (alerts.some(a => a.severity === 'YELLOW')) {
    overallPriority = 'YELLOW';
  }

  return {
    priority: overallPriority,
    alerts,
    safetyDisclaimers: disclaimers
  };
}

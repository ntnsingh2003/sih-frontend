// MediKiosk Summary Generator (06. AI/ML Architecture)
import { ClinicalSummary, LabResult, Medication } from '../types/clinical';

export function generateStructuredSummary(
  patientId: string,
  sessionId: string,
  mode: 'ALLOPATHY' | 'AYUSH',
  answers: Record<string, any>,
  ocrLabs: LabResult[] = [],
  ocrMeds: Medication[] = []
): ClinicalSummary {
  const chiefComplaint = answers.chiefComplaint || 'Unspecified complaint';
  const onset = answers.onset || 'Not documented';
  const severity = answers.severity ? `${answers.severity}/10` : 'Not rated';
  const radiation = answers.radiation || 'No radiation noted';
  const associated = Array.isArray(answers.associatedSymptoms) && answers.associatedSymptoms.length > 0
    ? answers.associatedSymptoms.join(', ')
    : 'None reported';

  // Format HPI Narrative
  const hpiNarrative = `Patient presented for digital intake reporting ${chiefComplaint.toLowerCase()}. ` +
    `Symptoms initiated ${onset.toLowerCase()} with an intensity rated at ${severity}. ` +
    (radiation !== 'None' ? `Discomfort is described as radiating to ${radiation}. ` : `No radiation to adjacent anatomical regions reported. `) +
    `Associated secondary manifestations include: ${associated}.`;

  // Format Past Medical/Surgical
  const pastIllnesses = Array.isArray(answers.pastMedicalHistory) && answers.pastMedicalHistory.length > 0 && !answers.pastMedicalHistory.includes('None')
    ? answers.pastMedicalHistory.join(', ')
    : 'No significant past chronic medical illnesses reported';
  const pastMedicalSurgical = `Chronic Conditions: ${pastIllnesses}. No major past surgical interventions declared by patient during kiosk intake.`;

  // Format Drug & Allergy History
  const allergyList = answers.allergies && answers.allergies !== 'No Known Drug Allergies'
    ? answers.allergies
    : 'No Known Drug Allergies (NKDA)';
  
  const medNames = ocrMeds.length > 0
    ? ocrMeds.map(m => `${m.name} (${m.dosage}, ${m.frequency})`).join('; ')
    : 'None captured from prior prescriptions';

  const drugAndAllergyHistory = `Current Regimen (Extracted/Reported): ${medNames}.\nAllergies: ${allergyList}.`;

  // Family & Personal
  const familyPersonalHistory = `Dietary pattern: Mixed/Omnivorous. Denies regular tobacco or excessive alcohol consumption. Sleep duration self-reported as adequate. Family history of premature coronary or metabolic disorders pending physician deep-dive.`;

  // Review of Systems
  const reviewOfSystemsSummary = `Cardiovascular: ${chiefComplaint.includes('Chest') ? 'Positive for chest heaviness' : 'No acute chest palpitations reported'}.\n` +
    `Respiratory: ${associated.includes('Breathlessness') ? 'Positive for exertional dyspnea' : 'Clear without chronic wheeze'}.\n` +
    `Gastrointestinal: Non-contributory.\n` +
    `Neurological: Denies motor deficits or focal weakness.`;

  // Prior Investigations Summary
  let priorInvestigationsSummary = 'No recent laboratory reports scanned during this session.';
  if (ocrLabs.length > 0) {
    const labLines = ocrLabs.map(l => 
      `- ${l.testName}: ${l.value} ${l.unit} (Ref: ${l.referenceRange}) ${l.abnormalFlag ? '[ABNORMAL/ALERT]' : '[NORMAL]'}`
    );
    priorInvestigationsSummary = `Extracted from uploaded diagnostic panel:\n${labLines.join('\n')}`;
  }

  // AYUSH Assessment if in AYUSH mode
  let ayushSummary: string | undefined = undefined;
  if (mode === 'AYUSH') {
    ayushSummary = `AYURVEDIC DASHAVIDHA PARIKSHA ASSESSMENT:\n` +
      `• Prakriti (Bodily Constitution): ${answers.ayushPrakriti || 'Vata-Pitta'}\n` +
      `• Agni (Digestive Fire): ${answers.ayushAgni || 'Vishama (Irregular)'}\n` +
      `• Koshtha (Bowel Habit): ${answers.ayushKoshtha || 'Madhyama'}\n` +
      `• Vyayama & Satwa Shakti: ${answers.ayushSatwaVyayama || 'Madhyama (Moderate resilience)'}\n` +
      `• Clinical Impression: Dosha dushya sammurchana suspected in Rasavaha and Asthivaha srotas. Recommended for Nadi Pariksha and personalized Panchakarma consultation.`;
  }

  // Suggested differentials (AI Assistive only - doctor makes actual diagnosis)
  const suggestedDifferentials: string[] = [];
  if (chiefComplaint === 'Chest Pain') {
    suggestedDifferentials.push('Acute Coronary Syndrome (Rule out NSTEMI/STEMI)', 'Gastroesophageal Reflux Disease (GERD)', 'Musculoskeletal Costochondritis');
  } else if (chiefComplaint === 'Breathlessness') {
    suggestedDifferentials.push('Bronchial Asthma Flare', 'Left Ventricular Dysfunction', 'Acute Lower Respiratory Tract Infection');
  } else if (chiefComplaint === 'Fever and Cough') {
    suggestedDifferentials.push('Acute Viral Upper Respiratory Infection', 'Bacterial Bronchitis', 'Community-Acquired Pneumonia');
  } else if (mode === 'AYUSH') {
    suggestedDifferentials.push('Amavata (Rheumatoid Spectrum)', 'Sandhigata Vata (Osteoarthritis)', 'Agnimandya with Ama Dosha');
  } else {
    suggestedDifferentials.push('Symptomatic Evaluation Required', 'Routine Health Surveillance');
  }

  return {
    id: `summary-${Date.now()}`,
    patientId,
    sessionId,
    chiefComplaint,
    hpiNarrative,
    pastMedicalSurgical,
    drugAndAllergyHistory,
    familyPersonalHistory,
    reviewOfSystemsSummary,
    priorInvestigationsSummary,
    ayushSummary,
    suggestedDifferentials,
    isDraft: true,
    status: 'PENDING_REVIEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

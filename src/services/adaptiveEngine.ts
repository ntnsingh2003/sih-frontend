// MediKiosk Adaptive Clinical Question Engine (06. AI/ML Architecture)
// Maintains a structured clinical question schema rather than a free-form chatbot.
// Asks one question at a time, branching follow-ups based on responses.

export interface QuestionOption {
  id: string;
  label: string;
  hindiLabel: string;
  value: any;
  triggersRedFlag?: boolean;
}

export interface IntakeQuestion {
  id: string;
  field: string;
  text: string;
  hindiText: string;
  audioPrompt: string;
  hindiAudioPrompt: string;
  type: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'SEVERITY_SCALE' | 'TEXT_OR_VOICE';
  options?: QuestionOption[];
  minVal?: number;
  maxVal?: number;
  category: 'CHIEF_COMPLAINT' | 'HPI' | 'ASSOCIATED' | 'PAST_HISTORY' | 'MEDICATIONS' | 'ALLERGIES' | 'AYUSH';
  nextQuestionId?: (answer: any, answers: Record<string, any>) => string | null;
}

export const ALLOPATHY_QUESTIONS: IntakeQuestion[] = [
  {
    id: 'chief_complaint',
    field: 'chiefComplaint',
    category: 'CHIEF_COMPLAINT',
    text: 'What brings you to the clinic today? Select or speak your main problem.',
    hindiText: 'आज आप अस्पताल किस समस्या के लिए आए हैं? मुख्य कारण चुनें या बोलें।',
    audioPrompt: 'What is your main complaint today? You can tap an option or tap the microphone to speak.',
    hindiAudioPrompt: 'आज आपकी मुख्य समस्या क्या है? आप विकल्प छू सकते हैं या बोल सकते हैं।',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'chest_pain', label: 'Chest Pain / Heaviness', hindiLabel: 'सीने में दर्द या भारीपन', value: 'Chest Pain' },
      { id: 'fever_cough', label: 'Fever, Cough & Cold', hindiLabel: 'बुखार, खांसी और जुकाम', value: 'Fever and Cough' },
      { id: 'breathlessness', label: 'Difficulty in Breathing', hindiLabel: 'सांस लेने में तकलीफ', value: 'Breathlessness' },
      { id: 'stomach_pain', label: 'Stomach / Abdominal Pain', hindiLabel: 'पेट में दर्द या मरोड़', value: 'Abdominal Pain' },
      { id: 'headache_dizzy', label: 'Severe Headache / Dizziness', hindiLabel: 'सिरदर्द या चक्कर आना', value: 'Headache and Dizziness' },
      { id: 'joint_pain', label: 'Joint Pain / Back Ache', hindiLabel: 'जोड़ों या कमर में दर्द', value: 'Joint Pain' },
      { id: 'diabetes_check', label: 'Diabetes / BP Routine Follow-up', hindiLabel: 'शुगर / बीपी की जांच व दवा', value: 'Routine Chronic Follow-up' }
    ],
    nextQuestionId: (ans) => {
      if (ans === 'Chest Pain') return 'chest_radiation';
      if (ans === 'Breathlessness') return 'onset';
      return 'onset';
    }
  },
  {
    id: 'chest_radiation',
    field: 'radiation',
    category: 'HPI',
    text: 'Does this chest pain spread or radiate to any other body part?',
    hindiText: 'क्या यह सीने का दर्द आपके बाएं हाथ, गर्दन या जबड़े में फैल रहा है?',
    audioPrompt: 'Does the chest pain spread to your left arm, jaw, or shoulder?',
    hindiAudioPrompt: 'क्या यह दर्द बाएं हाथ, गर्दन या जबड़े तक जाता है?',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'left_arm', label: 'Yes, spreads to Left Arm, Neck or Jaw', hindiLabel: 'हाँ, बाएं हाथ, गर्दन या जबड़े तक जाता है', value: 'Left Arm and Jaw', triggersRedFlag: true },
      { id: 'back', label: 'Spreads to Upper Back', hindiLabel: 'पीठ के ऊपरी हिस्से में फैलता है', value: 'Back Radiation' },
      { id: 'localized', label: 'No, stays strictly in center/ribs', hindiLabel: 'नहीं, केवल सीने में ही रहता है', value: 'None' }
    ],
    nextQuestionId: () => 'onset'
  },
  {
    id: 'onset',
    field: 'onset',
    category: 'HPI',
    text: 'When did your symptoms start?',
    hindiText: 'यह समस्या कब शुरू हुई?',
    audioPrompt: 'When did your symptoms start?',
    hindiAudioPrompt: 'यह तकलीफ कब से शुरू हुई है?',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'today', label: 'Today Morning (Sudden)', hindiLabel: 'आज सुबह (अचानक शुरू हुआ)', value: 'Today morning' },
      { id: 'few_days', label: '2 to 3 Days Ago', hindiLabel: '2 से 3 दिन पहले', value: '2-3 days ago' },
      { id: 'one_week', label: 'About 1 Week Ago', hindiLabel: 'लगभग 1 सप्ताह पहले', value: '1 week ago' },
      { id: 'chronic', label: 'More than a month (Long-standing)', hindiLabel: 'एक महीने से ज्यादा समय से', value: 'Chronic (>1 month)' }
    ],
    nextQuestionId: () => 'severity'
  },
  {
    id: 'severity',
    field: 'severity',
    category: 'HPI',
    text: 'How severe is your discomfort right now on a scale of 1 to 10?',
    hindiText: '1 से 10 के पैमाने पर आपका दर्द या परेशानी कितनी गंभीर है?',
    audioPrompt: 'Please rate your discomfort level from 1 mild to 10 unbearable.',
    hindiAudioPrompt: '1 से 10 के पैमाने पर दर्द की गंभीरता बताएं।',
    type: 'SEVERITY_SCALE',
    minVal: 1,
    maxVal: 10,
    nextQuestionId: () => 'associated_symptoms'
  },
  {
    id: 'associated_symptoms',
    field: 'associatedSymptoms',
    category: 'ASSOCIATED',
    text: 'Do you have any of these additional symptoms with it?',
    hindiText: 'क्या आपको इनमें से कोई अन्य लक्षण भी महसूस हो रहे हैं?',
    audioPrompt: 'Select all associated symptoms you are currently experiencing.',
    hindiAudioPrompt: 'साथ में महसूस होने वाले अन्य सभी लक्षण चुनें।',
    type: 'MULTI_CHOICE',
    options: [
      { id: 'sweating', label: 'Profuse Sweating / Cold Sweat', hindiLabel: 'बहुत पसीना आना या घबराहट', value: 'Cold Sweating', triggersRedFlag: true },
      { id: 'short_breath', label: 'Breathlessness / Difficulty Breathing', hindiLabel: 'सांस फूलना या घबराहट', value: 'Breathlessness', triggersRedFlag: true },
      { id: 'nausea', label: 'Nausea or Vomiting', hindiLabel: 'उल्टी या जी मिचलाना', value: 'Nausea / Vomiting' },
      { id: 'chills', label: 'High Fever with Shivering / Chills', hindiLabel: 'कंपकंपी के साथ तेज बुखार', value: 'Fever with Chills' },
      { id: 'dizziness', label: 'Feeling Faint or Loss of Balance', hindiLabel: 'बेहोशी जैसा लगना या चक्कर', value: 'Presyncope / Dizziness' },
      { id: 'none', label: 'None of these', hindiLabel: 'इनमें से कोई नहीं', value: 'None' }
    ],
    nextQuestionId: () => 'past_history'
  },
  {
    id: 'past_history',
    field: 'pastMedicalHistory',
    category: 'PAST_HISTORY',
    text: 'Do you have any long-term medical conditions?',
    hindiText: 'क्या आपको इनमें से कोई पुरानी बीमारी है?',
    audioPrompt: 'Do you have any existing chronic illnesses such as diabetes or high blood pressure?',
    hindiAudioPrompt: 'क्या आपको पहले से कोई बीमारी जैसे शुगर या बीपी है?',
    type: 'MULTI_CHOICE',
    options: [
      { id: 'htn', label: 'High Blood Pressure (Hypertension)', hindiLabel: 'उच्च रक्तचाप (हाई बीपी)', value: 'Hypertension' },
      { id: 'dm', label: 'Diabetes (High Blood Sugar)', hindiLabel: 'मधुमेह (शुगर)', value: 'Diabetes Mellitus Type 2' },
      { id: 'cad', label: 'Heart Problem / Prior Stent or Attack', hindiLabel: 'दिल की बीमारी / पुराना स्टेंट', value: 'Coronary Artery Disease' },
      { id: 'asthma', label: 'Asthma or Breathing Allergy', hindiLabel: 'दमा या सांस की एलर्जी', value: 'Asthma/COPD' },
      { id: 'thyroid', label: 'Thyroid Disorder', hindiLabel: 'थायराइड की समस्या', value: 'Thyroid' },
      { id: 'none', label: 'No Prior Illness / Healthy', hindiLabel: 'कोई बीमारी नहीं है', value: 'None' }
    ],
    nextQuestionId: () => 'allergies_check'
  },
  {
    id: 'allergies_check',
    field: 'allergies',
    category: 'ALLERGIES',
    text: 'Do you have any known allergies to medicines or food items?',
    hindiText: 'क्या आपको किसी दवा या खाने की चीज से एलर्जी है?',
    audioPrompt: 'Do you have any known allergies to medicines such as penicillin or painkillers?',
    hindiAudioPrompt: 'क्या आपको किसी दवा से कोई एलर्जी या रिएक्शन होता है?',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'penicillin', label: 'Yes - Penicillin or Antibiotics', hindiLabel: 'हाँ - पेनिसिलिन या एंटीबायोटिक से', value: 'Penicillin Allergy' },
      { id: 'nsaids', label: 'Yes - Painkillers (Aspirin / Brufen)', hindiLabel: 'हाँ - दर्द निवारक दवाओं से', value: 'NSAID / Aspirin Allergy' },
      { id: 'sulfa', label: 'Yes - Sulfa Drugs', hindiLabel: 'हाँ - सल्फा दवाओं से', value: 'Sulfa Allergy' },
      { id: 'no_allergies', label: 'No Known Drug Allergies (NKDA)', hindiLabel: 'नहीं, किसी दवा से एलर्जी नहीं है', value: 'No Known Drug Allergies' }
    ],
    nextQuestionId: () => null // End of questioning
  }
];

// AYUSH Mode Questions (Dashavidha Pariksha Parameters)
export const AYUSH_QUESTIONS: IntakeQuestion[] = [
  {
    id: 'ayush_chief_complaint',
    field: 'chiefComplaint',
    category: 'AYUSH',
    text: 'What is your primary health concern for Ayurveda consultation?',
    hindiText: 'आयुर्वेद परामर्श हेतु आपकी मुख्य स्वास्थ्य समस्या क्या है?',
    audioPrompt: 'Please select your primary condition for this Ayurvedic clinical intake.',
    hindiAudioPrompt: 'आयुर्वेदिक चिकित्सा के लिए अपनी मुख्य समस्या चुनें।',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'amavata', label: 'Joint Stiffness & Pain (Amavata / Sandhigata Vata)', hindiLabel: 'जोड़ों का दर्द व जकड़न (आमवात / संधिवात)', value: 'Amavata / Sandhigata Vata' },
      { id: 'ajirna', label: 'Digestive Issues, Hyperacidity (Amlapitta / Ajirna)', hindiLabel: 'गैस, एसिडिटी, अपच (अम्लपित्त / अजीर्ण)', value: 'Amlapitta / Agnimandya' },
      { id: 'prameha', label: 'Metabolic & Sugar Imbalance (Prameha / Madhumeha)', hindiLabel: 'मधुमेह व वजन संतुलन (प्रमेह)', value: 'Prameha / Madhumeha' },
      { id: 'kasa', label: 'Chronic Cough / Allergy (Kasa / Shwasa)', hindiLabel: 'जीर्ण खांसी व सांस की समस्या (कास / श्वास)', value: 'Kasa / Shwasa' },
      { id: 'twak', label: 'Skin Conditions (Twak Roga / Kushtha)', hindiLabel: 'त्वचा के विकार (त्वक रोग)', value: 'Twak Roga' }
    ],
    nextQuestionId: () => 'ayush_prakriti'
  },
  {
    id: 'ayush_prakriti',
    field: 'ayushPrakriti',
    category: 'AYUSH',
    text: 'Prakriti Pariksha: Which physical & mental temperament matches you best?',
    hindiText: 'प्रकृति परीक्षा: आपकी शारीरिक व स्वभाविक प्रवृत्ति किस प्रकार की है?',
    audioPrompt: 'Which Prakriti or bodily constitution best represents your natural state?',
    hindiAudioPrompt: 'आपकी प्राकृतिक शारीरिक रचना व प्रकृति कौन सी है?',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'vata', label: 'Vata: Lean build, dry skin, sensitive to cold, active mind', hindiLabel: 'वात: दुबला शरीर, सूखी त्वचा, ठंड से संवेदनशीलता', value: 'Vata' },
      { id: 'pitta', label: 'Pitta: Medium build, warm body, sharp appetite, intense focus', hindiLabel: 'पित्त: मध्यम शरीर, अधिक भूख-प्यास, गर्मी सहन न होना', value: 'Pitta' },
      { id: 'kapha', label: 'Kapha: Solid sturdy build, calm, slow digestion, thick hair', hindiLabel: 'कफ: मजबूत सुगठित शरीर, शांत स्वभाव, मंद पाचन', value: 'Kapha' },
      { id: 'vata_pitta', label: 'Vata-Pitta Combination', hindiLabel: 'वात-पित्त मिश्रित', value: 'Vata-Pitta' },
      { id: 'pitta_kapha', label: 'Pitta-Kapha Combination', hindiLabel: 'पित्त-कफ मिश्रित', value: 'Pitta-Kapha' }
    ],
    nextQuestionId: () => 'ayush_agni'
  },
  {
    id: 'ayush_agni',
    field: 'ayushAgni',
    category: 'AYUSH',
    text: 'Agni Pariksha: How is your digestive power and appetite?',
    hindiText: 'अग्नि परीक्षा: आपकी भूख और भोजन पचाने की शक्ति कैसी है?',
    audioPrompt: 'How is your digestion and appetite?',
    hindiAudioPrompt: 'आपकी भूख और पाचन शक्ति कैसी रहती है?',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'sama', label: 'Sama Agni: Normal, steady appetite and smooth digestion', hindiLabel: 'सम अग्नि: सामान्य, नियमित भूख और उत्तम पाचन', value: 'Sama' },
      { id: 'tikshna', label: 'Tikshna Agni: Intense hunger, burns food fast, burning sensation', hindiLabel: 'तीक्ष्ण अग्नि: बहुत तेज भूख, जलन होना', value: 'Tikshna' },
      { id: 'manda', label: 'Manda Agni: Low appetite, feeling heavy, slow digestion', hindiLabel: 'मन्द अग्नि: कम भूख लगना, पेट भारी रहना', value: 'Manda' },
      { id: 'vishama', label: 'Vishama Agni: Irregular appetite, bloating, gas', hindiLabel: 'विषम अग्नि: कभी तेज कभी कम भूख, गैस बनना', value: 'Vishama' }
    ],
    nextQuestionId: () => 'ayush_koshtha'
  },
  {
    id: 'ayush_koshtha',
    field: 'ayushKoshtha',
    category: 'AYUSH',
    text: 'Koshtha Pariksha: How are your bowel movements?',
    hindiText: 'कोष्ठ परीक्षा: आपका पेट साफ होने की स्थिति कैसी रहती है?',
    audioPrompt: 'What is your regular bowel habit?',
    hindiAudioPrompt: 'पेट साफ होने की आदत कैसी है?',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'madhyama', label: 'Madhyama: Normal, once daily without strain', hindiLabel: 'मध्यम: प्रतिदिन सामान्य व बिना परेशानी के', value: 'Madhyama' },
      { id: 'krura', label: 'Krura: Hard stools, prone to chronic constipation', hindiLabel: 'क्रूर: सख्त मल, कब्ज की शिकायत रहना', value: 'Krura' },
      { id: 'mrudu', label: 'Mrudu: Soft/loose stools, sensitive to milk or mild food', hindiLabel: 'मृदु: ढीला मल, दूध या हल्की चीज से भी पेट चलना', value: 'Mrudu' }
    ],
    nextQuestionId: () => 'ayush_satwa_vyayama'
  },
  {
    id: 'ayush_satwa_vyayama',
    field: 'ayushSatwaVyayama',
    category: 'AYUSH',
    text: 'Vyayama & Satwa Shakti: Physical work capacity and mental resilience?',
    hindiText: 'व्यायाम व सत्व शक्ति: आपका शारीरिक बल और मानसिक धैर्य कैसा है?',
    audioPrompt: 'How is your work capacity and stress tolerance?',
    hindiAudioPrompt: 'शारीरिक परिश्रम और मानसिक तनाव सहने की क्षमता कैसी है?',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'pravara', label: 'High stamina, physically active, resilient under stress', hindiLabel: 'उत्तम: भरपूर स्फूर्ति, कठिन परिश्रम व तनाव सहने में सक्षम', value: 'Pravara' },
      { id: 'madhyama_bal', label: 'Moderate stamina, tires on heavy exertion', hindiLabel: 'मध्यम: सामान्य क्षमता, अधिक काम से थकान', value: 'Madhyama' },
      { id: 'avara', label: 'Low stamina, easily fatigued, anxious under minor stress', hindiLabel: 'अवर: जल्दी थकान, कमजोरी व घबराहट', value: 'Avara' }
    ],
    nextQuestionId: () => null
  }
];

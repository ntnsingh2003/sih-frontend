import React, { useState, useEffect } from 'react';
import { IntakeQuestion, QuestionOption } from '../../services/adaptiveEngine';
import { SupportedLanguage, IntakeMode } from '../../types/clinical';
import { Mic, Volume2, ArrowRight, ArrowLeft, AlertTriangle, Check } from 'lucide-react';
import { speechService } from '../../services/speechService';
import { evaluateRedFlags } from '../../services/redFlagEngine';

interface Props {
  questions: IntakeQuestion[];
  mode: IntakeMode;
  lang: SupportedLanguage;
  audioEnabled: boolean;
  sessionId: string;
  patientId: string;
  onComplete: (answers: Record<string, any>) => void;
}

export const IntakeQuestionsScreen: React.FC<Props> = ({
  questions,
  mode,
  lang,
  audioEnabled,
  sessionId,
  patientId,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  useEffect(() => {
    if (!currentQuestion) return;

    if (audioEnabled) {
      const textToSpeak = lang === 'hi' ? currentQuestion.hindiAudioPrompt : currentQuestion.audioPrompt;
      speechService.speak(textToSpeak, lang);
    }

    return () => {
      speechService.stopSpeaking();
      speechService.stopListening();
    };
  }, [currentIndex, currentQuestion, lang, audioEnabled]);

  useEffect(() => {
    const evalResult = evaluateRedFlags(sessionId, patientId, answers);
    if (evalResult.alerts.length > 0 && evalResult.alerts[0].severity === 'RED') {
      setActiveAlert(evalResult.alerts[0].title + ': ' + evalResult.alerts[0].reason);
    } else {
      setActiveAlert(null);
    }
  }, [answers, sessionId, patientId]);

  if (!currentQuestion) {
    return null;
  }

  const currentValue = answers[currentQuestion.field];

  const handleOptionSelect = (option: QuestionOption) => {
    let updatedVal: any;

    if (currentQuestion.type === 'MULTI_CHOICE') {
      const existing: string[] = Array.isArray(currentValue) ? [...currentValue] : [];
      if (option.value === 'None') {
        updatedVal = ['None'];
      } else {
        const filtered = existing.filter(item => item !== 'None');
        if (filtered.includes(option.value)) {
          updatedVal = filtered.filter(item => item !== option.value);
        } else {
          updatedVal = [...filtered, option.value];
        }
      }
    } else {
      updatedVal = option.value;
    }

    const updatedAnswers = {
      ...answers,
      [currentQuestion.field]: updatedVal
    };
    setAnswers(updatedAnswers);

    if (currentQuestion.type === 'SINGLE_CHOICE') {
      setTimeout(() => {
        moveToNext(updatedAnswers);
      }, 300);
    }
  };

  const moveToNext = (currentAnsState = answers) => {
    const nextQId = currentQuestion.nextQuestionId
      ? currentQuestion.nextQuestionId(currentAnsState[currentQuestion.field], currentAnsState)
      : null;

    if (nextQId) {
      const targetIdx = questions.findIndex(q => q.id === nextQId);
      if (targetIdx !== -1) {
        setCurrentIndex(targetIdx);
        return;
      }
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(currentAnsState);
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      speechService.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setRecognizedText('');
      const started = speechService.startListening(
        lang,
        (text, isFinal) => {
          setRecognizedText(text);
          if (isFinal) {
            setIsRecording(false);
            const matchedOption = currentQuestion.options?.find(opt =>
              text.toLowerCase().includes(opt.label.toLowerCase()) ||
              text.toLowerCase().includes(opt.hindiLabel.toLowerCase())
            );

            const chosenVal = matchedOption ? matchedOption.value : text;
            const updated = {
              ...answers,
              [currentQuestion.field]: chosenVal
            };
            setAnswers(updated);
            setTimeout(() => moveToNext(updated), 350);
          }
        },
        (err) => {
          setIsRecording(false);
        }
      );

      if (!started) {
        setIsRecording(false);
      }
    }
  };

  const playCurrentAudio = () => {
    const textToSpeak = lang === 'hi' ? currentQuestion.hindiAudioPrompt : currentQuestion.audioPrompt;
    speechService.speak(textToSpeak, lang);
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '580px', justifyContent: 'space-between' }}>
      <div>
        {/* Sleek Progress Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-brand-600)' }} />
              {mode === 'AYUSH' ? '🌿 AYUSH Dashavidha Pariksha' : '🩺 Clinical Consultation'} • Question {currentIndex + 1} of {questions.length}
            </span>
            <span style={{ color: 'var(--color-brand-700)', fontFamily: 'var(--font-family-mono)', fontWeight: 800 }}>{progressPercent}% Complete</span>
          </div>
          <div style={{ height: '6px', width: '100%', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #10b981, #059669)', transition: 'width 0.25s ease' }} />
          </div>
        </div>

        {/* Real-time Red-Flag Emergency Banner */}
        {activeAlert && (
          <div className="red-flag-alert-card" style={{ padding: '1.1rem 1.4rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AlertTriangle size={28} color="#e11d48" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ color: '#9f1239', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em' }}>CRITICAL SAFETY ALERT IDENTIFIED</div>
              <div style={{ color: '#881337', fontSize: '0.9rem', fontWeight: 500, marginTop: '0.15rem' }}>{activeAlert}</div>
              <div style={{ fontSize: '0.82rem', color: '#be123c', fontWeight: 700, marginTop: '0.25rem' }}>
                Priority triage notification dispatched to attending medical officer.
              </div>
            </div>
          </div>
        )}

        {/* Question Surface */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--color-border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          marginBottom: '1.75rem',
          boxShadow: 'var(--shadow-card)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', lineHeight: '1.3', letterSpacing: '-0.03em' }}>
              {lang === 'hi' ? currentQuestion.hindiText : currentQuestion.text}
            </h2>
            <button
              onClick={playCurrentAudio}
              title="Audio prompt"
              style={{
                background: 'var(--color-brand-50)',
                color: 'var(--color-brand-700)',
                border: '1px solid var(--color-brand-200)',
                borderRadius: '50%',
                width: '46px',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <Volume2 size={20} />
            </button>
          </div>

          <p style={{ fontSize: '1rem', color: 'var(--color-text-subtle)', fontWeight: 500 }}>
            {lang === 'hi' ? currentQuestion.text : currentQuestion.hindiText}
          </p>
        </div>

        {/* Input Controls */}
        {currentQuestion.type === 'SEVERITY_SCALE' ? (
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.2rem 2rem',
            textAlign: 'center',
            marginBottom: '1.75rem',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{
              fontSize: '3.4rem',
              fontWeight: 900,
              fontFamily: 'var(--font-family-display)',
              color: (currentValue || 5) >= 7 ? '#e11d48' : 'var(--color-brand-700)',
              marginBottom: '0.2rem',
              letterSpacing: '-0.04em'
            }}>
              {currentValue || 5} <span style={{ fontSize: '1.4rem', color: 'var(--color-text-subtle)', fontWeight: 600 }}>/ 10</span>
            </div>

            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
              {(currentValue || 5) <= 3 ? '🟢 Mild Pain' : (currentValue || 5) <= 6 ? '🟡 Moderate Discomfort' : '🔴 Severe / High Priority'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '0.45rem', marginBottom: '1rem' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isSelected = (currentValue || 5) === num;
                const isHigh = num >= 7;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setAnswers({ ...answers, [currentQuestion.field]: num })}
                    style={{
                      padding: '1.1rem 0',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? (isHigh ? '#e11d48' : 'var(--color-brand-600)') : '#f8fafc',
                      color: isSelected ? '#ffffff' : 'var(--color-text-main)',
                      border: isSelected ? 'none' : '1px solid #e2e8f0',
                      fontWeight: 800,
                      fontSize: '1.3rem',
                      fontFamily: 'var(--font-family-mono)',
                      boxShadow: isSelected ? '0 4px 14px rgba(5, 150, 105, 0.25)' : 'none',
                      transition: 'all 0.12s ease'
                    }}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            {currentQuestion.options?.map((option) => {
              const isSelected = currentQuestion.type === 'MULTI_CHOICE'
                ? Array.isArray(currentValue) && currentValue.includes(option.value)
                : currentValue === option.value;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  className={`kiosk-choice-tile ${isSelected ? 'selected' : ''}`}
                >
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: currentQuestion.type === 'MULTI_CHOICE' ? '6px' : '50%',
                    border: isSelected ? 'none' : '2px solid #cbd5e1',
                    background: isSelected ? 'var(--color-brand-600)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    flexShrink: 0
                  }}>
                    {isSelected && <Check size={16} strokeWidth={3} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: isSelected ? 'var(--color-brand-950)' : 'var(--color-text-main)' }}>
                      {lang === 'hi' ? option.hindiLabel : option.label}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', fontWeight: 500, marginTop: '0.15rem' }}>
                      {lang === 'hi' ? option.label : option.hindiLabel}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Live Speech Recognition Display */}
        {isRecording && (
          <div style={{
            background: '#ffffff',
            border: '1.5px solid var(--color-brand-600)',
            borderRadius: 'var(--radius-md)',
            padding: '1.2rem 1.6rem',
            textAlign: 'center',
            marginBottom: '1.75rem',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-brand-700)', fontWeight: 700, marginBottom: '0.35rem', fontSize: '0.92rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e11d48', display: 'inline-block' }} />
              Acoustic Voice Capture Active / आपकी आवाज सुनी जा रही है
            </div>
            <div style={{ fontSize: '1.15rem', color: 'var(--color-text-main)', fontStyle: 'italic', fontWeight: 600 }}>
              "{recognizedText || 'Speak naturally in Hindi or English...'}"
            </div>
          </div>
        )}
      </div>

      {/* Luxury Bottom Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--color-border)',
        flexWrap: 'wrap'
      }}>
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="kiosk-btn-secondary"
          style={{ opacity: currentIndex === 0 ? 0.35 : 1 }}
        >
          <ArrowLeft size={18} />
          <span>Previous / पिछला</span>
        </button>

        {/* Voice Input Button */}
        <button
          type="button"
          onClick={handleVoiceToggle}
          className={isRecording ? 'mic-recording-active' : ''}
          style={{
            background: isRecording ? '#be123c' : '#ffffff',
            color: isRecording ? '#ffffff' : 'var(--color-brand-800)',
            border: '2px solid var(--color-brand-600)',
            borderRadius: '9999px',
            padding: '0.85rem 1.8rem',
            fontSize: '1.05rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <Mic size={20} />
          <span>{isRecording ? 'Listening... Tap to Complete' : 'Speak Answer / बोलकर बताएं'}</span>
        </button>

        <button
          type="button"
          onClick={() => moveToNext()}
          className="kiosk-btn-primary"
        >
          <span>{currentIndex === questions.length - 1 ? 'Complete & Scan Documents' : 'Next / आगे बढ़ें'}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { SupportedLanguage } from '../../types/clinical';
import { Mic, Volume2, CheckCircle2, ArrowRight, VolumeX, Sparkles } from 'lucide-react';
import { speechService } from '../../services/speechService';

interface Props {
  lang: SupportedLanguage;
  audioEnabled: boolean;
  onContinue: () => void;
}

export const VoiceCalibrationScreen: React.FC<Props> = ({ lang, audioEnabled, onContinue }) => {
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [testedText, setTestedText] = useState('');
  const [micWorking, setMicWorking] = useState(false);

  useEffect(() => {
    if (audioEnabled) {
      const msg = lang === 'hi'
        ? 'आवाज जांच: कृपया अपनी आवाज की जांच करें या सीधे आगे बढ़ें।'
        : 'Voice Calibration: Test your microphone or tap continue to proceed with touch input.';
      speechService.speak(msg, lang);
    }
  }, [lang, audioEnabled]);

  const testMicrophone = () => {
    setIsTestingMic(true);
    setTestedText('');
    const started = speechService.startListening(
      lang,
      (text, isFinal) => {
        setTestedText(text);
        if (isFinal) {
          setIsTestingMic(false);
          setMicWorking(true);
        }
      },
      (err) => {
        setIsTestingMic(false);
      }
    );

    if (!started) {
      setIsTestingMic(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'var(--color-brand-50)', padding: '0.45rem 1.2rem', borderRadius: 'var(--kiosk-radius-full)', color: 'var(--color-brand-700)', fontWeight: 600, marginBottom: '0.75rem' }}>
        <Mic size={20} />
        <span>Voice Calibration & Audio Check / आवाज जांच</span>
      </div>

      <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
        {lang === 'hi' ? 'माइक्रोफोन व आवाज परीक्षण' : 'Voice Calibration & Audio Guidance'}
      </h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        {lang === 'hi'
          ? 'आप बोलकर या स्क्रीन को छूकर उत्तर दे सकते हैं।'
          : 'You can answer upcoming questions by speaking or tapping tiles.'}
      </p>

      {/* Voice Check Card */}
      <div style={{ background: '#ffffff', border: '2px solid var(--color-border)', borderRadius: 'var(--kiosk-radius-lg)', padding: '2rem', marginBottom: '2rem', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: micWorking ? 'var(--color-brand-50)' : isTestingMic ? '#fef2f2' : 'var(--color-bg-card-secondary)', color: micWorking ? 'var(--color-brand-600)' : isTestingMic ? '#dc2626' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
          <Mic size={32} className={isTestingMic ? 'animate-bounce' : ''} />
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
          {micWorking ? '✅ Microphone Calibrated!' : isTestingMic ? 'Listening... Speak "Hello" or "नमस्ते"' : 'Test Voice Input'}
        </h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          {testedText ? `Captured: "${testedText}"` : 'Tap the button below to test your speech input. If in a noisy hall, touch input is always active.'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={testMicrophone}
            className={isTestingMic ? 'mic-recording-active' : 'kiosk-btn-secondary'}
            style={{ borderRadius: 'var(--kiosk-radius-full)', padding: '0.8rem 1.8rem' }}
          >
            <Mic size={20} />
            <span>{isTestingMic ? 'Listening now...' : 'Test Speech / बोलकर जांचें'}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={onContinue}
          className="kiosk-btn-primary"
          style={{ minWidth: '320px' }}
        >
          <span>Continue to Chief Complaint / आगे बढ़ें</span>
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
};

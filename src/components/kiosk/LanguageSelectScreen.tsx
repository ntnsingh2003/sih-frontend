import React from 'react';
import { SupportedLanguage } from '../../types/clinical';
import { Globe2, Check, ArrowRight } from 'lucide-react';
import { speechService } from '../../services/speechService';

interface Props {
  currentLang: SupportedLanguage;
  onSelect: (lang: SupportedLanguage) => void;
  onNext: () => void;
  audioEnabled: boolean;
}

interface LangCard {
  id: SupportedLanguage;
  nativeName: string;
  englishName: string;
  subText: string;
}

const LANGUAGES: LangCard[] = [
  { id: 'en', nativeName: 'English', englishName: 'English', subText: 'Continue in English' },
  { id: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', subText: 'आगे बढ़ने के लिए यहाँ दबाएँ' },
  { id: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', subText: 'এগিয়ে যেতে আলতো চাপুন' },
  { id: 'te', nativeName: 'తెలుగు', englishName: 'Telugu', subText: 'కొనసాగించడానికి నొక్కండి' },
  { id: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil', subText: 'தொடர தட்டவும்' },
  { id: 'mr', nativeName: 'मराठी', englishName: 'Marathi', subText: 'पुढे जाण्यासाठी टॅप करा' }
];

export const LanguageSelectScreen: React.FC<Props> = ({ currentLang, onSelect, onNext, audioEnabled }) => {
  const handleSelect = (lang: SupportedLanguage, native: string) => {
    onSelect(lang);
    if (audioEnabled) {
      if (lang === 'hi') {
        speechService.speak('हिन्दी चुनी गई है। जारी रखने के लिए आगे दबाएं।', 'hi');
      } else {
        speechService.speak(`${native} selected. Tap Continue to proceed.`, 'en');
      }
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center', padding: '1rem 0' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        background: 'linear-gradient(135deg, var(--color-brand-50) 0%, #dcfce7 100%)',
        padding: '0.45rem 1.3rem',
        borderRadius: '9999px',
        color: 'var(--color-brand-800)',
        fontWeight: 700,
        fontSize: '0.9rem',
        marginBottom: '1.25rem',
        border: '1px solid rgba(187, 247, 208, 0.8)'
      }}>
        <Globe2 size={18} color="var(--color-brand-600)" />
        <span>Linguistic Accessibility / भाषा चयन</span>
      </div>

      <h1 style={{ fontSize: '2.6rem', marginBottom: '0.6rem', letterSpacing: '-0.03em' }}>
        Select Preferred Language
      </h1>
      <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontWeight: 400 }}>
        MediKiosk will speak and guide you in your chosen language throughout the consultation.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {LANGUAGES.map((lang) => {
          const isSelected = currentLang === lang.id;
          return (
            <button
              key={lang.id}
              onClick={() => handleSelect(lang.id, lang.nativeName)}
              style={{
                background: isSelected ? 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)' : '#ffffff',
                border: isSelected ? '2.5px solid var(--color-brand-600)' : '1.5px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '1.6rem 1.5rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '135px',
                position: 'relative',
                boxShadow: isSelected ? '0 10px 25px -5px rgba(5, 150, 105, 0.15)' : 'var(--shadow-xs)',
                transition: 'all 0.16s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: isSelected ? 'var(--color-brand-800)' : 'var(--color-text-main)',
                  fontFamily: 'var(--font-family-display)'
                }}>
                  {lang.nativeName}
                </span>
                {isSelected ? (
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'var(--color-brand-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                  }}>
                    <Check size={18} strokeWidth={3} />
                  </div>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', fontWeight: 600, fontFamily: 'var(--font-family-mono)' }}>
                    {lang.englishName}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.92rem', color: isSelected ? 'var(--color-brand-700)' : 'var(--color-text-muted)', fontWeight: 500 }}>
                {lang.subText}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          className="kiosk-btn-primary"
          onClick={onNext}
          style={{ width: '100%', maxWidth: '440px' }}
        >
          <span>Continue / आगे बढ़ें</span>
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
};

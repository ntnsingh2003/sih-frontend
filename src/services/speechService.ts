// MediKiosk Speech Service (TTS & Speech Recognition with Indian Multilingual Support)

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isListeningState: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      }
    }
  }

  public speak(text: string, lang: string = 'en', onEnd?: () => void): void {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    this.synth.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly slower for clinical clarity and elderly patients
    utterance.pitch = 1.0;

    // Map language
    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (lang === 'ta') {
      utterance.lang = 'ta-IN';
    } else if (lang === 'te') {
      utterance.lang = 'te-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    // Try finding an appropriate voice
    const voices = this.synth.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.startsWith(lang));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public startListening(
    lang: string,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: any) => void
  ): boolean {
    if (!this.recognition) {
      onError(new Error('Speech recognition not supported in this browser. Touch keyboard is active.'));
      return false;
    }

    try {
      this.recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      
      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        onResult(text, Boolean(finalTranscript));
      };

      this.recognition.onerror = (event: any) => {
        this.isListeningState = false;
        onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListeningState = false;
      };

      this.recognition.start();
      this.isListeningState = true;
      return true;
    } catch (e) {
      onError(e);
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListeningState) {
      this.recognition.stop();
      this.isListeningState = false;
    }
  }

  public isListening(): boolean {
    return this.isListeningState;
  }
}

export const speechService = new SpeechService();

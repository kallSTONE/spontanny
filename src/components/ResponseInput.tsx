import { useRef, useState, useEffect } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (e: SpeechRecognitionEventLike) => void;
  onend: () => void;
  onerror: () => void;
  start: () => void;
  stop: () => void;
}

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

interface ResponseInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  autoFocus?: boolean;
}

export function ResponseInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Say something...',
  disabled = false,
  multiline = false,
  autoFocus = false,
}: ResponseInputProps) {
  const [speechSupported, setSpeechSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SR = getSpeechRecognition();
    if (SR) {
      setSpeechSupported(true);
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onresult = (e: SpeechRecognitionEventLike) => {
        let final = '';
        for (let i = 0; i < e.results.length; i++) {
          final += e.results[i][0].transcript;
        }
        onChange(final);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      recognitionRef.current = rec;
    }
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* noop */
      }
    };
  }, [onChange]);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      e.preventDefault();
      onSubmit();
    }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && multiline) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`relative flex items-end gap-2 rounded-2xl border-2 bg-white transition-all duration-200 ${
          listening
            ? 'border-amber-400 ring-2 ring-amber-100'
            : 'border-stone-200 focus-within:border-stone-400'
        }`}
      >
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            rows={4}
            className="w-full resize-none rounded-2xl bg-transparent px-4 py-3.5 text-base text-stone-800 placeholder:text-stone-400 focus:outline-none disabled:opacity-50"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            className="w-full rounded-2xl bg-transparent px-4 py-3.5 text-base text-stone-800 placeholder:text-stone-400 focus:outline-none disabled:opacity-50"
          />
        )}
        {speechSupported && (
          <button
            onClick={toggleMic}
            disabled={disabled}
            title={listening ? 'Stop recording' : 'Speak your response'}
            className={`mb-2 mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
              listening
                ? 'bg-amber-400 text-white animate-pulse'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }`}
          >
            {listening ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
          </button>
        )}
      </div>
      <button
        onClick={onSubmit}
        disabled={disabled || value.trim().length === 0}
        className="flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Send className="h-4 w-4" />
        Submit Response
      </button>
    </div>
  );
}

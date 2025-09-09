import { useState, useCallback, useEffect } from 'react';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';

interface ParsedCommand {
  name: string;
  quantity: number;
}

export const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsListening(true);
      setError(null);
    };

    Voice.onSpeechEnd = () => {
      setIsListening(false);
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        setTranscript(e.value[0]);
      }
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setError(e.error?.message || 'Speech recognition error');
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const parseCommand = useCallback((text: string): ParsedCommand | null => {
    if (!text || !text.trim()) return null;

    const words = text.toLowerCase().trim().split(/\s+/);

    const numberWords: Record<string, number> = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12,
      thirteen: 13,
      fourteen: 14,
      fifteen: 15,
      sixteen: 16,
      seventeen: 17,
      eighteen: 18,
      nineteen: 19,
      twenty: 20,
    };

    let quantity = 1;
    let name = '';

    const lastWord = words[words.length - 1];

    if (numberWords[lastWord]) {
      quantity = numberWords[lastWord];
      name = words.slice(0, -1).join(' ');
    } else if (!isNaN(Number(lastWord))) {
      quantity = Number(lastWord);
      name = words.slice(0, -1).join(' ');
    } else {
      let foundQuantity = false;
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (numberWords[word] || !isNaN(Number(word))) {
          quantity = numberWords[word] || Number(word);
          name = [...words.slice(0, i), ...words.slice(i + 1)].join(' ');
          foundQuantity = true;
          break;
        }
      }

      if (!foundQuantity) {
        name = words.join(' ');
      }
    }

    return name ? { name, quantity } : null;
  }, []);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      setTranscript('');

      const available = await Voice.isAvailable();
      if (!available) {
        setError('Voice recognition is not available on this device');
        return;
      }

      await Voice.start('en-US');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to start listening',
      );
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop listening');
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    parseCommand,
    clearTranscript,
  };
};

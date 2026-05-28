import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { useCallback, useRef, useState } from 'react';

type CompleteHandler = (text: string) => void;

export function useVoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transcriptRef = useRef('');
  const onCompleteRef = useRef<CompleteHandler | null>(null);
  const isListeningRef = useRef(false);
  const isStartingRef = useRef(false);

  useSpeechRecognitionEvent('start', () => {
    isListeningRef.current = true;
    isStartingRef.current = false;
    setIsListening(true);
    setError(null);
  });

  useSpeechRecognitionEvent('end', () => {
    isListeningRef.current = false;
    isStartingRef.current = false;
    setIsListening(false);

    const text = transcriptRef.current.trim();
    const onComplete = onCompleteRef.current;
    onCompleteRef.current = null;

    if (text && onComplete) {
      onComplete(text);
    }

    transcriptRef.current = '';
  });

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript?.trim();
    if (text) {
      transcriptRef.current = text;
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    if (event.error === 'aborted' || event.error === 'no-speech') {
      isListeningRef.current = false;
      isStartingRef.current = false;
      setIsListening(false);
      onCompleteRef.current = null;
      transcriptRef.current = '';
      return;
    }

    setError(event.message);
    isListeningRef.current = false;
    isStartingRef.current = false;
    setIsListening(false);
    onCompleteRef.current = null;
    transcriptRef.current = '';
  });

  const startListening = useCallback(async (onComplete: CompleteHandler) => {
    if (isListeningRef.current || isStartingRef.current) {
      return;
    }

    const available = ExpoSpeechRecognitionModule.isRecognitionAvailable();
    if (!available) {
      setError('Распознавание речи недоступно на этом устройстве');
      return;
    }

    isStartingRef.current = true;
    onCompleteRef.current = onComplete;
    transcriptRef.current = '';
    setError(null);
    setIsListening(true);

    const permissions = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permissions.granted) {
      isStartingRef.current = false;
      setIsListening(false);
      onCompleteRef.current = null;
      setError('Нужны разрешения на микрофон и распознавание речи');
      return;
    }

    if (!onCompleteRef.current) {
      isStartingRef.current = false;
      setIsListening(false);
      return;
    }

    ExpoSpeechRecognitionModule.start({
      lang: 'ru-RU',
      interimResults: true,
      continuous: false,
    });
  }, []);

  const stopListening = useCallback(() => {
    if (isListeningRef.current) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }

    if (isStartingRef.current || onCompleteRef.current) {
      isStartingRef.current = false;
      onCompleteRef.current = null;
      transcriptRef.current = '';
      setIsListening(false);
      ExpoSpeechRecognitionModule.abort();
    }
  }, []);

  return {
    isListening,
    error,
    startListening,
    stopListening,
  };
}

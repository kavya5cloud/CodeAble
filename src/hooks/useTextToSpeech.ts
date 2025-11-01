import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

export const useTextToSpeech = (enabled: boolean) => {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
      utteranceRef.current = new SpeechSynthesisUtterance();
      utteranceRef.current.rate = 1.0;
      utteranceRef.current.pitch = 1.0;
      utteranceRef.current.volume = 1.0;
    } else {
      toast.error("Text-to-speech is not supported in this browser");
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!enabled || !synthRef.current || !utteranceRef.current) return;

      // Cancel any ongoing speech
      synthRef.current.cancel();

      utteranceRef.current.text = text;
      synthRef.current.speak(utteranceRef.current);
    },
    [enabled]
  );

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, []);

  return { speak, stop };
};

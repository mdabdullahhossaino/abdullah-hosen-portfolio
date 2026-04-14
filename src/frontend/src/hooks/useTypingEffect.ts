import { useEffect, useRef, useState } from "react";

interface UseTypingEffectOptions {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

interface UseTypingEffectReturn {
  displayText: string;
  isTyping: boolean;
  currentWordIndex: number;
}

export function useTypingEffect({
  words,
  typeSpeed = 80,
  deleteSpeed = 45,
  pauseDuration = 1800,
}: UseTypingEffectOptions): UseTypingEffectReturn {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (words.length === 0) return;

    const currentWord = words[wordIndex % words.length];

    const tick = () => {
      if (!isDeleting) {
        // Typing forward
        const next = charIndex + 1;
        setDisplayText(currentWord.slice(0, next));
        setCharIndex(next);
        setIsTyping(true);

        if (next === currentWord.length) {
          // Finished typing — pause then delete
          setIsTyping(false);
          timeoutRef.current = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
          return;
        }
        timeoutRef.current = setTimeout(tick, typeSpeed);
      } else {
        // Deleting
        const next = charIndex - 1;
        setDisplayText(currentWord.slice(0, next));
        setCharIndex(next);
        setIsTyping(false);

        if (next === 0) {
          // Finished deleting — move to next word
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
          setIsTyping(true);
          timeoutRef.current = setTimeout(tick, typeSpeed);
          return;
        }
        timeoutRef.current = setTimeout(tick, deleteSpeed);
      }
    };

    timeoutRef.current = setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    charIndex,
    isDeleting,
    wordIndex,
    words,
    typeSpeed,
    deleteSpeed,
    pauseDuration,
  ]);

  return {
    displayText,
    isTyping,
    currentWordIndex: wordIndex % words.length,
  };
}

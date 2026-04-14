import { useEffect, useRef, useState } from "react";

interface UseTypingEffectOptions {
  /** Array of strings to cycle through */
  words: string[];
  /** Milliseconds per character while typing (default: 80) */
  typeSpeed?: number;
  /** Milliseconds per character while deleting (default: 45) */
  deleteSpeed?: number;
  /** Milliseconds to pause after completing a word (default: 1800) */
  pauseDuration?: number;
}

interface UseTypingEffectReturn {
  /** Current display string (no cursor — add one yourself) */
  displayText: string;
  /** true while actively typing forward */
  isTyping: boolean;
  /** Index of the current word in the `words` array */
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

  // Respect prefers-reduced-motion — show full word statically
  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    if (words.length === 0) return;

    if (reducedMotion) {
      setDisplayText(words[0]);
      setIsTyping(false);
      return;
    }

    const currentWord = words[wordIndex % words.length];

    const tick = () => {
      if (!isDeleting) {
        // Typing forward
        const next = charIndex + 1;
        setDisplayText(currentWord.slice(0, next));
        setCharIndex(next);
        setIsTyping(true);

        if (next === currentWord.length) {
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
    reducedMotion,
  ]);

  return {
    displayText,
    isTyping,
    currentWordIndex: wordIndex % words.length,
  };
}

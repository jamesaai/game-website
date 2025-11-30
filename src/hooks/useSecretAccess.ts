import { useEffect, useState } from 'react';

export const useSecretAccess = () => {
  const [secretSequence, setSecretSequence] = useState("");
  const [showKeypad, setShowKeypad] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        setSecretSequence(prev => {
          const newSequence = prev + e.key;
          if (newSequence === "2025") {
            setShowKeypad(true);
            return "";
          } else if (newSequence.length > 4) {
            return e.key;
          }
          return newSequence;
        });
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  // Reset sequence after delay
  useEffect(() => {
    if (secretSequence) {
      const timer = setTimeout(() => {
        setSecretSequence("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [secretSequence]);

  return {
    secretSequence,
    showKeypad,
    setShowKeypad
  };
};

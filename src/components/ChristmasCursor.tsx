import { useEffect } from 'react';

export const ChristmasCursor = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * {
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="%234ade80" d="M16 2 L12 10 L4 10 L10 16 L8 24 L16 18 L24 24 L22 16 L28 10 L20 10 Z"/></svg>'), auto !important;
      }
      
      a, button, [role="button"] {
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="%23ef4444" d="M16 2 L12 10 L4 10 L10 16 L8 24 L16 18 L24 24 L22 16 L28 10 L20 10 Z"/></svg>'), pointer !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

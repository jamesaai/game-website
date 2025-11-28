import { useEffect } from 'react';

export const ChristmasCursor = () => {
  useEffect(() => {
    // Add cursor styles through CSS class instead of direct DOM manipulation
    const styleId = 'christmas-cursor-styles';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        .christmas-cursor-active * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="%234ade80" d="M16 2 L12 10 L4 10 L10 16 L8 24 L16 18 L24 24 L22 16 L28 10 L20 10 Z"/></svg>'), auto !important;
        }
        
        .christmas-cursor-active a, 
        .christmas-cursor-active button, 
        .christmas-cursor-active [role="button"] {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="%23ef4444" d="M16 2 L12 10 L4 10 L10 16 L8 24 L16 18 L24 24 L22 16 L28 10 L20 10 Z"/></svg>'), pointer !important;
        }
      `;
      document.head.appendChild(styleElement);
      document.body.classList.add('christmas-cursor-active');
    }
    
    return () => {
      // Clean up on unmount
      const style = document.getElementById(styleId);
      if (style) {
        document.head.removeChild(style);
      }
      document.body.classList.remove('christmas-cursor-active');
    };
  }, []);

  return null;
};

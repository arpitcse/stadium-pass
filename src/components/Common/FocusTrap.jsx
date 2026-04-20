import React, { useEffect, useRef } from 'react';

/**
 * Lead Architect Specs: Robust FocusTrap for WCAG AAA Compliance.
 * Ensures keyboard tab sequence is trapped within the component.
 */
export const FocusTrap = ({ children, isActive, onClose }) => {
  const trapRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const trapElement = trapRef.current;
    const focusableElements = trapElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    firstElement.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onClose]);

  return (
    <div ref={trapRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
};

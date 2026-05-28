import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const sizeMap = {
    sm: '400px',
    md: '550px',
    lg: '700px',
    xl: '900px',
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-modal)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        ref={modalRef}
        style={{
          width: '100%',
          maxWidth: sizeMap[size],
          maxHeight: '85vh',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'scaleIn 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-5) var(--space-6)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <h3 style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            margin: 0,
          }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'var(--color-bg-glass)',
              border: 'none',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-bg-glass-hover)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-bg-glass)';
              e.currentTarget.style.color = 'var(--color-text-tertiary)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          padding: 'var(--space-6)',
          overflowY: 'auto',
          flex: 1,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    color: 'var(--color-success)',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.3)',
  },
  error: {
    icon: AlertCircle,
    color: 'var(--color-error)',
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.3)',
  },
  warning: {
    icon: AlertTriangle,
    color: 'var(--color-warning)',
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.3)',
  },
  info: {
    icon: Info,
    color: 'var(--color-info)',
    bg: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.3)',
  },
};

function Toast({ message, type = 'info', duration = 4000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const toastType = TOAST_TYPES[type] || TOAST_TYPES.info;
  const Icon = toastType.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 'var(--space-6)',
        right: 'var(--space-6)',
        zIndex: 'var(--z-toast)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-4) var(--space-5)',
        background: toastType.bg,
        backdropFilter: 'blur(12px)',
        border: `1px solid ${toastType.border}`,
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '400px',
        animation: isExiting ? 'fadeInRight 0.3s ease reverse forwards' : 'fadeInRight 0.3s ease',
      }}
    >
      <Icon size={20} color={toastType.color} />
      <p style={{
        flex: 1,
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-text-primary)',
        margin: 0,
      }}>
        {message}
      </p>
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-text-tertiary)',
          cursor: 'pointer',
          padding: 'var(--space-1)',
          display: 'flex',
          transition: 'color var(--transition-fast)',
        }}
        onMouseEnter={(e) => e.target.style.color = 'var(--color-text-primary)'}
        onMouseLeave={(e) => e.target.style.color = 'var(--color-text-tertiary)'}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default Toast;

import React from 'react';

function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon: Icon,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    fontFamily: 'var(--font-family)',
    fontWeight: 'var(--font-weight-semibold)',
    borderRadius: 'var(--radius-lg)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all var(--transition-base)',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
    overflow: 'hidden',
    border: 'none',
    outline: 'none',
    textDecoration: 'none',
  };

  const sizeStyles = {
    sm: { padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--font-size-xs)' },
    md: { padding: 'var(--space-3) var(--space-6)', fontSize: 'var(--font-size-sm)' },
    lg: { padding: 'var(--space-4) var(--space-8)', fontSize: 'var(--font-size-base)' },
  };

  const variantStyles = {
    primary: {
      background: 'var(--gradient-primary)',
      color: 'white',
    },
    secondary: {
      background: 'var(--color-bg-glass)',
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-border)',
    },
    danger: {
      background: 'rgba(239, 68, 68, 0.15)',
      color: 'var(--color-error)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-secondary)',
    },
    success: {
      background: 'var(--gradient-success)',
      color: 'white',
    },
  };

  const style = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
      className={className}
      {...props}
    >
      {loading ? (
        <>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          Cargando...
        </>
      ) : (
        <>
          {Icon && (React.isValidElement(Icon) ? Icon : <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />)}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;

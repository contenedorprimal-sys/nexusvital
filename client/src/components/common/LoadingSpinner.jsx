import '../../styles/index.css';

function LoadingSpinner({ fullPage = false, size = 'md', text = '' }) {
  const sizeMap = {
    sm: { width: '24px', height: '24px', border: '3px' },
    md: { width: '40px', height: '40px', border: '4px' },
    lg: { width: '60px', height: '60px', border: '5px' },
  };

  const s = sizeMap[size] || sizeMap.md;

  const spinnerStyle = {
    width: s.width,
    height: s.height,
    border: `${s.border} solid var(--color-bg-glass)`,
    borderTop: `${s.border} solid var(--color-accent-primary)`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  };

  if (fullPage) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        gap: 'var(--space-4)',
      }}>
        <div style={spinnerStyle} />
        {text && (
          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)',
          }}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-8)',
      gap: 'var(--space-4)',
    }}>
      <div style={spinnerStyle} />
      {text && (
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-sm)',
        }}>
          {text}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;

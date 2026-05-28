import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useTheme } from '../../context/ThemeContext';
import { Menu } from 'lucide-react';

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { sidebarCollapsed } = useTheme();

  return (
    <div className="app-layout" style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--color-bg-primary)',
    }}>
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <main style={{
        flex: 1,
        marginLeft: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        transition: 'margin-left var(--transition-base)',
        minHeight: '100vh',
        position: 'relative',
      }}>
        {/* Mobile Header */}
        <div className="mobile-header" style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-4) var(--space-6)',
          background: 'rgba(10, 14, 26, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--z-sticky)',
        }}>
          <button
            onClick={() => setMobileMenuOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              padding: 'var(--space-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Menu size={24} />
          </button>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontFamily: 'var(--font-family-display)',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--font-size-lg)',
          }}>
            <span style={{
              width: '28px',
              height: '28px',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
            }}>⚡</span>
            NexusVital
          </div>
          <div style={{ width: '40px' }} /> {/* Spacer for centering */}
        </div>

        <div style={{
          padding: 'var(--space-8)',
          maxWidth: 'var(--content-max-width)',
          margin: '0 auto',
        }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .app-layout main {
            margin-left: 0 !important;
          }
          .mobile-header {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Layout;

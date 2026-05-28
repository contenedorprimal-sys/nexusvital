import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getLevelInfo, getNextLevelProgress } from '../../utils/levels';
import {
  LayoutDashboard,
  Activity,
  User,
  BookOpen,
  ShoppingBag,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import '../../styles/sidebar.css';

function Sidebar({ mobileOpen, onMobileClose }) {
  const { user, logout, isAdmin, isPremium } = useAuth();
  const { sidebarCollapsed, toggleSidebar, theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const levelInfo = user ? getLevelInfo(user.xp || 0) : null;
  const levelProgress = user ? getNextLevelProgress(user.xp || 0) : null;

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/activities', icon: Activity, label: 'Actividades' },
    { path: '/profile', icon: User, label: 'Perfil' },
    { path: '/resources', icon: BookOpen, label: 'Recursos' },
    ...(isPremium ? [{ path: '/shop', icon: ShoppingBag, label: 'Tienda' }] : []),
    ...(isAdmin ? [{ path: '/admin', icon: Shield, label: 'Admin' }] : []),
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={onMobileClose} />
      )}

      <aside className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">⚡</div>
            {!sidebarCollapsed && <span className="sidebar-logo-text">NexusVital</span>}
          </div>
          <button className="sidebar-close-mobile" onClick={onMobileClose}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onMobileClose}
              title={sidebarCollapsed ? item.label : ''}
            >
              <item.icon size={20} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="sidebar-footer">
          {/* XP Progress */}
          {user && levelProgress && !sidebarCollapsed && (
            <div className="sidebar-xp-section">
              <div className="sidebar-xp-header">
                <span className="sidebar-xp-level">
                  {levelInfo?.icon} {levelInfo?.name}
                </span>
                <span className="sidebar-xp-value">{user.xp || 0} XP</span>
              </div>
              <div className="sidebar-xp-bar">
                <div
                  className="sidebar-xp-fill"
                  style={{
                    width: `${levelProgress.progress}%`,
                    background: levelInfo?.gradient,
                  }}
                />
              </div>
              {levelProgress.nextLevel && (
                <span className="sidebar-xp-next">
                  {levelProgress.xpNeeded} XP para {levelProgress.nextLevel.name}
                </span>
              )}
            </div>
          )}

          {/* Premium Badge */}
          {isPremium && !sidebarCollapsed && (
            <div className="sidebar-premium-badge">
              <Sparkles size={14} />
              <span>Premium</span>
            </div>
          )}

          {/* User Card */}
          <div className="sidebar-user" onClick={() => { navigate('/profile'); onMobileClose?.(); }}>
            <div className="sidebar-user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user?.name || 'Usuario'}</span>
                <span className="sidebar-user-email">{user?.email || ''}</span>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            className="sidebar-nav-item sidebar-theme-toggle"
            onClick={toggleTheme}
            style={{ 
              background: 'none', 
              border: 'none', 
              width: '100%', 
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            title={sidebarCollapsed ? (theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro') : ''}
          >
            {theme === 'dark' ? <Sun size={20} style={{ color: '#f59e0b' }} /> : <Moon size={20} style={{ color: '#6366f1' }} />}
            {!sidebarCollapsed && <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>}
          </button>

          {/* Logout */}
          <button
            className="sidebar-nav-item sidebar-logout"
            onClick={handleLogout}
            title={sidebarCollapsed ? 'Cerrar Sesión' : ''}
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span>Cerrar Sesión</span>}
          </button>

          {/* Collapse Toggle - Desktop only */}
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            title={sidebarCollapsed ? 'Expandir' : 'Colapsar'}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

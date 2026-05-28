import React, { useState, useEffect } from 'react';
import {
  User, Mail, Camera, Crown, Shield, Star, Zap, Calendar,
  Save, Ruler, Weight, Heart, Sparkles, Dumbbell, Apple,
  ChevronRight, Trash2, AlertTriangle, Check, Settings,
  LayoutDashboard, BarChart3, Target, Lock, Loader2, Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import { getLevelInfo, formatXp } from '../utils/levels';
import { formatDate, getGoalInfo, getSubscriptionInfo } from '../utils/helpers';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import '../styles/profile.css';

/* ─── Goal cards config ─── */
const goalCards = [
  { key: 'belleza',      icon: Sparkles, label: 'Belleza',        desc: 'Mejora tu aspecto y cuida tu piel', gradient: 'linear-gradient(135deg, #e17055, #fab1a0)' },
  { key: 'perder_peso',  icon: Dumbbell, label: 'Perder Peso',    desc: 'Quema grasa y alcanza tu peso ideal', gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)' },
  { key: 'salud',        icon: Heart,    label: 'Salud General',  desc: 'Cuida tu cuerpo y mente integralmente', gradient: 'linear-gradient(135deg, #00b894, #55efc4)' },
];

/* ─── Dashboard type options ─── */
const dashboardOptions = [
  { key: 'gamer',  icon: BarChart3,      label: 'Gamer',   desc: 'Interfaz con niveles y logros' },
  { key: 'normal', icon: LayoutDashboard, label: 'Normal',  desc: 'Interfaz limpia y minimalista' },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const Profile = () => {
  const { user, isPremium, updateProfile, updateSubscription } = useAuth();

  /* ─── State ─── */
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  // Personal info
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [gender, setGender] = useState('femenino');

  // Goal
  const [selectedGoal, setSelectedGoal] = useState('');

  // Measurements
  const [measurements, setMeasurements] = useState({ weight: '', height: '', chest: '', waist: '', hips: '', arms: '' });

  // Preferences
  const [dashboardType, setDashboardType] = useState('gamer');

  /* ─── Populate from user ─── */
  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setAvatarUrl(user.avatar || '');
    setGender(user.gender || 'femenino');
    setSelectedGoal(user.goal || '');
    setMeasurements({
      weight: user.measurements?.weight ?? '',
      height: user.measurements?.height ?? '',
      chest:  user.measurements?.chest  ?? '',
      waist:  user.measurements?.waist  ?? '',
      hips:   user.measurements?.hips   ?? '',
      arms:   user.measurements?.arms   ?? '',
    });
    setDashboardType(user.preferences?.dashboardType || 'gamer');
  }, [user]);

  /* ─── Derived ─── */
  const levelInfo   = getLevelInfo?.(user?.xp) ?? { name: 'Cobre', color: '#b87333' };
  const subInfo     = getSubscriptionInfo?.(user?.subscription) ?? { label: user?.subscription || 'free', color: '#636e72' };
  const memberSince = formatDate?.(user?.createdAt) ?? 'N/A';
  const initial     = (user?.name || 'U').charAt(0).toUpperCase();

  /* ─── Save handlers ─── */
  const savePersonalInfo = async () => {
    setLoading(true);
    try {
      await updateProfile?.({ name, avatar: avatarUrl, gender });
      setToast({ message: 'Información actualizada exitosamente', type: 'success' });
    } catch {
      setToast({ message: 'Error al actualizar información', type: 'error' });
    } finally { setLoading(false); }
  };

  const saveGoal = async (goal) => {
    setSelectedGoal(goal);
    try {
      await updateProfile?.({ goal });
      setToast({ message: 'Meta de bienestar actualizada', type: 'success' });
    } catch {
      setToast({ message: 'Error al guardar meta', type: 'error' });
    }
  };

  const saveMeasurements = async () => {
    setLoading(true);
    const payload = {};
    Object.entries(measurements).forEach(([k, v]) => { if (v !== '') payload[k] = Number(v); });
    try {
      await updateProfile?.({ measurements: payload });
      setToast({ message: 'Medidas corporales actualizadas', type: 'success' });
    } catch {
      setToast({ message: 'Error al actualizar medidas', type: 'error' });
    } finally { setLoading(false); }
  };

  const saveDashboardType = async (type) => {
    setDashboardType(type);
    try {
      await updateProfile?.({ preferences: { ...user.preferences, dashboardType: type } });
      setToast({ message: 'Preferencia de vista guardada', type: 'success' });
    } catch {
      setToast({ message: 'Error al guardar preferencia', type: 'error' });
    }
  };

  const handleUpgrade = async (plan) => {
    try {
      await updateSubscription?.(plan);
      setToast({ message: `Suscripción actualizada a ${plan === 'monthly' ? 'Premium Mensual' : plan === 'annual' ? 'Premium Anual' : 'Gratuito'}`, type: 'success' });
    } catch {
      setToast({ message: 'Error al actualizar suscripción', type: 'error' });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteText !== 'ELIMINAR') return;
    try {
      await usersAPI.deleteAccount();
      window.location.href = '/';
    } catch {
      setToast({ message: 'Error al eliminar la cuenta', type: 'error' });
    }
  };

  const handleMeasurement = (key, val) => setMeasurements(m => ({ ...m, [key]: val }));

  /* ━━━━━━━━━━━━━ RENDER ━━━━━━━━━━━━━ */
  return (
    <div className="profile-page">
      {/* ── Hero Header ── */}
      <header className="profile-header">
        <div className="profile-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} />
          ) : (
            <div className="profile-avatar__initial" style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>{initial}</div>
          )}
          <button className="avatar-edit" title="Cambiar avatar">
            <Camera size={16} />
          </button>
        </div>

        <div className="profile-info">
          <h1>{user?.name || 'Usuario'}</h1>
          <p className="profile-username">{user?.email || 'correo@example.com'}</p>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
            <span className={`profile-level-badge ${user?.level || 'cobre'}`}>
              <Star size={12} /> {levelInfo.name || 'Cobre'}
            </span>
            <span className={`profile-goal-badge ${user?.goal || 'salud'}`}>
              {getGoalInfo?.(user?.goal)?.icon || '❤️'} {getGoalInfo?.(user?.goal)?.label || 'Salud'}
            </span>
          </div>
        </div>
      </header>

      {/* Stats bar */}
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">{formatXp?.(user?.xp ?? 0) ?? user?.xp ?? 0}</span>
          <span className="stat-label">XP Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{levelInfo.name || 'Cobre'}</span>
          <span className="stat-label">Nivel</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{subInfo.label || 'Free'}</span>
          <span className="stat-label">Suscripción</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{memberSince}</span>
          <span className="stat-label">Miembro desde</span>
        </div>
      </div>

      <div className="profile-sections">
        {/* ── Personal Info ── */}
        <section className="profile-section">
          <h2>Información Personal</h2>
          <div className="profile-form">
            <div className="form-group">
              <label>Nombre</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" />
            </div>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input value={user?.email || ''} readOnly disabled className="input--readonly" style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div className="form-group">
              <label>Sexo / Enfoque Anatómico</label>
              <div className="select-wrapper" style={{ position: 'relative' }}>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--color-bg-glass)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3) var(--space-4)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--font-size-sm)',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="femenino">Femenino (Piernas, Glúteos, Abdomen)</option>
                  <option value="masculino">Masculino (Pecho, Espalda, Brazos)</option>
                  <option value="otro">Otro / Neutro (Funcional Completo)</option>
                </select>
                <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '10px', color: 'var(--color-text-secondary)' }}>▼</span>
              </div>
            </div>
            <div className="form-group full-width">
              <label>URL del avatar</label>
              <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="form-actions">
              <Button variant="primary" icon={<Save size={16} />} onClick={savePersonalInfo} loading={loading}>
                Guardar cambios
              </Button>
            </div>
          </div>
        </section>

        {/* ── Goal Selector ── */}
        <section className="profile-section">
          <h2>Tu Meta de Bienestar</h2>
          <div className="goal-cards">
            {goalCards.map(g => {
              const Icon = g.icon;
              const active = selectedGoal === g.key;
              return (
                <button
                  key={g.key}
                  className={`goal-card ${active ? 'selected' : ''}`}
                  onClick={() => saveGoal(g.key)}
                >
                  <div className="goal-icon"><Icon size={28} /></div>
                  <h3 className="goal-title">{g.label}</h3>
                  <p className="goal-desc">{g.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Measurements ── */}
        <section className="profile-section">
          <h2>Medidas Corporales</h2>
          <div className="measurements-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            {[
              { key: 'weight', label: 'Peso (kg)', unit: 'kg', icon: Weight },
              { key: 'height', label: 'Altura (cm)', unit: 'cm', icon: Ruler },
              { key: 'chest',  label: 'Pecho (cm)', unit: 'cm', icon: Ruler },
              { key: 'waist',  label: 'Cintura (cm)', unit: 'cm', icon: Ruler },
              { key: 'hips',   label: 'Caderas (cm)', unit: 'cm', icon: Ruler },
              { key: 'arms',   label: 'Brazos (cm)', unit: 'cm', icon: Ruler },
            ].map(m => {
              const MIcon = m.icon;
              return (
                <div key={m.key} className="measurement-input" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><MIcon size={12} /> {m.label}</label>
                  <div className="measurement-input__field" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="number"
                      style={{
                        width: '100%',
                        background: 'var(--color-bg-glass)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-2) var(--space-8) var(--space-2) var(--space-3)',
                        color: 'var(--color-text-primary)',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--font-size-sm)',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      value={measurements[m.key]}
                      onChange={e => handleMeasurement(m.key, e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                    <span className="measurement-input__unit" style={{ position: 'absolute', right: '10px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>{m.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
            <Button variant="primary" icon={<Save size={16} />} onClick={saveMeasurements} loading={loading}>
              Guardar medidas
            </Button>
          </div>
        </section>

        {/* ── Subscription ── */}
        <section className="profile-section">
          <h2>Planes de Suscripción</h2>
          <div className="subscription-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
            {[
              { key: 'free', label: 'Free', price: 'Gratis', features: ['Dashboard básico', 'Actividades limitadas', 'Progreso básico'], color: '#636e72' },
              { key: 'monthly', label: 'Premium Mensual', price: '$99/mes', features: ['Dashboard completo', 'Actividades ilimitadas', 'IA integrada', 'Tienda exclusiva', 'Soporte prioritario'], color: '#6c5ce7' },
              { key: 'annual', label: 'Premium Anual', price: '$799/año', features: ['Todo lo de Premium', 'Ahorra 40%', 'Acceso anticipado', 'Badge exclusivo', 'Reportes avanzados'], color: '#f9ca24' },
            ].map(plan => {
              const isCurrent = user?.subscription === plan.key;
              return (
                <div key={plan.key} className="subscription-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '320px' }}>
                  <div>
                    {isCurrent && <div className="current-plan"><Check size={12} /> Plan Actual</div>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: isCurrent ? 'var(--space-2)' : '0' }}>
                      <Crown size={24} style={{ color: plan.color }} />
                      <h3 style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>{plan.label}</h3>
                    </div>
                    <span style={{ display: 'block', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', marginTop: 'var(--space-3)' }}>{plan.price}</span>
                    <ul className="plan-features">
                      {plan.features.map(f => (
                        <li key={f}><Check className="check" size={14} /> {f}</li>
                      ))}
                    </ul>
                  </div>
                  {!isCurrent && (
                    <button
                      className="upgrade-btn"
                      onClick={() => handleUpgrade(plan.key)}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {plan.key === 'free' ? 'Cambiar a Free' : 'Actualizar plan'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Preferences ── */}
        <section className="profile-section">
          <h2>Preferencias</h2>
          <div className="preferences-section">
            <div className="pref-row">
              <div>
                <span className="pref-label" style={{ display: 'block', fontWeight: 'var(--font-weight-semibold)' }}>Diseño del Dashboard</span>
                <span className="pref-desc" style={{ display: 'block' }}>Cambiar interfaz a modo gamer (con niveles) o modo limpio</span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                {dashboardOptions.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => saveDashboardType(opt.key)}
                    style={{
                      background: dashboardType === opt.key ? 'var(--gradient-primary)' : 'var(--color-bg-glass)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-2) var(--space-4)',
                      color: '#fff',
                      fontSize: 'var(--font-size-xs)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Danger Zone ── */}
        <section className="profile-section danger-zone" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h2 style={{ color: 'var(--color-error)' }}>Zona de Peligro</h2>
          <p>Una vez eliminada tu cuenta, no podrás recuperar tus datos. Esta acción es permanente e irreversible.</p>
          <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => setDeleteModal(true)}>
            Eliminar mi cuenta
          </Button>
        </section>
      </div>

      {/* ── Delete Account Modal ── */}
      <Modal isOpen={deleteModal} onClose={() => { setDeleteModal(false); setDeleteText(''); }} title="Eliminar cuenta" size="sm">
        <div className="delete-confirm">
          <AlertTriangle size={48} className="delete-confirm__icon" />
          <p>Esta acción es <strong>irreversible</strong>. Se eliminarán todos tus datos, actividades, progreso y configuración.</p>
          <p className="delete-confirm__instruction">Escribe <strong>ELIMINAR</strong> para confirmar:</p>
          <input
            className="delete-confirm__input"
            value={deleteText}
            onChange={e => setDeleteText(e.target.value)}
            placeholder="ELIMINAR"
            style={{
              width: '100%',
              background: 'var(--color-bg-glass)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-family)',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: 'var(--space-4)'
            }}
          />
          <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="ghost" onClick={() => { setDeleteModal(false); setDeleteText(''); }}>Cancelar</Button>
            <Button variant="danger" disabled={deleteText !== 'ELIMINAR'} onClick={handleDeleteAccount}>
              Confirmar eliminación
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} duration={3000} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Profile;

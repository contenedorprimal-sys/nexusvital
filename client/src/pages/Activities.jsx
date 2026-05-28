import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity, Plus, Filter, Dumbbell, Apple, Brain, Heart,
  Clock, Flame, Zap, CheckCircle, CheckCircle2, Circle, Edit3, Trash2,
  X, ChevronDown, Search, TrendingUp, BarChart3, Loader2,
  AlertCircle, Sparkles, Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { activitiesAPI } from '../services/api';
import { calculateXpForActivity, formatXp } from '../utils/levels';
import { formatDate, timeAgo, getCategoryInfo } from '../utils/helpers';
import { getGoalActivities, getGoalMeta } from '../utils/goalActivities';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import '../styles/activities.css';

/* ─── Demo / fallback data ─── */
const demoActivities = [
  { _id: '1', type: 'ejercicio', title: 'Cardio 30 min', description: 'Sesión de cardio en caminadora', duration: 30, calories: 300, intensity: 'media', xpEarned: 40, completed: true, completedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
  { _id: '2', type: 'meditacion', title: 'Meditación matutina', description: 'Sesión de mindfulness guiada', duration: 15, calories: 0, intensity: 'baja', xpEarned: 0, completed: false, createdAt: new Date().toISOString() },
  { _id: '3', type: 'dieta', title: 'Desayuno saludable', description: 'Avena con frutas y proteína', duration: 20, calories: 0, intensity: 'baja', xpEarned: 25, completed: true, completedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
  { _id: '4', type: 'mindfulness', title: 'Journaling', description: 'Escribir diario de gratitud', duration: 10, calories: 0, intensity: 'baja', xpEarned: 0, completed: false, createdAt: new Date().toISOString() },
  { _id: '5', type: 'ejercicio', title: 'Pesas - Tren superior', description: 'Rutina de bíceps, tríceps y hombros', duration: 45, calories: 400, intensity: 'alta', xpEarned: 55, completed: true, completedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
];

/* ─── Helpers ─── */
const categoryConfig = {
  ejercicio:   { icon: Dumbbell, color: '#6c5ce7', gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', label: 'Ejercicio' },
  dieta:       { icon: Apple,    color: '#00b894', gradient: 'linear-gradient(135deg, #00b894, #55efc4)', label: 'Dieta' },
  meditacion:  { icon: Brain,    color: '#fdcb6e', gradient: 'linear-gradient(135deg, #fdcb6e, #ffeaa7)', label: 'Meditación' },
  mindfulness: { icon: Heart,    color: '#e17055', gradient: 'linear-gradient(135deg, #e17055, #fab1a0)', label: 'Mindfulness' },
};

const intensityLabels = { baja: 'Baja', media: 'Media', alta: 'Alta' };
const intensityColors = { baja: '#00b894', media: '#fdcb6e', alta: '#d63031' };

const emptyForm = { title: '', type: 'ejercicio', description: '', duration: '', intensity: 'media', calories: '' };

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const Activities = () => {
  const { user } = useAuth();

  /* ─── State ─── */
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  /* ─── Fetch ─── */
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await activitiesAPI.getAll();
      setActivities(res.data?.activities ?? res.data ?? demoActivities);
    } catch {
      setActivities(demoActivities);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  /* ─── Filtered list ─── */
  const filtered = activities.filter(a => {
    if (filter !== 'all' && a.type !== filter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  /* ─── Stats ─── */
  const stats = {
    total: activities.length,
    completed: activities.filter(a => a.completed).length,
    inProgress: activities.filter(a => !a.completed).length,
    totalXp: activities.reduce((s, a) => s + (a.xpEarned || 0), 0),
  };

  /* ─── Form helpers ─── */
  const openNew = () => { setForm({ ...emptyForm }); setEditingId(null); setModalOpen(true); };
  const openEdit = (act) => {
    setForm({ title: act.title, type: act.type, description: act.description || '', duration: act.duration || '', intensity: act.intensity || 'media', calories: act.calories || '' });
    setEditingId(act._id);
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm({ ...emptyForm }); };
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  /* ─── CRUD ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    const payload = { ...form, duration: Number(form.duration) || 0, calories: Number(form.calories) || 0 };
    try {
      if (editingId) {
        await activitiesAPI.update(editingId, payload);
        setActivities(prev => prev.map(a => a._id === editingId ? { ...a, ...payload } : a));
        setToast({ message: 'Actividad actualizada', type: 'success' });
      } else {
        const res = await activitiesAPI.create(payload);
        const newAct = res.data?.activity ?? { ...payload, _id: Date.now().toString(), xpEarned: 0, completed: false, createdAt: new Date().toISOString() };
        setActivities(prev => [newAct, ...prev]);
        setToast({ message: 'Actividad creada', type: 'success' });
      }
    } catch {
      // offline / demo mode
      if (editingId) {
        setActivities(prev => prev.map(a => a._id === editingId ? { ...a, ...payload } : a));
      } else {
        setActivities(prev => [{ ...payload, _id: Date.now().toString(), xpEarned: 0, completed: false, createdAt: new Date().toISOString() }, ...prev]);
      }
      setToast({ message: editingId ? 'Actividad actualizada (modo demo)' : 'Actividad creada (modo demo)', type: 'info' });
    } finally {
      setSubmitting(false);
      closeModal();
    }
  };

  const handleQuickAdd = async (act) => {
    const payload = {
      title: act.title,
      type: act.type,
      description: act.description,
      duration: Number(act.duration) || 0,
      intensity: act.intensity || 'media',
      calories: 0,
      completed: false
    };
    try {
      const res = await activitiesAPI.create(payload);
      const newAct = res.data?.activity ?? { ...payload, _id: Date.now().toString(), xpEarned: 0, completed: false, createdAt: new Date().toISOString() };
      setActivities(prev => [newAct, ...prev]);
      setToast({ message: 'Objetivo añadido a tus pendientes', type: 'success' });
    } catch {
      setActivities(prev => [{ ...payload, _id: Date.now().toString(), xpEarned: 0, completed: false, createdAt: new Date().toISOString() }, ...prev]);
      setToast({ message: 'Objetivo añadido (modo demo)', type: 'info' });
    }
  };

  const handleComplete = async (act) => {
    const xp = calculateXpForActivity?.(act.type, act.intensity, act.duration) ?? 30;
    try {
      await activitiesAPI.complete(act._id);
    } catch { /* demo mode */ }
    setActivities(prev => prev.map(a => a._id === act._id ? { ...a, completed: true, xpEarned: xp, completedAt: new Date().toISOString() } : a));
    setToast({ message: `¡+${xp} XP ganados!`, type: 'success' });
  };

  const handleDelete = async (id) => {
    try { await activitiesAPI.delete(id); } catch { /* demo */ }
    setActivities(prev => prev.filter(a => a._id !== id));
    setDeleteConfirm(null);
    setToast({ message: 'Actividad eliminada', type: 'success' });
  };

  /* ─── Filter pills config ─── */
  const filterOptions = [
    { key: 'all', label: 'Todas', icon: Filter },
    { key: 'ejercicio', label: 'Ejercicio', icon: Dumbbell },
    { key: 'dieta', label: 'Dieta', icon: Apple },
    { key: 'meditacion', label: 'Meditación', icon: Brain },
    { key: 'mindfulness', label: 'Mindfulness', icon: Heart },
  ];

  /* ━━━━━━━━━━━━━ RENDER ━━━━━━━━━━━━━ */
  return (
    <div className="activities-page">
      {/* ── Header ── */}
      <header className="activities-header">
        <div className="activities-header__left">
          <Activity className="activities-header__icon" size={28} />
          <div>
            <h1 className="activities-header__title">Actividades</h1>
            <p className="activities-header__subtitle">Registra y gestiona tus actividades de bienestar</p>
          </div>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={openNew}>
          Nueva Actividad
        </Button>
      </header>

      {/* ── Stats ── */}
      <section className="activities-stats">
        {[
          { label: 'Total', value: stats.total, icon: <BarChart3 size={20} />, color: '#6c5ce7' },
          { label: 'Completadas', value: stats.completed, icon: <CheckCircle size={20} />, color: '#00b894' },
          { label: 'En progreso', value: stats.inProgress, icon: <TrendingUp size={20} />, color: '#fdcb6e' },
          { label: 'XP Total', value: formatXp?.(stats.totalXp) ?? stats.totalXp, icon: <Zap size={20} />, color: '#e17055' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--accent': s.color }}>
            <div className="stat-card__icon">{s.icon}</div>
            <div className="stat-card__info">
              <span className="stat-card__value">{s.value}</span>
              <span className="stat-card__label">{s.label}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ── Goal Objectives Banner ── */}
      {(() => {
        const userGoal = user?.goal || 'salud';
        const goalMeta = getGoalMeta(userGoal);
        const goalActs = getGoalActivities(userGoal);
        const catColors = {
          ejercicio:   { color: '#6c5ce7', bg: 'rgba(108,92,231,0.12)' },
          dieta:       { color: '#00b894', bg: 'rgba(0,184,148,0.12)' },
          meditacion:  { color: '#fdcb6e', bg: 'rgba(253,203,110,0.12)' },
          mindfulness: { color: '#e17055', bg: 'rgba(225,112,85,0.12)' },
        };
        return (
          <section className="goal-banner" style={{
            marginBottom: 'var(--space-6)',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderTop: `3px solid ${goalMeta.color}`,
            borderRadius: 'var(--radius-xl)',
            backdropFilter: 'blur(16px)',
            padding: 'var(--space-5)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeInUp 0.5s ease-out both',
          }}>
            {/* Glow */}
            <div style={{
              position:'absolute', top:0, right:0, width:'350px', height:'200px',
              background:`radial-gradient(ellipse, ${goalMeta.color}14 0%, transparent 70%)`,
              pointerEvents:'none',
            }}/>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', marginBottom:'var(--space-4)' }}>
              <div style={{
                width:'44px', height:'44px', borderRadius:'var(--radius-lg)',
                background:`${goalMeta.color}18`, display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:'1.4rem', flexShrink:0,
              }}>{goalMeta.icon}</div>
              <div style={{ flex:1 }}>
                <h2 style={{ margin:0, fontSize:'var(--font-size-lg)', fontWeight:'var(--font-weight-semibold)', color:'var(--color-text-primary)' }}>
                  Objetivos recomendados — {goalMeta.label}
                </h2>
                <p style={{ margin:0, fontSize:'var(--font-size-xs)', color:'var(--color-text-tertiary)' }}>
                  {goalMeta.description}
                </p>
              </div>
              <span style={{
                padding:'var(--space-1) var(--space-3)',
                background:`${goalMeta.color}15`,
                border:`1px solid ${goalMeta.color}30`,
                borderRadius:'var(--radius-full)',
                fontSize:'0.7rem', fontWeight:'700',
                color: goalMeta.color,
                textTransform:'uppercase', letterSpacing:'0.04em',
                flexShrink:0,
              }}>{goalActs.length} objetivos</span>
            </div>

            {/* Objective Cards Horizontal Scroll */}
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))',
              gap:'var(--space-3)',
            }}>
              {goalActs.map((act) => {
                const cc = catColors[act.type] || catColors.ejercicio;
                const alreadyDone = activities.some(a =>
                  a.title === act.title && a.completed
                );
                return (
                  <div key={act.id} style={{
                    background: alreadyDone ? 'rgba(16,185,129,0.07)' : 'var(--color-bg-glass)',
                    border:`1px solid ${alreadyDone ? 'rgba(16,185,129,0.25)' : 'var(--color-border)'}`,
                    borderRadius:'var(--radius-lg)',
                    padding:'var(--space-3)',
                    display:'flex', flexDirection:'column', gap:'var(--space-2)',
                    transition:'all var(--transition-base)',
                    opacity: alreadyDone ? 0.65 : 1,
                  }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
                      <span style={{
                        width:'32px', height:'32px', borderRadius:'var(--radius-md)',
                        background: cc.bg, color: cc.color,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'1rem', flexShrink:0,
                      }}>{act.icon}</span>
                      <div style={{ flex:1 }}>
                        <span style={{
                          display:'block', fontSize:'var(--font-size-xs)',
                          fontWeight:'var(--font-weight-semibold)',
                          color:'var(--color-text-primary)',
                          textDecoration: alreadyDone ? 'line-through' : 'none',
                          lineHeight:'1.3',
                        }}>{act.title}</span>
                        <span style={{ fontSize:'0.67rem', color:'var(--color-text-muted)' }}>
                          {act.duration > 0 && `${act.duration} min • `}+{act.xpReward} XP
                        </span>
                      </div>
                      {alreadyDone && <CheckCircle2 size={16} style={{ color:'var(--color-success)', flexShrink:0 }} />}
                    </div>
                    <p style={{
                      margin:0, fontSize:'0.67rem', color:'var(--color-text-secondary)',
                      lineHeight:'1.5',
                      display:'-webkit-box', WebkitLineClamp:2,
                      WebkitBoxOrient:'vertical', overflow:'hidden',
                    }}>{act.description}</p>
                    {!alreadyDone && (
                      <button
                        onClick={() => handleQuickAdd(act)}
                        style={{
                          display:'flex', alignItems:'center', justifyContent:'center',
                          gap:'var(--space-1)',
                          padding:'var(--space-1-5) var(--space-3)',
                          background:`${goalMeta.color}18`,
                          border:`1px solid ${goalMeta.color}35`,
                          borderRadius:'var(--radius-md)',
                          color: goalMeta.color,
                          fontSize:'0.68rem', fontWeight:'700',
                          cursor:'pointer',
                          transition:'all var(--transition-fast)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${goalMeta.color}30`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${goalMeta.color}18`; }}
                      >
                        <Plus size={12} /> Añadir a pendientes
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })()}

      {/* ── Filters ── */}
      <section className="activities-filters">
        {filterOptions.map(f => {
          const Icon = f.icon;
          return (
            <button
              key={f.key}
              className={`filter-btn ${f.key} ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              <Icon size={15} /> {f.label}
            </button>
          );
        })}
        <div className="search-box">
          <Search size={15} />
          <input placeholder="Buscar actividad…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </section>

      {/* ── Content ── */}
      {loading ? (
        <div className="activities-loading">
          <Loader2 className="spin" size={36} />
          <p>Cargando actividades…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="activities-empty">
          <Sparkles size={48} />
          <h3>No hay actividades</h3>
          <p>{search || filter !== 'all' ? 'Intenta cambiar los filtros' : 'Crea tu primera actividad para empezar'}</p>
          {filter === 'all' && !search && (
            <Button variant="primary" icon={<Plus size={18} />} onClick={openNew}>Nueva Actividad</Button>
          )}
        </div>
      ) : (
        <section className="activities-grid">
          {filtered.map(act => {
            const cat = categoryConfig[act.type] || categoryConfig.ejercicio;
            const CatIcon = cat.icon;
            return (
              <article key={act._id} className={`activity-card ${act.type} ${act.completed ? 'activity-card--completed' : ''}`}>
                <div className="activity-card-header">
                  <div className={`card-icon ${act.type}`}>
                    <CatIcon size={20} />
                  </div>
                  <span className={`activity-card__status ${act.completed ? 'done' : 'pending'}`}>
                    {act.completed ? <><CheckCircle size={14} /> Completada</> : <><Circle size={14} /> Pendiente</>}
                  </span>
                </div>

                <div className="activity-card-body">
                  <h3 className="activity-card__title">{act.title}</h3>
                  <p className="activity-card__desc">{act.description}</p>

                  <div className="activity-card-actions">
                    {!act.completed && (
                      <button className="act-btn act-btn--complete" title="Completar" onClick={() => handleComplete(act)}>
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button className="act-btn act-btn--edit" title="Editar" onClick={() => openEdit(act)}>
                      <Edit3 size={18} />
                    </button>
                    <button className="act-btn act-btn--delete" title="Eliminar" onClick={() => setDeleteConfirm(act._id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="activity-card-footer">
                  <span className={`activity-type-badge ${act.type}`}>
                    {cat.label}
                  </span>
                  {act.completed && act.xpEarned > 0 && (
                    <span className="activity-xp">
                      <Zap size={12} /> +{act.xpEarned} XP
                    </span>
                  )}
                  {act.duration > 0 && (
                    <span className="activity-duration">
                      <Clock size={12} style={{ display: 'inline', marginRight: '2px' }} /> {act.duration} min
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* ── Create / Edit Modal ── */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editingId ? 'Editar Actividad' : 'Nueva Actividad'} size="md">
        <form className="activity-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Nombre de la actividad" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo</label>
              <div className="select-wrapper">
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="ejercicio">Ejercicio</option>
                  <option value="dieta">Dieta</option>
                  <option value="meditacion">Meditación</option>
                  <option value="mindfulness">Mindfulness</option>
                </select>
                <ChevronDown size={16} className="select-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label>Intensidad</label>
              <div className="select-wrapper">
                <select name="intensity" value={form.intensity} onChange={handleChange}>
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
                <ChevronDown size={16} className="select-arrow" />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe tu actividad…" rows={3} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duración (min)</label>
              <input type="number" name="duration" value={form.duration} onChange={handleChange} placeholder="30" min="0" />
            </div>
            <div className="form-group">
              <label>Calorías</label>
              <input type="number" name="calories" value={form.calories} onChange={handleChange} placeholder="0" min="0" />
            </div>
          </div>

          <div className="form-actions">
            <Button variant="ghost" onClick={closeModal} type="button">Cancelar</Button>
            <Button variant="primary" loading={submitting} type="submit">
              {editingId ? 'Guardar cambios' : 'Crear actividad'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Delete confirmation ── */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmar eliminación" size="sm">
        <div className="delete-confirm">
          <AlertCircle size={40} className="delete-confirm__icon" />
          <p>¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer.</p>
          <div className="form-actions">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>Eliminar</Button>
          </div>
        </div>
      </Modal>

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} duration={3000} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Activities;

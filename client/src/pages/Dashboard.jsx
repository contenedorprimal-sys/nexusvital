import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLevelInfo, getNextLevelProgress, formatXp } from '../utils/levels';
import { getGreeting, getCategoryInfo, formatDate, formatDuration } from '../utils/helpers';
import { activitiesAPI, progressAPI, tasksAPI, aiAPI } from '../services/api';
import { getGoalActivities, getGoalMeta } from '../utils/goalActivities';
import {
  Activity, TrendingUp, Flame, Trophy, Plus, ChevronRight,
  Sparkles, Target, Clock, Zap, Calendar, Brain, ChevronDown, Check, Trash2,
  Dumbbell, Apple, Heart, CheckCircle2
} from 'lucide-react';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import '../styles/dashboard.css';

function Dashboard() {
  const { user, isPremium, refreshUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [stats, setStats] = useState({ totalActivities: 0, totalXp: 0, streak: 0 });
  const [loading, setLoading] = useState(true);

  // Task creation/handling states
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', category: 'ejercicio', xpReward: 25 });
  const [toast, setToast] = useState(null);

  const levelInfo = getLevelInfo(user?.xp || 0);
  const levelProgress = getNextLevelProgress(user?.xp || 0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [activitiesRes, tasksRes, weeklyRes] = await Promise.allSettled([
        activitiesAPI.getAll({ limit: 5, sort: '-createdAt' }),
        tasksAPI.getAll({ status: 'pendiente' }),
        progressAPI.getWeekly(),
      ]);

      if (activitiesRes.status === 'fulfilled') {
        setActivities(activitiesRes.value.data.data || activitiesRes.value.data.activities || []);
      }
      if (tasksRes.status === 'fulfilled') {
        setTasks(tasksRes.value.data.data || tasksRes.value.data.tasks || []);
      }
      if (weeklyRes.status === 'fulfilled') {
        const weekData = weeklyRes.value.data.data || [];
        setWeeklyProgress(weekData);
        const totalXp = weekData.reduce((sum, d) => sum + (d.xpEarned || 0), 0);
        const totalActs = weekData.reduce((sum, d) => sum + (d.activitiesCompleted || 0), 0);
        setStats(prev => ({ ...prev, totalXp, totalActivities: totalActs }));
      }

      // Try AI suggestion
      try {
        const aiRes = await aiAPI.getDailySuggestion();
        setAiSuggestion(aiRes.data.data);
      } catch {}

    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Task Handlers
  const handleCompleteTask = async (taskId) => {
    try {
      const res = await tasksAPI.update(taskId, { status: 'completada' });
      setTasks(prev => prev.filter(t => t._id !== taskId));
      await refreshUser(); // Update XP and level in navbar/header
      const completedTask = res.data?.task || { xpReward: 25 };
      setToast({ message: `¡Tarea completada con éxito! +${completedTask.xpReward} XP ganados.`, type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || err.message || 'Error al completar la tarea', type: 'error' });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksAPI.delete(taskId);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      setToast({ message: 'Tarea eliminada correctamente.', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || err.message || 'Error al eliminar la tarea', type: 'error' });
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    setTaskSubmitting(true);
    try {
      const res = await tasksAPI.create({
        ...taskForm,
        xpReward: Number(taskForm.xpReward) || 25,
        status: 'pendiente'
      });
      const newTask = res.data?.task;
      if (newTask) {
        setTasks(prev => [newTask, ...prev]);
        setToast({ message: 'Tarea creada exitosamente.', type: 'success' });
        setTaskModalOpen(false);
        setTaskForm({ title: '', category: 'ejercicio', xpReward: 25 });
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || err.message || 'Error al crear la tarea',
        type: 'error'
      });
    } finally {
      setTaskSubmitting(false);
    }
  };

  // Generate weekly calendar data
  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayProgress = weeklyProgress.find(p => {
        const pDate = new Date(p.date);
        return pDate.toDateString() === date.toDateString();
      });

      days.push({
        name: dayNames[date.getDay()],
        date: date.getDate(),
        isToday: i === 0,
        completed: dayProgress?.activitiesCompleted > 0,
        xp: dayProgress?.xpEarned || 0,
      });
    }
    return days;
  };

  const statCards = [
    {
      icon: Activity,
      label: 'Actividades',
      value: stats.totalActivities,
      subtitle: 'esta semana',
      color: 'var(--color-ejercicio)',
      bgColor: 'rgba(239, 68, 68, 0.12)',
    },
    {
      icon: Zap,
      label: 'XP Ganados',
      value: formatXp(user?.xp || 0),
      subtitle: 'total acumulado',
      color: 'var(--color-accent-primary-light)',
      bgColor: 'rgba(99, 102, 241, 0.12)',
    },
    {
      icon: Flame,
      label: 'Racha',
      value: `${stats.streak || 0}`,
      subtitle: 'días consecutivos',
      color: 'var(--color-warning)',
      bgColor: 'rgba(245, 158, 11, 0.12)',
    },
    {
      icon: Trophy,
      label: 'Nivel',
      value: levelInfo?.name || 'Cobre',
      subtitle: levelInfo?.tier || 'Principiante',
      color: levelInfo?.color || 'var(--color-level-cobre)',
      bgColor: `${levelInfo?.color}20` || 'rgba(184, 115, 51, 0.12)',
    },
  ];

  if (loading) {
    return (
      <div className="dashboard page-enter">
        <div className="dashboard-loading">
          <div style={{
            width: '40px', height: '40px',
            border: '4px solid var(--color-bg-glass)',
            borderTop: '4px solid var(--color-accent-primary)',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
            margin: '0 auto var(--space-4)',
          }} />
          <p style={{ color: 'var(--color-text-secondary)' }}>Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard page-enter">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h1>{getGreeting()}, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Usuario'}</span>!</h1>
          <p>{formatDate(new Date(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Link to="/activities" className="btn-primary">
          <Plus size={18} /> Nueva Actividad
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="stat-card-icon" style={{ background: stat.bgColor, color: stat.color }}>
              <stat.icon size={22} />
            </div>
            <div className="stat-card-content">
              <span className="stat-card-value" style={{ color: stat.color }}>{stat.value}</span>
              <span className="stat-card-label">{stat.label}</span>
              <span className="stat-card-subtitle">{stat.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Level Progress */}
      <div className="level-progress-card glass-card">
        <div className="level-progress-header">
          <div className="level-progress-info">
            <span className="level-progress-icon">{levelInfo?.icon}</span>
            <div>
              <h3>Nivel {levelInfo?.name}</h3>
              <p>{levelInfo?.description}</p>
            </div>
          </div>
          <span className="level-progress-xp">{formatXp(user?.xp || 0)} XP</span>
        </div>
        <div className="level-progress-bar">
          <div
            className="level-progress-fill"
            style={{
              width: `${levelProgress?.progress || 0}%`,
              background: levelInfo?.gradient,
            }}
          />
        </div>
        <div className="level-progress-footer">
          <span>{levelInfo?.tier}</span>
          {levelProgress?.nextLevel && (
            <span>{levelProgress.xpNeeded} XP para {levelProgress.nextLevel.name}</span>
          )}
        </div>
      </div>

      {/* ── Goal Objectives Section ── */}
      {(() => {
        const userGoal = user?.goal || 'salud';
        const goalMeta = getGoalMeta(userGoal);
        const goalActs = getGoalActivities(userGoal);
        const categoryIcons = { ejercicio: Dumbbell, dieta: Apple, meditacion: Brain, mindfulness: Heart };
        const categoryColors = {
          ejercicio: { color: '#6c5ce7', bg: 'rgba(108,92,231,0.12)' },
          dieta:     { color: '#00b894', bg: 'rgba(0,184,148,0.12)' },
          meditacion:{ color: '#fdcb6e', bg: 'rgba(253,203,110,0.12)' },
          mindfulness:{ color: '#e17055', bg: 'rgba(225,112,85,0.12)' },
        };
        return (
          <div className="goal-objectives-section glass-card" style={{
            marginBottom: 'var(--space-6)',
            borderTop: `3px solid ${goalMeta.color}`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Glow background */}
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '300px', height: '300px',
              background: `radial-gradient(circle, ${goalMeta.color}18 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            <div className="section-heading" style={{ marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: '1.4rem' }}>{goalMeta.icon}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>Objetivos de hoy — {goalMeta.label}</h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', margin: '2px 0 0' }}>
                  {goalMeta.tagline}
                </p>
              </div>
              <Link to="/activities" className="section-link">
                Ver en Actividades <ChevronRight size={14} />
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-4)',
            }}>
              {goalActs.map((act) => {
                const CatIcon = categoryIcons[act.type] || Dumbbell;
                const catColors = categoryColors[act.type] || categoryColors.ejercicio;
                const isCompletedToday = tasks.some(t =>
                  t.title === act.title && t.status === 'completada'
                );
                return (
                  <div
                    key={act.id}
                    className="goal-obj-card"
                    style={{
                      background: isCompletedToday
                        ? 'rgba(16,185,129,0.06)'
                        : 'var(--color-bg-glass)',
                      border: `1px solid ${isCompletedToday ? 'rgba(16,185,129,0.3)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-xl)',
                      padding: 'var(--space-4)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-2)',
                      transition: 'all var(--transition-base)',
                      cursor: 'default',
                      opacity: isCompletedToday ? 0.7 : 1,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                      <div style={{
                        width: '40px', height: '40px', minWidth: '40px',
                        borderRadius: 'var(--radius-lg)',
                        background: catColors.bg,
                        color: catColors.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem',
                      }}>
                        {act.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{
                          display: 'block',
                          fontWeight: 'var(--font-weight-semibold)',
                          fontSize: 'var(--font-size-sm)',
                          color: 'var(--color-text-primary)',
                          textDecoration: isCompletedToday ? 'line-through' : 'none',
                        }}>{act.title}</span>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                          {act.duration > 0 && <><Clock size={10} style={{ display:'inline', marginRight:'3px' }} />{act.duration} min • </>}
                          +{act.xpReward} XP
                        </span>
                      </div>
                      {isCompletedToday && (
                        <CheckCircle2 size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                      )}
                    </div>
                    <p style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-secondary)',
                      margin: 0,
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>{act.description}</p>
                    {act.tips && (
                      <div style={{
                        padding: 'var(--space-2) var(--space-3)',
                        background: `${goalMeta.color}10`,
                        borderRadius: 'var(--radius-md)',
                        borderLeft: `2px solid ${goalMeta.color}`,
                        fontSize: '0.68rem',
                        color: 'var(--color-text-muted)',
                        fontStyle: 'italic',
                      }}>💡 {act.tips}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      <div className="dashboard-grid">
        {/* Weekly Calendar */}
        <div className="weekly-calendar glass-card">
          <div className="section-heading">
            <Calendar size={18} />
            <h3>Semana Actual</h3>
          </div>
          <div className="calendar-days">
            {getWeekDays().map((day, i) => (
              <div
                key={i}
                className={`calendar-day ${day.isToday ? 'today' : ''} ${day.completed ? 'completed' : ''}`}
              >
                <span className="calendar-day-name">{day.name}</span>
                <span className="calendar-day-num">{day.date}</span>
                {day.completed && <span className="calendar-day-dot" />}
                {day.xp > 0 && <span className="calendar-day-xp">+{day.xp}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="ai-card glass-card">
          <div className="section-heading">
            <Brain size={18} />
            <h3>Sugerencia IA</h3>
            <span className="ai-badge"><Sparkles size={12} /> IA</span>
          </div>
          {aiSuggestion ? (
            <div className="ai-suggestion-content">
              <p className="ai-suggestion-text">{aiSuggestion.description || aiSuggestion.title || 'Basado en tu perfil, te recomendamos una sesión de meditación para equilibrar tu rutina.'}</p>
              <span className="ai-suggestion-category">
                {getCategoryInfo(aiSuggestion.category || 'meditacion').icon} {getCategoryInfo(aiSuggestion.category || 'meditacion').label}
              </span>
            </div>
          ) : (
            <div className="ai-suggestion-content">
              <p className="ai-suggestion-text">
                ¡Bienvenido! Completa algunas actividades para que nuestra IA pueda darte recomendaciones personalizadas basadas en tu progreso y objetivos.
              </p>
              <span className="ai-suggestion-category">🎯 Consejo del día</span>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Pending Tasks */}
        <div className="tasks-section glass-card">
          <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Target size={18} />
              <h3>Tareas Pendientes</h3>
            </div>
            <button
              onClick={() => setTaskModalOpen(true)}
              className="btn-primary"
              style={{
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--font-size-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <Plus size={14} /> Nueva Tarea
            </button>
          </div>
          {tasks.length > 0 ? (
            <div className="tasks-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              {tasks.slice(0, 4).map((task) => {
                const catInfo = getCategoryInfo(task.category);
                return (
                  <div key={task._id} className="task-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--color-bg-glass)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <button
                        onClick={() => handleCompleteTask(task._id)}
                        title="Marcar como completada"
                        style={{
                          background: 'none',
                          border: '2px solid var(--color-border)',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'transparent',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-success)';
                          e.currentTarget.style.color = 'var(--color-success)';
                          e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-border)';
                          e.currentTarget.style.color = 'transparent';
                          e.currentTarget.style.background = 'none';
                        }}
                      >
                        <Check size={12} style={{ strokeWidth: 3 }} />
                      </button>
                      <div>
                        <span className="task-title" style={{ display: 'block', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{task.title}</span>
                        <span className="task-meta" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1.5)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-0.5)' }}>
                          <span className="task-category-dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: catInfo.color }} />
                          {catInfo.label} • +{task.xpReward} XP
                        </span>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        title="Eliminar tarea"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-text-tertiary)',
                          cursor: 'pointer',
                          padding: 'var(--space-1)',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'color var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-error)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-mini">
              <p>No tienes tareas pendientes</p>
              <button
                onClick={() => setTaskModalOpen(true)}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: 'var(--space-1)', cursor: 'pointer', border: '1px solid var(--color-border)', background: 'var(--color-bg-glass)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }}
              >
                <Plus size={14} /> Crear Tarea
              </button>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="recent-activities glass-card">
          <div className="section-heading">
            <Activity size={18} />
            <h3>Actividades Recientes</h3>
            <Link to="/activities" className="section-link">
              Ver todas <ChevronRight size={14} />
            </Link>
          </div>
          {activities.length > 0 ? (
            <div className="activities-list">
              {activities.slice(0, 4).map((activity) => {
                const catInfo = getCategoryInfo(activity.type);
                return (
                  <div key={activity._id} className="activity-item">
                    <div className="activity-item-icon" style={{ background: catInfo.bgColor, color: catInfo.color }}>
                      {catInfo.icon}
                    </div>
                    <div className="activity-item-info">
                      <span className="activity-item-title">{activity.title}</span>
                      <span className="activity-item-meta">
                        {catInfo.label} • {formatDuration(activity.duration)}
                      </span>
                    </div>
                    <div className="activity-item-xp">
                      {activity.completed ? (
                        <span className="xp-earned">+{activity.xpEarned} XP</span>
                      ) : (
                        <span className="xp-pending">En curso</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-mini">
              <p>Aún no has registrado actividades</p>
              <Link to="/activities" className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
                <Plus size={14} /> Primera Actividad
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Premium Upsell for Free Users */}
      {!isPremium && (
        <div className="premium-upsell glass-card" style={{
          background: 'var(--gradient-card)',
          borderColor: 'var(--color-border-accent)',
        }}>
          <div className="premium-upsell-content">
            <Sparkles size={24} style={{ color: 'var(--color-accent-primary-light)' }} />
            <div>
              <h3>Desbloquea todo tu potencial</h3>
              <p>Con Premium obtén historial completo, tareas ilimitadas, análisis avanzado y recomendaciones IA personalizadas.</p>
            </div>
          </div>
          <Link to="/profile" className="btn-primary">
            Ver Planes Premium
          </Link>
        </div>
      )}

      {/* ── Create Task Modal ── */}
      <Modal isOpen={taskModalOpen} onClose={() => setTaskModalOpen(false)} title="Nueva Tarea" size="md">
        <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)' }}>Título</label>
            <input
              style={{
                width: '100%',
                background: 'var(--color-bg-glass)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              placeholder="Ej. Caminar 30 minutos, Beber 2L de agua"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)' }}>Categoría</label>
              <div className="select-wrapper" style={{ position: 'relative' }}>
                <select
                  style={{
                    width: '100%',
                    background: 'var(--color-bg-glass)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3) var(--space-8) var(--space-3) var(--space-3)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-family)',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                  value={taskForm.category}
                  onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                >
                  <option value="ejercicio">Ejercicio</option>
                  <option value="dieta">Dieta</option>
                  <option value="meditacion">Meditación</option>
                  <option value="mindfulness">Mindfulness</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
              </div>
            </div>

            <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)' }}>Recompensa (XP)</label>
              <input
                type="number"
                style={{
                  width: '100%',
                  background: 'var(--color-bg-glass)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-family)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                value={taskForm.xpReward}
                onChange={(e) => setTaskForm({ ...taskForm, xpReward: Number(e.target.value) || '' })}
                min="5"
                max="100"
                placeholder="25"
                required
              />
            </div>
          </div>

          <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <Button variant="ghost" onClick={() => setTaskModalOpen(false)} type="button">Cancelar</Button>
            <Button variant="primary" loading={taskSubmitting} type="submit">Crear Tarea</Button>
          </div>
        </form>
      </Modal>

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} duration={3000} onClose={() => setToast(null)} />}
    </div>
  );
}

export default Dashboard;

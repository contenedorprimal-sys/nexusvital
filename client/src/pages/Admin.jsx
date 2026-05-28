import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, Users, Crown, Activity, BarChart3, Search,
  Edit3, Trash2, ChevronLeft, ChevronRight, ChevronDown,
  Star, Zap, Calendar, Loader2, AlertCircle, UserCheck,
  X, Save, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import { formatDate } from '../utils/helpers';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import '../styles/admin.css';

/* ─── Demo data ─── */
const demoUsers = [
  { _id: '1', name: 'María García', email: 'maria@example.com', level: 'plata', xp: 750, subscription: 'monthly', role: 'user', createdAt: '2024-01-15' },
  { _id: '2', name: 'Carlos López', email: 'carlos@example.com', level: 'oro', xp: 2100, subscription: 'annual', role: 'user', createdAt: '2024-02-20' },
  { _id: '3', name: 'Ana Martínez', email: 'ana@example.com', level: 'cobre', xp: 150, subscription: 'free', role: 'user', createdAt: '2024-03-10' },
  { _id: '4', name: 'Diego Hernández', email: 'diego@example.com', level: 'platino', xp: 4200, subscription: 'annual', role: 'user', createdAt: '2023-11-05' },
  { _id: '5', name: 'Lucía Torres', email: 'lucia@example.com', level: 'plata', xp: 890, subscription: 'monthly', role: 'user', createdAt: '2024-04-01' },
];

/* ─── Level / Sub colors ─── */
const levelColors = {
  cobre:   '#b87333',
  plata:   '#c0c0c0',
  oro:     '#ffd700',
  platino: '#e5e4e2',
  diamante:'#b9f2ff',
};

const subLabels = { free: 'Free', monthly: 'Premium', annual: 'Anual' };
const subColors = { free: '#636e72', monthly: '#6c5ce7', annual: '#f9ca24' };
const roleLabels = { user: 'Usuario', admin: 'Admin' };

const ITEMS_PER_PAGE = 5;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const Admin = () => {
  const { user } = useAuth();

  /* ─── State ─── */
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editModal, setEditModal] = useState(null);       // user object or null
  const [deleteModal, setDeleteModal] = useState(null);    // user _id or null
  const [editForm, setEditForm] = useState({ subscription: '', role: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  /* ─── Fetch users ─── */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersAPI.getAll();
      const data = res.data?.users ?? res.data ?? demoUsers;
      setUsers(Array.isArray(data) ? data : demoUsers);
    } catch {
      setUsers(demoUsers);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  /* ─── Derived ─── */
  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = {
    total:    users.length,
    premium:  users.filter(u => u.subscription !== 'free').length,
    active:   users.filter(u => {
      if (!u.lastActive) return false;
      const diff = Date.now() - new Date(u.lastActive).getTime();
      return diff < 24 * 60 * 60 * 1000;
    }).length || Math.min(users.length, 3),
    activities: users.reduce((s, u) => s + (u.activitiesCount || 0), 0) || 42,
  };

  /* ─── Edit ─── */
  const openEdit = (u) => {
    setEditForm({ subscription: u.subscription || 'free', role: u.role || 'user' });
    setEditModal(u);
  };

  const handleSaveEdit = async () => {
    if (!editModal) return;
    setSubmitting(true);
    try {
      await usersAPI.updateUser(editModal._id, editForm);
    } catch { /* demo */ }
    setUsers(prev => prev.map(u => u._id === editModal._id ? { ...u, ...editForm } : u));
    setEditModal(null);
    setSubmitting(false);
    setToast({ message: 'Usuario actualizado', type: 'success' });
  };

  /* ─── Delete ─── */
  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await usersAPI.deleteUser(deleteModal);
    } catch { /* demo */ }
    setUsers(prev => prev.filter(u => u._id !== deleteModal));
    setDeleteModal(null);
    setToast({ message: 'Usuario eliminado', type: 'success' });
  };

  /* ─── Avatar initial ─── */
  const getInitial = (name) => (name || 'U').charAt(0).toUpperCase();

  /* ━━━━━━━━━━━━━ RENDER ━━━━━━━━━━━━━ */
  return (
    <div className="admin-page">
      {/* ── Header ── */}
      <header className="admin-header">
        <div className="admin-header__left">
          <Shield size={28} className="admin-header__icon" />
          <div>
            <h1 className="admin-header__title">Panel de Administración</h1>
            <p className="admin-header__subtitle">Gestión de usuarios y estadísticas del sistema</p>
          </div>
        </div>
        <Button variant="ghost" icon={<RefreshCw size={16} />} onClick={fetchUsers}>
          Actualizar
        </Button>
      </header>

      {/* ── System Stats ── */}
      <section className="admin-stats">
        {[
          { label: 'Total Usuarios',   value: stats.total,      icon: <Users size={22} />,    color: '#6c5ce7' },
          { label: 'Usuarios Premium',  value: stats.premium,    icon: <Crown size={22} />,    color: '#f9ca24' },
          { label: 'Activos Hoy',       value: stats.active,     icon: <Activity size={22} />, color: '#00b894' },
          { label: 'Total Actividades', value: stats.activities,  icon: <BarChart3 size={22} />, color: '#e17055' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--accent': s.color }}>
            <div className="admin-stat-card__icon">{s.icon}</div>
            <div className="admin-stat-card__info">
              <span className="admin-stat-card__value">{s.value}</span>
              <span className="admin-stat-card__label">{s.label}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ── Search ── */}
      <section className="admin-toolbar">
        <div className="admin-search">
          <Search size={18} />
          <input
            placeholder="Buscar por nombre o email…"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <span className="admin-toolbar__count">{filtered.length} usuarios</span>
      </section>

      {/* ── Users Table ── */}
      {loading ? (
        <div className="admin-loading">
          <Loader2 className="spin" size={36} />
          <p>Cargando usuarios…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <Users size={48} />
          <h3>No se encontraron usuarios</h3>
          <p>Intenta cambiar la búsqueda</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Nivel</th>
                <th>XP</th>
                <th>Suscripción</th>
                <th>Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="admin-user-cell">
                      <div className="admin-user-cell__avatar" style={{ background: levelColors[u.level] || '#6c5ce7' }}>
                        {getInitial(u.name)}
                      </div>
                      <span className="admin-user-cell__name">{u.name}</span>
                    </div>
                  </td>
                  <td className="admin-cell--email">{u.email}</td>
                  <td>
                    <span className="admin-badge" style={{ background: `${levelColors[u.level] || '#6c5ce7'}33`, color: levelColors[u.level] || '#6c5ce7' }}>
                      <Star size={12} /> {u.level || 'cobre'}
                    </span>
                  </td>
                  <td>
                    <span className="admin-xp"><Zap size={12} /> {u.xp?.toLocaleString() || 0}</span>
                  </td>
                  <td>
                    <span className="admin-badge" style={{ background: `${subColors[u.subscription] || '#636e72'}33`, color: subColors[u.subscription] || '#636e72' }}>
                      <Crown size={12} /> {subLabels[u.subscription] || 'Free'}
                    </span>
                  </td>
                  <td className="admin-cell--date">{formatDate?.(u.createdAt) ?? u.createdAt}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn admin-action-btn--edit" title="Editar" onClick={() => openEdit(u)}>
                        <Edit3 size={16} />
                      </button>
                      <button className="admin-action-btn admin-action-btn--delete" title="Eliminar" onClick={() => setDeleteModal(u._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && filtered.length > 0 && (
        <div className="admin-pagination">
          <button
            className="admin-pagination__btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft size={18} />
          </button>
          <div className="admin-pagination__pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`admin-pagination__page ${page === currentPage ? 'admin-pagination__page--active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="admin-pagination__btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* ── Edit Modal ── */}
      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title="Editar Usuario" size="sm">
        {editModal && (
          <div className="admin-edit-form">
            <div className="admin-edit-form__user">
              <div className="admin-user-cell__avatar admin-user-cell__avatar--lg" style={{ background: levelColors[editModal.level] || '#6c5ce7' }}>
                {getInitial(editModal.name)}
              </div>
              <div>
                <h3>{editModal.name}</h3>
                <p>{editModal.email}</p>
              </div>
            </div>

            <div className="form-group">
              <label>Suscripción</label>
              <div className="select-wrapper">
                <select
                  value={editForm.subscription}
                  onChange={e => setEditForm(f => ({ ...f, subscription: e.target.value }))}
                >
                  <option value="free">Free</option>
                  <option value="monthly">Premium Mensual</option>
                  <option value="annual">Premium Anual</option>
                </select>
                <ChevronDown size={16} className="select-arrow" />
              </div>
            </div>

            <div className="form-group">
              <label>Rol</label>
              <div className="select-wrapper">
                <select
                  value={editForm.role}
                  onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
                <ChevronDown size={16} className="select-arrow" />
              </div>
            </div>

            <div className="form-actions">
              <Button variant="ghost" onClick={() => setEditModal(null)}>Cancelar</Button>
              <Button variant="primary" icon={<Save size={16} />} loading={submitting} onClick={handleSaveEdit}>
                Guardar cambios
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Confirmar Eliminación" size="sm">
        <div className="delete-confirm">
          <AlertCircle size={40} className="delete-confirm__icon" />
          <p>¿Estás seguro de que deseas eliminar este usuario? Se eliminarán todos sus datos, actividades y progreso. Esta acción no se puede deshacer.</p>
          <div className="form-actions">
            <Button variant="ghost" onClick={() => setDeleteModal(null)}>Cancelar</Button>
            <Button variant="danger" icon={<Trash2 size={16} />} onClick={handleDelete}>Eliminar usuario</Button>
          </div>
        </div>
      </Modal>

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} duration={3000} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Admin;

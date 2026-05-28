import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if(!API_URL && import.meta.env.PROD) {
  console.warn("VITE_API_URL no esta definida en producticion!");
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — redirect to login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ---- Auth API ----
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.get('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/password', data),
};

// ---- Activities API ----
export const activitiesAPI = {
  getAll: (params) => api.get('/activities', { params }),
  getById: (id) => api.get(`/activities/${id}`),
  create: (data) => api.post('/activities', data),
  update: (id, data) => api.put(`/activities/${id}`, data),
  complete: (id) => api.put(`/activities/${id}`, { completed: true }),
  delete: (id) => api.delete(`/activities/${id}`),
  getStats: () => api.get('/activities/stats'),
};

// ---- Tasks API ----
export const tasksAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// ---- Progress API ----
export const progressAPI = {
  getAll: (params) => api.get('/progress', { params }),
  create: (data) => api.post('/progress', data),
  getWeekly: () => api.get('/progress/weekly'),
  getMonthly: () => api.get('/progress/monthly'),
  getTrends: () => api.get('/progress/trends'),
};

// ---- Users API ----
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updateSubscription: (data) => api.put('/users/subscription', data),
  deleteAccount: () => api.delete('/users/account'),
  // Admin
  getAllUsers: (params) => api.get('/users/admin/all', { params }),
  adminUpdateUser: (id, data) => api.put(`/users/admin/${id}`, data),
  adminDeleteUser: (id) => api.delete(`/users/admin/${id}`),
};

// ---- AI API ----
export const aiAPI = {
  getRecommendations: () => api.get('/ai/recommendations'),
  getDailySuggestion: () => api.get('/ai/daily-suggestion'),
};

export default api;

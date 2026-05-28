import { useState, useEffect, useCallback } from 'react';
import { activitiesAPI } from '../services/api';

/**
 * Hook for managing activities with filtering and CRUD operations
 */
export function useActivities(initialFilters = {}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await activitiesAPI.getAll(filters);
      setActivities(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar actividades');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const createActivity = async (data) => {
    try {
      const res = await activitiesAPI.create(data);
      setActivities(prev => [res.data.data, ...prev]);
      return res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error al crear actividad');
    }
  };

  const updateActivity = async (id, data) => {
    try {
      const res = await activitiesAPI.update(id, data);
      setActivities(prev => prev.map(a => a._id === id ? res.data.data : a));
      return res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error al actualizar actividad');
    }
  };

  const deleteActivity = async (id) => {
    try {
      await activitiesAPI.delete(id);
      setActivities(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error al eliminar actividad');
    }
  };

  const completeActivity = async (id) => {
    return updateActivity(id, { completed: true, completedAt: new Date() });
  };

  return {
    activities,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    completeActivity,
  };
}

export default useActivities;

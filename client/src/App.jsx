import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import Shop from './pages/Shop';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin';

// Layout
import Layout from './components/layout/Layout';

// Loading spinner
import LoadingSpinner from './components/common/LoadingSpinner';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/privacy" element={<Privacy />} />

      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute><Register /></PublicRoute>
      } />

      {/* Protected Routes */}
      <Route element={
        <ProtectedRoute><Layout /></ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
        } />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

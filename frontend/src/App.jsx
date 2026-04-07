/**
 * App.jsx — Root component with routing and auth protection
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Advisers from './pages/Advisers';
import Halls from './pages/Halls';
import HallRooms from './pages/HallRooms';
import Apartments from './pages/Apartments';
import ApartmentRooms from './pages/ApartmentRooms';
import Places from './pages/Places';
import Leases from './pages/Leases';
import Invoices from './pages/Invoices';
import Inspections from './pages/Inspections';
import NextOfKin from './pages/NextOfKin';
import Staff from './pages/Staff';
import Courses from './pages/Courses';
import Reports from './pages/Reports';

/**
 * ProtectedRoute — redirects to /login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-900)]">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

/**
 * PublicRoute — redirects to / if already authenticated
 */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected routes — wrapped in Layout with sidebar/navbar */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
          <Route path="/advisers" element={<ProtectedRoute><Advisers /></ProtectedRoute>} />
          <Route path="/halls" element={<ProtectedRoute><Halls /></ProtectedRoute>} />
          <Route path="/hallrooms" element={<ProtectedRoute><HallRooms /></ProtectedRoute>} />
          <Route path="/apartments" element={<ProtectedRoute><Apartments /></ProtectedRoute>} />
          <Route path="/apartmentrooms" element={<ProtectedRoute><ApartmentRooms /></ProtectedRoute>} />
          <Route path="/places" element={<ProtectedRoute><Places /></ProtectedRoute>} />
          <Route path="/leases" element={<ProtectedRoute><Leases /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
          <Route path="/inspections" element={<ProtectedRoute><Inspections /></ProtectedRoute>} />
          <Route path="/kin" element={<ProtectedRoute><NextOfKin /></ProtectedRoute>} />
          <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

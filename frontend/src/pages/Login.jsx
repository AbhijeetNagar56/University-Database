/**
 * Login Page
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0e0e2a 50%, #0a0a1a 100%)',
      padding: '16px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '20%', width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '20%', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(80px)',
      }} />

      <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', padding: '16px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
            boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
            marginBottom: '16px',
          }}>
            <GraduationCap style={{ width: 36, height: 36, color: 'white' }} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>UAO System</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>University Accommodation Office</p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(20,20,50,0.95), rgba(12,12,35,0.98))',
          border: '1px solid rgba(99,102,241,0.15)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 16px 64px rgba(0,0,0,0.5), 0 4px 24px rgba(99,102,241,0.08)',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Sign in to access the dashboard</p>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px',
              borderRadius: '12px', marginBottom: '20px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171', fontSize: '0.85rem',
            }}>
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                Username<span style={{ color: '#f87171', marginLeft: '4px' }}>*</span>
              </label>
              <input
                type="text" required autoFocus
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Enter username"
                className="form-input"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                Password<span style={{ color: '#f87171', marginLeft: '4px' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                  className="form-input"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer',
                    padding: '4px', borderRadius: '6px',
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
            >
              {loading ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;

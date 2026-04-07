/**
 * Layout — main app shell with sidebar navigation + top navbar.
 */
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Building2, Building, FileText,
  Receipt, ClipboardCheck, UserCog, BarChart3, BookOpen,
  LogOut, Menu, X, GraduationCap, ChevronRight, UserRoundSearch,
  DoorOpen, BedDouble, MapPinned, HeartHandshake,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/students', icon: Users, label: 'Students' },
  { to: '/advisers', icon: UserRoundSearch, label: 'Advisers' },
  { to: '/halls', icon: Building2, label: 'Halls' },
  { to: '/hallrooms', icon: DoorOpen, label: 'Hall Rooms' },
  { to: '/apartments', icon: Building, label: 'Apartments' },
  { to: '/apartmentrooms', icon: BedDouble, label: 'Apartment Rooms' },
  { to: '/places', icon: MapPinned, label: 'Places' },
  { to: '/leases', icon: FileText, label: 'Leases' },
  { to: '/invoices', icon: Receipt, label: 'Invoices' },
  { to: '/inspections', icon: ClipboardCheck, label: 'Inspections' },
  { to: '/kin', icon: HeartHandshake, label: 'Next Of Kin' },
  { to: '/staff', icon: UserCog, label: 'Staff' },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }}
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ==================== SIDEBAR ==================== */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          width: '260px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #0e0e24 0%, #0a0a1a 100%)',
          borderRight: '1px solid rgba(99, 102, 241, 0.1)',
        }}
      >
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '20px 24px', borderBottom: '1px solid rgba(99,102,241,0.1)'
        }}>
          <div style={{
            padding: '10px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
          }}>
            <GraduationCap style={{ width: 24, height: 24, color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>UAO System</h1>
            <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Accommodation Office</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden"
            style={{ padding: 4, borderRadius: 8, background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                <ChevronRight style={{ width: 14, height: 14, opacity: 0.3 }} />
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
          <button
            onClick={handleLogout}
            className="nav-link"
            style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut style={{ width: 18, height: 18 }} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT ==================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Navbar */}
        <header style={{
          height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
          background: 'linear-gradient(90deg, rgba(14,14,36,0.95), rgba(10,10,26,0.95))',
          borderBottom: '1px solid rgba(99,102,241,0.08)',
          backdropFilter: 'blur(12px)',
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
            style={{ padding: 8, borderRadius: 8, background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <Menu style={{ width: 20, height: 20 }} />
          </button>

          <div className="hidden lg:block">
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Welcome back, <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{user?.username || 'Admin'}</span>
            </span>
          </div>

          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '0.8rem', fontWeight: 700,
            boxShadow: '0 2px 12px rgba(99,102,241,0.3)',
          }}>
            {(user?.username || 'A').charAt(0).toUpperCase()}
          </div>
        </header>

        {/* Page Content */}
        <main className="page-bg" style={{ flex: 1, overflowY: 'auto', padding: '28px', background: '#0a0a1a' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }} className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

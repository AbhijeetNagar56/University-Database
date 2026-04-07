/**
 * Dashboard — summary cards + charts
 */
import { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, Receipt, Building2, Building, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getStudents, getHalls, getApartments, getLeases, getInvoices } from '../services/api';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#e0e7ff'];

const Dashboard = () => {
  const [stats, setStats] = useState({ students: 0, placed: 0, waiting: 0, halls: 0, apartments: 0, leases: 0, unpaidInvoices: 0 });
  const [statusData, setStatusData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [sRes, hRes, aRes, lRes, iRes] = await Promise.all([
        getStudents(), getHalls(), getApartments(), getLeases(), getInvoices(),
      ]);

      const students = sRes.data || [];
      const invoices = iRes.data || [];

      // Status distribution
      const statusMap = {};
      students.forEach((s) => {
        const key = s.status || 'Unknown';
        statusMap[key] = (statusMap[key] || 0) + 1;
      });
      setStatusData(Object.entries(statusMap).map(([name, value]) => ({ name, value })));

      // Category distribution
      const catMap = {};
      students.forEach((s) => {
        const key = s.student_category || 'Unknown';
        catMap[key] = (catMap[key] || 0) + 1;
      });
      setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value })));

      setStats({
        students: students.length,
        placed: students.filter((s) => s.status === 'Placed').length,
        waiting: students.filter((s) => s.status === 'Waiting').length,
        halls: (hRes.data || []).length,
        apartments: (aRes.data || []).length,
        leases: (lRes.data || []).length,
        unpaidInvoices: invoices.filter((i) => !i.date_paid).length,
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const tooltipStyle = {
    contentStyle: {
      background: 'rgba(14,14,36,0.95)', border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: '12px', color: '#e2e8f0', fontSize: '0.8rem', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    },
    itemStyle: { color: '#a5b4fc' },
    labelStyle: { color: '#94a3b8' },
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Overview of the accommodation system</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard icon={Users} label="Total Students" value={stats.students} color="indigo" />
        <StatCard icon={CheckCircle} label="Students Placed" value={stats.placed} color="emerald" />
        <StatCard icon={Clock} label="Waiting List" value={stats.waiting} color="amber" />
        <StatCard icon={Receipt} label="Unpaid Invoices" value={stats.unpaidInvoices} color="rose" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard icon={Building2} label="Total Halls" value={stats.halls} color="sky" />
        <StatCard icon={Building} label="Total Apartments" value={stats.apartments} color="violet" />
        <StatCard icon={FileText} label="Active Leases" value={stats.leases} color="emerald" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {/* Status Bar Chart */}
        <div className="chart-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '20px' }}>Student Status Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(99,102,241,0.1)' }} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(99,102,241,0.1)' }} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={60}>
                {statusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div className="chart-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '20px' }}>Students by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryData} dataKey="value" nameKey="name"
                cx="50%" cy="50%" innerRadius={65} outerRadius={100}
                paddingAngle={4} strokeWidth={0}
              >
                {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

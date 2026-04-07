/**
 * Reports Page — 14 reports (a–n) for the Student Accommodation Management System.
 * Parameterized reports (d, e, g, k) show an input form before execution.
 */
import { useState } from 'react';
import {
  Building2, Users, FileText, DollarSign, Receipt,
  AlertTriangle, Home, Clock, PieChart, UserX,
  UserCheck, TrendingUp, MapPin, UserCog,
  ChevronRight, Download, Search, ArrowLeft, Hash,
} from 'lucide-react';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  getReportA, getReportB, getReportC, getReportD,
  getReportE, getReportF, getReportG, getReportH,
  getReportI, getReportJ, getReportK, getReportL,
  getReportM, getReportN,
} from '../services/api';

/* ═══════════════════════ REPORT DEFINITIONS ═══════════════════════ */

const reports = [
  {
    id: 'a', title: '(a) Hall Managers',
    description: "Manager's name and telephone for each hall of residence",
    icon: Building2, color: 'sky',
    fetcher: () => getReportA(),
    columns: [
      { key: 'hall_id', label: 'Hall ID' },
      { key: 'hall_name', label: 'Hall Name' },
      { key: 'manager_name', label: 'Manager Name' },
      { key: 'telephone', label: 'Telephone' },
    ],
    searchKeys: ['hall_name', 'manager_name'],
  },
  {
    id: 'b', title: '(b) Student Leases',
    description: 'Students with their banner numbers and lease agreement details',
    icon: FileText, color: 'indigo',
    fetcher: () => getReportB(),
    columns: [
      { key: 'banner_number', label: 'Banner #' },
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'lease_id', label: 'Lease ID' },
      { key: 'place_number', label: 'Place #' },
      { key: 'room_number', label: 'Room #' },
      { key: 'start_date', label: 'Start', render: r => r.start_date ? new Date(r.start_date).toLocaleDateString() : '—' },
      { key: 'end_date', label: 'End', render: r => r.end_date ? new Date(r.end_date).toLocaleDateString() : '—' },
      { key: 'lease_duration_semesters', label: 'Duration (Sem)' },
    ],
    searchKeys: ['first_name', 'last_name', 'banner_number'],
  },
  {
    id: 'c', title: '(c) Summer Leases',
    description: 'Lease agreements that include the summer semester',
    icon: FileText, color: 'amber',
    fetcher: () => getReportC(),
    columns: [
      { key: 'lease_id', label: 'Lease ID' },
      { key: 'banner_number', label: 'Banner #' },
      { key: 'place_number', label: 'Place #' },
      { key: 'room_number', label: 'Room #' },
      { key: 'start_date', label: 'Start', render: r => r.start_date ? new Date(r.start_date).toLocaleDateString() : '—' },
      { key: 'end_date', label: 'End', render: r => r.end_date ? new Date(r.end_date).toLocaleDateString() : '—' },
      { key: 'lease_duration_semesters', label: 'Duration (Sem)' },
    ],
    searchKeys: ['banner_number', 'lease_id'],
  },
  {
    id: 'd', title: '(d) Total Rent Paid',
    description: 'Total rent paid by a specific student',
    icon: DollarSign, color: 'emerald',
    paramLabel: 'Student Banner Number',
    paramKey: 'student_id',
    paramPlaceholder: 'e.g. B00100',
    fetcher: (params) => getReportD(params.student_id),
    columns: [
      { key: 'banner_number', label: 'Banner #' },
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'invoices_paid', label: 'Paid Invoices' },
      { key: 'total_rent_paid', label: 'Total Rent Paid', render: r => <span style={{ color: '#34d399', fontWeight: 600 }}>£{r.total_rent_paid || 0}</span> },
    ],
    searchKeys: ['first_name', 'last_name', 'banner_number'],
  },
  {
    id: 'e', title: '(e) Unpaid by Date',
    description: 'Students who have not paid invoices by a given date',
    icon: Receipt, color: 'rose',
    paramLabel: 'Due Date',
    paramKey: 'due_date',
    paramType: 'date',
    paramPlaceholder: 'YYYY-MM-DD',
    fetcher: (params) => getReportE(params.due_date),
    columns: [
      { key: 'invoice_id', label: 'Invoice #' },
      { key: 'banner_number', label: 'Banner #' },
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'semester', label: 'Semester' },
      { key: 'payment_due', label: 'Amount Due', render: r => <span style={{ color: '#f87171', fontWeight: 600 }}>£{r.payment_due || 0}</span> },
      { key: 'first_reminder_date', label: '1st Reminder', render: r => r.first_reminder_date ? new Date(r.first_reminder_date).toLocaleDateString() : '—' },
      { key: 'second_reminder_date', label: '2nd Reminder', render: r => r.second_reminder_date ? new Date(r.second_reminder_date).toLocaleDateString() : '—' },
    ],
    searchKeys: ['first_name', 'last_name', 'banner_number'],
  },
  {
    id: 'f', title: '(f) Unsatisfactory Inspections',
    description: "Apartment inspections marked as 'unsatisfactory'",
    icon: AlertTriangle, color: 'rose',
    fetcher: () => getReportF(),
    columns: [
      { key: 'inspection_id', label: 'ID' },
      { key: 'apartment_id', label: 'Apt ID' },
      { key: 'street', label: 'Street' },
      { key: 'city', label: 'City' },
      { key: 'staff_id', label: 'Staff ID' },
      { key: 'inspection_date', label: 'Date', render: r => r.inspection_date ? new Date(r.inspection_date).toLocaleDateString() : '—' },
      { key: 'comments', label: 'Comments' },
    ],
    searchKeys: ['street', 'staff_id', 'comments'],
  },
  {
    id: 'g', title: '(g) Students in Hall',
    description: 'Students with room & place numbers in a specific hall',
    icon: Home, color: 'violet',
    paramLabel: 'Hall ID',
    paramKey: 'hall_id',
    paramPlaceholder: 'e.g. H001',
    fetcher: (params) => getReportG(params.hall_id),
    columns: [
      { key: 'banner_number', label: 'Banner #' },
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'hall_name', label: 'Hall' },
      { key: 'room_number', label: 'Room #' },
      { key: 'place_number', label: 'Place #' },
    ],
    searchKeys: ['first_name', 'last_name', 'banner_number'],
  },
  {
    id: 'h', title: '(h) Waiting List',
    description: 'Students not yet allocated accommodation',
    icon: Clock, color: 'amber',
    fetcher: () => getReportH(),
    columns: [
      { key: 'banner_number', label: 'Banner #' },
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'mobile_phone', label: 'Phone' },
      { key: 'student_category', label: 'Category' },
      { key: 'nationality', label: 'Nationality' },
    ],
    searchKeys: ['first_name', 'last_name', 'email'],
  },
  {
    id: 'i', title: '(i) Student Categories',
    description: 'Total number of students in each category',
    icon: PieChart, color: 'indigo',
    fetcher: () => getReportI(),
    columns: [
      { key: 'student_category', label: 'Category' },
      { key: 'total_students', label: 'Total Students', render: r => <span style={{ color: '#a5b4fc', fontWeight: 700, fontSize: '1rem' }}>{r.total_students}</span> },
    ],
    searchKeys: ['student_category'],
  },
  {
    id: 'j', title: '(j) No Next-of-Kin',
    description: 'Students who have not provided next-of-kin details',
    icon: UserX, color: 'violet',
    fetcher: () => getReportJ(),
    columns: [
      { key: 'banner_number', label: 'Banner #' },
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
    ],
    searchKeys: ['first_name', 'last_name', 'banner_number'],
  },
  {
    id: 'k', title: '(k) Student Adviser',
    description: "Adviser name and phone for a specific student",
    icon: UserCheck, color: 'sky',
    paramLabel: 'Student Banner Number',
    paramKey: 'student_id',
    paramPlaceholder: 'e.g. B00100',
    fetcher: (params) => getReportK(params.student_id),
    columns: [
      { key: 'banner_number', label: 'Banner #' },
      { key: 'first_name', label: 'Student First' },
      { key: 'last_name', label: 'Student Last' },
      { key: 'adviser_name', label: 'Adviser Name' },
      { key: 'internal_phone', label: 'Internal Phone' },
    ],
    searchKeys: ['adviser_name', 'first_name', 'last_name'],
  },
  {
    id: 'l', title: '(l) Hall Rent Stats',
    description: 'Min, max, and average monthly rent for hall rooms',
    icon: TrendingUp, color: 'emerald',
    fetcher: () => getReportL(),
    columns: [
      { key: 'minimum_monthly_rent', label: 'Minimum Rent', render: r => <span style={{ color: '#34d399', fontWeight: 600 }}>£{r.minimum_monthly_rent || 0}</span> },
      { key: 'maximum_monthly_rent', label: 'Maximum Rent', render: r => <span style={{ color: '#f87171', fontWeight: 600 }}>£{r.maximum_monthly_rent || 0}</span> },
      { key: 'average_monthly_rent', label: 'Average Rent', render: r => <span style={{ color: '#fbbf24', fontWeight: 600 }}>£{parseFloat(r.average_monthly_rent).toFixed(2) || 0}</span> },
    ],
    searchKeys: [],
  },
  {
    id: 'm', title: '(m) Hall Place Count',
    description: 'Total number of places available in each residence hall',
    icon: MapPin, color: 'sky',
    fetcher: () => getReportM(),
    columns: [
      { key: 'hall_id', label: 'Hall ID' },
      { key: 'hall_name', label: 'Hall Name' },
      { key: 'total_places', label: 'Total Places', render: r => <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '1rem' }}>{r.total_places}</span> },
    ],
    searchKeys: ['hall_name'],
  },
  {
    id: 'n', title: '(n) Staff Over 60',
    description: 'Staff members over 60 years old with their details',
    icon: UserCog, color: 'rose',
    fetcher: () => getReportN(),
    columns: [
      { key: 'staff_id', label: 'Staff ID' },
      { key: 'full_name', label: 'Full Name' },
      { key: 'age', label: 'Age', render: r => <span style={{ color: '#fbbf24', fontWeight: 600 }}>{r.age}</span> },
      { key: 'location', label: 'Location' },
    ],
    searchKeys: ['full_name', 'location'],
  },
];

/* ═══════════════════════ COLORS ═══════════════════════ */

const iconColors = {
  amber: '#fbbf24', rose: '#f87171', emerald: '#34d399',
  violet: '#a78bfa', sky: '#38bdf8', indigo: '#818cf8',
};

const tagColors = {
  amber: 'badge-amber', rose: 'badge-rose', emerald: 'badge-emerald',
  violet: 'badge-violet', sky: 'badge-sky', indigo: 'badge-indigo',
};

/* ═══════════════════════ COMPONENT ═══════════════════════ */

const Reports = () => {
  const [activeReport, setActiveReport] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paramValue, setParamValue] = useState('');
  const [showParamInput, setShowParamInput] = useState(false);
  const [pendingReport, setPendingReport] = useState(null);

  /* ── Run a report, optionally with params ── */
  const runReport = async (report, params = {}) => {
    setActiveReport(report);
    setData([]);
    setError('');
    setLoading(true);
    setShowParamInput(false);
    setPendingReport(null);
    try {
      const res = await report.fetcher(params);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to run report');
    } finally {
      setLoading(false);
    }
  };

  /* ── Clicked a report card ── */
  const handleCardClick = (report) => {
    if (report.paramKey) {
      setPendingReport(report);
      setShowParamInput(true);
      setParamValue('');
      setActiveReport(null);
      setData([]);
      setError('');
    } else {
      runReport(report);
    }
  };

  /* ── Submit param form ── */
  const handleParamSubmit = (e) => {
    e.preventDefault();
    if (!paramValue.trim() || !pendingReport) return;
    runReport(pendingReport, { [pendingReport.paramKey]: paramValue.trim() });
  };

  /* ── CSV Export ── */
  const exportCSV = () => {
    if (!activeReport || !data.length) return;
    const headers = activeReport.columns.map(c => c.label).join(',');
    const rows = data.map(row =>
      activeReport.columns.map(c => `"${String(row[c.key] ?? '').replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `report_${activeReport.id}.csv`;
    a.click();
  };

  return (
    <div>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>
          Reports
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          14 predefined reports — click any card to generate
        </p>
      </div>

      {/* ── Report Cards Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '14px',
        marginBottom: '28px',
      }}>
        {reports.map(report => {
          const Icon = report.icon;
          const isActive = activeReport?.id === report.id || pendingReport?.id === report.id;
          const clr = iconColors[report.color] || '#818cf8';

          return (
            <button
              key={report.id}
              onClick={() => handleCardClick(report)}
              className={`report-card report-card-${report.color}`}
              style={isActive ? { borderColor: clr, boxShadow: `0 0 30px ${clr}15` } : {}}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon style={{ width: 22, height: 22, color: clr }} />
                  <span className={`badge ${tagColors[report.color] || 'badge-indigo'}`} style={{ fontSize: '0.65rem' }}>
                    {report.paramKey ? '⚡ Param' : 'Auto'}
                  </span>
                </div>
                <ChevronRight style={{ width: 16, height: 16, color: '#475569' }} />
              </div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '5px' }}>
                {report.title}
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.5 }}>
                {report.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* ── Parameter Input Form ── */}
      {showParamInput && pendingReport && (
        <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <button
              onClick={() => { setShowParamInput(false); setPendingReport(null); }}
              style={{
                background: 'rgba(30,30,60,0.8)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px', padding: '8px', cursor: 'pointer', color: '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ArrowLeft style={{ width: 16, height: 16 }} />
            </button>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                {pendingReport.title}
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                Enter the required parameter to generate this report
              </p>
            </div>
          </div>

          <form onSubmit={handleParamSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 280px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                {pendingReport.paramLabel} <span style={{ color: '#f87171' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Hash style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  width: 16, height: 16, color: '#475569',
                }} />
                <input
                  type={pendingReport.paramType || 'text'}
                  value={paramValue}
                  onChange={e => setParamValue(e.target.value)}
                  placeholder={pendingReport.paramPlaceholder}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  autoFocus
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ height: '44px', minWidth: '140px' }}>
              <Search style={{ width: 16, height: 16 }} />
              Run Report
            </button>
          </form>
        </div>
      )}

      {/* ── Report Results ── */}
      {activeReport && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => { setActiveReport(null); setData([]); }}
                style={{
                  background: 'rgba(30,30,60,0.8)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px', padding: '8px', cursor: 'pointer', color: '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ArrowLeft style={{ width: 16, height: 16 }} />
              </button>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{activeReport.title}</h2>
                <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '4px' }}>
                  {loading ? 'Loading...' : `${data.length} record${data.length !== 1 ? 's' : ''} found`}
                </p>
              </div>
            </div>
            {data.length > 0 && (
              <button
                onClick={exportCSV}
                className="badge badge-emerald"
                style={{ cursor: 'pointer', padding: '8px 16px', fontSize: '0.8rem', border: '1px solid rgba(16,185,129,0.3)' }}
              >
                <Download style={{ width: 14, height: 14 }} /> Export CSV
              </button>
            )}
          </div>

          {loading ? (
            <LoadingSpinner message="Running report..." />
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#f87171', fontSize: '0.9rem' }}>
              {error}
            </div>
          ) : (
            <DataTable
              columns={activeReport.columns}
              data={data}
              searchKeys={activeReport.searchKeys}
              emptyMessage="No data found for this report"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;

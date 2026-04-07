/**
 * Invoices Page — CRUD + Mark Paid + Reminders
 * Form fields match the Invoices database table exactly.
 */
import { useState, useEffect } from 'react';
import { Plus, CheckCircle, AlertCircle } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import DeleteConfirm from '../components/DeleteConfirm';
import LoadingSpinner from '../components/LoadingSpinner';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice, getStudents, getLeases } from '../services/api';

const cleanPayload = (obj) => {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== '' && v !== undefined) out[k] = v;
  }
  return out;
};

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [students, setStudents] = useState([]);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [payTarget, setPayTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [payFilter, setPayFilter] = useState('');

  const emptyForm = {
    lease_id: '', semester: '', payment_due: '', banner_number: '',
    place_number: '', room_number: '', address: '', date_paid: '',
    payment_method: '', first_reminder_date: '', second_reminder_date: ''
  };
  const [form, setForm] = useState(emptyForm);
  const [payForm, setPayForm] = useState({ date_paid: '', payment_method: '' });

  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => {
    try {
      setLoading(true);
      const [i, s, l] = await Promise.all([getInvoices(), getStudents(), getLeases()]);
      setInvoices(i.data || []);
      setStudents(s.data || []);
      setLeases(l.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const getStudentName = (bn) => { const s = students.find(st => st.banner_number === bn); return s ? `${s.first_name} ${s.last_name}` : bn; };

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      ...emptyForm, ...row,
      payment_due: row.payment_due || '',
      date_paid: row.date_paid?.split('T')[0] || '',
      first_reminder_date: row.first_reminder_date?.split('T')[0] || '',
      second_reminder_date: row.second_reminder_date?.split('T')[0] || ''
    });
    setShowForm(true);
  };
  const openDelete = (row) => { setDeleteTarget(row); setShowDelete(true); };
  const openMarkPaid = (row) => {
    setPayTarget(row);
    setPayForm({ date_paid: new Date().toISOString().split('T')[0], payment_method: '' });
    setShowPay(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = cleanPayload(form);
      if (editing) {
        delete payload.invoice_id;
        await updateInvoice(editing.invoice_id, payload);
      } else {
        await createInvoice(payload);
      }
      setShowForm(false);
      fetchAll();
    } catch (err) { alert(err.response?.data?.error || 'Failed to save invoice'); }
    finally { setSaving(false); }
  };

  const handleMarkPaid = async (e) => {
    e.preventDefault();
    try {
      const payload = cleanPayload(payForm);
      await updateInvoice(payTarget.invoice_id, payload);
      setShowPay(false);
      fetchAll();
    } catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await deleteInvoice(deleteTarget.invoice_id); setShowDelete(false); fetchAll(); }
    catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  const filtered = invoices.filter(inv => {
    if (payFilter === 'paid') return !!inv.date_paid;
    if (payFilter === 'unpaid') return !inv.date_paid;
    return true;
  });

  const columns = [
    { key: 'invoice_id', label: 'Invoice #' },
    { key: 'banner_number', label: 'Student', render: r => <span style={{ color: '#a5b4fc' }}>{getStudentName(r.banner_number)}</span> },
    { key: 'semester', label: 'Semester' },
    { key: 'payment_due', label: 'Amount Due', render: r => r.payment_due ? `£${r.payment_due}` : '—' },
    { key: 'date_paid', label: 'Status', render: r => r.date_paid ? <span className="badge badge-emerald"><CheckCircle style={{ width: 14, height: 14 }} /> Paid</span> : <span className="badge badge-amber"><AlertCircle style={{ width: 14, height: 14 }} /> Unpaid</span> },
    { key: 'actions_pay', label: '', render: r => !r.date_paid ? <button onClick={e => { e.stopPropagation(); openMarkPaid(r) }} className="badge badge-emerald" style={{ cursor: 'pointer', border: '1px solid rgba(16,185,129,0.3)' }}>Mark Paid</button> : null },
  ];

  if (loading) return <LoadingSpinner message="Loading invoices..." />;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div><h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>Invoices</h1><p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage payment invoices</p></div>
        <button onClick={openAdd} className="btn-primary"><Plus style={{ width: 16, height: 16 }} /> Create Invoice</button>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[{ v: '', l: 'All' }, { v: 'unpaid', l: 'Unpaid' }, { v: 'paid', l: 'Paid' }].map(({ v, l }) => (<button key={v} onClick={() => setPayFilter(v)} className={`filter-btn ${payFilter === v ? 'filter-btn-active' : ''}`}>{l}</button>))}
      </div>
      <DataTable columns={columns} data={filtered} onEdit={openEdit} onDelete={openDelete} searchKeys={['invoice_id', 'banner_number', 'semester']} />

      {/* Main Invoice Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Invoice' : 'Create Invoice'} size="lg">
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Lease" name="lease_id" type="select" value={form.lease_id} onChange={handleChange} required options={leases.map(l => ({ value: l.lease_id, label: `Lease ${l.lease_id} (${l.banner_number})` }))} />
          <FormField label="Semester" name="semester" value={form.semester} onChange={handleChange} />
          <FormField label="Student" name="banner_number" type="select" value={form.banner_number} onChange={handleChange} required options={students.map(s => ({ value: s.banner_number, label: `${s.first_name} ${s.last_name}` }))} />
          <FormField label="Place Number" name="place_number" type="number" value={form.place_number} onChange={handleChange} />
          <FormField label="Room Number" name="room_number" value={form.room_number} onChange={handleChange} />
          <FormField label="Address" name="address" value={form.address} onChange={handleChange} />
          <FormField label="Amount Due (£)" name="payment_due" type="number" step="0.01" value={form.payment_due} onChange={handleChange} />
          <FormField label="Date Paid" name="date_paid" type="date" value={form.date_paid} onChange={handleChange} />
          <FormField label="Payment Method" name="payment_method" value={form.payment_method} onChange={handleChange} />
          <FormField label="1st Reminder" name="first_reminder_date" type="date" value={form.first_reminder_date} onChange={handleChange} />
          <FormField label="2nd Reminder" name="second_reminder_date" type="date" value={form.second_reminder_date} onChange={handleChange} />
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* Mark as Paid Modal */}
      <Modal isOpen={showPay} onClose={() => setShowPay(false)} title="Mark as Paid" size="sm">
        <form onSubmit={handleMarkPaid} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormField label="Date Paid" name="date_paid" type="date" value={payForm.date_paid} onChange={e => setPayForm({ ...payForm, date_paid: e.target.value })} required />
          <FormField label="Payment Method" name="payment_method" value={payForm.payment_method} onChange={e => setPayForm({ ...payForm, payment_method: e.target.value })} required />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
            <button type="button" onClick={() => setShowPay(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>Confirm</button>
          </div>
        </form>
      </Modal>
      <DeleteConfirm isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName={`Invoice ${deleteTarget?.invoice_id}`} />
    </div>
  );
};

export default Invoices;

/**
 * Leases Page — CRUD with filtering
 * Form fields match Leases DB table exactly:
 *   lease_id (PK), banner_number (FK), place_number, lease_duration_semesters,
 *   start_date, end_date, address, room_number
 */
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import DeleteConfirm from '../components/DeleteConfirm';
import LoadingSpinner from '../components/LoadingSpinner';
import { getLeases, createLease, updateLease, deleteLease, getStudents } from '../services/api';

const cleanPayload = (obj) => {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== '' && v !== undefined) out[k] = v;
  }
  return out;
};

const Leases = () => {
  const [leases, setLeases] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    banner_number: '', place_number: '', room_number: '',
    lease_duration_semesters: '', start_date: '', end_date: '', address: '',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => {
    try {
      setLoading(true);
      const [lRes, sRes] = await Promise.all([getLeases(), getStudents()]);
      setLeases(lRes.data || []);
      setStudents(sRes.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      ...emptyForm, ...row,
      start_date: row.start_date ? row.start_date.split('T')[0] : '',
      end_date: row.end_date ? row.end_date.split('T')[0] : '',
    });
    setShowForm(true);
  };
  const openDelete = (row) => { setDeleteTarget(row); setShowDelete(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = cleanPayload(form);
      if (editing) {
        delete payload.lease_id;
        await updateLease(editing.lease_id, payload);
      } else {
        await createLease(payload);
      }
      setShowForm(false);
      fetchAll();
    } catch (err) { alert(err.response?.data?.error || 'Failed to save lease'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await deleteLease(deleteTarget.lease_id); setShowDelete(false); fetchAll(); }
    catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  const getStudentName = (bn) => {
    const s = students.find((st) => st.banner_number === bn);
    return s ? `${s.first_name} ${s.last_name}` : bn;
  };

  const columns = [
    { key: 'lease_id', label: 'Lease ID' },
    { key: 'banner_number', label: 'Student', render: (row) => <span style={{ color: '#a5b4fc' }}>{getStudentName(row.banner_number)}</span> },
    { key: 'place_number', label: 'Place #' },
    { key: 'room_number', label: 'Room #' },
    { key: 'lease_duration_semesters', label: 'Duration' },
    { key: 'start_date', label: 'Start', render: (row) => row.start_date ? new Date(row.start_date).toLocaleDateString() : '—' },
    { key: 'end_date', label: 'End', render: (row) => row.end_date ? new Date(row.end_date).toLocaleDateString() : '—' },
    { key: 'address', label: 'Address' },
  ];

  if (loading) return <LoadingSpinner message="Loading leases..." />;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>Leases</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage lease agreements</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus style={{ width: 16, height: 16 }} /> Add Lease</button>
      </div>

      <DataTable columns={columns} data={leases} onEdit={openEdit} onDelete={openDelete} searchKeys={['lease_id', 'banner_number', 'address']} />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Lease' : 'Add Lease'} size="md">
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Student" name="banner_number" type="select" value={form.banner_number} onChange={handleChange} required options={students.map((s) => ({ value: s.banner_number, label: `${s.first_name} ${s.last_name}` }))} />
          <FormField label="Place Number" name="place_number" type="number" value={form.place_number} onChange={handleChange} required />
          <FormField label="Room Number" name="room_number" value={form.room_number} onChange={handleChange} />
          <FormField label="Duration (Semesters)" name="lease_duration_semesters" type="number" value={form.lease_duration_semesters} onChange={handleChange} />
          <FormField label="Start Date" name="start_date" type="date" value={form.start_date} onChange={handleChange} />
          <FormField label="End Date" name="end_date" type="date" value={form.end_date} onChange={handleChange} />
          <div style={{ gridColumn: 'span 2' }}>
            <FormField label="Address" name="address" value={form.address} onChange={handleChange} />
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <DeleteConfirm isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName={`Lease ${deleteTarget?.lease_id}`} />
    </div>
  );
};

export default Leases;

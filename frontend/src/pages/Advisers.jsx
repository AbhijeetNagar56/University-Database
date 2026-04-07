import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import DeleteConfirm from '../components/DeleteConfirm';
import LoadingSpinner from '../components/LoadingSpinner';
import RecordDetails from '../components/RecordDetails';
import { getAdvisers, createAdviser, updateAdviser, deleteAdviser } from '../services/api';

const Advisers = () => {
  const [advisers, setAdvisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailAdviser, setDetailAdviser] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    full_name: '',
    position: '',
    department_name: '',
    internal_phone: '',
    email: '',
    room_number: '',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await getAdvisers();
      setAdvisers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (row) => { setEditing(row); setForm({ ...emptyForm, ...row }); setShowForm(true); };
  const openDelete = (row) => { setDeleteTarget(row); setShowDelete(true); };
  const openDetail = (row) => { setDetailAdviser(row); setShowDetail(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await updateAdviser(editing.adviser_id, form);
      else await createAdviser(form);
      setShowForm(false);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save adviser');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAdviser(deleteTarget.adviser_id);
      setShowDelete(false);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete adviser');
    }
  };

  const columns = [
    { key: 'adviser_id', label: 'ID' },
    { key: 'full_name', label: 'Full Name' },
    { key: 'position', label: 'Position' },
    { key: 'department_name', label: 'Department' },
    { key: 'internal_phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'room_number', label: 'Room' },
  ];

  if (loading) return <LoadingSpinner message="Loading advisers..." />;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>Advisers</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage student advisers and contact details</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus style={{ width: 16, height: 16 }} /> Add Adviser
        </button>
      </div>

      <DataTable columns={columns} data={advisers} onView={openDetail} onEdit={openEdit} onDelete={openDelete} searchKeys={['full_name', 'department_name', 'email', 'position']} />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Adviser' : 'Add Adviser'} size="md">
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} required />
          <FormField label="Position" name="position" value={form.position} onChange={handleChange} />
          <FormField label="Department" name="department_name" value={form.department_name} onChange={handleChange} />
          <FormField label="Internal Phone" name="internal_phone" value={form.internal_phone} onChange={handleChange} />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <FormField label="Room Number" name="room_number" value={form.room_number} onChange={handleChange} />
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Adviser Details" size="md">
        {detailAdviser && <RecordDetails items={[
          { label: 'Adviser ID', value: detailAdviser.adviser_id },
          { label: 'Full Name', value: detailAdviser.full_name },
          { label: 'Position', value: detailAdviser.position },
          { label: 'Department', value: detailAdviser.department_name },
          { label: 'Internal Phone', value: detailAdviser.internal_phone },
          { label: 'Email', value: detailAdviser.email },
          { label: 'Room Number', value: detailAdviser.room_number },
        ]} />}
      </Modal>

      <DeleteConfirm isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName={deleteTarget?.full_name} />
    </div>
  );
};

export default Advisers;

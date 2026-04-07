import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import DeleteConfirm from '../components/DeleteConfirm';
import LoadingSpinner from '../components/LoadingSpinner';
import RecordDetails from '../components/RecordDetails';
import { getNextOfKin, createNextOfKin, updateNextOfKin, deleteNextOfKin, getStudents } from '../services/api';

const cleanPayload = (obj) => {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== '' && value !== undefined) out[key] = value;
  }
  return out;
};

const NextOfKin = () => {
  const [kinRows, setKinRows] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailKin, setDetailKin] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    banner_number: '',
    name: '',
    relationship: '',
    street: '',
    city: '',
    postcode: '',
    phone: '',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [kinRes, studentRes] = await Promise.all([getNextOfKin(), getStudents()]);
      setKinRows(kinRes.data || []);
      setStudents(studentRes.data || []);
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
  const openDetail = (row) => { setDetailKin(row); setShowDetail(true); };
  const getStudentName = (bannerNumber) => {
    const student = students.find((row) => row.banner_number === bannerNumber);
    return student ? `${student.first_name} ${student.last_name}` : bannerNumber;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await updateNextOfKin(editing.kin_id, cleanPayload(form));
      else await createNextOfKin(cleanPayload(form));
      setShowForm(false);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save next of kin');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNextOfKin(deleteTarget.kin_id);
      setShowDelete(false);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete next of kin');
    }
  };

  const columns = [
    { key: 'kin_id', label: 'ID' },
    { key: 'banner_number', label: 'Student', render: (row) => getStudentName(row.banner_number) },
    { key: 'name', label: 'Name' },
    { key: 'relationship', label: 'Relationship' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
  ];

  if (loading) return <LoadingSpinner message="Loading next of kin..." />;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>Next of Kin</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage emergency contacts linked to students</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus style={{ width: 16, height: 16 }} /> Add Contact
        </button>
      </div>

      <DataTable columns={columns} data={kinRows} onView={openDetail} onEdit={openEdit} onDelete={openDelete} searchKeys={['banner_number', 'name', 'relationship', 'phone', 'city']} />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Next of Kin' : 'Add Next of Kin'} size="md">
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Student" name="banner_number" type="select" value={form.banner_number} onChange={handleChange} required options={students.map((student) => ({ value: student.banner_number, label: `${student.banner_number} — ${student.first_name} ${student.last_name}` }))} />
          <FormField label="Name" name="name" value={form.name} onChange={handleChange} required />
          <FormField label="Relationship" name="relationship" value={form.relationship} onChange={handleChange} />
          <FormField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <FormField label="Street" name="street" value={form.street} onChange={handleChange} />
          <FormField label="City" name="city" value={form.city} onChange={handleChange} />
          <FormField label="Postcode" name="postcode" value={form.postcode} onChange={handleChange} />
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Next of Kin Details" size="md">
        {detailKin && <RecordDetails items={[
          { label: 'Kin ID', value: detailKin.kin_id },
          { label: 'Student', value: getStudentName(detailKin.banner_number) },
          { label: 'Banner Number', value: detailKin.banner_number },
          { label: 'Name', value: detailKin.name },
          { label: 'Relationship', value: detailKin.relationship },
          { label: 'Phone', value: detailKin.phone },
          { label: 'Street', value: detailKin.street },
          { label: 'City', value: detailKin.city },
          { label: 'Postcode', value: detailKin.postcode },
        ]} />}
      </Modal>

      <DeleteConfirm isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName={deleteTarget?.name} />
    </div>
  );
};

export default NextOfKin;

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import DeleteConfirm from '../components/DeleteConfirm';
import LoadingSpinner from '../components/LoadingSpinner';
import RecordDetails from '../components/RecordDetails';
import { getPlaces, createPlace, updatePlace, deletePlace } from '../services/api';

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailPlace, setDetailPlace] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = { place_type: '' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await getPlaces();
      setPlaces(res.data || []);
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
  const openDetail = (row) => { setDetailPlace(row); setShowDetail(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await updatePlace(editing.place_number, form);
      else await createPlace(form);
      setShowForm(false);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save place');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePlace(deleteTarget.place_number);
      setShowDelete(false);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete place');
    }
  };

  const columns = [
    { key: 'place_number', label: 'Place #' },
    { key: 'place_type', label: 'Place Type' },
  ];

  if (loading) return <LoadingSpinner message="Loading places..." />;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>Places</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage the shared place registry</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus style={{ width: 16, height: 16 }} /> Add Place
        </button>
      </div>

      <DataTable columns={columns} data={places} onView={openDetail} onEdit={openEdit} onDelete={openDelete} searchKeys={['place_number', 'place_type']} />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Place' : 'Add Place'} size="sm">
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px' }}>
          <FormField label="Place Type" name="place_type" type="select" value={form.place_type} onChange={handleChange} required options={[{ value: 'Hall', label: 'Hall' }, { value: 'Apartment', label: 'Apartment' }]} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Place Details" size="sm">
        {detailPlace && <RecordDetails items={[
          { label: 'Place Number', value: detailPlace.place_number },
          { label: 'Place Type', value: detailPlace.place_type },
        ]} />}
      </Modal>

      <DeleteConfirm isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName={deleteTarget ? `place ${deleteTarget.place_number}` : 'this place'} />
    </div>
  );
};

export default Places;

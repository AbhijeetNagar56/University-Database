import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import DeleteConfirm from '../components/DeleteConfirm';
import LoadingSpinner from '../components/LoadingSpinner';
import RecordDetails from '../components/RecordDetails';
import { getHallRooms, createHallRoom, updateHallRoom, deleteHallRoom, getHalls } from '../services/api';

const cleanPayload = (obj) => {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== '' && value !== undefined) out[key] = value;
  }
  return out;
};

const HallRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailRoom, setDetailRoom] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = { place_number: '', hall_id: '', room_number: '', monthly_rent: '' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [roomRes, hallRes] = await Promise.all([getHallRooms(), getHalls()]);
      setRooms(roomRes.data || []);
      setHalls(hallRes.data || []);
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
  const openDetail = (row) => { setDetailRoom(row); setShowDetail(true); };
  const hallLabel = (hallId) => halls.find((hall) => hall.hall_id === hallId)?.hall_name || `Hall ${hallId}`;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = cleanPayload(form);
      if (editing) {
        delete payload.place_number;
        await updateHallRoom(editing.place_number, payload);
      } else {
        await createHallRoom(payload);
      }
      setShowForm(false);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save hall room');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHallRoom(deleteTarget.place_number);
      setShowDelete(false);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete hall room');
    }
  };

  const columns = [
    { key: 'place_number', label: 'Place #' },
    { key: 'hall_id', label: 'Hall', render: (row) => hallLabel(row.hall_id) },
    { key: 'room_number', label: 'Room #' },
    { key: 'monthly_rent', label: 'Monthly Rent', render: (row) => `£${row.monthly_rent ?? 0}` },
  ];

  if (loading) return <LoadingSpinner message="Loading hall rooms..." />;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>Hall Rooms</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage rooms and rent for each hall</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus style={{ width: 16, height: 16 }} /> Add Hall Room
        </button>
      </div>

      <DataTable columns={columns} data={rooms} onView={openDetail} onEdit={openEdit} onDelete={openDelete} searchKeys={['place_number', 'room_number', 'hall_id']} />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Hall Room' : 'Add Hall Room'} size="md">
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {!editing && <FormField label="Place Number" name="place_number" value={form.place_number} onChange={handleChange} />}
          <FormField label="Hall" name="hall_id" type="select" value={form.hall_id} onChange={handleChange} required options={halls.map((hall) => ({ value: hall.hall_id, label: hall.hall_name }))} />
          <FormField label="Room Number" name="room_number" value={form.room_number} onChange={handleChange} />
          <FormField label="Monthly Rent" name="monthly_rent" type="number" step="0.01" value={form.monthly_rent} onChange={handleChange} required />
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Hall Room Details" size="sm">
        {detailRoom && <RecordDetails items={[
          { label: 'Place Number', value: detailRoom.place_number },
          { label: 'Hall', value: hallLabel(detailRoom.hall_id) },
          { label: 'Hall ID', value: detailRoom.hall_id },
          { label: 'Room Number', value: detailRoom.room_number },
          { label: 'Monthly Rent', value: detailRoom.monthly_rent ? `£${detailRoom.monthly_rent}` : '—' },
        ]} />}
      </Modal>

      <DeleteConfirm isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName={deleteTarget ? `room ${deleteTarget.room_number || deleteTarget.place_number}` : 'this hall room'} />
    </div>
  );
};

export default HallRooms;

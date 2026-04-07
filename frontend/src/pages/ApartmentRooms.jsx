import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import DeleteConfirm from '../components/DeleteConfirm';
import LoadingSpinner from '../components/LoadingSpinner';
import RecordDetails from '../components/RecordDetails';
import { getApartmentRooms, createApartmentRoom, updateApartmentRoom, deleteApartmentRoom, getApartments } from '../services/api';

const cleanPayload = (obj) => {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== '' && value !== undefined) out[key] = value;
  }
  return out;
};

const ApartmentRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailRoom, setDetailRoom] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = { place_number: '', apartment_id: '', room_number: '', monthly_rent: '' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [roomRes, apartmentRes] = await Promise.all([getApartmentRooms(), getApartments()]);
      setRooms(roomRes.data || []);
      setApartments(apartmentRes.data || []);
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
  const apartmentLabel = (apartmentId) => {
    const apartment = apartments.find((item) => item.apartment_id === apartmentId);
    return apartment ? `${apartment.street}, ${apartment.city}` : `Apartment ${apartmentId}`;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = cleanPayload(form);
      if (editing) {
        delete payload.place_number;
        await updateApartmentRoom(editing.place_number, payload);
      } else {
        await createApartmentRoom(payload);
      }
      setShowForm(false);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save apartment room');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteApartmentRoom(deleteTarget.place_number);
      setShowDelete(false);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete apartment room');
    }
  };

  const columns = [
    { key: 'place_number', label: 'Place #' },
    { key: 'apartment_id', label: 'Apartment', render: (row) => apartmentLabel(row.apartment_id) },
    { key: 'room_number', label: 'Room #' },
    { key: 'monthly_rent', label: 'Monthly Rent', render: (row) => `£${row.monthly_rent ?? 0}` },
  ];

  if (loading) return <LoadingSpinner message="Loading apartment rooms..." />;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>Apartment Rooms</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage apartment room inventory and rent</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus style={{ width: 16, height: 16 }} /> Add Apartment Room
        </button>
      </div>

      <DataTable columns={columns} data={rooms} onView={openDetail} onEdit={openEdit} onDelete={openDelete} searchKeys={['place_number', 'room_number', 'apartment_id']} />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Apartment Room' : 'Add Apartment Room'} size="md">
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {!editing && <FormField label="Place Number" name="place_number" value={form.place_number} onChange={handleChange} />}
          <FormField label="Apartment" name="apartment_id" type="select" value={form.apartment_id} onChange={handleChange} required options={apartments.map((apartment) => ({ value: apartment.apartment_id, label: `${apartment.street}, ${apartment.city}` }))} />
          <FormField label="Room Number" name="room_number" value={form.room_number} onChange={handleChange} />
          <FormField label="Monthly Rent" name="monthly_rent" type="number" step="0.01" value={form.monthly_rent} onChange={handleChange} required />
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Apartment Room Details" size="sm">
        {detailRoom && <RecordDetails items={[
          { label: 'Place Number', value: detailRoom.place_number },
          { label: 'Apartment', value: apartmentLabel(detailRoom.apartment_id) },
          { label: 'Apartment ID', value: detailRoom.apartment_id },
          { label: 'Room Number', value: detailRoom.room_number },
          { label: 'Monthly Rent', value: detailRoom.monthly_rent ? `£${detailRoom.monthly_rent}` : '—' },
        ]} />}
      </Modal>

      <DeleteConfirm isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName={deleteTarget ? `room ${deleteTarget.room_number || deleteTarget.place_number}` : 'this apartment room'} />
    </div>
  );
};

export default ApartmentRooms;

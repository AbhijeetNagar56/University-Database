/**
 * Apartments Page — CRUD
 */
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import DeleteConfirm from '../components/DeleteConfirm';
import LoadingSpinner from '../components/LoadingSpinner';
import { getApartments, createApartment, updateApartment, deleteApartment, getApartmentRooms, createApartmentRoom, deleteApartmentRoom } from '../services/api';

const Apartments = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedApt, setSelectedApt] = useState(null);

  const emptyForm = { street: '', city: '', postcode: '', num_bedrooms: '' };
  const [form, setForm] = useState(emptyForm);
  const emptyRoom = { place_number: '', room_number: '', monthly_rent: '' };
  const [roomForm, setRoomForm] = useState(emptyRoom);

  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => { try { setLoading(true); const res = await getApartments(); setApartments(res.data); } catch {} finally { setLoading(false); } };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (row) => { setEditing(row); setForm({ ...emptyForm, ...row }); setShowForm(true); };
  const openDelete = (row) => { setDeleteTarget(row); setShowDelete(true); };

  const openRooms = async (apt) => {
    setSelectedApt(apt);
    try { const res = await getApartmentRooms(apt.apartment_id); setRooms(res.data); } catch { setRooms([]); }
    setShowRooms(true);
  };

  const handleSave = async (e) => { e.preventDefault(); setSaving(true); try { if (editing) await updateApartment(editing.apartment_id, form); else await createApartment(form); setShowForm(false); fetchAll(); } catch (err) { alert(err.response?.data?.error || 'Failed'); } finally { setSaving(false); } };
  const handleDelete = async () => { try { await deleteApartment(deleteTarget.apartment_id); setShowDelete(false); fetchAll(); } catch (err) { alert(err.response?.data?.error || 'Failed'); } };

  const handleAddRoom = async (e) => { e.preventDefault(); try { await createApartmentRoom(selectedApt.apartment_id, roomForm); setRoomForm(emptyRoom); const res = await getApartmentRooms(selectedApt.apartment_id); setRooms(res.data); } catch (err) { alert(err.response?.data?.error || 'Failed'); } };
  const handleDeleteRoom = async (pn) => { try { await deleteApartmentRoom(selectedApt.apartment_id, pn); const res = await getApartmentRooms(selectedApt.apartment_id); setRooms(res.data); } catch (err) { alert(err.response?.data?.error || 'Failed'); } };

  const columns = [
    { key: 'apartment_id', label: 'ID' }, { key: 'street', label: 'Street' },
    { key: 'city', label: 'City' }, { key: 'postcode', label: 'Postcode' },
    { key: 'num_bedrooms', label: 'Rooms' },
    { key: 'rooms_btn', label: '', render: (row) => (
      <button onClick={(e) => { e.stopPropagation(); openRooms(row); }} className="badge badge-violet" style={{ cursor: 'pointer', border: '1px solid rgba(139,92,246,0.3)' }}>View Rooms</button>
    )},
  ];

  if (loading) return <LoadingSpinner message="Loading apartments..." />;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>Apartments</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage student apartments</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus style={{ width: 16, height: 16 }} /> Add Apartment</button>
      </div>

      <DataTable columns={columns} data={apartments} onEdit={openEdit} onDelete={openDelete} searchKeys={['street', 'city']} />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Apartment' : 'Add Apartment'} size="md">
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Street" name="street" value={form.street} onChange={handleChange} required />
          <FormField label="City" name="city" value={form.city} onChange={handleChange} />
          <FormField label="Postcode" name="postcode" value={form.postcode} onChange={handleChange} />
          <FormField label="Number of Rooms" name="num_bedrooms" type="number" value={form.num_bedrooms} onChange={handleChange} />
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showRooms} onClose={() => setShowRooms(false)} title={`Rooms — Apt ${selectedApt?.apartment_id}`} size="lg">
        <form onSubmit={handleAddRoom} style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input placeholder="Place # *" value={roomForm.place_number} onChange={(e) => setRoomForm({ ...roomForm, place_number: e.target.value })} className="form-input" style={{ flex: 1, minWidth: '100px' }} required />
          <input placeholder="Room # *" value={roomForm.room_number} onChange={(e) => setRoomForm({ ...roomForm, room_number: e.target.value })} className="form-input" style={{ flex: 1, minWidth: '100px' }} required />
          <input type="number" placeholder="Rent (£) *" value={roomForm.monthly_rent} onChange={(e) => setRoomForm({ ...roomForm, monthly_rent: e.target.value })} className="form-input" style={{ flex: 1, minWidth: '100px' }} />
          <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>+ Add Room</button>
        </form>
        <DataTable columns={[
          { key: 'place_number', label: 'Place #' }, { key: 'room_number', label: 'Room #' },
          { key: 'monthly_rent', label: 'Rent', render: (row) => <span style={{ color: '#34d399', fontWeight: 600 }}>£{row.monthly_rent || 0}</span> },
        ]} data={rooms} onDelete={(r) => handleDeleteRoom(r.place_number)} />
      </Modal>

      <DeleteConfirm isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName={`Apartment ${deleteTarget?.apartment_id}`} />
    </div>
  );
};

export default Apartments;

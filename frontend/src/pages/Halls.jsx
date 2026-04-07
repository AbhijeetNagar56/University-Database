/**
 * Halls Page — CRUD with rooms
 */
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import DeleteConfirm from '../components/DeleteConfirm';
import LoadingSpinner from '../components/LoadingSpinner';
import { getHalls, createHall, updateHall, deleteHall, getHallRooms, createHallRoom, deleteHallRoom, getStaff } from '../services/api';

const Halls = () => {
  const [halls, setHalls] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);

  const emptyForm = { hall_name: '', street: '', city: '', postcode: '', telephone: '', manager_staff_id: '' };
  const [form, setForm] = useState(emptyForm);
  const emptyRoom = { place_number: '', room_number: '', monthly_rent: '' };
  const [roomForm, setRoomForm] = useState(emptyRoom);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [hRes, sRes] = await Promise.all([getHalls(), getStaff()]);
      setHalls(hRes.data); setStaffList(sRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (row) => { setEditing(row); setForm({ ...emptyForm, ...row }); setShowForm(true); };
  const openDelete = (row) => { setDeleteTarget(row); setShowDelete(true); };

  const openRooms = async (hall) => {
    setSelectedHall(hall);
    try { const res = await getHallRooms(hall.hall_id); setRooms(res.data); }
    catch { setRooms([]); }
    setShowRooms(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await updateHall(editing.hall_id, form);
      else await createHall(form);
      setShowForm(false); fetchAll();
    } catch (err) { alert(err.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await deleteHall(deleteTarget.hall_id); setShowDelete(false); fetchAll(); }
    catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try { await createHallRoom(selectedHall.hall_id, roomForm); setRoomForm(emptyRoom); const res = await getHallRooms(selectedHall.hall_id); setRooms(res.data); }
    catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  const handleDeleteRoom = async (placeNum) => {
    try { await deleteHallRoom(selectedHall.hall_id, placeNum); const res = await getHallRooms(selectedHall.hall_id); setRooms(res.data); }
    catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  const columns = [
    { key: 'hall_id', label: 'ID' },
    { key: 'hall_name', label: 'Hall Name' },
    { key: 'street', label: 'Street' },
    { key: 'city', label: 'City' },
    { key: 'telephone', label: 'Telephone' },
    {
      key: 'rooms', label: 'Rooms', render: (row) => (
        <button onClick={(e) => { e.stopPropagation(); openRooms(row); }} className="badge badge-indigo" style={{ cursor: 'pointer', border: '1px solid rgba(99,102,241,0.3)' }}>
          View Rooms
        </button>
      ),
    },
  ];

  if (loading) return <LoadingSpinner message="Loading halls..." />;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>Halls</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage halls of residence</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus style={{ width: 16, height: 16 }} /> Add Hall</button>
      </div>

      <DataTable columns={columns} data={halls} onEdit={openEdit} onDelete={openDelete} searchKeys={['hall_name', 'city']} />

      {/* Add/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Hall' : 'Add Hall'} size="md">
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Hall Name" name="hall_name" value={form.hall_name} onChange={handleChange} required />
          <FormField label="Manager" name="manager_staff_id" type="select" value={form.manager_staff_id} onChange={handleChange} options={
            staffList.map((s) => ({ value: s.staff_id, label: `${s.first_name} ${s.last_name}` }))
          } />
          <FormField label="Street" name="street" value={form.street} onChange={handleChange} />
          <FormField label="City" name="city" value={form.city} onChange={handleChange} />
          <FormField label="Postcode" name="postcode" value={form.postcode} onChange={handleChange} />
          <FormField label="Telephone" name="telephone" value={form.telephone} onChange={handleChange} />
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* Rooms Modal */}
      <Modal isOpen={showRooms} onClose={() => setShowRooms(false)} title={`Rooms — ${selectedHall?.hall_name}`} size="lg">
        <form onSubmit={handleAddRoom} style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input placeholder="Place #" value={roomForm.place_number} onChange={(e) => setRoomForm({ ...roomForm, place_number: e.target.value })} className="form-input" style={{ flex: 1, minWidth: '100px' }} required />
          <input placeholder="Room #" value={roomForm.room_number} onChange={(e) => setRoomForm({ ...roomForm, room_number: e.target.value })} className="form-input" style={{ flex: 1, minWidth: '100px' }} required />
          <input type="number" placeholder="Rent (£)" value={roomForm.monthly_rent} onChange={(e) => setRoomForm({ ...roomForm, monthly_rent: e.target.value })} className="form-input" style={{ flex: 1, minWidth: '100px' }} />
          <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>+ Add Room</button>
        </form>
        <DataTable columns={[
          { key: 'place_number', label: 'Place #' }, { key: 'room_number', label: 'Room #' },
          { key: 'monthly_rent', label: 'Rent', render: (row) => <span style={{ color: '#34d399', fontWeight: 600 }}>£{row.monthly_rent || 0}</span> },
        ]} data={rooms} onDelete={(r) => handleDeleteRoom(r.place_number)} />
      </Modal>

      <DeleteConfirm isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName={deleteTarget?.hall_name} />
    </div>
  );
};

export default Halls;

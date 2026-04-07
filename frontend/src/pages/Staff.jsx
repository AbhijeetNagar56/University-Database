/**
 * Staff Page
 */
import { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import DeleteConfirm from '../components/DeleteConfirm';
import LoadingSpinner from '../components/LoadingSpinner';
import { getStaff, createStaff, updateStaff, deleteStaff } from '../services/api';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [ageFilter, setAgeFilter] = useState(false);

  const emptyForm = { first_name:'', last_name:'', email:'', street:'', city:'', postcode:'', date_of_birth:'', gender:'', position:'', location:'' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => { try { setLoading(true); const r = await getStaff(); setStaff(r.data); } catch {} finally { setLoading(false); } };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const getAge = (dob) => { if (!dob) return null; const d = new Date(dob); const n = new Date(); let a = n.getFullYear()-d.getFullYear(); if(n.getMonth()<d.getMonth()||(n.getMonth()===d.getMonth()&&n.getDate()<d.getDate())) a--; return a; };

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (row) => { setEditing(row); setForm({...emptyForm,...row,date_of_birth:row.date_of_birth?.split('T')[0]||''}); setShowForm(true); };
  const openDelete = (row) => { setDeleteTarget(row); setShowDelete(true); };

  const handleSave = async (e) => { e.preventDefault(); setSaving(true); try { if(editing) await updateStaff(editing.staff_id,form); else await createStaff(form); setShowForm(false); fetchAll(); } catch(err){ alert(err.response?.data?.error||'Failed'); } finally{ setSaving(false); } };
  const handleDelete = async () => { try { await deleteStaff(deleteTarget.staff_id); setShowDelete(false); fetchAll(); } catch(err){ alert(err.response?.data?.error||'Failed'); } };

  const filtered = ageFilter ? staff.filter(s=>{const a=getAge(s.date_of_birth);return a!==null&&a>60;}) : staff;

  const columns = [
    { key:'staff_id', label:'ID' },
    { key:'first_name', label:'First Name' },
    { key:'last_name', label:'Last Name' },
    { key:'email', label:'Email' },
    { key:'position', label:'Position', render: r => {
      const p = r.position?.toLowerCase() || '';
      const cls = p.includes('manager') ? 'badge-violet' : p.includes('inspector') ? 'badge-sky' : 'badge-slate';
      return <span className={`badge ${cls}`}>{r.position||'—'}</span>;
    }},
    { key:'location', label:'Location' },
    { key:'age', label:'Age', render: r => {
      const a = getAge(r.date_of_birth);
      return a !== null ? <span style={a>60?{color:'#fbbf24',fontWeight:700}:{}}>{a}</span> : '—';
    }},
  ];

  if (loading) return <LoadingSpinner message="Loading staff..." />;

  return (
    <div>
      <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'16px', marginBottom:'24px' }}>
        <div><h1 style={{ fontSize:'1.75rem', fontWeight:800, color:'white', marginBottom:'4px' }}>Staff</h1><p style={{ color:'#64748b', fontSize:'0.875rem' }}>Manage residence staff</p></div>
        <button onClick={openAdd} className="btn-primary"><Plus style={{width:16,height:16}}/> Add Staff</button>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
        <button onClick={()=>setAgeFilter(!ageFilter)} className={`filter-btn ${ageFilter?'filter-btn-active':''}`} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <Filter style={{width:14,height:14}}/> Age &gt; 60
        </button>
        {ageFilter && <span style={{fontSize:'0.75rem',color:'#475569'}}>Showing {filtered.length} of {staff.length}</span>}
      </div>

      <DataTable columns={columns} data={filtered} onEdit={openEdit} onDelete={openDelete} searchKeys={['first_name','last_name','position','location']} />

      <Modal isOpen={showForm} onClose={()=>setShowForm(false)} title={editing?'Edit Staff':'Add Staff'} size="md">
        <form onSubmit={handleSave} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
          <FormField label="First Name" name="first_name" value={form.first_name} onChange={handleChange} required/>
          <FormField label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} required/>
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange}/>
          <FormField label="Date of Birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange}/>
          <FormField label="Gender" name="gender" type="select" value={form.gender} onChange={handleChange} options={[{value:'Male',label:'Male'},{value:'Female',label:'Female'}]}/>
          <FormField label="Position" name="position" value={form.position} onChange={handleChange}/>
          <FormField label="Location" name="location" value={form.location} onChange={handleChange}/>
          <FormField label="Street" name="street" value={form.street} onChange={handleChange}/>
          <FormField label="City" name="city" value={form.city} onChange={handleChange}/>
          <FormField label="Postcode" name="postcode" value={form.postcode} onChange={handleChange}/>
          <div style={{gridColumn:'span 2',display:'flex',justifyContent:'flex-end',gap:'12px',paddingTop:'16px',borderTop:'1px solid rgba(99,102,241,0.08)'}}>
            <button type="button" onClick={()=>setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'Saving...':editing?'Update':'Create'}</button>
          </div>
        </form>
      </Modal>
      <DeleteConfirm isOpen={showDelete} onClose={()=>setShowDelete(false)} onConfirm={handleDelete} itemName={`${deleteTarget?.first_name} ${deleteTarget?.last_name}`}/>
    </div>
  );
};
export default Staff;

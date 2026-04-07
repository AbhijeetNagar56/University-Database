/**
 * Inspections Page
 */
import { useState, useEffect } from 'react';
import { Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import DeleteConfirm from '../components/DeleteConfirm';
import LoadingSpinner from '../components/LoadingSpinner';
import RecordDetails from '../components/RecordDetails';
import { getInspections, createInspection, updateInspection, deleteInspection, getApartments, getStaff } from '../services/api';

const Inspections = () => {
  const [inspections, setInspections] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailInspection, setDetailInspection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');

  const emptyForm = { apartment_id:'', staff_id:'', inspection_date:'', satisfactory:'', comments:'' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => { try { setLoading(true); const [i,a,s] = await Promise.all([getInspections(), getApartments(), getStaff()]); setInspections(i.data); setApartments(a.data); setStaff(s.data); } catch {} finally { setLoading(false); } };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (row) => { setEditing(row); setForm({ ...emptyForm, ...row, inspection_date: row.inspection_date?.split('T')[0] || '', satisfactory: row.satisfactory === 1 || row.satisfactory === '1' || row.satisfactory === true || row.satisfactory === 'Yes' ? '1' : '0' }); setShowForm(true); };
  const openDelete = (row) => { setDeleteTarget(row); setShowDelete(true); };
  const openDetail = (row) => { setDetailInspection(row); setShowDetail(true); };
  const handleSave = async (e) => { e.preventDefault(); setSaving(true); try { if (editing) await updateInspection(editing.inspection_id, form); else await createInspection(form); setShowForm(false); fetchAll(); } catch (err) { alert(err.response?.data?.error||'Failed'); } finally { setSaving(false); } };
  const handleDelete = async () => { try { await deleteInspection(deleteTarget.inspection_id); setShowDelete(false); fetchAll(); } catch (err) { alert(err.response?.data?.error||'Failed'); } };
  const getStaffName = (id) => { const s = staff.find(s => s.staff_id === id); return s ? `${s.first_name} ${s.last_name}` : '—'; };
  const getApartmentLabel = (id) => { const a = apartments.find(a => a.apartment_id === id); return a ? `${a.street}, ${a.city}` : `Apartment ${id}`; };
  const isSat = (v) => v === 'Yes' || v === 1 || v === '1' || v === true;

  const filtered = inspections.filter(i => { if (filter === 'pass') return isSat(i.satisfactory); if (filter === 'fail') return !isSat(i.satisfactory); return true; });

  const columns = [
    { key: 'inspection_id', label: 'ID' },
    { key: 'apartment_id', label: 'Apartment' },
    { key: 'staff_id', label: 'Inspector', render: r => <span style={{color:'#a5b4fc'}}>{getStaffName(r.staff_id)}</span> },
    { key: 'inspection_date', label: 'Date', render: r => r.inspection_date ? new Date(r.inspection_date).toLocaleDateString() : '—' },
    { key: 'satisfactory', label: 'Result', render: r => isSat(r.satisfactory)
      ? <span className="badge badge-emerald"><CheckCircle2 style={{width:14,height:14}}/> Satisfactory</span>
      : <span className="badge badge-rose"><AlertTriangle style={{width:14,height:14}}/> Unsatisfactory</span>
    },
    { key: 'comments', label: 'Comments' },
  ];

  if (loading) return <LoadingSpinner message="Loading inspections..." />;

  return (
    <div>
      <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'16px', marginBottom:'24px' }}>
        <div><h1 style={{ fontSize:'1.75rem', fontWeight:800, color:'white', marginBottom:'4px' }}>Inspections</h1><p style={{ color:'#64748b', fontSize:'0.875rem' }}>Apartment inspection records</p></div>
        <button onClick={openAdd} className="btn-primary"><Plus style={{width:16,height:16}}/> Add Inspection</button>
      </div>
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
        {[{v:'',l:'All'},{v:'pass',l:'Satisfactory'},{v:'fail',l:'Unsatisfactory'}].map(({v,l})=>(<button key={v} onClick={()=>setFilter(v)} className={`filter-btn ${filter===v?'filter-btn-active':''}`}>{l}</button>))}
      </div>
      <DataTable columns={columns} data={filtered} onView={openDetail} onEdit={openEdit} onDelete={openDelete} searchKeys={['apartment_id','comments']} />

      <Modal isOpen={showForm} onClose={()=>setShowForm(false)} title={editing ? 'Edit Inspection' : 'Add Inspection'} size="md">
        <form onSubmit={handleSave} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
          <FormField label="Apartment" name="apartment_id" type="select" value={form.apartment_id} onChange={handleChange} required options={apartments.map(a=>({value:a.apartment_id,label:`Apt ${a.apartment_id} — ${a.street}`}))}/>
          <FormField label="Inspector" name="staff_id" type="select" value={form.staff_id} onChange={handleChange} required options={staff.map(s=>({value:s.staff_id,label:`${s.first_name} ${s.last_name}`}))}/>
          <FormField label="Date" name="inspection_date" type="date" value={form.inspection_date} onChange={handleChange} required/>
          <FormField label="Satisfactory" name="satisfactory" type="select" value={form.satisfactory} onChange={handleChange} required options={[{value:'1',label:'Yes'},{value:'0',label:'No'}]}/>
          <div style={{gridColumn:'span 2'}}><FormField label="Comments" name="comments" type="textarea" value={form.comments} onChange={handleChange}/></div>
          <div style={{gridColumn:'span 2',display:'flex',justifyContent:'flex-end',gap:'12px',paddingTop:'16px',borderTop:'1px solid rgba(99,102,241,0.08)'}}>
            <button type="button" onClick={()=>setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'Saving...':'Create'}</button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Inspection Details" size="md">
        {detailInspection && <RecordDetails items={[
          { label: 'Inspection ID', value: detailInspection.inspection_id },
          { label: 'Apartment', value: getApartmentLabel(detailInspection.apartment_id) },
          { label: 'Apartment ID', value: detailInspection.apartment_id },
          { label: 'Inspector', value: getStaffName(detailInspection.staff_id) },
          { label: 'Staff ID', value: detailInspection.staff_id },
          { label: 'Inspection Date', value: detailInspection.inspection_date ? new Date(detailInspection.inspection_date).toLocaleDateString() : '—' },
          { label: 'Result', value: isSat(detailInspection.satisfactory) ? 'Satisfactory' : 'Unsatisfactory' },
          { label: 'Comments', value: detailInspection.comments },
        ]} />}
      </Modal>
      <DeleteConfirm isOpen={showDelete} onClose={()=>setShowDelete(false)} onConfirm={handleDelete} itemName={`Inspection ${deleteTarget?.inspection_id}`}/>
    </div>
  );
};
export default Inspections;

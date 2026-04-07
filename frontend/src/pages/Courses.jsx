/**
 * Courses Page — CRUD
 */
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import DeleteConfirm from '../components/DeleteConfirm';
import LoadingSpinner from '../components/LoadingSpinner';
import RecordDetails from '../components/RecordDetails';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailCourse, setDetailCourse] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = { course_title:'', course_year:'', instructor_name:'', instructor_phone:'', instructor_email:'', instructor_room:'', department_name:'' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => { try { setLoading(true); const r = await getCourses(); setCourses(r.data); } catch {} finally { setLoading(false); } };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (row) => { setEditing(row); setForm({...emptyForm,...row}); setShowForm(true); };
  const openDelete = (row) => { setDeleteTarget(row); setShowDelete(true); };
  const openDetail = (row) => { setDetailCourse(row); setShowDetail(true); };

  const handleSave = async (e) => { e.preventDefault(); setSaving(true); try { if(editing) await updateCourse(editing.course_id,form); else await createCourse(form); setShowForm(false); fetchAll(); } catch(err){ alert(err.response?.data?.error||'Failed'); } finally{ setSaving(false); } };
  const handleDelete = async () => { try { await deleteCourse(deleteTarget.course_id); setShowDelete(false); fetchAll(); } catch(err){ alert(err.response?.data?.error||'Failed'); } };

  const columns = [
    { key:'course_id', label:'ID' },
    { key:'course_title', label:'Course Title' },
    { key:'course_year', label:'Year' },
    { key:'instructor_name', label:'Instructor' },
    { key:'department_name', label:'Department' },
    { key:'instructor_email', label:'Email' },
  ];

  if (loading) return <LoadingSpinner message="Loading courses..." />;

  return (
    <div>
      <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'16px', marginBottom:'24px' }}>
        <div><h1 style={{ fontSize:'1.75rem', fontWeight:800, color:'white', marginBottom:'4px' }}>Courses</h1><p style={{ color:'#64748b', fontSize:'0.875rem' }}>Manage academic courses</p></div>
        <button onClick={openAdd} className="btn-primary"><Plus style={{width:16,height:16}}/> Add Course</button>
      </div>
      <DataTable columns={columns} data={courses} onView={openDetail} onEdit={openEdit} onDelete={openDelete} searchKeys={['course_title','instructor_name','department_name']} />

      <Modal isOpen={showForm} onClose={()=>setShowForm(false)} title={editing?'Edit Course':'Add Course'} size="md">
        <form onSubmit={handleSave} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
          <FormField label="Course Title" name="course_title" value={form.course_title} onChange={handleChange} required/>
          <FormField label="Course Year" name="course_year" value={form.course_year} onChange={handleChange}/>
          <FormField label="Instructor" name="instructor_name" value={form.instructor_name} onChange={handleChange}/>
          <FormField label="Phone" name="instructor_phone" value={form.instructor_phone} onChange={handleChange}/>
          <FormField label="Email" name="instructor_email" type="email" value={form.instructor_email} onChange={handleChange}/>
          <FormField label="Room" name="instructor_room" value={form.instructor_room} onChange={handleChange}/>
          <div style={{gridColumn:'span 2'}}><FormField label="Department" name="department_name" value={form.department_name} onChange={handleChange}/></div>
          <div style={{gridColumn:'span 2',display:'flex',justifyContent:'flex-end',gap:'12px',paddingTop:'16px',borderTop:'1px solid rgba(99,102,241,0.08)'}}>
            <button type="button" onClick={()=>setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'Saving...':editing?'Update':'Create'}</button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Course Details" size="md">
        {detailCourse && <RecordDetails items={[
          { label: 'Course ID', value: detailCourse.course_id },
          { label: 'Course Title', value: detailCourse.course_title },
          { label: 'Course Year', value: detailCourse.course_year },
          { label: 'Instructor', value: detailCourse.instructor_name },
          { label: 'Instructor Phone', value: detailCourse.instructor_phone },
          { label: 'Instructor Email', value: detailCourse.instructor_email },
          { label: 'Instructor Room', value: detailCourse.instructor_room },
          { label: 'Department', value: detailCourse.department_name },
        ]} />}
      </Modal>
      <DeleteConfirm isOpen={showDelete} onClose={()=>setShowDelete(false)} onConfirm={handleDelete} itemName={deleteTarget?.course_title}/>
    </div>
  );
};
export default Courses;

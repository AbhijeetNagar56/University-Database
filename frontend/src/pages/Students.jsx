/**
 * Students Page — full CRUD with filter, detail view, next-of-kin
 * Form fields match the Students database table exactly.
 */
import { useState, useEffect } from 'react';
import { Plus, X, UserCircle } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import DeleteConfirm from '../components/DeleteConfirm';
import LoadingSpinner from '../components/LoadingSpinner';
import { getStudents, createStudent, updateStudent, deleteStudent, getNextOfKin, getLeases, getAdvisers, getCourses } from '../services/api';

/** Remove empty‑string keys so MySQL doesn't get '' for nullable / FK cols */
const cleanPayload = (obj) => {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== '' && v !== undefined) out[k] = v;
  }
  return out;
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [advisers, setAdvisers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailStudent, setDetailStudent] = useState(null);
  const [studentKin, setStudentKin] = useState([]);
  const [studentLeases, setStudentLeases] = useState([]);
  const [saving, setSaving] = useState(false);

  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // ---- form fields must match DB columns exactly ----
  const emptyForm = {
    banner_number: '', first_name: '', last_name: '', email: '',
    mobile_phone: '', date_of_birth: '', gender: '', nationality: '',
    student_category: '', special_needs: '', status: '',
    additional_comments: '', major: '', minor: '',
    adviser_id: '', course_id: '',
    street: '', city: '', postcode: '',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [sRes, aRes, cRes] = await Promise.all([getStudents(), getAdvisers(), getCourses()]);
      setStudents(sRes.data || []);
      setAdvisers(aRes.data || []);
      setCourses(cRes.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      ...emptyForm, ...row,
      date_of_birth: row.date_of_birth ? row.date_of_birth.split('T')[0] : '',
      adviser_id: row.adviser_id ?? '',
      course_id: row.course_id ?? '',
    });
    setShowForm(true);
  };
  const openDelete = (row) => { setDeleteTarget(row); setShowDelete(true); };

  const openDetail = async (row) => {
    setDetailStudent(row);
    setShowDetail(true);
    try {
      const [kinRes, leaseRes] = await Promise.all([getNextOfKin(), getLeases()]);
      setStudentKin((kinRes.data || []).filter((k) => k.banner_number === row.banner_number));
      setStudentLeases((leaseRes.data || []).filter((l) => l.banner_number === row.banner_number));
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = cleanPayload(form);
      if (editing) {
        delete payload.banner_number; // PK shouldn't be updated
        await updateStudent(editing.banner_number, payload);
      } else {
        await createStudent(payload);
      }
      setShowForm(false);
      fetchAll();
    } catch (err) { alert(err.response?.data?.error || 'Failed to save student'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await deleteStudent(deleteTarget.banner_number); setShowDelete(false); fetchAll(); }
    catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  const filtered = students.filter((s) => {
    if (statusFilter && s.status !== statusFilter) return false;
    if (categoryFilter && s.student_category !== categoryFilter) return false;
    return true;
  });

  const statuses = [...new Set(students.map((s) => s.status).filter(Boolean))];
  const categories = [...new Set(students.map((s) => s.student_category).filter(Boolean))];

  const getStatusBadge = (status) => {
    const map = { 'Active': 'badge-emerald', 'Placed': 'badge-emerald', 'Waiting': 'badge-amber', 'Suspended': 'badge-rose', 'On Leave': 'badge-amber', 'Graduated': 'badge-sky' };
    return map[status] || 'badge-slate';
  };

  const getAdviserName = (id) => { const a = advisers.find(a => a.adviser_id === id); return a ? a.full_name : '—'; };

  const columns = [
    { key: 'banner_number', label: 'Banner #' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'status', label: 'Status',
      render: (row) => <span className={`badge ${getStatusBadge(row.status)}`}>{row.status || '—'}</span>,
    },
    { key: 'student_category', label: 'Category' },
  ];

  if (loading) return <LoadingSpinner message="Loading students..." />;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>Students</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage student records</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus style={{ width: 16, height: 16 }} /> Add Student
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-input" style={{ width: 'auto', minWidth: '160px' }}>
          <option value="">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="form-input" style={{ width: 'auto', minWidth: '160px' }}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <DataTable columns={columns} data={filtered} onView={openDetail} onEdit={openEdit} onDelete={openDelete} searchKeys={['banner_number', 'first_name', 'last_name', 'email']} />

      {/* Add/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Student' : 'Add Student'} size="lg">
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {!editing && <FormField label="Banner Number" name="banner_number" value={form.banner_number} onChange={handleChange} required />}
          <FormField label="First Name" name="first_name" value={form.first_name} onChange={handleChange} required />
          <FormField label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} required />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <FormField label="Phone" name="mobile_phone" value={form.mobile_phone} onChange={handleChange} />
          <FormField label="Date of Birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} />
          <FormField label="Gender" name="gender" type="select" value={form.gender} onChange={handleChange} options={[
            { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' },
          ]} />
          <FormField label="Nationality" name="nationality" value={form.nationality} onChange={handleChange} />
          <FormField label="Category" name="student_category" type="select" value={form.student_category} onChange={handleChange} options={[
            { value: 'Undergraduate', label: 'Undergraduate' }, { value: 'Postgraduate', label: 'Postgraduate' }, { value: 'Exchange', label: 'Exchange' },
          ]} />
          <FormField label="Status" name="status" type="select" value={form.status} onChange={handleChange} options={[
            { value: 'Active', label: 'Active' }, { value: 'Placed', label: 'Placed' }, { value: 'Waiting', label: 'Waiting' }, { value: 'On Leave', label: 'On Leave' }, { value: 'Graduated', label: 'Graduated' }, { value: 'Suspended', label: 'Suspended' },
          ]} />
          <FormField label="Major" name="major" value={form.major} onChange={handleChange} />
          <FormField label="Minor" name="minor" value={form.minor} onChange={handleChange} />
          <FormField label="Adviser" name="adviser_id" type="select" value={form.adviser_id} onChange={handleChange} options={
            advisers.map(a => ({ value: a.adviser_id, label: a.full_name }))
          } />
          <FormField label="Course" name="course_id" type="select" value={form.course_id} onChange={handleChange} options={
            courses.map(c => ({ value: c.course_id, label: c.course_title }))
          } />
          <FormField label="Street" name="street" value={form.street} onChange={handleChange} />
          <FormField label="City" name="city" value={form.city} onChange={handleChange} />
          <FormField label="Postcode" name="postcode" value={form.postcode} onChange={handleChange} />
          <div style={{ gridColumn: 'span 2' }}>
            <FormField label="Special Needs" name="special_needs" type="textarea" value={form.special_needs} onChange={handleChange} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <FormField label="Additional Comments" name="additional_comments" type="textarea" value={form.additional_comments} onChange={handleChange} />
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Student Details" size="lg">
        {detailStudent && (
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '20px',
              borderRadius: '14px', marginBottom: '24px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))',
              border: '1px solid rgba(99,102,241,0.1)',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', fontWeight: 700, color: 'white',
              }}>
                {detailStudent.first_name?.charAt(0)}{detailStudent.last_name?.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                  {detailStudent.first_name} {detailStudent.last_name}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  {detailStudent.banner_number} • {detailStudent.student_category}
                </p>
              </div>
              <span className={`badge ${getStatusBadge(detailStudent.status)}`} style={{ marginLeft: 'auto' }}>
                {detailStudent.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {[
                ['Email', detailStudent.email],
                ['Phone', detailStudent.mobile_phone],
                ['Nationality', detailStudent.nationality],
                ['Gender', detailStudent.gender],
                ['DOB', detailStudent.date_of_birth ? new Date(detailStudent.date_of_birth).toLocaleDateString() : '—'],
                ['Adviser', getAdviserName(detailStudent.adviser_id)],
                ['Major', detailStudent.major],
                ['Minor', detailStudent.minor],
              ].map(([label, val]) => (
                <div key={label} className="detail-item">
                  <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</p>
                  <p style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>{val || '—'}</p>
                </div>
              ))}
            </div>

            {studentKin.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '12px' }}>Next of Kin</h4>
                {studentKin.map((k, i) => (
                  <div key={i} className="detail-item" style={{ marginBottom: '8px' }}>
                    <p style={{ color: '#e2e8f0', fontWeight: 600 }}>{k.name} ({k.relationship})</p>
                    <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{k.phone} • {k.street}, {k.city}</p>
                  </div>
                ))}
              </div>
            )}

            {studentLeases.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '12px' }}>Lease History</h4>
                {studentLeases.map((l, i) => (
                  <div key={i} className="detail-item" style={{ marginBottom: '8px' }}>
                    <p style={{ color: '#e2e8f0', fontWeight: 600 }}>Lease #{l.lease_id} — Place #{l.place_number}</p>
                    <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Duration: {l.lease_duration_semesters} semesters • Room {l.room_number}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      <DeleteConfirm isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} itemName={`${deleteTarget?.first_name} ${deleteTarget?.last_name}`} />
    </div>
  );
};

export default Students;

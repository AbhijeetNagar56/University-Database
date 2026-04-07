/**
 * DataTable — generic sortable and searchable table component
 */
import { useState, useMemo } from 'react';
import { Search, Pencil, Trash2, Eye, ChevronUp, ChevronDown } from 'lucide-react';

const DataTable = ({
  columns = [], data = [], onEdit, onDelete, onView,
  searchKeys = [], emptyMessage = 'No records found',
}) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q))
    );
  }, [data, search, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const hasActions = onEdit || onDelete || onView;

  return (
    <div>
      {/* Search Bar */}
      {searchKeys.length > 0 && (
        <div style={{ marginBottom: '16px', position: 'relative', maxWidth: '320px' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#475569' }} />
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      {/* Table */}
      <div style={{
        overflowX: 'auto', borderRadius: '14px',
        border: '1px solid rgba(99,102,241,0.1)',
        background: 'linear-gradient(145deg, rgba(14,14,36,0.6), rgba(10,10,26,0.8))',
      }}>
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} onClick={() => toggleSort(col.key)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {col.label}
                    {sortKey === col.key && (
                      sortDir === 'asc'
                        ? <ChevronUp style={{ width: 12, height: 12 }} />
                        : <ChevronDown style={{ width: 12, height: 12 }} />
                    )}
                  </div>
                </th>
              ))}
              {hasActions && (
                <th style={{ textAlign: 'right' }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  style={{ textAlign: 'center', padding: '48px 16px', color: '#475569' }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sorted.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                  {hasActions && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
                        {onView && (
                          <button onClick={() => onView(row)} className="action-btn action-btn-view" title="View">
                            <Eye style={{ width: 16, height: 16 }} />
                          </button>
                        )}
                        {onEdit && (
                          <button onClick={() => onEdit(row)} className="action-btn action-btn-edit" title="Edit">
                            <Pencil style={{ width: 16, height: 16 }} />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(row)} className="action-btn action-btn-delete" title="Delete">
                            <Trash2 style={{ width: 16, height: 16 }} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Count */}
      <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#475569' }}>
        Showing {sorted.length} of {data.length} records
      </div>
    </div>
  );
};

export default DataTable;

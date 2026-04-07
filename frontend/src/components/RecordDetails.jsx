const RecordDetails = ({ items = [] }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      {items.map(({ label, value }) => (
        <div key={label} className="detail-item">
          <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            {label}
          </p>
          <p style={{ color: '#e2e8f0', fontSize: '0.875rem', wordBreak: 'break-word' }}>
            {value || '—'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RecordDetails;

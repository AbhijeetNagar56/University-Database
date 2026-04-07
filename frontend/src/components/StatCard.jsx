/**
 * StatCard — dashboard summary card with icon, label, value
 */
const StatCard = ({ icon: Icon, label, value, color = 'indigo' }) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          padding: '10px', borderRadius: '12px',
          background: color === 'indigo' ? 'rgba(99,102,241,0.1)' :
                     color === 'emerald' ? 'rgba(16,185,129,0.1)' :
                     color === 'amber' ? 'rgba(245,158,11,0.1)' :
                     color === 'rose' ? 'rgba(239,68,68,0.1)' :
                     color === 'violet' ? 'rgba(139,92,246,0.1)' :
                     color === 'sky' ? 'rgba(14,165,233,0.1)' : 'rgba(99,102,241,0.1)',
        }}>
          {Icon && <Icon style={{
            width: 22, height: 22,
            color: color === 'indigo' ? '#818cf8' :
                   color === 'emerald' ? '#34d399' :
                   color === 'amber' ? '#fbbf24' :
                   color === 'rose' ? '#f87171' :
                   color === 'violet' ? '#a78bfa' :
                   color === 'sky' ? '#38bdf8' : '#818cf8',
          }} />}
        </div>
      </div>
      <p style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '4px', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{label}</p>
    </div>
  );
};

export default StatCard;

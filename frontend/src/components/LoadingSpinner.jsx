/**
 * LoadingSpinner — animated loading indicator
 */
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '80px 0',
    }} className="animate-fade-in">
      <Loader2 style={{ width: 40, height: 40, color: '#818cf8', marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>{message}</p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoadingSpinner;

/**
 * DeleteConfirm — confirmation dialog for destructive actions
 */
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const DeleteConfirm = ({ isOpen, onClose, onConfirm, itemName = 'this item' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 0' }}>
        <div style={{
          padding: '16px', borderRadius: '50%',
          background: 'rgba(239,68,68,0.1)', marginBottom: '16px',
          border: '1px solid rgba(239,68,68,0.15)',
        }}>
          <AlertTriangle style={{ width: 32, height: 32, color: '#f87171' }} />
        </div>
        <p style={{ color: 'white', fontWeight: 600, marginBottom: '8px', fontSize: '1rem' }}>
          Are you sure you want to delete {itemName}?
        </p>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '24px' }}>
          This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <button onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger" style={{ flex: 1 }}>
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirm;

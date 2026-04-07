/**
 * Modal — reusable overlay dialog
 * Now uses React Portal to render to document.body.
 * This fixes the issue where CSS transforms on ancestors (like the fade-in animation) trap the fixed positioning.
 */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const maxWidths = { sm: '480px', md: '640px', lg: '900px', xl: '1100px' };

  return createPortal(
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      {/* Backdrop click */}
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

      {/* Modal Content */}
      <div className="modal-content" style={{ maxWidth: maxWidths[size] || maxWidths.md }}>
        {/* Header */}
        <div className="modal-header">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', color: '#64748b',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;

/**
 * FormField — reusable styled form input / select / textarea
 */
const FormField = ({
  label, name, type = 'text', value, onChange,
  required = false, placeholder = '', options = [],
  rows = 3, disabled = false, step,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label htmlFor={name} style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>
        {label}
        <span style={{ color: '#f87171', marginLeft: '4px' }}>*</span>
      </label>

      {type === 'select' ? (
        <select
          id={name} name={name} value={value} onChange={onChange}
          required={required} disabled={disabled}
          className="form-input"
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={name} name={name} value={value} onChange={onChange}
          required={required} disabled={disabled}
          placeholder={placeholder} rows={rows}
          className="form-input"
          style={{ resize: 'none' }}
        />
      ) : (
        <input
          id={name} name={name} type={type} value={value} onChange={onChange}
          required={required} disabled={disabled} placeholder={placeholder}
          step={step}
          className="form-input"
        />
      )}
    </div>
  );
};

export default FormField;

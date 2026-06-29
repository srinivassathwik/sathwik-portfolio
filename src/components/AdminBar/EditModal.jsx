/* ============================================================
   EditModal — generic add/edit form
   ============================================================
   Props:
     title    : modal heading
     fields   : array of field configs:
                { key, label, type: 'text'|'textarea'|'number'
                        |'checkbox'|'list'|'color',
                  hint?: string }
                'list' fields edit a comma-separated string
                that is stored/sent as an array.
     initialValues : object of current values (for edit) or {} (for add)
     onSave   : async (values) => { error? }
     onDelete : optional async () => { error? } — shows a delete button
     onClose  : () => void
   ============================================================ */
import { useState } from 'react';
import './EditModal.css';

export default function EditModal({ title, fields, initialValues, onSave, onDelete, onClose }) {
  const initial = {};
  fields.forEach(f => {
    let v = initialValues?.[f.key];
    if (f.type === 'list') {
      v = Array.isArray(v) ? v.join(', ') : (v || '');
    }
    if (v === undefined || v === null) {
      v = f.type === 'checkbox' ? false : (f.type === 'number' ? 0 : '');
    }
    initial[f.key] = v;
  });

  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (key, val) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const buildPayload = () => {
    const payload = {};
    fields.forEach(f => {
      let v = values[f.key];
      if (f.type === 'list') {
        v = v.split(',').map(s => s.trim()).filter(Boolean);
      } else if (f.type === 'number') {
        v = Number(v) || 0;
      }
      payload[f.key] = v;
    });
    return payload;
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const result = await onSave(buildPayload());
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    setSaving(true);
    setError(null);
    const result = await onDelete();
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="edit-modal-backdrop" onClick={onClose}>
      <div className="edit-modal" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>

        {error && <div className="edit-error">{error}</div>}

        {fields.map(f => (
          <div className="edit-field" key={f.key}>
            <label>{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                rows={4}
                value={values[f.key]}
                onChange={e => handleChange(f.key, e.target.value)}
              />
            ) : f.type === 'checkbox' ? (
              <div className="edit-checkbox-row">
                <input
                  type="checkbox"
                  checked={!!values[f.key]}
                  onChange={e => handleChange(f.key, e.target.checked)}
                />
                <span className="edit-field-hint">{f.hint}</span>
              </div>
            ) : f.type === 'color' ? (
              <input
                type="text"
                placeholder="#38BDF8"
                value={values[f.key]}
                onChange={e => handleChange(f.key, e.target.value)}
              />
            ) : (
              <input
                type={f.type === 'number' ? 'number' : 'text'}
                value={values[f.key]}
                onChange={e => handleChange(f.key, e.target.value)}
              />
            )}
            {f.hint && f.type !== 'checkbox' && (
              <span className="edit-field-hint">{f.hint}</span>
            )}
          </div>
        ))}

        <div className="edit-modal-actions">
          {onDelete && (
            <button className="edit-btn edit-btn-danger" onClick={handleDelete} disabled={saving}>
              Delete
            </button>
          )}
          <button className="edit-btn edit-btn-cancel" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="edit-btn edit-btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

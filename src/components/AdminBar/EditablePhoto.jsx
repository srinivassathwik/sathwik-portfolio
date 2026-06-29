/* ============================================================
   EditablePhoto
   ============================================================
   Renders an <img> if a URL is provided, otherwise renders
   `placeholder` (e.g. the existing SVG icon placeholder).

   If the logged-in admin hovers over it, an overlay with
   "Change photo" appears — clicking opens a file picker and
   uploads the chosen image via uploadPicture().

   Props:
     src         : current image URL (or null)
     placeholder : JSX to show when src is null
     isAdmin     : boolean
     onUpload    : async (file) => { url?, error? }
     alt         : alt text for the <img>
   ============================================================ */
import { useState } from 'react';
import './EditablePhoto.css';

export default function EditablePhoto({ src, placeholder, isAdmin, onUpload, alt }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const result = await onUpload(file);
    setUploading(false);

    if (result?.error) {
      setError(result.error);
    }
    e.target.value = '';
  };

  return (
    <div className="editable-photo">
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        placeholder
      )}

      {isAdmin && (
        <label className="editable-photo-overlay">
          <span>{src ? 'Change photo' : 'Upload photo'}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
      )}

      {uploading && (
        <div className="editable-photo-uploading">Uploading…</div>
      )}

      {error && (
        <div className="editable-photo-uploading" style={{ color: '#F472B6' }}>
          {error}
        </div>
      )}
    </div>
  );
}

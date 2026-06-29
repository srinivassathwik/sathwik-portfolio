/* ============================================================
   AdminBar — small floating pill, bottom-right of the site.

   - Logged out: click → opens login form (email + password)
   - Logged in : shows "Admin mode" + logout

   Visible to everyone, but harmless to visitors — it's just a
   login trigger. Only YOU know the credentials.
   ============================================================ */
import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import './AdminBar.css';
import './EditModal.css';

export default function AdminBar() {
  const { isAdmin, loading, login, logout } = useAdmin();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading || !isSupabaseConfigured) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await login(email, password);
    setSubmitting(false);
    if (error) {
      setError(error);
    } else {
      setShowLogin(false);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <>
      <div className="admin-bar">
        {isAdmin ? (
          <button className="admin-pill admin-pill--active" onClick={logout}>
            <span className="admin-dot" />
            Admin mode — Logout
          </button>
        ) : (
          <button className="admin-pill" onClick={() => setShowLogin(true)}>
            <span className="admin-dot" />
            Admin login
          </button>
        )}
      </div>

      {showLogin && (
        <div className="edit-modal-backdrop" onClick={() => setShowLogin(false)}>
          <div className="admin-login-modal" onClick={e => e.stopPropagation()}>
            <h3>Admin Login</h3>
            {error && <div className="edit-error">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="edit-field">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="edit-field">
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="edit-modal-actions">
                <button type="button" className="edit-btn edit-btn-cancel" onClick={() => setShowLogin(false)}>
                  Cancel
                </button>
                <button type="submit" className="edit-btn edit-btn-save" disabled={submitting}>
                  {submitting ? 'Logging in…' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

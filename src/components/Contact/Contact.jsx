/* ============================================================
   CONTACT — Connected to Flask backend
   Sends form data → Flask API → Gmail + SQLite
   ============================================================ */
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { personal } from '../../data/portfolioData';
import { useSiteSettingsContext } from '../../context/SiteSettingsContext';
import { useAdmin } from '../../context/AdminContext';
import WhatsAppModal from './WhatsAppModal';
import ContactEditor from './ContactEditor';
import './Contact.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const socialLinks = [
  {
    label: 'LinkedIn', href: personal.linkedin,
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>),
  },
  {
    label: 'GitHub', href: personal.github,
    icon: (<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>),
  },
  {
    label: 'Email', href: `https://mail.google.com/mail/?view=cm&fs=1&to=${personal.email}&subject=Portfolio%20Inquiry&body=Hi%20Sathwik,%0A%0AI%20found%20your%20portfolio%20and%20would%20like%20to%20connect.`,
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>),
  },
];

function Toast({ type, message, onClose }) {
  if (!message) return null;
  return (
    <motion.div
      className={`contact-toast contact-toast--${type}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <span className="toast-icon">{type === 'success' ? '✓' : '✗'}</span>
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </motion.div>
  );
}

export default function Contact() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form,   setForm]   = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [toast,  setToast]  = useState({ type: '', message: '' });
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const { settings } = useSiteSettingsContext();
  const { isAdmin } = useAdmin();
  const [editing, setEditing] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 5000);
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showToast('error', 'Please fill in all required fields.');
      return;
    }
    if (!form.email.includes('@')) {
      showToast('error', 'Please enter a valid email address.');
      return;
    }
    setStatus('sending');
    try {
      const res  = await fetch(`${API_URL}/api/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
        showToast('success', "Message sent! I'll reply within 24 hours ✓");
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        throw new Error(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('error');
      showToast('error', err.message || 'Failed to send. Please email me directly.');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="section contact-section" id="contact" ref={ref}>
      <div className="contact-orb contact-orb--1" />
      <div className="contact-orb contact-orb--2" />

      <AnimatePresence>
        <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
      </AnimatePresence>

      <div
        className="container"
        style={{ position: "relative" }}
      >

        {isAdmin && (
          <button
            onClick={() => setEditing(true)}
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              zIndex: 100,
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              cursor: "pointer"
            }}
          >
            ✏️
          </button>
        )}
        <motion.div
          className="contact-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Contact</span>
          <h2 className="contact-title font-display">
            Let's build something<br />
            <span className="text-gradient">worth remembering.</span>
          </h2>
          <p className="contact-subtitle">
            Have a challenging project? A problem that needs solving?<br />
            Or just want to connect — I'm listening.
          </p>
        </motion.div>

        <div className="contact-layout">
          <motion.div
            className="contact-form-wrap glass"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label font-mono">Name <span className="required">*</span></label>
                  <input type="text" name="name" className="form-input" placeholder="Your name"
                    value={form.name} onChange={handleChange} disabled={status === 'sending'} required />
                </div>
                <div className="form-group">
                  <label className="form-label font-mono">Email <span className="required">*</span></label>
                  <input type="email" name="email" className="form-input" placeholder="your@email.com"
                    value={form.email} onChange={handleChange} disabled={status === 'sending'} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label font-mono">Subject</label>
                <input type="text" name="subject" className="form-input" placeholder="What's this about?"
                  value={form.subject} onChange={handleChange} disabled={status === 'sending'} />
              </div>
              <div className="form-group">
                <label className="form-label font-mono">Message <span className="required">*</span></label>
                <textarea name="message" className="form-input form-textarea" rows={6}
                  placeholder="Tell me about your project, challenge, or idea..."
                  value={form.message} onChange={handleChange} disabled={status === 'sending'} required />
              </div>
              <div className="char-count font-mono">{form.message.length} characters</div>
              <button type="submit" className={`form-submit ${status}`}
                disabled={status === 'sending' || status === 'success'} data-cursor-hover>
                {status === 'idle'    && <><span>Send Message</span><span className="btn-arrow">→</span></>}
                {status === 'sending' && <><span className="spinner" /><span>Sending...</span></>}
                {status === 'success' && <><span>✓ Message Sent!</span></>}
                {status === 'error'   && <><span>↺ Try Again</span></>}
              </button>
            </form>
          </motion.div>

          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            <div className="info-block">
              <div className="info-label font-mono">Based in</div>
              <div className="info-value">
              {settings.contact_location || "Hyderabad, India"}
            </div>
            </div>
            <div className="info-block">
              <div className="info-label font-mono">Available for</div>
              <div className="info-value">
                {settings.contact_availability || "Remote & On-site"}
              </div>
            </div>
            <div className="info-block">
              <div className="info-label font-mono">Response time</div>
              <div className="info-value">
                {settings.contact_response_time || "Within 24 hours"}
              </div>
            </div>
            <div className="info-divider" />
            <div className="contact-socials">

              <button
                type="button"
                className="social-link"
                data-cursor-hover
                onClick={() => setShowWhatsApp(true)}
              >
                <span className="social-icon">💬</span>
                <span className="social-label">WhatsApp</span>
                <span className="social-arrow">↗</span>
              </button>

              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  data-cursor-hover
                >
                  <span className="social-icon">{icon}</span>
                  <span className="social-label">{label}</span>
                  <span className="social-arrow">↗</span>
                </a>
              ))}

            </div>
            <div className="contact-email">
              <div className="info-label font-mono">Direct email</div>
              <a href={`mailto:${personal.email}`} className="email-link font-mono">{personal.email}</a>
            </div>
          </motion.div>
        </div>
      </div>
      {showWhatsApp && (
        <WhatsAppModal
          onClose={() => setShowWhatsApp(false)}
        />
      )}
      {editing && (
        <ContactEditor
          onClose={() => setEditing(false)}
        />
      )}
    </section>
  );
}

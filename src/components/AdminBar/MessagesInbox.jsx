/* ============================================================
   MessagesInbox — admin-only panel listing contact submissions
   ============================================================ */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMessages } from '../../hooks/useMessages';
import './MessagesInbox.css';

export default function MessagesInbox({ onClose }) {
  const { messages, loading, markRead, remove } = useMessages(true);
  const [openId, setOpenId] = useState(null);

  const toggleOpen = (msg) => {
    const next = openId === msg.id ? null : msg.id;
    setOpenId(next);
    if (next && !msg.read) markRead(msg.id);
  };

  return (
    <div className="edit-modal-backdrop" onClick={onClose}>
      <div className="inbox-modal" onClick={e => e.stopPropagation()}>
        <div className="inbox-header">
          <h3>Messages {messages.length > 0 && <span className="inbox-count">{messages.length}</span>}</h3>
          <button className="inbox-close" onClick={onClose}>×</button>
        </div>

        {loading && <div className="inbox-empty">Loading…</div>}
        {!loading && messages.length === 0 && (
          <div className="inbox-empty">No messages yet.</div>
        )}

        <div className="inbox-list">
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                className={`inbox-item ${!msg.read ? 'unread' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="inbox-row" onClick={() => toggleOpen(msg)}>
                  <div className="inbox-row-main">
                    {!msg.read && <span className="unread-dot" />}
                    <span className="inbox-name">{msg.name}</span>
                    <span className="inbox-subject">{msg.subject || 'No subject'}</span>
                  </div>
                  <span className="inbox-date">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>

                <AnimatePresence>
                  {openId === msg.id && (
                    <motion.div
                      className="inbox-detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <p className="inbox-email">{msg.email}</p>
                      <p className="inbox-message">{msg.message}</p>
                      <div className="inbox-actions">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your message'}`}
                          className="inbox-btn"
                        >
                          Reply
                        </a>
                        <button className="inbox-btn inbox-btn-delete" onClick={() => remove(msg.id)}>
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

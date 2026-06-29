/* ============================================================
   FREELANCE — Services offered
   Now backed by Supabase (with static fallback) + admin CRUD.
   ============================================================ */
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { freelanceServices as fallbackServices } from '../../data/portfolioData';
import { useContent } from '../../hooks/useContent';
import { useAdmin } from '../../context/AdminContext';
import EditModal from '../AdminBar/EditModal';
import './Freelance.css';
import '../AdminBar/AdminControls.css';

const normalizedFallback = fallbackServices.map((s, i) => ({ ...s, order_index: i + 1 }));

const SERVICE_FIELDS = [
  { key: 'title',       label: 'Title',       type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'icon',        label: 'Icon',        type: 'text', hint: 'A single emoji, e.g. ⚡' },
  { key: 'items',       label: 'Items',       type: 'list', hint: 'Comma-separated, e.g. LLM Workflow Design, RAG Systems' },
];

export default function Freelance() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { isAdmin } = useAdmin();

  const { items: freelanceServices, addItem, updateItem, deleteItem } = useContent('freelance_services', normalizedFallback);

  const [editingService, setEditingService] = useState(null);
  const [adding, setAdding] = useState(false);

  const handleSave = async (values) => {
    if (adding) return await addItem(values);
    return await updateItem(editingService.id, values);
  };

  const handleDelete = editingService && !adding
    ? async () => await deleteItem(editingService.id)
    : undefined;

  return (
    <section className="section freelance-section" id="freelance" ref={ref}>
      <div className="container">
        <div className="freelance-layout">

          {/* Left — intro */}
          <motion.div
            className="freelance-intro"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label">Freelance</span>
            <h2 className="freelance-title font-display">
              Hire me for<br />
              <span className="text-gradient">high-impact work.</span>
            </h2>
            <p className="freelance-desc">
              I work with clients who value precision over speed, 
              craftsmanship over shortcuts, and long-term partnership 
              over transactional delivery.
            </p>
            <p className="freelance-desc">
              Available for remote engagements worldwide. 
              Project-based, retainer, or consulting.
            </p>
            <div className="freelance-badges">
              <span className="fl-badge">
                <span className="fl-badge-dot" />
                Remote
              </span>
              <span className="fl-badge">
                <span className="fl-badge-dot" />
                Worldwide
              </span>
              <span className="fl-badge">
                <span className="fl-badge-dot" />
                Fast Response
              </span>
            </div>
            <a
              href="#contact"
              className="fl-cta"
              data-cursor-hover
              onClick={e => { e.preventDefault(); document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' }); }}
            >
              Start a conversation →
            </a>
          </motion.div>

          {/* Right — service cards */}
          <div className="freelance-services">
            {freelanceServices.map((svc, i) => (
              <motion.div
                key={svc.id || i}
                className="svc-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                data-cursor-hover
                style={{ position: 'relative' }}
              >
                {isAdmin && (
                  <div
                    className="admin-edit-icon"
                    style={{ top: '0.5rem', right: '0.5rem' }}
                    onClick={() => { setAdding(false); setEditingService(svc); }}
                    title="Edit service"
                  >
                    ✎
                  </div>
                )}
                <div className="svc-icon">{svc.icon}</div>
                <h3 className="svc-title">{svc.title}</h3>
                <p className="svc-desc">{svc.description}</p>
                <ul className="svc-items">
                  {(svc.items || []).map(item => (
                    <li key={item} className="svc-item font-mono">
                      <span className="item-arrow">›</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {isAdmin && (
              <button
                className="admin-add-btn"
                style={{ width: '100%' }}
                onClick={() => { setAdding(true); setEditingService({}); }}
              >
                + Add new service
              </button>
            )}
          </div>
        </div>
      </div>

      {editingService && (
        <EditModal
          title={adding ? 'Add Service' : 'Edit Service'}
          fields={SERVICE_FIELDS}
          initialValues={editingService}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditingService(null)}
        />
      )}
    </section>
  );
}

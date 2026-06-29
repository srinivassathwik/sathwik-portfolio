/* ============================================================
   EXPERIENCE — Professional timeline
   Now backed by Supabase (with static fallback) + admin CRUD
   for job entries. Certifications + languages remain static.
   ============================================================ */
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { experience as fallbackExperience, certifications } from '../../data/portfolioData';
import { useContent } from '../../hooks/useContent';
import { useAdmin } from '../../context/AdminContext';
import EditModal from '../AdminBar/EditModal';
import './Experience.css';
import '../AdminBar/AdminControls.css';

const normalizedFallback = fallbackExperience.map((e, i) => ({
  ...e,
  tech_stack: e.techStack,
  order_index: i + 1,
}));

const EXPERIENCE_FIELDS = [
  { key: 'role',         label: 'Role / Title', type: 'text' },
  { key: 'company',      label: 'Company',      type: 'text' },
  { key: 'period',       label: 'Period',       type: 'text', hint: 'e.g. 2025 – Present' },
  { key: 'location',     label: 'Location',     type: 'text' },
  { key: 'type',         label: 'Type',         type: 'text', hint: 'e.g. Full-Time, Contract, Internship' },
  { key: 'achievements', label: 'Achievements', type: 'list', hint: 'Comma-separated bullet points' },
  { key: 'tech_stack',   label: 'Tech Stack',   type: 'list', hint: 'Comma-separated, e.g. Python, RAG, Agile' },
];

export default function Experience() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { isAdmin } = useAdmin();

  const { items: experience, addItem, updateItem, deleteItem } = useContent('experience', normalizedFallback);

  const [editingJob, setEditingJob] = useState(null);
  const [adding, setAdding] = useState(false);

  const handleSave = async (values) => {
    if (adding) return await addItem(values);
    return await updateItem(editingJob.id, values);
  };

  const handleDelete = editingJob && !adding
    ? async () => await deleteItem(editingJob.id)
    : undefined;

  return (
    <section className="section experience-section" id="experience" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Experience</span>
          <h2 className="exp-title font-display">
            Where I've built.
          </h2>
        </motion.div>

        <div className="exp-layout">
          {/* Experience cards */}
          <div className="exp-cards">
            {experience.map((job, i) => (
              <motion.div
                key={job.id || i}
                className="exp-card card"
                initial={{ opacity: 0, x: -40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'relative' }}
              >
                {isAdmin && (
                  <div
                    className="admin-edit-icon"
                    style={{ top: '0.75rem', right: '0.75rem' }}
                    onClick={() => { setAdding(false); setEditingJob(job); }}
                    title="Edit experience"
                  >
                    ✎
                  </div>
                )}
                <div className="exp-card-header">
                  <div>
                    <h3 className="exp-role font-display">{job.role}</h3>
                    <div className="exp-company">{job.company}</div>
                    <div className="exp-meta font-mono">
                      <span>{job.location}</span>
                      <span className="meta-sep">·</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <div className="exp-period font-mono">{job.period}</div>
                </div>

                <ul className="exp-achievements">
                  {(job.achievements || []).map((ach, j) => (
                    <li key={j} className="exp-achievement">
                      <span className="ach-marker" />
                      {ach}
                    </li>
                  ))}
                </ul>

                <div className="exp-stack">
                  {(job.tech_stack || job.techStack || []).map(tech => (
                    <span key={tech} className="tech-pill font-mono">{tech}</span>
                  ))}
                </div>
              </motion.div>
            ))}

            {isAdmin && (
              <button
                className="admin-add-btn"
                style={{ width: '100%' }}
                onClick={() => { setAdding(true); setEditingJob({}); }}
              >
                + Add new experience
              </button>
            )}
          </div>

          {/* Certifications */}
          <motion.div
            className="cert-panel"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="cert-header font-mono">Certifications</div>
            <div className="cert-list">
              {certifications.map((cert, i) => (
                <motion.div
                  key={i}
                  className="cert-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <div className="cert-icon">✦</div>
                  <div>
                    <div className="cert-name">{cert.name}</div>
                    <div className="cert-meta font-mono">{cert.issuer} · {cert.year}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Languages */}
            <div className="cert-header font-mono" style={{ marginTop: '2rem' }}>Languages</div>
            <div className="lang-list">
              <div className="lang-item">
                <span className="lang-name">English</span>
                <span className="lang-level font-mono">Professional</span>
              </div>
              <div className="lang-item">
                <span className="lang-name">Telugu</span>
                <span className="lang-level font-mono">Native</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {editingJob && (
        <EditModal
          title={adding ? 'Add Experience' : 'Edit Experience'}
          fields={EXPERIENCE_FIELDS}
          initialValues={editingJob}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditingJob(null)}
        />
      )}
    </section>
  );
}

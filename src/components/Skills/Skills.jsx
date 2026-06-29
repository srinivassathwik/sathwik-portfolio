/* ============================================================
   SKILLS — Futuristic skill cards with categories
   Now backed by Supabase (with static fallback) + admin CRUD.
   ============================================================ */
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { skills as fallbackSkills } from '../../data/portfolioData';
import { useContent } from '../../hooks/useContent';
import { useAdmin } from '../../context/AdminContext';
import EditModal from '../AdminBar/EditModal';
import './Skills.css';
import '../AdminBar/AdminControls.css';

const CATEGORIES = ['All', 'AI', 'Language', 'Automation', 'Data', 'Framework', 'Platform', 'Mindset', 'Web', 'Database', 'Tool'];

const categoryColors = {
  AI:         { bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.3)',  text: '#38BDF8' },
  Language:   { bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.3)', text: '#818CF8' },
  Automation: { bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.3)',  text: '#FB923C' },
  Data:       { bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.3)',  text: '#4ADE80' },
  Framework:  { bg: 'rgba(212,175,55,0.1)',  border: 'rgba(212,175,55,0.3)',  text: '#D4AF37' },
  Platform:   { bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.3)', text: '#F472B6' },
  Mindset:    { bg: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.5)',  text: '#38BDF8' },
  Web:        { bg: 'rgba(165,243,252,0.1)', border: 'rgba(165,243,252,0.3)', text: '#7DD3FC' },
  Database:   { bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)', text: '#A78BFA' },
  Tool:       { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)', text: '#94A3B8' },
};

const normalizedFallback = fallbackSkills.map((s, i) => ({ ...s, order_index: i + 1 }));

const SKILL_FIELDS = [
  { key: 'name',     label: 'Skill Name', type: 'text' },
  { key: 'category', label: 'Category',   type: 'text', hint: 'e.g. AI, Language, Automation, Data, Framework, Platform, Mindset, Web, Database, Tool' },
  { key: 'level',    label: 'Level (%)',  type: 'number', hint: '0-100' },
];

export default function Skills() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState('All');
  const { isAdmin } = useAdmin();

  const { items: skills, addItem, updateItem, deleteItem } = useContent('skills', normalizedFallback);

  const [editingSkill, setEditingSkill] = useState(null);
  const [adding, setAdding] = useState(false);

  const filtered = active === 'All' ? skills : skills.filter(s => s.category === active);
  const usedCats = ['All', ...new Set(skills.map(s => s.category))];

  const handleSave = async (values) => {
    if (adding) return await addItem(values);
    return await updateItem(editingSkill.id, values);
  };

  const handleDelete = editingSkill && !adding
    ? async () => await deleteItem(editingSkill.id)
    : undefined;

  return (
    <section className="section skills-section" id="skills" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="skills-header"
        >
          <span className="section-label">Technical Skills</span>
          <h2 className="skills-title font-display">
            The toolkit.<br />
            <span className="text-gradient">Engineered to deliver.</span>
          </h2>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="skills-filters"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {usedCats.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${active === cat ? 'active' : ''}`}
              onClick={() => setActive(cat)}
              data-cursor-hover
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skill cards */}
        <div className="skills-grid">
          {filtered.map((skill, i) => {
            const colors = categoryColors[skill.category] || categoryColors.Tool;
            return (
              <motion.div
                key={skill.id || skill.name}
                className="skill-card"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                data-cursor-hover
                style={{ '--c-bg': colors.bg, '--c-border': colors.border, '--c-text': colors.text, position: 'relative' }}
              >
                {isAdmin && (
                  <div
                    className="admin-edit-icon"
                    style={{ top: '0.5rem', right: '0.5rem' }}
                    onClick={() => { setAdding(false); setEditingSkill(skill); }}
                    title="Edit skill"
                  >
                    ✎
                  </div>
                )}
                <div className="skill-top">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-category-badge"
                    style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
                  >
                    {skill.category}
                  </span>
                </div>
                <div className="skill-bar-wrap">
                  <motion.div
                    className="skill-bar"
                    style={{ background: `linear-gradient(90deg, ${colors.text}, ${colors.text}88)` }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.level}%` } : {}}
                    transition={{ delay: 0.3 + i * 0.05, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <div className="skill-level font-mono" style={{ color: colors.text }}>
                  {skill.level}%
                </div>
                <div className="skill-glow" style={{ background: colors.bg }} />
              </motion.div>
            );
          })}
        </div>

        {isAdmin && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              className="admin-add-btn"
              onClick={() => { setAdding(true); setEditingSkill({}); }}
            >
              + Add new skill
            </button>
          </div>
        )}
      </div>

      {editingSkill && (
        <EditModal
          title={adding ? 'Add Skill' : 'Edit Skill'}
          fields={SKILL_FIELDS}
          initialValues={editingSkill}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditingSkill(null)}
        />
      )}
    </section>
  );
}

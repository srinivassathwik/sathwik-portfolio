/* ============================================================
   PROJECTS — Premium product showcase cards
   Now backed by Supabase (with static fallback) + admin CRUD.
   ============================================================ */
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { projects as fallbackProjects } from '../../data/portfolioData';
import { useContent } from '../../hooks/useContent';
import { useAdmin } from '../../context/AdminContext';
import EditModal from '../AdminBar/EditModal';
import './Projects.css';
import '../AdminBar/AdminControls.css';

// Normalize fallback static data (camelCase) to match DB shape (snake_case)
const normalizedFallback = fallbackProjects.map((p, i) => ({
  ...p,
  tech_stack: p.techStack,
  order_index: i + 1,
}));

const PROJECT_FIELDS = [
  { key: 'title',       label: 'Title',        type: 'text' },
  { key: 'subtitle',    label: 'Subtitle',     type: 'text' },
  { key: 'client',      label: 'Client',       type: 'text' },
  { key: 'year',        label: 'Year',         type: 'text' },
  { key: 'category',    label: 'Category',     type: 'text' },
  { key: 'description', label: 'Description',  type: 'textarea' },
  { key: 'challenge',   label: 'Challenge',    type: 'textarea' },
  { key: 'solution',    label: 'Solution',     type: 'textarea' },
  { key: 'impact',      label: 'Impact',       type: 'textarea' },
  { key: 'tech_stack',  label: 'Tech Stack',   type: 'list', hint: 'Comma-separated, e.g. Python, Flask, SQL' },
  { key: 'color',       label: 'Accent Color', type: 'color', hint: 'Hex color, e.g. #38BDF8' },
  { key: 'featured',    label: 'Featured',     type: 'checkbox', hint: 'Show in the featured grid' },
];

function ProjectCard({ project, index, inView, isAdmin, onEdit }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className={`project-card ${project.featured ? 'featured' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ '--project-color': project.color, position: 'relative' }}
    >
      {isAdmin && (
        <div className="admin-edit-icon" onClick={() => onEdit(project)} title="Edit project">
          ✎
        </div>
      )}

      {/* Category + client */}
      <div className="proj-meta">
        <span className="proj-category font-mono">{project.category}</span>
        {project.client !== 'Personal Project' && (
          <span className="proj-client">
            <span className="client-dot" />
            {project.client}
          </span>
        )}
        <span className="proj-year font-mono">{project.year}</span>
      </div>

      {/* Title */}
      <h3 className="proj-title font-display">{project.title}</h3>
      <p className="proj-subtitle">{project.subtitle}</p>

      {/* Description */}
      <p className="proj-desc">{project.description}</p>

      {/* Expandable details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="proj-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="detail-block">
              <div className="detail-label font-mono">The Challenge</div>
              <p className="detail-text">{project.challenge}</p>
            </div>
            <div className="detail-block">
              <div className="detail-label font-mono">The Solution</div>
              <p className="detail-text">{project.solution}</p>
            </div>
            <div className="detail-block">
              <div className="detail-label font-mono">Impact</div>
              <p className="detail-text impact">{project.impact}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tech stack */}
      <div className="proj-stack">
        {(project.tech_stack || project.techStack || []).map(t => (
          <span key={t} className="stack-pill font-mono">{t}</span>
        ))}
      </div>

      {/* Footer actions */}
      <div className="proj-footer">
        <button
          className="proj-toggle font-mono"
          onClick={() => setExpanded(!expanded)}
          data-cursor-hover
        >
          {expanded ? '— Less' : '+ Details'}
        </button>
        <div className="proj-links">
          <a href="#" className="proj-link" data-cursor-hover>GitHub ↗</a>
        </div>
      </div>

      {/* Glow */}
      <div className="proj-glow" />
      {project.featured && <div className="featured-badge font-mono">Featured</div>}
    </motion.div>
  );
}

export default function Projects() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { isAdmin } = useAdmin();

  const { items: projects, addItem, updateItem, deleteItem } = useContent('projects', normalizedFallback);

  const [editingProject, setEditingProject] = useState(null); // null = closed, {} = new, object = edit
  const [adding, setAdding] = useState(false);

  const featured = projects.filter(p => p.featured);
  const others   = projects.filter(p => !p.featured);

  const handleSave = async (values) => {
    if (adding) {
      return await addItem(values);
    }
    return await updateItem(editingProject.id, values);
  };

  const handleDelete = editingProject && !adding
    ? async () => await deleteItem(editingProject.id)
    : undefined;

  return (
    <section className="section projects-section" id="projects" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="proj-header"
        >
          <span className="section-label">Projects</span>
          <h2 className="proj-section-title font-display">
            Systems built.<br />
            <span className="text-gradient">Problems solved.</span>
          </h2>
          <p className="proj-section-sub">
            Real clients. Real constraints. Real outcomes.
          </p>
        </motion.div>

        {/* Featured */}
        <div className="proj-featured-grid">
          {featured.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              inView={inView}
              isAdmin={isAdmin}
              onEdit={(proj) => { setAdding(false); setEditingProject(proj); }}
            />
          ))}
        </div>

        {/* Rest */}
        <div className="proj-grid">
          {others.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i + featured.length}
              inView={inView}
              isAdmin={isAdmin}
              onEdit={(proj) => { setAdding(false); setEditingProject(proj); }}
            />
          ))}
        </div>

        {isAdmin && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              className="admin-add-btn"
              onClick={() => { setAdding(true); setEditingProject({}); }}
            >
              + Add new project
            </button>
          </div>
        )}
      </div>

      {editingProject && (
        <EditModal
          title={adding ? 'Add Project' : 'Edit Project'}
          fields={PROJECT_FIELDS}
          initialValues={editingProject}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditingProject(null)}
        />
      )}
    </section>
  );
}

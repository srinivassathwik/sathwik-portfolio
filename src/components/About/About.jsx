/* ============================================================
   ABOUT — Who is Sathwik
   ============================================================ */
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { about, personal } from '../../data/portfolioData';
import { useProfilePicture } from '../../hooks/useProfilePicture';
import { useAdmin } from '../../context/AdminContext';
import EditablePhoto from '../AdminBar/EditablePhoto';
import AboutEditor from './AboutEditor';
import { useSiteSettingsContext } from '../../context/SiteSettingsContext';
import './About.css';

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] } },
});

export default function About() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { url: profilePicUrl, uploadPicture } = useProfilePicture();
  const { isAdmin } = useAdmin();
  const { settings } = useSiteSettingsContext();
  const [editing, setEditing] = useState(false);

  return (
    <section className="section about-section" id="about" ref={ref}>
      <div className="container">
        <div className="about-grid">

          {/* Left — text */}
          <div
            className="about-text"
            style={{ position: 'relative' }}
          >
            {isAdmin && (
              <div
                className="admin-edit-icon"
                style={{
                  top: '0.5rem',
                  right: '0.5rem',
                  position: 'absolute'
                }}
                onClick={() => setEditing(true)}
                title="Edit About"
              >
                ✎
              </div>
            )}
            <motion.div
              variants={fadeUp(0)}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="about-photo"
            >
              <EditablePhoto
                src={profilePicUrl}
                isAdmin={isAdmin}
                onUpload={uploadPicture}
                alt={personal.firstName}
                placeholder={
                  <div className="photo-icon">
                    <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
                      <circle cx="32" cy="24" r="12" stroke="var(--accent)" strokeWidth="1.5"/>
                      <path d="M8 56c0-13.25 10.75-24 24-24s24 10.75 24 24" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                }
              />
            </motion.div>
            <motion.div
              variants={fadeUp(0)}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <span className="section-label">
                  {settings.about_label || "About"}
              </span>

              <h2 className="about-headline font-display">
                  {settings.about_headline || about.headline}
              </h2>
            </motion.div>

            {[
              settings.about_paragraph_1 || about.paragraphs[0],
              settings.about_paragraph_2 || about.paragraphs[1],
              settings.about_paragraph_3 || about.paragraphs[2]
            ]
            .filter(Boolean)
            .map((para, i) => (
              <motion.p
                key={i}
                className="about-para"
                variants={fadeUp(0.1 + i * 0.1)}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
              >
                {para}
              </motion.p>
            ))}

            <motion.div
              className="about-education"
              variants={fadeUp(0.5)}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <div className="edu-label font-mono">Education</div>
              <div className="edu-degree">B.Tech – Information Technology</div>
              <div className="edu-school">N.B.K.R. Institute of Science &amp; Technology, Kota • 2024</div>
            </motion.div>
          </div>

          {/* Right — traits */}
          <div className="about-right">
            <motion.div
              className="about-traits"
              variants={fadeUp(0.3)}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <div className="traits-label font-mono">Character traits</div>
              <div className="traits-grid">
                {about.traits.map(({ icon, label }, i) => (
                  <motion.div
                    key={label}
                    className="trait-chip"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                    data-cursor-hover
                  >
                    <span className="trait-icon">{icon}</span>
                    <span className="trait-label">{label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Code snippet decorative */}
            <motion.div
              className="about-code font-mono"
              variants={fadeUp(0.5)}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <div className="code-header">
                <div className="code-dots">
                  <span /><span /><span />
                </div>
                <span className="code-filename">identity.py</span>
              </div>
              <div className="code-body">
                <div className="code-line">
                  <span className="c-keyword">class</span>
                  <span className="c-class"> Sathwik</span>
                  <span>:</span>
                </div>
                <div className="code-line indent">
                  <span className="c-keyword">def</span>
                  <span className="c-fn"> __init__</span>
                  <span>(self):</span>
                </div>
                <div className="code-line indent2">
                  <span className="c-attr">self.role</span>
                  <span> = </span>
                  <span className="c-str">"Vibe Coder"</span>
                </div>
                <div className="code-line indent2">
                  <span className="c-attr">self.mode</span>
                  <span> = </span>
                  <span className="c-str">"Builder"</span>
                </div>
                <div className="code-line indent2">
                  <span className="c-attr">self.values</span>
                  <span> = [</span>
                  <span className="c-str">"respect"</span>
                  <span>, </span>
                  <span className="c-str">"craft"</span>
                  <span>]</span>
                </div>
                <div className="code-line indent2">
                  <span className="c-attr">self.open_to</span>
                  <span> = </span>
                  <span className="c-str">"right opportunities"</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
            </div>

      {editing && (
        <AboutEditor
          onClose={() => setEditing(false)}
        />
      )}

    </section>

  );
}
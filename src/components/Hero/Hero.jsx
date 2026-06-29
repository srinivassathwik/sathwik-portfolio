/* ============================================================
   HERO — Cinematic entrance section
   ============================================================ */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { personal } from '../../data/portfolioData';
import { useProfilePicture } from '../../hooks/useProfilePicture';
import { useAdmin } from '../../context/AdminContext';
import { useSiteSettingsContext } from '../../context/SiteSettingsContext';
import EditablePhoto from '../AdminBar/EditablePhoto';
import HeroEditor from './HeroEditor';
import ResumeUploader from './ResumeUploader';

import './Hero.css';

export default function Hero() {
  const canvasRef = useRef(null);
  const { url: profilePicUrl, uploadPicture } = useProfilePicture();
  const { isAdmin } = useAdmin();
  const { settings } = useSiteSettingsContext();
  const [editing, setEditing] = useState(false);

  /* ── Particle Constellation ───────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width  = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let mouse = { x: w / 2, y: h / 2 };
    let raf;

    const onResize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove);

    // Create nodes
    const count = Math.min(80, Math.floor((w * h) / 14000));
    const nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(56,189,248,${(1 - dist / 150) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        // Mouse proximity lines
        const dx = nodes[i].x - mouse.x;
        const dy = nodes[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(56,189,248,${(1 - dist / 180) * 0.25})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56,189,248,0.5)';
        ctx.fill();

        // Update
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="hero" id="hero">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="hero-canvas" />

      {/* Radial glow */}
      <div className="hero-glow" />

      {/* Grid */}
      <div className="hero-grid" />
      

      <div
        className="container hero-content"
        style={{ position: 'relative' }}
      >


        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hero-inner"
        >
          {/* Pre-label */}
          <motion.div variants={itemVariants} className="hero-prelabel font-mono">
            <span className="prelabel-dash">—</span>
            &nbsp; Available for freelance &amp; full-time
            <span className="prelabel-dot" />
          </motion.div>

          {/* Main name */}
          <motion.h1
            variants={itemVariants}
            className="hero-name font-display"
          >
            {[
              {
                value: settings.hero_first_name ?? "Srinivas",
                accent: false,
              },
              {
                value: settings.hero_middle_name ?? "Sathwik",
                accent: true,
              },
              {
                value: settings.hero_last_name ?? "Maddali",
                accent: false,
              },
            ]
              .filter(
                (part) =>
                  part.value !== null &&
                  part.value !== undefined &&
                  part.value.trim() !== ""
              )
              .map((part, index) => (
                <span key={index}>
                  {index > 0 && <br />}

                  {part.accent ? (
                    <span className="hero-name-accent">
                      {part.value}
                    </span>
                  ) : (
                    part.value
                  )}
                </span>
              ))}
          </motion.h1>

          {isAdmin && (
            <button
              className="hero-text-edit"
              onClick={() => setEditing(true)}
            >
              ✏️ Edit Hero
            </button>
          )}

          {/* Typing tagline */}
          <motion.div variants={itemVariants} className="hero-tagline">
            <span className="tagline-prefix font-mono">~/&gt;&nbsp;</span>
            <TypeAnimation
              sequence={[
                settings.hero_animation_1 ?? 'Software Developer', 2000,
                settings.hero_animation_2 ?? 'AI Automation Specialist', 2000,
                settings.hero_animation_3 ?? 'Prompt Engineer', 2000,
                settings.hero_animation_4 ?? 'Vibe Coder', 2500,
                settings.hero_animation_5 ?? 'Systems Architect', 2000,
              ]}
              wrapper="span"
              speed={55}
              repeat={Infinity}
              className="tagline-text"
            />
            <span className="tagline-cursor font-mono">_</span>
          </motion.div>

          {/* Short bio */}
          <motion.p variants={itemVariants} className="hero-bio">
            {settings.hero_description ??
              <>
                Building intelligent systems quietly.
                <br />
                Hyderabad, India → Global reach.
              </>
            }
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="hero-ctas">
            <a href="#projects" className="cta-primary" data-cursor-hover>
              <span>View Projects</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href={settings.hero_resume_url || personal.resumeFullTime}
              className="cta-secondary"
              data-cursor-hover
              download
            >
              <span>Download Resume</span>
            </a>

            {isAdmin && (
              <ResumeUploader />
            )}
            <a href="#contact" className="cta-ghost" data-cursor-hover>
              Contact Me
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={itemVariants}
            className="hero-scroll"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="scroll-line" />
            <span className="font-mono">scroll</span>
          </motion.div>
        </motion.div>

        {/* Profile photo placeholder */}
        <motion.div
          className="hero-photo-wrap"
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-photo-ring" />
          <div className="hero-photo-ring hero-photo-ring--2" />
          <div className="hero-photo-placeholder">

            {isAdmin && (
              <button
                className="hero-photo-edit"
                onClick={() => setEditing(true)}
                title="Edit Hero"
              >
                ✏️
              </button>
            )}

            <EditablePhoto

              src={profilePicUrl}
              isAdmin={isAdmin}
              onUpload={uploadPicture}
              alt={personal.firstName}
              placeholder={
                <div className="photo-icon">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="24" r="12" stroke="var(--accent)" strokeWidth="1.5"/>
                    <path d="M8 56c0-13.25 10.75-24 24-24s24 10.75 24 24" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p className="photo-hint font-mono">Add your photo here</p>
                </div>
              }
            />
          </div>
          {/* Floating badge */}
          <div className="hero-badge">
            <span className="badge-dot" />
            <span className="font-mono">
              {settings.hero_availability || "Open to Work"}
            </span>
          </div>
          {/* Stat cards */}
          <div className="hero-stat hero-stat--1">
            <div className="stat-number font-display">
              {settings.hero_experience || "1+"}
            </div>
            <div className="stat-label">Years Exp.</div>
          </div>
          <div className="hero-stat hero-stat--2">
            <div className="stat-number font-display">
              {settings.hero_projects || "6+"}
            </div>
            <div className="stat-label">Projects</div>
          </div>
        </motion.div>
      </div>
      {editing && (
      <HeroEditor
        onClose={() => setEditing(false)}
      />
    )}
    </section>
  );
}

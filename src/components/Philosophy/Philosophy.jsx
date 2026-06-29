/* ============================================================
   PHILOSOPHY — Core beliefs as cinematic cards
   ============================================================ */
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { philosophies } from '../../data/portfolioData';
import './Philosophy.css';

export default function Philosophy() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section philosophy-section" id="philosophy" ref={ref}>
      {/* Ambient glow */}
      <div className="phil-glow" />

      <div className="container">
        <motion.div
          className="phil-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Philosophy</span>
          <h2 className="phil-title font-display">
            How I think.<br />
            <span className="text-gradient">How I build.</span>
          </h2>
          <p className="phil-subtitle">
            Not a list of values. A way of working.
          </p>
        </motion.div>

        <div className="phil-grid">
          {philosophies.map(({ quote, detail, icon }, i) => (
            <motion.div
              key={i}
              className="phil-card"
              initial={{ opacity: 0, y: 50, rotate: -1 }}
              animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              data-cursor-hover
            >
              <div className="phil-icon font-mono">{icon}</div>
              <div className="phil-quote-mark">"</div>
              <h3 className="phil-quote font-display">{quote}</h3>
              <p className="phil-detail">{detail}</p>
              <div className="phil-card-glow" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

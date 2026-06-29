/* ============================================================
   STORY — Cinematic timeline section
   ============================================================ */
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { story } from "../../data/portfolioData";
import { useAdmin } from "../../context/AdminContext";
import StoryManager from "./StoryManager";
import "./Story.css";

export default function Story() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const { isAdmin } = useAdmin();
  const [showManager, setShowManager] = useState(false);

  return (
    <>
      <section className="section story-section" id="story" ref={ref}>
        <div className="container">

          {isAdmin && (
            <button
              className="admin-edit-icon"
              onClick={() => setShowManager(true)}
              title="Manage Story"
            >
              ✎
            </button>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="story-header"
          >
            <span className="section-label">Origin Story</span>

            <h2 className="story-title font-display">
              The journey to
              <br />
              <span className="text-gradient-gold">
                becoming a builder.
              </span>
            </h2>
          </motion.div>

          <div className="story-timeline">
            <motion.div
              className="timeline-line"
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{
                duration: 1.5,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
            />

            {story.map((item, i) => (
              <motion.div
                key={i}
                className={`timeline-item ${
                  i % 2 === 0 ? "left" : "right"
                }`}
                initial={{
                  opacity: 0,
                  x: i % 2 === 0 ? -50 : 50,
                }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  delay: 0.2 + i * 0.15,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="timeline-dot">
                  <div className="dot-inner" />
                </div>

                <div className="timeline-card card">
                  <div className="timeline-year font-mono">
                    {item.year}
                  </div>

                  <h3 className="timeline-card-title font-display">
                    {item.title}
                  </h3>

                  <p className="timeline-card-text">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {showManager && (
        <div
          className="story-manager-overlay"
          onClick={() => setShowManager(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <StoryManager />

            <div
              style={{
                textAlign: "right",
                marginTop: 20,
              }}
            >
              <button
                className="admin-add-btn"
                onClick={() => setShowManager(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
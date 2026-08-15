/* ============================================================
   FAQ — direct-answer content block for AEO/GEO + visitors.
   Answers are always present in the DOM (collapsed via CSS
   grid-rows, not conditionally unmounted) so crawlers and AI
   answer engines can read full text regardless of interaction
   state. Schema is generated from the same `faqData` array
   that renders the visible content — see src/data/faqData.js.
   ============================================================ */
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { faqData } from '../../data/faqData';
import './FAQ.css';

export default function FAQ() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [openId, setOpenId] = useState(faqData[0]?.id ?? null);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <section className="section faq-section" id="faq" ref={ref}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container">
        <motion.div
          className="faq-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">FAQ</span>
          <h2 className="faq-title font-display">
            Questions, answered<br />
            <span className="text-gradient">directly.</span>
          </h2>
        </motion.div>

        <motion.div
          className="faq-list glass"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.8 }}
        >
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  data-cursor-hover
                >
                  <span>{item.question}</span>
                  <span className="faq-chevron" aria-hidden="true">⌄</span>
                </button>
                <div className="faq-answer-wrap">
                  <div
                    className="faq-answer-inner"
                    id={`faq-answer-${item.id}`}
                    role="region"
                  >
                    <p className="faq-answer">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

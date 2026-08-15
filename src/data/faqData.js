/* ============================================================
   FAQ DATA
   Single source of truth for the visible FAQ section AND its
   FAQPage schema (src/components/FAQ/FAQ.jsx generates both
   from this array) — so the structured data can never drift
   out of sync with what a visitor actually reads on the page.

   Note on Google: as of May 2026 Google no longer shows the
   expandable FAQ rich-result snippet in search for any site —
   that reward is gone. FAQPage remains valid schema.org
   vocabulary that Google (and other engines) still parse for
   page comprehension, and it's a genuinely useful format for
   AI answer engines (ChatGPT, Perplexity, AI Overviews) that
   extract direct Q&A pairs. Treat this as an AEO/GEO layer,
   not a Google-snippet play.
   ============================================================ */
export const faqData = [
  {
    id: 'who',
    question: 'Who is Srinivas Sathwik Maddali?',
    answer: 'Srinivas Sathwik Maddali is a Software Developer and AI Automation Specialist based in Hyderabad, Telangana, India. He works at the intersection of Python automation, LLM engineering, and web intelligence — building systems that process data, integrate AI models, and automate workflows.',
  },
  {
    id: 'what',
    question: 'What does Sathwik specialize in?',
    answer: 'AI automation systems (LLM workflows, RAG, multi-agent pipelines), prompt engineering, web scraping and data engineering, AI chatbot development, and Python/full-stack web development using React.',
  },
  {
    id: 'freelance',
    question: 'Is Sathwik available for freelance or contract work?',
    answer: 'Yes. He takes on project-based work, retainers, and consulting engagements for clients building AI-driven or automation-heavy products.',
  },
  {
    id: 'location',
    question: 'Where is Sathwik based, and does he work with international clients?',
    answer: 'He is based in Hyderabad, Telangana, India, and works with clients both locally and internationally — engagements are primarily remote.',
  },
  {
    id: 'contact',
    question: 'How can I get in touch with Sathwik?',
    answer: 'The fastest way is the contact form on this site, or a direct email — both are on the Contact section. He typically responds within 24 hours.',
  },
  {
    id: 'stack',
    question: 'What tools and technologies does Sathwik work with?',
    answer: 'Python, React, LLM frameworks and prompt engineering, Playwright for browser automation, Supabase/Postgres, and modern AI tooling for building RAG and multi-agent systems.',
  },
];

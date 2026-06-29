-- ============================================================
--  SEED DATA — run AFTER schema.sql
--  Populates the tables with your current content from
--  portfolioData.js so the site looks identical at first,
--  but is now editable from the admin UI.
-- ============================================================

-- ─────────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────────
insert into projects (title, subtitle, client, year, category, description, challenge, solution, tech_stack, impact, featured, color, order_index) values
('Bihar Welfare Schemes Scraper', 'Government Data Aggregation', 'Bihar State Government', '2025', 'Data Engineering',
 'Contracted by the Bihar State Government to consolidate all citizen-facing welfare schemes from multiple dynamic government portals into a single unified application.',
 'Government portals use heavy JavaScript rendering, inconsistent structure, and fragile DOM layouts — standard scrapers fail silently.',
 'Built a Playwright-based pipeline with adaptive selectors, retry logic, and structured output pipelines that delivered clean, integration-ready datasets.',
 array['Python','Playwright','Data Engineering','JSON'],
 'Complete dataset delivered — directly integrated into the Bihar citizen app, reaching millions of users.',
 true, '#38BDF8', 1),

('Bihar MLA Social Media Analyzer', 'Sentiment Intelligence Platform', 'Bihar State Government', '2025', 'AI / NLP',
 'Built a real-time social media analytics tool to monitor official posts of Bihar MLAs, tracking engagement and public sentiment at scale.',
 'Processing high-volume social data with accurate sentiment classification across diverse linguistic patterns.',
 'Engineered a sentiment classification pipeline combining NLP models with custom heuristics, delivering structured sentiment reports to government stakeholders.',
 array['Python','NLP','Sentiment Analysis','Data Analysis'],
 'Delivered structured reports enabling government assessment of public response to elected representatives.',
 true, '#D4AF37', 2),

('Multi-Agent AI Chatbot Systems', 'Intelligent Conversation Architectures', 'Personal Project', '2024', 'AI Engineering',
 'Designed and deployed distinct AI chatbot personalities — mental health companion, academic tutor, travel advisor — each with engineered personas and conversation flows.',
 'Making AI feel genuinely human and contextually aware across wildly different domains and emotional registers.',
 'Applied few-shot learning, role-playing, self-consistency, and multi-agent chaining. Deployed via Tidio, Landbot, and Chatbot.com with custom flows.',
 array['Prompt Engineering','Multi-Agent','Tidio','Landbot','Chatbot.com'],
 'Three production bots deployed with distinct personalities and measurably higher user engagement.',
 false, '#818CF8', 3),

('Crop Disease Detection System', 'AI-Powered Agricultural Intelligence', 'Personal Project', '2024', 'Full-Stack AI',
 'A multilingual Flask web application enabling farmers to upload plant images for real-time AI-powered disease diagnosis and seasonal crop recommendations.',
 'Building a reliable AI application that works in rural connectivity conditions with multilingual support.',
 'Flask backend with AI image analysis, multilingual UI, and seasonal recommendation engine — optimized for mobile and low-bandwidth.',
 array['Python','Flask','SQL','HTML','CSS','AI Integration'],
 'Farmers receive instant, multilingual AI diagnosis and recommendations — democratizing agricultural expertise.',
 false, '#4ADE80', 4),

('Fake Image Detection System', 'Digital Integrity at Scale', 'Personal Project', '2024', 'Computer Vision',
 'A Python-based pipeline to detect manipulated or AI-generated images on social media, achieving high detection accuracy through intelligent preprocessing.',
 'AI-generated content has become increasingly indistinguishable from real photography — detection requires nuanced feature analysis.',
 'Built a multi-stage analysis pipeline with dataset preprocessing and model optimization for high-accuracy detection.',
 array['Python','Image Analysis','Data Processing','ML'],
 'High-accuracy detection pipeline capable of flagging synthetic or manipulated social media imagery.',
 false, '#F472B6', 5),

('RealReview', 'Authentic Review Intelligence', 'Concept Project', '2024', 'AI / Data',
 'An intelligent system designed to surface authentic product reviews from noise — filtering bots, incentivized reviews, and low-quality feedback.',
 'Online reviews are increasingly polluted by paid reviews, bot activity, and coordinated manipulation.',
 'Combining NLP, behavioral pattern analysis, and sentiment authenticity scoring to surface genuinely useful user opinions.',
 array['Python','NLP','Data Analysis','Flask'],
 'Prototype that restores trust in user-generated review systems.',
 false, '#FB923C', 6);


-- ─────────────────────────────────────────────
-- SKILLS
-- ─────────────────────────────────────────────
insert into skills (name, category, level, order_index) values
('Python', 'Language', 95, 1),
('Flask', 'Framework', 85, 2),
('SQL', 'Database', 80, 3),
('HTML & CSS', 'Web', 85, 4),
('JavaScript', 'Language', 70, 5),
('Playwright', 'Automation', 92, 6),
('Selenium', 'Automation', 80, 7),
('Prompt Engineering', 'AI', 95, 8),
('RAG', 'AI', 90, 9),
('ReAct', 'AI', 88, 10),
('Multi-Agent Systems', 'AI', 87, 11),
('LLM Workflows', 'AI', 90, 12),
('Tidio / Landbot', 'Platform', 88, 13),
('Data Engineering', 'Data', 85, 14),
('Git', 'Tool', 80, 15),
('Vibe Coding', 'Mindset', 98, 16);


-- ─────────────────────────────────────────────
-- EXPERIENCE
-- ─────────────────────────────────────────────
insert into experience (role, company, period, location, type, achievements, tech_stack, order_index) values
('Software Developer', 'Aorzon Technologies', '2025 – Present', 'Hyderabad, India', 'Full-Time',
 array[
   'Designed and deployed AI-powered automation solutions using advanced prompt engineering — RAG, ReAct, and multi-agent frameworks.',
   'Applied AI-assisted (vibe coding) development practices to accelerate feature delivery and rapidly prototype novel solutions.',
   'Built and integrated LLM-based workflows into internal processes, improving operational efficiency across multiple teams.',
   'Contributed to agile sprints — sprint planning, code reviews, and iterative delivery at a fast-moving startup pace.'
 ],
 array['Python','LLM','RAG','ReAct','Multi-Agent','Agile'],
 1);


-- ─────────────────────────────────────────────
-- FREELANCE SERVICES
-- ─────────────────────────────────────────────
insert into freelance_services (title, description, icon, items, order_index) values
('AI Automation Systems', 'End-to-end automation using LLMs, RAG, ReAct, and multi-agent frameworks. From intelligent document processing to workflow orchestration.', '⚡',
 array['LLM Workflow Design','RAG Systems','Multi-Agent Pipelines','Process Automation'], 1),

('Web Scraping & Data Engineering', 'Production-grade scraping of dynamic, JavaScript-rendered, and auth-gated web portals. Clean data, structured output, direct integration.', '🕸',
 array['Playwright Automation','Data Pipelines','Structured Output','Portal Integration'], 2),

('Prompt Engineering', 'Transform raw LLM capability into precision tools. Few-shot, chain-of-thought, self-consistency, RLHF — engineered for your specific problem.', '🧠',
 array['Few-Shot Design','Chain-of-Thought','System Prompt Architecture','Model Evaluation'], 3),

('AI Chatbot Development', 'Custom chatbot personalities and conversation systems. Deployed on Tidio, Landbot, Chatbot.com, or custom stacks.', '💬',
 array['Persona Engineering','Flow Design','Platform Deployment','Analytics'], 4),

('Python Development', 'Clean, documented, production-ready Python. Scripts, APIs, pipelines, analysis tools — built to last and easy to maintain.', '🐍',
 array['Flask APIs','Data Scripts','Analysis Tools','Integration'], 5),

('AI-Assisted Web Development', 'Modern web development accelerated by AI. Functional, elegant, responsive — delivered fast without sacrificing quality.', '🌐',
 array['Web Apps','Landing Pages','Portals','Dashboards'], 6);

-- Sample job openings

WITH dept_eng AS (SELECT id FROM departments WHERE slug = 'engineering' LIMIT 1),
     dept_prod AS (SELECT id FROM departments WHERE slug = 'product' LIMIT 1),
     dept_sales AS (SELECT id FROM departments WHERE slug = 'sales-marketing' LIMIT 1),
     dept_qa AS (SELECT id FROM departments WHERE slug = 'quality' LIMIT 1),
     dept_hr AS (SELECT id FROM departments WHERE slug = 'hr' LIMIT 1)

INSERT INTO job_openings (title, slug, department_id, employment_type, experience_level, work_mode, location, salary_min, salary_max, salary_visible, summary, description, responsibilities, requirements, nice_to_have, tags, is_active, is_featured) VALUES
('Senior Full-Stack Engineer','senior-fullstack-engineer', (SELECT id FROM dept_eng),'full_time','senior','hybrid','Varanasi, Uttar Pradesh',1800000,2800000,TRUE,
  'Own the end-to-end delivery of consumer-facing features used by half a million customers daily.',
  E'## About the Role\n\nWe are looking for a Senior Full-Stack Engineer to join our product engineering team.',
  ARRAY['Design, build, and ship full-stack features on our Next.js + Node.js platform','Lead technical design reviews and architecture decisions','Mentor 2–3 junior engineers through code reviews and pairing sessions','Instrument and monitor services using our observability stack','Collaborate with Product and Design in early discovery phases'],
  ARRAY['4+ years of professional full-stack development experience','Strong proficiency in TypeScript, React / Next.js, and Node.js','Experience with PostgreSQL and REST or GraphQL API design','Comfortable with cloud infrastructure (AWS or GCP)','Track record of shipping production features with high quality'],
  ARRAY['Experience with React Native for mobile development','Familiarity with event-driven architectures (Kafka / SQS)','Prior experience in a high-growth startup or FMCG-tech environment'],
  ARRAY['nextjs','typescript','nodejs','postgresql','aws'], TRUE, TRUE),

('DevOps Engineer','devops-engineer', (SELECT id FROM dept_eng),'full_time','mid','remote','Remote (India)',NULL,NULL,FALSE,
  'Build and maintain the infrastructure that keeps our platform fast, reliable, and secure at scale.',
  E'## About the Role\n\nWe need a DevOps Engineer who loves automation, hates downtime, and believes infrastructure is a product too.',
  ARRAY['Manage and scale our Kubernetes clusters on AWS EKS','Own our CI/CD pipelines','Build infrastructure-as-code using Terraform','Set up alerting, dashboards, and on-call runbooks','Drive security hardening and compliance'],
  ARRAY['3+ years in a DevOps or SRE role','Deep experience with Kubernetes and Docker','Proficient in Terraform or Pulumi','Solid understanding of networking, TLS, and IAM','Experience with Prometheus / Grafana / Datadog'],
  ARRAY['GitOps experience (ArgoCD / Flux)','AWS certifications','Experience with SOC 2 compliance'],
  ARRAY['devops','kubernetes','aws','terraform','cicd'], TRUE, FALSE),

('Product Manager — Consumer App','product-manager-consumer-app', (SELECT id FROM dept_prod),'full_time','senior','hybrid','Varanasi, Uttar Pradesh',1600000,2400000,TRUE,
  'Define and drive the product vision for our consumer-facing mobile and web app serving 500K+ MAU.',
  E'## About the Role\n\nYou will own the consumer app roadmap, work closely with engineering and design, and be accountable for MAU growth and retention metrics.',
  ARRAY['Define and own the product roadmap for the consumer app','Run discovery: user interviews, data analysis, competitor research','Write clear, outcome-oriented product specs','Partner with engineering leads to deliver on time','Track core metrics: MAU, retention, NPS, conversion'],
  ARRAY['4+ years of product management, with 2+ in consumer apps','Comfortable with quantitative analysis — SQL is a plus','Experience running structured user research','Strong written and verbal communication','Proven track record of shipping 0→1 and improving existing products'],
  ARRAY['Experience in FMCG or D2C','Background in growth/experimentation','MBA from a Tier-1 institution'],
  ARRAY['product','consumer-app','growth','mobile'], TRUE, TRUE),

('Regional Sales Manager — North India','regional-sales-manager-north', (SELECT id FROM dept_sales),'full_time','lead','onsite','Lucknow / Varanasi, Uttar Pradesh',NULL,NULL,FALSE,
  'Lead our retail and institutional sales strategy across UP and Uttarakhand, managing a team of 12 territory reps.',
  E'## About the Role\n\nWe are expanding aggressively across North India and need a sales leader who can build relationships, develop team capability, and hit numbers.',
  ARRAY['Own revenue and distribution targets for UP and Uttarakhand','Lead, coach, and hire 12 territory sales reps','Develop and execute channel strategy across modern trade, traditional trade, and HoReCa','Build relationships with key retail chains and distributors','Report weekly on pipeline, forecasts, and market intelligence'],
  ARRAY['7+ years in FMCG sales, with 3+ years in team leadership','Deep knowledge of UP and Uttarakhand retail landscape','Experience managing distributors and key accounts','Data-driven approach to performance management','Willingness to travel extensively (50%+)'],
  ARRAY['Prior experience in dairy or beverages','Fluency in Hindi and English','MBA in Sales/Marketing'],
  ARRAY['sales','fmcg','north-india','leadership'], TRUE, TRUE),

('Quality Assurance Lead — Processing Plant','qa-lead-processing-plant', (SELECT id FROM dept_qa),'full_time','mid','onsite','Varanasi Processing Facility, UP',NULL,NULL,FALSE,
  'Own quality control protocols at our Varanasi facility, ensuring every batch meets the highest standard.',
  E'## About the Role\n\nYou will be the last line of defence for product quality, running a team of 4 QA technicians across three shifts.',
  ARRAY['Design and enforce SOPs for raw milk, in-process, and finished goods testing','Manage 4 QA technicians across shift rotations','Lead RCA and CAPA for quality deviations','Maintain FSSAI, ISO 22000, and HACCP compliance documentation','Liaise with R&D team on new product trials'],
  ARRAY['BSc/MSc in Food Science, Dairy Technology, or Microbiology','4+ years QA experience in food & beverage manufacturing','Hands-on experience with microbiological and physicochemical testing','Familiarity with FSSAI regulations and ISO 22000 / HACCP','Experience managing a shift-based team'],
  ARRAY['Prior dairy industry experience','Certified Internal Auditor (ISO 22000)','Experience with LIMS software'],
  ARRAY['quality','food-safety','dairy','haccp'], TRUE, FALSE),

('HR & Talent Intern','hr-talent-intern', (SELECT id FROM dept_hr),'internship','entry','hybrid','Varanasi, Uttar Pradesh',NULL,NULL,FALSE,
  'A 6-month paid internship supporting our talent acquisition and people operations team.',
  E'## About the Role\n\nA fantastic opportunity for an MBA student or fresh graduate to get hands-on experience in a fast-growing FMCG company.',
  ARRAY['Support end-to-end recruitment for entry and mid-level roles','Screen CVs, schedule interviews, manage candidate communications','Assist with onboarding logistics and Day 1 experience','Help maintain ATS and HRMS data accuracy','Contribute to employer branding on LinkedIn'],
  ARRAY['Pursuing or recently completed MBA in HR or equivalent','Excellent written and verbal communication in English and Hindi','High attention to detail and organisational skills','Comfortable with Google Workspace and spreadsheets'],
  ARRAY['Prior internship in HR or recruitment','Familiarity with LinkedIn Recruiter or Naukri'],
  ARRAY['hr','internship','talent','recruiting'], TRUE, FALSE);
-- ============================================================
-- KASHEE BOD — Complete Migration (idempotent, correct order)
-- Run: psql -U kashee -d kasheemilk2 -h localhost -f src/db/006_bod_fix.sql
-- ============================================================

-- ── 1. Helper function ────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ── 2. Tables FIRST ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bod_roles (
  id          SERIAL PRIMARY KEY,
  role_key    VARCHAR(60)  UNIQUE NOT NULL,
  role_label  VARCHAR(100) NOT NULL,
  sort_order  SMALLINT     DEFAULT 0,
  is_active   BOOLEAN      DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS bod_members (
  id            SERIAL PRIMARY KEY,
  full_name     VARCHAR(150) NOT NULL,
  role_id       INTEGER      REFERENCES bod_roles(id) ON DELETE SET NULL,
  designation   VARCHAR(150),
  photo_url     TEXT,
  bio           TEXT,
  qualification TEXT,
  district      VARCHAR(100),
  appointed_on  DATE,
  linkedin_url  VARCHAR(300),
  sort_order    SMALLINT     DEFAULT 0,
  is_chairman   BOOLEAN      DEFAULT FALSE,
  is_active     BOOLEAN      DEFAULT TRUE,
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW()
);


-- ── 3. Roles ─────────────────────────────────────────────────
INSERT INTO bod_roles (role_key, role_label, sort_order) VALUES
  ('chairman',        'Chairman',               10),
  ('ceo',             'Chief Executive Officer', 20),
  ('expert_director', 'Expert Director',         30),
  ('director',        'Director',                40),
  ('independent',     'Independent Director',    50)
ON CONFLICT (role_key) DO UPDATE
  SET role_label = EXCLUDED.role_label,
      sort_order = EXCLUDED.sort_order;


-- ── 4. Members — clean slate ──────────────────────────────────
TRUNCATE TABLE bod_members RESTART IDENTITY CASCADE;

-- CHAIRMAN (1)
INSERT INTO bod_members
  (full_name, role_id, designation, photo_url, bio, district, appointed_on, sort_order, is_chairman)
VALUES (
  'Smt. Savita Devi',
  (SELECT id FROM bod_roles WHERE role_key = 'chairman'),
  'Chairman',
  'https://www.kasheemilk.com/wp-content/uploads/2023/10/poonamDevi.jpg',
  'Smt. Savita Devi is the founding Chairman of Kashee Milk Producer Company Limited. A grassroots leader from Varanasi, she has championed the cause of women dairy farmers for over a decade. Under her leadership, the company has grown from a small cooperative to a multi-district dairy value chain serving thousands of families across Eastern Uttar Pradesh.',
  'Varanasi', '2021-11-01', 10, TRUE
);

-- CEO (1)
INSERT INTO bod_members
  (full_name, role_id, designation, photo_url, bio, qualification, appointed_on, sort_order, is_chairman)
VALUES (
  'Mr. Rakesh Kumar Singh',
  (SELECT id FROM bod_roles WHERE role_key = 'ceo'),
  'Chief Executive Officer',
  NULL,
  'Mr. Rakesh Kumar Singh brings over 18 years of experience in dairy sector management and rural enterprise development. Prior to joining Kashee Milk, he served with the National Dairy Development Board in operational and strategic capacities across multiple states. He holds an MBA in Agribusiness Management from IRMA, Anand.',
  'MBA Agribusiness — IRMA, Anand',
  '2022-03-01', 10, FALSE
);

-- EXPERT DIRECTORS (3)
INSERT INTO bod_members
  (full_name, role_id, designation, photo_url, bio, qualification, appointed_on, sort_order, is_chairman)
VALUES
(
  'Ms. Gayatri Rao',
  (SELECT id FROM bod_roles WHERE role_key = 'expert_director'),
  'Expert Director',
  'https://www.kasheemilk.com/wp-content/uploads/2023/10/gayatriRao.jpg',
  'Ms. Gayatri Rao has more than 16 years of working experience. She has worked with the National Rural Livelihoods Mission on women empowerment and poverty alleviation. She holds a postgraduate degree in management from IIM Kozhikode, and a Master''s in Public Administration from Harvard University (Kennedy School), where she was an Edward Mason Fellow.',
  'MBA — IIM Kozhikode | MPA — Harvard Kennedy School',
  NULL, 10, FALSE
),
(
  'Dr. Meena Agarwal',
  (SELECT id FROM bod_roles WHERE role_key = 'expert_director'),
  'Expert Director (Animal Husbandry)',
  NULL,
  'Dr. Meena Agarwal is a veterinary scientist with 20 years of field experience in dairy animal health and productivity improvement. She has led cattle breed improvement programmes across UP and Bihar under the National Livestock Mission.',
  'BVSc & AH | M.VSc — IVRI, Izatnagar',
  '2022-06-15', 20, FALSE
),
(
  'Mr. Anand Prakash Verma',
  (SELECT id FROM bod_roles WHERE role_key = 'expert_director'),
  'Expert Director (Finance)',
  NULL,
  'Mr. Anand Prakash Verma is a Chartered Accountant with deep expertise in cooperative finance and rural lending. He advises multiple producer companies across India on financial structuring and governance, and was formerly associated with NABARD as a development consultant.',
  'CA | B.Com (Hons) — Delhi University',
  '2023-04-01', 30, FALSE
);

-- DIRECTORS (8)
INSERT INTO bod_members
  (full_name, role_id, designation, photo_url, bio, district, appointed_on, sort_order, is_chairman)
VALUES
(
  'Smt. Geeta Devi',
  (SELECT id FROM bod_roles WHERE role_key = 'director'),
  'Director',
  'https://www.kasheemilk.com/wp-content/uploads/2023/10/geetaDevi.jpg',
  'Smt. Geeta Devi is from Ballia, Uttar Pradesh. Her family occupation is animal husbandry. She was appointed to the Board on 18/09/2024.',
  'Ballia', '2024-09-18', 10, FALSE
),
(
  'Smt. Poonam Devi',
  (SELECT id FROM bod_roles WHERE role_key = 'director'),
  'Director',
  'https://www.kasheemilk.com/wp-content/uploads/2023/10/poonamDevi.jpg',
  'Smt. Poonam Devi is from Chandauli, Uttar Pradesh. Her family occupation is animal husbandry. She was appointed to the Board on 18/09/2024.',
  'Chandauli', '2024-09-18', 20, FALSE
),
(
  'Smt. Kiran Devi',
  (SELECT id FROM bod_roles WHERE role_key = 'director'),
  'Director',
  NULL,
  'Smt. Kiran Devi is from Ghazipur, Uttar Pradesh. She is an active member of her local self-help group and has been involved in dairy farming for over 8 years. She was appointed to the Board on 18/09/2024.',
  'Ghazipur', '2024-09-18', 30, FALSE
),
(
  'Smt. Sunita Yadav',
  (SELECT id FROM bod_roles WHERE role_key = 'director'),
  'Director',
  NULL,
  'Smt. Sunita Yadav hails from Mirzapur district. A second-generation dairy farmer, she oversees milk collection operations in her cluster and has been instrumental in improving procurement quality.',
  'Mirzapur', '2024-09-18', 40, FALSE
),
(
  'Smt. Rekha Bind',
  (SELECT id FROM bod_roles WHERE role_key = 'director'),
  'Director',
  NULL,
  'Smt. Rekha Bind represents the Sonbhadra cluster on the Board. She has been associated with the UPSRLM-supported SHG network since 2018 and plays a key role in member mobilisation and training.',
  'Sonbhadra', '2024-09-18', 50, FALSE
),
(
  'Smt. Usha Maurya',
  (SELECT id FROM bod_roles WHERE role_key = 'director'),
  'Director',
  NULL,
  'Smt. Usha Maurya is from Bhadohi district and has been an active participant in the dairy value chain since the company''s expansion into Bhadohi in 2024.',
  'Bhadohi', '2024-09-18', 60, FALSE
),
(
  'Smt. Lalita Singh',
  (SELECT id FROM bod_roles WHERE role_key = 'director'),
  'Director',
  NULL,
  'Smt. Lalita Singh is from Varanasi and has been a founding member of her village-level dairy cooperative. She leads awareness campaigns on cattle nutrition and milk hygiene.',
  'Varanasi', '2021-11-01', 70, FALSE
),
(
  'Smt. Shanti Devi',
  (SELECT id FROM bod_roles WHERE role_key = 'director'),
  'Director',
  NULL,
  'Smt. Shanti Devi is from the Chandauli cluster and joined the Board in its second term. She is known for organising women dairy farmers into structured procurement groups.',
  'Chandauli', '2023-09-18', 80, FALSE
);

-- INDEPENDENT DIRECTOR (1)
INSERT INTO bod_members
  (full_name, role_id, designation, photo_url, bio, qualification, appointed_on, sort_order, is_chairman)
VALUES (
  'Prof. Suresh Chandra Tripathi',
  (SELECT id FROM bod_roles WHERE role_key = 'independent'),
  'Independent Director',
  NULL,
  'Prof. Suresh Chandra Tripathi is a retired professor of Rural Management from BHU, Varanasi. He has served on the boards of several farmer producer organizations in UP and authored extensively on cooperative governance and dairy sector reforms.',
  'PhD Rural Management — BHU | MA Economics',
  '2022-03-01', 10, FALSE
);


-- ── 5. Verify ────────────────────────────────────────────────
SELECT
  r.role_label,
  r.sort_order  AS priority,
  COUNT(m.id)   AS members
FROM bod_roles r
LEFT JOIN bod_members m ON m.role_id = r.id AND m.is_active = TRUE
GROUP BY r.id, r.role_label, r.sort_order
ORDER BY r.sort_order;


-- ── 6. Triggers ──────────────────────────────────────────────
DROP TRIGGER IF EXISTS bod_members_updated_at ON bod_members;
CREATE TRIGGER bod_members_updated_at
  BEFORE UPDATE ON bod_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS page_heroes_updated_at ON page_heroes;
CREATE TRIGGER page_heroes_updated_at
  BEFORE UPDATE ON page_heroes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
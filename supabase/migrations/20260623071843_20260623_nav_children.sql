-- Navigation children items

-- Children — About Us
INSERT INTO nav_items (parent_id, label, href, description, sort_order)
SELECT p.id, c.lbl, c.lnk, c.txt, c.ord
FROM nav_items p
CROSS JOIN (VALUES
  ('Chairman''s Message', '/chairmans-message',  'Words from our leader',           1),
  ('Board of Directors',  '/board-of-directors', 'Meet the governing council',      2),
  ('Mission',             '/mission',            'What drives us forward',          3),
  ('Vision',              '/vision',             'Where we see ourselves',          4),
  ('Values',              '/values',             'Core principles we live by',      5),
  ('Milestone',           '/milestone',          'Key achievements over the years', 6)
) AS c(lbl, lnk, txt, ord)
WHERE p.label = 'About Us' AND p.parent_id IS NULL
ON CONFLICT DO NOTHING;

-- Children — Veterinary Services
INSERT INTO nav_items (parent_id, label, href, description, sort_order)
SELECT p.id, c.lbl, c.lnk, c.txt, c.ord
FROM nav_items p
CROSS JOIN (VALUES
  ('Animal Breeding Services',  '/animal-breeding-services',                   'AI & ET services',         1),
  ('Animal Nutrition Products', '/animal-nutrition-products',                  'Balanced feed solutions',  2),
  ('Animal Health Initiatives', '/animal-health-preventive-initiatives',       'Preventive care programs', 3),
  ('Pashu Sanjivani Seva',      '/kashee-pashu-sanjivani-seva-mobile-veterinary','Mobile vet services',    4),
  ('Trainings',                 '/trainings',                                  'Farmer education programs',5)
) AS c(lbl, lnk, txt, ord)
WHERE p.label = 'Veterinary Services' AND p.parent_id IS NULL
ON CONFLICT DO NOTHING;

-- Children — Business Opportunity
INSERT INTO nav_items (parent_id, label, href, description, sort_order)
SELECT p.id, c.lbl, c.lnk, c.txt, c.ord
FROM nav_items p
CROSS JOIN (VALUES
  ('Distributor Enquiry', '/distributor-enquiry', 'Become a distributor',       1),
  ('Vendor Enquiry',      '/vendor-enquiry',      'Empanel as a vendor',        2),
  ('Tenders',             '/tenders',             'Active procurement tenders', 3),
  ('Facilities',          '/facilities',          'Our infrastructure',         4)
) AS c(lbl, lnk, txt, ord)
WHERE p.label = 'Business Opportunity' AND p.parent_id IS NULL
ON CONFLICT DO NOTHING;

-- Children — Member Corner
INSERT INTO nav_items (parent_id, label, href, description, sort_order)
SELECT p.id, c.lbl, c.lnk, c.txt, c.ord
FROM nav_items p
CROSS JOIN (VALUES
  ('Kashee E-Dairy App',  '/kashee-e-dairy-app', 'Manage your dairy digitally', 1),
  ('Membership',          '/membership',          'Join the cooperative',        2),
  ('Annual Reports',      '/annual-reports',      'Financial disclosures',       3),
  ('Annual Returns',      '/annual-returns',      'MCA filings',                 4),
  ('Grievance Redressal', '/grievance-redressal', 'Raise a complaint',           5)
) AS c(lbl, lnk, txt, ord)
WHERE p.label = 'Member Corner' AND p.parent_id IS NULL
ON CONFLICT DO NOTHING;

-- Children — Media
INSERT INTO nav_items (parent_id, label, href, description, sort_order)
SELECT p.id, c.lbl, c.lnk, c.txt, c.ord
FROM nav_items p
CROSS JOIN (VALUES
  ('Latest News',    '/category/news-and-updates', 'Recent press releases', 1),
  ('Gallery',        '/gallery',                   'Photo & video gallery', 2),
  ('Events',         '/events',                    'Upcoming events',       3),
  ('Kashee in News', '/kashee-in-news',            'Media coverage',        4)
) AS c(lbl, lnk, txt, ord)
WHERE p.label = 'Media' AND p.parent_id IS NULL
ON CONFLICT DO NOTHING;

-- Children — Join Us
INSERT INTO nav_items (parent_id, label, href, description, sort_order)
SELECT p.id, c.lbl, c.lnk, c.txt, c.ord
FROM nav_items p
CROSS JOIN (VALUES
  ('Join Us',                '/join-us',                 'Be part of us',         1),
  ('Life@Kashee',            '/lifekashee',              'Culture & work-life',   2),
  ('Current Openings',       '/current-openings',        'Open positions',        3),
  ('Internship Opportunity', '/internship-opportunity',  'Student programs',      4)
) AS c(lbl, lnk, txt, ord)
WHERE p.label = 'Join Us' AND p.parent_id IS NULL
ON CONFLICT DO NOTHING;

-- 1. hero_slides table
CREATE TABLE public.hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  label TEXT NOT NULL,
  link_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.hero_slides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_slides TO authenticated;
GRANT ALL ON public.hero_slides TO service_role;

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published hero slides"
  ON public.hero_slides FOR SELECT
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage hero slides"
  ON public.hero_slides FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_hero_slides_updated_at BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 2. Seed hero slides using existing CDN assets
INSERT INTO public.hero_slides (image_url, label, link_url, sort_order) VALUES
  ('/__l5e/assets-v1/2e65447d-e5ac-4e48-b5b6-24440bf1119b/luxury-pool.jpg', 'Luxury Pool Tables', '/shop', 10),
  ('/__l5e/assets-v1/bf6cb3f2-2c00-405a-a528-35228a54cb2b/hero-pool-balls.jpg', 'Pro Ball Sets', '/shop', 20),
  ('/__l5e/assets-v1/7a29db30-28f3-4416-8fce-15b794336489/cues-accessories.webp', 'Premium Cues', '/shop', 30),
  ('/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg', 'Accessory Kits', '/shop', 40),
  ('/__l5e/assets-v1/ada2d4e6-4076-4f4f-8ed6-1e05df9c58a0/project-outdoor.jpg', 'Outdoor Tables', '/shop', 50),
  ('/__l5e/assets-v1/a540aa3f-6e35-4037-9a0b-3d072bf95cbb/project-led.jpg', 'LED Editions', '/shop', 60),
  ('/__l5e/assets-v1/cf9b6224-ec2e-4679-ac0c-d682b00b9aa5/silver-pool.jpg', 'Modern Silver', '/shop', 70),
  ('/__l5e/assets-v1/d72c7235-590e-4f72-958e-988664ead7b8/modern-black-pool.jpg', 'Statement Black', '/shop', 80);

-- 3. Add new categories
INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Board Games', 'board-games', 50),
  ('Sports Gear', 'sports-gear', 60)
ON CONFLICT (slug) DO NOTHING;

-- 4. Seed many more products
WITH cat AS (
  SELECT slug, id FROM public.categories
)
INSERT INTO public.products (slug, name, description, category_id, price_cents, image_url, stock, rating, badge, is_published, is_featured)
SELECT * FROM (VALUES
  -- Accessories
  ('pro-cue-9oz',            'Pro Maple Cue 19oz',           'Hand-crafted North-American maple two-piece cue with Irish linen wrap and Le Pro tip.',            (SELECT id FROM cat WHERE slug='accessories'), 12900,  '/__l5e/assets-v1/7a29db30-28f3-4416-8fce-15b794336489/cues-accessories.webp', 24, 4.8, 'Best seller', true,  true),
  ('carbon-break-cue',       'Carbon Fibre Break Cue',       'Reinforced carbon-fibre shaft for maximum energy transfer on the break.',                          (SELECT id FROM cat WHERE slug='accessories'), 24900,  '/__l5e/assets-v1/7a29db30-28f3-4416-8fce-15b794336489/cues-accessories.webp', 12, 4.9, 'New',         true,  true),
  ('aramith-tournament-set', 'Aramith Tournament Ball Set',  'Belgian phenolic resin balls — the tournament-grade standard.',                                    (SELECT id FROM cat WHERE slug='accessories'), 18900,  '/__l5e/assets-v1/bf6cb3f2-2c00-405a-a528-35228a54cb2b/hero-pool-balls.jpg',   40, 5.0, 'Pro',         true,  true),
  ('snooker-ball-set',       'Snooker Ball Set 22 Balls',    'Full-size snooker set, precision-balanced.',                                                       (SELECT id FROM cat WHERE slug='accessories'), 22900,  '/__l5e/assets-v1/bf6cb3f2-2c00-405a-a528-35228a54cb2b/hero-pool-balls.jpg',   18, 4.8, NULL,          true,  false),
  ('complete-accessory-kit', 'Complete Accessory Kit',       'Cues, rack, chalks, brush, bridge and gloves — everything in one boxed set.',                     (SELECT id FROM cat WHERE slug='accessories'), 34900,  '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   30, 4.9, 'Bundle',      true,  true),
  ('leather-billiards-glove','Leather Billiards Glove',      'Ventilated three-finger glove for smooth bridge control.',                                         (SELECT id FROM cat WHERE slug='accessories'),  2900,  '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   80, 4.7, NULL,          true,  false),
  ('master-chalk-cube-12',   'Master Chalk Cubes (12-pack)', 'Classic blue Master chalk — pro house standard.',                                                  (SELECT id FROM cat WHERE slug='accessories'),  1500,  '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',  150, 4.9, NULL,          true,  false),
  ('table-brush-hardwood',   'Hardwood Table Brush',         'Horsehair brush for daily cloth care.',                                                            (SELECT id FROM cat WHERE slug='accessories'),  2200,  '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   90, 4.6, NULL,          true,  false),
  ('triangle-rack-wood',     'Wooden Triangle Rack',         'Solid maple 8-ball rack, hand-finished.',                                                          (SELECT id FROM cat WHERE slug='accessories'),  1900,  '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',  120, 4.7, NULL,          true,  false),
  ('nine-ball-diamond-rack', '9-Ball Diamond Rack',          'Precision diamond rack for 9-ball games.',                                                         (SELECT id FROM cat WHERE slug='accessories'),  2100,  '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   60, 4.7, NULL,          true,  false),
  ('bridge-stick-brass',     'Brass Bridge Stick',           'Extendable bridge for hard-to-reach shots.',                                                       (SELECT id FROM cat WHERE slug='accessories'),  3400,  '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   45, 4.6, NULL,          true,  false),
  ('cue-wall-rack-8',        'Wall Cue Rack (8 slots)',      'Wall-mounted walnut cue rack with brass detail.',                                                  (SELECT id FROM cat WHERE slug='accessories'),  8900,  '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   25, 4.8, NULL,          true,  false),
  ('cue-case-hard-4x8',      'Hard-Shell Cue Case 4×8',      'Padded travel case for four butts and eight shafts.',                                              (SELECT id FROM cat WHERE slug='accessories'),  9900,  '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   20, 4.8, NULL,          true,  false),
  ('table-cover-heavy',      'Heavy-Duty Table Cover',       'Waterproof vinyl cover with elastic edges.',                                                       (SELECT id FROM cat WHERE slug='accessories'),  6900,  '/__l5e/assets-v1/2e65447d-e5ac-4e48-b5b6-24440bf1119b/luxury-pool.jpg',       55, 4.7, NULL,          true,  false),
  ('simonis-cloth-860',      'Simonis 860 Cloth (roll)',     'Championship-grade worsted cloth for tournament play.',                                            (SELECT id FROM cat WHERE slug='accessories'), 39900,  '/__l5e/assets-v1/2e65447d-e5ac-4e48-b5b6-24440bf1119b/luxury-pool.jpg',       15, 5.0, 'Pro',         true,  false),

  -- Board Games
  ('tournament-chess-set',   'Tournament Chess Set',         'Weighted Staunton pieces with folding walnut board.',                                              (SELECT id FROM cat WHERE slug='board-games'),  6900, '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   45, 4.9, 'New',         true,  true),
  ('luxury-ludo-board',      'Luxury Ludo Board',            'Family-size ludo board with wooden pawns and dice.',                                               (SELECT id FROM cat WHERE slug='board-games'),  3900, '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   60, 4.7, NULL,          true,  false),
  ('backgammon-leather',     'Leather Backgammon Set',       'Handmade leather case with felt playing field.',                                                   (SELECT id FROM cat WHERE slug='board-games'),  8900, '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   28, 4.8, NULL,          true,  false),
  ('monopoly-classic',       'Monopoly Classic Edition',     'The original property-trading board game.',                                                        (SELECT id FROM cat WHERE slug='board-games'),  4500, '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   50, 4.6, NULL,          true,  false),
  ('scrabble-deluxe',        'Scrabble Deluxe',              'Rotating wooden board with recessed tile grid.',                                                   (SELECT id FROM cat WHERE slug='board-games'),  5900, '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   35, 4.7, NULL,          true,  false),
  ('poker-chip-set-500',     '500-piece Poker Chip Set',     'Casino-weight clay chips in aluminium case with cards and dice.',                                  (SELECT id FROM cat WHERE slug='board-games'),  7900, '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   40, 4.8, 'Popular',     true,  true),
  ('domino-double-nine',     'Double-Nine Domino Set',       'Professional grade dominoes with wooden case.',                                                    (SELECT id FROM cat WHERE slug='board-games'),  3200, '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   70, 4.6, NULL,          true,  false),

  -- Sports Gear
  ('foosball-table-pro',     'Pro Foosball Table',           'Regulation-size foosball with counter-balanced players.',                                          (SELECT id FROM cat WHERE slug='sports-gear'), 129900, '/__l5e/assets-v1/d72c7235-590e-4f72-958e-988664ead7b8/modern-black-pool.jpg', 8,  4.8, NULL,          true,  true),
  ('air-hockey-table',       'Arcade Air Hockey Table',      '7-ft table with LED scoreboard and pro puck set.',                                                 (SELECT id FROM cat WHERE slug='sports-gear'),  99900, '/__l5e/assets-v1/a540aa3f-6e35-4037-9a0b-3d072bf95cbb/project-led.jpg',       6,  4.7, NULL,          true,  false),
  ('dart-board-cabinet',     'Bristle Dart Board & Cabinet', 'Tournament sisal board with walnut cabinet and 6 darts.',                                          (SELECT id FROM cat WHERE slug='sports-gear'),   9900, '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   35, 4.8, NULL,          true,  false),
  ('tennis-table-pro',       'Pro Table Tennis Table',       'Foldable indoor table with net and paddle set.',                                                   (SELECT id FROM cat WHERE slug='sports-gear'),  74900, '/__l5e/assets-v1/cf9b6224-ec2e-4679-ac0c-d682b00b9aa5/silver-pool.jpg',       10, 4.7, NULL,          true,  false),
  ('chess-clock-digital',    'Digital Chess Clock',          'Tournament-approved dual-display chess timer.',                                                    (SELECT id FROM cat WHERE slug='sports-gear'),   3900, '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg',   60, 4.7, NULL,          true,  false)
) AS t(slug, name, description, category_id, price_cents, image_url, stock, rating, badge, is_published, is_featured)
ON CONFLICT (slug) DO NOTHING;

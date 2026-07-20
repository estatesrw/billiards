
-- Site settings (singleton)
CREATE TABLE public.site_settings (
  id text PRIMARY KEY DEFAULT 'main',
  whatsapp_number text NOT NULL DEFAULT '250794506387',
  whatsapp_display text NOT NULL DEFAULT '+250 794 506 387',
  order_message_template text NOT NULL DEFAULT E'New order request #{order_id}\n\nName: {full_name}\nPhone: {phone}\nAddress: {address}, {city}\n\n{items}\n\nSubtotal: ${subtotal}\n\nNotes: {notes}',
  promo_text text NOT NULL DEFAULT 'Free Kigali delivery + 2‑year warranty on all tables.',
  promo_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
GRANT UPDATE, INSERT ON public.site_settings TO authenticated;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins insert settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tg_site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
INSERT INTO public.site_settings (id) VALUES ('main');

-- Testimonials
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author_name text NOT NULL,
  author_role text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published testimonials" ON public.testimonials FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tg_testimonials_updated BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- FAQs
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published faqs" ON public.faqs FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage faqs" ON public.faqs FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tg_faqs_updated BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Home projects (featured on homepage)
CREATE TABLE public.home_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  image_url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.home_projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.home_projects TO authenticated;
GRANT ALL ON public.home_projects TO service_role;
ALTER TABLE public.home_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published projects" ON public.home_projects FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage projects" ON public.home_projects FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tg_home_projects_updated BEFORE UPDATE ON public.home_projects FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Add featured flag to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

-- Seed testimonials
INSERT INTO public.testimonials (quote, author_name, author_role, sort_order) VALUES
('The most professional installation team I''ve worked with. The table is a work of art.', 'Jean Bosco', 'Owner, Amber Bar', 1),
('From sourcing to setup, seamless. Our members compliment the room every week.', 'Aline U.', 'Manager, Meridian Club', 2),
('Delivered on time, on budget — and refelted our old table like new.', 'Patrick M.', 'Kigali Grand Hotel', 3),
('The quality of the cloth work is on another level. Rolls perfectly true.', 'David K.', 'Private client', 4),
('They moved a 12-ft snooker table three floors up without a scratch.', 'Serena K.', 'Serena Lounge', 5),
('Best after-sales service in Rwanda. Response in under an hour every time.', 'Innocent H.', 'Green Hills Academy', 6);

-- Seed FAQs
INSERT INTO public.faqs (category, question, answer, sort_order) VALUES
('Prices','How much does a pool table cost?','Pool tables start at $3,200 for our Regal Pro line. Snooker tables begin at $4,600, and carom tables at $2,900. Custom builds are quoted individually.',1),
('Prices','Do you offer payment plans?','Yes — for orders above $2,000 we offer flexible 3–6 month installments with a signed agreement.',2),
('Delivery','Do you deliver across Rwanda?','Yes. Delivery within Kigali is included on all tables. Nationwide delivery is quoted based on distance.',3),
('Delivery','How long does delivery take?','In-stock items ship within 48 hours in Kigali. Custom orders take 3–6 weeks depending on the finish.',4),
('Warranty','What warranty do you offer?','All tables carry a 2-year manufacturer warranty on frame and slate, and a 1-year warranty on cloth and cushions.',5),
('Warranty','Are accessories covered?','Cues carry a 6-month warranty against manufacturing defects.',6),
('Installation','Do you install the table?','Yes. Every table is professionally installed by our certified team, including precision leveling.',7),
('Installation','Can you move an existing table?','Absolutely. We disassemble, transport and reinstall tables anywhere in Rwanda.',8),
('Payment methods','What payment methods do you accept?','MTN Mobile Money, Airtel Money, bank transfer, and cash on delivery for orders within Kigali.',9),
('Payment methods','Do you take card payments?','Card payments will be available soon through our online checkout.',10);

-- Seed home projects
INSERT INTO public.home_projects (name, category, image_url, sort_order) VALUES
('Kigali Grand Lounge','Hotel','https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80',1),
('Amber Speakeasy','Bar','https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=80',2),
('Meridian Private Club','Club','https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=1400&q=80',3);

-- Mark first 4 products featured
UPDATE public.products SET is_featured = true
WHERE id IN (SELECT id FROM public.products ORDER BY created_at ASC LIMIT 4);

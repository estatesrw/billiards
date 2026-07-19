
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  image_url TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published services" ON public.services FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage services" ON public.services FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  span TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published gallery" ON public.gallery_items FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage gallery" ON public.gallery_items FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER gallery_updated BEFORE UPDATE ON public.gallery_items FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.services (title, description, price_cents, image_url, icon, sort_order) VALUES
('Table Installation','Certified assembly, slate leveling and professional setup for pool, snooker and carom tables.',15000,'https://images.unsplash.com/photo-1591491634056-77ee42b7a8e2?auto=format&fit=crop&w=1600&q=80','Wrench',1),
('Table Moving','Insured relocation across Rwanda, with full disassembly, transport and reinstallation.',20000,'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80','Truck',2),
('Table Repair','Cushion replacement, rail work, pocket repair and full structural restoration.',12000,'https://images.unsplash.com/photo-1580139053954-8b1c81c07d02?auto=format&fit=crop&w=1600&q=80','Hammer',3),
('Cloth Replacement','Simonis and Strachan championship cloth, expertly fitted for a true, fast roll.',35000,'https://images.unsplash.com/photo-1615394073837-3f2f4a4b6863?auto=format&fit=crop&w=1600&q=80','Scissors',4),
('Maintenance','Annual service plans covering brushing, re-leveling and cushion checks.',8000,'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=1600&q=80','Sparkles',5);

INSERT INTO public.gallery_items (image_url, caption, span, sort_order) VALUES
('https://images.unsplash.com/photo-1626251438758-e9e320f30c22?auto=format&fit=crop&w=1600&q=80','Signature Regal Pro','row-span-2',1),
('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80','Hotel installation','',2),
('https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=1600&q=80','Pool table detail','',3),
('https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1600&q=80','Private lounge','col-span-2',4),
('https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80','Amber Speakeasy','row-span-2',5),
('https://images.unsplash.com/photo-1615394073837-3f2f4a4b6863?auto=format&fit=crop&w=1600&q=80','Cloth work','',6),
('https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=1600&q=80','Snooker room','',7),
('https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=1600&q=80','Maintenance service','',8),
('https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1600&q=80','Meridian Club','col-span-2',9),
('https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&w=1600&q=80','Carom heritage','',10);

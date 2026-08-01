INSERT INTO public.products (slug, name, description, category_id, price_cents, currency, image_url, stock, rating, badge, is_published, is_featured) VALUES
('elite-white-pro','Elite White Pro 8ft','Modern white cabinet with black championship cloth. Slate bed, precision cushions.', '8583cb5e-0ee5-4178-a083-dbeb2a802dd3', 285000, 'USD', '/__l5e/assets-v1/7e7056b0-2957-44e5-bd94-6c9615dfd2dd/table-white-black.webp', 5, 4.9, 'New', true, true),
('heritage-snooker-classic','Heritage Snooker Classic','Restored hardwood snooker table with tapered legs, leather pockets and green baize.', '0c7eab58-0934-4d7b-804c-6fa19bc2ff83', 420000, 'USD', '/__l5e/assets-v1/6d334628-497c-497b-bd7d-2b0ef4ccf334/table-antique-snooker.webp', 2, 5.0, 'Heritage', true, true),
('oakline-green-7ft','Oakline Green 7ft','Warm oak finish with classic green cloth — ideal for homes and lounges.', '8583cb5e-0ee5-4178-a083-dbeb2a802dd3', 195000, 'USD', '/__l5e/assets-v1/4548863a-6631-4c27-b9e7-d696e3da1ff0/table-oak-green.webp', 8, 4.8, NULL, true, true),
('gold-fusion-coin-op','Gold Fusion Coin-Op','Statement gold-graphic cabinet with red cloth and coin mechanism for venues.', '8583cb5e-0ee5-4178-a083-dbeb2a802dd3', 240000, 'USD', '/__l5e/assets-v1/eba1eedd-fb09-489a-8699-6f5ffb465876/table-gold-red.webp', 4, 4.7, 'Venue', true, true),
('obsidian-purple-pro','Obsidian Purple Pro','Textured black cabinet, chrome rails and purple tournament cloth.', '8583cb5e-0ee5-4178-a083-dbeb2a802dd3', 310000, 'USD', '/__l5e/assets-v1/bbddba02-60bf-4b14-8fac-6eb68117e3af/table-black-purple.webp', 3, 4.9, 'Pro', true, true),
('cue-and-chill-arcade-blue','Cue & Chill Arcade Blue','Bright blue cloth with custom centre print — built for bars and game rooms.', '8583cb5e-0ee5-4178-a083-dbeb2a802dd3', 260000, 'USD', '/__l5e/assets-v1/0006db3a-6a6b-47b1-8dc6-7585aa8a3d80/table-blue-arcade.webp', 4, 4.8, NULL, true, true),
('velocity-red-coin-op','Velocity Red Coin-Op','Sport-graphic white and red cabinet with coin-op ball return.', '8583cb5e-0ee5-4178-a083-dbeb2a802dd3', 230000, 'USD', '/__l5e/assets-v1/c2993c41-65b5-4b10-a4f7-b21c778bbf60/table-white-red.webp', 6, 4.7, 'Popular', true, true)
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url, is_published = true, is_featured = true;

DELETE FROM public.hero_slides;
INSERT INTO public.hero_slides (image_url, label, link_url, sort_order, is_published) VALUES
('/__l5e/assets-v1/7e7056b0-2957-44e5-bd94-6c9615dfd2dd/table-white-black.webp','Elite White Pro','/shop/elite-white-pro',1,true),
('/__l5e/assets-v1/6d334628-497c-497b-bd7d-2b0ef4ccf334/table-antique-snooker.webp','Heritage Snooker','/shop/heritage-snooker-classic',2,true),
('/__l5e/assets-v1/4548863a-6631-4c27-b9e7-d696e3da1ff0/table-oak-green.webp','Oakline Green 7ft','/shop/oakline-green-7ft',3,true),
('/__l5e/assets-v1/eba1eedd-fb09-489a-8699-6f5ffb465876/table-gold-red.webp','Gold Fusion','/shop/gold-fusion-coin-op',4,true),
('/__l5e/assets-v1/bbddba02-60bf-4b14-8fac-6eb68117e3af/table-black-purple.webp','Obsidian Purple Pro','/shop/obsidian-purple-pro',5,true),
('/__l5e/assets-v1/0006db3a-6a6b-47b1-8dc6-7585aa8a3d80/table-blue-arcade.webp','Cue & Chill Blue','/shop/cue-and-chill-arcade-blue',6,true),
('/__l5e/assets-v1/c2993c41-65b5-4b10-a4f7-b21c778bbf60/table-white-red.webp','Velocity Red','/shop/velocity-red-coin-op',7,true);

CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
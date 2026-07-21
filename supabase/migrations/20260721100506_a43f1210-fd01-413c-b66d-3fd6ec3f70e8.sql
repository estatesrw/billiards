
-- Update product images to use uploaded assets
UPDATE public.products SET image_url = '/__l5e/assets-v1/2e65447d-e5ac-4e48-b5b6-24440bf1119b/luxury-pool.jpg' WHERE name = 'Regal Pro Pool Table 8ft';
UPDATE public.products SET image_url = '/__l5e/assets-v1/d72c7235-590e-4f72-958e-988664ead7b8/modern-black-pool.jpg' WHERE name = 'Monarch Slate Pool 9ft';
UPDATE public.products SET image_url = '/__l5e/assets-v1/cf9b6224-ec2e-4679-ac0c-d682b00b9aa5/silver-pool.jpg' WHERE name = 'Oxford Snooker 10ft';
UPDATE public.products SET image_url = '/__l5e/assets-v1/bf6cb3f2-2c00-405a-a528-35228a54cb2b/hero-pool-balls.jpg' WHERE name = 'Windsor Snooker 12ft';
UPDATE public.products SET image_url = '/__l5e/assets-v1/7a29db30-28f3-4416-8fce-15b794336489/cues-accessories.webp' WHERE name = 'Carom Heritage';
UPDATE public.products SET image_url = '/__l5e/assets-v1/7a29db30-28f3-4416-8fce-15b794336489/cues-accessories.webp' WHERE name = 'Elite Cue Set + Case';
UPDATE public.products SET image_url = '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg' WHERE name = 'Aramith Premier Balls';
UPDATE public.products SET image_url = '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg' WHERE name = 'Brass Pendant Light 3-lamp';

-- Update home projects
UPDATE public.home_projects SET image_url = '/__l5e/assets-v1/ada2d4e6-4076-4f4f-8ed6-1e05df9c58a0/project-outdoor.jpg' WHERE name = 'Kigali Grand Lounge';
UPDATE public.home_projects SET image_url = '/__l5e/assets-v1/a540aa3f-6e35-4037-9a0b-3d072bf95cbb/project-led.jpg' WHERE name = 'Amber Speakeasy';
UPDATE public.home_projects SET image_url = '/__l5e/assets-v1/cf9b6224-ec2e-4679-ac0c-d682b00b9aa5/silver-pool.jpg' WHERE name = 'Meridian Private Club';

-- Update gallery items - cycle through all 8 uploaded assets
UPDATE public.gallery_items SET image_url = '/__l5e/assets-v1/bf6cb3f2-2c00-405a-a528-35228a54cb2b/hero-pool-balls.jpg' WHERE caption = 'Signature Regal Pro';
UPDATE public.gallery_items SET image_url = '/__l5e/assets-v1/ada2d4e6-4076-4f4f-8ed6-1e05df9c58a0/project-outdoor.jpg' WHERE caption = 'Hotel installation';
UPDATE public.gallery_items SET image_url = '/__l5e/assets-v1/2e65447d-e5ac-4e48-b5b6-24440bf1119b/luxury-pool.jpg' WHERE caption = 'Pool table detail';
UPDATE public.gallery_items SET image_url = '/__l5e/assets-v1/d72c7235-590e-4f72-958e-988664ead7b8/modern-black-pool.jpg' WHERE caption = 'Private lounge';
UPDATE public.gallery_items SET image_url = '/__l5e/assets-v1/a540aa3f-6e35-4037-9a0b-3d072bf95cbb/project-led.jpg' WHERE caption = 'Amber Speakeasy';
UPDATE public.gallery_items SET image_url = '/__l5e/assets-v1/7a29db30-28f3-4416-8fce-15b794336489/cues-accessories.webp' WHERE caption = 'Cloth work';
UPDATE public.gallery_items SET image_url = '/__l5e/assets-v1/cf9b6224-ec2e-4679-ac0c-d682b00b9aa5/silver-pool.jpg' WHERE caption = 'Snooker room';
UPDATE public.gallery_items SET image_url = '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg' WHERE caption = 'Maintenance service';
UPDATE public.gallery_items SET image_url = '/__l5e/assets-v1/ada2d4e6-4076-4f4f-8ed6-1e05df9c58a0/project-outdoor.jpg' WHERE caption = 'Meridian Club';
UPDATE public.gallery_items SET image_url = '/__l5e/assets-v1/7a29db30-28f3-4416-8fce-15b794336489/cues-accessories.webp' WHERE caption = 'Carom heritage';

-- Update services images
UPDATE public.services SET image_url = '/__l5e/assets-v1/2e65447d-e5ac-4e48-b5b6-24440bf1119b/luxury-pool.jpg' WHERE title = 'Table Installation';
UPDATE public.services SET image_url = '/__l5e/assets-v1/ada2d4e6-4076-4f4f-8ed6-1e05df9c58a0/project-outdoor.jpg' WHERE title = 'Table Moving';
UPDATE public.services SET image_url = '/__l5e/assets-v1/d72c7235-590e-4f72-958e-988664ead7b8/modern-black-pool.jpg' WHERE title = 'Table Repair';
UPDATE public.services SET image_url = '/__l5e/assets-v1/b2f47241-a824-4f43-abdf-ccacda5d11b7/accessories-kit.jpg' WHERE title = 'Maintenance';
UPDATE public.services SET image_url = '/__l5e/assets-v1/7a29db30-28f3-4416-8fce-15b794336489/cues-accessories.webp' WHERE title = 'clothing change';

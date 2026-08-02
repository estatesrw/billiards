UPDATE public.site_settings
SET whatsapp_number = '250793735430',
    whatsapp_display = '+250 793 735 430',
    promo_enabled = false,
    updated_at = now()
WHERE id = 'main';

ALTER TABLE public.orders ALTER COLUMN currency SET DEFAULT 'RWF';
ALTER TABLE public.products ALTER COLUMN currency SET DEFAULT 'RWF';
ALTER TABLE public.services ALTER COLUMN currency SET DEFAULT 'RWF';
UPDATE public.products SET currency = 'RWF' WHERE currency = 'USD';
UPDATE public.services SET currency = 'RWF' WHERE currency = 'USD';
UPDATE public.site_settings
SET order_message_template = replace(order_message_template, 'Subtotal: ${subtotal}', 'Subtotal: {subtotal}'),
    updated_at = now();

ALTER TABLE public.site_settings
  ALTER COLUMN order_message_template SET DEFAULT 'New order request #{order_id}

Name: {full_name}
Phone: {phone}
Address: {address}, {city}

{items}

Subtotal: {subtotal}

Notes: {notes}';

ALTER TABLE public.site_settings ALTER COLUMN whatsapp_number SET DEFAULT '250793735430';
ALTER TABLE public.site_settings ALTER COLUMN whatsapp_display SET DEFAULT '+250 793 735 430';
-- Adds WhatsApp contact details to existing installations. The previous
-- instagram column is intentionally retained so old inquiry data is not lost.
alter table public.inquiries add column if not exists whatsapp text;
alter table public.inquiries
add column start_time time,
add column end_time time;
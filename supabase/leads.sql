-- Modul 9: kontaktformularen gemmer henvendelser (leads).
-- Kør denne fil i Supabase → SQL Editor → Run.

-- Spam-værn: afvis tomme eller alt for lange felter.
alter table leads
  add constraint leads_name_length check (char_length(name) between 1 and 100),
  add constraint leads_phone_length check (char_length(phone) between 6 and 30),
  add constraint leads_message_length check (char_length(message) <= 2000);

-- Alle må sende en henvendelse, men kun om en udgivet bolig.
-- De må IKKE læse henvendelser (der er ingen "select"-regel for dem).
create policy "Alle kan sende henvendelser" on leads
  for insert to anon, authenticated
  with check (
    property_id in (select id from properties where status = 'published')
  );

-- Kun admin må læse henvendelserne (bruges i /admin/leads).
create policy "Admin kan se henvendelser" on leads
  for select
  using (exists (select 1 from admins where user_id = auth.uid()));

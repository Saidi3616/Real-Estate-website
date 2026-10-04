-- Modul 8: admin må se og ændre alle boliger.
-- Kør denne fil i Supabase → SQL Editor → Run,
-- EFTER du har oprettet din admin-bruger (Authentication → Users → Add user).

-- Listen over admins. Kun brugere i denne tabel må ændre boliger,
-- så en tilfældig bruger, der logger ind, kan ikke gøre noget.
create table admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table admins enable row level security;
create policy "Admin kan se sig selv" on admins
  for select using (user_id = auth.uid());

-- Gør alle brugere, der findes nu, til admin (dvs. kun dig).
insert into admins (user_id) select id from auth.users;

-- Admin må se alle boliger (også kladder) og oprette, rette og slette dem.
create policy "Admin kan alt med boliger" on properties
  for all
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));

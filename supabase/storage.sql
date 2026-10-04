-- Modul 8 trin 3: mappe til boligbilleder.
-- Kør denne fil i Supabase → SQL Editor → Run (efter admin.sql).

-- Opret mappen. "public = true" betyder, at alle må se billederne.
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true);

-- Kun admin må lægge billeder op.
create policy "Admin kan uploade boligbilleder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'property-images'
    and exists (select 1 from public.admins where user_id = auth.uid())
  );

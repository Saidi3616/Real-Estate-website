-- Modul 2: tabeller fra SPEC.md (afsnit 7).
-- Kør denne fil først i Supabase → SQL Editor → Run.

-- Faste valgmuligheder (enum = en liste over tilladte værdier)
create type listing_type as enum ('sale', 'rent');
create type property_type as enum ('apartment', 'villa', 'riad', 'house', 'land', 'commercial');
create type rent_period as enum ('month', 'day');
create type property_status as enum ('draft', 'published', 'sold', 'rented');

-- Mæglere
create table agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  phone text,
  whatsapp text,
  email text,
  photo text
);

-- Boliger
create table properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_fr text not null,
  title_ar text not null,
  title_en text not null,
  description_fr text,
  description_ar text,
  description_en text,
  listing_type listing_type not null,
  property_type property_type not null,
  price integer not null check (price >= 0),
  rent_period rent_period,
  city text not null,
  neighborhood text,
  latitude double precision,
  longitude double precision,
  area_m2 integer,
  bedrooms integer,
  bathrooms integer,
  floor integer,
  features text[] not null default '{}',
  images text[] not null default '{}',
  agent_id uuid references agents (id),
  status property_status not null default 'draft',
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Henvendelser (leads)
create table leads (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties (id) on delete set null,
  name text not null,
  phone text not null,
  message text,
  created_at timestamptz not null default now()
);

-- Sikkerhed (RLS): alt er lukket, medmindre en regel åbner det.
alter table agents enable row level security;
alter table properties enable row level security;
alter table leads enable row level security;

-- Besøgende må se udgivne boliger og mæglerne.
create policy "Alle kan se udgivne boliger" on properties
  for select using (status = 'published');
create policy "Alle kan se mæglere" on agents
  for select using (true);
-- Leads: ingen regler endnu. Kontaktformularen (SPEC trin 10) åbner for at indsætte.

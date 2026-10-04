-- Modul 4 trin 2 (valgfri): giver 3 testboliger flere billeder, så galleriet kan testes.
-- Kør i Supabase → SQL Editor → Run. Ændrer kun data, ikke tabellerne.

update properties set images = array[
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200'
] where slug = 'villa-anfa-casablanca';

update properties set images = array[
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'
] where slug = 'appartement-maarif-casablanca';

update properties set images = array[
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200'
] where slug = 'riad-medina-marrakech';

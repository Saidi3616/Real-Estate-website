-- Modul 2: 1 testmægler + 10 testboliger.
-- Kør denne fil efter schema.sql i Supabase → SQL Editor → Run.

insert into agents (id, name, company, phone, whatsapp, email) values
  ('11111111-1111-1111-1111-111111111111', 'Youssef Benali', 'Atlas Immobilier',
   '+212 600 000 000', '+212600000000', 'contact@example.com');

insert into properties (slug, title_fr, title_ar, title_en, description_fr, description_ar, description_en,
  listing_type, property_type, price, rent_period, city, neighborhood, latitude, longitude,
  area_m2, bedrooms, bathrooms, floor, features, images, agent_id, status, is_featured) values

('appartement-maarif-casablanca',
 'Appartement lumineux à Maârif', 'شقة مشرقة في المعاريف', 'Bright apartment in Maarif',
 'Bel appartement de 3 chambres, proche des commerces et du tramway.', 'شقة جميلة من 3 غرف نوم، قريبة من المحلات والترامواي.', 'Nice 3-bedroom apartment close to shops and the tram.',
 'sale', 'apartment', 1250000, null, 'Casablanca', 'Maârif', 33.585, -7.632,
 110, 3, 2, 4, '{elevator,parking,balcony}',
 '{https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200}',
 '11111111-1111-1111-1111-111111111111', 'published', true),

('villa-anfa-casablanca',
 'Villa avec piscine à Anfa', 'فيلا مع مسبح في أنفا', 'Villa with pool in Anfa',
 'Villa moderne avec jardin, piscine et garage.', 'فيلا عصرية مع حديقة ومسبح ومرآب.', 'Modern villa with garden, pool and garage.',
 'sale', 'villa', 8500000, null, 'Casablanca', 'Anfa', 33.592, -7.665,
 450, 5, 4, null, '{pool,parking,garden,terrace}',
 '{https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200}',
 '11111111-1111-1111-1111-111111111111', 'published', true),

('appartement-agdal-rabat-location',
 'Appartement meublé à Agdal', 'شقة مفروشة في أكدال', 'Furnished apartment in Agdal',
 'Appartement meublé de 2 chambres, idéal pour étudiants ou jeunes couples.', 'شقة مفروشة من غرفتين، مثالية للطلبة أو الأزواج الشباب.', 'Furnished 2-bedroom apartment, ideal for students or young couples.',
 'rent', 'apartment', 7000, 'month', 'Rabat', 'Agdal', 34.000, -6.850,
 80, 2, 1, 2, '{furnished,elevator}',
 '{https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200}',
 '11111111-1111-1111-1111-111111111111', 'published', false),

('maison-hay-riad-rabat',
 'Maison familiale à Hay Riad', 'منزل عائلي في حي الرياض', 'Family house in Hay Riad',
 'Maison de 4 chambres dans un quartier calme.', 'منزل من 4 غرف نوم في حي هادئ.', '4-bedroom house in a quiet neighborhood.',
 'sale', 'house', 3200000, null, 'Rabat', 'Hay Riad', 33.960, -6.870,
 220, 4, 3, null, '{parking,garden,terrace}',
 '{https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200}',
 '11111111-1111-1111-1111-111111111111', 'published', false),

('riad-medina-marrakech',
 'Riad traditionnel dans la médina', 'رياض تقليدي في المدينة القديمة', 'Traditional riad in the medina',
 'Riad rénové avec patio, fontaine et terrasse sur le toit.', 'رياض مرمم مع فناء ونافورة وسطح.', 'Renovated riad with patio, fountain and rooftop terrace.',
 'sale', 'riad', 4500000, null, 'Marrakech', 'Médina', 31.630, -7.990,
 300, 6, 6, null, '{terrace,furnished,pool}',
 '{https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200}',
 '11111111-1111-1111-1111-111111111111', 'published', true),

('villa-palmeraie-marrakech-vacances',
 'Villa de vacances à la Palmeraie', 'فيلا للعطلات في النخيل', 'Holiday villa in the Palmeraie',
 'Villa avec piscine privée, louée à la nuit.', 'فيلا مع مسبح خاص، للكراء بالليلة.', 'Villa with private pool, rented per night.',
 'rent', 'villa', 3500, 'day', 'Marrakech', 'Palmeraie', 31.670, -7.960,
 350, 4, 4, null, '{pool,furnished,garden,parking}',
 '{https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200}',
 '11111111-1111-1111-1111-111111111111', 'published', false),

('appartement-vue-mer-tanger',
 'Appartement vue mer à Malabata', 'شقة مطلة على البحر في ملاباطا', 'Sea view apartment in Malabata',
 'Appartement neuf avec vue sur la mer et résidence sécurisée.', 'شقة جديدة مطلة على البحر في إقامة محروسة.', 'New apartment with sea view in a gated residence.',
 'sale', 'apartment', 1800000, null, 'Tanger', 'Malabata', 35.775, -5.780,
 120, 3, 2, 6, '{sea_view,elevator,parking,pool}',
 '{https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200}',
 '11111111-1111-1111-1111-111111111111', 'published', true),

('local-commercial-centre-tanger',
 'Local commercial au centre-ville', 'محل تجاري في وسط المدينة', 'Commercial space downtown',
 'Local de 90 m² sur une rue passante, idéal pour boutique ou bureau.', 'محل من 90 م² في شارع حيوي، مثالي لمتجر أو مكتب.', '90 m² unit on a busy street, ideal for a shop or office.',
 'rent', 'commercial', 15000, 'month', 'Tanger', 'Centre-ville', 35.770, -5.810,
 90, 0, 1, 0, '{}',
 '{https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200}',
 '11111111-1111-1111-1111-111111111111', 'published', false),

('appartement-front-de-mer-agadir',
 'Appartement front de mer', 'شقة على الواجهة البحرية', 'Seafront apartment',
 'Appartement meublé à deux pas de la plage.', 'شقة مفروشة على بعد خطوات من الشاطئ.', 'Furnished apartment steps from the beach.',
 'rent', 'apartment', 9000, 'month', 'Agadir', 'Founty', 30.400, -9.590,
 95, 2, 2, 3, '{sea_view,furnished,elevator,pool}',
 '{https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200}',
 '11111111-1111-1111-1111-111111111111', 'published', false),

('terrain-constructible-agadir',
 'Terrain constructible à Tikiouine', 'أرض صالحة للبناء في تيكيوين', 'Building plot in Tikiouine',
 'Terrain titré de 500 m², prêt à construire.', 'أرض محفظة من 500 م²، جاهزة للبناء.', 'Titled 500 m² plot, ready to build.',
 'sale', 'land', 900000, null, 'Agadir', 'Tikiouine', 30.390, -9.530,
 500, 0, 0, null, '{}',
 '{https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200}',
 '11111111-1111-1111-1111-111111111111', 'published', false);

# SPEC.md – Ejendomsmægler-hjemmeside for Marokko

> Arbejdstitel: **[NAVN]** (fx "Dari", "Sakan", "Bayt.ma" – tjek ledigt domæne)
> Version: 0.1 (udkast) · Ejer: Abdeslam
> Status: ⚠️ Punkter mærket **[BESLUT]** skal afklares før vi bygger.

---

## 1. Vision

En moderne, hurtig og mobilvenlig boligportal for Marokko, hvor folk nemt kan finde boliger til salg og leje, og kontakte mægleren direkte via WhatsApp eller telefon.

**Kerneløfte:** "Find din næste bolig i Marokko på under 1 minut – på dit eget sprog."

---

## 2. Målgrupper

| Gruppe | Behov |
|---|---|
| Marokkanere, der køber/lejer lokalt | Hurtig søgning, priser i MAD, kontakt via WhatsApp |
| Marokkanere i udlandet (MRE – fx i DK, FR, BE, NL) | Købe bolig/investering "hjemme", se gode billeder og info på afstand |
| Mæglere / ejendomsfirmaer | Vise deres boliger og få henvendelser (leads) |
| Admin (dig) | Godkende annoncer, styre indhold |

---

## 3. Sprog og lokalisering

- **Sprog:** Fransk (standard), arabisk, engelsk. **[BESLUT]** Skal darija eller dansk med?
- **Arabisk = højre-til-venstre (RTL).** Hele layoutet skal kunne spejles.
- **URL-struktur:** `/fr/...`, `/ar/...`, `/en/...`
- **Valuta:** MAD (dirham). Format: `1 250 000 MAD`. Evt. vis omregning til EUR som ekstra.
- **Areal:** m²
- **Telefonformat:** +212 …

---

## 4. MVP-funktioner (version 1)

Det absolut nødvendige for at gå live. Alt andet venter.

### 4.1 Offentlig del
1. **Forside** – stor søgebar (by + salg/leje + type), udvalgte boliger, populære byer.
2. **Søgeside / boligliste** med filtre:
   - Salg / leje
   - By og kvarter
   - Boligtype: lejlighed, villa, riad, hus, grund, erhverv
   - Pris (min–maks)
   - Antal værelser
   - Areal (min–maks)
   - Sortering: nyeste, pris stigende/faldende
3. **Boligside (detalje)**:
   - Billedgalleri (swipe på mobil)
   - Pris, areal, værelser, badeværelser, etage
   - Beskrivelse
   - Faciliteter (pool, parkering, elevator, terrasse, møbleret, havudsigt …)
   - Kort med omtrentlig placering
   - **Kontaktknapper: WhatsApp, Ring, Formular**
   - Mæglerens navn/firma
4. **Kontaktformular** (navn, telefon, besked) → sendes til mægler + gemmes i databasen.
5. **Om os / Kontakt-side.**

### 4.2 Admin-del
6. **Login for admin** (kun dig i MVP).
7. **Opret / rediger / slet bolig** inkl. upload af billeder.
8. **Se henvendelser (leads).**

**[BESLUT]** Skal mæglere selv kunne logge ind og oprette annoncer i MVP, eller kun admin? *(Anbefaling: kun admin i v1 – meget simplere.)*

---

## 5. Senere (IKKE i MVP)

- Mægler-konti med egne dashboards
- Betalte "fremhævede" annoncer
- Favoritter og gemte søgninger for brugere
- E-mail-/WhatsApp-alarmer ved nye boliger
- Boliglånsberegner
- Ny-byggeri-projekter (projekter med mange enheder)
- Mobil-app

---

## 6. Sider (sitemap)

```
/[lang]                     Forside
/[lang]/search              Søgning / liste
/[lang]/property/[slug]     Boligside
/[lang]/city/[city]         Byside (SEO), fx /fr/city/casablanca
/[lang]/about               Om os
/[lang]/contact             Kontakt
/admin                      Admin-login
/admin/properties           Liste over boliger
/admin/properties/new       Opret bolig
/admin/properties/[id]      Rediger bolig
/admin/leads                Henvendelser
```

---

## 7. Datamodel

### Property (bolig)
| Felt | Type | Note |
|---|---|---|
| id | uuid | |
| slug | text | til pæn URL |
| title_fr / title_ar / title_en | text | |
| description_fr / _ar / _en | text | |
| listing_type | enum | `sale`, `rent` |
| property_type | enum | `apartment`, `villa`, `riad`, `house`, `land`, `commercial` |
| price | integer | i MAD |
| rent_period | enum, valgfri | `month`, `day` (ferieudlejning) |
| city | text | |
| neighborhood | text | |
| latitude / longitude | number | omtrentlig |
| area_m2 | integer | |
| bedrooms | integer | |
| bathrooms | integer | |
| floor | integer, valgfri | |
| features | text[] | pool, parking, elevator, … |
| images | text[] | URL'er, første = forsidebillede |
| agent_id | uuid | |
| status | enum | `draft`, `published`, `sold`, `rented` |
| is_featured | boolean | vises på forsiden |
| created_at / updated_at | timestamp | |

### Agent (mægler)
| Felt | Type |
|---|---|
| id | uuid |
| name | text |
| company | text |
| phone | text |
| whatsapp | text |
| email | text |
| photo | text |

### Lead (henvendelse)
| Felt | Type |
|---|---|
| id | uuid |
| property_id | uuid |
| name | text |
| phone | text |
| message | text |
| created_at | timestamp |

---

## 8. Tech stack (anbefalet)

| Del | Valg | Hvorfor |
|---|---|---|
| Framework | **Next.js** (App Router) + TypeScript | Godt til SEO, AI kender det rigtig godt |
| Styling | **Tailwind CSS** | Hurtigt, understøtter RTL |
| Sprog | **next-intl** | Fransk/arabisk/engelsk + RTL |
| Database + login + billeder | **Supabase** | Alt-i-én, gratis at starte |
| Kort | **Leaflet + OpenStreetMap** | Gratis (ingen Google-regning) |
| Hosting | **Vercel** | Gratis at starte, kobler direkte til GitHub |
| Kode | **GitHub** | Versionsstyring – så vi altid kan rulle tilbage |

**[BESLUT]** Domæne: `.ma`-domæne (troværdigt lokalt) eller `.com`?

---

## 9. Design

- **Mobile first** – de fleste i Marokko bruger mobil.
- Stil: moderne, lyst, rent. Diskrete marokkanske detaljer (fx zellige-mønster som accent, terrakotta/sand/dyb grøn som farver).
- Store billeder – billederne sælger boligen.
- Tydelig grøn WhatsApp-knap altid synlig på boligsiden.
- **[BESLUT]** Farver og logo.

---

## 10. Krav til kvalitet

- **Hastighed:** Siden skal loade hurtigt på 4G. Billeder komprimeres automatisk.
- **SEO:** Hver bolig og by har egen titel/beskrivelse på alle sprog. Sitemap.xml.
- **Sikkerhed:** Kun admin kan oprette/redigere. Hemmelige nøgler ligger i miljøvariabler, aldrig i koden.
- **Spam-beskyttelse** på kontaktformularen.
- **Privatliv:** Vis kun omtrentlig placering på kortet, ikke præcis adresse.

---

## 11. Byggeplan (trin for trin)

Hvert trin skal virke og committes til GitHub, før vi går videre.

1. Opsæt projekt: Next.js + Tailwind + GitHub + Vercel. "Hello world" live.
2. Sprog-opsætning (fr/ar/en) + RTL virker.
3. Supabase: opret tabeller fra datamodellen + indsæt 10 testboliger.
4. Boligliste med kort (cards).
5. Boligside med galleri + WhatsApp-knap.
6. Søgefiltre.
7. Forside.
8. Kort (Leaflet).
9. Admin-login + opret/rediger bolig + billedupload.
10. Kontaktformular + leads.
11. SEO (metadata, sitemap, bysider).
12. Test på mobil, rettelser → **lancering**.

---

## 12. Regler for AI-assistenten

- Jeg er vibecoder uden kodebaggrund: forklar kort og i almindeligt sprog.
- Byg **ét trin ad gangen**, og sig præcis hvilke filer der ændres.
- Giv altid komplette filer, ikke halve stumper.
- Fortæl mig, hvordan jeg tester, at trinnet virker.
- Følg denne SPEC. Hvis noget skal ændres, så foreslå det først.
- Ingen nye pakker/værktøjer uden at forklare hvorfor.

---

## 13. Åbne beslutninger (opsamling)

- [ ] Navn og domæne (.ma eller .com)
- [ ] Sprog: også darija? dansk?
- [ ] Salg, leje eller begge?
- [ ] Ferieudlejning (per dag) med i MVP?
- [ ] Kun admin opretter annoncer, eller også mæglere?
- [ ] Hvilke byer først? (fx Casablanca, Rabat, Marrakech, Tanger, Agadir)
- [ ] Forretningsmodel: provision, betalte annoncer, eller eget mæglerfirma?
- [ ] Farver og logo

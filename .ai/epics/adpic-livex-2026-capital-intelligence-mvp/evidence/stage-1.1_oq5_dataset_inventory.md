# Stage 1.1 — WORK-OQ-5 Dataset Inventory (demo-dataset basis)

**Basis (owner-approved 2026-09-04):** a controlled exhibition/demo dataset is permitted rather than
waiting for every internal ADPIC dataset. Preferred hierarchy: (1) official Abu Dhabi/UAE public/open
data where permitted → (2) other appropriately-licensed public geospatial data → (3) deterministically
derived from approved/public sources → (4) clearly-labeled SYNTHETIC/DEMO for what is unavailable/unapproved.

**Provenance classification is MANDATORY per dataset/field:** `OFFICIAL/PUBLIC` · `DERIVED` · `SYNTHETIC/DEMO`.
The swap of temporary demo data for approved internal ADPIC data must NOT require architecture/UI redesign.

**Verification rule (owner):** public accessibility ≠ unrestricted offline redistribution. Licensing,
provenance, freshness, and freeze/export feasibility are being verified, not assumed.

---

## Verified source: AD-SDI OpenData (this session, anonymous REST probes)
- Service: `https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer`
  — **HTTP 200 anonymous**, 216 layers, `capabilities: Query,Map,Data`, `maxRecordCount 2000`,
  query formats **JSON / geoJSON / PBF** (⇒ technically exportable/freezable). `copyrightText` empty.
- **Layers confirmed present & relevant:** Public Schools (211, **212 features**), Private Schools (212),
  Charter Schools (208), Nurseries (209), Clinics/health Facilities (350/328); RoadCenterline (101) +
  full road network (edge/surface/intersection); Administrative Boundaries (0), Community (2, polygons
  w/ `COMMUNITYNAMEENG/ARA`, `DISTRICTNAMEENG`), Districts (4), Municipality (6); Building (353);
  Land Use (12).
- **AOI coverage verified:** Khalifa City envelope → **5 public schools**; Community layer returns named
  polygons incl. **"AL REEM EAST ISLAND"**. (Al Reem public-school count in a first envelope came back
  empty — to re-check with the exact community polygon during data prep; Al Reem is the Explore opening,
  not the simulate spine, so this is non-critical.)
- Bilingual fields present (`SCH_NAME_EN/AR`, `COMMUNITYNAMEENG/ARA`) ⇒ supports Arabic-ready architecture.
- ⚠️ **LICENSING/redistribution: PENDING verification** (empty `copyrightText`; AD-SDI open-data terms
  being confirmed by research). Do NOT assume offline redistribution is permitted until confirmed.

## Verified: Esri 3D Buildings (prior spike)
- Public, tokenless, CORS-open for CONNECTED use. Al Reem strong cinematic massing. Offline clip/re-host
  = `DEP-ESRI-OFFLINE-LICENSE` UNRESOLVED. Own-built extruded footprints (from AD-SDI Building 353 /
  Overture) are the offline floor needing no Esri permission.

## Licensing / redistribution — VERIFIED (research, 2026-09-04)
- **AD-SDI OpenData** (`.../agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer`, ArcGIS Server
  10.91, tokenless): governing terms are the **Abu Dhabi Open Data Platform license** (data.abudhabi,
  "UAE Federal Open Data License") — **reuse, modification, redistribution & commercial use permitted
  WITH ATTRIBUTION**, excludes logos/trademarks, non-misrepresentation. Districts layer confirms
  **`KHALIFA CITY` and `AL REEM ISLAND`** by name. Export = geoJSON per-layer `query` (no server Extract;
  bulk layers need pagination/envelope-clip, maxRecordCount 2000). **Districts `POPULATION` is NULL → use
  SCAD for population.** ⚠️ **Residual condition:** the license is NOT machine-attached to the OpenData
  service; get a **one-line written confirmation from ADDA/AD-SDI** that this service may be extracted +
  bundled offline before the exhibition build.
- **SCAD** (population): Census 2023 / 2024 estimate; published at **region/district** granularity
  (community-level population not confirmed). Delivery is **tabular (CSV/Excel), not spatial** → join to
  AD-SDI district geometry by name/ID. Open Data Policy exists; ⚠️ **confirm the SCAD license PDF** permits
  offline bundling. Community-grain demand for the simulator will likely be a **DERIVED** disaggregation
  of district population → labeled derived/synthetic, never "official ADPIC population analysis".
- **OpenStreetMap** = **ODbL 1.0**: offline bundling OK; **attribution "© OpenStreetMap contributors"**;
  share-alike binds the shipped DATA extract (keep it ODbL), NOT the app UI. Good roads/buildings; school
  POI completeness unverified → AD-SDI schools remain authoritative.
- **Overture** = buildings/transportation/divisions **ODbL**, places **CDLA-Permissive**: offline-
  redistributable with attribution ("© OpenStreetMap contributors, Overture Maps Foundation"); GeoJSON
  export clipped to bbox via CLI — ideal for the two AOIs / the extruded-footprint floor.
- **Attribution obligation (build task):** the app must show "© OpenStreetMap contributors" (if OSM/
  Overture ODbL data ships), Overture attribution, and AD-SDI/SCAD attribution. Track as a UI requirement.

---

## Per-dataset record (D1–D7)

### D1 — Khalifa City portfolio — **SYNTHETIC/DEMO** (owner-directed)
1. Source: curated by us (owner: do NOT reconstruct an official portfolio from unofficial sources).
2. Availability: to be authored. 3. Structure: point/polygon projects + WORK-DATA-4..22 attributes.
4. Completeness: sized for a strong responsive MVP (**NOT 219**). 5. Suitability: high — drives Explore/
Evaluate. 6. Approval: n/a (synthetic; not official). 7. Sanitization: n/a (born sanitized). 8. Missing: n/a.
9. Synthetic replacement: **YES — `IS_DEMO=true`**, explicitly demo. 10. Freezable: yes; swap-ready to real
internal data without redesign.

### D2 — Al Reem Island portfolio — **SYNTHETIC/DEMO** (owner-directed)
1. Source: curated by us. 2. Availability: to be authored. 3. Structure: as D1. 4. Completeness: showcase
set (**NOT 139**) for the cinematic opening. 5. Suitability: high (Explore hero). 6. Approval: n/a. 7.
Sanitization: n/a. 8. Missing: n/a. 9. Synthetic replacement: **YES — `IS_DEMO`**. 10. Freezable: yes.

### D3 — AOI boundaries — **OFFICIAL/PUBLIC** (AD-SDI)
1. Source: AD-SDI Districts(4)/Community(2)/Administrative Boundaries(0). 2. Availability: **CONFIRMED
own-verified** — Districts layer 4 field `NAMEENGLISH` contains **"KHALIFA CITY"** and **"AL REEM ISLAND"**.
3. Structure: polygons, WGS84, bilingual (`NAMEENGLISH`/`NAMEARABIC`). 4. Completeness: both AOIs present.
5. Suitability: high (AOI framing, clip extent). 6. Approval: UAE/Abu Dhabi open-data license (attribution)
— pending written confirmation (C1). 7. Sanitization: none (public boundaries). 8. Missing: none material.
9. Synthetic replacement: no. 10. Freezable: yes (geoJSON), subject to C1.

### D4 — Population / demand — **OFFICIAL/PUBLIC (SCAD district) → DERIVED (community grain)**
1. Source: SCAD Census 2023 / 2024 est. (AD-SDI Districts `POPULATION` is NULL). 2. Availability: district
totals available (tabular CSV/Excel). 3. Structure: tabular, join to AD-SDI district geometry by name/ID.
4. Completeness: district grain (community grain not confirmed). 5. Suitability: good as demand base.
6. Approval: SCAD Open Data Policy — pending license confirmation (C2). 7. Sanitization: n/a (aggregate).
8. Missing: sub-district spatial demand → produced by **deterministic disaggregation = DERIVED**, labeled,
**explicitly NOT official ADPIC population analysis**. 9. Synthetic replacement: partial (community demand
model, `IS_DEMO`). 10. Freezable: yes.

### D5 — Existing facilities (esp. schools) — **OFFICIAL/PUBLIC** (AD-SDI)
1. Source: AD-SDI Public/Private/Charter Schools + Nurseries + Clinics. 2. Availability: **CONFIRMED** —
212 public schools; **5 own-verified in Khalifa City envelope**. 3. Structure: points, WGS84, rich bilingual
attrs (name, curriculum, gender, grades, cycle, plot). 4. Completeness: high for schools; Al Reem public-
school count to re-check with exact polygon. 5. Suitability: high — real schools anchor the sim context.
6. Approval: open-data license (attribution) — pending C1. 7. Sanitization: minimal (public facility data).
8. Missing: none material for the story. 9. Synthetic replacement: no. 10. Freezable: yes (geoJSON), sub. C1.

### D6 — Roads / network / service-area inputs — **OFFICIAL/PUBLIC (roads) → DERIVED (service areas)**
1. Source: AD-SDI RoadCenterline(101) + network layers. 2. Availability: **CONFIRMED** present. 3. Structure:
polylines, WGS84. 4. Completeness: full emirate network (AOI-clip). 5. Suitability: high — basis for
deterministic service areas. 6. Approval: open-data license (attribution) — pending C1. 7. Sanitization:
none. 8. Missing: none material. 9. Synthetic replacement: no for roads; **service-area polygons are DERIVED
(precomputed, baked into snapshot)** — live routing off critical path. 10. Freezable: yes.

### D7 — Strategic-theme mapping / assessment inputs — **SYNTHETIC/DEMO** (exhibition-only)
1. Source: authored exhibition-only attributes + deterministic rules. 2. Availability: to be authored.
3. Structure: per-project theme/indicator fields feeding the scoring engine. 4. Completeness: as needed for
the assessment story. 5. Suitability: high (Evaluate). 6. Approval: under decision-support disclaimer
(WORK-BR-15); methodology approver = OQ-3 (OPEN). 7. Sanitization: n/a. 8. Missing: n/a. 9. Synthetic
replacement: **YES — `IS_DEMO`**, deterministic + reproducible (WORK-BR-3). 10. Freezable: yes.

---

## School-simulation substitute determination
- Real anchors available OFFICIAL/PUBLIC: existing schools (D5), road network (D6), AOI/community
  boundaries (D3), building footprints (Building 353). Khalifa City has real schools + network + boundaries
  ⇒ the **Evaluate + Simulate spine is buildable on official/public + derived data**.
- The **proposed** school is hypothetical/demo by design (WORK-DEC-2, BR-14). Service areas + underserved/
  accessibility deltas are `DERIVED` (deterministic, precomputed) from official inputs.
- **Population/demand** is the one likely-synthetic input (D4) — permitted as a labeled derived/synthetic
  demand model, never represented as official ADPIC analysis. ⇒ credible non-misrepresenting substitutes
  ARE possible; no fabricated "official" data required.

## Snapshot-freeze feasibility — YES, with conditions
Technically confirmed: AD-SDI geoJSON export (paginated/envelope-clipped), SCAD tabular join, OSM/Overture
GeoJSON export; synthetic/derived layers are ours to freeze. Licenses permit offline redistribution WITH
ATTRIBUTION (Abu Dhabi/UAE open-data license; ODbL for OSM/Overture data extracts). **Conditions:**
(1) one-line written ADDA/AD-SDI confirmation the OpenData service may be extracted+bundled offline;
(2) confirm the SCAD Open Data Policy license; (3) implement required attributions in the UI.

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
Owner: do NOT reconstruct an alleged official portfolio from unofficial sources. Build a curated
synthetic/sanitized exhibition portfolio, geographically/functionally credible, explicitly demo, sized
for a strong responsive MVP (NOT 219). `IS_DEMO=true`. Freezable: yes. Swap-ready to real internal data.

### D2 — Al Reem Island portfolio — **SYNTHETIC/DEMO** (owner-directed)
Same as D1; NOT 139. Curated synthetic showcase portfolio for the cinematic Explore opening. Freezable: yes.

### D3 — AOI boundaries — **OFFICIAL/PUBLIC** (AD-SDI), licensing PENDING
Source: AD-SDI Community(2)/Districts(4)/Administrative Boundaries(0). Structure: polygons, WGS84,
bilingual names. Completeness: AOIs present (Reem confirmed; exact Khalifa City community to be selected).
Suitability: high. Sanitization: none (public boundaries). Missing: none material. Synthetic: no.
Freezable: yes (geoJSON export) **subject to license confirmation**.

### D4 — Population / demand — **OFFICIAL/PUBLIC (SCAD district totals) → DERIVED (community-grain demand)**
SCAD publishes population at region/district grain (Census 2023 / 2024 est.), tabular (CSV/Excel), joined
to AD-SDI district geometry by name/ID. The finer spatial demand grain the simulator needs is produced by
**deterministic disaggregation** of official district totals = **DERIVED**, labeled, **explicitly NOT
official ADPIC population analysis** (owner, WORK); `IS_DEMO` where synthetic. Freezable: yes. Condition:
confirm SCAD license permits offline bundling.

### D5 — Existing facilities (esp. schools) — **OFFICIAL/PUBLIC** (AD-SDI), licensing PENDING
Source: AD-SDI Public/Private/Charter Schools + Nurseries + Clinics. 212 public schools; 5 in Khalifa
envelope. Rich attributes (curriculum, gender, grades, cycle, plot). Suitability: high — real schools
anchor the deterministic school-simulation context. Sanitization: minimal (public facility data).
Synthetic: no. Freezable: yes (geoJSON) **subject to license confirmation**.

### D6 — Roads / network / service-area inputs — **OFFICIAL/PUBLIC (roads)** → **DERIVED (service areas)**
Source: AD-SDI RoadCenterline(101) + network layers. Approach: precompute service-area/accessibility
deterministically from the official network and **bake results into the frozen snapshot** (owner-approved;
live routing off critical path). Service-area polygons are `DERIVED`. Freezable: yes.

### D7 — Strategic-theme mapping / assessment inputs — **SYNTHETIC/DEMO** (exhibition-only)
Owner: synthetic exhibition-only project attributes + deterministic rules acceptable where approved
internal methodology/data is unavailable, under the decision-support disclaimer (WORK-BR-15). `IS_DEMO`.
Deterministic + reproducible (WORK-BR-3). Freezable: yes.

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

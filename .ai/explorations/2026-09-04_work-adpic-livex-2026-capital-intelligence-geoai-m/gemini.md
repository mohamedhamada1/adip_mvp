# Gemini Review — Gatekeeper

### 1. Critique of Architect’s Assumptions
*   **The "Cinematic" Performance Paradox:** The architect assumes a "premium dark cinematic" experience can be delivered via a standard React + ArcGIS JS SDK stack on unknown exhibition hardware. ArcGIS JS is robust but often lacks the post-processing/lighting control of a game engine (Unreal/Unity). Achieving "cinematic" quality while handling 200+ project geometries and 3D buildings in a browser is a high-risk performance assumption.
*   **The "Deterministic AI" Oxymoron:** The proposal leans heavily on "AI explains" while enforcing "deterministic templates." If the explanation is just a lookup table of pre-written strings, calling it "AI" to a LIVEX audience is borderline deceptive and risks a "Wizard of Oz" failure if the presenter deviates from the script.
*   **Connectivity Optimism:** Despite mentioning a "frozen dataset," the reliance on Esri 3D Building layers (`b8fec5af7dfe4866b1b8ac2d2800f282`) implies a live internet dependency. Exhibition halls are notorious for DNS failures and throttled bandwidth.

### 2. Risks & Blind Spots
*   **The "Uncanny Valley" of Data:** Using real AOIs (Khalifa/Reem) with "hypothetical" school scenarios and "exhibition-only" scoring rules creates a massive risk of misinformation. If a stakeholder sees a "Low" investment score for a real project, the "exhibition-only" disclaimer (WORK-BR-15) may not prevent reputational damage.
*   **Hardware Latency:** Large touchscreens often have high input latency. A 3D SceneView that lags during a 60-second high-pressure demo will make the "future-facing" tech look antiquated.
*   **The "Ask ADPIC AI" Scope Creep:** Even as a "cross-cutting layer," an open-ended chat interface (even if templated) is a magnet for edge-case failures. If it's not a 4th module, it must be strictly constrained to the current map view, or it will break the 90-second flow.

### 3. Overengineering or Missing Considerations
*   **Overengineering:** Building an "Arabic-ready architecture" for a 90-second English-only demo is unnecessary overhead for an MVP that will likely be rebuilt or discarded after the event.
*   **Missing:** **State Management for the "Journey":** There is no mention of a "Demo State Machine." To hit a 60-90s window, the app needs a one-way state controller that handles transitions between "Understand," "Evaluate," and "Simulate" to prevent the presenter from getting lost in the UI.
*   **Missing:** **Local Asset Fallback:** There is no explicit requirement for a local Tile Package (TPKX) or Scene Layer Package (SLPK) to mitigate the "High" risk of network failure (WORK-RISK-3).

### 4. Verdict
**CONDITIONAL GO**

### 5. Conditions
1.  **Network Independence:** The "frozen dataset" must include a local-first strategy for 3D buildings (SLPK) or a verified offline-capable proxy. Relying on live ArcGIS Online IDs during the demo is a NO-GO.
2.  **The "Kill Switch" UI:** A hidden or physical toggle must exist to instantly switch between "Live LLM" and "Deterministic Template" modes without a page reload.
3.  **Hardware Benchmarking:** A performance "smoke test" must be conducted on the actual (or spec-equivalent) exhibition touchscreen by the end of the technical spike.
4.  **Methodology Watermark:** Every screen displaying a "Low/Medium/High" score must have a persistent, non-dismissible watermark stating: *"Exhibition Simulation: Not for Official Decision Making."*
5.  **Data Sanity Check:** A formal sign-off on the "219/139" project counts is required. Displaying incorrect project counts in a "Capital Intelligence" tool undermines the "Intelligence" claim immediately.
  Tokens: 3696 in / 892 out / 4588 total

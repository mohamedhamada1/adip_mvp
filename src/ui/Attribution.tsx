import { AOI_BOUNDARIES } from "../data/aoiBoundaries";
import { KHALIFA_GEOGRAPHY } from "../data/khalifaBoundaryRoads";

/**
 * Data attribution — visible from the first Explore render (condition C3). Names the open-data
 * sources whose data ships in the experience. Demo/portfolio content is synthetic (no attribution
 * needed); boundaries are AD-SDI (attribution required).
 */
export function Attribution() {
  const sources = [
    KHALIFA_GEOGRAPHY.attribution ?? AOI_BOUNDARIES.khalifa.attribution ?? "",
    "3D buildings © Esri, TomTom, Vantor, Esri Community Maps, Overture Maps Foundation",
    "Projects shown are synthetic demonstration data (not official ADPIC records)",
  ].filter(Boolean);
  return (
    <div
      style={{
        fontSize: "11px",
        color: "var(--text-2)",
        padding: "4px var(--space-3)",
        lineHeight: 1.4,
      }}
    >
      {sources.map((s, i) => (
        <span key={i} style={{ marginRight: "var(--space-2)" }}>
          {s}
          {i < sources.length - 1 ? " ·" : ""}
        </span>
      ))}
    </div>
  );
}

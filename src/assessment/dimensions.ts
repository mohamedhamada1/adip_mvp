// Assessment dimensions (WORK-BR-4). Each has a role: contribution (raises priority) or penalty (lowers it).
export type DimensionKey =
  | "communityNeed"
  | "strategicAlignment"
  | "spatialServiceGap"
  | "accessibilityBenefit"
  | "duplication"
  | "infrastructureDependency"
  | "deliveryComplexity";

export type DimensionRole = "contribution" | "penalty";

export interface DimensionMeta {
  key: DimensionKey;
  label: string;
  role: DimensionRole;
}

export const DIMENSIONS: DimensionMeta[] = [
  { key: "communityNeed", label: "Community Need", role: "contribution" },
  { key: "strategicAlignment", label: "Strategic Alignment", role: "contribution" },
  { key: "spatialServiceGap", label: "Spatial Service Gap", role: "contribution" },
  { key: "accessibilityBenefit", label: "Accessibility Benefit", role: "contribution" },
  { key: "duplication", label: "Existing Project Duplication", role: "penalty" },
  { key: "infrastructureDependency", label: "Infrastructure Dependency", role: "penalty" },
  { key: "deliveryComplexity", label: "Delivery Complexity", role: "penalty" },
];

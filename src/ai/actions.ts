// Fixed ALLOWLIST of actions an Ask-AI / template answer may trigger. No open autonomous behavior
// (WORK-REQ-18/19): answers may only request one of these, and callers reject anything else.
export type AllowlistedAction =
  | { kind: "focus-project"; projectId: string }
  | { kind: "show-underserved" }
  | { kind: "open-assessment" }
  | { kind: "open-simulator" };

export const ALLOWLISTED_ACTION_KINDS = [
  "focus-project",
  "show-underserved",
  "open-assessment",
  "open-simulator",
] as const;

export function isAllowlistedAction(a: { kind?: string } | null | undefined): a is AllowlistedAction {
  return !!a && (ALLOWLISTED_ACTION_KINDS as readonly string[]).includes(a.kind ?? "");
}

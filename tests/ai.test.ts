import { describe, it, expect, vi } from "vitest";
import { assembleContext, sanitizeContext, type AiContext } from "../src/ai/context";
import { answerQuestion, ABSENT_INFO_MESSAGE, suggestedQuestions } from "../src/ai/templates";
import { NullLlmAdapter, explainViaAdapter, type LlmAdapter } from "../src/ai/llmAdapter";
import type { AiAnswer } from "../src/ai/templates";
import { projectsForAoi } from "../src/data/portfolio.demo";
import { scoreProject } from "../src/assessment/scoringEngine";

const project = projectsForAoi("khalifa")[0];
const assessment = scoreProject(project);
const ctx = assembleContext("khalifa", project, assessment);

describe("assembleContext — AC-2", () => {
  it("assembles project + approved attributes + indicators + strategy", () => {
    expect(ctx.projectName).toBe(project.nameEn);
    expect(ctx.approvedAttributes.sector).toBe(project.sector);
    expect(ctx.indicators?.length).toBeGreaterThan(0);
    expect(ctx.overallPriority).toBe(assessment.overall);
  });
});

describe("sanitizeContext + adapter boundary — AC-7", () => {
  it("drops non-approved fields; the adapter never receives them", () => {
    const dirty: AiContext = { ...ctx, approvedAttributes: { ...ctx.approvedAttributes, confidentialOwnerName: "SECRET", internalCost: 999 } };
    const clean = sanitizeContext(dirty);
    expect(clean.approvedAttributes.confidentialOwnerName).toBeUndefined(); // NEGATIVE CONTROL
    expect(clean.approvedAttributes.internalCost).toBeUndefined();
    expect(clean.approvedAttributes.sector).toBe(project.sector);

    let received: AiContext | null = null;
    const spyAdapter: LlmAdapter = { kind: "spy", explain: vi.fn((c: AiContext): AiAnswer => { received = c; return { text: "ok", action: { kind: "open-assessment" }, sourced: true }; }) };
    explainViaAdapter(spyAdapter, dirty);
    expect((received as unknown as AiContext).approvedAttributes.confidentialOwnerName).toBeUndefined();
  });

  it("strips a non-allowlisted action returned by an adapter", () => {
    const rogue: LlmAdapter = { kind: "rogue", explain: () => ({ text: "x", action: { kind: "delete-everything" } as never, sourced: true }) };
    expect(explainViaAdapter(rogue, ctx).action).toBeUndefined(); // NEGATIVE CONTROL
  });

  it("NullLlmAdapter answers with templates and no network", () => {
    expect(explainViaAdapter(NullLlmAdapter, ctx).text.length).toBeGreaterThan(0);
  });
});

describe("templates — AC-3 determinism + AC-4 absent-info honesty", () => {
  it("is deterministic (same id+context → same answer)", () => {
    expect(answerQuestion("why-priority", ctx)).toEqual(answerQuestion("why-priority", ctx));
  });
  it("states 'not in the demo dataset' for absent info (never invents)", () => {
    const a = answerQuestion("contractor", ctx);
    expect(a.sourced).toBe(false);
    expect(a.text).toBe(ABSENT_INFO_MESSAGE);
  });
  it("offers suggested questions (favored over open chat)", () => {
    expect(suggestedQuestions(ctx).length).toBeGreaterThanOrEqual(1);
  });
});

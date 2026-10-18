import test from "node:test";
import assert from "node:assert/strict";
import { SAFE_BENCHMARKS } from "../src/lib/benchmarks/safe-clauses.ts";
import { ContractAuditorWorkflow } from "../src/lib/mastra/workflows/contract-auditor.ts";

const auditor = new ContractAuditorWorkflow();

test("SAFE_BENCHMARKS integrity", () => {
  assert.ok(Array.isArray(SAFE_BENCHMARKS), "SAFE_BENCHMARKS should be an array");
  assert.ok(SAFE_BENCHMARKS.length >= 5, "Should have at least 5 benchmark categories");

  for (const b of SAFE_BENCHMARKS) {
    assert.ok(b.id, "Benchmark must have an id");
    assert.ok(b.category, "Benchmark must have a category");
    assert.ok(b.title, "Benchmark must have a title");
    assert.ok(Array.isArray(b.redFlagTriggers) && b.redFlagTriggers.length > 0, "Benchmark must have red flag triggers");
    assert.ok(b.safeTemplate && b.safeTemplate.length > 10, "Benchmark must have a safe template");
  }
});

test("ContractAuditor: audits predatory contract and flags high-risk clauses", async () => {
  const predatorySOW = `
SECTION 1. PAYMENT TERMS: Client shall issue payment on Net-90 day terms upon final acceptance.
SECTION 2. INTELLECTUAL PROPERTY: Contractor irrevocably assigns all right, title, and pre-existing code to Client.
SECTION 3. INDEMNIFICATION: Contractor agrees to defend, indemnify, and hold harmless Client against any and all claims, without limitation.
SECTION 4. NON-COMPETE: Contractor agrees not to perform services for any competing firm worldwide for 24 months.
`;

  const result = await auditor.execute(predatorySOW);

  assert.ok(result, "Result should be defined");
  assert.ok(typeof result.overallScore === "number", "overallScore should be a number");
  assert.ok(result.overallScore >= 0 && result.overallScore <= 100, "overallScore must be between 0 and 100");
  assert.ok(result.overallScore <= 50, `Predatory contract should score <= 50, got ${result.overallScore}`);
  assert.strictEqual(result.overallRiskLevel, "CRITICAL", "Risk level should be CRITICAL");

  assert.ok(Array.isArray(result.clauses), "clauses should be an array");
  assert.ok(result.clauses.length >= 3, "Should detect at least 3 clauses");

  // Check that critical clauses have redlines
  const criticalClauses = result.clauses.filter((c) => c.riskLevel === "CRITICAL" || c.riskLevel === "HIGH");
  assert.ok(criticalClauses.length >= 2, "Should flag multiple high-risk clauses");

  for (const c of criticalClauses) {
    assert.ok(c.redlineSuggestion && c.redlineSuggestion.length > 5, "Flagged clause must have redlineSuggestion");
    assert.ok(c.explanation && c.explanation.length > 5, "Flagged clause must have an explanation");
  }

  // Voice script
  assert.ok(typeof result.voiceBriefScript === "string", "voiceBriefScript should be a string");
  assert.ok(result.voiceBriefScript.includes(String(result.overallScore)), "Voice script should include score");
});

test("ContractAuditor: audits safe standard agreement with high safety score", async () => {
  const safeAgreement = `
1. Payment: Invoices are payable within 30 days of receipt (Net-30). A reasonable late fee of 1% applies to overdue balances.
2. Intellectual Property: Contractor grants Client an exclusive license to the deliverables upon receipt of full payment. Contractor retains all rights to pre-existing background tools and boilerplate code.
3. Liability: Each party's aggregate liability shall be limited to the total compensation paid or payable under this Agreement.
`;

  const result = await auditor.execute(safeAgreement);

  assert.ok(result.overallScore >= 70, `Safe contract should score >= 70, got ${result.overallScore}`);
  assert.ok(result.overallRiskLevel === "LOW" || result.overallRiskLevel === "MEDIUM", "Risk level should be LOW or MEDIUM");
});

test("ContractAuditor: handles unstructured paragraphs gracefully without section headers", async () => {
  const unstructuredContract = `
This is a consulting engagement between Freelancer and Client.
Client agrees to compensate Freelancer at the agreed milestone rates upon invoice approval within twenty business days.

Both parties agree that all confidential information exchanged shall be kept strictly secret and not disclosed to any unauthorized third parties for a period of one year.

Any dispute arising under this agreement shall be submitted to mutual mediation before initiating formal arbitration.
`;

  const result = await auditor.execute(unstructuredContract);

  assert.ok(result.clauses.length >= 1, "Should split unstructured text into clauses");
  assert.ok(result.processingTimeMs >= 0, "Should measure processing time");
  assert.ok(result.summary.length > 10, "Should produce summary text");
});

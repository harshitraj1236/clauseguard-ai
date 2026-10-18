import { ContractAuditorWorkflow } from "../src/lib/mastra/workflows/contract-auditor.ts";

const auditor = new ContractAuditorWorkflow();

const TEST_VECTORS = [
  {
    name: "Predatory SOW (High Risk)",
    text: `
SECTION 1. PAYMENT TERMS: Client shall issue payment on Net-90 day terms upon final acceptance. Client reserves the right to withhold payments at sole discretion.
SECTION 2. INTELLECTUAL PROPERTY: Contractor irrevocably assigns all right, title, pre-existing tools, scripts, and libraries to Client. Contractor waives all moral rights.
SECTION 3. INDEMNIFICATION: Contractor agrees to defend, solely indemnify, and hold harmless Client against any and all claims, without limitation.
SECTION 4. NON-COMPETE: Contractor agrees not to perform services for any competing firm worldwide for 24 months post termination.
`,
  },
  {
    name: "Standard NDA & Agreement (Safe)",
    text: `
1. Payment: Invoices are payable within thirty (30) days of invoice date (Net-30). A 1.5% late fee per month applies to overdue balances.
2. Intellectual Property: Contractor assigns deliverables upon full receipt of payment. Contractor expressly retains all rights to pre-existing libraries and starter toolkits.
3. Liability: Each party's total aggregate liability shall be strictly capped at the total fees paid under this Agreement.
4. Confidentiality: Both parties agree to protect proprietary information for a period of two years.
`,
  },
  {
    name: "Unstructured Contract Note",
    text: `
Freelancer and Studio agree to complete the frontend dashboard within four weeks.
Payment is due on Net-15 terms upon delivery of completed milestone assets.
Neither party shall be liable for indirect or consequential damages.
`,
  },
];

async function runBenchmark() {
  console.log("=================================================");
  console.log("   CLAUSEGUARD AI — SYSTEM PERFORMANCE BENCHMARK  ");
  console.log("=================================================\n");

  const results = [];

  for (const vector of TEST_VECTORS) {
    const start = performance.now();
    const result = await auditor.execute(vector.text);
    const duration = performance.now() - start;

    results.push({
      vector: vector.name,
      score: `${result.overallScore}/100`,
      risk: result.overallRiskLevel,
      clauses: result.clauses.length,
      critical: result.clauses.filter((c) => c.riskLevel === "CRITICAL").length,
      high: result.clauses.filter((c) => c.riskLevel === "HIGH").length,
      latency: `${duration.toFixed(2)}ms`,
    });
  }

  console.table(results);
  console.log("✔ Benchmark completed successfully across all test vectors.\n");
}

runBenchmark().catch((err) => {
  console.error("Benchmark error:", err);
  process.exit(1);
});

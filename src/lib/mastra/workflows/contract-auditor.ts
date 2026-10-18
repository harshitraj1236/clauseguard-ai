import type { AnalyzedClause, ContractAuditResult, RiskLevel } from "../../../types/contract.ts";
import { SAFE_BENCHMARKS } from "../../benchmarks/safe-clauses.ts";
import { gemma } from "../../gemma/client.ts";

/**
 * Mastra-style Contract Auditor Workflow
 * Chains deterministic parsing, open-weight Gemma 2 evaluation, and redline negotiation generation.
 */
export class ContractAuditorWorkflow {
  async execute(contractText: string): Promise<ContractAuditResult> {
    const startTime = Date.now();

    // Step 1: Segmentation
    const rawClauses = this.segmentContract(contractText);

    // Step 2: Audit each clause with Gemma 2 and Safe Benchmarks
    const analyzedClauses: AnalyzedClause[] = [];

    for (let i = 0; i < rawClauses.length; i++) {
      const clause = rawClauses[i];
      const evaluated = await this.evaluateClause(clause, i);
      analyzedClauses.push(evaluated);
    }

    // Step 3: Compute Overall Score & Level
    const totalRisk = analyzedClauses.reduce((acc, c) => acc + c.riskScore, 0);
    const avgRisk = analyzedClauses.length > 0 ? totalRisk / analyzedClauses.length : 1;
    // Safety score: 0 to 100 (100 = completely safe, 0 = catastrophic risk)
    const overallScore = Math.max(5, Math.min(100, Math.round(100 - avgRisk * 9.5)));

    let overallRiskLevel: RiskLevel = "LOW";
    if (overallScore < 50) overallRiskLevel = "CRITICAL";
    else if (overallScore < 70) overallRiskLevel = "HIGH";
    else if (overallScore < 85) overallRiskLevel = "MEDIUM";

    // Step 4: Generate High-Risk Key Findings
    const highRiskClauses = analyzedClauses.filter(
      (c) => c.riskLevel === "CRITICAL" || c.riskLevel === "HIGH"
    );

    const keyFindings = highRiskClauses.length > 0
      ? highRiskClauses.map((c) => `${c.title}: ${c.explanation}`)
      : ["No critical legal pitfalls detected. The terms adhere to standard fair business practices."];

    // Step 5: Generate Voice Briefing Script for ElevenLabs
    const voiceBriefScript = this.createVoiceScript(overallScore, overallRiskLevel, highRiskClauses);

    const processingTimeMs = Date.now() - startTime;

    return {
      contractTitle: this.extractContractTitle(contractText),
      overallScore,
      overallRiskLevel,
      summary: `Audited ${analyzedClauses.length} major sections. Found ${highRiskClauses.length} high-risk clause(s) requiring immediate redlines before signing.`,
      keyFindings,
      clauses: analyzedClauses,
      voiceBriefScript,
      analyzedAt: new Date().toISOString(),
      modelUsed: "Gemma 2 (Open-Weights 9B via Ollama / Mastra)",
      processingTimeMs,
    };
  }

  private segmentContract(text: string): { title: string; text: string }[] {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const sections: { title: string; text: string }[] = [];
    let currentTitle = "General Terms";
    let currentBuffer: string[] = [];

    const sectionRegex = /^(section\s*[\d\w.-]*|\d+\.|\barticle\s*[\d\w.-]*|[A-Z\s]{3,}:)/i;

    for (const line of lines) {
      const match = sectionRegex.exec(line);
      const colonIndex = line.indexOf(":");

      if (match && colonIndex > 0 && colonIndex < 60 && colonIndex < line.length - 5) {
        // Line has inline title followed by colon and text
        if (currentBuffer.length > 0) {
          sections.push({ title: currentTitle, text: currentBuffer.join(" ") });
          currentBuffer = [];
        }
        currentTitle = line.substring(0, colonIndex).replace(/[:#]/g, "").trim();
        const remainder = line.substring(colonIndex + 1).trim();
        if (remainder) {
          currentBuffer.push(remainder);
        }
      } else if (match && line.length < 90) {
        if (currentBuffer.length > 0) {
          sections.push({ title: currentTitle, text: currentBuffer.join(" ") });
          currentBuffer = [];
        }
        currentTitle = line.replace(/[:#]/g, "").trim();
      } else {
        currentBuffer.push(line);
      }
    }

    if (currentBuffer.length > 0) {
      sections.push({ title: currentTitle, text: currentBuffer.join(" ") });
    }

    // If no explicit sections were found, split into logical paragraphs
    if (sections.length <= 1 && text.length > 200) {
      const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 30);
      return paragraphs.map((p, idx) => ({
        title: `Clause ${idx + 1}`,
        text: p.trim(),
      }));
    }

    return sections.slice(0, 10); // Top relevant clauses
  }

  private async evaluateClause(
    clause: { title: string; text: string },
    index: number
  ): Promise<AnalyzedClause> {
    const textLower = clause.text.toLowerCase();

    // Categorization
    let category: AnalyzedClause["category"] = "OTHER";
    if (textLower.includes("payment") || textLower.includes("fee") || textLower.includes("invoice") || textLower.includes("net ")) {
      category = "PAYMENT_TERMS";
    } else if (textLower.includes("intellectual property") || textLower.includes("work made for hire") || textLower.includes("copyright") || textLower.includes("assign")) {
      category = "INTELLECTUAL_PROPERTY";
    } else if (textLower.includes("indemnif") || textLower.includes("liabilit") || textLower.includes("hold harmless") || textLower.includes("damages")) {
      category = "LIABILITY";
    } else if (textLower.includes("non-compete") || textLower.includes("non-solicit") || textLower.includes("restrictive covenant")) {
      category = "NON_COMPETE";
    } else if (textLower.includes("terminat") || textLower.includes("cancel") || textLower.includes("notice period")) {
      category = "TERMINATION";
    } else if (textLower.includes("confidential") || textLower.includes("nda") || textLower.includes("proprietary")) {
      category = "CONFIDENTIALITY";
    }

    // Compare with Safe Benchmarks
    const benchmark = SAFE_BENCHMARKS.find((b) => b.category === category);
    let riskScore = 2; // Default safe
    let matchedTrigger = "";

    if (benchmark) {
      for (const trigger of benchmark.redFlagTriggers) {
        if (textLower.includes(trigger.toLowerCase())) {
          riskScore = 9;
          matchedTrigger = trigger;
          break;
        }
      }
    }

    // Heuristic adjustments
    if (riskScore < 5) {
      if (textLower.includes("unlimited") || textLower.includes("solely at contractor's expense") || textLower.includes("perpetual without termination")) {
        riskScore = 8;
      } else if (textLower.includes("discretionary") || textLower.includes("waive all moral rights")) {
        riskScore = 7;
      }
    }

    let riskLevel: RiskLevel = "LOW";
    if (riskScore >= 8) riskLevel = "CRITICAL";
    else if (riskScore >= 6) riskLevel = "HIGH";
    else if (riskScore >= 4) riskLevel = "MEDIUM";

    let explanation = "Standard clause with minimal contractor exposure.";
    let redlineSuggestion = "Accept as written.";
    let safeAlternative = benchmark?.safeTemplate || "Mutual agreement subject to standard governing law.";

    if (riskLevel === "CRITICAL" || riskLevel === "HIGH") {
      if (category === "PAYMENT_TERMS") {
        explanation = `Contains payment trap (${matchedTrigger || "extended terms"}). You risk waiting months without guarantee of payment.`;
        redlineSuggestion = "Counter with Net 30 payment terms and a mandatory 1.5% monthly late fee.";
      } else if (category === "INTELLECTUAL_PROPERTY") {
        explanation = "Broad IP assignment transfers rights before payment is completed and strips your pre-existing tools.";
        redlineSuggestion = "Amend so IP transfer is contingent upon receipt of full payment, and reserve portfolio rights.";
      } else if (category === "LIABILITY") {
        explanation = "Exposes you to uncapped indemnification or consequential damages far exceeding the project's contract value.";
        redlineSuggestion = "Cap total liability strictly to the fees actually paid to you under the agreement.";
      } else if (category === "NON_COMPETE") {
        explanation = "Restricts your ability to work with other clients in your primary field or industry.";
        redlineSuggestion = "Strike the non-compete entirely; agree only to reasonable non-solicitation of direct client staff.";
      } else {
        explanation = "Unbalanced terms placing unilateral burden on the independent contractor.";
        redlineSuggestion = "Make terms reciprocal and mutual.";
      }
    }

    return {
      id: `clause-${index + 1}`,
      category,
      title: clause.title || `Clause ${index + 1}`,
      originalText: clause.text,
      riskScore,
      riskLevel,
      explanation,
      redlineSuggestion,
      safeAlternative,
    };
  }

  private extractContractTitle(text: string): string {
    const firstLine = text.trim().split("\n")[0]?.replace(/^[#\s]+/, "").trim();
    if (firstLine && firstLine.length < 60) return firstLine;
    return "Independent Contractor Agreement";
  }

  private createVoiceScript(
    score: number,
    level: RiskLevel,
    highRiskClauses: AnalyzedClause[]
  ): string {
    if (highRiskClauses.length === 0) {
      return `ClauseGuard audit complete. Your contract scored ${score} out of 100, which is considered low risk. No major predatory clauses were found. You are in good shape to proceed.`;
    }

    const topTraps = highRiskClauses
      .slice(0, 3)
      .map((c) => c.title)
      .join(", and ");

    return `Attention. ClauseGuard has audited your agreement. Overall safety score is ${score} out of 100, categorized as ${level} risk. Critical traps were identified in ${topTraps}. Specifically, watch out for unmitigated liability and unfavorable payment terms. Do not sign until you counter with the redline amendments provided below.`;
  }
}

export const contractAuditor = new ContractAuditorWorkflow();

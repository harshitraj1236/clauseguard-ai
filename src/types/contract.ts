export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface AnalyzedClause {
  id: string;
  category: "PAYMENT_TERMS" | "INTELLECTUAL_PROPERTY" | "LIABILITY" | "TERMINATION" | "NON_COMPETE" | "CONFIDENTIALITY" | "OTHER";
  title: string;
  originalText: string;
  riskScore: number; // 1 to 10
  riskLevel: RiskLevel;
  explanation: string;
  redlineSuggestion: string;
  safeAlternative: string;
}

export interface ContractAuditResult {
  contractTitle: string;
  overallScore: number; // 0 to 100 (higher = safer)
  overallRiskLevel: RiskLevel;
  summary: string;
  keyFindings: string[];
  clauses: AnalyzedClause[];
  voiceBriefScript: string;
  audioUrl?: string;
  analyzedAt: string;
  modelUsed: string;
  processingTimeMs: number;
}

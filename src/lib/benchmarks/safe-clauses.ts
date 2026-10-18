export interface SafeBenchmark {
  id?: string;
  category: string;
  title?: string;
  fairStandard: string;
  redFlagTriggers: string[];
  safeTemplate: string;
}

export const SAFE_BENCHMARKS: SafeBenchmark[] = [
  {
    id: "bm-payment",
    category: "PAYMENT_TERMS",
    title: "Standard Payment Terms",
    fairStandard: "Net 15 or Net 30 with upfront deposit and late payment interest fees (1.5%/month).",
    redFlagTriggers: [
      "net 60", "net-60", "net 75", "net-75", "net 90", "net-90", "net 120", "net-120",
      "paid when paid", "unilateral discount", "discretionary payment", "withhold payment"
    ],
    safeTemplate: "Payment shall be due within thirty (30) days of invoice submission (Net-30). Overdue balances shall accrue interest at the rate of 1.5% per month or the maximum rate permitted by law."
  },
  {
    id: "bm-ip",
    category: "INTELLECTUAL_PROPERTY",
    title: "Intellectual Property Ownership",
    fairStandard: "Transfer of IP occurs ONLY upon receipt of full payment. Contractor retains pre-existing tools, libraries, and portfolio display rights.",
    redFlagTriggers: [
      "all inventions conceived", "assign all right", "assigns all right", "pre-existing code",
      "pre-existing tools", "preexisting", "waive moral rights", "exclusive ownership of tools",
      "perpetual without payment"
    ],
    safeTemplate: "Upon receipt of full payment, Contractor hereby assigns to Client all right, title, and interest in the customized deliverables. Contractor retains ownership of all pre-existing tools, code libraries, and general methodologies, as well as the right to display the work in Contractor's professional portfolio."
  },
  {
    id: "bm-liability",
    category: "LIABILITY",
    title: "Limitation of Liability",
    fairStandard: "Liability is mutual and strictly capped at the total fees paid under the contract.",
    redFlagTriggers: [
      "unlimited liability", "without limitation", "solely indemnify", "indemnify and hold harmless",
      "hold harmless from any and all claims", "consequential damages", "uncapped indemnif"
    ],
    safeTemplate: "To the maximum extent permitted by applicable law, neither party shall be liable for indirect, incidental, or consequential damages. Contractor's aggregate liability arising out of or related to this Agreement shall be strictly capped at the total amount actually paid by Client under this Agreement."
  },
  {
    id: "bm-noncompete",
    category: "NON_COMPETE",
    title: "Restrictive Covenants & Non-Compete",
    fairStandard: "Non-solicitation of direct employees only; zero restriction on serving clients in the same industry.",
    redFlagTriggers: [
      "shall not engage with any company", "competing firm", "worldwide non-compete",
      "2 years post termination", "24 months", "restrict from performing services"
    ],
    safeTemplate: "Contractor is an independent professional and retains the unrestricted right to provide services to other clients in any industry or market, provided Contractor does not breach the confidentiality obligations set forth herein."
  },
  {
    id: "bm-termination",
    category: "TERMINATION",
    title: "Termination & Notice Rights",
    fairStandard: "Mutual termination for convenience with written 14-30 day notice and payment for all work completed up to termination date.",
    redFlagTriggers: [
      "terminate immediately without cause", "without compensation for work completed",
      "unilateral termination without notice", "forfeit accrued compensation"
    ],
    safeTemplate: "Either party may terminate this Agreement for convenience upon fourteen (14) days prior written notice. Upon termination, Client shall promptly compensate Contractor for all hours worked and milestones achieved through the effective date of termination."
  },
  {
    id: "bm-confidentiality",
    category: "CONFIDENTIALITY",
    title: "Confidentiality & Non-Disclosure",
    fairStandard: "Mutual confidentiality with a standard 2-year expiration and exclusions for publicly known information.",
    redFlagTriggers: [
      "perpetual confidentiality without exclusion", "unilateral confidentiality",
      "liquidated damages for inadvertent disclosure"
    ],
    safeTemplate: "Both parties agree to protect proprietary information with reasonable care for a period of two (2) years following disclosure. Confidential information shall exclude information that is publicly known or independently developed without reference to the disclosed materials."
  }
];

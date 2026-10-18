"use client";

import { useState, useEffect, useRef } from "react";
import { 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  ArrowRight, 
  Lock, 
  Info,
  ChevronDown,
  ChevronUp,
  Download,
  Mail,
  UploadCloud,
  Radio,
  Terminal,
  Zap
} from "lucide-react";
import { ContractAuditResult } from "@/types/contract";
import ScoreGauge from "@/components/ScoreGauge";
import PipelineTracker from "@/components/PipelineTracker";
import VoicePlayer from "@/components/VoicePlayer";

export default function Home() {
  const [contractText, setContractText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContractAuditResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(false);
  const [status, setStatus] = useState<{ online: boolean; model: string; provider: string }>({
    online: true,
    model: "gemma2:2b",
    provider: "Ollama (Local)",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live status ping to check local Ollama / Gemma 2
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/status");
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch (e) {
        // Fallback default
      }
    }
    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter to run
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (contractText.trim() && !loading) {
          handleAudit();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [contractText, loading]);

  const handleAudit = async () => {
    if (!contractText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || "Failed to analyze contract");
      }
    } catch (e) {
      console.error(e);
      alert("Error analyzing contract. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllRedlinesEmail = () => {
    if (!result) return;
    const highRiskClauses = result.clauses.filter((c) => c.riskLevel === "CRITICAL" || c.riskLevel === "HIGH");

    const emailBody = `Hi [Client Name],

Thank you for sending over the agreement. I am excited about the opportunity to collaborate!

Before finalizing, I reviewed the terms against standard independent contractor benchmarks and prepared a few recommended redlines to ensure terms remain balanced and mutual:

${highRiskClauses.map((c, i) => `${i + 1}. Regarding ${c.title}:
Current Language: "${c.originalText.slice(0, 120)}..."
Proposed Redline: "${c.safeAlternative}"
Rationale: ${c.explanation}
`).join("\n")}
Please let me know if these adjustments work for your team so we can countersign and kick off.

Best regards,
[Your Name]`;

    navigator.clipboard.writeText(emailBody);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const downloadReport = () => {
    if (!result) return;
    const content = `# CLAUSEGUARD // CONTRACT THREAT DOSSIER: ${result.contractTitle}
Generated: ${new Date(result.analyzedAt).toLocaleString()}
Overall Threat Score: ${result.overallScore} / 100 (${result.overallRiskLevel})
Model: ${result.modelUsed}

## EXECUTIVE SUMMARY
${result.summary}

## CRITICAL THREAT VECTORS DETECTED
${result.keyFindings.map((f) => `- ${f}`).join("\n")}

## SECTOR-BY-SECTOR ANALYSIS & COUNTER-OFFERS
${result.clauses.map((c) => `### ${c.title} [SEVERITY: ${c.riskLevel} - ${c.riskScore}/10]
- **Original Language:** "${c.originalText}"
- **Threat Assessment:** ${c.explanation}
- **Recommended Redline:** "${c.safeAlternative}"
`).join("\n\n")}

---
*Generated privately via ClauseGuard AI. Zero cloud telemetry leaked.*`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ClauseGuard-Threat-Dossier-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setContractText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setContractText(text);
      }
    };
    reader.readAsText(file);
  };

  const estimatedClauses = Math.max(1, contractText.split(/\n\s*\n/).filter((p) => p.trim().length > 20).length);

  const criticalCount = result ? result.clauses.filter((c) => c.riskLevel === "CRITICAL").length : 0;
  const highCount = result ? result.clauses.filter((c) => c.riskLevel === "HIGH").length : 0;
  const mediumCount = result ? result.clauses.filter((c) => c.riskLevel === "MEDIUM").length : 0;
  const safeCount = result ? result.clauses.filter((c) => c.riskLevel === "LOW").length : 0;

  return (
    <main className="min-h-screen text-slate-100 selection:bg-blue-500 selection:text-white px-3 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-7xl mx-auto">
      
      {/* Tactical Sci-Fi HUD Header (Electric Blue Theme) */}
      <header className="border-b border-white/10 pb-5 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
          
          {/* Left HUD info */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase">
                SECTOR 07
              </span>
              <span className="text-[10px] text-blue-400 font-bold tracking-wider uppercase">
                // LEGAL NETWORK
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 tracking-wider">
              <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
              <span>SIGNAL LOCKED · 100% AIRGAPPED LOCAL PRIVACY</span>
            </div>
          </div>

          {/* Center Brand Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_#3b82f6]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-white">CLAUSEGUARD</span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-500/40">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-tight">Contract Threat Vector Auditor</p>
            </div>
          </div>

          {/* Right HUD info */}
          <div className="space-y-0.5 text-left sm:text-right">
            <div className="text-[11px] font-black tracking-widest text-slate-400 uppercase">
              BOOTING UI
            </div>
            <div className="flex items-center sm:justify-end gap-1.5 text-[10px] text-blue-400 font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              <span>FRAME // ACTIVE · v1.0.26</span>
            </div>
          </div>
        </div>

        {/* Live Status Pill & Open-Weights Explainer toggle */}
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f172a] border border-blue-500/30 text-slate-200">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.online ? "bg-blue-400" : "bg-amber-400"}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${status.online ? "bg-blue-500" : "bg-amber-500"}`}></span>
            </span>
            <span className="text-[11px]">
              NODE: <strong className="text-white">{status.model}</strong> ({status.provider})
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowPrivacyBanner(!showPrivacyBanner)}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-blue-400 transition cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Why Open-Weights Matter</span>
            {showPrivacyBanner ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </header>

      {/* Collapsible Open-Weights Info Banner */}
      {showPrivacyBanner && (
        <div className="mb-6 p-4 rounded-xl cyber-box-blue text-slate-300 text-xs font-mono leading-relaxed transition-all">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-300 uppercase tracking-wider font-bold">The NDA Defense Imperative: </strong>
              Commercial NDAs legally forbid transmitting confidential contracts to 3rd-party SaaS LLMs (OpenAI, Anthropic).
              By running Google’s open-weight <strong>Gemma 2</strong> locally via <strong>Ollama</strong>, your legal reviews remain 100% confidential and compliant. Zero data leakage, zero API subscription costs.
            </div>
          </div>
        </div>
      )}

      {/* Hero Electric Blue Tactical Banner */}
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/80 via-blue-900/40 to-black p-6 sm:p-8 border border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.18)]">
        <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-7xl font-black text-blue-500 select-none pointer-events-none">
          CLAUSEGUARD
        </div>

        <div className="max-w-2xl relative z-10 font-mono">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-950/80 border border-blue-500/50 text-[10px] text-blue-300 font-bold uppercase tracking-widest mb-3">
            <Zap className="w-3 h-3 text-blue-400" /> DEFENSE PROTOCOL ACTIVE
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            CLAUSEGUARD
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 font-sans font-normal leading-relaxed">
            Autonomous contract threat detection & redline synthesis. Audits predatory Net-90 clauses, liability traps, and IP forfeiture with zero cloud telemetry.
          </p>
        </div>
      </div>

      {/* Main Grid: Responsive for Mobile, Tablet, and Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Input Matrix */}
        <div className="lg:col-span-5 space-y-4">
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="cyber-box rounded-2xl p-4 sm:p-5 border border-white/10 shadow-xl transition-all"
          >
            {/* Header of Input Card */}
            <div className="flex items-center justify-between mb-2.5 font-mono">
              <label className="text-xs font-bold text-slate-200 tracking-wider uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" /> Contract Source Code
              </label>

              <div className="flex items-center gap-2">
                {contractText && (
                  <button
                    type="button"
                    onClick={() => { setContractText(""); setResult(null); }}
                    className="text-[11px] text-slate-500 hover:text-blue-400 font-bold transition cursor-pointer"
                  >
                    [ CLEAR ]
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] text-slate-400 hover:text-blue-400 font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" /> [ UPLOAD ]
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                rows={16}
                placeholder="Paste contract clauses or drop document file here..."
                className="w-full text-xs font-mono p-3.5 bg-black/60 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500 text-slate-200 transition leading-relaxed resize-y placeholder:text-slate-600"
              />
            </div>

            {/* Live Count */}
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono tracking-wider uppercase">
              <span>~{estimatedClauses} SECTIONS DETECTED</span>
              <span>{contractText.length} CHARS</span>
            </div>

            {/* Execute Button (Electric Blue) */}
            <div className="mt-5">
              <button
                type="button"
                onClick={handleAudit}
                disabled={loading || !contractText.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transition hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>NEURAL AUDIT IN PROGRESS...</span>
                  </>
                ) : (
                  <>
                    <span>[ INITIATE THREAT SCAN ]</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-500 mt-2 font-mono">
                PRESS <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-slate-400">CMD</kbd> + <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-slate-400">ENTER</kbd> TO EXECUTE
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Output & Results */}
        <div className="lg:col-span-7 space-y-5">
          {/* Empty State: Cyber HUD Preview */}
          {!result && !loading && (
            <div className="cyber-box rounded-2xl p-6 sm:p-8 border border-white/10 font-mono text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(59,130,246,0.25)]">
                <Terminal className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-white text-base tracking-wider uppercase mb-1">
                SYSTEM STANDBY // AWAITING TARGET
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-sans max-w-sm mx-auto">
                Select a test vector or paste your contract text to trigger the neural auditor.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                    01 // THREAT SCORE
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">0–100 risk safety index calculated across four financial vectors.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                    02 // TRAP ISOLATION
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">Identifies uncapped indemnity, Net-90 delays, and IP grabs.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                    03 // REDLINE COUNTER
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">Ready-to-deploy replacement language for client negotiation.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                    04 // AUDIO BRIEFING
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">45-second spoken briefing synthesized via ElevenLabs.</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading Pipeline State */}
          {loading && (
            <div className="min-h-[440px] flex items-center justify-center">
              <PipelineTracker />
            </div>
          )}

          {/* Results Screen */}
          {result && !loading && (
            <div className="space-y-5">
              {/* Voice Player HUD */}
              <VoicePlayer
                transcript={result.voiceBriefScript}
                audioUrl={result.audioUrl}
              />

              {/* Central Safety Score Gauge Card */}
              <div className="cyber-box rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-5 border-b border-white/10">
                  {/* Gauge */}
                  <ScoreGauge score={result.overallScore} size={150} />

                  {/* Summary & Counters */}
                  <div className="flex-1 text-center sm:text-left space-y-2.5 font-mono">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        AUDITED TARGET
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                        {result.contractTitle}
                      </h2>
                      <p className="text-xs text-slate-400 mt-1 font-sans leading-relaxed">
                        {result.summary}
                      </p>
                    </div>

                    {/* Threat Counters */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] font-bold">
                      <span className="px-2.5 py-1 rounded bg-red-950/70 border border-red-500/50 text-red-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        {criticalCount} CRITICAL
                      </span>

                      <span className="px-2.5 py-1 rounded bg-amber-950/70 border border-amber-500/50 text-amber-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {highCount} HIGH
                      </span>

                      <span className="px-2.5 py-1 rounded bg-yellow-950/70 border border-yellow-500/50 text-yellow-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        {mediumCount} MEDIUM
                      </span>

                      <span className="px-2.5 py-1 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {safeCount} SAFE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Findings */}
                <div className="pt-4 font-mono">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">
                    CRITICAL EXPOSURE LOG:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                    {result.keyFindings.map((finding, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tactical Actions */}
                <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={copyAllRedlinesEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {copiedEmail ? "[ EMAIL COPIED! ]" : "[ COPY CLIENT EMAIL ]"}
                    </button>

                    <button
                      type="button"
                      onClick={downloadReport}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      [ EXPORT DOSSIER ]
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-500">
                    LATENCY: {result.processingTimeMs}ms // {status.model}
                  </span>
                </div>
              </div>

              {/* Threat Cards */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                    SECTOR-BY-SECTOR THREAT CARDS
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {result.clauses.length} CLAUSES
                  </span>
                </div>

                {result.clauses.map((clause) => {
                  const isCrit = clause.riskLevel === "CRITICAL";
                  const isHigh = clause.riskLevel === "HIGH";
                  const isMed = clause.riskLevel === "MEDIUM";

                  const borderClass = isCrit
                    ? "border-l-4 border-l-red-500 bg-gradient-to-r from-red-950/20 to-transparent"
                    : isHigh
                    ? "border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-950/20 to-transparent"
                    : isMed
                    ? "border-l-4 border-l-yellow-500"
                    : "border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-950/20 to-transparent";

                  return (
                    <div
                      key={clause.id}
                      className={`cyber-box rounded-xl p-4 sm:p-5 border border-white/10 space-y-3 ${borderClass}`}
                    >
                      <div className="flex items-center justify-between gap-2 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{clause.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10 uppercase">
                            {clause.category.replace("_", " ")}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isCrit
                              ? "bg-red-950 text-red-400 border border-red-500/50"
                              : isHigh
                              ? "bg-amber-950 text-amber-400 border border-amber-500/50"
                              : isMed
                              ? "bg-yellow-950 text-yellow-400 border border-yellow-500/50"
                              : "bg-emerald-950 text-emerald-400 border border-emerald-500/50"
                          }`}
                        >
                          {clause.riskLevel} [{clause.riskScore}/10]
                        </span>
                      </div>

                      {/* Part 1: Original Language */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono block mb-1">
                          ORIGINAL TEXT:
                        </span>
                        <div className="text-xs bg-black/60 text-slate-300 p-3 rounded-lg font-mono border border-white/5 leading-relaxed">
                          "{clause.originalText}"
                        </div>
                      </div>

                      {/* Part 2: Threat Analysis */}
                      <div className="text-xs text-slate-300 leading-relaxed font-sans">
                        <strong className="text-blue-400 font-mono font-bold uppercase tracking-wider text-[11px]">
                          Threat Analysis:{" "}
                        </strong>
                        {clause.explanation}
                      </div>

                      {/* Part 3: Tactical Redline Counter-Offer */}
                      <div className="p-3.5 rounded-xl bg-black/60 border border-blue-500/30 space-y-2">
                        <div className="flex items-center justify-between font-mono">
                          <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5 uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            PROPOSED COUNTER-MEASURE:
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(clause.safeAlternative, clause.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-white cursor-pointer uppercase tracking-wider"
                          >
                            <Copy className="w-3 h-3" />
                            {copiedId === clause.id ? "[ COPIED ]" : "[ COPY REDLINE ]"}
                          </button>
                        </div>

                        <p className="text-xs text-slate-200 font-mono bg-white/[0.03] p-3 rounded-lg border border-white/5 leading-relaxed">
                          {clause.safeAlternative}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tactical Footer Disclaimer */}
      <footer className="mt-16 pt-6 border-t border-white/10 text-center font-mono text-[11px] text-slate-500 max-w-xl mx-auto space-y-1">
        <p className="text-slate-400 font-bold uppercase tracking-wider">
          ⚠️ DISCLAIMER: AUTOMATED LEGAL HEURISTICS ONLY
        </p>
        <p className="font-sans text-slate-500">
          Not formal legal advice. For high-stakes commercial agreements, verify with qualified legal counsel.
        </p>
      </footer>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Shield, Sparkles, Cpu, Volume2, Check, Radio } from "lucide-react";

const STEPS = [
  { id: 1, title: "SECTOR 01 // PARSE & SEGMENT", desc: "Isolating raw clauses into threat units", icon: Shield },
  { id: 2, title: "SECTOR 02 // SAFE BENCHMARK RADAR", desc: "Cross-checking against fair legal standards", icon: Sparkles },
  { id: 3, title: "SECTOR 03 // GEMMA-2 COGNITIVE AUDIT", desc: "Neural risk evaluation & trapdoor scoring", icon: Cpu },
  { id: 4, title: "SECTOR 04 // TACTICAL REDLINE SYNTHESIS", desc: "Generating counter-clauses & audio brief", icon: Volume2 },
];

export default function PipelineTracker() {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 1200);
    const timer2 = setTimeout(() => setCurrentStep(3), 2600);
    const timer3 = setTimeout(() => setCurrentStep(4), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="cyber-box rounded-2xl p-6 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.12)] max-w-lg mx-auto w-full font-mono relative overflow-hidden">
      {/* Top HUD status strip */}
      <div className="flex items-center justify-between text-[10px] text-blue-400 tracking-widest uppercase mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-1.5 font-bold">
          <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>NEURAL SCAN // ACTIVE</span>
        </div>
        <span className="text-slate-500">FRAME // v1.0.26</span>
      </div>

      {/* Segmented loading bar */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <span className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">
          SCANNING
        </span>
        <div className="flex items-center gap-1.5 flex-1 max-w-[200px]">
          {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
            <div
              key={bar}
              className={`h-2 flex-1 rounded-sm transform skew-x-[-20deg] transition-all duration-300 ${
                currentStep >= Math.ceil(bar / 2)
                  ? "bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3.5">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                isCurrent
                  ? "bg-blue-950/30 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  : isDone
                  ? "bg-white/[0.02] border-white/5 opacity-80"
                  : "bg-transparent border-transparent opacity-40"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                  isDone
                    ? "bg-emerald-500 text-black font-extrabold shadow-[0_0_10px_#10b981]"
                    : isCurrent
                    ? "bg-blue-500 text-white font-extrabold shadow-[0_0_12px_#3b82f6] animate-pulse"
                    : "bg-white/5 text-slate-500 border border-white/10"
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
              </div>

              <div className="pt-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold tracking-wider ${
                      isCurrent ? "text-blue-300 font-extrabold" : isDone ? "text-slate-200" : "text-slate-500"
                    }`}
                  >
                    {step.title}
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 animate-pulse">
                      PROCESSING
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

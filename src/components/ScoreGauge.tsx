"use client";

interface ScoreGaugeProps {
  score: number; // 0 to 100
  size?: number;
}

export default function ScoreGauge({ score, size = 150 }: ScoreGaugeProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let strokeColor = "#ef4444"; // Neon Red
  let glowColor = "rgba(239, 68, 68, 0.4)";
  let label = "THREAT // CRITICAL";
  let textColor = "text-red-500";
  let badgeBorder = "border-red-500/40 text-red-400 bg-red-950/40";

  if (score >= 75) {
    strokeColor = "#10b981"; // Emerald
    glowColor = "rgba(16, 185, 129, 0.4)";
    label = "CLEAR // SECURE";
    textColor = "text-emerald-400";
    badgeBorder = "border-emerald-500/40 text-emerald-400 bg-emerald-950/40";
  } else if (score >= 50) {
    strokeColor = "#f59e0b"; // Amber
    glowColor = "rgba(245, 158, 11, 0.4)";
    label = "THREAT // ELEVATED";
    textColor = "text-amber-400";
    badgeBorder = "border-amber-500/40 text-amber-400 bg-amber-950/40";
  }

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Outer Tech Ring / Ticks */}
        <div className="absolute inset-0 rounded-full border border-white/5 animate-spin-slow pointer-events-none" />

        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Subtle Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Neon Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono">
          <span className={`text-4xl font-black tracking-tighter ${textColor}`}>
            {score}
          </span>
          <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            RATING // 100
          </span>
        </div>
      </div>

      <div className={`mt-3 font-mono text-[10px] font-bold tracking-widest px-3 py-1 rounded-full border ${badgeBorder} flex items-center gap-1.5 shadow-sm`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
        <span>{label}</span>
      </div>
    </div>
  );
}

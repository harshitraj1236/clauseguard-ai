"use client";

import { useState } from "react";
import { Play, Pause, Volume2, ChevronDown, ChevronUp, Radio } from "lucide-react";

interface VoicePlayerProps {
  transcript: string;
  audioUrl?: string;
}

export default function VoicePlayer({ transcript, audioUrl }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const togglePlayback = () => {
    if (isPlaying) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.play().catch(() => setIsPlaying(false));
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.rate = 1.05;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="cyber-box rounded-2xl p-4 border border-blue-500/25 shadow-[0_0_20px_rgba(59,130,246,0.1)] text-slate-100 font-mono">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlayback}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isPlaying
                ? "bg-blue-500 text-white shadow-[0_0_15px_#3b82f6]"
                : "bg-white/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30"
            }`}
            title={isPlaying ? "Pause Transmission" : "Play Transmission"}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                COMMS // 45s Tactical Audio Brief
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/40 uppercase">
                ElevenLabs Voice AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isPlaying ? "Transmitting audio briefing..." : "Audio synthesis ready for fast field review"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTranscript(!showTranscript)}
          className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1 font-bold px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-blue-500/30 transition cursor-pointer"
        >
          <span>TRANSCRIPT</span>
          {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Electric Blue Soundwave Animation */}
      {isPlaying && (
        <div className="flex items-center gap-1 mt-3 px-1">
          {[35, 75, 25, 95, 60, 85, 40, 100, 30, 90, 50, 80, 45, 65, 90, 55, 70, 30, 85, 40].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-blue-500 rounded-full animate-pulse shadow-[0_0_6px_#3b82f6]"
              style={{
                height: `${h * 0.25}px`,
                animationDelay: `${i * 0.06}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Transcript Drawer */}
      {showTranscript && (
        <div className="mt-3.5 pt-3.5 border-t border-white/10 text-xs text-slate-300 leading-relaxed font-mono bg-black/50 p-3.5 rounded-xl border border-white/5">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Radio className="w-3 h-3 text-blue-500" /> DECRYPTED AUDIO LOG:
          </p>
          "{transcript}"
        </div>
      )}
    </div>
  );
}

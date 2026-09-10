import React from 'react';
import { ShieldCheck, QrCode, Zap, Video, CheckCircle2, Award, Truck, IndianRupee } from 'lucide-react';

export type StickerVariant = 'fastag' | 'anpr' | 'verified' | 'upi' | 'truck' | 'hazmat';

interface IndustrialStickerProps {
  variant: StickerVariant;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const IndustrialSticker: React.FC<IndustrialStickerProps> = ({
  variant,
  className = '',
  size = 'md',
}) => {
  if (variant === 'fastag') {
    return (
      <div 
        className={`inline-flex items-center gap-2 px-3 py-1.5 bg-[#f59e0b] text-neutral-950 font-black rounded-sm border-2 border-neutral-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] select-none uppercase tracking-wider transform -rotate-2 hover:rotate-0 transition-transform ${className}`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div className="w-2.5 h-2.5 bg-neutral-950 rounded-full animate-ping opacity-75" />
        <span className="text-[10px] sm:text-xs">FASTAG AUTO-GATE</span>
        <span className="text-[8px] bg-neutral-950 text-amber-400 px-1 py-0.5 rounded font-mono font-bold">ANPR</span>
      </div>
    );
  }

  if (variant === 'anpr') {
    return (
      <div 
        className={`inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900 text-red-400 border border-red-500/60 rounded-md shadow-[3px_3px_0px_0px_rgba(239,68,68,0.3)] select-none transform rotate-1 hover:rotate-0 transition-transform ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
        <Video className="w-3.5 h-3.5 text-red-400" />
        <div className="flex flex-col leading-none">
          <span className="text-[9px] font-black tracking-widest text-neutral-200">24/7 CCTV SURVEILLANCE</span>
          <span className="text-[8px] font-mono text-red-400/90 font-bold">ZERO CARGO LOSS SECURED</span>
        </div>
      </div>
    );
  }

  if (variant === 'verified') {
    return (
      <div 
        className={`inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-700 to-indigo-700 text-white border-2 border-blue-300/40 rounded-full shadow-[2px_2px_0px_0px_rgba(30,58,138,0.8)] select-none transform -rotate-1 hover:rotate-0 transition-transform ${className}`}
      >
        <Award className="w-3.5 h-3.5 text-amber-300" />
        <span className="text-[10px] font-extrabold tracking-tight">PARKKARO VERIFIED YARD</span>
        <CheckCircle2 className="w-3 h-3 text-emerald-300" />
      </div>
    );
  }

  if (variant === 'upi') {
    return (
      <div 
        className={`inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 rounded-md shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)] select-none transform rotate-2 hover:rotate-0 transition-transform ${className}`}
      >
        <div className="w-5 h-5 bg-emerald-500 text-neutral-950 rounded flex items-center justify-center font-black text-[11px]">
          ₹
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-bold text-white tracking-wide">DIRECT UPI SETTLEMENT</span>
          <span className="text-[8px] font-mono text-emerald-400 font-semibold">0% HOST COMMISSION</span>
        </div>
      </div>
    );
  }

  if (variant === 'hazmat') {
    return (
      <div 
        className={`inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-400 text-neutral-950 border-2 border-neutral-950 font-black text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] select-none transform rotate-3 hover:rotate-0 transition-transform ${className}`}
      >
        <span className="bg-neutral-950 text-yellow-400 px-1 py-0.5 text-[9px] font-mono">HAZMAT</span>
        <span className="text-[10px] font-extrabold tracking-wider">HEAVY COMBO / TRUCK OK</span>
      </div>
    );
  }

  // default 'truck'
  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 text-cyan-300 border border-cyan-500/50 rounded-lg shadow-[2px_2px_0px_0px_rgba(6,182,212,0.3)] select-none transform -rotate-2 hover:rotate-0 transition-transform ${className}`}
    >
      <Truck className="w-3.5 h-3.5 text-cyan-400" />
      <span className="text-[10px] font-mono font-bold tracking-wider">HIGH CLEARANCE 5.5M+</span>
    </div>
  );
};

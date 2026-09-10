import React from 'react';
import { IndustrialSticker } from './IndustrialSticker';

export const BackgroundPattern: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#090d16]">
      {/* 1. Static Ambient Color Depth (Zero CPU/GPU animation to prevent any lag) */}
      <div 
        className="absolute -top-[10%] -left-[5%] w-[550px] h-[550px] rounded-full bg-blue-700/[0.04] blur-[100px]" 
        aria-hidden="true"
      />
      <div 
        className="absolute top-[20%] -right-[8%] w-[600px] h-[600px] rounded-full bg-amber-600/[0.035] blur-[110px]" 
        aria-hidden="true"
      />
      <div 
        className="absolute -bottom-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-emerald-600/[0.03] blur-[100px]" 
        aria-hidden="true"
      />

      {/* 2. Precision Industrial Blueprint Grid with Radial Vignette */}
      <div 
        className="absolute inset-0 bg-industrial-grid opacity-60 [mask-image:radial-gradient(ellipse_85%_75%_at_50%_35%,#000_60%,transparent_100%)]" 
        aria-hidden="true"
      />

      {/* 3. Static Industrial Decals & Telemetry Stamps */}
      <div className="absolute top-20 left-6 hidden xl:block opacity-75 pointer-events-auto">
        <IndustrialSticker variant="fastag" />
      </div>

      <div className="absolute top-20 right-6 hidden xl:block opacity-75 pointer-events-auto">
        <IndustrialSticker variant="anpr" />
      </div>

      <div className="absolute bottom-6 left-6 hidden 2xl:block opacity-70 pointer-events-auto">
        <IndustrialSticker variant="hazmat" />
      </div>

      <div className="absolute bottom-6 right-6 hidden xl:block opacity-75 pointer-events-auto">
        <IndustrialSticker variant="upi" />
      </div>

      {/* 4. Technical Stencil Coordinates (Lightweight text) */}
      <div className="absolute top-4 right-8 text-[9px] font-spec font-semibold text-neutral-600/40 hidden lg:block tracking-widest uppercase">
        PARKKARO OS // 28.6139° N, 77.2090° E &bull; SECURE GATE PROTOCOL
      </div>
    </div>
  );
};

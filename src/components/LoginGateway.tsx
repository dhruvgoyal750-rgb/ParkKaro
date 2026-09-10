import React, { useState } from 'react';
import { Truck, Car, ShieldCheck, Warehouse, ArrowRight, CheckCircle2, Lock, Shield, Sparkles } from 'lucide-react';
import { VehicleCategory } from '../types';
import { BackgroundPattern } from './BackgroundPattern';

interface LoginGatewayProps {
  onSelectRole: (role: 'driver' | 'host', initialVehicleCategory?: VehicleCategory) => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({ onSelectRole }) => {
  const [driverVehicle, setDriverVehicle] = useState<VehicleCategory>('truck');
  const [email, setEmail] = useState('dispatcher.miller@interstatefreight.com');
  const [password, setPassword] = useState('••••••••••••');
  const [activeTab, setActiveTab] = useState<'driver' | 'host'>('driver');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'driver') {
      onSelectRole('driver', driverVehicle);
    } else {
      onSelectRole('host');
    }
  };

  const handleQuickDriver = (cat: VehicleCategory = 'truck') => {
    setDriverVehicle(cat);
    onSelectRole('driver', cat);
  };

  const handleQuickHost = () => {
    onSelectRole('host');
  };

  return (
    <div className="min-h-screen bg-[#060913] text-white font-sans flex flex-col p-4 sm:p-6 lg:p-8 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Multi-Color Ambient Design & Grid */}
      <BackgroundPattern />

      {/* Bento Top Navigation */}
      <nav className="flex justify-between items-center mb-6 max-w-7xl w-full mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-md shadow-blue-600/30">
            P
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black tracking-tight text-white">PARKKARO</span>
            <span className="text-[11px] font-spec font-semibold text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-full">
              BENTO EDITION
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-neutral-400 font-medium">
          <span className="hover:text-white cursor-pointer transition-colors">How it works</span>
          <span className="hover:text-white cursor-pointer transition-colors">Interstate Corridors</span>
          <span className="hover:text-white cursor-pointer transition-colors">Gate Automation</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-spec">84 YARDS OPERATIONAL</span>
          </div>
        </div>
      </nav>

      {/* Main Bento Grid Layout */}
      <main className="flex-grow max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch relative z-10">
        
        {/* Bento Tile 1: Credentials & Direct Portal Access (4 cols on lg) */}
        <section 
          id="bento-auth-tile"
          className="lg:col-span-4 bg-neutral-900 rounded-[2rem] border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between shadow-xl"
        >
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-black tracking-tight text-white">Welcome back</h1>
                <span className="text-xs font-spec text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded-full">
                  Instant Demo
                </span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Enter your credentials or click a pre-filled role to explore live yards & automated gate passes.
              </p>
            </div>

            {/* Role Tab Selector inside Auth Tile */}
            <div className="flex p-1 bg-neutral-800 rounded-xl mb-4 border border-neutral-700/80">
              <button
                type="button"
                onClick={() => setActiveTab('driver')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'driver'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Driver Demo</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('host')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'host'
                    ? 'bg-emerald-500 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Warehouse className="w-3.5 h-3.5" />
                <span>Host Demo</span>
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSignIn} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <input
                  type="text"
                  value={activeTab === 'driver' ? 'dispatcher.miller@interstatefreight.com' : 'yard.ops@apextransit.io'}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                className="bg-white text-black font-bold py-3.5 rounded-xl mt-1 hover:bg-neutral-200 transition-colors shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Enter as {activeTab === 'driver' ? 'Freight Driver' : 'Lot Owner'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-2 my-4">
              <div className="h-px bg-neutral-800 flex-grow"></div>
              <span className="text-xs text-neutral-600 font-spec">OR FAST DEMO</span>
              <div className="h-px bg-neutral-800 flex-grow"></div>
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDriver('truck')}
                className="bg-neutral-800 hover:bg-neutral-700/80 border border-neutral-700 text-white font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors"
              >
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Heavy Semi</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDriver('car')}
                className="bg-neutral-800 hover:bg-neutral-700/80 border border-neutral-700 text-white font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors"
              >
                <Car className="w-3.5 h-3.5 text-sky-400" />
                <span>Van / Car</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center pt-4 border-t border-neutral-800/80">
            <p className="text-xs text-neutral-500">
              Verified TLS 1.3 Gate Protocol • <span className="text-blue-500 font-semibold">Join 12,000+ drivers</span>
            </p>
          </div>
        </section>

        {/* Bento Column 2 & 3: Right Side Grid (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Bento Tile 2: Park Your Vehicle (Vibrant Blue Bento Tile) */}
          <div 
            id="portal-park-vehicle"
            onClick={() => handleQuickDriver(driverVehicle)}
            className="bg-blue-600 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between relative group cursor-pointer overflow-hidden shadow-2xl transition-transform duration-200 hover:scale-[1.01]"
          >
            {/* Top Bar inside Driver Tile */}
            <div className="z-10">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="bg-blue-400/90 text-neutral-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  For Drivers & Fleets
                </span>
                
                {/* Embedded Vehicle Switcher */}
                <div 
                  className="bg-blue-700/80 p-1 rounded-xl flex items-center gap-1 border border-blue-500/40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setDriverVehicle('truck')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      driverVehicle === 'truck'
                        ? 'bg-neutral-950 text-white shadow'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>53' Truck</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDriverVehicle('car')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      driverVehicle === 'car'
                        ? 'bg-neutral-950 text-white shadow'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5 text-sky-400" />
                    <span>Sprinter / Car</span>
                  </button>
                </div>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mt-4 leading-none tracking-tight text-white">
                Park your<br />vehicle.
              </h2>
              <p className="text-blue-100 text-sm sm:text-base mt-3 max-w-md font-medium leading-relaxed">
                Instant access to vetted staging yards, 53’ tractor-trailer combo spaces, and private parking spots with automated gate PINs.
              </p>

              {/* Verified badges */}
              <div className="flex flex-wrap gap-2 mt-4 text-xs font-medium text-blue-100">
                <span className="bg-blue-700/60 border border-blue-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>≥14'6" Verified Clearance</span>
                </span>
                <span className="bg-blue-700/60 border border-blue-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Automated Keypad PIN</span>
                </span>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mt-6 z-10 flex items-center justify-between">
              <button 
                type="button"
                className="bg-black text-white hover:bg-neutral-900 px-7 py-3.5 rounded-full font-bold flex items-center gap-2 text-sm shadow-xl transition-all group-hover:gap-3"
              >
                <span>FIND A SPOT NOW</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <span className="hidden sm:inline font-spec text-xs text-blue-200 font-medium">
                Corridors I-35, I-10, I-80
              </span>
            </div>

            {/* Watermark Semi Truck SVG Accent */}
            <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none text-white">
              <svg width="340" height="340" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
          </div>

          {/* Bottom Bento Split: Rent Lot (Emerald) + Verified Payouts (Dark Tile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
            
            {/* Bento Tile 3: Rent your parking lot (Vibrant Emerald Bento Tile) */}
            <div 
              id="portal-rent-lot"
              onClick={handleQuickHost}
              className="bg-emerald-500 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between text-neutral-950 relative group cursor-pointer overflow-hidden shadow-2xl transition-transform duration-200 hover:scale-[1.01]"
            >
              <div className="z-10">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    For Owners
                  </span>
                  <span className="font-spec font-black text-xs bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-md">
                    $35–$55 / Bay
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black mt-3 leading-tight tracking-tight">
                  Rent your<br />parking lot.
                </h2>
                <p className="text-emerald-950 font-medium text-xs sm:text-sm mt-2 leading-relaxed">
                  Turn your vacant industrial tarmac, garage, or commercial staging bays into high-yield automated income.
                </p>
              </div>

              <div className="z-10 mt-6 flex items-center justify-between">
                <button 
                  type="button"
                  className="border-2 border-neutral-950 hover:bg-neutral-950 hover:text-white px-5 py-2.5 rounded-full font-black text-xs tracking-wider transition-colors shadow-sm"
                >
                  START EARNING
                </button>
                <span className="text-[11px] font-spec font-bold text-emerald-900">
                  Instant ACH Payouts
                </span>
              </div>

              {/* Watermark Warehouse SVG Accent */}
              <div className="absolute -bottom-6 -right-6 opacity-15 transform -rotate-12 group-hover:scale-110 transition-transform duration-300 pointer-events-none text-neutral-950">
                <Warehouse className="w-36 h-36" />
              </div>
            </div>

            {/* Bento Tile 4: Verified Payouts & Security Telemetry (Dark Neutral Bento Tile) */}
            <div 
              id="bento-stats-tile"
              className="bg-neutral-900 rounded-[2rem] p-6 flex flex-col justify-between border border-neutral-800 shadow-xl"
            >
              <div className="flex justify-between items-start">
                <div className="bg-neutral-800 border border-neutral-700/80 p-3 rounded-2xl shadow-inner">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black font-spec text-white block leading-none">
                    $2.4M+
                  </span>
                  <span className="text-[10px] font-spec text-emerald-400 font-bold uppercase">
                    Paid to Operators
                  </span>
                </div>
              </div>

              <div className="my-3">
                <h3 className="text-base sm:text-lg font-bold text-white">Verified Staging Network</h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Join hundreds of yard operators and fleets earning weekly with zero-friction automated gate entry.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-neutral-900 bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                    MV
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-neutral-900 bg-amber-600 flex items-center justify-center text-[10px] font-bold text-white">
                    RT
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-neutral-900 bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white">
                    AP
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-300 font-spec">
                    +12k
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-spec text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>100% Perimeter Vetted</span>
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Bento Footer */}
      <footer className="mt-6 border-t border-neutral-900 pt-4 max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500 font-medium relative z-10">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-neutral-500" />
          <span>PARKKARO INDUSTRIAL BENTO PLATFORM • HIGH-SECURITY AUTOMATION</span>
        </div>
        <div>
          Commercial Intermodal Staging Yard & High-Clearance Parking System
        </div>
      </footer>
    </div>
  );
};


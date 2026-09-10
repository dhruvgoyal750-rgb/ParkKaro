import React, { useState } from 'react';
import { 
  Truck, Warehouse, ArrowRight, ShieldCheck, CheckCircle2, 
  Car, User, LogOut, ChevronRight, Sparkles, MapPin, Layers
} from 'lucide-react';
import { VehicleCategory } from '../types';
import { UserProfile } from './LoginPage';
import { IndustrialSticker } from './IndustrialSticker';
import { BackgroundPattern } from './BackgroundPattern';

interface RoleSelectPageProps {
  user: UserProfile | null;
  onSelectRole: (role: 'driver' | 'host', vehicleCategory?: VehicleCategory) => void;
  onSignOut: () => void;
}

export const RoleSelectPage: React.FC<RoleSelectPageProps> = ({
  user,
  onSelectRole,
  onSignOut,
}) => {
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState<VehicleCategory>('truck');

  return (
    <div className="min-h-screen bg-[#090d16] text-white font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Lag-free static industrial background */}
      <BackgroundPattern />

      {/* Top Header with User Profile and Sign Out */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between relative z-10 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-blue-600/30 border border-blue-400/30">
            P
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-white">PARKKARO</span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
                PORTAL SELECTION
              </span>
            </div>
            <p className="text-xs text-neutral-400">Choose your operational environment</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 px-3.5 py-1.5 rounded-xl text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-400">Logged in:</span>
            <span className="font-bold text-neutral-200">{user?.name || user?.emailOrPhone || 'Operator'}</span>
          </div>

          <button
            type="button"
            id="role-select-signout-btn"
            onClick={onSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Role Selection Area */}
      <main className="max-w-5xl w-full mx-auto my-auto py-8 relative z-10">
        
        {/* Title & Introduction */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <IndustrialSticker variant="verified" />
            <IndustrialSticker variant="fastag" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2.5">
            What would you like to do?
          </h1>
          <p className="text-sm text-neutral-400">
            Select a dedicated workspace below. You can easily switch between Driver and Host portals at any time from the top navigation bar.
          </p>
        </div>

        {/* The Two Main Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* ================= OPTION 1: PARK YOUR VEHICLE ================= */}
          <div 
            id="card-select-driver"
            className="group relative bg-neutral-900/90 hover:bg-neutral-900 border-2 border-neutral-800 hover:border-blue-500 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all duration-200 hover:shadow-blue-500/10 cursor-pointer"
            onClick={() => onSelectRole('driver', selectedVehicleCategory)}
          >
            {/* Top Sticker & Vehicle Icon */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Truck className="w-7 h-7" />
                </div>
                <IndustrialSticker variant="anpr" />
              </div>

              <div className="mb-2">
                <span className="text-xs font-mono font-bold text-blue-400 tracking-wider uppercase block mb-1">
                  DRIVER & FLEET DISPATCH PORTAL
                </span>
                <h2 className="text-2xl font-extrabold text-white group-hover:text-blue-400 transition-colors">
                  Park Your Vehicle
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                Locate and reserve secure truck staging yards across Indian highway corridors (NH-48, JNPT, NCR) with instant QR gate passes and 24/7 security.
              </p>

              {/* Sub-selection: Vehicle Type */}
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 mb-5" onClick={(e) => e.stopPropagation()}>
                <div className="text-[11px] font-semibold text-neutral-400 mb-2 flex items-center justify-between">
                  <span>Choose Initial Vehicle Class:</span>
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                    {selectedVehicleCategory === 'truck' ? 'Heavy Commercial' : 'Light Commercial'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedVehicleCategory('truck')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      selectedVehicleCategory === 'truck'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Heavy Truck</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedVehicleCategory('car')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      selectedVehicleCategory === 'car'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Car / Van</span>
                  </button>
                </div>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-2 text-xs text-neutral-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive Map with GPS & Highway Corridor Filters</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant QR Code & 4-Digit Gate Access PIN</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>High Clearance (5.5m+), CCTV, Restrooms & Weighbridge</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              id="btn-enter-driver-portal"
              onClick={() => onSelectRole('driver', selectedVehicleCategory)}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 group-hover:bg-blue-500 transition-all"
            >
              <span>Enter Driver Staging Terminal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* ================= OPTION 2: RENT YOUR LOT ================= */}
          <div 
            id="card-select-host"
            className="group relative bg-neutral-900/90 hover:bg-neutral-900 border-2 border-neutral-800 hover:border-emerald-500 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all duration-200 hover:shadow-emerald-500/10 cursor-pointer"
            onClick={() => onSelectRole('host')}
          >
            {/* Top Sticker & Warehouse Icon */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Warehouse className="w-7 h-7" />
                </div>
                <IndustrialSticker variant="upi" />
              </div>

              <div className="mb-2">
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase block mb-1">
                  YARD OWNER & HOST COMMAND CENTER
                </span>
                <h2 className="text-2xl font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                  Rent Your Lot
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                Monetize your vacant land, warehouse staging apron, or commercial parking lot. List hourly and overnight bays with automated ANPR gate access.
              </p>

              {/* Host Perks Banner */}
              <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800/80 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-neutral-300">Monetization Benefits</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    0% COMMISSIONS
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-neutral-900/80 p-2 rounded-lg border border-neutral-800">
                    <span className="text-xs font-mono font-black text-white block">₹350 - ₹1200</span>
                    <span className="text-[9px] text-neutral-400">Avg Nightly Rate/Bay</span>
                  </div>
                  <div className="bg-neutral-900/80 p-2 rounded-lg border border-neutral-800">
                    <span className="text-xs font-mono font-black text-emerald-400 block">Instant Payout</span>
                    <span className="text-[9px] text-neutral-400">Direct UPI & IMPS</span>
                  </div>
                </div>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-2 text-xs text-neutral-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>List New Yards with GPS Coordinates & Bay Specs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-Time Bay Availability & Occupancy Control</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Gate Clearance Validator (ANPR & Keypad PIN)</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              id="btn-enter-host-portal"
              onClick={() => onSelectRole('host')}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 group-hover:bg-emerald-500 transition-all"
            >
              <span>Open Host Operations Center</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </main>

      {/* Bottom Footer */}
      <footer className="max-w-6xl w-full mx-auto flex items-center justify-between text-xs text-neutral-500 font-medium py-2 border-t border-neutral-900 relative z-10">
        <div>PARKKARO LOGISTICS PLATFORM</div>
        <div className="flex items-center gap-2">
          <IndustrialSticker variant="hazmat" />
        </div>
      </footer>
    </div>
  );
};

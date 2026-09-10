import React from 'react';
import { Truck, Warehouse, ArrowLeftRight, LogOut, QrCode, ShieldCheck, User, Sparkles } from 'lucide-react';
import { VehicleCategory } from '../types';
import { UserProfile } from './LoginPage';

interface HeaderProps {
  currentRole: 'driver' | 'host';
  currentUser?: UserProfile | null;
  onSwitchRole: (role: 'driver' | 'host') => void;
  onExitToLogin: () => void;
  onReturnToRoleSelect?: () => void;
  activePassesCount: number;
  onOpenPasses: () => void;
  vehicleCategory?: VehicleCategory;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentUser,
  onSwitchRole,
  onExitToLogin,
  onReturnToRoleSelect,
  activePassesCount,
  onOpenPasses,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 text-white">
      {/* Primary Navigation Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Identifier */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button 
            type="button"
            onClick={onReturnToRoleSelect || onExitToLogin}
            className="flex items-center space-x-2.5 text-left group cursor-pointer focus:outline-none"
            title="Return to Portal Select"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
              P
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white tracking-tight group-hover:text-blue-400 transition-colors">
                  PARKKARO
                </span>
                <span className="hidden md:inline-block bg-neutral-900 text-neutral-400 font-spec text-[10px] font-bold px-2 py-0.5 rounded-full border border-neutral-800">
                  BENTO GRID
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 block leading-none">
                Industrial Commercial Staging Network
              </span>
            </div>
          </button>

          {/* Current Mode Badge */}
          <div className="hidden sm:flex items-center space-x-1.5 pl-3 border-l border-neutral-800">
            <span className="text-xs text-neutral-400 font-medium">Portal:</span>
            {currentRole === 'driver' ? (
              <span className="inline-flex items-center space-x-1.5 bg-blue-950/70 border border-blue-800/80 text-blue-300 font-bold text-xs px-3 py-1 rounded-full">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Park Vehicle (Driver)</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 font-bold text-xs px-3 py-1 rounded-full">
                <Warehouse className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rent Your Lot (Host)</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Actions & Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Active Passes for Driver */}
          {currentRole === 'driver' && (
            <button
              type="button"
              id="header-active-passes-btn"
              onClick={onOpenPasses}
              className="relative px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center space-x-2 border border-neutral-700/80 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Active Passes</span>
              {activePassesCount > 0 && (
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold font-spec shadow-sm">
                  {activePassesCount}
                </span>
              )}
            </button>
          )}

          {/* Return to Role Selector Button */}
          {onReturnToRoleSelect && (
            <button
              type="button"
              id="header-role-menu-btn"
              onClick={onReturnToRoleSelect}
              className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs font-bold border border-neutral-800 transition-colors cursor-pointer hidden sm:flex items-center space-x-1.5"
              title="Return to Portal Selection Screen"
            >
              <span>Portals</span>
            </button>
          )}

          {/* Switch Role Button */}
          <button
            type="button"
            id="header-switch-role-btn"
            onClick={() => onSwitchRole(currentRole === 'driver' ? 'host' : 'driver')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 border transition-all cursor-pointer ${
              currentRole === 'driver'
                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-xs'
                : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-xs'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-white" />
            <span className="hidden md:inline">
              {currentRole === 'driver' ? 'Switch to: Rent Your Lot (Host)' : 'Switch to: Park Vehicle (Driver)'}
            </span>
            <span className="md:hidden">
              {currentRole === 'driver' ? 'Host Portal' : 'Driver Portal'}
            </span>
          </button>

          {/* User Account / Person Isolation Badge */}
          {currentUser && (
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-neutral-900/80 border border-neutral-800 rounded-xl text-xs">
              <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold flex items-center justify-center text-[11px]">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <span className="font-semibold text-neutral-200 block text-[11px] leading-tight max-w-[110px] truncate">
                  {currentUser.name}
                </span>
                <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" /> Person Data
                </span>
              </div>
            </div>
          )}

          {/* Exit to Login Page Button */}
          <button
            type="button"
            id="header-exit-btn"
            onClick={onExitToLogin}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl border border-transparent hover:border-neutral-800 transition-colors cursor-pointer"
            title="Log out & return to login screen"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};

import React from 'react';
import { Truck, Car, AlertTriangle } from 'lucide-react';
import { VehicleCategory } from '../types';

interface VehicleSelectorProps {
  activeCategory: VehicleCategory;
  onChange: (category: VehicleCategory) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({ activeCategory, onChange }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div 
        id="dual-segment-mode-selector"
        className="h-12 bg-neutral-900 border border-neutral-800 rounded-2xl p-1 flex items-center gap-1 shadow-inner relative"
      >
        {/* Car Segment */}
        <button
          type="button"
          id="mode-selector-car"
          onClick={() => onChange('car')}
          className={`h-full px-4 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 relative cursor-pointer ${
            activeCategory === 'car'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <Car className="w-4 h-4 text-sky-300" />
          <span className="whitespace-nowrap">Car / Sprinter Van</span>
        </button>

        {/* Heavy Duty Truck Segment */}
        <button
          type="button"
          id="mode-selector-truck"
          onClick={() => onChange('truck')}
          className={`h-full px-4 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 relative cursor-pointer ${
            activeCategory === 'truck'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <Truck className="w-4 h-4 text-amber-300" />
          <span className="whitespace-nowrap">Heavy Duty Truck / Semi</span>
          
          {/* Truck Active Modifier: 2px Amber accent line along the base */}
          {activeCategory === 'truck' && (
            <span className="absolute bottom-1 left-3 right-3 h-[2px] bg-amber-400 rounded-full" />
          )}
        </button>
      </div>

      {activeCategory === 'truck' && (
        <div className="hidden lg:flex items-center space-x-2 text-[11px] text-amber-300 bg-amber-950/60 border border-amber-800/60 px-3 py-2 rounded-2xl font-spec font-medium">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>COMMERCIAL CLEARANCE ACTIVE (≥13'6" / 53' TRAILER BAYS)</span>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { ShieldCheck, MapPin, Zap, Ruler, Shield, Maximize2, Check, ArrowRight, Eye, Navigation, UserCheck } from 'lucide-react';
import { ParkingLot, VehicleCategory } from '../types';

interface LotCardProps {
  lot: ParkingLot;
  activeVehicle: VehicleCategory;
  isSelected?: boolean;
  onSelect: (lot: ParkingLot) => void;
  onBook: (lot: ParkingLot) => void;
}

export const LotCard: React.FC<LotCardProps> = ({
  lot,
  activeVehicle,
  isSelected,
  onSelect,
  onBook,
}) => {
  const isTruck = activeVehicle === 'truck';

  return (
    <div
      id={`lot-card-${lot.id}`}
      onClick={() => onSelect(lot)}
      className={`bg-neutral-900 rounded-2xl border transition-all cursor-pointer overflow-hidden text-white ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-xl'
          : 'border-neutral-800 hover:border-neutral-700 hover:shadow-lg'
      }`}
    >
      {/* Top Banner: Owner Rate in INR & Instant Status */}
      <div className="bg-neutral-950/90 border-b border-neutral-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-baseline space-x-2">
          <span className="text-xl font-black text-white font-spec">
            ₹{lot.ratePerNight}
          </span>
          <span className="text-xs text-neutral-400 font-medium">/ night</span>
          <span className="text-xs text-emerald-400 font-spec font-bold">
            (₹{lot.ratePerHour}/hr)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {lot.isInstantAccess && (
            <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full font-spec">
              <Zap className="w-3 h-3 fill-current" />
              <span>INSTANT PASS</span>
            </span>
          )}
          <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full font-spec">
            {lot.availableBays} BAYS LEFT
          </span>
        </div>
      </div>

      {/* Media & Details Container */}
      <div className="p-4">
        <div className="flex gap-3 sm:gap-4">
          {/* Lot Thumbnail */}
          <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 relative border border-neutral-800 bg-neutral-950">
            <img
              src={lot.images[0]}
              alt={lot.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <span className="absolute bottom-1 right-1 bg-neutral-950/90 text-white border border-neutral-700 text-[10px] font-spec font-bold px-1.5 py-0.5 rounded-md">
              {lot.facilityCode}
            </span>
          </div>

          {/* Core Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <h3 className="text-base font-bold text-white truncate hover:text-blue-400 transition-colors">
                {lot.title}
              </h3>
            </div>

            <p className="text-xs text-neutral-400 flex items-center space-x-1 mt-0.5 mb-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span>{lot.corridor}</span>
            </p>

            <p className="text-[11px] text-neutral-400 mb-1.5 truncate">
              {lot.address}, {lot.city}, {lot.state} {lot.pincode ? `• PIN ${lot.pincode}` : ''}
            </p>

            {/* Distance from Driver and Owner tag */}
            <div className="flex flex-wrap items-center gap-2 mb-2 text-[11px]">
              {lot.distanceKm !== undefined && (
                <span className="inline-flex items-center space-x-1 text-blue-300 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded-md font-spec font-semibold">
                  <Navigation className="w-3 h-3 text-blue-400" />
                  <span>{lot.distanceKm} km away</span>
                </span>
              )}

              {lot.ownerName && (
                <span className="text-neutral-400 text-[10px] flex items-center space-x-1 truncate">
                  <UserCheck className="w-3 h-3 text-neutral-500" />
                  <span className="truncate">Operator: {lot.ownerName}</span>
                </span>
              )}
            </div>

            {/* Security & Amenity Check Indicators */}
            <div className="flex flex-wrap gap-1.5">
              {lot.amenities.slice(0, 2).map((amenity, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded-md text-[11px] font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="whitespace-nowrap truncate max-w-[150px]">{amenity}</span>
                </span>
              ))}
              {lot.amenities.length > 2 && (
                <span className="text-[10px] text-neutral-400 font-spec self-center font-bold">
                  +{lot.amenities.length - 2} more amenities
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center Block: Physical Dimension & Spec Badges */}
        <div className="mt-3.5 pt-3 border-t border-neutral-800/80 grid grid-cols-3 gap-2">
          {/* Clearance */}
          <div className="bg-neutral-950/60 border border-neutral-800 p-2 rounded-xl text-center">
            <span className="block text-[10px] font-semibold text-neutral-400 uppercase">Clearance</span>
            <span className="font-spec font-bold text-xs text-white">{lot.maxClearance}</span>
          </div>

          {/* Monthly Lease Rate */}
          <div className="bg-neutral-950/60 border border-neutral-800 p-2 rounded-xl text-center">
            <span className="block text-[10px] font-semibold text-neutral-400 uppercase">Monthly Lease</span>
            <span className="font-spec font-bold text-xs text-emerald-400">₹{lot.ratePerMonth}/mo</span>
          </div>

          {/* Surface Type */}
          <div className="bg-neutral-950/60 border border-neutral-800 p-2 rounded-xl text-center">
            <span className="block text-[10px] font-semibold text-neutral-400 uppercase">Surface</span>
            <span className="font-spec font-bold text-[11px] text-white truncate block px-0.5">{lot.surface}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-3.5 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(lot);
            }}
            className="flex-1 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-400" />
            <span>Facility Specs</span>
          </button>

          <button
            type="button"
            id={`book-btn-${lot.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onBook(lot);
            }}
            className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md transition-colors cursor-pointer"
          >
            <span>Book Staging Bay</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

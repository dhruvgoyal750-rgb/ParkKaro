import React, { useState } from 'react';
import { 
  X, ShieldCheck, MapPin, Zap, Check, ArrowRight, 
  Phone, User, Calendar, Clock, ChevronLeft, ChevronRight,
  Maximize2, Ruler, Lock, IndianRupee, Layers
} from 'lucide-react';
import { ParkingLot, VehicleCategory } from '../types';

interface LotDetailsModalProps {
  lot: ParkingLot | null;
  activeVehicle: VehicleCategory;
  onClose: () => void;
  onBook: (lot: ParkingLot) => void;
}

export const LotDetailsModal: React.FC<LotDetailsModalProps> = ({
  lot,
  activeVehicle,
  onClose,
  onBook,
}) => {
  if (!lot) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % lot.images.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + lot.images.length) % lot.images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        id="lot-details-modal-container"
        className="bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl max-w-3xl w-full my-6 overflow-hidden flex flex-col max-h-[92vh] text-white"
      >
        {/* Modal Header */}
        <div className="bg-neutral-950 px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <span className="bg-neutral-900 border border-neutral-700 text-blue-400 font-spec text-xs font-bold px-2.5 py-1 rounded-lg">
              {lot.facilityCode}
            </span>
            <h2 className="text-base sm:text-lg font-bold truncate">
              {lot.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Gallery Carousel */}
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 group shadow-inner">
            <img
              src={lot.images[activeImageIdx]}
              alt={`${lot.title} view ${activeImageIdx + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent pointer-events-none" />

            {/* Gallery Navigation Arrows */}
            {lot.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-950/80 text-white hover:bg-neutral-800 transition-colors border border-neutral-700 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-950/80 text-white hover:bg-neutral-800 transition-colors border border-neutral-700 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Indicator Pills */}
            <div className="absolute bottom-3 left-4 flex items-center space-x-1.5 z-10">
              {lot.images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    activeImageIdx === idx ? 'bg-blue-500 w-5' : 'bg-neutral-600 hover:bg-neutral-400'
                  }`}
                />
              ))}
            </div>

            {/* Floating Instant Access Badge */}
            <div className="absolute top-3 right-3 z-10 flex items-center space-x-2">
              {lot.isInstantAccess && (
                <span className="bg-amber-950/90 border border-amber-800/80 text-amber-300 text-xs font-bold px-3 py-1 rounded-full font-spec flex items-center space-x-1 shadow-lg">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>INSTANT GATE PASS</span>
                </span>
              )}
            </div>

            {/* Address Banner on image */}
            <div className="absolute bottom-3 right-4 z-10 text-right">
              <span className="text-xs text-neutral-300 font-medium block">
                {lot.address}, {lot.city}, {lot.state} {lot.pincode ? `• PIN ${lot.pincode}` : ''}
              </span>
              <span className="text-[11px] text-blue-400 font-spec font-bold">
                {lot.corridor}
              </span>
            </div>
          </div>

          {/* Pricing & Key Metrics Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Daily / Nightly Rate */}
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 shadow-inner">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Daily / 24-Hr Rate
              </span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-black text-white font-spec">₹{lot.ratePerNight}</span>
                <span className="text-xs text-neutral-400">/day</span>
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 shadow-inner">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Hourly Staging
              </span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-black text-white font-spec">₹{lot.ratePerHour}</span>
                <span className="text-xs text-neutral-400">/hr</span>
              </div>
            </div>

            {/* Monthly Lease */}
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 shadow-inner">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Monthly Fleet Lease
              </span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-black text-emerald-400 font-spec">₹{lot.ratePerMonth}</span>
                <span className="text-xs text-neutral-400">/mo</span>
              </div>
            </div>

            {/* Available Bays */}
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 shadow-inner">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Live Availability
              </span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-black text-emerald-400 font-spec">{lot.availableBays}</span>
                <span className="text-xs text-neutral-400">/ {lot.totalBays} Bays</span>
              </div>
            </div>
          </div>

          {/* Lot Size, Dimensions, and Operating Hours */}
          <div className="bg-neutral-950/60 border border-neutral-800 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-neutral-400 font-medium block">Yard Dimensions & Area</span>
              <div className="font-bold text-white font-spec mt-1">
                {lot.lotSize ? `${lot.lotSize.areaSqFt.toLocaleString()} sq ft` : '45,000 sq ft'}
              </div>
              <span className="text-[11px] text-neutral-400 font-spec">
                {lot.lotSize?.dimensions || '200ft x 225ft paved apron'}
              </span>
            </div>

            <div className="sm:border-l sm:border-neutral-800 sm:pl-4">
              <span className="text-neutral-400 font-medium block">Operating Days & Hours</span>
              <div className="font-bold text-emerald-400 mt-1">
                {lot.availability?.days || 'All 7 Days (24x7)'}
              </div>
              <span className="text-[11px] text-neutral-400">
                {lot.availability?.hours || 'Round-the-clock entry & exit'}
              </span>
            </div>

            <div className="sm:border-l sm:border-neutral-800 sm:pl-4">
              <span className="text-neutral-400 font-medium block">Vehicle Clearance & Surface</span>
              <div className="font-bold text-white mt-1">
                {lot.maxClearance} Clearance
              </div>
              <span className="text-[11px] text-neutral-400">
                {lot.surface} • Max Length {lot.maxVehicleLength}
              </span>
            </div>
          </div>

          {/* Security & Access Infrastructure */}
          <div>
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
              Perimeter Security & Automated Gate Infrastructure
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lot.securityFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2.5 p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-xl text-xs font-semibold text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities & Driver Facilities */}
          <div>
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
              Yard Amenities & Driver Comfort
            </h4>
            <div className="flex flex-wrap gap-2">
              {lot.amenities.map((amenity, idx) => (
                <span key={idx} className="px-3.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-medium text-neutral-300 flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{amenity}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Yard Entry Instructions & Owner Contact */}
          <div className="bg-blue-950/40 border border-blue-900/60 p-4 rounded-2xl text-xs space-y-1.5">
            <h5 className="font-bold text-blue-300 text-xs uppercase tracking-wide flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Operator Entry Protocol</span>
            </h5>
            <p className="text-neutral-300 leading-relaxed">
              {lot.entryProtocol}
            </p>
            <p className="text-neutral-400 pt-1">
              Yard Dispatch Contact: <strong className="text-white font-spec">{lot.contactPhone}</strong> ({lot.ownerName})
            </p>
          </div>

          {/* Modal Footer CTA */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-xs font-bold text-neutral-300 transition-colors cursor-pointer"
            >
              Back to Explorer
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onBook(lot);
              }}
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg transition-colors cursor-pointer"
            >
              <span>Proceed to Bay Reservation (₹{lot.ratePerNight}/nt)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Zap, Clock, Calendar, Truck, Car, CheckCircle2, AlertTriangle, ArrowRight, KeyRound, IndianRupee } from 'lucide-react';
import { ParkingLot, VehicleCategory, Booking } from '../types';

interface BookingModalProps {
  lot: ParkingLot | null;
  activeVehicle: VehicleCategory;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  lot,
  activeVehicle,
  onClose,
  onConfirmBooking,
}) => {
  if (!lot) return null;

  const isTruck = activeVehicle === 'truck';

  // Booking form state: 'night' (Daily), 'hours' (Hourly), 'month' (Monthly Lease)
  const [durationMode, setDurationMode] = useState<'night' | 'hours' | 'month'>('night');
  const [nights, setNights] = useState<number>(1);
  const [hours, setHours] = useState<number>(4);
  const [months, setMonths] = useState<number>(1);

  const [selectedBay, setSelectedBay] = useState<string>(
    lot.spaces.find(s => s.status === 'available')?.bayNumber || 'Bay A-01'
  );
  const [driverName, setDriverName] = useState('Rajesh Sharma');
  const [driverPhone, setDriverPhone] = useState('+91 98201 54321');
  const [vehiclePlate, setVehiclePlate] = useState(isTruck ? 'MH-46-AR-8812' : 'MH-02-CB-1994');
  const [vehicleModel, setVehicleModel] = useState(
    isTruck ? 'Tata Signa 5530.S (16-Wheeler Combo)' : 'Mahindra Bolero Maxi Truck / EV'
  );

  // Pricing calculation in Indian Rupees
  const totalAmount = durationMode === 'night' 
    ? lot.ratePerNight * nights 
    : durationMode === 'hours'
    ? lot.ratePerHour * hours
    : lot.ratePerMonth * months;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate simulated gate code & QR token
    const randomPin = Math.floor(1000 + Math.random() * 9000);
    const gateCode = `#${randomPin}*`;
    const qrToken = `PARKKARO-${lot.facilityCode}-${randomPin}-${Date.now().toString().slice(-4)}`;

    const endTimeLabel = durationMode === 'night'
      ? `${nights} Night(s) Checkout 11:00 AM`
      : durationMode === 'hours'
      ? `${hours} Hours Duration`
      : `${months} Month(s) Active Lease`;

    const newBooking: Booking = {
      id: `bk-${Date.now().toString().slice(-6)}`,
      lotId: lot.id,
      lotTitle: lot.title,
      facilityCode: lot.facilityCode,
      address: `${lot.address}, ${lot.city}, ${lot.state}`,
      bayNumber: selectedBay,
      vehicleCategory: activeVehicle,
      vehiclePlate,
      vehicleModel,
      driverName,
      driverPhone,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: endTimeLabel,
      totalAmount,
      gateCode,
      qrToken,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    onConfirmBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        id="booking-modal-container"
        className="bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl max-w-2xl w-full my-6 overflow-hidden flex flex-col max-h-[92vh] text-white"
      >
        {/* Header */}
        <div className="bg-neutral-950 border-b border-neutral-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="bg-blue-600 text-white text-[11px] font-spec font-bold px-2.5 py-0.5 rounded-lg shadow">
              {lot.facilityCode}
            </span>
            <h2 className="text-base sm:text-lg font-bold truncate">
              Reserve Parking Bay • {lot.title}
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

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-5">
          
          {/* Top Lot Summary Strip */}
          <div className="bg-neutral-950/70 border border-neutral-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-inner">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-900 border border-neutral-800">
                <img src={lot.images[0]} alt={lot.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs text-blue-400 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{lot.corridor}</span>
                </p>
                <h3 className="font-bold text-sm text-white">{lot.title}</h3>
                <p className="text-xs text-neutral-400">{lot.address}, {lot.city}, {lot.state}</p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-neutral-800 sm:pl-5 self-stretch sm:self-auto flex sm:flex-col justify-between sm:justify-center items-end">
              <span className="text-xs text-neutral-400">Owner Set Rate</span>
              <span className="text-xl font-black text-white font-spec">
                ₹{lot.ratePerNight} <span className="text-xs font-normal text-neutral-400">/night</span>
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Staging Bay & Duration Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Duration Segment */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Rental Duration
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setDurationMode('night')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
                      durationMode === 'night' 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationMode('hours')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
                      durationMode === 'hours' 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Hourly
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationMode('month')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
                      durationMode === 'month' 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                </div>

                <div className="mt-2.5">
                  {durationMode === 'night' && (
                    <div className="flex items-center space-x-2">
                      <label className="text-xs text-neutral-400">Nights:</label>
                      <select
                        value={nights}
                        onChange={(e) => setNights(Number(e.target.value))}
                        className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-bold font-spec text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value={1} className="bg-neutral-900">1 Night (₹{lot.ratePerNight})</option>
                        <option value={2} className="bg-neutral-900">2 Nights (₹{lot.ratePerNight * 2})</option>
                        <option value={3} className="bg-neutral-900">3 Nights (₹{lot.ratePerNight * 3})</option>
                        <option value={7} className="bg-neutral-900">7 Nights / 1 Week (₹{lot.ratePerNight * 7})</option>
                      </select>
                    </div>
                  )}

                  {durationMode === 'hours' && (
                    <div className="flex items-center space-x-2">
                      <label className="text-xs text-neutral-400">Hours:</label>
                      <select
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-bold font-spec text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value={2} className="bg-neutral-900">2 Hours (₹{lot.ratePerHour * 2})</option>
                        <option value={4} className="bg-neutral-900">4 Hours (₹{lot.ratePerHour * 4})</option>
                        <option value={8} className="bg-neutral-900">8 Hours (₹{lot.ratePerHour * 8})</option>
                        <option value={12} className="bg-neutral-900">12 Hours (₹{lot.ratePerHour * 12})</option>
                      </select>
                    </div>
                  )}

                  {durationMode === 'month' && (
                    <div className="flex items-center space-x-2">
                      <label className="text-xs text-neutral-400">Months:</label>
                      <select
                        value={months}
                        onChange={(e) => setMonths(Number(e.target.value))}
                        className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1 text-xs font-bold font-spec text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value={1} className="bg-neutral-900">1 Month (₹{lot.ratePerMonth})</option>
                        <option value={3} className="bg-neutral-900">3 Months (₹{lot.ratePerMonth * 3})</option>
                        <option value={6} className="bg-neutral-900">6 Months (₹{lot.ratePerMonth * 6})</option>
                        <option value={12} className="bg-neutral-900">12 Months / 1 Year (₹{lot.ratePerMonth * 12})</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Bay Number Selection */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Select Staging Bay / Space
                </label>
                <select
                  value={selectedBay}
                  onChange={(e) => setSelectedBay(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-spec font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Bay A-01" className="bg-neutral-900">Bay A-01 (75ft Multi-Axle Full Trailer Bay - Ready)</option>
                  <option value="Bay A-03" className="bg-neutral-900">Bay A-03 (75ft Reefer 3-Phase Shore Power Bay)</option>
                  <option value="Bay B-01" className="bg-neutral-900">Bay B-01 (40ft Medium Truck / Container Bay)</option>
                  <option value="Slot P-05" className="bg-neutral-900">Slot P-05 (Fleet Van / Car / EV Charging Spot)</option>
                </select>
                <span className="block text-[11px] text-emerald-400 mt-1.5 font-medium">
                  • Instant electronic Fastag / QR gate pass generated upon submit
                </span>
              </div>

            </div>

            {/* Vehicle & Driver Credentials */}
            <div className="pt-3.5 border-t border-neutral-800 space-y-3">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Vehicle & Driver Credentials
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                    Vehicle Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-spec font-bold text-white uppercase focus:outline-none focus:border-blue-500"
                    placeholder="e.g. MH-46-AR-8812"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                    Vehicle Model / Configuration
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Tata Signa 5530.S or BharatBenz 2823R"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                    Driver Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                    Mobile Number (For Gate Access SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-spec text-white focus:outline-none focus:border-blue-500"
                    placeholder="+91 98200 00000"
                  />
                </div>
              </div>
            </div>

            {/* Total Cost & Immediate Access Guarantee */}
            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl flex items-center justify-between shadow-inner">
              <div>
                <span className="text-xs text-amber-400 font-bold block">Total Amount Due</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-white font-spec">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">INR</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  NO HIDDEN FEES
                </span>
                <p className="text-[11px] text-neutral-400">Includes 24/7 Security & Keypad Gate Access</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                id="confirm-booking-btn"
                className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Confirm & Generate Gate Pass</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

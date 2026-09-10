import React from 'react';
import { X, QrCode, KeyRound, MapPin, ExternalLink, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { Booking } from '../types';

interface ActivePassesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
}

export const ActivePassesDrawer: React.FC<ActivePassesDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  onSelectBooking,
  onCancelBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col text-white">
          
          {/* Header */}
          <div className="bg-neutral-950 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center space-x-2.5">
              <QrCode className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold">Active Digital Passes</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-14 h-14 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-500 flex items-center justify-center mx-auto mb-3.5 shadow-inner">
                  <KeyRound className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-bold text-sm text-white mb-1">No Active Passes</h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  When you reserve a staging bay, your automated keypad PIN and digital barcode pass will appear here.
                </p>
              </div>
            ) : (
              bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-4 relative hover:border-neutral-700 transition-colors shadow-inner"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="bg-blue-600 text-white text-[10px] font-spec font-bold px-2 py-0.5 rounded-lg shadow-sm">
                        {b.facilityCode}
                      </span>
                      <h4 className="font-bold text-sm text-white mt-1.5">
                        {b.lotTitle}
                      </h4>
                    </div>

                    <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-800/80 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>CONFIRMED</span>
                    </span>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl my-2.5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase block">Gate Keypad PIN</span>
                      <span className="text-xl font-black font-spec text-amber-400 tracking-wider">
                        {b.gateCode}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 uppercase block">Assigned Space</span>
                      <span className="text-sm font-bold font-spec text-white">
                        {b.bayNumber}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 flex items-center space-x-1.5 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{b.address}</span>
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectBooking(b)}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow transition-colors cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Full Pass</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onCancelBooking(b.id)}
                      className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-950/40 rounded-xl border border-transparent hover:border-red-900/60 transition-colors cursor-pointer"
                      title="Cancel Reservation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

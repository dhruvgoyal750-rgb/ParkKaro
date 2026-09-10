import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, Copy, Check, Navigation, Shield, Phone, AlertCircle, Printer, Download } from 'lucide-react';
import { Booking } from '../types';

interface GatePassModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const GatePassModal: React.FC<GatePassModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(booking.gateCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        id="gate-pass-modal-container"
        className="bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl max-w-md w-full my-6 overflow-hidden flex flex-col text-white"
      >
        {/* Pass Header */}
        <div className="bg-neutral-950 px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div>
            <span className="text-[10px] font-spec font-bold text-blue-400 tracking-wider block">
              PARKKARO DIGITAL ACCESS PASS
            </span>
            <h2 className="text-base font-extrabold tracking-tight text-white">
              Gate Clearance Authorization
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

        {/* Pass Content */}
        <div className="p-6 space-y-4">
          
          {/* Status Ribbon */}
          <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ACCESS VERIFIED • ACTIVE</span>
            </div>
            <span className="font-spec font-bold text-emerald-300 text-[11px]">
              ID: {booking.id.toUpperCase()}
            </span>
          </div>

          {/* Large Gate Code Highlight */}
          <div className="bg-neutral-950 text-white rounded-2xl p-5 text-center relative border border-neutral-800 shadow-inner">
            <span className="text-[11px] font-spec text-neutral-400 uppercase tracking-wider block mb-1">
              AUTOMATED GATE ENTRY PIN
            </span>
            <div className="text-3xl sm:text-4xl font-black font-spec text-amber-400 tracking-widest my-1.5">
              {booking.gateCode}
            </div>
            <p className="text-[11px] text-neutral-400 mb-3">
              Key in at entry keypad followed by pound sign (#)
            </p>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white rounded-xl border border-neutral-700 transition-colors cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Keypad Code'}</span>
            </button>
          </div>

          {/* Staging Bay & Facility Details */}
          <div className="border border-neutral-800 rounded-2xl p-4 bg-neutral-950/70 space-y-2.5 text-xs shadow-inner">
            <div className="flex justify-between pb-2 border-b border-neutral-800">
              <span className="text-neutral-400 font-medium">Assigned Staging Space:</span>
              <span className="font-bold text-white font-spec text-sm bg-neutral-900 px-2.5 py-0.5 rounded-lg border border-neutral-700">
                {booking.bayNumber}
              </span>
            </div>

            <div className="flex justify-between pb-2 border-b border-neutral-800">
              <span className="text-neutral-400 font-medium">Facility Name:</span>
              <span className="font-bold text-white text-right truncate max-w-[200px]">
                {booking.lotTitle}
              </span>
            </div>

            <div className="flex justify-between pb-2 border-b border-neutral-800">
              <span className="text-neutral-400 font-medium">Physical Address:</span>
              <span className="font-medium text-neutral-300 text-right truncate max-w-[200px]">
                {booking.address}
              </span>
            </div>

            <div className="flex justify-between pb-2 border-b border-neutral-800">
              <span className="text-neutral-400 font-medium">Vehicle / License:</span>
              <span className="font-spec font-bold text-white">
                {booking.vehiclePlate} ({booking.vehicleModel})
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-400 font-medium">Driver & Phone:</span>
              <span className="font-medium text-neutral-300">
                {booking.driverName} • {booking.driverPhone}
              </span>
            </div>
          </div>

          {/* Visual QR Code Scanner Pattern */}
          <div className="border border-neutral-800 rounded-2xl p-4 flex items-center justify-center bg-neutral-950">
            <div className="text-center">
              {/* Stylized QR representation */}
              <div className="w-28 h-28 mx-auto bg-neutral-900 p-2.5 rounded-xl flex flex-wrap gap-1 items-center justify-center border border-neutral-800 shadow-inner">
                <div className="w-full h-full bg-white p-1.5 flex flex-col justify-between rounded">
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-2 border-black p-0.5"><div className="w-full h-full bg-black"></div></div>
                    <div className="w-2 h-2 bg-black"></div>
                    <div className="w-6 h-6 border-2 border-black p-0.5"><div className="w-full h-full bg-black"></div></div>
                  </div>
                  <div className="flex justify-around my-1">
                    <div className="w-2 h-2 bg-black"></div>
                    <div className="w-3 h-3 bg-black"></div>
                    <div className="w-1 h-1 bg-black"></div>
                    <div className="w-2 h-2 bg-black"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-2 border-black p-0.5"><div className="w-full h-full bg-black"></div></div>
                    <div className="w-2 h-2 bg-black"></div>
                    <div className="w-4 h-4 bg-black"></div>
                  </div>
                </div>
              </div>
              <span className="block font-spec text-[10px] text-neutral-400 mt-2">
                Scan at Security Kiosk Scanner or Barcode Arm
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-950/40 border border-blue-900/60 p-3 rounded-xl text-[11px] text-neutral-300 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-blue-300">
              <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Yard Safety Protocol:</span>
            </div>
            <p>
              1. Pull into designated approach lane at Gate 2. Avoid blocking outbound egress.
            </p>
            <p>
              2. Keep high-visibility vest on while outside truck cab. 10 MPH max yard speed limit.
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-xs font-bold text-white flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-400" />
              <span>Print Pass</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow transition-colors cursor-pointer"
            >
              <span>Done / Stored to Active</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

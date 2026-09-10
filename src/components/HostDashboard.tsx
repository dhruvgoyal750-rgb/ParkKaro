import React, { useState } from 'react';
import { 
  Warehouse, TrendingUp, Users, IndianRupee, Clock, ShieldCheck, 
  Plus, Search, Filter, AlertTriangle, CheckCircle2, ChevronRight, 
  RefreshCw, KeyRound, ExternalLink, MapPin, Truck, Car, Radio,
  Edit3, Eye, Check, Sparkles
} from 'lucide-react';
import { ParkingLot, CheckInRecord } from '../types';
import { UserProfile } from './LoginPage';

interface HostDashboardProps {
  lots: ParkingLot[];
  checkIns: CheckInRecord[];
  currentUser?: UserProfile | null;
  onOpenAddLot: () => void;
  onEditLot?: (lot: ParkingLot) => void;
  onViewOnMap?: (lot: ParkingLot) => void;
  onUpdateCheckInStatus: (id: string, newStatus: CheckInRecord['status']) => void;
  onGenerateOverridePin: (record: CheckInRecord) => void;
}

export const HostDashboard: React.FC<HostDashboardProps> = ({
  lots,
  checkIns,
  currentUser,
  onOpenAddLot,
  onEditLot,
  onViewOnMap,
  onUpdateCheckInStatus,
  onGenerateOverridePin,
}) => {
  const [selectedLotId, setSelectedLotId] = useState<string>(lots[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'table' | 'blueprint' | 'yards'>('table');

  const currentLot = lots.find(l => l.id === selectedLotId) || lots[0];

  // Person-to-person accurate calculations
  const totalBays = lots.reduce((acc, l) => acc + l.totalBays, 0);
  const availableBays = lots.reduce((acc, l) => acc + l.availableBays, 0);
  const occupiedBays = Math.max(0, totalBays - availableBays);
  const occupancyPercentage = totalBays > 0 ? Math.round((occupiedBays / totalBays) * 100) : 0;
  
  // Real revenue strictly from this host's check-ins
  const todayRevenue = checkIns.reduce((acc, c) => acc + c.feePaid, 0);
  const activeCheckinsCount = checkIns.filter(c => c.status === 'Checked In').length;
  const enRouteCount = checkIns.filter(c => c.status === 'En Route').length;
  const overstayCount = checkIns.filter(c => c.status === 'Overstay').length;

  const filteredRecords = checkIns.filter(r => {
    const matchesSearch = 
      r.bayNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.carrierOrPlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Facility Selector Strip */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-neutral-800 text-white flex items-center justify-center flex-shrink-0 shadow-inner">
            <Warehouse className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Yard Operations Control Center
              </h1>
              <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-spec text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ISOLATED HOST WORKSPACE</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Managing inventory for <strong className="text-white">{currentUser?.name || 'Operator'}</strong> ({currentUser?.emailOrPhone || 'Host Account'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Active Facility Dropdown */}
          {lots.length > 0 ? (
            <select
              value={selectedLotId}
              onChange={(e) => setSelectedLotId(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {lots.map(l => (
                <option key={l.id} value={l.id} className="bg-neutral-900 text-white">
                  {l.facilityCode} • {l.title} ({l.availableBays} bays free)
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-neutral-400 font-mono bg-neutral-950 border border-neutral-800 px-3 py-2 rounded-xl">
              0 Yards Listed
            </div>
          )}

          {/* Edit Current Yard Button */}
          {currentLot && (
            <button
              type="button"
              onClick={() => onEditLot?.(currentLot)}
              id="host-edit-current-lot-btn"
              className="py-2 px-3.5 bg-neutral-800 hover:bg-neutral-750 hover:border-amber-500/60 text-amber-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-neutral-700 shadow-md transition-all whitespace-nowrap cursor-pointer"
              title={`Edit ${currentLot.title} specs, actual coordinates, or rates`}
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit Yard</span>
            </button>
          )}

          {/* List New Yard Button */}
          <button
            type="button"
            onClick={onOpenAddLot}
            id="host-list-new-lot-btn"
            className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{lots.length === 0 ? 'List Your First Staging Yard' : 'Rent Another Space'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid (Bento Tiles) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Occupancy Rate */}
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 font-medium">
            <span>Yard Occupancy</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black font-spec text-white">
              {occupancyPercentage}%
            </span>
            <span className="text-xs text-neutral-400 font-spec">
              ({occupiedBays}/{totalBays} Bays)
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-950 rounded-full mt-3 overflow-hidden border border-neutral-800">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all" 
              style={{ width: `${occupancyPercentage}%` }} 
            />
          </div>
        </div>

        {/* Today's Gross Payouts */}
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 font-medium">
            <span>Today's Staging Payouts</span>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black font-spec text-white">
              ₹{todayRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-emerald-400 font-bold">+18.4%</span>
          </div>
          <span className="text-[11px] text-neutral-400 block mt-1">Direct daily NEFT / UPI settlement</span>
        </div>

        {/* Active Commercial Rigs on Tarmac */}
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 font-medium">
            <span>Active Staged Vehicles</span>
            <Truck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black font-spec text-white">
              {activeCheckinsCount}
            </span>
            <span className="text-xs text-neutral-400">Checked In</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium block mt-1">
            {enRouteCount} Inbound En Route
          </span>
        </div>

        {/* Overstay / Security Flags */}
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 font-medium">
            <span>Overstay Flags</span>
            <AlertTriangle className={`w-4 h-4 ${overstayCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black font-spec text-white">
              {overstayCount}
            </span>
            <span className="text-xs text-neutral-400">Rig(s)</span>
          </div>
          <span className="text-[11px] text-amber-400 font-medium block mt-1">
            {overstayCount > 0 ? 'Auto-billing extended rate' : 'All spaces on schedule'}
          </span>
        </div>

      </div>

      {/* Main Control Panel or Empty State */}
      {lots.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center max-w-2xl mx-auto my-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-950/30">
            <Warehouse className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Staging Yards Listed Yet</h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
            Welcome, <strong className="text-white">{currentUser?.name || currentUser?.emailOrPhone || 'Host'}</strong>. Under ParkKaro's person-to-person data isolation, this account starts fresh with only data stored by you. Add your commercial lot, staging apron, or empty parking space to begin receiving truck and vehicle reservations.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left mb-6 text-xs text-neutral-300">
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
              <span className="font-bold text-emerald-400 block mb-1">0% Platform Fee</span>
              <span className="text-[11px] text-neutral-400 leading-tight block">Direct UPI & IMPS payouts straight to your bank account.</span>
            </div>
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
              <span className="font-bold text-blue-400 block mb-1">Automated Keypad</span>
              <span className="text-[11px] text-neutral-400 leading-tight block">Generate instant digital gate PINs and QR tokens for drivers.</span>
            </div>
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
              <span className="font-bold text-amber-400 block mb-1">Corridor Pinpointing</span>
              <span className="text-[11px] text-neutral-400 leading-tight block">Precise GPS coordinates on major industrial freight corridors.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenAddLot}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>List Your First Staging Yard Now</span>
          </button>
        </div>
      ) : (
      /* Main Control Panel with View Toggle (Table vs Blueprint vs Yards) */
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Table & Blueprint Switcher Header */}
        <div className="p-4 sm:px-6 bg-neutral-950/80 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex rounded-xl bg-neutral-900 p-1 border border-neutral-800">
              <button
                type="button"
                onClick={() => setActiveTab('table')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'table' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Host Tabular Data Grid
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('blueprint')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'blueprint' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Live Yard Blueprint Matrix
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('yards')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'yards' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>My Listed Yards</span>
                <span className="bg-neutral-800 text-neutral-200 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {lots.length}
                </span>
              </button>
            </div>

            <span className="text-xs text-neutral-400 hidden md:inline">
              Showing {filteredRecords.length} Active Records
            </span>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bay, plate, driver..."
                className="bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 w-44 sm:w-56"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-medium text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all" className="bg-neutral-900">All Statuses</option>
              <option value="Checked In" className="bg-neutral-900">Checked In</option>
              <option value="En Route" className="bg-neutral-900">En Route</option>
              <option value="Overstay" className="bg-neutral-900">Overstay</option>
              <option value="Reserved" className="bg-neutral-900">Reserved</option>
            </select>
          </div>
        </div>

        {/* Tab 1: HOST TABULAR DATA GRID */}
        {activeTab === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950 text-[11px] font-bold text-neutral-400 uppercase font-spec">
                  <th className="py-3.5 px-4">Staging Bay</th>
                  <th className="py-3.5 px-4">Vehicle Specs</th>
                  <th className="py-3.5 px-4">Carrier & Plate</th>
                  <th className="py-3.5 px-4">Driver Contact</th>
                  <th className="py-3.5 px-4">Schedule (Arr/Dep)</th>
                  <th className="py-3.5 px-4">Gate PIN</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-xs text-neutral-300">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-neutral-500">
                      No vehicle records match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr 
                      key={record.id}
                      className="hover:bg-neutral-800/50 transition-colors"
                    >
                      {/* Bay Number */}
                      <td className="py-3.5 px-4 font-spec font-bold text-white">
                        <span className="bg-neutral-950 border border-neutral-800 px-2.5 py-1 rounded-lg">
                          {record.bayNumber}
                        </span>
                      </td>

                      {/* Vehicle Specs */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{record.vehicleType}</div>
                        <div className="text-[11px] text-neutral-400 font-spec">{record.dimensions}</div>
                      </td>

                      {/* Carrier & License Plate */}
                      <td className="py-3.5 px-4">
                        <div className="font-spec font-bold text-white">{record.carrierOrPlate}</div>
                        <div className="text-[10px] text-emerald-400 font-semibold">Insurance & DOT Verified</div>
                      </td>

                      {/* Driver Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{record.driverName}</div>
                        <div className="text-[11px] text-neutral-400 font-spec">{record.driverPhone}</div>
                      </td>

                      {/* Arrival & Departure */}
                      <td className="py-3.5 px-4">
                        <div className="text-white font-medium">{record.arrival}</div>
                        <div className="text-[11px] text-neutral-400">{record.departure}</div>
                      </td>

                      {/* Gate PIN */}
                      <td className="py-3.5 px-4">
                        <span className="bg-neutral-950 text-amber-400 border border-neutral-800 font-spec font-black text-xs px-2.5 py-1 rounded-lg shadow-inner">
                          {record.gatePassCode}
                        </span>
                      </td>

                      {/* Status Pill */}
                      <td className="py-3.5 px-4">
                        {record.status === 'Checked In' && (
                          <span className="inline-flex items-center space-x-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>Checked In</span>
                          </span>
                        )}
                        {record.status === 'En Route' && (
                          <span className="inline-flex items-center space-x-1.5 bg-blue-950/80 text-blue-300 border border-blue-800/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            <span>En Route</span>
                          </span>
                        )}
                        {record.status === 'Overstay' && (
                          <span className="inline-flex items-center space-x-1.5 bg-red-950/80 text-red-300 border border-red-800/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                            <span>Overstay</span>
                          </span>
                        )}
                        {record.status === 'Reserved' && (
                          <span className="inline-flex items-center space-x-1.5 bg-amber-950/80 text-amber-300 border border-amber-800/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>Reserved</span>
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          {record.status === 'Checked In' && (
                            <button
                              type="button"
                              onClick={() => onUpdateCheckInStatus(record.id, 'Reserved')}
                              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Mark Departure"
                            >
                              Check Out
                            </button>
                          )}
                          {record.status === 'En Route' && (
                            <button
                              type="button"
                              onClick={() => onUpdateCheckInStatus(record.id, 'Checked In')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Confirm In
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onGenerateOverridePin(record)}
                            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                            title="Issue New Gate PIN"
                          >
                            New PIN
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: LIVE YARD BLUEPRINT MATRIX */}
        {activeTab === 'blueprint' && (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
              <div>
                <h3 className="font-bold text-sm text-white">
                  Tarmac Staging Layout • {currentLot.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Click any bay to toggle availability or view tractor-trailer assignments.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center space-x-4 text-[11px] font-spec">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 bg-emerald-500 rounded-xs" />
                  <span className="text-neutral-300">Available</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 bg-neutral-800 border border-neutral-700 rounded-xs" />
                  <span className="text-neutral-300">Occupied Rig</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 bg-amber-500 rounded-xs" />
                  <span className="text-neutral-300">Inbound / Reserved</span>
                </div>
              </div>
            </div>

            {/* Grid of Staging Bays */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {[
                { bay: 'Bay A-01', status: 'available', size: '75ft Combo' },
                { bay: 'Bay A-02', status: 'occupied', size: '75ft Combo', plate: 'MH-46-AR-8812' },
                { bay: 'Bay A-03', status: 'available', size: '75ft Combo' },
                { bay: 'Bay A-04', status: 'occupied', size: '75ft Combo', plate: 'HR-55-AN-9921' },
                { bay: 'Bay A-05', status: 'available', size: '75ft Combo' },
                { bay: 'Bay A-06', status: 'reserved', size: '75ft Combo', plate: 'DL-1M-AA-4200' },
                { bay: 'Bay B-01', status: 'available', size: '40ft Container' },
                { bay: 'Bay B-02', status: 'available', size: '40ft Container' },
                { bay: 'Bay B-03', status: 'occupied', size: '40ft Container', plate: 'KA-01-MJ-3304' },
                { bay: 'Bay B-04', status: 'reserved', size: '40ft Container' },
                { bay: 'Slot P-01', status: 'available', size: 'EV / LCV Space' },
                { bay: 'Slot P-02', status: 'occupied', size: 'EV / LCV Space', plate: 'MH-02-CB-1994' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    item.status === 'available'
                      ? 'bg-emerald-950/30 border-emerald-600/40 hover:border-emerald-500 text-emerald-300'
                      : item.status === 'occupied'
                      ? 'bg-neutral-950 border-neutral-800 text-white'
                      : 'bg-amber-950/30 border-amber-600/40 text-amber-300'
                  }`}
                >
                  <span className={`text-xs font-spec font-bold block ${item.status === 'occupied' ? 'text-white' : ''}`}>
                    {item.bay}
                  </span>
                  <span className="text-[10px] block mt-0.5 text-neutral-400">
                    {item.size}
                  </span>
                  <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full font-spec ${
                    item.status === 'available'
                      ? 'bg-emerald-500 text-neutral-950 font-black'
                      : item.status === 'occupied'
                      ? 'bg-neutral-800 text-blue-400 border border-neutral-700'
                      : 'bg-amber-500 text-neutral-950 font-black'
                  }`}>
                    {item.status === 'occupied' ? item.plate : item.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: MY LISTED YARDS & LOTS (EDIT & MANAGE) */}
        {activeTab === 'yards' && (
          <div className="p-4 sm:p-6 space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Warehouse className="w-4 h-4 text-blue-400" />
                  <span>My Managed Parking Yards & Staging Lots ({lots.length})</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Manage capacity, surface engineering specs, actual GPS pins, and pricing tiers.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenAddLot}
                className="py-1.5 px-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Rent Another Space</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {lots.map((lot) => {
                const isActive = lot.id === selectedLotId;
                return (
                  <div
                    key={lot.id}
                    className={`bg-neutral-950 rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                      isActive 
                        ? 'border-blue-500/80 shadow-lg shadow-blue-500/10' 
                        : 'border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start gap-3">
                        <img
                          src={lot.images[0]}
                          alt={lot.title}
                          className="w-20 h-20 rounded-xl object-cover border border-neutral-800 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="bg-neutral-900 border border-neutral-700 text-blue-400 font-spec text-[10px] font-bold px-2 py-0.5 rounded-lg">
                              {lot.facilityCode}
                            </span>
                            {isActive && (
                              <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>ACTIVE FACILITY</span>
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1 truncate">
                            {lot.title}
                          </h4>
                          <p className="text-xs text-neutral-400 truncate flex items-center space-x-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-neutral-500 flex-shrink-0" />
                            <span>{lot.address}, {lot.city}, {lot.state}</span>
                          </p>
                        </div>
                      </div>

                      {/* GPS & Corridor Pill */}
                      <div className="mt-3 bg-neutral-900/80 border border-neutral-800 p-2.5 rounded-xl space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400 font-medium">Highway Corridor:</span>
                          <span className="text-white font-semibold truncate max-w-[220px]">{lot.corridor}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400 font-medium">Actual GPS Coordinates:</span>
                          <span className="text-blue-400 font-mono font-bold">
                            {lot.lat.toFixed(5)}°, {lot.lng.toFixed(5)}°
                          </span>
                        </div>
                      </div>

                      {/* Capacity & Rates */}
                      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                        <div className="bg-neutral-900 border border-neutral-800/60 p-2 rounded-xl">
                          <span className="text-[10px] text-neutral-400 block">Total Bays</span>
                          <span className="text-xs font-bold font-spec text-white">{lot.totalBays} ({lot.availableBays} free)</span>
                        </div>
                        <div className="bg-neutral-900 border border-neutral-800/60 p-2 rounded-xl">
                          <span className="text-[10px] text-neutral-400 block">Hourly Rate</span>
                          <span className="text-xs font-bold font-spec text-amber-400">₹{lot.ratePerHour}/hr</span>
                        </div>
                        <div className="bg-neutral-900 border border-neutral-800/60 p-2 rounded-xl">
                          <span className="text-[10px] text-neutral-400 block">Overnight Stay</span>
                          <span className="text-xs font-bold font-spec text-emerald-400">₹{lot.ratePerNight}/night</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditLot?.(lot)}
                          className="py-1.5 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-md shadow-amber-600/20"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Yard Specs</span>
                        </button>

                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => setSelectedLotId(lot.id)}
                            className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            <span>Set Active</span>
                          </button>
                        )}
                      </div>

                      {onViewOnMap && (
                        <button
                          type="button"
                          onClick={() => onViewOnMap(lot)}
                          className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-blue-400 border border-neutral-700/80 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View on Map</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
      )}

    </div>
  );
};

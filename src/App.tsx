import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, MapPin, AlertTriangle, ShieldCheck, 
  RotateCcw, Sparkles, Filter, ChevronDown, CheckCircle2, ArrowRight, Check
} from 'lucide-react';
import { ParkingLot, VehicleCategory, Booking, CheckInRecord, DriverLocation } from './types';
import { INITIAL_LOTS, INITIAL_CHECKINS } from './data/mockLots';
import { calculateDistanceKm } from './utils/geoUtils';
import { LoginPage, UserProfile } from './components/LoginPage';
import { RoleSelectPage } from './components/RoleSelectPage';
import { Header } from './components/Header';
import { VehicleSelector } from './components/VehicleSelector';
import { TacticalMap } from './components/TacticalMap';
import { LotCard } from './components/LotCard';
import { LotDetailsModal } from './components/LotDetailsModal';
import { BookingModal } from './components/BookingModal';
import { GatePassModal } from './components/GatePassModal';
import { ActivePassesDrawer } from './components/ActivePassesDrawer';
import { HostDashboard } from './components/HostDashboard';
import { AddLotModal } from './components/AddLotModal';
import { BackgroundPattern } from './components/BackgroundPattern';
import { 
  purgeLegacyGlobalData,
  loadPersonBookings,
  savePersonBookings,
  loadPersonHostLots,
  savePersonHostLots,
  loadPersonCheckIns,
  savePersonCheckIns,
  loadCommunityLots,
  addOrUpdateCommunityLot,
} from './utils/userDataManager';

export default function App() {
  // App navigation state: 'login' -> 'select-role' -> 'app'
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('parkkaro_current_active_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<'login' | 'select-role' | 'app'>(() => {
    return currentUser ? 'select-role' : 'login';
  });

  const [currentRole, setCurrentRole] = useState<'driver' | 'host'>('driver');
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>('truck');

  // Driver GPS / Selected Indian Location state
  const [driverLocation, setDriverLocation] = useState<DriverLocation>({
    address: 'Navi Mumbai (JNPT Port Corridor)',
    lat: 18.9482,
    lng: 72.9554,
  });

  // Person-to-Person Isolated Master Data
  const [hostLots, setHostLots] = useState<ParkingLot[]>(() => {
    if (currentUser) {
      return loadPersonHostLots(currentUser.id);
    }
    return [];
  });

  const [checkIns, setCheckIns] = useState<CheckInRecord[]>(() => {
    if (currentUser) {
      return loadPersonCheckIns(currentUser.id);
    }
    return [];
  });

  const [userBookings, setUserBookings] = useState<Booking[]>(() => {
    if (currentUser) {
      return loadPersonBookings(currentUser.id);
    }
    return [];
  });

  // Community & Available Lots pool for Driver navigation
  const driverLots = useMemo(() => {
    const community = loadCommunityLots();
    const lotMap = new Map<string, ParkingLot>();
    // Base highway corridor lots
    INITIAL_LOTS.forEach(l => lotMap.set(l.id, l));
    // Community lots added across the network
    community.forEach(l => lotMap.set(l.id, l));
    // Host yards listed by this user (if any)
    hostLots.forEach(l => lotMap.set(l.id, l));
    return Array.from(lotMap.values());
  }, [hostLots]);

  // Compute live distance from driver to all available lots
  const lotsWithDistance = useMemo(() => {
    return driverLots.map(lot => {
      const dist = calculateDistanceKm(
        driverLocation.lat,
        driverLocation.lng,
        lot.lat,
        lot.lng
      );
      return {
        ...lot,
        distanceKm: dist,
      };
    });
  }, [driverLots, driverLocation]);

  // UI Interactive States
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(lotsWithDistance[0] || INITIAL_LOTS[0]);
  const [detailsModalLot, setDetailsModalLot] = useState<ParkingLot | null>(null);
  const [bookingModalLot, setBookingModalLot] = useState<ParkingLot | null>(null);
  const [activeGatePass, setActiveGatePass] = useState<Booking | null>(null);
  const [isPassesDrawerOpen, setIsPassesDrawerOpen] = useState(false);
  const [isAddLotModalOpen, setIsAddLotModalOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<ParkingLot | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    lot?: ParkingLot;
  } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [surfaceFilter, setSurfaceFilter] = useState('all');
  const [instantOnly, setInstantOnly] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Authentication handler: from Login to Role Selection Page
  const handleLoginSuccess = (user: UserProfile) => {
    // Purge any old non-isolated global store so no cross-user data leaks
    purgeLegacyGlobalData();

    try {
      localStorage.setItem('parkkaro_current_active_user', JSON.stringify(user));
    } catch {
      // ignore
    }

    setCurrentUser(user);

    // Initialize state strictly with data stored by this person
    const personBookings = loadPersonBookings(user.id);
    const personLots = loadPersonHostLots(user.id);
    const personCheckIns = loadPersonCheckIns(user.id);

    setUserBookings(personBookings);
    setHostLots(personLots);
    setCheckIns(personCheckIns);

    if (user.accountType) {
      setCurrentRole(user.accountType);
    }

    setCurrentView('select-role');
  };

  // Role Selection handler: from Role Selection Page to Main App
  const handleSelectRoleFromPage = (role: 'driver' | 'host', initialVehicle: VehicleCategory = 'truck') => {
    setCurrentRole(role);
    setVehicleCategory(initialVehicle);
    setCurrentView('app');
  };

  // Switch Role between Driver & Host from persistent Header
  const handleSwitchRole = (newRole: 'driver' | 'host') => {
    setCurrentRole(newRole);
  };

  // Return to Role Selection Page from Header
  const handleReturnToRoleSelect = () => {
    setCurrentView('select-role');
  };

  // Exit back to Initial Login Page
  const handleExitToLogin = () => {
    try {
      localStorage.removeItem('parkkaro_current_active_user');
    } catch {
      // ignore
    }
    purgeLegacyGlobalData();
    setCurrentUser(null);
    setUserBookings([]);
    setHostLots([]);
    setCheckIns([]);
    setCurrentView('login');
  };

  // Handle Confirmed Booking by Driver
  const handleConfirmBooking = (newBooking: Booking) => {
    const updatedBookings = [newBooking, ...userBookings];
    setUserBookings(updatedBookings);
    if (currentUser) {
      savePersonBookings(currentUser.id, updatedBookings);
    }

    setBookingModalLot(null);
    setActiveGatePass(newBooking);

    // Also record check-in if applicable
    const newCheckInRecord: CheckInRecord = {
      id: `chk-${Date.now().toString().slice(-4)}`,
      bayNumber: newBooking.bayNumber,
      vehicleType: newBooking.vehicleModel,
      carrierOrPlate: newBooking.vehiclePlate,
      driverName: newBooking.driverName,
      driverPhone: newBooking.driverPhone,
      dimensions: newBooking.vehicleCategory === 'truck' ? '75 ft / 13\'6" H' : '20 ft / 9\'0" H',
      arrival: 'Just now',
      departure: newBooking.endTime,
      status: 'Checked In',
      gatePassCode: newBooking.gateCode,
      feePaid: newBooking.totalAmount,
    };
    const updatedCheckIns = [newCheckInRecord, ...checkIns];
    setCheckIns(updatedCheckIns);
    if (currentUser) {
      savePersonCheckIns(currentUser.id, updatedCheckIns);
    }
  };

  // Handle Host Adding New Lot with Actual Location Pinpoint
  const handleAddNewLot = (newLot: ParkingLot) => {
    const updatedLots = [newLot, ...hostLots];
    setHostLots(updatedLots);
    if (currentUser) {
      savePersonHostLots(currentUser.id, updatedLots);
    }
    addOrUpdateCommunityLot(newLot);

    setSelectedLot(newLot);
    
    // Pan driver coordinates to the new yard's actual coordinates
    setDriverLocation({
      address: `${newLot.address}, ${newLot.city}`,
      lat: newLot.lat,
      lng: newLot.lng,
    });

    setToastMessage({
      text: `Yard "${newLot.title}" pinned at actual coordinates (${newLot.lat.toFixed(4)}°N, ${newLot.lng.toFixed(4)}°E) and listed under your host workspace!`,
      lot: newLot,
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 7000);
  };

  // Handle Host Updating Existing Lot
  const handleUpdateLot = (updatedLot: ParkingLot) => {
    const updatedLots = hostLots.map(l => l.id === updatedLot.id ? updatedLot : l);
    setHostLots(updatedLots);
    if (currentUser) {
      savePersonHostLots(currentUser.id, updatedLots);
    }
    addOrUpdateCommunityLot(updatedLot);

    if (selectedLot?.id === updatedLot.id) {
      setSelectedLot(updatedLot);
    }
    
    // Pan driver coordinates to the updated yard's actual coordinates
    setDriverLocation({
      address: `${updatedLot.address}, ${updatedLot.city}`,
      lat: updatedLot.lat,
      lng: updatedLot.lng,
    });

    setToastMessage({
      text: `Updated "${updatedLot.title}" with new rates, capacity (${updatedLot.totalBays} bays), and actual GPS pin (${updatedLot.lat.toFixed(4)}°N, ${updatedLot.lng.toFixed(4)}°E)!`,
      lot: updatedLot,
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 7000);
  };

  const handleOpenEditLot = (lot: ParkingLot) => {
    setEditingLot(lot);
    setIsAddLotModalOpen(true);
  };

  const handleOpenAddLot = () => {
    setEditingLot(null);
    setIsAddLotModalOpen(true);
  };

  const handleViewLotOnMap = (lot: ParkingLot) => {
    setCurrentRole('driver');
    setSelectedLot(lot);
    setDriverLocation({
      address: `${lot.address}, ${lot.city}`,
      lat: lot.lat,
      lng: lot.lng,
    });
  };

  // Handle Host Updating Check-in Status
  const handleUpdateCheckInStatus = (recordId: string, newStatus: CheckInRecord['status']) => {
    setCheckIns(prev => prev.map(r => r.id === recordId ? { ...r, status: newStatus } : r));
  };

  // Handle Host Re-generating Gate PIN
  const handleGenerateOverridePin = (record: CheckInRecord) => {
    const randomPin = Math.floor(1000 + Math.random() * 9000);
    const newPin = `#${randomPin}*`;
    setCheckIns(prev => prev.map(r => r.id === record.id ? { ...r, gatePassCode: newPin } : r));
  };

  // Filtered lots for Driver view
  const filteredLots = lotsWithDistance.filter(lot => {
    // Check vehicle category compatibility
    const supportsVehicle = lot.vehicleCategory.includes(vehicleCategory);
    if (!supportsVehicle) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches = 
        lot.title.toLowerCase().includes(q) ||
        lot.corridor.toLowerCase().includes(q) ||
        lot.city.toLowerCase().includes(q) ||
        lot.state.toLowerCase().includes(q) ||
        lot.facilityCode.toLowerCase().includes(q) ||
        (lot.pincode && lot.pincode.includes(q)) ||
        (lot.landmark && lot.landmark.toLowerCase().includes(q));
      if (!matches) return false;
    }

    // Surface filter
    if (surfaceFilter !== 'all' && lot.surface !== surfaceFilter) {
      return false;
    }

    // Instant access filter
    if (instantOnly && !lot.isInstantAccess) {
      return false;
    }

    return true;
  });

  // 1. Dedicated Separate Login Page
  if (currentView === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Dedicated Separate Role Selection Page (Rent Your Lot vs Park Your Vehicle)
  if (currentView === 'select-role') {
    return (
      <RoleSelectPage
        user={currentUser}
        onSelectRole={handleSelectRoleFromPage}
        onSignOut={handleExitToLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col selection:bg-blue-600 selection:text-white font-sans relative overflow-x-hidden">
      {/* Lag-free Background Pattern & Grid */}
      <BackgroundPattern />
      
      {/* Persistent Industrial Header */}
      <div className="relative z-20">
        <Header
          currentRole={currentRole}
          onSwitchRole={handleSwitchRole}
          onExitToLogin={handleExitToLogin}
          onReturnToRoleSelect={handleReturnToRoleSelect}
          activePassesCount={userBookings.length}
          onOpenPasses={() => setIsPassesDrawerOpen(true)}
          vehicleCategory={vehicleCategory}
        />
      </div>

      {/* Main Workspace */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 relative z-10">
        
        {/* VIEW 1: DRIVER & FLEET EXPLORER */}
        {currentRole === 'driver' ? (
          <div className="space-y-5">
            
            {/* Search & Mode Header Bar (Bento Master Bar) */}
            <div className="bg-neutral-900 border border-neutral-800 p-4 sm:p-5 rounded-2xl shadow-xl space-y-3.5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
                
                {/* Dual-Segment Mode Selector */}
                <VehicleSelector
                  activeCategory={vehicleCategory}
                  onChange={(cat) => setVehicleCategory(cat)}
                />

                {/* Location Search Bar */}
                <div className="flex-1 max-w-xl flex items-center gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      id="corridor-search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        vehicleCategory === 'truck'
                          ? "Search Indian Highway Corridor, NH-48, Navi Mumbai, Gurugram, Bengaluru..."
                          : "Search City, Metro Fringe, Airport Depot, Pincode..."
                      }
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-semibold text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                      showAdvancedFilters 
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md' 
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:bg-neutral-800 hover:text-white'
                    }`}
                    title="Toggle Physical Clearance Filters"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                  </button>
                </div>

              </div>

              {/* Collapsible Advanced Filters (Surface, Instant Access) */}
              {showAdvancedFilters && (
                <div className="pt-3.5 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs animate-in fade-in">
                  <div>
                    <label className="block font-bold text-neutral-400 mb-1.5">Tarmac Surface</label>
                    <select
                      value={surfaceFilter}
                      onChange={(e) => setSurfaceFilter(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="all" className="bg-neutral-900">All Surface Types</option>
                      <option value="Heavy Asphalt" className="bg-neutral-900">Heavy Asphalt</option>
                      <option value="Reinforced Concrete" className="bg-neutral-900">Reinforced Concrete</option>
                      <option value="Compacted Crushed Gravel" className="bg-neutral-900">Compacted Crushed Gravel</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2.5 sm:pt-6">
                    <input
                      type="checkbox"
                      id="instant-access-checkbox"
                      checked={instantOnly}
                      onChange={(e) => setInstantOnly(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 bg-neutral-950 border-neutral-700 focus:ring-0 cursor-pointer"
                    >
                    </input>
                    <label htmlFor="instant-access-checkbox" className="font-semibold text-neutral-200 cursor-pointer select-none">
                      Instant Fastag / QR Access Only
                    </label>
                  </div>

                  <div className="flex items-center justify-end sm:pt-5">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSurfaceFilter('all');
                        setInstantOnly(false);
                      }}
                      className="text-xs text-neutral-400 hover:text-white flex items-center space-x-1.5 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Filter feedback row */}
              <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                <span className="font-spec">
                  <strong className="text-white">{filteredLots.length} verified Indian staging facilities</strong> matching {vehicleCategory === 'truck' ? 'Heavy Commercial Vehicle / Trailer' : 'LCV / Delivery Van'} profile
                </span>
                <span className="hidden sm:inline font-spec text-[11px] text-neutral-500">
                  All parking rates set directly in Indian Rupees (₹) by yard owners
                </span>
              </div>
            </div>

            {/* SPLIT-SCREEN ORCHESTRATION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left Column: Interactive Tactical Map Canvas with Real Google Maps & Driver Location Input */}
              <div className="lg:col-span-7 sticky lg:top-20 z-10">
                <TacticalMap
                  lots={filteredLots}
                  selectedLot={selectedLot}
                  onSelectLot={(lot) => setSelectedLot(lot)}
                  onBookLot={(lot) => setBookingModalLot(lot)}
                  activeVehicle={vehicleCategory}
                  driverLocation={driverLocation}
                  onUpdateDriverLocation={setDriverLocation}
                />
              </div>

              {/* Right Column: Structured Utility Cards Feed */}
              <div className="lg:col-span-5 space-y-4 max-h-[calc(100vh-140px)] lg:overflow-y-auto pr-1">
                {filteredLots.length === 0 ? (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-white shadow-xl">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <h3 className="font-bold text-sm text-white">No Matching Staging Yards</h3>
                    <p className="text-xs text-neutral-400 mt-1 mb-4">
                      Try searching for a different highway corridor or adjusting surface filters.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSurfaceFilter('all');
                        setInstantOnly(false);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  filteredLots.map((lot) => (
                    <LotCard
                      key={lot.id}
                      lot={lot}
                      activeVehicle={vehicleCategory}
                      isSelected={selectedLot?.id === lot.id}
                      onSelect={(l) => {
                        setSelectedLot(l);
                        setDetailsModalLot(l);
                      }}
                      onBook={(l) => setBookingModalLot(l)}
                    />
                  ))
                )}
              </div>

            </div>

          </div>
        ) : (
          /* VIEW 2: HOST & LOT OWNER OPERATIONS CENTER */
          <HostDashboard
            lots={lots}
            checkIns={checkIns}
            onOpenAddLot={handleOpenAddLot}
            onEditLot={handleOpenEditLot}
            onViewOnMap={handleViewLotOnMap}
            onUpdateCheckInStatus={handleUpdateCheckInStatus}
            onGenerateOverridePin={handleGenerateOverridePin}
          />
        )}

      </main>

      {/* MODALS & DRAWERS */}
      {/* 1. Facility Specs Modal */}
      {detailsModalLot && (
        <LotDetailsModal
          lot={detailsModalLot}
          activeVehicle={vehicleCategory}
          onClose={() => setDetailsModalLot(null)}
          onBook={(lot) => setBookingModalLot(lot)}
        />
      )}

      {/* 2. Staging Bay Reservation Modal */}
      {bookingModalLot && (
        <BookingModal
          lot={bookingModalLot}
          activeVehicle={vehicleCategory}
          onClose={() => setBookingModalLot(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* 3. Digital Gate Access Pass Modal */}
      {activeGatePass && (
        <GatePassModal
          booking={activeGatePass}
          onClose={() => setActiveGatePass(null)}
        />
      )}

      {/* 4. Active Passes Drawer */}
      <ActivePassesDrawer
        isOpen={isPassesDrawerOpen}
        onClose={() => setIsPassesDrawerOpen(false)}
        bookings={userBookings}
        onSelectBooking={(b) => {
          setIsPassesDrawerOpen(false);
          setActiveGatePass(b);
        }}
        onCancelBooking={(id) => {
          setUserBookings(prev => prev.filter(b => b.id !== id));
        }}
      />

      {/* 5. Add New Lot / Edit Staging Space Modal */}
      <AddLotModal
        isOpen={isAddLotModalOpen}
        onClose={() => {
          setIsAddLotModalOpen(false);
          setEditingLot(null);
        }}
        onAddLot={handleAddNewLot}
        onUpdateLot={handleUpdateLot}
        initialLot={editingLot}
        allLots={lots}
      />

      {/* 6. Live Toast for Pinpoint & Yard Registration */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-neutral-900/95 border border-emerald-500/50 shadow-2xl rounded-2xl p-4 text-xs backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="font-bold text-white flex items-center justify-between">
              <span>Yard Listed on Live Map</span>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-neutral-300 leading-relaxed font-medium">
              {toastMessage.text}
            </p>
            {currentRole === 'host' && (
              <button
                type="button"
                onClick={() => {
                  setCurrentRole('driver');
                  if (toastMessage.lot) setSelectedLot(toastMessage.lot);
                  setToastMessage(null);
                }}
                className="inline-flex items-center space-x-1.5 mt-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
              >
                <span>View on Driver Tactical Map</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

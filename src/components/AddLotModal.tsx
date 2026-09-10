import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Warehouse, Plus, Check, MapPin, Shield, Clock, Calendar, 
  Upload, Trash2, Image as ImageIcon, Sparkles, CheckCircle2, 
  HelpCircle, Car, Truck, Zap, IndianRupee, Layers, Eye,
  Compass, Crosshair, LocateFixed, Building2, Navigation, Edit3, Save, RefreshCw
} from 'lucide-react';
import { ParkingLot, SurfaceType, VehicleCategory, LotAvailability, LotSizeInfo } from '../types';
import { LocationPinPicker } from './LocationPinPicker';

interface AddLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLot: (newLot: ParkingLot) => void;
  onUpdateLot?: (updatedLot: ParkingLot) => void;
  initialLot?: ParkingLot | null;
  allLots?: ParkingLot[];
}

// Preset Indian high-res yard and parking lot assets
const SAMPLE_PRESET_IMAGES = [
  {
    title: 'Commercial Heavy Yard & Container Staging',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Secure Paved Truck Bays & Gate Entry',
    url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Gated Industrial Compound with Night Floodlights',
    url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Paved Surface with Marked Parking Lines',
    url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Covered Fleet Staging & Canopy Shelter',
    url: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Intermodal Container Transport Terminal',
    url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80',
  },
];

// Major Indian cities with default coordinates and state
const INDIAN_METROS: { city: string; state: string; lat: number; lng: number; defaultCorridor: string }[] = [
  { city: 'Navi Mumbai', state: 'Maharashtra', lat: 18.9482, lng: 72.9554, defaultCorridor: 'Mumbai-Pune Expressway / JNPT Port Corridor' },
  { city: 'Gurugram', state: 'Haryana', lat: 28.3245, lng: 76.8821, defaultCorridor: 'NH-48 Delhi-Jaipur Highway / Bilaspur Hub' },
  { city: 'Bengaluru', state: 'Karnataka', lat: 12.8452, lng: 77.6602, defaultCorridor: 'NH-44 Hosur Road / Electronic City & NICE Road' },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.2403, lng: 78.4294, defaultCorridor: 'Hyderabad Nehru Outer Ring Road (ORR) Exit 16' },
  { city: 'Chennai', state: 'Tamil Nadu', lat: 12.9716, lng: 79.9482, defaultCorridor: 'NH-48 Sriperumbudur Automotive Corridor' },
  { city: 'Pune', state: 'Maharashtra', lat: 18.7612, lng: 73.8567, defaultCorridor: 'Talegaon-Chakan Auto MIDC Expressway' },
  { city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, defaultCorridor: 'Eastern Peripheral Expressway / GT Road' },
  { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, defaultCorridor: 'NH-16 Kona Expressway / Dankuni Freight Hub' },
  { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, defaultCorridor: 'Sarkhej-Bavla Road / DMIC Freight Corridor' },
];

export const AddLotModal: React.FC<AddLotModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddLot,
  onUpdateLot,
  initialLot,
  allLots = []
}) => {
  if (!isOpen) return null;

  // Modal Mode: 'create' or 'edit'
  const [modalMode, setModalMode] = useState<'create' | 'edit'>(initialLot ? 'edit' : 'create');
  const [selectedLotToEditId, setSelectedLotToEditId] = useState<string>(initialLot?.id || (allLots[0]?.id || ''));

  // Basic Details
  const [title, setTitle] = useState('');
  const [locationMode, setLocationMode] = useState<'actual' | 'preset'>('actual');
  const [city, setCity] = useState('Navi Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('400707');
  const [landmark, setLandmark] = useState('');
  const [corridor, setCorridor] = useState('Mumbai-Pune Expressway / JNPT Port Corridor');
  const [lat, setLat] = useState<number>(18.9482);
  const [lng, setLng] = useState<number>(72.9554);

  // Availability
  const [availabilityDays, setAvailabilityDays] = useState('Monday - Sunday (All 7 Days)');
  const [availabilityHours, setAvailabilityHours] = useState('24 Hours Open');
  const [is24x7, setIs24x7] = useState(true);
  const [availableFrom, setAvailableFrom] = useState(new Date().toISOString().split('T')[0]);
  const [availableTo, setAvailableTo] = useState('Ongoing / Open Ended');
  const [isInstantAccess, setIsInstantAccess] = useState(true);

  // Pricing (in INR ₹ set by owner)
  const [ratePerHour, setRatePerHour] = useState<number>(50);
  const [ratePerNight, setRatePerNight] = useState<number>(350);
  const [ratePerMonth, setRatePerMonth] = useState<number>(7500);

  // Lot Size & Capacity
  const [totalBays, setTotalBays] = useState<number>(30);
  const [areaSqFt, setAreaSqFt] = useState<number>(25000);
  const [dimensions, setDimensions] = useState('200 ft x 125 ft');
  const [surface, setSurface] = useState<SurfaceType>('Reinforced Concrete');
  const [maxClearance, setMaxClearance] = useState('16\' 0" (High Clearance)');
  const [maxVehicleLength, setMaxVehicleLength] = useState('75\' Multi-Axle Combination');
  const [vehicleTypes, setVehicleTypes] = useState<VehicleCategory[]>(['truck', 'car']);

  // Amenities
  const [amenities, setAmenities] = useState<string[]>([
    'Covered Parking Bays',
    'EV Fast Charging (Dual Gun DC)',
    '24/7 CCTV Surveillance',
    'Security Guard / Manned Entry Gate',
    'Automated Boom Barrier & Fastag/QR',
    'Shore Power (Reefer 3-Phase Plugs)',
    'Clean Driver Restrooms & Showers',
    'High-Mast LED Floodlights',
  ]);

  // Security Features
  const [securityFeatures, setSecurityFeatures] = useState<string[]>([
    'Fenced Perimeter with Barbed Wire',
    '24/7 CCTV Surveillance',
    'Automated Fastag / QR Boom Barrier',
    'Manned Security Guard Post',
  ]);

  // Multiple Photos Upload state
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    SAMPLE_PRESET_IMAGES[0].url,
    SAMPLE_PRESET_IMAGES[1].url,
  ]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'availability_pricing' | 'photos_amenities'>('details');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Host info
  const [ownerName, setOwnerName] = useState('Jai Hind Logistics Yards');
  const [contactPhone, setContactPhone] = useState('+91 98200 12345');
  const [entryProtocol, setEntryProtocol] = useState('Approach Gate 1. Scan mobile QR pass or enter 4-digit numeric PIN on keypad.');

  // Load an existing lot into form
  const loadLotData = (lot: ParkingLot) => {
    setTitle(lot.title);
    setLocationMode('actual');
    setCity(lot.city);
    setState(lot.state);
    setAddress(lot.address);
    setPincode(lot.pincode);
    setLandmark(lot.landmark || '');
    setCorridor(lot.corridor);
    setLat(lot.lat);
    setLng(lot.lng);

    setRatePerHour(lot.ratePerHour);
    setRatePerNight(lot.ratePerNight);
    setRatePerMonth(lot.ratePerMonth);

    setTotalBays(lot.totalBays);
    setAreaSqFt(lot.lotSize?.areaSqFt || 25000);
    setDimensions(lot.lotSize?.dimensions || '200 ft x 125 ft');
    setSurface(lot.surface);
    setMaxClearance(lot.maxClearance);
    setMaxVehicleLength(lot.maxVehicleLength);
    setVehicleTypes(lot.vehicleCategory && lot.vehicleCategory.length > 0 ? lot.vehicleCategory : ['truck', 'car']);

    setAmenities(lot.amenities || []);
    setSecurityFeatures(lot.securityFeatures || []);
    setUploadedPhotos(lot.images && lot.images.length > 0 ? lot.images : [SAMPLE_PRESET_IMAGES[0].url]);

    setAvailabilityDays(lot.availability?.days || 'Monday - Sunday (All 7 Days)');
    setAvailabilityHours(lot.availability?.hours || '24 Hours Open');
    setIs24x7(lot.availability?.is24x7 ?? true);
    setAvailableFrom(lot.availability?.availableFrom || new Date().toISOString().split('T')[0]);
    setAvailableTo(lot.availability?.availableTo || 'Ongoing / Open Ended');
    setIsInstantAccess(lot.isInstantAccess);

    setOwnerName(lot.ownerName || 'Jai Hind Logistics Yards');
    setContactPhone(lot.contactPhone || '+91 98200 12345');
    setEntryProtocol(lot.entryProtocol || 'Approach Gate 1. Scan mobile QR pass or enter 4-digit numeric PIN on keypad.');
  };

  // Reset form to defaults for creating a new yard
  const resetToNewLot = () => {
    setTitle('');
    setLocationMode('actual');
    setCity('Navi Mumbai');
    setState('Maharashtra');
    setAddress('');
    setPincode('400707');
    setLandmark('');
    setCorridor('Mumbai-Pune Expressway / JNPT Port Corridor');
    setLat(18.9482);
    setLng(72.9554);

    setRatePerHour(50);
    setRatePerNight(350);
    setRatePerMonth(7500);

    setTotalBays(30);
    setAreaSqFt(25000);
    setDimensions('200 ft x 125 ft');
    setSurface('Reinforced Concrete');
    setMaxClearance('16\' 0" (High Clearance)');
    setMaxVehicleLength('75\' Multi-Axle Combination');
    setVehicleTypes(['truck', 'car']);

    setAmenities([
      'Covered Parking Bays',
      'EV Fast Charging (Dual Gun DC)',
      '24/7 CCTV Surveillance',
      'Security Guard / Manned Entry Gate',
      'Automated Boom Barrier & Fastag/QR',
      'Shore Power (Reefer 3-Phase Plugs)',
      'Clean Driver Restrooms & Showers',
      'High-Mast LED Floodlights',
    ]);
    setSecurityFeatures([
      'Fenced Perimeter with Barbed Wire',
      '24/7 CCTV Surveillance',
      'Automated Fastag / QR Boom Barrier',
      'Manned Security Guard Post',
    ]);
    setUploadedPhotos([
      SAMPLE_PRESET_IMAGES[0].url,
      SAMPLE_PRESET_IMAGES[1].url,
    ]);
    setAvailabilityDays('Monday - Sunday (All 7 Days)');
    setAvailabilityHours('24 Hours Open');
    setIs24x7(true);
    setAvailableFrom(new Date().toISOString().split('T')[0]);
    setAvailableTo('Ongoing / Open Ended');
    setIsInstantAccess(true);
    setOwnerName('Jai Hind Logistics Yards');
    setContactPhone('+91 98200 12345');
    setEntryProtocol('Approach Gate 1. Scan mobile QR pass or enter 4-digit numeric PIN on keypad.');
  };

  // Synchronize when initialLot or isOpen changes
  useEffect(() => {
    if (initialLot) {
      setModalMode('edit');
      setSelectedLotToEditId(initialLot.id);
      loadLotData(initialLot);
    } else {
      setModalMode('create');
      resetToNewLot();
    }
  }, [initialLot, isOpen]);

  // Handle Indian City Selection
  const handleCityChange = (cityName: string) => {
    setCity(cityName);
    const metro = INDIAN_METROS.find(m => m.city === cityName);
    if (metro) {
      setState(metro.state);
      setLat(metro.lat);
      setLng(metro.lng);
      setCorridor(metro.defaultCorridor);
    }
  };

  // Handle Real Map Pinpoint or Reverse Geocoded Coordinates
  const handleCoordinatesChange = (
    newLat: number,
    newLng: number,
    details?: {
      displayName?: string;
      city?: string;
      state?: string;
      pincode?: string;
      road?: string;
    }
  ) => {
    setLat(newLat);
    setLng(newLng);
    if (details) {
      if (details.city) setCity(details.city);
      if (details.state) setState(details.state);
      if (details.pincode) setPincode(details.pincode);
      if (details.road && !address) setAddress(details.road);
      if (details.displayName && !landmark) {
        const parts = details.displayName.split(',');
        if (parts.length > 2) {
          setLandmark(parts.slice(0, 2).join(',').trim());
        }
      }
    }
  };

  // Multiple file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const resultStr = uploadEvent.target.result as string;
          setUploadedPhotos(prev => [...prev, resultStr]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddCustomUrl = () => {
    if (!customImageUrl.trim()) return;
    setUploadedPhotos(prev => [...prev, customImageUrl.trim()]);
    setCustomImageUrl('');
  };

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSetCoverPhoto = (index: number) => {
    setUploadedPhotos(prev => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
  };

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const toggleVehicleType = (type: VehicleCategory) => {
    if (vehicleTypes.includes(type)) {
      if (vehicleTypes.length > 1) {
        setVehicleTypes(vehicleTypes.filter(t => t !== type));
      }
    } else {
      setVehicleTypes([...vehicleTypes, type]);
    }
  };

  const handleSelectLotToEdit = (lotId: string) => {
    setSelectedLotToEditId(lotId);
    const target = allLots.find(l => l.id === lotId);
    if (target) {
      loadLotData(target);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const photos = uploadedPhotos.length > 0 ? uploadedPhotos : [SAMPLE_PRESET_IMAGES[0].url];

    if (modalMode === 'edit') {
      const existing = allLots.find(l => l.id === selectedLotToEditId) || initialLot;
      if (existing) {
        const updatedLot: ParkingLot = {
          ...existing,
          title: title.trim() || existing.title,
          address: address.trim() || existing.address,
          city,
          state,
          pincode,
          landmark,
          corridor,
          lat: lat || existing.lat,
          lng: lng || existing.lng,
          images: photos,
          vehicleCategory: vehicleTypes,
          ratePerHour,
          ratePerNight,
          ratePerMonth,
          totalBays,
          availableBays: Math.min(totalBays, Math.max(0, existing.availableBays + (totalBays - existing.totalBays))),
          surface,
          maxClearance,
          maxVehicleLength,
          isInstantAccess,
          securityFeatures,
          amenities,
          availability: {
            days: availabilityDays,
            hours: availabilityHours,
            is24x7,
            availableFrom,
            availableTo,
          },
          lotSize: {
            totalBays,
            areaSqFt,
            dimensions,
            vehicleCapacityDesc: `Up to ${totalBays} Heavy Multi-Axle Trucks or Commercial Vehicles`
          },
          ownerName: ownerName || existing.ownerName,
          contactPhone: contactPhone || existing.contactPhone,
          entryProtocol: entryProtocol || existing.entryProtocol,
        };

        if (onUpdateLot) {
          onUpdateLot(updatedLot);
        } else {
          onAddLot(updatedLot);
        }
        onClose();
        return;
      }
    }

    const codeNumber = Math.floor(10 + Math.random() * 89);
    const statePrefix = state.slice(0, 2).toUpperCase() || 'IN';
    const cityPrefix = city.slice(0, 3).toUpperCase() || 'YRD';
    const facilityCode = `${statePrefix}-${cityPrefix}-${codeNumber}`;

    const newLot: ParkingLot = {
      id: `yard-${Date.now().toString().slice(-6)}`,
      title: title || `${city} Commercial Staging & Logistics Yard`,
      facilityCode,
      address: address || `Plot 100, Industrial Logistics Area, ${city}`,
      city,
      state,
      pincode,
      landmark,
      corridor,
      lat: lat || 19.0,
      lng: lng || 73.0,
      images: photos,
      vehicleCategory: vehicleTypes,
      ratePerHour,
      ratePerNight,
      ratePerMonth,
      totalBays,
      availableBays: totalBays,
      surface,
      maxClearance,
      maxVehicleLength,
      turningRadius: '75\' Clear Radius',
      isInstantAccess,
      securityFeatures,
      amenities,
      availability: {
        days: availabilityDays,
        hours: availabilityHours,
        is24x7,
        availableFrom,
        availableTo,
      },
      lotSize: {
        totalBays,
        areaSqFt,
        dimensions,
        vehicleCapacityDesc: `Up to ${totalBays} Heavy Multi-Axle Trucks or Commercial Vehicles`
      },
      ownerId: 'owner-current',
      ownerName: ownerName || 'Registered Yard Operator',
      contactPhone: contactPhone || '+91 98200 00000',
      entryProtocol: entryProtocol || 'Scan mobile gate pass QR code at the automated barrier or enter PIN.',
      rating: 5.0,
      reviewsCount: 1,
      spaces: Array.from({ length: Math.min(6, totalBays) }, (_, i) => ({
        id: `sp-${Date.now()}-${i + 1}`,
        bayNumber: `Bay ${String.fromCharCode(65 + Math.floor(i / 10))}-${(i % 10 + 1).toString().padStart(2, '0')}`,
        type: i === 0 ? 'truck_trailer' : (i === 1 ? 'ev_charging' : 'car_van'),
        status: 'available',
        maxDimensions: maxVehicleLength,
        ratePerHour,
        ratePerNight,
        ratePerMonth,
      })),
    };

    onAddLot(newLot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        id="add-lot-modal"
        className="bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl max-w-3xl w-full my-6 overflow-hidden flex flex-col max-h-[92vh] text-white"
      >
        {/* Modal Header */}
        <div className="bg-neutral-950 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
              modalMode === 'edit'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {modalMode === 'edit' ? <Edit3 className="w-5 h-5" /> : <Warehouse className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <span>{modalMode === 'edit' ? 'Edit Your Lot / Staging Yard Details' : 'List Your Parking Lot / Staging Yard for Rent'}</span>
                <span className={`border text-[10px] font-spec px-2 py-0.5 rounded-full ${
                  modalMode === 'edit'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                }`}>
                  {modalMode === 'edit' ? 'EDIT MODE' : '₹ INR PRICING'}
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                {modalMode === 'edit' 
                  ? 'Update real coordinates, rates, gate protocol, capacity, or uploaded facility photos.'
                  : 'Monetize your commercial lot, warehouse fringe, or open yard with full owner rate control.'
                }
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Strip: Create vs Edit */}
        <div className="bg-neutral-950/90 border-b border-neutral-800 px-6 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              type="button"
              id="modal-mode-create"
              onClick={() => {
                setModalMode('create');
                resetToNewLot();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                modalMode === 'create'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List a New Yard</span>
            </button>
            <button
              type="button"
              id="modal-mode-edit"
              onClick={() => {
                setModalMode('edit');
                if (allLots && allLots.length > 0) {
                  const target = allLots.find(l => l.id === selectedLotToEditId) || allLots[0];
                  setSelectedLotToEditId(target.id);
                  loadLotData(target);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                modalMode === 'edit'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Your Lot {allLots.length > 0 ? `(${allLots.length})` : ''}</span>
            </button>
          </div>

          {modalMode === 'edit' && allLots && allLots.length > 0 && (
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">Yard to Edit:</span>
              <select
                id="select-lot-to-edit"
                value={selectedLotToEditId}
                onChange={(e) => handleSelectLotToEdit(e.target.value)}
                className="bg-neutral-900 border border-neutral-750 rounded-xl px-2.5 py-1.5 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-500 cursor-pointer w-full sm:w-auto max-w-xs truncate"
              >
                {allLots.map((l) => (
                  <option key={l.id} value={l.id} className="bg-neutral-900 text-white">
                    {l.facilityCode} • {l.title} ({l.city})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Step Navigation Tabs */}
        <div className="bg-neutral-950/60 border-b border-neutral-800 px-6 py-2 flex items-center space-x-2 text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'details'
                ? 'bg-blue-600 text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            1. Location & Specs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('availability_pricing')}
            className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'availability_pricing'
                ? 'bg-blue-600 text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <span>2. Rupee Rates & Availability</span>
            <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.2 rounded-md font-mono">₹/hr/day/mo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photos_amenities')}
            className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'photos_amenities'
                ? 'bg-blue-600 text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <span>3. Photos ({uploadedPhotos.length}) & Amenities</span>
            {uploadedPhotos.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-neutral-950 text-[10px] font-black flex items-center justify-center">
                ✓
              </span>
            )}
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* TAB 1: LOCATION & LOT SPECS */}
          {activeTab === 'details' && (
            <div className="space-y-5 animate-in fade-in">
              
              {/* Facility Name & Quick Metro Select */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase mb-1.5">
                    Facility / Lot Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Nav-Bharat Fleet Logistics Park #3"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-blue-500 shadow-inner"
                  />
                </div>

                {/* Location Selection Mode Toggle */}
                <div className="bg-neutral-900/90 border border-neutral-800 p-1.5 rounded-2xl flex flex-col sm:flex-row gap-1.5">
                  <button
                    type="button"
                    onClick={() => setLocationMode('actual')}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      locationMode === 'actual'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    <Crosshair className="w-3.5 h-3.5 text-blue-300" />
                    <span>Exact Actual Location (Real Map Pinpoint & GPS)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationMode('preset')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      locationMode === 'preset'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Quick Metro Hubs</span>
                  </button>
                </div>

                {locationMode === 'preset' && (
                  <div className="bg-neutral-950/70 p-3.5 rounded-2xl border border-neutral-800 animate-in fade-in space-y-2">
                    <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                      Choose Standard Indian Corridor Hub
                    </label>
                    <select
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {INDIAN_METROS.map((m) => (
                        <option key={m.city} value={m.city} className="bg-neutral-900 text-white">
                          {m.city}, {m.state} — {m.defaultCorridor}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-neutral-400">
                      Selecting a corridor automatically sets standard hub coordinates. You can still adjust the pin on the map below to your actual entrance.
                    </p>
                  </div>
                )}
              </div>

              {/* Real Location & Address Fields */}
              <div className="space-y-3 bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-neutral-200 uppercase flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>Actual Lot Address & Location Details</span>
                  </h3>
                  <span className="text-[10px] bg-blue-950/80 text-blue-400 border border-blue-800/60 px-2 py-0.5 rounded-full font-mono font-bold">
                    Real GPS Mapping
                  </span>
                </div>

                {/* Street and Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Street / Plot / Yard Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Plot 42, Sector 11, Industrial MIDC Zone"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 400707"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                {/* City, State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      City / Town / Industrial Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Navi Mumbai, Gurugram, Talegaon, Manesar"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      State / Union Territory *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Maharashtra, Haryana, Karnataka"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Landmark & Highway corridor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Landmark / Nearby Highway Toll / Gate Entrance
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near Toll Plaza & IOCL Petrol Pump, Gate 2"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Highway / Freight Corridor Tag
                    </label>
                    <input
                      type="text"
                      required
                      value={corridor}
                      onChange={(e) => setCorridor(e.target.value)}
                      placeholder="e.g. NH-48 Delhi-Mumbai Expressway / JNPT Port"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* INTERACTIVE REAL MAP PINPOINT PICKER */}
                <div className="pt-2">
                  <LocationPinPicker
                    lat={lat}
                    lng={lng}
                    searchQueryText={`${address ? address + ', ' : ''}${city ? city + ', ' : ''}${state ? state : ''} ${pincode}`.trim()}
                    onCoordinatesChange={handleCoordinatesChange}
                  />
                </div>

                {/* Exact Latitude & Longitude Inputs for Fine-Tuning */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                      <span>Exact Latitude:</span>
                      <span className="text-blue-400 font-bold">{lat.toFixed(6)}°</span>
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={lat}
                      onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-neutral-200 font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                      <span>Exact Longitude:</span>
                      <span className="text-blue-400 font-bold">{lng.toFixed(6)}°</span>
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={lng}
                      onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-neutral-200 font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Lot Dimensions, Size & Surface */}
              <div className="space-y-3 bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
                <h3 className="text-xs font-bold text-neutral-300 uppercase flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>Lot Size & Engineering Specifications</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Total Parking Bays / Slots *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={totalBays}
                      onChange={(e) => setTotalBays(parseInt(e.target.value) || 1)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-spec font-bold text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Plot Area (Square Feet)
                    </label>
                    <input
                      type="number"
                      value={areaSqFt}
                      onChange={(e) => setAreaSqFt(parseInt(e.target.value) || 1000)}
                      placeholder="e.g. 25000"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-spec font-bold text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Lot Dimensions
                    </label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="e.g. 200 ft x 125 ft"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Tarmac Surface
                    </label>
                    <select
                      value={surface}
                      onChange={(e) => setSurface(e.target.value as SurfaceType)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Reinforced Concrete">Reinforced Concrete (Load Bearing)</option>
                      <option value="Heavy Asphalt">Heavy Asphalt</option>
                      <option value="Compacted Crushed Gravel">Compacted Crushed Gravel</option>
                      <option value="Paved Stone">Interlocking Paver Blocks</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Vertical Clearance
                    </label>
                    <input
                      type="text"
                      value={maxClearance}
                      onChange={(e) => setMaxClearance(e.target.value)}
                      placeholder={'e.g. 16\' 0" or Open Sky'}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Max Vehicle Length
                    </label>
                    <input
                      type="text"
                      value={maxVehicleLength}
                      onChange={(e) => setMaxVehicleLength(e.target.value)}
                      placeholder="e.g. 75' Multi-Axle Trailer"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Vehicle Types Allowed */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-2">
                    Vehicle Categories Allowed
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => toggleVehicleType('truck')}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                        vehicleTypes.includes('truck')
                          ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-amber-400" />
                      <span>Commercial Trucks & Trailers</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleVehicleType('car')}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                        vehicleTypes.includes('car')
                          ? 'bg-blue-950/60 border-blue-500 text-blue-300'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Car className="w-4 h-4 text-blue-400" />
                      <span>Cars, Vans & EV Fleets</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {modalMode === 'edit' ? (
                  <button
                    type="submit"
                    className="py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-lg shadow-amber-600/20"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Changes Now</span>
                  </button>
                ) : <div />}
                <button
                  type="button"
                  onClick={() => setActiveTab('availability_pricing')}
                  className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Next: Rupee Rates & Availability →
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: PRICING (SET BY OWNER IN RUPEES) & AVAILABILITY DATES/TIMES */}
          {activeTab === 'availability_pricing' && (
            <div className="space-y-5 animate-in fade-in">
              
              {/* Rupee Rates Notice */}
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-2xl flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 text-base font-black">
                  ₹
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-300">
                    Owner-Controlled Pricing in Indian Rupees (₹)
                  </h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    As the parking lot owner, you set your own rates for hourly, daily (night layover), and monthly recurring rental contracts. Payouts are deposited directly to your bank account.
                  </p>
                </div>
              </div>

              {/* Pricing Inputs Grid (Hour / Day / Month) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Hourly */}
                <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-neutral-300 uppercase">
                      Hourly Rate (₹)
                    </label>
                    <span className="text-[10px] text-neutral-400">Short stay</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min={10}
                      value={ratePerHour}
                      onChange={(e) => setRatePerHour(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-3 py-2.5 text-base font-spec font-bold text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <span className="block text-[11px] text-neutral-400 mt-1.5">
                    Recommended: ₹40 - ₹80 / hr
                  </span>
                </div>

                {/* Daily / Nightly */}
                <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-neutral-300 uppercase">
                      Daily / Night Rate (₹)
                    </label>
                    <span className="text-[10px] text-emerald-400 font-bold">24-hr Pass</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min={50}
                      value={ratePerNight}
                      onChange={(e) => setRatePerNight(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-3 py-2.5 text-base font-spec font-bold text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <span className="block text-[11px] text-neutral-400 mt-1.5">
                    Recommended: ₹250 - ₹600 / day
                  </span>
                </div>

                {/* Monthly */}
                <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-neutral-300 uppercase">
                      Monthly Lease (₹)
                    </label>
                    <span className="text-[10px] text-blue-400 font-bold">Recurring</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={ratePerMonth}
                      onChange={(e) => setRatePerMonth(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-3 py-2.5 text-base font-spec font-bold text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <span className="block text-[11px] text-neutral-400 mt-1.5">
                    Recommended: ₹6,000 - ₹12,000 / mo
                  </span>
                </div>

              </div>

              {/* Availability Dates & Times Section */}
              <div className="bg-neutral-950/60 border border-neutral-800 p-4 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-neutral-300 uppercase flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>Availability Schedule & Operating Dates/Times</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1.5">
                      Operating Days
                    </label>
                    <select
                      value={availabilityDays}
                      onChange={(e) => setAvailabilityDays(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Monday - Sunday (All 7 Days)">Monday - Sunday (All 7 Days Open)</option>
                      <option value="Monday - Saturday">Monday - Saturday (Sunday Closed)</option>
                      <option value="Monday - Friday">Monday - Friday (Weekdays Only)</option>
                      <option value="Weekends Only">Saturday - Sunday (Weekend Staging)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1.5">
                      Operating Hours
                    </label>
                    <select
                      value={availabilityHours}
                      onChange={(e) => {
                        setAvailabilityHours(e.target.value);
                        setIs24x7(e.target.value === '24 Hours Open');
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="24 Hours Open">24 Hours Open (Continuous 24/7 Gate)</option>
                      <option value="06:00 AM - 11:00 PM">06:00 AM - 11:00 PM</option>
                      <option value="08:00 AM - 08:00 PM">08:00 AM - 08:00 PM</option>
                      <option value="Night Staging: 08:00 PM - 08:00 AM">Night Staging Only (08:00 PM - 08:00 AM)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1.5">
                      Available From Date
                    </label>
                    <input
                      type="date"
                      value={availableFrom}
                      onChange={(e) => setAvailableFrom(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1.5">
                      Available Until
                    </label>
                    <select
                      value={availableTo}
                      onChange={(e) => setAvailableTo(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Ongoing / Open Ended">Ongoing / Long-Term Available</option>
                      <option value="3 Months Contract">Available for next 3 Months</option>
                      <option value="6 Months Contract">Available for next 6 Months</option>
                      <option value="1 Year Contract">Available for next 1 Year</option>
                    </select>
                  </div>
                </div>

                {/* Instant Access Toggle */}
                <div className="pt-2 flex items-center justify-between border-t border-neutral-800/80">
                  <div>
                    <label className="text-xs font-bold text-white flex items-center space-x-1.5 cursor-pointer">
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      <span>Instant Gate Code Generation</span>
                    </label>
                    <p className="text-[11px] text-neutral-400">
                      Drivers receive automated entrance PIN & QR pass immediately upon confirmed reservation.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isInstantAccess}
                    onChange={(e) => setIsInstantAccess(e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600 bg-neutral-900 border-neutral-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Host Contact & Entry Protocol */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Contact Phone (for Driver Support)
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Gate Access Instructions for Drivers
                  </label>
                  <input
                    type="text"
                    value={entryProtocol}
                    onChange={(e) => setEntryProtocol(e.target.value)}
                    placeholder="e.g. Scan QR at Gate 1 intercom, guard on duty 24/7."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  ← Back to Details
                </button>
                <div className="flex items-center space-x-2">
                  {modalMode === 'edit' && (
                    <button
                      type="submit"
                      className="py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-lg shadow-amber-600/20"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Changes Now</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab('photos_amenities')}
                    className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Next: Photos & Amenities →
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: UPLOAD MULTIPLE PHOTOS & AMENITIES CHECKLIST */}
          {activeTab === 'photos_amenities' && (
            <div className="space-y-5 animate-in fade-in">
              
              {/* Photo Upload Section */}
              <div className="bg-neutral-950/70 border border-neutral-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-neutral-300 uppercase flex items-center space-x-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-400" />
                      <span>Upload Multiple Photos of the Parking Lot *</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Upload clear photos showing the tarmac, entrance gate, lighting, and security perimeter.
                    </p>
                  </div>
                  <span className="text-xs font-bold font-spec text-blue-400 bg-blue-950/60 border border-blue-800/80 px-2.5 py-1 rounded-full">
                    {uploadedPhotos.length} Photos Selected
                  </span>
                </div>

                {/* Upload Action Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Button */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-800 hover:border-blue-500 bg-neutral-950 p-4 rounded-xl text-center cursor-pointer transition-colors group"
                  >
                    <Upload className="w-6 h-6 text-neutral-400 group-hover:text-blue-400 mx-auto mb-1.5 transition-colors" />
                    <span className="text-xs font-bold text-white block">
                      Choose Multiple Images
                    </span>
                    <span className="text-[10px] text-neutral-500 block mt-0.5">
                      Supports JPG, PNG, WebP (Multi-select)
                    </span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Add by URL */}
                  <div className="border border-neutral-800 bg-neutral-950 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-neutral-300 block mb-1">
                        Or Add Image by Web URL
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          placeholder="https://images.example.com/lot.jpg"
                          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomUrl}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-500 mt-2 block">
                      Pastes hotlinks or hosted photos directly
                    </span>
                  </div>
                </div>

                {/* Selected Photos Grid Preview */}
                {uploadedPhotos.length > 0 && (
                  <div>
                    <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                      Photo Gallery ({uploadedPhotos.length}) • Click photo to set as Cover
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {uploadedPhotos.map((photo, idx) => (
                        <div
                          key={idx}
                          className="group relative aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow"
                        >
                          <img
                            src={photo}
                            alt={`Uploaded lot ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[9px] font-bold font-spec px-1.5 py-0.5 rounded shadow">
                              COVER PHOTO
                            </span>
                          )}
                          <div className="absolute inset-0 bg-neutral-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetCoverPhoto(idx)}
                                className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-500 cursor-pointer"
                                title="Set as primary cover"
                              >
                                Set Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="p-1.5 bg-red-600/80 text-white rounded hover:bg-red-600 cursor-pointer"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Presets Gallery for Testing */}
                <div>
                  <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Quick Add From Verified Staging & Parking Lot Presets
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!uploadedPhotos.includes(preset.url)) {
                            setUploadedPhotos(prev => [...prev, preset.url]);
                          }
                        }}
                        className="group relative aspect-video rounded-lg overflow-hidden border border-neutral-800 hover:border-blue-500 transition-all cursor-pointer"
                        title={preset.title}
                      >
                        <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold text-white">
                          + Add
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Amenities Checklist */}
              <div className="bg-neutral-950/70 border border-neutral-800 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-neutral-300 uppercase flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Parking Lot Amenities & Facilities</span>
                  </h3>
                  <span className="text-[11px] text-neutral-400 font-medium">
                    {amenities.length} selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'Covered Parking Bays', desc: 'Roof / canopy shelter from rain and direct sun' },
                    { id: 'EV Fast Charging (Dual Gun DC)', desc: 'Fast charging for commercial & passenger EVs' },
                    { id: '24/7 CCTV Surveillance', desc: 'High definition cloud-backed video recording' },
                    { id: 'Security Guard / Manned Entry Gate', desc: 'Physical security guard on duty around the clock' },
                    { id: 'Automated Boom Barrier & Fastag/QR', desc: 'Fast contactless entry clearance' },
                    { id: 'Shore Power (Reefer 3-Phase Plugs)', desc: 'Electric plug-in for refrigerated cargo trucks' },
                    { id: 'Clean Driver Restrooms & Showers', desc: 'Hygienic sanitation facilities for layovers' },
                    { id: 'Driver Lounge & Tea Canteen', desc: 'Air-conditioned seating and refreshments' },
                    { id: 'High-Mast LED Floodlights', desc: 'Bright, 100% illuminated night staging tarmac' },
                    { id: 'Water Supply & Wash Point', desc: 'Vehicle washing water and clean drinking water' },
                    { id: 'Fenced Perimeter with Barbed Wire', desc: 'Secured compound preventing unauthorized access' },
                    { id: 'Weighbridge / Scale Access', desc: 'Heavy vehicle axle weight scale on site or adjacent' },
                  ].map((item) => {
                    const checked = amenities.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleAmenity(item.id)}
                        className={`p-3 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                          checked
                            ? 'bg-emerald-950/50 border-emerald-700/70 shadow-sm'
                            : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center text-[10px] flex-shrink-0 ${
                          checked ? 'bg-emerald-500 text-neutral-950 font-bold' : 'border border-neutral-700'
                        }`}>
                          {checked && '✓'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs font-bold block truncate ${checked ? 'text-emerald-300' : 'text-neutral-200'}`}>
                            {item.id}
                          </span>
                          <span className="text-[10px] text-neutral-400 block mt-0.5">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('availability_pricing')}
                  className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  ← Back to Pricing
                </button>
                <button
                  type="submit"
                  id="submit-lot-btn"
                  className={`py-3 px-6 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-xl transition-colors cursor-pointer ${
                    modalMode === 'edit'
                      ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                  }`}
                >
                  {modalMode === 'edit' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save & Update Lot Details</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Publish Parking Lot to Network</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </form>

      </div>
    </div>
  );
};

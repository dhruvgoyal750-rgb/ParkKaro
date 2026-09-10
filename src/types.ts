export type VehicleCategory = 'car' | 'truck';

export type SurfaceType = 'Reinforced Concrete' | 'Heavy Asphalt' | 'Compacted Crushed Gravel' | 'Paved Stone';

export interface ParkingSpace {
  id: string;
  bayNumber: string;
  type: 'truck_trailer' | 'bobtail' | 'car_van' | 'ev_charging' | 'oversized';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  maxDimensions: string; // e.g. "75 ft combo"
  ratePerHour: number;
  ratePerNight: number;
  ratePerMonth?: number;
  currentVehiclePlate?: string;
  driverName?: string;
}

export interface SecurityFeature {
  id: string;
  label: string;
  description?: string;
  iconName: string;
}

export interface DriverLocation {
  address: string;
  lat: number;
  lng: number;
  label: string;
}

export interface LotAvailability {
  days: string; // e.g., "Monday - Sunday (All Days)" or "Mon - Fri"
  hours: string; // e.g., "24 Hours Open" or "06:00 AM - 11:00 PM"
  is24x7: boolean;
  availableFrom?: string;
  availableTo?: string;
}

export interface LotSizeInfo {
  totalBays: number;
  areaSqFt?: number;
  dimensions?: string; // e.g. "200 ft x 120 ft"
  vehicleCapacityDesc?: string; // e.g. "Up to 35 Multi-axle commercial trucks or 80 Cars"
}

export interface ParkingLot {
  id: string;
  title: string;
  facilityCode: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  landmark?: string;
  corridor: string; // e.g. "NH-48 Delhi-Mumbai Freight Highway"
  lat: number;
  lng: number;
  images: string[];
  vehicleCategory: VehicleCategory[]; // supports car, truck, or both
  ratePerHour: number; // in Indian Rupees (₹)
  ratePerNight: number; // in Indian Rupees (₹)
  ratePerMonth: number; // in Indian Rupees (₹)
  totalBays: number;
  availableBays: number;
  surface: SurfaceType;
  maxClearance: string; // e.g. "16' 0\"" or "Open Sky / No Limit"
  maxVehicleLength: string; // e.g. "75' Multi-Axle" or "22' Van"
  turningRadius: string; // e.g. "70' Wide Turning Radius"
  isInstantAccess: boolean;
  securityFeatures: string[];
  amenities: string[]; // e.g., 'Covered Parking', 'EV Charging (Fast DC)', '24/7 CCTV', etc.
  availability?: LotAvailability;
  lotSize?: LotSizeInfo;
  ownerId: string;
  ownerName: string;
  contactPhone: string;
  entryProtocol: string;
  rating: number;
  reviewsCount: number;
  distanceKm?: number; // Calculated distance from driver's location
  spaces: ParkingSpace[];
}

export interface Booking {
  id: string;
  lotId: string;
  lotTitle: string;
  facilityCode: string;
  address: string;
  bayNumber: string;
  vehicleCategory: VehicleCategory;
  vehiclePlate: string;
  vehicleModel: string;
  driverName: string;
  driverPhone: string;
  durationMode?: 'hours' | 'night' | 'month';
  durationCount?: number;
  startTime: string;
  endTime: string;
  totalAmount: number; // in Indian Rupees (₹)
  gateCode: string;
  qrToken: string;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface CheckInRecord {
  id: string;
  bayNumber: string;
  vehicleType: string;
  carrierOrPlate: string;
  driverName: string;
  driverPhone: string;
  dimensions: string;
  arrival: string;
  departure: string;
  status: 'Checked In' | 'En Route' | 'Overstay' | 'Reserved';
  gatePassCode: string;
  feePaid: number; // in Indian Rupees (₹)
}

export interface FilterState {
  searchQuery: string;
  vehicleCategory: VehicleCategory;
  surfaceType: string;
  minClearance: string;
  instantOnly: boolean;
  minRating: number;
  maxPrice: number;
  selectedAmenities: string[];
}

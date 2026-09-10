import { ParkingLot, CheckInRecord } from '../types';

export const INITIAL_LOTS: ParkingLot[] = [
  {
    id: 'yard-101',
    title: 'JNPT Port Heavy Logistics & Staging Terminal',
    facilityCode: 'MH-NAV-01',
    address: 'Plot 42, Sector 11, Dronagiri / Nhava Sheva Node',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    pincode: '400707',
    landmark: 'Near JNPT Container Port Gate 3 & Uran Highway',
    corridor: 'Mumbai-Pune Expressway & JNPT Freight Corridor',
    lat: 18.9482,
    lng: 72.9554,
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
    ],
    vehicleCategory: ['truck', 'car'],
    ratePerHour: 60, // ₹60/hr
    ratePerNight: 450, // ₹450/day
    ratePerMonth: 9500, // ₹9,500/month
    totalBays: 55,
    availableBays: 18,
    surface: 'Reinforced Concrete',
    maxClearance: '16\' 6"',
    maxVehicleLength: '75\' Multi-Axle Trailer',
    turningRadius: '75\' Clear Radius',
    isInstantAccess: true,
    securityFeatures: [
      'Fenced Perimeter with Barbed Wire',
      '24/7 CCTV Surveillance (32 HD Cameras)',
      'Automated Boom Barrier & Fastag/QR',
      'Manned 24/7 Ex-Servicemen Security',
      'High-Mast Solar & Grid Floodlights'
    ],
    amenities: [
      'Covered Parking Bays',
      'EV Fast Charging (60kW Dual Gun DC)',
      'Shore Power (Reefer 3-Phase Plugs)',
      'Clean Driver Restrooms & Showers',
      'Driver Lounge & Tea Canteen',
      'High-Pressure Water Truck Wash',
      'Weighbridge Access Next Door'
    ],
    availability: {
      days: 'Monday - Sunday (All 7 Days)',
      hours: '24 Hours Open',
      is24x7: true,
      availableFrom: '2026-01-01',
    },
    lotSize: {
      totalBays: 55,
      areaSqFt: 45000,
      dimensions: '300 ft x 150 ft',
      vehicleCapacityDesc: 'Accommodates 55 Heavy Multi-Axle Container Trailers or 120 Light Commercial Vehicles'
    },
    ownerId: 'owner-jnpt',
    ownerName: 'Maharashtra Freight Infra Hub',
    contactPhone: '+91 98201 55420',
    entryProtocol: 'Approach Gate 1 on Uran Road. Show ParkKaro mobile QR code or enter 4-digit PIN on keypad. Security guard validates weigh chit if loaded.',
    rating: 4.9,
    reviewsCount: 168,
    spaces: [
      { id: 'sp-1', bayNumber: 'Bay A-01', type: 'truck_trailer', status: 'available', maxDimensions: '75 ft', ratePerHour: 60, ratePerNight: 450, ratePerMonth: 9500 },
      { id: 'sp-2', bayNumber: 'Bay A-02', type: 'truck_trailer', status: 'occupied', maxDimensions: '75 ft', ratePerHour: 60, ratePerNight: 450, ratePerMonth: 9500, currentVehiclePlate: 'MH-04-AB-9821', driverName: 'Rajesh Sharma' },
      { id: 'sp-3', bayNumber: 'Bay A-03', type: 'truck_trailer', status: 'available', maxDimensions: '75 ft', ratePerHour: 60, ratePerNight: 450, ratePerMonth: 9500 },
      { id: 'sp-4', bayNumber: 'Bay B-01', type: 'ev_charging', status: 'available', maxDimensions: '35 ft', ratePerHour: 80, ratePerNight: 550, ratePerMonth: 11000 },
      { id: 'sp-5', bayNumber: 'Bay C-01', type: 'car_van', status: 'available', maxDimensions: '22 ft', ratePerHour: 40, ratePerNight: 280, ratePerMonth: 5500 },
    ],
  },
  {
    id: 'yard-102',
    title: 'Delhi-NCR Freight Park & Fleet Staging Depot',
    facilityCode: 'HR-GUR-14',
    address: 'NH-48 Milestone 54, Bilaspur Industrial Hub',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122413',
    landmark: 'Adjacent to KMP Expressway Interchange',
    corridor: 'NH-48 Delhi-Jaipur Highway / KMP Express Corridor',
    lat: 28.3245,
    lng: 76.8821,
    images: [
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    ],
    vehicleCategory: ['truck', 'car'],
    ratePerHour: 75, // ₹75/hr
    ratePerNight: 550, // ₹550/day
    ratePerMonth: 11500, // ₹11,500/month
    totalBays: 70,
    availableBays: 12,
    surface: 'Heavy Asphalt',
    maxClearance: 'No Limit (Open Yard)',
    maxVehicleLength: '85\' Long Combo',
    turningRadius: '80\' Extra-Wide Turning Radius',
    isInstantAccess: true,
    securityFeatures: [
      'Boundary Wall with Razor Wire & Electric Fence',
      '24/7 CCTV & AI Number Plate Recognition (ANPR)',
      'Armed Security Guard Post',
      'Automated Barrier Gate with Fastag Reader',
      'Perimeter Floodlights with Power Backup'
    ],
    amenities: [
      'EV Charging Station (Type 2 & Bharat DC-001)',
      'Clean Driver Washrooms & Dormitory Rest Area',
      'Chilled RO Drinking Water',
      'Dedicated Reefer Truck Plug-ins',
      'On-site Tyre Repair & Nitrogen Air',
      '24/7 Dhabas & Refreshments Nearby'
    ],
    availability: {
      days: 'Monday - Sunday',
      hours: '24 Hours Open',
      is24x7: true,
    },
    lotSize: {
      totalBays: 70,
      areaSqFt: 60000,
      dimensions: '400 ft x 150 ft',
      vehicleCapacityDesc: '70 Heavy Cargo Carriers / BharatBenz & Tata 16-Wheelers'
    },
    ownerId: 'owner-ncr',
    ownerName: 'Haryana Transporters Consortium',
    contactPhone: '+91 99104 88722',
    entryProtocol: 'Direct ANPR camera automatically scans registration plate on approach. For visitor entry, present ParkKaro digital pass barcode.',
    rating: 4.85,
    reviewsCount: 142,
    spaces: [
      { id: 'sp-201', bayNumber: 'Bay 12', type: 'truck_trailer', status: 'available', maxDimensions: '80 ft', ratePerHour: 75, ratePerNight: 550, ratePerMonth: 11500 },
      { id: 'sp-202', bayNumber: 'Bay 14', type: 'truck_trailer', status: 'occupied', maxDimensions: '80 ft', ratePerHour: 75, ratePerNight: 550, ratePerMonth: 11500, currentVehiclePlate: 'HR-26-CZ-8822', driverName: 'Gurpreet Singh' },
    ],
  },
  {
    id: 'yard-103',
    title: 'Bengaluru Tech Corridor EV & Commercial Fleet Hub',
    facilityCode: 'KA-BLR-22',
    address: 'Hosur Main Road, Phase 2, Near Electronic City Flyover',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560100',
    landmark: 'Opposite Infosys Gate 4 & NICE Ring Road Toll',
    corridor: 'NH-44 Bengaluru-Hosur Corridor & NICE Ring Road',
    lat: 12.8452,
    lng: 77.6602,
    images: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
    ],
    vehicleCategory: ['car', 'truck'],
    ratePerHour: 50, // ₹50/hr
    ratePerNight: 350, // ₹350/day
    ratePerMonth: 7500, // ₹7,500/month
    totalBays: 40,
    availableBays: 22,
    surface: 'Heavy Asphalt',
    maxClearance: '14\' 6"',
    maxVehicleLength: '40\' Box Truck / Fleet Electric Van',
    turningRadius: '55\' Standard Radius',
    isInstantAccess: true,
    securityFeatures: [
      'Gated Compound with Security Cabin',
      '24/7 CCTV Cloud Recording',
      'Automatic Boom Barrier with QR Scanner',
      'Fire Extinguishers & Water Hydrant System'
    ],
    amenities: [
      'Covered Parking Bays',
      'High-Speed EV Chargers (60kW CCS2 DC Fast Chargers)',
      'Executive Driver Restroom',
      'High-Speed Wi-Fi Zone',
      'Rooftop Solar Canopy',
      'EV Battery Swapping Station'
    ],
    availability: {
      days: 'Monday - Sunday',
      hours: '24 Hours Open',
      is24x7: true,
    },
    lotSize: {
      totalBays: 40,
      areaSqFt: 30000,
      dimensions: '200 ft x 150 ft',
      vehicleCapacityDesc: 'Ideal for Commercial Delivery Vans, EV Delivery Fleets & Passenger Vehicles'
    },
    ownerId: 'owner-blr',
    ownerName: 'Bangalore Smart Logistics Hub',
    contactPhone: '+91 97401 22910',
    entryProtocol: 'Scan digital gate pass QR code at the automated driver kiosk at Entrance Gate A.',
    rating: 4.9,
    reviewsCount: 110,
    spaces: [
      { id: 'sp-301', bayNumber: 'Slot P-05', type: 'car_van', status: 'available', maxDimensions: '22 ft', ratePerHour: 50, ratePerNight: 350, ratePerMonth: 7500 },
      { id: 'sp-302', bayNumber: 'Slot EV-01', type: 'ev_charging', status: 'available', maxDimensions: '22 ft', ratePerHour: 65, ratePerNight: 420, ratePerMonth: 8800 },
    ],
  },
  {
    id: 'yard-104',
    title: 'Hyderabad Outer Ring Road (ORR) Heavy Staging Yard',
    facilityCode: 'TS-HYD-07',
    address: 'ORR Exit 16, Shamshabad Airport Cargo Approach',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '501218',
    landmark: 'Near RGIA International Airport Cargo Village',
    corridor: 'Hyderabad Nehru Outer Ring Road (ORR) / NH-44',
    lat: 17.2403,
    lng: 78.4294,
    images: [
      'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    ],
    vehicleCategory: ['truck'],
    ratePerHour: 45, // ₹45/hr
    ratePerNight: 320, // ₹320/day
    ratePerMonth: 6800, // ₹6,800/month
    totalBays: 80,
    availableBays: 25,
    surface: 'Reinforced Concrete',
    maxClearance: 'No Limit (Open Yard)',
    maxVehicleLength: '75\' Multi-Axle Combination',
    turningRadius: '80\' Extra-Wide Turn',
    isInstantAccess: true,
    securityFeatures: [
      'Fenced Perimeter with Concertina Coil',
      '24/7 Security Guards with Canine Patrol',
      'CCTV Monitoring with Night Vision',
      'Motorized Gate with Digital Keypad'
    ],
    amenities: [
      'Clean Washrooms & Hot Water Shower Facilities',
      'Shore Power for Refrigerated Cargo',
      'Driver Rest Dormitory',
      'On-site Air & Water Refill Point',
      'Mechanic Bay & Emergency Roadside Support'
    ],
    availability: {
      days: 'Monday - Sunday',
      hours: '24 Hours Open',
      is24x7: true,
    },
    lotSize: {
      totalBays: 80,
      areaSqFt: 72000,
      dimensions: '450 ft x 160 ft',
      vehicleCapacityDesc: 'Accommodates 80 Heavy Commercial Vehicles'
    },
    ownerId: 'owner-hyd',
    ownerName: 'Deccan Freight Logistics Park',
    contactPhone: '+91 94402 77150',
    entryProtocol: 'Stop at Security Gatehouse. Provide Dispatch Booking or ParkKaro Pass ID. Security opens entry barrier.',
    rating: 4.8,
    reviewsCount: 95,
    spaces: [
      { id: 'sp-401', bayNumber: 'Pad 08', type: 'truck_trailer', status: 'available', maxDimensions: '75 ft', ratePerHour: 45, ratePerNight: 320, ratePerMonth: 6800 },
    ],
  },
  {
    id: 'yard-105',
    title: 'Chennai Auto Corridor Industrial Staging Terminal',
    facilityCode: 'TN-CHE-11',
    address: 'SIPCOT Industrial Park Phase 2, Sriperumbudur',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '602105',
    landmark: 'Adjacent to Hyundai & Foxconn Hub, NH-48',
    corridor: 'NH-48 Chennai-Bengaluru Industrial Corridor',
    lat: 12.9716,
    lng: 79.9482,
    images: [
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    ],
    vehicleCategory: ['truck', 'car'],
    ratePerHour: 55, // ₹55/hr
    ratePerNight: 380, // ₹380/day
    ratePerMonth: 7800, // ₹7,800/month
    totalBays: 45,
    availableBays: 14,
    surface: 'Heavy Asphalt',
    maxClearance: '15\' 6"',
    maxVehicleLength: '70\' Container Truck',
    turningRadius: '70\' Radius',
    isInstantAccess: true,
    securityFeatures: [
      'Concrete Boundary Wall with Barbed Wire',
      '24/7 CCTV & License Plate Camera',
      'Security Booth with Radio Comm',
      'Illuminated Perimeter Lights'
    ],
    amenities: [
      'Covered Parking Shades',
      'EV Charging Facility',
      'Clean Driver Restrooms & Showers',
      'RO Drinking Water Station',
      'Shore Power (Reefer Plugs)',
      'Cafeteria & Meals Facility'
    ],
    availability: {
      days: 'Monday - Sunday',
      hours: '24 Hours Open',
      is24x7: true,
    },
    lotSize: {
      totalBays: 45,
      areaSqFt: 38000,
      dimensions: '250 ft x 150 ft',
      vehicleCapacityDesc: '45 Truck bays with dedicated car parking lane'
    },
    ownerId: 'owner-chennai',
    ownerName: 'Coromandel Logistics & Staging',
    contactPhone: '+91 98403 91022',
    entryProtocol: 'Approach Gate 2. Key in access PIN on keypad or show ParkKaro app confirmation pass.',
    rating: 4.75,
    reviewsCount: 82,
    spaces: [
      { id: 'sp-501', bayNumber: 'East Bay 03', type: 'truck_trailer', status: 'available', maxDimensions: '70 ft', ratePerHour: 55, ratePerNight: 380, ratePerMonth: 7800 },
    ],
  },
  {
    id: 'yard-106',
    title: 'Pune Chakan Auto Cluster Secure Transit Depot',
    facilityCode: 'MH-PUN-09',
    address: 'Talegaon-Chakan Industrial Highway, MIDC Phase 3',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '410501',
    landmark: 'Near Mercedes-Benz & Bajaj Auto Manufacturing Facilities',
    corridor: 'Chakan-Talegaon Industrial Belt & Mumbai Expressway',
    lat: 18.7612,
    lng: 73.8567,
    images: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
    ],
    vehicleCategory: ['car', 'truck'],
    ratePerHour: 40, // ₹40/hr
    ratePerNight: 280, // ₹280/day
    ratePerMonth: 6000, // ₹6,000/month
    totalBays: 40,
    availableBays: 19,
    surface: 'Compacted Crushed Gravel',
    maxClearance: 'Open Sky / No Limit',
    maxVehicleLength: '65\' Combo / Commercial Vans',
    turningRadius: '60\' Standard',
    isInstantAccess: true,
    securityFeatures: [
      'Secure Wire Fenced Perimeter',
      '24/7 CCTV Camera Monitoring',
      'Manned Security Guard at Barrier',
      'Solar Flood Lighting'
    ],
    amenities: [
      'Covered Waiting Area',
      'Clean Driver Washrooms',
      'Drinking Water Supply',
      'EV Charging Point (Type 2)',
      'Emergency Tyre Puncture Repair'
    ],
    availability: {
      days: 'Monday - Sunday',
      hours: '24 Hours Open',
      is24x7: true,
    },
    lotSize: {
      totalBays: 40,
      areaSqFt: 32000,
      dimensions: '200 ft x 160 ft',
      vehicleCapacityDesc: '40 Bays for Commercial & Private Fleet Vehicles'
    },
    ownerId: 'owner-pune',
    ownerName: 'Western Auto Yards Pvt Ltd',
    contactPhone: '+91 98901 44321',
    entryProtocol: 'Show ParkKaro digital booking pass to security at entrance barrier.',
    rating: 4.7,
    reviewsCount: 68,
    spaces: [
      { id: 'sp-601', bayNumber: 'Spot C-11', type: 'car_van', status: 'available', maxDimensions: '20 ft', ratePerHour: 40, ratePerNight: 280, ratePerMonth: 6000 },
    ],
  }
];

export const INITIAL_CHECKINS: CheckInRecord[] = [
  {
    id: 'chk-8801',
    bayNumber: 'Bay A-02',
    vehicleType: 'Tata Prima Multi-Axle Container Trailer',
    carrierOrPlate: 'MH-04-AB-9821 (VRL Logistics)',
    driverName: 'Rajesh Sharma',
    driverPhone: '+91 98210 44011',
    dimensions: '72 ft / 14\'0" H',
    arrival: 'Today, 04:15 AM',
    departure: 'Today, 02:00 PM',
    status: 'Checked In',
    gatePassCode: '#8492*',
    feePaid: 450.00, // ₹450
  },
  {
    id: 'chk-8802',
    bayNumber: 'Bay A-07',
    vehicleType: 'BharatBenz 4028T 32\' Cargo Container',
    carrierOrPlate: 'HR-26-CZ-8822 (TCI Freight)',
    driverName: 'Gurpreet Singh',
    driverPhone: '+91 99110 78220',
    dimensions: '73 ft / 13\'6" H',
    arrival: 'Today, 06:40 AM',
    departure: 'Tomorrow, 08:00 AM',
    status: 'Checked In',
    gatePassCode: '#3190*',
    feePaid: 550.00, // ₹550
  },
  {
    id: 'chk-8803',
    bayNumber: 'Bay B-04',
    vehicleType: 'Mahindra Blazo X Heavy Flatbed (Steel Coil)',
    carrierOrPlate: 'KA-03-JJ-4521 (Independent Fleet)',
    driverName: 'Suresh Kumar',
    driverPhone: '+91 98450 12880',
    dimensions: '75 ft / 14\'0" H',
    arrival: 'ETA: 05:30 AM',
    departure: 'Today, 06:00 PM',
    status: 'En Route',
    gatePassCode: '#6614*',
    feePaid: 350.00, // ₹350
  },
  {
    id: 'chk-8804',
    bayNumber: 'Bay C-02',
    vehicleType: 'Tata Ace Super / Intra Delivery Van',
    carrierOrPlate: 'DL-01-AX-9901 (Delhivery Fast Fleet)',
    driverName: 'Manoj Verma',
    driverPhone: '+91 98100 90312',
    dimensions: '20 ft / 9\'0" H',
    arrival: 'Yesterday, 08:00 PM',
    departure: 'Today, 05:00 AM (Expired)',
    status: 'Overstay',
    gatePassCode: '#1105*',
    feePaid: 280.00, // ₹280
  },
  {
    id: 'chk-8805',
    bayNumber: 'Bay A-11',
    vehicleType: 'Ashok Leyland 4220 5-Axle Heavy Haul',
    carrierOrPlate: 'TN-11-Q-3321 (Gati KWE Express)',
    driverName: 'Anand Patel',
    driverPhone: '+91 98240 66701',
    dimensions: '75 ft / 14\'2" H',
    arrival: 'ETA: 07:15 AM',
    departure: 'Tomorrow, 07:00 AM',
    status: 'Reserved',
    gatePassCode: '#9042*',
    feePaid: 450.00, // ₹450
  },
];


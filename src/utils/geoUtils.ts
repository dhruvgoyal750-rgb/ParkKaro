// Geographic utilities and Indian location dictionary for ParkKaro

export interface GeoLocation {
  name: string;
  state: string;
  lat: number;
  lng: number;
  region: string;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
  city?: string;
  state?: string;
  pincode?: string;
  road?: string;
}

// Known Indian transport corridors, cities, and logistics nodes
export const INDIAN_LOCATIONS_DATABASE: GeoLocation[] = [
  { name: 'Navi Mumbai (JNPT Port)', state: 'Maharashtra', lat: 18.9482, lng: 72.9554, region: 'Western Corridor' },
  { name: 'Mumbai (Bandra Kurla Complex)', state: 'Maharashtra', lat: 19.0657, lng: 72.8688, region: 'Western Corridor' },
  { name: 'Gurugram (Bilaspur NH-48)', state: 'Haryana', lat: 28.3245, lng: 76.8821, region: 'Delhi-NCR Corridor' },
  { name: 'Delhi (Connaught Place / Ring Road)', state: 'Delhi', lat: 28.6139, lng: 77.2090, region: 'Delhi-NCR Corridor' },
  { name: 'Bengaluru (Electronic City NH-44)', state: 'Karnataka', lat: 12.8452, lng: 77.6602, region: 'Southern Corridor' },
  { name: 'Bengaluru (Whitefield)', state: 'Karnataka', lat: 12.9698, lng: 77.7500, region: 'Southern Corridor' },
  { name: 'Hyderabad (Shamshabad Airport / ORR)', state: 'Telangana', lat: 17.2403, lng: 78.4294, region: 'Central-South Corridor' },
  { name: 'Hyderabad (Gachibowli / Hitec City)', state: 'Telangana', lat: 17.4401, lng: 78.3489, region: 'Central-South Corridor' },
  { name: 'Chennai (Sriperumbudur NH-48)', state: 'Tamil Nadu', lat: 12.9716, lng: 79.9482, region: 'Southern Corridor' },
  { name: 'Pune (Talegaon-Chakan Auto MIDC)', state: 'Maharashtra', lat: 18.7612, lng: 73.8567, region: 'Western Corridor' },
  { name: 'Ahmedabad (Sarkhej / DMIC Hub)', state: 'Gujarat', lat: 23.0225, lng: 72.5714, region: 'Western Corridor' },
  { name: 'Kolkata (Dankuni Freight Hub)', state: 'West Bengal', lat: 22.5726, lng: 88.3639, region: 'Eastern Corridor' },
  { name: 'Jaipur (Transport Nagar NH-21)', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, region: 'North-West Corridor' },
  { name: 'Surat (Hazira Port Corridor)', state: 'Gujarat', lat: 21.1702, lng: 72.8311, region: 'Western Corridor' },
  { name: 'Nagpur (Zero Mile Logistics Center)', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, region: 'Central Spine' },
  { name: 'Indore (Pithampur Industrial Area)', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, region: 'Central Spine' },
  { name: 'Lucknow (Transport Nagar Kanpur Road)', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, region: 'Northern Corridor' },
  { name: 'Chandigarh / Zirakpur Highway', state: 'Punjab', lat: 30.7333, lng: 76.7794, region: 'Northern Corridor' },
];

/**
 * Calculates Haversine distance in kilometers between two GPS coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10;
}

/**
 * Estimates drive time in hours & minutes based on average Indian commercial speed (~45-55 km/h)
 */
export function estimateDriveTime(distanceKm: number): string {
  if (distanceKm <= 1) return '2 mins';
  const hours = distanceKm / 48; // avg 48 km/h
  if (hours < 1) {
    const mins = Math.max(5, Math.round(hours * 60));
    return `${mins} mins`;
  }
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h} hr`;
}

/**
 * Synchronously geocodes user query string to known Indian coordinates
 */
export function geocodeIndianQuery(query: string): GeoLocation | null {
  if (!query.trim()) return null;
  const q = query.toLowerCase().trim();

  // Direct match in dictionary
  const match = INDIAN_LOCATIONS_DATABASE.find(loc => 
    loc.name.toLowerCase().includes(q) || 
    loc.state.toLowerCase().includes(q) ||
    q.includes(loc.name.toLowerCase().split(' ')[0])
  );

  return match || null;
}

/**
 * Asynchronously geocodes any real-world address string or landmark
 * using live OpenStreetMap Nominatim with fallback to Indian logistics dictionary
 */
export async function geocodeAddressAsync(query: string): Promise<GeocodeResult | null> {
  if (!query || !query.trim()) return null;
  const trimmed = query.trim();

  // Try live Nominatim API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    
    // Append India if not explicitly stated
    const searchQuery = trimmed.toLowerCase().includes('india') ? trimmed : `${trimmed}, India`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=1&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en',
        },
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const parsedLat = parseFloat(item.lat);
        const parsedLng = parseFloat(item.lon);
        if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
          const addr = item.address || {};
          return {
            lat: parsedLat,
            lng: parsedLng,
            displayName: item.display_name,
            city: addr.city || addr.town || addr.city_district || addr.suburb,
            state: addr.state,
            pincode: addr.postcode,
            road: addr.road,
          };
        }
      }
    }
  } catch (err) {
    // Network or timeout failure, fall through to dictionary
    console.warn('Live geocoding network notice:', err);
  }

  // Fallback to offline database
  const fallback = geocodeIndianQuery(trimmed);
  if (fallback) {
    return {
      lat: fallback.lat,
      lng: fallback.lng,
      displayName: `${fallback.name}, ${fallback.state}`,
      city: fallback.name.split(' ')[0],
      state: fallback.state,
    };
  }

  return null;
}

/**
 * Reverse geocodes coordinates to a human-readable Indian street address
 */
export async function reverseGeocodeAsync(lat: number, lng: number): Promise<GeocodeResult | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en',
        },
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        return {
          lat,
          lng,
          displayName: data.display_name || '',
          city: addr.city || addr.town || addr.city_district || addr.suburb || addr.county,
          state: addr.state,
          pincode: addr.postcode,
          road: addr.road,
        };
      }
    }
  } catch (err) {
    console.warn('Reverse geocoding network notice:', err);
  }

  return null;
}

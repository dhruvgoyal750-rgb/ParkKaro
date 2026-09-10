import { ParkingLot, Booking, CheckInRecord } from '../types';
import { INITIAL_LOTS, INITIAL_CHECKINS } from '../data/mockLots';
import { UserProfile } from '../components/LoginPage';

/**
 * Normalizes an email or phone number into a clean, safe user ID
 */
export function generateUserId(emailOrPhone: string): string {
  const normalized = emailOrPhone.trim().toLowerCase();
  
  if (normalized === 'miller.freight@parkkaro.in' || normalized.includes('miller')) {
    return 'usr_demo_driver';
  }
  if (normalized === 'sharma.yards@parkkaro.in' || normalized.includes('sharma')) {
    return 'usr_demo_host';
  }

  const safeStr = normalized.replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');
  return `usr_${safeStr || 'operator'}`;
}

const STORAGE_PREFIX = 'parkkaro_p2p_';

export function getUserKey(userId: string, itemType: 'bookings' | 'lots' | 'checkins'): string {
  return `${STORAGE_PREFIX}${userId}_${itemType}`;
}

/**
 * Removes all legacy non-isolated global store keys so no previous data leaks
 */
export function purgeLegacyGlobalData(): void {
  try {
    localStorage.removeItem('parkkaro_lots');
    localStorage.removeItem('parkhaul_lots');
    localStorage.removeItem('parkkaro_bookings');
    localStorage.removeItem('parkkaro_checkins');
    localStorage.removeItem('parkkaro_active_passes');
  } catch (err) {
    console.warn('Could not purge legacy storage:', err);
  }
}

/**
 * Loads bookings stored strictly by this specific person
 */
export function loadPersonBookings(userId: string): Booking[] {
  try {
    const key = getUserKey(userId, 'bookings');
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error loading person bookings:', err);
  }

  // If this is the quick demo driver account, provide 1 starter demo pass
  if (userId === 'usr_demo_driver') {
    const demoBooking: Booking = {
      id: 'bk-91022',
      lotId: 'yard-101',
      lotTitle: 'JNPT Port Container & Trailer Freight Staging',
      facilityCode: 'MH-JNPT-01',
      address: 'Plot 14-B, Sector 7, Dronagiri Node, Navi Mumbai, Maharashtra',
      bayNumber: 'Bay A-02',
      vehicleCategory: 'truck',
      vehiclePlate: 'MH-46-AR-8812',
      vehicleModel: 'Tata Signa 5530.S (16-Wheeler Combo)',
      driverName: 'Capt. Miller (Fleet Dispatch)',
      driverPhone: '+91 98201 54321',
      startTime: '04:15 AM',
      endTime: '1 Night Checkout 11:00 AM',
      totalAmount: 350,
      gateCode: '#8492*',
      qrToken: 'PARKKARO-MH-JNPT-01-8492',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    savePersonBookings(userId, [demoBooking]);
    return [demoBooking];
  }

  // Any other user begins with empty bookings (their own data only)
  return [];
}

/**
 * Saves bookings strictly under this person's isolated storage
 */
export function savePersonBookings(userId: string, bookings: Booking[]): void {
  try {
    const key = getUserKey(userId, 'bookings');
    localStorage.setItem(key, JSON.stringify(bookings));
  } catch (err) {
    console.warn('Error saving person bookings:', err);
  }
}

/**
 * Loads yards/lots listed strictly by this specific host
 */
export function loadPersonHostLots(userId: string): ParkingLot[] {
  try {
    const key = getUserKey(userId, 'lots');
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error loading person lots:', err);
  }

  // If demo host, they own the primary JNPT Staging Terminal
  if (userId === 'usr_demo_host') {
    const demoLots = [INITIAL_LOTS[0]];
    savePersonHostLots(userId, demoLots);
    return demoLots;
  }

  // Any other host starts strictly with 0 listed yards until they list one
  return [];
}

/**
 * Saves lots listed strictly by this specific host
 */
export function savePersonHostLots(userId: string, lots: ParkingLot[]): void {
  try {
    const key = getUserKey(userId, 'lots');
    localStorage.setItem(key, JSON.stringify(lots));
  } catch (err) {
    console.warn('Error saving person lots:', err);
  }
}

/**
 * Loads check-in logs strictly for this specific host
 */
export function loadPersonCheckIns(userId: string): CheckInRecord[] {
  try {
    const key = getUserKey(userId, 'checkins');
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error loading person check-ins:', err);
  }

  // Demo host has initial JNPT checkins
  if (userId === 'usr_demo_host') {
    savePersonCheckIns(userId, INITIAL_CHECKINS);
    return INITIAL_CHECKINS;
  }

  // Any other host starts with empty check-ins until drivers book their bays
  return [];
}

/**
 * Saves check-ins strictly for this host
 */
export function savePersonCheckIns(userId: string, checkIns: CheckInRecord[]): void {
  try {
    const key = getUserKey(userId, 'checkins');
    localStorage.setItem(key, JSON.stringify(checkIns));
  } catch (err) {
    console.warn('Error saving person check-ins:', err);
  }
}

/**
 * Completely clears all stored data for this specific person
 */
export function clearPersonData(userId: string): void {
  try {
    localStorage.removeItem(getUserKey(userId, 'bookings'));
    localStorage.removeItem(getUserKey(userId, 'lots'));
    localStorage.removeItem(getUserKey(userId, 'checkins'));
  } catch (err) {
    console.warn('Error clearing person data:', err);
  }
}

/**
 * Community lots registry so yards listed by any host are visible to drivers
 */
const COMMUNITY_LOTS_KEY = 'parkkaro_community_yards_pool';

export function loadCommunityLots(): ParkingLot[] {
  try {
    const saved = localStorage.getItem(COMMUNITY_LOTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error loading community lots:', err);
  }
  return [];
}

export function saveCommunityLots(lots: ParkingLot[]): void {
  try {
    localStorage.setItem(COMMUNITY_LOTS_KEY, JSON.stringify(lots));
  } catch (err) {
    console.warn('Error saving community lots:', err);
  }
}

export function addOrUpdateCommunityLot(lot: ParkingLot): void {
  const current = loadCommunityLots();
  const exists = current.findIndex(l => l.id === lot.id);
  let updated: ParkingLot[];
  if (exists >= 0) {
    updated = current.map(l => l.id === lot.id ? lot : l);
  } else {
    updated = [lot, ...current];
  }
  saveCommunityLots(updated);
}

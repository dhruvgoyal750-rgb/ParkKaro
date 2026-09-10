import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ZoomIn, ZoomOut, MapPin, 
  ArrowRight, X, Crosshair, Navigation, 
  LocateFixed, Building2, Maximize2, Route,
  ExternalLink, Layers, Sparkles
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { ParkingLot, VehicleCategory, DriverLocation } from '../types';
import { calculateDistanceKm, estimateDriveTime, INDIAN_LOCATIONS_DATABASE, geocodeIndianQuery } from '../utils/geoUtils';

interface TacticalMapProps {
  lots: ParkingLot[];
  selectedLot: ParkingLot | null;
  onSelectLot: (lot: ParkingLot) => void;
  onBookLot: (lot: ParkingLot) => void;
  activeVehicle: VehicleCategory;
  driverLocation: DriverLocation;
  onUpdateDriverLocation: (loc: DriverLocation) => void;
}

// Verified live tile providers with zero CORS/X-Frame-Options blocking
const TILE_PROVIDERS = {
  osm_streets: {
    name: 'Real Roads & Buildings',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }
  },
  osm_hot: {
    name: 'Urban Infrastructure',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    options: {
      maxZoom: 19,
      subdomains: 'abc',
      attribution: '&copy; OpenStreetMap contributors, Humanitarian style',
    }
  },
  satellite: {
    name: 'Aerial Satellite',
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    overlay: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; High-res satellite imagery and transport network',
    }
  }
};

export const TacticalMap: React.FC<TacticalMapProps> = ({
  lots,
  selectedLot,
  onSelectLot,
  onBookLot,
  activeVehicle: _activeVehicle,
  driverLocation,
  onUpdateDriverLocation,
}) => {
  // Read Google Maps API Key from environment if available
  const googleMapsApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const hasGoogleMapsKey = Boolean(googleMapsApiKey && googleMapsApiKey.trim().length > 5);

  // Map Mode: 'osm_streets' (Actual Streets & Buildings) | 'osm_hot' (Detailed Urban Infrastructure) | 'satellite' (Actual Aerial Satellite) | 'google' (Google Maps Platform API)
  const [mapMode, setMapMode] = useState<'osm_streets' | 'osm_hot' | 'satellite' | 'google'>(
    hasGoogleMapsKey ? 'google' : 'osm_streets'
  );
  
  const [activePopupLot, setActivePopupLot] = useState<ParkingLot | null>(null);
  const [locationInput, setLocationInput] = useState(driverLocation.address);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // Leaflet Map Refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const overlayLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  // Automatically switch to Google Maps if key becomes available
  useEffect(() => {
    if (hasGoogleMapsKey && mapMode !== 'google') {
      setMapMode('google');
    }
  }, [hasGoogleMapsKey]);

  // Sync input if external driverLocation changes
  useEffect(() => {
    setLocationInput(driverLocation.address);
  }, [driverLocation.address]);

  // Distance from driver to selected lot
  const distanceToSelected = useMemo(() => {
    if (!selectedLot) return null;
    const dist = calculateDistanceKm(
      driverLocation.lat,
      driverLocation.lng,
      selectedLot.lat,
      selectedLot.lng
    );
    const timeStr = estimateDriveTime(dist);
    return { dist, timeStr };
  }, [driverLocation, selectedLot]);

  // Handle Driver Submitting Location
  const handleLocationSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!locationInput.trim()) return;

    const matched = geocodeIndianQuery(locationInput);
    if (matched) {
      onUpdateDriverLocation({
        address: matched.name,
        lat: matched.lat,
        lng: matched.lng,
      });
      setShowLocationSuggestions(false);
    } else {
      onUpdateDriverLocation({
        address: locationInput,
        lat: driverLocation.lat,
        lng: driverLocation.lng,
      });
      setShowLocationSuggestions(false);
    }
  };

  // Browser Geolocation / GPS
  const handleRequestGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocatingGPS(false);
        const { latitude, longitude } = position.coords;
        onUpdateDriverLocation({
          address: `Current GPS Location (${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E)`,
          lat: latitude,
          lng: longitude,
        });
      },
      () => {
        setIsLocatingGPS(false);
        onUpdateDriverLocation({
          address: 'Navi Mumbai (JNPT Port Corridor)',
          lat: 18.9482,
          lng: 72.9554,
        });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Initialize Leaflet Map once with real OpenStreetMap tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    // Initialize map centered at driver location
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: true,
      center: [driverLocation.lat, driverLocation.lng],
      zoom: 12,
    });

    // Default Real Roads & Buildings Layer (OpenStreetMap)
    const baseTile = L.tileLayer(
      TILE_PROVIDERS.osm_streets.url,
      TILE_PROVIDERS.osm_streets.options
    ).addTo(map);

    tileLayerRef.current = baseTile;

    // Layer group for driver & lot markers
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    mapRef.current = map;

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      overlayLayerRef.current = null;
      markersLayerRef.current = null;
      routeLayerRef.current = null;
    };
  }, []);

  // Switch Tile Layers when mapMode changes in Leaflet
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // If currently showing Google Maps, no need to update Leaflet tiles
    if (mapMode === 'google' && hasGoogleMapsKey) return;

    // Invalidate size to ensure crisp rendering when switching back from Google
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Remove existing tile layers
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
      tileLayerRef.current = null;
    }
    if (overlayLayerRef.current) {
      overlayLayerRef.current.remove();
      overlayLayerRef.current = null;
    }

    if (mapMode === 'osm_streets') {
      // Real Roads, Interchanges, and Building footprints (OpenStreetMap)
      tileLayerRef.current = L.tileLayer(
        TILE_PROVIDERS.osm_streets.url,
        TILE_PROVIDERS.osm_streets.options
      ).addTo(map);
    } else if (mapMode === 'osm_hot') {
      // High-contrast Urban Infrastructure & Highway Network (HOT OSM)
      tileLayerRef.current = L.tileLayer(
        TILE_PROVIDERS.osm_hot.url,
        TILE_PROVIDERS.osm_hot.options
      ).addTo(map);
    } else if (mapMode === 'satellite') {
      // Actual High-Resolution Aerial Satellite Imagery (Esri World Imagery + Highway Overlay)
      tileLayerRef.current = L.tileLayer(
        TILE_PROVIDERS.satellite.base,
        TILE_PROVIDERS.satellite.options
      ).addTo(map);
      overlayLayerRef.current = L.tileLayer(
        TILE_PROVIDERS.satellite.overlay,
        TILE_PROVIDERS.satellite.options
      ).addTo(map);
    }
  }, [mapMode, hasGoogleMapsKey]);

  // Update Markers (Driver & Lots) and Route Polyline in Leaflet
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;
    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    // 1. Driver Location Pin (Pulsing Radar + Navigation Arrow)
    const driverIcon = L.divIcon({
      className: 'driver-marker-wrapper',
      html: `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto">
          <div class="absolute w-12 h-12 rounded-full bg-blue-500/30 animate-ping"></div>
          <div class="absolute w-8 h-8 rounded-full bg-blue-400/20"></div>
          <div class="relative w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white shadow-2xl">
            <svg class="w-3.5 h-3.5 rotate-45" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-neutral-950/95 text-blue-300 border border-blue-500/80 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xl whitespace-nowrap font-mono tracking-wider">
            YOUR LOCATION
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const driverMarker = L.marker([driverLocation.lat, driverLocation.lng], {
      icon: driverIcon,
      zIndexOffset: 1000,
    });
    driverMarker.addTo(markersGroup);

    // 2. Parking Lot Markers (Rupee Price Pill + Bay Counter)
    lots.forEach((lot) => {
      const isCurrent = selectedLot?.id === lot.id;
      const lotIcon = L.divIcon({
        className: 'lot-marker-wrapper',
        html: `
          <div class="cursor-pointer -translate-x-1/2 -translate-y-full transition-all duration-200 pointer-events-auto ${
            isCurrent ? 'scale-115 z-50' : 'hover:scale-105'
          }">
            <div class="flex items-center space-x-1.5 py-1 px-2.5 rounded-xl font-mono font-bold text-xs shadow-2xl border transition-all ${
              isCurrent
                ? 'bg-blue-600 text-white border-white ring-4 ring-blue-500/50 shadow-blue-500/30'
                : 'bg-neutral-900/95 text-white border-neutral-700 hover:border-blue-400'
            }">
              <span class="w-2 h-2 rounded-full ${
                lot.availableBays > 0 ? 'bg-emerald-400' : 'bg-rose-500'
              }"></span>
              <span class="text-xs font-black">₹${lot.ratePerNight}</span>
              <span class="text-[10px] text-neutral-300 border-l border-neutral-700 pl-1.5 font-sans">
                ${lot.availableBays} bays
              </span>
            </div>
            <div class="w-2.5 h-2.5 mx-auto rotate-45 -mt-1.5 border-r border-b ${
              isCurrent ? 'bg-blue-600 border-white' : 'bg-neutral-900/95 border-neutral-700'
            }"></div>
          </div>
        `,
        iconSize: [90, 36],
        iconAnchor: [45, 36],
      });

      const marker = L.marker([lot.lat, lot.lng], {
        icon: lotIcon,
        zIndexOffset: isCurrent ? 600 : 200,
      });

      marker.on('click', () => {
        onSelectLot(lot);
        setActivePopupLot(lot);
      });

      marker.addTo(markersGroup);
    });

    // 3. Dynamic Route Line connecting Driver to Selected Parking Yard
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    if (selectedLot) {
      routeLayerRef.current = L.polyline(
        [
          [driverLocation.lat, driverLocation.lng],
          [selectedLot.lat, selectedLot.lng],
        ],
        {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.9,
          dashArray: '10, 8',
          lineCap: 'round',
          lineJoin: 'round',
        }
      ).addTo(mapRef.current);
    }
  }, [lots, selectedLot, driverLocation, onSelectLot]);

  // Smoothly pan when driver location changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo([driverLocation.lat, driverLocation.lng], 12, { duration: 1.2 });
    }
  }, [driverLocation.lat, driverLocation.lng]);

  // Smoothly pan to selected lot when selected
  useEffect(() => {
    if (selectedLot && mapRef.current) {
      mapRef.current.panTo([selectedLot.lat, selectedLot.lng]);
    }
  }, [selectedLot?.id]);

  // Zoom In
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  // Zoom Out
  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  // Center on Driver
  const handleCenterDriver = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([driverLocation.lat, driverLocation.lng], 13, { duration: 1 });
    }
  };

  // Fit all parking lots and driver into view
  const handleFitAllBounds = () => {
    if (!mapRef.current || lots.length === 0) return;
    const points: [number, number][] = [
      [driverLocation.lat, driverLocation.lng],
      ...lots.map(l => [l.lat, l.lng] as [number, number])
    ];
    const bounds = L.latLngBounds(points);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  };

  return (
    <div 
      id="tactical-map-container"
      className="flex flex-col space-y-3"
    >
      {/* 1. DRIVER LOCATION INPUT BAR */}
      <div className="bg-neutral-900 border border-neutral-800 p-3 sm:p-3.5 rounded-2xl shadow-xl space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          
          {/* Driver Location Input */}
          <form 
            onSubmit={handleLocationSubmit}
            className="flex-1 relative flex items-center"
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              <Crosshair className="w-4 h-4 animate-pulse" />
            </div>

            <input
              type="text"
              id="driver-location-input"
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value);
                setShowLocationSuggestions(true);
              }}
              onFocus={() => setShowLocationSuggestions(true)}
              placeholder="Enter your Indian Location (e.g. Navi Mumbai, Gurugram NH-48, Bengaluru, Pune)..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9.5 pr-20 py-2 text-xs font-semibold text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
            >
              Set Spot
            </button>
          </form>

          {/* GPS Locate Button */}
          <button
            type="button"
            onClick={handleRequestGPS}
            disabled={isLocatingGPS}
            className="px-3 py-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
            title="Detect your device GPS coordinates"
          >
            <LocateFixed className={`w-3.5 h-3.5 text-emerald-400 ${isLocatingGPS ? 'animate-spin' : ''}`} />
            <span>{isLocatingGPS ? 'Detecting GPS...' : 'My GPS Location'}</span>
          </button>

        </div>

        {/* Quick Indian Logistics Nodes & Driver Distance Pill */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-800/80 text-[11px]">
          <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
            <span className="text-neutral-400 font-bold uppercase text-[10px] whitespace-nowrap">
              Quick Hubs:
            </span>
            {[
              { label: 'Navi Mumbai', query: 'Navi Mumbai (JNPT Port)' },
              { label: 'Gurugram NH-48', query: 'Gurugram (Bilaspur NH-48)' },
              { label: 'Bengaluru NH-44', query: 'Bengaluru (Electronic City NH-44)' },
              { label: 'Hyderabad ORR', query: 'Hyderabad (Shamshabad Airport / ORR)' },
              { label: 'Chennai', query: 'Chennai (Sriperumbudur NH-48)' },
              { label: 'Pune MIDC', query: 'Pune (Talegaon-Chakan Auto MIDC)' },
            ].map((node) => (
              <button
                key={node.label}
                type="button"
                onClick={() => {
                  const match = geocodeIndianQuery(node.query);
                  if (match) {
                    setLocationInput(match.name);
                    onUpdateDriverLocation({
                      address: match.name,
                      lat: match.lat,
                      lng: match.lng,
                    });
                  }
                }}
                className="px-2 py-0.5 rounded-md bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[10px] font-spec font-medium transition-colors whitespace-nowrap cursor-pointer"
              >
                {node.label}
              </button>
            ))}
          </div>

          {/* Real-time Distance indicator to currently selected lot */}
          {distanceToSelected && selectedLot && (
            <div className="flex items-center space-x-1.5 bg-blue-950/70 border border-blue-800/80 px-2.5 py-1 rounded-lg text-blue-300 font-spec font-bold text-[10px] ml-auto">
              <Navigation className="w-3 h-3 text-blue-400" />
              <span>{distanceToSelected.dist} km to {selectedLot.facilityCode}</span>
              <span className="text-neutral-400">({distanceToSelected.timeStr})</span>
            </div>
          )}
        </div>

        {/* Autocomplete Dropdown suggestions */}
        {showLocationSuggestions && (
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-2 max-h-48 overflow-y-auto z-40 space-y-1 shadow-2xl">
            <span className="block text-[10px] font-bold text-neutral-400 px-2 py-0.5 uppercase tracking-wider">
              Select Verified Indian Logistics Hub / Highway Corridor
            </span>
            {INDIAN_LOCATIONS_DATABASE.map((loc) => (
              <div
                key={loc.name}
                onClick={() => {
                  setLocationInput(loc.name);
                  onUpdateDriverLocation({
                    address: loc.name,
                    lat: loc.lat,
                    lng: loc.lng,
                  });
                  setShowLocationSuggestions(false);
                }}
                className="p-2 rounded-lg hover:bg-neutral-900 cursor-pointer flex items-center justify-between text-xs text-neutral-200 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span className="font-semibold">{loc.name}</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-spec bg-neutral-900 px-1.5 py-0.5 rounded">
                  {loc.region}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. REAL ACTUAL MAP CANVAS */}
      <div 
        id="tactical-map-canvas"
        className="relative w-full h-[460px] lg:h-[620px] rounded-[2rem] border border-neutral-800 overflow-hidden select-none bg-neutral-950 shadow-2xl"
      >
        {/* Leaflet Real Map (Always mounted so container size is preserved) */}
        <div 
          ref={mapContainerRef} 
          className={`w-full h-full z-0 cursor-grab active:cursor-grabbing ${
            mapMode === 'google' && hasGoogleMapsKey ? 'hidden' : 'block'
          }`} 
        />

        {/* Google Maps API View (when toggled and API key is present) */}
        {hasGoogleMapsKey && mapMode === 'google' && (
          <APIProvider apiKey={googleMapsApiKey} region="IN" language="en">
            <Map
              defaultCenter={{ lat: driverLocation.lat, lng: driverLocation.lng }}
              defaultZoom={12}
              mapId="DEMO_MAP_ID"
              mapTypeId="roadmap"
              gestureHandling="greedy"
              disableDefaultUI={false}
              className="w-full h-full"
              internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
            >
              {/* Driver Location Advanced Marker */}
              <AdvancedMarker position={{ lat: driverLocation.lat, lng: driverLocation.lng }}>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-9 h-9 rounded-full bg-blue-500/40 animate-ping" />
                  <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white shadow-lg">
                    <Navigation className="w-3 h-3 rotate-45" />
                  </div>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-neutral-950/95 text-blue-300 border border-blue-500 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xl whitespace-nowrap font-mono">
                    YOUR LOCATION
                  </div>
                </div>
              </AdvancedMarker>

              {/* Parking Lot Advanced Markers with Rupee rates */}
              {lots.map((lot) => {
                const isCurrent = selectedLot?.id === lot.id;
                return (
                  <AdvancedMarker
                    key={lot.id}
                    position={{ lat: lot.lat, lng: lot.lng }}
                    onClick={() => {
                      onSelectLot(lot);
                      setActivePopupLot(lot);
                    }}
                  >
                    <div className={`cursor-pointer transition-transform duration-200 ${isCurrent ? 'scale-115 z-30' : 'hover:scale-105'}`}>
                      <div className={`flex items-center space-x-1.5 py-1 px-2.5 rounded-xl font-mono font-bold text-xs shadow-2xl border transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white border-white ring-4 ring-blue-500/50 shadow-blue-500/30'
                          : 'bg-neutral-900/95 text-white border-neutral-700 hover:border-blue-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${lot.availableBays > 0 ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                        <span className="font-black">₹{lot.ratePerNight}</span>
                        <span className="text-[10px] text-neutral-300 border-l border-neutral-700 pl-1.5 font-sans">
                          {lot.availableBays} bays
                        </span>
                      </div>
                      <div className={`w-2.5 h-2.5 mx-auto rotate-45 -mt-1.5 border-r border-b ${
                        isCurrent ? 'bg-blue-600 border-white' : 'bg-neutral-900 border-neutral-700'
                      }`} />
                    </div>
                  </AdvancedMarker>
                );
              })}
            </Map>
          </APIProvider>
        )}

        {/* Top-Right On-Map Layer Switcher & View Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end space-y-2">
          
          {/* Real Map API Layer Switcher Pill */}
          <div className="flex items-center space-x-1 bg-neutral-900/95 backdrop-blur-md p-1 rounded-2xl border border-neutral-700/80 shadow-2xl text-[10px] font-spec">
            <button
              type="button"
              onClick={() => setMapMode('osm_streets')}
              className={`px-2.5 py-1 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                mapMode === 'osm_streets'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
              title="Real street roads, highways, and building footprints"
            >
              <Building2 className="w-3 h-3" />
              <span>ROADS & BUILDINGS</span>
            </button>

            <button
              type="button"
              onClick={() => setMapMode('osm_hot')}
              className={`px-2.5 py-1 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                mapMode === 'osm_hot'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
              title="Urban infrastructure with highway networks"
            >
              <Layers className="w-3 h-3" />
              <span>URBAN INFRA</span>
            </button>

            <button
              type="button"
              onClick={() => setMapMode('satellite')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                mapMode === 'satellite'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
              title="Actual high-resolution aerial satellite imagery"
            >
              AERIAL SATELLITE
            </button>

            {hasGoogleMapsKey ? (
              <button
                type="button"
                onClick={() => setMapMode('google')}
                className={`px-2.5 py-1 rounded-xl font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                  mapMode === 'google'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-emerald-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>GOOGLE MAPS</span>
              </button>
            ) : (
              <div 
                className="px-2 py-1 text-neutral-400 text-[10px] hidden md:flex items-center space-x-1"
                title="Google Maps Platform API key can be set in Settings (.env.example)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                <span>Google API Ready</span>
              </div>
            )}
          </div>

          {/* Interactive Zoom & View Actions */}
          <div className="flex flex-col space-y-1.5 bg-neutral-900/95 backdrop-blur-md p-1.5 rounded-2xl border border-neutral-800 shadow-2xl">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:text-white transition-colors cursor-pointer"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleZoomOut}
              className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <div className="w-full h-px bg-neutral-800 my-0.5" />

            <button
              type="button"
              onClick={handleCenterDriver}
              className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-blue-400 border border-neutral-800 hover:text-blue-300 transition-colors cursor-pointer"
              title="Center on My Location"
            >
              <Crosshair className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleFitAllBounds}
              className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:text-white transition-colors cursor-pointer"
              title="Fit all yards and driver into view"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Top-Left Live Status Badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-neutral-800 text-xs font-spec shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white uppercase text-[10px] tracking-wider">
            {mapMode === 'osm_streets' && 'Real Roads & Buildings Map'}
            {mapMode === 'osm_hot' && 'Urban Infrastructure Network'}
            {mapMode === 'satellite' && 'Actual Aerial Satellite View'}
            {mapMode === 'google' && 'Google Maps API Live'}
          </span>
          <span className="text-neutral-500">|</span>
          <span className="text-[10px] text-blue-400 font-bold flex items-center space-x-1">
            <Route className="w-3 h-3 inline" />
            <span>{lots.length} Staging Hubs</span>
          </span>
        </div>

        {/* Bottom-Left Legend */}
        <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center space-x-3 bg-neutral-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-neutral-800 text-neutral-300 text-[10px] font-spec shadow-xl">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
            <span className="text-blue-300 font-bold">Your Location</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Parking Spot (₹ rates)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-blue-400 border-b border-dashed" />
            <span>Active Trajectory</span>
          </div>
        </div>

        {/* MAP POPUP OVERLAY */}
        {activePopupLot && (
          <div 
            id="tactical-map-popup"
            className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-92 bg-neutral-900/95 backdrop-blur-md rounded-2xl border border-neutral-700 shadow-2xl p-4 z-30 animate-in fade-in zoom-in-95 duration-150 text-white"
          >
            {/* Header with Close */}
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div className="flex items-center space-x-1.5">
                <span className="bg-neutral-950 text-white text-[10px] font-spec font-bold px-2 py-0.5 rounded-md border border-neutral-800">
                  {activePopupLot.facilityCode}
                </span>
                <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-800/60 font-spec">
                  {activePopupLot.availableBays} BAYS FREE
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActivePopupLot(null)}
                className="text-neutral-400 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail & Rupee Rates */}
            <div className="flex gap-3 mb-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-950 border border-neutral-800">
                <img
                  src={activePopupLot.images[0]}
                  alt={activePopupLot.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-white truncate">
                  {activePopupLot.title}
                </h4>
                <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                  {activePopupLot.corridor}
                </p>
                <div className="mt-1 flex items-baseline space-x-1.5">
                  <span className="text-base font-black text-white font-spec">
                    ₹{activePopupLot.ratePerNight}
                  </span>
                  <span className="text-[10px] text-neutral-400">/ night</span>
                  <span className="text-[10px] text-emerald-400 font-spec font-bold">
                    (₹{activePopupLot.ratePerHour}/hr)
                  </span>
                </div>
              </div>
            </div>

            {/* Distance from Driver */}
            {driverLocation && (
              <div className="bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-xl mb-2.5 flex items-center justify-between text-[11px]">
                <span className="text-neutral-400 flex items-center space-x-1">
                  <Navigation className="w-3 h-3 text-blue-400" />
                  <span>Distance:</span>
                </span>
                <span className="font-bold font-spec text-blue-300">
                  {calculateDistanceKm(driverLocation.lat, driverLocation.lng, activePopupLot.lat, activePopupLot.lng)} km • {estimateDriveTime(calculateDistanceKm(driverLocation.lat, driverLocation.lng, activePopupLot.lat, activePopupLot.lng))}
                </span>
              </div>
            )}

            {/* Direct Google Maps Navigation Link */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${driverLocation.lat},${driverLocation.lng}&destination=${activePopupLot.lat},${activePopupLot.lng}&travelmode=driving`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mb-2.5 flex items-center justify-center space-x-1.5 py-1.5 px-3 bg-neutral-950 hover:bg-neutral-800 text-blue-300 border border-neutral-800 hover:border-blue-500/60 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-400" />
              <span>Open in Google Maps Navigation</span>
              <ExternalLink className="w-3 h-3 text-neutral-400 ml-1" />
            </a>

            {/* Key Specs */}
            <div className="bg-neutral-950/60 border border-neutral-800 p-2 rounded-xl mb-3 grid grid-cols-3 text-center text-[10px] font-spec">
              <div>
                <span className="text-neutral-500 block text-[9px]">SURFACE</span>
                <span className="font-bold text-white truncate block">{activePopupLot.surface.split(' ')[0]}</span>
              </div>
              <div className="border-l border-neutral-800">
                <span className="text-neutral-500 block text-[9px]">CLEARANCE</span>
                <span className="font-bold text-white">{activePopupLot.maxClearance}</span>
              </div>
              <div className="border-l border-neutral-800">
                <span className="text-neutral-500 block text-[9px]">MONTHLY</span>
                <span className="font-bold text-emerald-400">₹{activePopupLot.ratePerMonth}</span>
              </div>
            </div>

            {/* Book Bay CTA Button */}
            <button
              type="button"
              id="popup-select-staging-spot-btn"
              onClick={() => onBookLot(activePopupLot)}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition-colors cursor-pointer"
            >
              <span>Book Bay (₹{activePopupLot.ratePerNight}/nt)</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

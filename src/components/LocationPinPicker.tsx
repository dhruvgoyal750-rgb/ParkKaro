import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Crosshair, LocateFixed, Search, ZoomIn, ZoomOut, 
  MapPin, CheckCircle2, Loader2, Sparkles
} from 'lucide-react';
import { geocodeAddressAsync, reverseGeocodeAsync } from '../utils/geoUtils';

interface LocationPinPickerProps {
  lat: number;
  lng: number;
  searchQueryText?: string;
  onCoordinatesChange: (lat: number, lng: number, details?: {
    displayName?: string;
    city?: string;
    state?: string;
    pincode?: string;
    road?: string;
  }) => void;
}

export const LocationPinPicker: React.FC<LocationPinPickerProps> = ({
  lat,
  lng,
  searchQueryText = '',
  onCoordinatesChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [activeTileType, setActiveTileType] = useState<'streets' | 'satellite'>('streets');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize interactive Leaflet map for location pinpointing
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const initialLat = lat || 18.9482;
    const initialLng = lng || 72.9554;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    const streetTile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = streetTile;

    // Custom Draggable Yard Marker
    const markerIcon = L.divIcon({
      className: 'yard-pin-icon',
      html: `
        <div class="relative flex flex-col items-center cursor-move group">
          <div class="bg-blue-600 text-white p-2 rounded-2xl shadow-2xl border-2 border-white flex items-center justify-center ring-4 ring-blue-500/40">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div class="w-3 h-3 bg-blue-600 rotate-45 -mt-1.5 border-r border-b border-white"></div>
          <div class="bg-neutral-950/95 text-blue-300 border border-blue-500/80 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xl whitespace-nowrap mt-1 font-mono">
            DRAG PIN TO LOT GATE
          </div>
        </div>
      `,
      iconSize: [120, 60],
      iconAnchor: [60, 48],
    });

    const marker = L.marker([initialLat, initialLng], {
      draggable: true,
      icon: markerIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    // Marker drag event
    marker.on('dragend', async (event) => {
      const position = event.target.getLatLng();
      const roundedLat = parseFloat(position.lat.toFixed(6));
      const roundedLng = parseFloat(position.lng.toFixed(6));

      setFeedbackMsg(`Pin moved to actual coordinates: ${roundedLat}, ${roundedLng}`);
      
      // Attempt reverse geocoding to auto-fill address details
      const reverse = await reverseGeocodeAsync(roundedLat, roundedLng);
      onCoordinatesChange(roundedLat, roundedLng, reverse || undefined);
    });

    // Map click event (moves pin to click location)
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const clickedLat = parseFloat(e.latlng.lat.toFixed(6));
      const clickedLng = parseFloat(e.latlng.lng.toFixed(6));

      marker.setLatLng([clickedLat, clickedLng]);
      map.panTo([clickedLat, clickedLng]);

      setFeedbackMsg(`Pin set at actual coordinates: ${clickedLat}, ${clickedLng}`);

      const reverse = await reverseGeocodeAsync(clickedLat, clickedLng);
      onCoordinatesChange(clickedLat, clickedLng, reverse || undefined);
    });

    markerRef.current = marker;
    mapRef.current = map;

    // Container resize handling
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
      markerRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Update map pin when lat/lng change from external source
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    const currentMarkerPos = markerRef.current.getLatLng();
    const diff = Math.abs(currentMarkerPos.lat - lat) + Math.abs(currentMarkerPos.lng - lng);
    
    // Only update if meaningfully moved
    if (diff > 0.0001) {
      markerRef.current.setLatLng([lat, lng]);
      mapRef.current.flyTo([lat, lng], 15, { duration: 1 });
    }
  }, [lat, lng]);

  // Toggle Map Tiles
  const toggleTileType = (type: 'streets' | 'satellite') => {
    if (!mapRef.current || activeTileType === type) return;
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    if (type === 'streets') {
      tileLayerRef.current = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);
    } else {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      ).addTo(mapRef.current);
    }
    setActiveTileType(type);
  };

  // Search and Pin address on map
  const handleGeocodeAddress = async () => {
    if (!searchQueryText.trim()) {
      setFeedbackMsg('Please enter an address or landmark first.');
      return;
    }

    setIsGeocoding(true);
    setFeedbackMsg('Locating actual coordinates for this address...');
    
    try {
      const result = await geocodeAddressAsync(searchQueryText);
      if (result) {
        const roundedLat = parseFloat(result.lat.toFixed(6));
        const roundedLng = parseFloat(result.lng.toFixed(6));

        if (markerRef.current && mapRef.current) {
          markerRef.current.setLatLng([roundedLat, roundedLng]);
          mapRef.current.flyTo([roundedLat, roundedLng], 15, { duration: 1.2 });
        }

        onCoordinatesChange(roundedLat, roundedLng, result);
        setFeedbackMsg(`Located: ${result.displayName.slice(0, 50)}...`);
      } else {
        setFeedbackMsg('Could not find exact coordinates. Click map to place pin manually.');
      }
    } catch {
      setFeedbackMsg('Geocoding service unavailable. Please click on the map to pinpoint.');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Capture device GPS location
  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGPS(true);
    setFeedbackMsg('Reading your current GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsDetectingGPS(false);
        const actualLat = parseFloat(pos.coords.latitude.toFixed(6));
        const actualLng = parseFloat(pos.coords.longitude.toFixed(6));

        if (markerRef.current && mapRef.current) {
          markerRef.current.setLatLng([actualLat, actualLng]);
          mapRef.current.flyTo([actualLat, actualLng], 16, { duration: 1.2 });
        }

        const reverse = await reverseGeocodeAsync(actualLat, actualLng);
        onCoordinatesChange(actualLat, actualLng, reverse || undefined);
        setFeedbackMsg(`GPS Location locked: ${actualLat}°N, ${actualLng}°E`);
      },
      (err) => {
        setIsDetectingGPS(false);
        setFeedbackMsg(`GPS detection notice: ${err.message}. You can click directly on the map.`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="space-y-2.5 bg-neutral-950/80 p-3.5 rounded-2xl border border-neutral-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold text-neutral-200 uppercase flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>Actual Real-World Yard Coordinates</span>
          </h4>
          <p className="text-[11px] text-neutral-400">
            Pinpoint the exact gate or parking entrance so drivers navigate to the actual spot on the map.
          </p>
        </div>

        {/* Action Buttons: Address Geocode & GPS */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleGeocodeAddress}
            disabled={isGeocoding}
            className="flex-1 sm:flex-initial px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer disabled:opacity-50"
            title="Geocode typed address to exact map coordinates"
          >
            {isGeocoding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span>Locate Address</span>
          </button>

          <button
            type="button"
            onClick={handleUseCurrentGPS}
            disabled={isDetectingGPS}
            className="flex-1 sm:flex-initial px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-neutral-700 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer disabled:opacity-50"
            title="Capture exact GPS location from your device"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${isDetectingGPS ? 'animate-spin' : ''}`} />
            <span>Use My GPS</span>
          </button>
        </div>
      </div>

      {/* Embedded Leaflet Map Pinpoint Canvas */}
      <div className="relative w-full h-56 sm:h-64 rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950">
        <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />

        {/* Floating Tile Switcher */}
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center space-x-1 bg-neutral-900/90 backdrop-blur-md p-1 rounded-xl border border-neutral-700 text-[10px] font-spec">
          <button
            type="button"
            onClick={() => toggleTileType('streets')}
            className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTileType === 'streets' ? 'bg-blue-600 text-white' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Streets
          </button>
          <button
            type="button"
            onClick={() => toggleTileType('satellite')}
            className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTileType === 'satellite' ? 'bg-emerald-600 text-white' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Map Zoom Controls */}
        <div className="absolute top-2.5 right-2.5 z-20 flex flex-col space-y-1 bg-neutral-900/90 backdrop-blur-md p-1 rounded-xl border border-neutral-700">
          <button
            type="button"
            onClick={() => mapRef.current?.zoomIn()}
            className="p-1 text-neutral-300 hover:text-white cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => mapRef.current?.zoomOut()}
            className="p-1 text-neutral-300 hover:text-white cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => mapRef.current?.flyTo([lat, lng], 16)}
            className="p-1 text-blue-400 hover:text-blue-300 cursor-pointer"
            title="Center on Pin"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hint Pill */}
        <div className="absolute bottom-2 left-2 right-2 z-20 pointer-events-none flex justify-center">
          <div className="bg-neutral-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-neutral-800 text-[10px] text-neutral-300 font-spec flex items-center space-x-1.5 shadow-xl">
            <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span>Click map or drag the blue marker to adjust actual entrance coordinates</span>
          </div>
        </div>
      </div>

      {/* Live Coordinate Badges & Status */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 border-t border-neutral-800/80 text-[11px]">
        <div className="flex items-center space-x-3 font-mono">
          <span className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-lg text-neutral-300">
            <strong className="text-neutral-500 mr-1">LAT:</strong>
            <span className="text-blue-400 font-bold">{lat.toFixed(6)}°</span>
          </span>
          <span className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-lg text-neutral-300">
            <strong className="text-neutral-500 mr-1">LNG:</strong>
            <span className="text-blue-400 font-bold">{lng.toFixed(6)}°</span>
          </span>
        </div>

        <div className="flex items-center space-x-1 text-emerald-400 text-[10px] font-semibold">
          <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {feedbackMsg || 'Actual real location ready to be rendered on driver map'}
          </span>
        </div>
      </div>
    </div>
  );
};

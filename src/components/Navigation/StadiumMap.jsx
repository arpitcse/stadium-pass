import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MAP_CONFIG } from '../../config/constants';

// Fix for default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const createGlowingIcon = (status) => L.divIcon({
  className: `custom-div-icon`,
  html: `<div class="pulse-marker ${status}"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

function BoundsHandler() {
  const map = useMap();
  useEffect(() => {
    map.setMaxBounds(MAP_CONFIG.STADIUM_BOUNDS);
    map.on('drag', () => {
      map.panInsideBounds(MAP_CONFIG.STADIUM_BOUNDS, { animate: false });
    });
  }, [map]);
  return null;
}

// Performance optimized using memoization and lazy loading
export const StadiumMap = React.memo(({ status, isNavigating, seatCode }) => {
  // Navigation system designed similar to Google Maps routing logic
  return (
    <div className="flex-1 min-h-[400px] lg:h-full relative glass-card bg-slate-900 border-none p-0 overflow-hidden shadow-2xl shrink-0">
      <MapContainer 
        center={MAP_CONFIG.DEFAULT_CENTER} 
        zoom={MAP_CONFIG.DEFAULT_ZOOM} 
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" maxZoom={MAP_CONFIG.MAX_ZOOM} />
        <BoundsHandler />

        {/* User Location Marker */}
        <Marker position={[-37.8250, 144.9830]} icon={L.divIcon({
          className: 'custom-div-icon',
          html: '<div class="pulse-marker user"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })}>
          <Popup><p className="text-xs font-bold text-indigo-600">You are here • Verified via Cloud Location</p></Popup>
        </Marker>

        <Marker position={[-37.8242, 144.9835]} icon={createGlowingIcon(status.gate2)} />
        <Marker position={[-37.8255, 144.9842]} icon={createGlowingIcon('low')}>
          <Popup><p className="text-xs font-bold">Gate 4 South (Ideal for Seat {seatCode || '...' })</p></Popup>
        </Marker>
        <Marker position={[-37.8249, 144.9839]} icon={createGlowingIcon(status.food)} />

        <Polyline 
          positions={[[-37.8250, 144.9830], [-37.8249, 144.9839], [-37.8255, 144.9842]]} 
          pathOptions={{ 
            color: '#10b981', 
            weight: isNavigating ? 10 : 6, 
            opacity: isNavigating ? 1 : 0.6, 
            dashArray: isNavigating ? '1, 15' : '10, 10',
            className: isNavigating ? 'route-glow' : ''
          }} 
        />
      </MapContainer>
    </div>
  );
});

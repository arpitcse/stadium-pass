import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_CONFIG } from '../../config/constants';
import { MapPin, Utensils, Droplets, Navigation } from 'lucide-react';
import { renderToString } from 'react-dom/server';

/**
 * Custom Marker Icon Generator
 */
const createCustomIcon = (type, color) => {
  const iconMarkup = renderToString(
    <div className="custom-marker">
      <div className={`marker-inner ${color}`}>
        {type === 'gate' && <MapPin size={8} />}
        {type === 'food' && <Utensils size={8} />}
        {type === 'toilet' && <Droplets size={8} />}
      </div>
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-leaflet-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

/**
 * StadiumMap - Realistic Google Maps Powered Navigation
 * Integrates real satellite/hybrid imagery with interactive stadium landmarks.
 */
export const StadiumMap = React.memo(({ status, isNavigating, seatCode }) => {
  // Landmarks for display
  const { GATES, FOOD, RESTROOMS } = MAP_CONFIG.LANDMARKS;

  // AI-suggested route coordinates (Georeferenced Polyline)
  // In a real app, these would come from a routing service or AI analysis of the map
  const routePoints = useMemo(() => [
    [-37.8249, 144.9825], // Gate A
    [-37.8245, 144.9835], // Corridor
    [-37.8252, 144.9838], // Mid point
    [-37.8255, 144.9842]  // VIP Lounge area
  ], []);

  return (
    <div className="stadium-map map-section relative">
      <MapContainer 
        center={MAP_CONFIG.DEFAULT_CENTER} 
        zoom={MAP_CONFIG.DEFAULT_ZOOM} 
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        {/* Google Maps Hybrid Tiles (Satellite + Street Labels) */}
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          maxZoom={MAP_CONFIG.MAX_ZOOM}
        />

        <ZoomControl position="bottomleft" />

        {/* Gates */}
        {GATES.map(gate => (
          <Marker 
            key={gate.id} 
            position={gate.pos} 
            icon={createCustomIcon('gate', 'marker-gate')}
          >
            <Popup className="marker-label-popup">{gate.name}</Popup>
          </Marker>
        ))}

        {/* Food Stalls */}
        {FOOD.map(food => (
          <Marker 
            key={food.id} 
            position={food.pos} 
            icon={createCustomIcon('food', 'marker-food')}
          >
            <Popup className="marker-label-popup">{food.name}</Popup>
          </Marker>
        ))}

        {/* Restrooms */}
        {RESTROOMS.map(restroom => (
          <Marker 
            key={restroom.id} 
            position={restroom.pos} 
            icon={createCustomIcon('toilet', 'marker-toilet')}
          >
            <Popup className="marker-label-popup">{restroom.name}</Popup>
          </Marker>
        ))}

        {/* Active Smart Route Overlays */}
        {isNavigating && (
          <>
            <Polyline 
              positions={routePoints} 
              color="#00f0ff" 
              weight={6} 
              opacity={0.8}
              className="route-glow"
            />
            
            {/* User "You Are Here" Marker */}
            <Marker 
              position={[-37.8250, 144.9830]} 
              icon={createCustomIcon('gate', 'marker-gate')}
            >
              <Popup className="marker-label-popup">You Are Here</Popup>
            </Marker>
          </>
        )}
      </MapContainer>

      {/* Google Maps Branding Label */}
      <div className="map-branding">
        <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" />
        <span>Navigation powered by Google Maps</span>
      </div>

      {/* AI Guiding Dynamic Overlay */}
      {isNavigating && (
        <div className="absolute top-4 right-4 z-[500] pointer-events-none">
          <div className="flex items-center gap-2 bg-indigo-600/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-indigo-400/30 shadow-2xl">
            <Navigation size={10} className="text-white animate-bounce" />
            <span className="text-[8px] font-black text-white uppercase tracking-widest italic">Live Routing Active</span>
          </div>
        </div>
      )}

      {/* Manual Start Hint */}
      {!isNavigating && (
        <div className="absolute inset-0 z-[500] pointer-events-none flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="bg-slate-900/80 p-8 rounded-3xl border border-white/10 text-center flex flex-col items-center gap-4 transition-all scale-animation">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl">🤖</div>
            <p className="text-xs font-black text-white/60 max-w-[180px] uppercase tracking-widest leading-relaxed">Enter seat code to engage real-time navigation</p>
          </div>
        </div>
      )}
    </div>
  );
});

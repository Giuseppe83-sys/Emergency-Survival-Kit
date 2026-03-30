import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguageContext } from '../context/LanguageContext';
import { useMapMarkers } from '../hooks/useLocalStorage';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin, Shield, AlertTriangle, Trash2, Plus } from 'lucide-react';

const MARKER_TYPES = {
  safe: { color: '#34C759', icon: Shield, label: 'safeZone' },
  bunker: { color: '#007AFF', icon: MapPin, label: 'bunker' },
  danger: { color: '#FF3B30', icon: AlertTriangle, label: 'danger' }
};

const EmergencyMap = () => {
  const { t } = useLanguageContext();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  
  const [markers, setMarkers] = useMapMarkers();
  const [selectedMarkerType, setSelectedMarkerType] = useState('safe');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isAddingMarker, setIsAddingMarker] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
          }
        },
        layers: [
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [0, 20],
      zoom: 2,
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      }),
      'top-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle map clicks for adding markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const handleMapClick = (e) => {
      if (!isAddingMarker) return;

      const newMarker = {
        id: `marker-${Date.now()}`,
        type: selectedMarkerType,
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
        createdAt: new Date().toISOString()
      };

      setMarkers(prev => [...prev, newMarker]);
      setIsAddingMarker(false);
    };

    map.current.on('click', handleMapClick);
    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
      }
    };
  }, [mapLoaded, isAddingMarker, selectedMarkerType, setMarkers]);

  // Render markers on map
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers from state
    markers.forEach(markerData => {
      const markerType = MARKER_TYPES[markerData.type];
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = `
        width: 40px;
        height: 40px;
        background-color: ${markerType.color};
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.5);
      `;
      
      // Add icon
      const IconComponent = markerType.icon;
      el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${getIconPath(markerData.type)}"/></svg>`;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([markerData.lng, markerData.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div style="background: #111; color: white; padding: 8px; border: 1px solid #333;">
              <strong style="color: ${markerType.color};">${t(markerType.label)}</strong>
              <br/>
              <small style="color: #888;">${new Date(markerData.createdAt).toLocaleDateString()}</small>
            </div>
          `)
        )
        .addTo(map.current);

      markersRef.current.push(marker);
    });
  }, [markers, mapLoaded, t]);

  const getIconPath = (type) => {
    switch (type) {
      case 'safe':
        return 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z';
      case 'bunker':
        return 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z';
      case 'danger':
        return 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01';
      default:
        return '';
    }
  };

  const clearAllMarkers = () => {
    setMarkers([]);
  };

  const removeMarker = (markerId) => {
    setMarkers(prev => prev.filter(m => m.id !== markerId));
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24" data-testid="map-page">
      {/* Header */}
      <header className="sticky top-0 bg-black z-20 px-4 pt-6 pb-4 border-b border-[#333333]">
        <div className="flex items-center justify-between mb-4">
          <h1 
            className="text-2xl font-bold uppercase tracking-tight"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {t('emergencyMapTitle')}
          </h1>
          {markers.length > 0 && (
            <button
              onClick={clearAllMarkers}
              className="text-xs text-[#FF3B30] uppercase tracking-wider font-bold hover:text-[#FF5249] transition-colors flex items-center gap-1"
              data-testid="clear-markers-btn"
            >
              <Trash2 size={14} />
              {t('clearMarkers')}
            </button>
          )}
        </div>

        {/* Marker Type Selection */}
        <div className="flex gap-2">
          {Object.entries(MARKER_TYPES).map(([type, config]) => {
            const IconComponent = config.icon;
            return (
              <button
                key={type}
                onClick={() => {
                  setSelectedMarkerType(type);
                  setIsAddingMarker(true);
                }}
                data-testid={`marker-type-${type}`}
                className={`flex-1 h-14 flex items-center justify-center gap-2 border transition-all ${
                  selectedMarkerType === type && isAddingMarker
                    ? 'border-white bg-[#1A1A1A]'
                    : 'border-[#333333] bg-[#111111] hover:border-[#52525B]'
                }`}
                style={{ 
                  borderLeftWidth: 4,
                  borderLeftColor: config.color 
                }}
              >
                <IconComponent size={18} style={{ color: config.color }} />
                <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
                  {t(config.label)}
                </span>
              </button>
            );
          })}
        </div>

        {isAddingMarker && (
          <div className="mt-3 p-3 bg-[#FFCC00] text-black text-center font-bold text-sm uppercase tracking-wider">
            {t('tapToMark')}
          </div>
        )}
      </header>

      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-[calc(100vh-260px)]"
        data-testid="map-container"
        style={{ cursor: isAddingMarker ? 'crosshair' : 'grab' }}
      />

      {/* Markers List */}
      {markers.length > 0 && (
        <div className="px-4 py-3 bg-[#111111] border-t border-[#333333]">
          <h3 className="text-xs text-[#A1A1AA] uppercase tracking-widest mb-2">
            Saved Markers ({markers.length})
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {markers.map(marker => {
              const markerType = MARKER_TYPES[marker.type];
              const IconComponent = markerType.icon;
              return (
                <div
                  key={marker.id}
                  className="flex items-center gap-2 px-3 py-2 bg-black border border-[#333333] flex-shrink-0"
                  data-testid={`saved-marker-${marker.id}`}
                >
                  <IconComponent size={14} style={{ color: markerType.color }} />
                  <span className="text-xs text-white">{t(markerType.label)}</span>
                  <button
                    onClick={() => removeMarker(marker.id)}
                    className="ml-1 text-[#52525B] hover:text-[#FF3B30] transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyMap;

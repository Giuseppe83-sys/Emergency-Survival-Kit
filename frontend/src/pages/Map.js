import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguageContext } from '../context/LanguageContext';
import { useMapMarkers } from '../hooks/useLocalStorage';
import { getAllShelters, findNearestShelters, shelterTypeInfo, calculateDistance } from '../data/shelterDatabase';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin, Shield, AlertTriangle, Trash2, Navigation, Train, Building, Home, Crosshair, Layers } from 'lucide-react';

const MARKER_TYPES = {
  safe: { color: '#34C759', icon: Shield, label: 'safeZone' },
  bunker: { color: '#007AFF', icon: MapPin, label: 'bunker' },
  danger: { color: '#FF3B30', icon: AlertTriangle, label: 'danger' }
};

const SHELTER_ICONS = {
  metro: Train,
  bunker: Shield,
  underground: Building,
  basement: Home
};

const EmergencyMap = () => {
  const { t } = useLanguageContext();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const shelterMarkersRef = useRef([]);
  
  const [markers, setMarkers] = useMapMarkers();
  const [selectedMarkerType, setSelectedMarkerType] = useState('safe');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [showShelters, setShowShelters] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestShelters, setNearestShelters] = useState([]);
  const [locatingUser, setLocatingUser] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState(null);

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

  // Get user location
  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocatingUser(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Find nearest shelters
        const nearest = findNearestShelters(latitude, longitude, 20);
        setNearestShelters(nearest);
        
        // Fly to user location
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 12,
            duration: 2000
          });

          // Add user location marker
          const el = document.createElement('div');
          el.className = 'user-location-marker';
          el.style.cssText = `
            width: 20px;
            height: 20px;
            background-color: #007AFF;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(0,122,255,0.6);
          `;

          new maplibregl.Marker({ element: el })
            .setLngLat([longitude, latitude])
            .addTo(map.current);
        }
        
        setLocatingUser(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocatingUser(false);
        alert('Unable to get your location. Please check permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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

  // Render user markers on map
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers from state
    markers.forEach(markerData => {
      const markerType = MARKER_TYPES[markerData.type];
      
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

  // Render shelter markers on map
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing shelter markers
    shelterMarkersRef.current.forEach(marker => marker.remove());
    shelterMarkersRef.current = [];

    if (!showShelters) return;

    // Get shelters to display (either nearest or all)
    const sheltersToShow = nearestShelters.length > 0 ? nearestShelters : getAllShelters();

    sheltersToShow.forEach(shelter => {
      const typeInfo = shelterTypeInfo[shelter.type];
      
      const el = document.createElement('div');
      el.className = 'shelter-marker';
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background-color: ${typeInfo.color};
        border: 2px solid white;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        opacity: 0.9;
      `;
      
      el.innerHTML = getShelterIconSVG(shelter.type);

      el.addEventListener('click', () => {
        setSelectedShelter(shelter);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([shelter.lng, shelter.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25, maxWidth: '280px' }).setHTML(`
            <div style="background: #111; color: white; padding: 12px; border: 1px solid #333; min-width: 200px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 24px; height: 24px; background: ${typeInfo.color}; display: flex; align-items: center; justify-content: center;">
                  ${getShelterIconSVG(shelter.type)}
                </div>
                <strong style="color: ${typeInfo.color}; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">
                  ${typeInfo.label}
                </strong>
              </div>
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${shelter.name}</div>
              <div style="color: #888; font-size: 12px;">${shelter.city}, ${shelter.country}</div>
              ${shelter.depth ? `<div style="color: #666; font-size: 11px; margin-top: 4px;">Depth: ${shelter.depth}</div>` : ''}
              ${shelter.capacity ? `<div style="color: #666; font-size: 11px;">Capacity: ~${shelter.capacity.toLocaleString()}</div>` : ''}
              ${shelter.distance ? `<div style="color: #34C759; font-size: 12px; margin-top: 8px; font-weight: bold;">${shelter.distance.toFixed(1)} km away</div>` : ''}
            </div>
          `)
        )
        .addTo(map.current);

      shelterMarkersRef.current.push(marker);
    });
  }, [showShelters, nearestShelters, mapLoaded]);

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

  const getShelterIconSVG = (type) => {
    const iconPaths = {
      metro: 'M4 15l2-6 6-2 6 2 2 6M4 15v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M8 19v2M16 19v2',
      bunker: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
      underground: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6',
      basement: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
    };
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${iconPaths[type] || iconPaths.bunker}"/></svg>`;
  };

  const clearAllMarkers = () => {
    setMarkers([]);
  };

  const removeMarker = (markerId) => {
    setMarkers(prev => prev.filter(m => m.id !== markerId));
  };

  const flyToShelter = (shelter) => {
    if (map.current) {
      map.current.flyTo({
        center: [shelter.lng, shelter.lat],
        zoom: 15,
        duration: 1500
      });
    }
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
          <div className="flex gap-2">
            <button
              onClick={() => setShowShelters(!showShelters)}
              data-testid="toggle-shelters-btn"
              className={`h-10 w-10 flex items-center justify-center border transition-colors ${
                showShelters 
                  ? 'border-[#34C759] text-[#34C759]' 
                  : 'border-[#333333] text-[#52525B]'
              }`}
              title={showShelters ? 'Hide shelters' : 'Show shelters'}
            >
              <Layers size={18} />
            </button>
            {markers.length > 0 && (
              <button
                onClick={clearAllMarkers}
                className="h-10 px-3 text-xs text-[#FF3B30] uppercase tracking-wider font-bold border border-[#333333] hover:border-[#FF3B30] transition-colors flex items-center gap-1"
                data-testid="clear-markers-btn"
              >
                <Trash2 size={14} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Location & Controls */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={locateUser}
            disabled={locatingUser}
            data-testid="locate-user-btn"
            className={`flex-1 h-12 flex items-center justify-center gap-2 border transition-colors ${
              locatingUser 
                ? 'border-[#333333] text-[#52525B]' 
                : 'border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF] hover:text-white'
            }`}
          >
            {locatingUser ? (
              <Navigation size={18} className="animate-spin" />
            ) : (
              <Crosshair size={18} />
            )}
            <span className="text-sm font-bold uppercase tracking-wider">
              {locatingUser ? 'Locating...' : 'Find My Location'}
            </span>
          </button>
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
                className={`flex-1 h-12 flex items-center justify-center gap-2 border transition-all ${
                  selectedMarkerType === type && isAddingMarker
                    ? 'border-white bg-[#1A1A1A]'
                    : 'border-[#333333] bg-[#111111] hover:border-[#52525B]'
                }`}
                style={{ 
                  borderLeftWidth: 4,
                  borderLeftColor: config.color 
                }}
              >
                <IconComponent size={16} style={{ color: config.color }} />
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

        {/* User location info */}
        {userLocation && (
          <div className="mt-3 p-3 bg-[#111111] border border-[#333333]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation size={14} className="text-[#007AFF]" />
                <span className="text-xs text-[#A1A1AA]">Your Location:</span>
              </div>
              <span className="text-xs font-mono text-white">
                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </span>
            </div>
            {nearestShelters.length > 0 && (
              <div className="mt-2 text-xs text-[#34C759]">
                {nearestShelters.length} shelters found nearby
              </div>
            )}
          </div>
        )}
      </header>

      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-[calc(100vh-380px)]"
        data-testid="map-container"
        style={{ cursor: isAddingMarker ? 'crosshair' : 'grab' }}
      />

      {/* Nearest Shelters List */}
      {nearestShelters.length > 0 && (
        <div className="px-4 py-3 bg-[#111111] border-t border-[#333333]">
          <h3 className="text-xs text-[#A1A1AA] uppercase tracking-widest mb-2">
            Nearest Shelters
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {nearestShelters.slice(0, 5).map(shelter => {
              const typeInfo = shelterTypeInfo[shelter.type];
              const IconComponent = SHELTER_ICONS[shelter.type] || Shield;
              return (
                <button
                  key={shelter.id}
                  onClick={() => flyToShelter(shelter)}
                  className="flex items-center gap-2 px-3 py-2 bg-black border border-[#333333] flex-shrink-0 hover:border-white transition-colors"
                  data-testid={`nearest-shelter-${shelter.id}`}
                >
                  <IconComponent size={14} style={{ color: typeInfo.color }} />
                  <div className="text-left">
                    <div className="text-xs text-white font-medium truncate max-w-[120px]">
                      {shelter.name}
                    </div>
                    <div className="text-xs text-[#34C759] font-mono">
                      {shelter.distance.toFixed(1)} km
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* User Markers List */}
      {markers.length > 0 && (
        <div className="px-4 py-3 bg-[#0A0A0A] border-t border-[#333333]">
          <h3 className="text-xs text-[#A1A1AA] uppercase tracking-widest mb-2">
            Your Markers ({markers.length})
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

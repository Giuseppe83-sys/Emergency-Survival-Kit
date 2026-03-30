import React, { useState, useEffect, useCallback } from 'react';
import { useLanguageContext } from '../context/LanguageContext';
import { RotateCcw, AlertCircle } from 'lucide-react';

const CompassPage = () => {
  const { t } = useLanguageContext();
  const [heading, setHeading] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState(null);

  // Get cardinal direction from heading
  const getCardinalDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  // Handle device orientation
  const handleOrientation = useCallback((event) => {
    let compassHeading;
    
    // iOS devices
    if (event.webkitCompassHeading !== undefined) {
      compassHeading = event.webkitCompassHeading;
    } 
    // Android devices
    else if (event.alpha !== null) {
      // Convert alpha to compass heading
      compassHeading = 360 - event.alpha;
    }
    
    if (compassHeading !== undefined) {
      setHeading(Math.round(compassHeading));
      setPermissionGranted(true);
    }
  }, []);

  // Request permission for iOS 13+
  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
          setPermissionGranted(true);
          setError(null);
        } else {
          setError('Permission denied');
        }
      } catch (err) {
        setError('Permission request failed');
      }
    } else {
      // Non-iOS or older iOS
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  };

  // Initialize compass
  useEffect(() => {
    // Check if device orientation is supported
    if (!window.DeviceOrientationEvent) {
      setIsSupported(false);
      return;
    }

    // Try to add listener directly (works on Android and older iOS)
    window.addEventListener('deviceorientation', handleOrientation, true);

    // Check if we're getting readings after a short delay
    const checkTimeout = setTimeout(() => {
      if (!permissionGranted) {
        // No readings received, might need permission
        setError('Tap "Enable Compass" to start');
      }
    }, 1000);

    return () => {
      clearTimeout(checkTimeout);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [handleOrientation, permissionGranted]);

  // Compass rose markers
  const markers = [
    { deg: 0, label: t('north'), main: true },
    { deg: 45, label: 'NE', main: false },
    { deg: 90, label: t('east'), main: true },
    { deg: 135, label: 'SE', main: false },
    { deg: 180, label: t('south'), main: true },
    { deg: 225, label: 'SW', main: false },
    { deg: 270, label: t('west'), main: true },
    { deg: 315, label: 'NW', main: false }
  ];

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-black text-white pb-24 flex flex-col items-center justify-center px-4" data-testid="compass-page">
        <div className="w-24 h-24 bg-[#111111] border border-[#333333] flex items-center justify-center mb-6">
          <AlertCircle size={48} className="text-[#FF3B30]" />
        </div>
        <h2 className="text-xl font-bold text-center mb-2">{t('compassNotAvailable')}</h2>
        <p className="text-[#A1A1AA] text-center text-sm">
          Device orientation is not supported on this device or browser.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24" data-testid="compass-page">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 border-b border-[#333333]">
        <h1 
          className="text-2xl font-bold uppercase tracking-tight"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {t('compassTitle')}
        </h1>
      </header>

      <div className="p-4 flex flex-col items-center">
        {/* Heading Display */}
        <div className="text-center mb-8 mt-4">
          <div 
            className="text-6xl font-bold tabular-nums"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            data-testid="compass-heading"
          >
            {heading}°
          </div>
          <div className="text-2xl font-bold text-[#FF3B30] uppercase tracking-widest mt-2">
            {getCardinalDirection(heading)}
          </div>
        </div>

        {/* Compass Rose */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-[#333333] rounded-full" />
          
          {/* Rotating compass face */}
          <div 
            className="absolute inset-2 rounded-full bg-[#111111] border border-[#333333] transition-transform duration-100"
            style={{ transform: `rotate(${-heading}deg)` }}
            data-testid="compass-rose"
          >
            {/* Degree markers */}
            {Array.from({ length: 72 }).map((_, i) => {
              const deg = i * 5;
              const isMain = deg % 30 === 0;
              return (
                <div
                  key={deg}
                  className="absolute top-0 left-1/2 origin-bottom"
                  style={{
                    height: '50%',
                    transform: `translateX(-50%) rotate(${deg}deg)`
                  }}
                >
                  <div 
                    className={`${isMain ? 'w-0.5 h-4' : 'w-px h-2'} ${
                      deg === 0 ? 'bg-[#FF3B30]' : 'bg-[#52525B]'
                    }`}
                  />
                </div>
              );
            })}
            
            {/* Cardinal directions */}
            {markers.map(({ deg, label, main }) => (
              <div
                key={deg}
                className="absolute top-0 left-1/2 origin-bottom"
                style={{
                  height: '50%',
                  transform: `translateX(-50%) rotate(${deg}deg)`
                }}
              >
                <span
                  className={`absolute -top-1 left-1/2 -translate-x-1/2 font-bold ${
                    main ? 'text-lg' : 'text-xs text-[#52525B]'
                  } ${deg === 0 ? 'text-[#FF3B30]' : 'text-white'}`}
                  style={{ 
                    transform: `rotate(${-deg + heading}deg)`,
                    marginTop: main ? '20px' : '16px'
                  }}
                >
                  {label}
                </span>
              </div>
            ))}

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 bg-[#FF3B30] rounded-full" />
          </div>

          {/* Fixed north indicator (arrow) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1">
            <div 
              className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-[#FF3B30]"
            />
          </div>
        </div>

        {/* Enable Button (for iOS permission) */}
        {error && !permissionGranted && (
          <button
            onClick={requestPermission}
            data-testid="enable-compass-btn"
            className="mt-8 h-16 px-8 bg-[#FF3B30] text-white font-bold uppercase tracking-wider text-lg flex items-center gap-3 hover:bg-[#FF5249] transition-colors active:scale-[0.98]"
          >
            <RotateCcw size={24} />
            Enable Compass
          </button>
        )}

        {/* Info */}
        <div className="mt-8 p-4 bg-[#111111] border border-[#333333] w-full max-w-sm">
          <h3 className="text-xs text-[#A1A1AA] uppercase tracking-widest mb-2">
            {t('heading')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-black border border-[#222222]">
              <span className="text-xs text-[#52525B]">Degrees</span>
              <div className="text-xl font-bold font-mono">{heading}°</div>
            </div>
            <div className="p-3 bg-black border border-[#222222]">
              <span className="text-xs text-[#52525B]">Direction</span>
              <div className="text-xl font-bold">{getCardinalDirection(heading)}</div>
            </div>
          </div>
        </div>

        {/* Calibration tip */}
        <p className="mt-4 text-xs text-[#52525B] text-center max-w-sm">
          For best accuracy, calibrate by moving your device in a figure-8 pattern
        </p>
      </div>
    </div>
  );
};

export default CompassPage;

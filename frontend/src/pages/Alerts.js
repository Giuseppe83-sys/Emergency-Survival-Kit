import React, { useState, useEffect, useCallback } from 'react';
import { useLanguageContext } from '../context/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { fetchAllAlerts, getSeverityColor, getSeverityLabel, AlertSeverity } from '../services/emergencyAlerts';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
  AlertTriangle, 
  RefreshCw, 
  MapPin, 
  Clock, 
  ExternalLink,
  Wifi,
  WifiOff,
  Radio,
  CloudLightning,
  Flame,
  Activity
} from 'lucide-react';

const categoryIcons = {
  'Geophysical': Activity,
  'Meteorological': CloudLightning,
  'Fire': Flame,
  'Safety': AlertTriangle,
  'Other': Radio
};

const Alerts = () => {
  const { t } = useLanguageContext();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useLocalStorage('survival-kit-alerts-updated', null);
  const [cachedAlerts, setCachedAlerts] = useLocalStorage('survival-kit-alerts-cache', []);
  const [userLocation, setUserLocation] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to a central location if geolocation fails
          setUserLocation({ lat: 40.7128, lng: -74.0060 }); // NYC
        }
      );
    }
  }, []);

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    if (!isOnline) {
      setAlerts(cachedAlerts);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const lat = userLocation?.lat || 40.7128;
      const lng = userLocation?.lng || -74.0060;
      
      const fetchedAlerts = await fetchAllAlerts(lat, lng);
      setAlerts(fetchedAlerts);
      setCachedAlerts(fetchedAlerts);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError('Failed to fetch alerts. Using cached data.');
      setAlerts(cachedAlerts);
    } finally {
      setLoading(false);
    }
  }, [isOnline, userLocation, cachedAlerts, setCachedAlerts, setLastUpdated]);

  // Initial fetch
  useEffect(() => {
    // Fetch immediately with default location if no cached alerts
    const initFetch = async () => {
      if (cachedAlerts.length > 0) {
        setAlerts(cachedAlerts);
      }
      // Always try to fetch fresh data
      await fetchAlerts();
    };
    
    // Small delay to let geolocation attempt complete
    const timer = setTimeout(initFetch, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format relative time
  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24" data-testid="alerts-page">
      {/* Header */}
      <header className="sticky top-0 bg-black z-10 px-4 pt-6 pb-4 border-b border-[#333333]">
        <div className="flex items-center justify-between mb-2">
          <h1 
            className="text-2xl font-bold uppercase tracking-tight"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Emergency Alerts
          </h1>
          <button
            onClick={fetchAlerts}
            disabled={loading || !isOnline}
            data-testid="refresh-alerts-btn"
            className={`h-12 w-12 flex items-center justify-center border transition-colors ${
              loading ? 'border-[#333333] text-[#52525B]' :
              isOnline ? 'border-[#333333] text-white hover:border-white' :
              'border-[#333333] text-[#52525B]'
            }`}
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        
        {/* Status bar */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi size={14} className="text-[#34C759]" />
            ) : (
              <WifiOff size={14} className="text-[#FF9500]" />
            )}
            <span className="text-[#A1A1AA] uppercase tracking-wider">
              {isOnline ? 'Live Updates' : 'Offline - Cached Data'}
            </span>
          </div>
          {lastUpdated && (
            <span className="text-[#52525B]">
              Updated: {formatRelativeTime(lastUpdated)}
            </span>
          )}
        </div>

        {/* Source info */}
        <div className="mt-3 p-3 bg-[#111111] border border-[#333333]">
          <p className="text-xs text-[#A1A1AA]">
            <strong>Sources:</strong> National Weather Service (USA), GDACS (Global)
          </p>
        </div>
      </header>

      {/* Alerts List */}
      <ScrollArea className="h-[calc(100vh-240px)]">
        {loading && alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw size={40} className="text-[#52525B] animate-spin mb-4" />
            <p className="text-[#A1A1AA]">Fetching alerts...</p>
          </div>
        ) : error && alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <AlertTriangle size={40} className="text-[#FF9500] mb-4" />
            <p className="text-[#A1A1AA]">{error}</p>
            <button
              onClick={fetchAlerts}
              className="mt-4 px-6 py-3 bg-[#FF3B30] text-white font-bold uppercase tracking-wider text-sm"
            >
              Retry
            </button>
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-[#34C759] flex items-center justify-center mb-4">
              <AlertTriangle size={40} className="text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">No Active Alerts</h2>
            <p className="text-[#A1A1AA]">
              No emergency alerts in your area. Stay prepared!
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Alert count summary */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[AlertSeverity.EXTREME, AlertSeverity.SEVERE, AlertSeverity.MODERATE, AlertSeverity.MINOR].map(severity => {
                const count = alerts.filter(a => a.severity === severity).length;
                return (
                  <div 
                    key={severity}
                    className="p-3 bg-[#111111] border border-[#333333] text-center"
                    style={{ borderTopColor: getSeverityColor(severity), borderTopWidth: 3 }}
                  >
                    <div className="text-2xl font-bold font-mono">{count}</div>
                    <div className="text-xs text-[#52525B] uppercase tracking-wider">
                      {getSeverityLabel(severity)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Alert cards */}
            {alerts.map((alert) => {
              const IconComponent = categoryIcons[alert.category] || AlertTriangle;
              
              return (
                <div
                  key={alert.id}
                  className="bg-[#111111] border border-[#333333] overflow-hidden"
                  data-testid={`alert-card-${alert.id}`}
                  style={{ borderLeftColor: getSeverityColor(alert.severity), borderLeftWidth: 4 }}
                >
                  {/* Alert header */}
                  <div className="p-4 border-b border-[#333333]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: getSeverityColor(alert.severity) }}
                        >
                          <IconComponent size={20} className="text-white" />
                        </div>
                        <div>
                          <span 
                            className="text-xs font-bold uppercase tracking-wider px-2 py-1"
                            style={{ 
                              backgroundColor: getSeverityColor(alert.severity),
                              color: alert.severity === AlertSeverity.MODERATE ? '#000' : '#fff'
                            }}
                          >
                            {getSeverityLabel(alert.severity)}
                          </span>
                          <h3 className="font-bold text-white mt-2 leading-tight">
                            {alert.title}
                          </h3>
                        </div>
                      </div>
                      <span className="text-xs text-[#52525B] flex-shrink-0">
                        {alert.source}
                      </span>
                    </div>
                  </div>

                  {/* Alert body */}
                  <div className="p-4">
                    {alert.description && (
                      <p className="text-sm text-[#A1A1AA] mb-4 line-clamp-3">
                        {alert.description}
                      </p>
                    )}

                    {/* Meta info */}
                    <div className="space-y-2 text-xs">
                      {alert.area && (
                        <div className="flex items-center gap-2 text-[#52525B]">
                          <MapPin size={14} />
                          <span>{alert.area}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[#52525B]">
                        <Clock size={14} />
                        <span>
                          {alert.effective && `Issued: ${formatRelativeTime(alert.effective)}`}
                          {alert.expires && ` • Expires: ${new Date(alert.expires).toLocaleDateString()}`}
                        </span>
                      </div>
                    </div>

                    {/* Instruction */}
                    {alert.instruction && (
                      <div className="mt-4 p-3 bg-black border border-[#333333]">
                        <h4 className="text-xs font-bold text-[#FF3B30] uppercase tracking-wider mb-2">
                          Instructions
                        </h4>
                        <p className="text-sm text-[#A1A1AA]">{alert.instruction}</p>
                      </div>
                    )}

                    {/* Link */}
                    {alert.url && (
                      <a
                        href={alert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center gap-2 text-sm text-[#007AFF] hover:text-[#0A84FF] transition-colors"
                      >
                        <ExternalLink size={14} />
                        More information
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Alerts;

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguageContext } from '../context/LanguageContext';
import { SecondaryNavigation } from '../components/Navigation';
import LanguageSelector from '../components/LanguageSelector';
import { 
  BookOpen, 
  CheckSquare, 
  AlertTriangle, 
  Map,
  Wifi,
  WifiOff,
  Radio
} from 'lucide-react';

const Home = () => {
  const { t } = useLanguageContext();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const mainFeatures = [
    { 
      path: '/guides', 
      icon: BookOpen, 
      label: t('survivalGuides'),
      color: '#FF3B30',
      description: '7 categories'
    },
    { 
      path: '/checklist', 
      icon: CheckSquare, 
      label: t('goBag'),
      color: '#34C759',
      description: 'Emergency kit'
    },
    { 
      path: '/sos', 
      icon: AlertTriangle, 
      label: t('sos'),
      color: '#FF3B30',
      description: 'Flashlight & Morse'
    },
    { 
      path: '/map', 
      icon: Map, 
      label: t('emergencyMap'),
      color: '#007AFF',
      description: 'Shelters & Safe zones'
    },
    { 
      path: '/alerts', 
      icon: Radio, 
      label: 'Emergency Alerts',
      color: '#FF9500',
      description: 'Live broadcasts'
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-24" data-testid="home-page">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo192.png" 
            alt="Emergency Kit Logo" 
            className="w-14 h-14 object-contain"
          />
          <div>
            <h1 
              className="text-xl font-bold uppercase tracking-tight font-mono"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {t('emergencyKit')}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {isOnline ? (
                <Wifi size={14} className="text-[#34C759]" />
              ) : (
                <WifiOff size={14} className="text-[#FF9500]" />
              )}
              <span className="text-xs text-[#A1A1AA] uppercase tracking-widest">
                {t('offlineReady')}
              </span>
            </div>
          </div>
        </div>
        <LanguageSelector />
      </header>

      {/* Quick Access Grid */}
      <section className="px-4 py-4">
        <h2 
          className="text-sm font-bold uppercase tracking-widest text-[#A1A1AA] mb-4"
          style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          {t('quickAccess')}
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {mainFeatures.map(({ path, icon: Icon, label, color, description }) => (
            <Link
              key={path}
              to={path}
              data-testid={`feature-card-${path.slice(1)}`}
              className="flex flex-col items-center justify-center p-6 bg-[#111111] border border-[#333333] hover:border-white transition-all active:scale-[0.98] min-h-[140px]"
            >
              <div 
                className="w-16 h-16 flex items-center justify-center mb-3"
                style={{ backgroundColor: color }}
              >
                <Icon size={32} strokeWidth={2} className="text-white" />
              </div>
              <span className="text-base font-bold uppercase tracking-wide text-center">
                {label}
              </span>
              <span className="text-xs text-[#52525B] mt-1 uppercase tracking-wider">
                {description}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Secondary Navigation */}
      <section className="px-4 py-2">
        <SecondaryNavigation />
      </section>

      {/* Offline Status Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-[#FF9500] text-black py-2 px-4 text-center font-bold uppercase tracking-wider text-sm z-40">
          <WifiOff size={16} className="inline mr-2" />
          Offline Mode - All Features Available
        </div>
      )}
    </div>
  );
};

export default Home;

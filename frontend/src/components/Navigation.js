import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguageContext } from '../context/LanguageContext';
import { 
  Home, 
  BookOpen, 
  CheckSquare, 
  AlertTriangle, 
  Map, 
  Phone, 
  Timer, 
  Compass 
} from 'lucide-react';

const Navigation = () => {
  const { t } = useLanguageContext();

  const navItems = [
    { path: '/', icon: Home, label: t('home') },
    { path: '/guides', icon: BookOpen, label: t('guides') },
    { path: '/checklist', icon: CheckSquare, label: t('checklist') },
    { path: '/sos', icon: AlertTriangle, label: t('sos') },
    { path: '/map', icon: Map, label: t('map') },
  ];

  const secondaryNav = [
    { path: '/contacts', icon: Phone, label: t('contacts') },
    { path: '/timer', icon: Timer, label: t('timer') },
    { path: '/compass', icon: Compass, label: t('compass') },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 h-20 bg-black border-t-2 border-[#333333] flex justify-around items-center px-2 pb-safe z-50"
      data-testid="main-navigation"
    >
      {navItems.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          data-testid={`nav-${path === '/' ? 'home' : path.slice(1)}`}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 px-2 py-2 min-w-[60px] transition-colors ${
              isActive 
                ? 'text-[#FF3B30]' 
                : 'text-[#A1A1AA] hover:text-white'
            }`
          }
        >
          <Icon size={24} strokeWidth={2} />
          <span className="text-xs font-bold uppercase tracking-wider truncate">
            {label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export const SecondaryNavigation = () => {
  const { t } = useLanguageContext();

  const items = [
    { path: '/contacts', icon: Phone, label: t('contacts') },
    { path: '/timer', icon: Timer, label: t('timer') },
    { path: '/compass', icon: Compass, label: t('compass') },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {items.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          data-testid={`secondary-nav-${path.slice(1)}`}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-[#111111] border border-[#333333] hover:border-white transition-colors"
        >
          <Icon size={28} strokeWidth={2} className="text-white" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
            {label}
          </span>
        </NavLink>
      ))}
    </div>
  );
};

export default Navigation;

# Emergency & War Survival Guide PWA - PRD

## Original Problem Statement
Create a Progressive Web App (PWA) focused on 'Emergency & War Survival Guide'. The app must work 100% offline using service workers.

## User Personas
1. **Emergency Preparedness Individual** - Someone preparing for potential emergencies
2. **First Responder** - Emergency personnel needing quick access to survival guides
3. **Outdoor Enthusiast** - Hikers, campers who need survival information
4. **Crisis Survivor** - Person in an active emergency situation

## Core Requirements (Static)
- ✅ PWA with 100% offline functionality via service workers
- ✅ Searchable survival guides database (7 categories)
- ✅ Interactive Go-Bag checklist with custom items
- ✅ SOS Flashlight/Morse Code tool
- ✅ Emergency Map with MapLibre GL JS for marking safe zones/bunkers
- ✅ Emergency contacts storage
- ✅ Countdown timer
- ✅ Compass tool
- ✅ Multi-language support (EN, ES, FR, DE, AR)
- ✅ High-contrast Red/Black/White dark mode UI
- ✅ Large buttons for stress navigation
- ✅ Emergency Broadcast Integration (NWS USA, GDACS Global)
- ✅ Pre-loaded Shelter Database (89+ locations worldwide)
- ✅ Geolocation-based nearest shelter finder

## What's Been Implemented

### Phase 1 - March 30, 2026 (MVP)
- Home page with quick access grid
- Survival Guides (7 categories: First Aid, Water, Chemical/Nuclear, Shelter, Food, Communication, Navigation)
- Go-Bag Checklist with 48 predefined items across 7 categories + custom items
- SOS Flashlight/Morse Code with custom message support
- Emergency Map with MapLibre GL JS (CARTO dark tiles)
- Emergency Contacts management
- Countdown Timer with presets
- Compass with device orientation support

### Phase 2 - March 30, 2026 (Enhanced Features)
- Emergency Alerts page with live broadcasts from:
  - National Weather Service (USA regional alerts)
  - GDACS - Global Disaster Alerting Coordination System (earthquakes, floods, cyclones, volcanoes, tsunamis)
- Pre-loaded Shelter Database with 89+ locations:
  - Europe: UK, France, Germany, Poland, Ukraine, Russia, Finland, Sweden, Italy, Spain, Austria, Czech Republic, Netherlands, Belgium, Switzerland
  - North America: USA (NY, DC, Chicago, LA, SF), Canada (Toronto, Montreal), Mexico
  - Asia: Japan, South Korea, China, Singapore, Hong Kong, Israel, India, UAE
  - Middle East & Africa: Egypt, Turkey, Iran, South Africa
  - South America: Brazil, Argentina, Chile, Peru, Colombia
  - Oceania: Australia (Sydney, Melbourne)
- Shelter types: Metro stations, Civil Defense Bunkers, Underground Structures, Public Basements
- Geolocation-based nearest shelter finder with distance calculation
- Shelter markers on map with popup details (name, capacity, depth)

### Technical Implementation
- React 19 with React Router
- Tailwind CSS with brutalist design system
- MapLibre GL JS for offline maps
- Local Storage for all user data persistence
- Service Worker for offline caching
- Multi-language i18n system
- CORS proxy for external API access

## Prioritized Backlog

### P0 (Critical) - DONE
- All core features implemented and tested
- Emergency alerts integration working
- Shelter database with 89+ locations

### P1 (High Priority) - Future
- Pre-cache specific map regions for offline use
- Add more shelter locations from user contributions
- Push notifications for nearby alerts
- Export/import checklist and contacts data

### P2 (Medium Priority) - Future
- GPS coordinate display on map
- Offline alert caching
- Share survival guides
- Print-friendly guide versions

### P3 (Low Priority) - Future
- Dark/Light theme toggle
- Custom checklist templates
- Sync across devices
- Community shelter contributions

## Tech Stack
- Frontend: React 19, Tailwind CSS, Lucide Icons
- Maps: MapLibre GL JS
- Storage: LocalStorage, IndexedDB (service worker cache)
- APIs: NWS (National Weather Service), GDACS (Global Disaster Alert)
- Fonts: JetBrains Mono, IBM Plex Sans
- No backend dependencies (100% client-side)

// Pre-loaded shelter database for major cities worldwide
// Types: metro (metro stations), bunker (military/civil defense), basement (public basements), underground (underground structures)

export const shelterDatabase = {
  // EUROPE
  europe: [
    // London, UK
    { id: 'uk-1', city: 'London', country: 'UK', name: 'Westminster Underground', type: 'metro', lat: 51.501, lng: -0.125, capacity: 5000, depth: '24m' },
    { id: 'uk-2', city: 'London', country: 'UK', name: 'Bank Station', type: 'metro', lat: 51.513, lng: -0.089, capacity: 8000, depth: '34m' },
    { id: 'uk-3', city: 'London', country: 'UK', name: 'Chancery Lane', type: 'metro', lat: 51.518, lng: -0.111, capacity: 3000, depth: '28m' },
    
    // Paris, France
    { id: 'fr-1', city: 'Paris', country: 'France', name: 'Châtelet-Les Halles', type: 'metro', lat: 48.862, lng: 2.347, capacity: 15000, depth: '20m' },
    { id: 'fr-2', city: 'Paris', country: 'France', name: 'Nation', type: 'metro', lat: 48.848, lng: 2.396, capacity: 6000, depth: '18m' },
    { id: 'fr-3', city: 'Paris', country: 'France', name: 'République', type: 'metro', lat: 48.867, lng: 2.364, capacity: 5000, depth: '15m' },
    
    // Berlin, Germany
    { id: 'de-1', city: 'Berlin', country: 'Germany', name: 'Alexanderplatz U-Bahn', type: 'metro', lat: 52.521, lng: 13.411, capacity: 10000, depth: '15m' },
    { id: 'de-2', city: 'Berlin', country: 'Germany', name: 'Friedrichstraße', type: 'metro', lat: 52.520, lng: 13.387, capacity: 7000, depth: '12m' },
    { id: 'de-3', city: 'Berlin', country: 'Germany', name: 'Gesundbrunnen Bunker', type: 'bunker', lat: 52.549, lng: 13.389, capacity: 3000, depth: '20m' },
    
    // Warsaw, Poland
    { id: 'pl-1', city: 'Warsaw', country: 'Poland', name: 'Centrum Metro', type: 'metro', lat: 52.229, lng: 21.012, capacity: 8000, depth: '30m' },
    { id: 'pl-2', city: 'Warsaw', country: 'Poland', name: 'Politechnika', type: 'metro', lat: 52.220, lng: 21.017, capacity: 5000, depth: '25m' },
    
    // Kyiv, Ukraine
    { id: 'ua-1', city: 'Kyiv', country: 'Ukraine', name: 'Arsenalna (Deepest metro)', type: 'metro', lat: 50.444, lng: 30.545, capacity: 10000, depth: '105m' },
    { id: 'ua-2', city: 'Kyiv', country: 'Ukraine', name: 'Khreshchatyk', type: 'metro', lat: 50.447, lng: 30.522, capacity: 12000, depth: '85m' },
    { id: 'ua-3', city: 'Kyiv', country: 'Ukraine', name: 'Universytet', type: 'metro', lat: 50.443, lng: 30.503, capacity: 8000, depth: '75m' },
    
    // Moscow, Russia
    { id: 'ru-1', city: 'Moscow', country: 'Russia', name: 'Park Pobedy', type: 'metro', lat: 55.736, lng: 37.516, capacity: 15000, depth: '84m' },
    { id: 'ru-2', city: 'Moscow', country: 'Russia', name: 'Komsomolskaya', type: 'metro', lat: 55.776, lng: 37.655, capacity: 20000, depth: '37m' },
    
    // Helsinki, Finland
    { id: 'fi-1', city: 'Helsinki', country: 'Finland', name: 'Itäkeskus Underground', type: 'bunker', lat: 60.210, lng: 25.082, capacity: 6000, depth: '25m' },
    { id: 'fi-2', city: 'Helsinki', country: 'Finland', name: 'Kamppi Civil Defense', type: 'bunker', lat: 60.169, lng: 24.932, capacity: 4000, depth: '30m' },
    
    // Stockholm, Sweden
    { id: 'se-1', city: 'Stockholm', country: 'Sweden', name: 'T-Centralen', type: 'metro', lat: 59.331, lng: 18.060, capacity: 10000, depth: '20m' },
    { id: 'se-2', city: 'Stockholm', country: 'Sweden', name: 'Kungsträdgården', type: 'metro', lat: 59.331, lng: 18.073, capacity: 5000, depth: '34m' },
    
    // Rome, Italy
    { id: 'it-1', city: 'Rome', country: 'Italy', name: 'Termini Metro', type: 'metro', lat: 41.901, lng: 12.502, capacity: 12000, depth: '15m' },
    { id: 'it-2', city: 'Rome', country: 'Italy', name: 'Colosseo', type: 'metro', lat: 41.890, lng: 12.492, capacity: 4000, depth: '18m' },
    
    // Madrid, Spain
    { id: 'es-1', city: 'Madrid', country: 'Spain', name: 'Sol', type: 'metro', lat: 40.417, lng: -3.703, capacity: 15000, depth: '20m' },
    { id: 'es-2', city: 'Madrid', country: 'Spain', name: 'Gran Vía', type: 'metro', lat: 40.420, lng: -3.701, capacity: 8000, depth: '18m' },
    
    // Vienna, Austria
    { id: 'at-1', city: 'Vienna', country: 'Austria', name: 'Stephansplatz U-Bahn', type: 'metro', lat: 48.208, lng: 16.373, capacity: 8000, depth: '15m' },
    { id: 'at-2', city: 'Vienna', country: 'Austria', name: 'Karlsplatz', type: 'metro', lat: 48.200, lng: 16.370, capacity: 10000, depth: '12m' },
    
    // Prague, Czech Republic
    { id: 'cz-1', city: 'Prague', country: 'Czech Republic', name: 'Můstek', type: 'metro', lat: 50.083, lng: 14.424, capacity: 7000, depth: '35m' },
    { id: 'cz-2', city: 'Prague', country: 'Czech Republic', name: 'Muzeum', type: 'metro', lat: 50.079, lng: 14.430, capacity: 6000, depth: '38m' },

    // Amsterdam, Netherlands
    { id: 'nl-1', city: 'Amsterdam', country: 'Netherlands', name: 'Amsterdam Centraal', type: 'metro', lat: 52.379, lng: 4.900, capacity: 8000, depth: '15m' },
    
    // Brussels, Belgium
    { id: 'be-1', city: 'Brussels', country: 'Belgium', name: 'De Brouckère', type: 'metro', lat: 50.851, lng: 4.353, capacity: 6000, depth: '18m' },
    
    // Zurich, Switzerland
    { id: 'ch-1', city: 'Zurich', country: 'Switzerland', name: 'Sonnenberg Tunnel', type: 'bunker', lat: 47.051, lng: 8.303, capacity: 20000, depth: '40m' },
  ],

  // NORTH AMERICA
  northAmerica: [
    // New York, USA
    { id: 'us-ny-1', city: 'New York', country: 'USA', name: 'Grand Central Terminal', type: 'underground', lat: 40.752, lng: -73.977, capacity: 25000, depth: '15m' },
    { id: 'us-ny-2', city: 'New York', country: 'USA', name: 'Penn Station', type: 'underground', lat: 40.750, lng: -73.993, capacity: 20000, depth: '12m' },
    { id: 'us-ny-3', city: 'New York', country: 'USA', name: '14th St-Union Square', type: 'metro', lat: 40.735, lng: -73.990, capacity: 10000, depth: '10m' },
    
    // Washington DC, USA
    { id: 'us-dc-1', city: 'Washington DC', country: 'USA', name: 'Metro Center', type: 'metro', lat: 38.898, lng: -77.028, capacity: 12000, depth: '25m' },
    { id: 'us-dc-2', city: 'Washington DC', country: 'USA', name: 'Pentagon City', type: 'metro', lat: 38.863, lng: -77.059, capacity: 8000, depth: '30m' },
    { id: 'us-dc-3', city: 'Washington DC', country: 'USA', name: 'Greenbrier Bunker', type: 'bunker', lat: 37.788, lng: -80.303, capacity: 1000, depth: '50m' },
    
    // Chicago, USA
    { id: 'us-ch-1', city: 'Chicago', country: 'USA', name: 'State/Lake', type: 'metro', lat: 41.886, lng: -87.628, capacity: 8000, depth: '12m' },
    { id: 'us-ch-2', city: 'Chicago', country: 'USA', name: 'Clark/Lake', type: 'metro', lat: 41.886, lng: -87.631, capacity: 10000, depth: '15m' },
    
    // Los Angeles, USA
    { id: 'us-la-1', city: 'Los Angeles', country: 'USA', name: '7th St/Metro Center', type: 'metro', lat: 34.048, lng: -118.259, capacity: 8000, depth: '15m' },
    { id: 'us-la-2', city: 'Los Angeles', country: 'USA', name: 'Union Station', type: 'underground', lat: 34.056, lng: -118.236, capacity: 5000, depth: '10m' },
    
    // San Francisco, USA
    { id: 'us-sf-1', city: 'San Francisco', country: 'USA', name: 'Montgomery St BART', type: 'metro', lat: 37.789, lng: -122.402, capacity: 6000, depth: '20m' },
    { id: 'us-sf-2', city: 'San Francisco', country: 'USA', name: 'Powell St BART', type: 'metro', lat: 37.784, lng: -122.408, capacity: 8000, depth: '18m' },
    
    // Toronto, Canada
    { id: 'ca-to-1', city: 'Toronto', country: 'Canada', name: 'Bloor-Yonge', type: 'metro', lat: 43.671, lng: -79.386, capacity: 10000, depth: '20m' },
    { id: 'ca-to-2', city: 'Toronto', country: 'Canada', name: 'Union Station', type: 'underground', lat: 43.645, lng: -79.380, capacity: 15000, depth: '15m' },
    
    // Montreal, Canada
    { id: 'ca-mt-1', city: 'Montreal', country: 'Canada', name: 'Berri-UQAM', type: 'metro', lat: 45.515, lng: -73.562, capacity: 12000, depth: '18m' },
    { id: 'ca-mt-2', city: 'Montreal', country: 'Canada', name: 'McGill', type: 'metro', lat: 45.504, lng: -73.571, capacity: 8000, depth: '15m' },
    
    // Mexico City, Mexico
    { id: 'mx-1', city: 'Mexico City', country: 'Mexico', name: 'Zócalo', type: 'metro', lat: 19.433, lng: -99.133, capacity: 15000, depth: '12m' },
    { id: 'mx-2', city: 'Mexico City', country: 'Mexico', name: 'Pino Suárez', type: 'metro', lat: 19.429, lng: -99.132, capacity: 10000, depth: '10m' },
  ],

  // ASIA
  asia: [
    // Tokyo, Japan
    { id: 'jp-tk-1', city: 'Tokyo', country: 'Japan', name: 'Shinjuku Station', type: 'underground', lat: 35.690, lng: 139.700, capacity: 50000, depth: '25m' },
    { id: 'jp-tk-2', city: 'Tokyo', country: 'Japan', name: 'Shibuya', type: 'metro', lat: 35.658, lng: 139.702, capacity: 30000, depth: '20m' },
    { id: 'jp-tk-3', city: 'Tokyo', country: 'Japan', name: 'Tokyo Station', type: 'underground', lat: 35.681, lng: 139.767, capacity: 40000, depth: '22m' },
    
    // Seoul, South Korea
    { id: 'kr-1', city: 'Seoul', country: 'South Korea', name: 'Gangnam Station', type: 'metro', lat: 37.498, lng: 127.028, capacity: 20000, depth: '30m' },
    { id: 'kr-2', city: 'Seoul', country: 'South Korea', name: 'Seoul Station', type: 'metro', lat: 37.554, lng: 126.973, capacity: 25000, depth: '35m' },
    { id: 'kr-3', city: 'Seoul', country: 'South Korea', name: 'Jamsil', type: 'metro', lat: 37.513, lng: 127.100, capacity: 15000, depth: '28m' },
    
    // Beijing, China
    { id: 'cn-bj-1', city: 'Beijing', country: 'China', name: 'Tiananmen East', type: 'metro', lat: 39.909, lng: 116.408, capacity: 20000, depth: '25m' },
    { id: 'cn-bj-2', city: 'Beijing', country: 'China', name: 'Dongzhimen', type: 'metro', lat: 39.943, lng: 116.436, capacity: 18000, depth: '22m' },
    
    // Shanghai, China
    { id: 'cn-sh-1', city: 'Shanghai', country: 'China', name: 'People\'s Square', type: 'metro', lat: 31.233, lng: 121.474, capacity: 30000, depth: '20m' },
    { id: 'cn-sh-2', city: 'Shanghai', country: 'China', name: 'Lujiazui', type: 'metro', lat: 31.240, lng: 121.504, capacity: 15000, depth: '18m' },
    
    // Singapore
    { id: 'sg-1', city: 'Singapore', country: 'Singapore', name: 'Raffles Place MRT', type: 'metro', lat: 1.284, lng: 103.851, capacity: 12000, depth: '25m' },
    { id: 'sg-2', city: 'Singapore', country: 'Singapore', name: 'City Hall MRT', type: 'metro', lat: 1.293, lng: 103.852, capacity: 10000, depth: '22m' },
    
    // Hong Kong
    { id: 'hk-1', city: 'Hong Kong', country: 'Hong Kong', name: 'Central MTR', type: 'metro', lat: 22.282, lng: 114.158, capacity: 15000, depth: '30m' },
    { id: 'hk-2', city: 'Hong Kong', country: 'Hong Kong', name: 'Tsim Sha Tsui', type: 'metro', lat: 22.297, lng: 114.172, capacity: 12000, depth: '25m' },
    
    // Tel Aviv, Israel
    { id: 'il-1', city: 'Tel Aviv', country: 'Israel', name: 'HaShalom', type: 'metro', lat: 32.073, lng: 34.790, capacity: 8000, depth: '30m' },
    { id: 'il-2', city: 'Tel Aviv', country: 'Israel', name: 'Rabin Square Shelter', type: 'bunker', lat: 32.080, lng: 34.781, capacity: 3000, depth: '20m' },
    
    // Delhi, India
    { id: 'in-1', city: 'Delhi', country: 'India', name: 'Rajiv Chowk', type: 'metro', lat: 28.633, lng: 77.219, capacity: 20000, depth: '15m' },
    { id: 'in-2', city: 'Delhi', country: 'India', name: 'Kashmere Gate', type: 'metro', lat: 28.668, lng: 77.228, capacity: 15000, depth: '12m' },
    
    // Dubai, UAE
    { id: 'ae-1', city: 'Dubai', country: 'UAE', name: 'Burjuman Metro', type: 'metro', lat: 25.253, lng: 55.302, capacity: 10000, depth: '15m' },
    { id: 'ae-2', city: 'Dubai', country: 'UAE', name: 'Union Metro', type: 'metro', lat: 25.267, lng: 55.314, capacity: 8000, depth: '12m' },
  ],

  // MIDDLE EAST & AFRICA
  middleEastAfrica: [
    // Cairo, Egypt
    { id: 'eg-1', city: 'Cairo', country: 'Egypt', name: 'Sadat Metro', type: 'metro', lat: 30.044, lng: 31.234, capacity: 15000, depth: '18m' },
    { id: 'eg-2', city: 'Cairo', country: 'Egypt', name: 'Ramses Station', type: 'underground', lat: 30.062, lng: 31.246, capacity: 10000, depth: '12m' },
    
    // Istanbul, Turkey
    { id: 'tr-1', city: 'Istanbul', country: 'Turkey', name: 'Taksim Metro', type: 'metro', lat: 41.037, lng: 28.985, capacity: 12000, depth: '25m' },
    { id: 'tr-2', city: 'Istanbul', country: 'Turkey', name: 'Levent Metro', type: 'metro', lat: 41.083, lng: 29.011, capacity: 8000, depth: '30m' },
    { id: 'tr-3', city: 'Istanbul', country: 'Turkey', name: 'Yenikapi', type: 'metro', lat: 41.004, lng: 28.950, capacity: 15000, depth: '35m' },
    
    // Tehran, Iran
    { id: 'ir-1', city: 'Tehran', country: 'Iran', name: 'Imam Khomeini Metro', type: 'metro', lat: 35.684, lng: 51.413, capacity: 10000, depth: '25m' },
    { id: 'ir-2', city: 'Tehran', country: 'Iran', name: 'Tajrish Metro', type: 'metro', lat: 35.802, lng: 51.434, capacity: 8000, depth: '30m' },
    
    // Johannesburg, South Africa
    { id: 'za-1', city: 'Johannesburg', country: 'South Africa', name: 'Park Station', type: 'underground', lat: -26.196, lng: 28.042, capacity: 8000, depth: '10m' },
  ],

  // SOUTH AMERICA
  southAmerica: [
    // São Paulo, Brazil
    { id: 'br-sp-1', city: 'São Paulo', country: 'Brazil', name: 'Sé Metro', type: 'metro', lat: -23.550, lng: -46.634, capacity: 15000, depth: '20m' },
    { id: 'br-sp-2', city: 'São Paulo', country: 'Brazil', name: 'Paulista', type: 'metro', lat: -23.555, lng: -46.662, capacity: 12000, depth: '22m' },
    
    // Buenos Aires, Argentina
    { id: 'ar-1', city: 'Buenos Aires', country: 'Argentina', name: '9 de Julio', type: 'metro', lat: -34.604, lng: -58.380, capacity: 10000, depth: '15m' },
    { id: 'ar-2', city: 'Buenos Aires', country: 'Argentina', name: 'Constitución', type: 'metro', lat: -34.628, lng: -58.382, capacity: 8000, depth: '12m' },
    
    // Santiago, Chile
    { id: 'cl-1', city: 'Santiago', country: 'Chile', name: 'Baquedano', type: 'metro', lat: -33.437, lng: -70.635, capacity: 10000, depth: '25m' },
    { id: 'cl-2', city: 'Santiago', country: 'Chile', name: 'Los Héroes', type: 'metro', lat: -33.447, lng: -70.654, capacity: 8000, depth: '20m' },
    
    // Lima, Peru
    { id: 'pe-1', city: 'Lima', country: 'Peru', name: 'Estación Central', type: 'metro', lat: -12.056, lng: -77.039, capacity: 6000, depth: '15m' },
    
    // Bogotá, Colombia
    { id: 'co-1', city: 'Bogotá', country: 'Colombia', name: 'Portal Norte', type: 'underground', lat: 4.759, lng: -74.045, capacity: 5000, depth: '10m' },
  ],

  // OCEANIA
  oceania: [
    // Sydney, Australia
    { id: 'au-sy-1', city: 'Sydney', country: 'Australia', name: 'Town Hall Station', type: 'metro', lat: -33.873, lng: 151.207, capacity: 12000, depth: '20m' },
    { id: 'au-sy-2', city: 'Sydney', country: 'Australia', name: 'Wynyard', type: 'metro', lat: -33.866, lng: 151.205, capacity: 8000, depth: '18m' },
    
    // Melbourne, Australia
    { id: 'au-ml-1', city: 'Melbourne', country: 'Australia', name: 'Melbourne Central', type: 'metro', lat: -37.810, lng: 144.963, capacity: 10000, depth: '25m' },
    { id: 'au-ml-2', city: 'Melbourne', country: 'Australia', name: 'Flinders Street', type: 'underground', lat: -37.818, lng: 144.967, capacity: 15000, depth: '15m' },
  ]
};

// Helper functions
export const getAllShelters = () => {
  return [
    ...shelterDatabase.europe,
    ...shelterDatabase.northAmerica,
    ...shelterDatabase.asia,
    ...shelterDatabase.middleEastAfrica,
    ...shelterDatabase.southAmerica,
    ...shelterDatabase.oceania
  ];
};

export const getSheltersByCountry = (country) => {
  return getAllShelters().filter(s => s.country.toLowerCase() === country.toLowerCase());
};

export const getSheltersByCity = (city) => {
  return getAllShelters().filter(s => s.city.toLowerCase() === city.toLowerCase());
};

export const getSheltersByType = (type) => {
  return getAllShelters().filter(s => s.type === type);
};

// Calculate distance between two points (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Find nearest shelters from a given location
export const findNearestShelters = (lat, lng, limit = 10) => {
  const allShelters = getAllShelters();
  
  const sheltersWithDistance = allShelters.map(shelter => ({
    ...shelter,
    distance: calculateDistance(lat, lng, shelter.lat, shelter.lng)
  }));
  
  sheltersWithDistance.sort((a, b) => a.distance - b.distance);
  
  return sheltersWithDistance.slice(0, limit);
};

// Get shelter type info
export const shelterTypeInfo = {
  metro: { 
    label: 'Metro Station', 
    color: '#007AFF', 
    icon: 'Train',
    description: 'Underground metro/subway stations'
  },
  bunker: { 
    label: 'Civil Defense Bunker', 
    color: '#34C759', 
    icon: 'Shield',
    description: 'Designated civil defense or military bunkers'
  },
  underground: { 
    label: 'Underground Structure', 
    color: '#FF9500', 
    icon: 'Building',
    description: 'Large underground structures (stations, malls)'
  },
  basement: { 
    label: 'Public Basement', 
    color: '#8B5CF6', 
    icon: 'Home',
    description: 'Public building basements'
  }
};

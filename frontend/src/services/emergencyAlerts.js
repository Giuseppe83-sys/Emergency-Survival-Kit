// Emergency Alert Services - Integration with public APIs
// FEMA IPAWS, NWS, GDACS for global emergency alerts

const CORS_PROXY = 'https://corsproxy.io/?';
const NWS_API = 'https://api.weather.gov';

// Alert severity levels
export const AlertSeverity = {
  EXTREME: 'extreme',
  SEVERE: 'severe',
  MODERATE: 'moderate',
  MINOR: 'minor',
  UNKNOWN: 'unknown'
};

// Alert categories
export const AlertCategory = {
  GEO: 'Geophysical', // Earthquake, volcano
  MET: 'Meteorological', // Weather, hurricane
  SAFETY: 'Safety', // Fire, hazmat
  SECURITY: 'Security', // Civil emergency
  RESCUE: 'Rescue', // Search and rescue
  FIRE: 'Fire',
  HEALTH: 'Health', // Pandemic, contamination
  ENV: 'Environmental', // Pollution
  TRANSPORT: 'Transport',
  INFRA: 'Infrastructure',
  CBRNE: 'CBRNE', // Chemical, Biological, Radiological, Nuclear, Explosive
  OTHER: 'Other'
};

// Fetch alerts from National Weather Service (USA)
export const fetchNWSAlerts = async (lat, lng) => {
  try {
    // Get point data first
    const pointResponse = await fetch(`${NWS_API}/points/${lat},${lng}`);
    if (!pointResponse.ok) throw new Error('NWS point lookup failed');
    
    const pointData = await pointResponse.json();
    const zoneUrl = pointData.properties?.forecastZone;
    
    if (!zoneUrl) return [];
    
    // Extract zone ID
    const zoneId = zoneUrl.split('/').pop();
    
    // Get alerts for zone
    const alertsResponse = await fetch(`${NWS_API}/alerts/active/zone/${zoneId}`);
    if (!alertsResponse.ok) throw new Error('NWS alerts fetch failed');
    
    const alertsData = await alertsResponse.json();
    
    return (alertsData.features || []).map(feature => ({
      id: feature.id,
      source: 'NWS',
      title: feature.properties.headline || feature.properties.event,
      description: feature.properties.description,
      severity: mapNWSSeverity(feature.properties.severity),
      category: mapNWSCategory(feature.properties.event),
      effective: feature.properties.effective,
      expires: feature.properties.expires,
      area: feature.properties.areaDesc,
      instruction: feature.properties.instruction,
      url: feature.properties['@id']
    }));
  } catch (error) {
    console.error('NWS API error:', error);
    return [];
  }
};

// Fetch alerts from GDACS (Global Disaster Alerting Coordination System)
export const fetchGDACSAlerts = async () => {
  try {
    // GDACS RSS feed through CORS proxy
    const rssUrl = 'https://www.gdacs.org/xml/rss.xml';
    const response = await fetch(CORS_PROXY + encodeURIComponent(rssUrl), {
      headers: {
        'Accept': 'application/xml, text/xml, */*'
      }
    });
    
    if (!response.ok) throw new Error('GDACS fetch failed');
    
    const text = await response.text();
    
    // Check if we got valid XML
    if (!text.includes('<item>')) {
      console.log('No GDACS alerts or invalid response');
      return [];
    }
    
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    
    // Check for parse errors
    const parseError = xml.querySelector('parsererror');
    if (parseError) {
      console.log('XML parse error:', parseError.textContent);
      return [];
    }
    
    const items = xml.querySelectorAll('item');
    const alerts = [];
    
    items.forEach(item => {
      const title = item.querySelector('title')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      
      // Extract coordinates from georss:point if available
      const point = item.getElementsByTagName('georss:point')[0]?.textContent || 
                   item.querySelector('point')?.textContent || '';
      const [lat, lng] = point.split(' ').map(Number);
      
      // Determine event type from title
      const eventType = title.toLowerCase().includes('earthquake') ? 'earthquake' :
                       title.toLowerCase().includes('flood') ? 'flood' :
                       title.toLowerCase().includes('cyclone') || title.toLowerCase().includes('hurricane') ? 'cyclone' :
                       title.toLowerCase().includes('volcano') ? 'volcano' :
                       title.toLowerCase().includes('tsunami') ? 'tsunami' : 'other';
      
      alerts.push({
        id: `gdacs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        source: 'GDACS',
        title: title,
        description: description.replace(/<[^>]*>/g, ''), // Strip HTML
        severity: extractGDACSeverity(title),
        category: mapGDACSCategory(eventType),
        effective: pubDate,
        expires: null,
        area: extractLocationFromTitle(title),
        lat: lat || null,
        lng: lng || null,
        url: link
      });
    });
    
    return alerts;
  } catch (error) {
    console.error('GDACS API error:', error);
    return [];
  }
};

// Fetch all alerts for a location
export const fetchAllAlerts = async (lat, lng) => {
  const results = await Promise.allSettled([
    fetchNWSAlerts(lat, lng),
    fetchGDACSAlerts()
  ]);
  
  const alerts = [];
  
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      alerts.push(...result.value);
    }
  });
  
  // Sort by severity (extreme first) and date
  alerts.sort((a, b) => {
    const severityOrder = { extreme: 0, severe: 1, moderate: 2, minor: 3, unknown: 4 };
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDiff !== 0) return severityDiff;
    
    return new Date(b.effective) - new Date(a.effective);
  });
  
  return alerts;
};

// Helper functions
const mapNWSSeverity = (severity) => {
  const map = {
    'Extreme': AlertSeverity.EXTREME,
    'Severe': AlertSeverity.SEVERE,
    'Moderate': AlertSeverity.MODERATE,
    'Minor': AlertSeverity.MINOR
  };
  return map[severity] || AlertSeverity.UNKNOWN;
};

const mapNWSCategory = (event) => {
  const eventLower = event.toLowerCase();
  if (eventLower.includes('tornado') || eventLower.includes('hurricane') || 
      eventLower.includes('storm') || eventLower.includes('wind') ||
      eventLower.includes('flood') || eventLower.includes('rain')) {
    return AlertCategory.MET;
  }
  if (eventLower.includes('fire')) return AlertCategory.FIRE;
  if (eventLower.includes('earthquake') || eventLower.includes('tsunami')) return AlertCategory.GEO;
  if (eventLower.includes('evacuation') || eventLower.includes('shelter')) return AlertCategory.SAFETY;
  return AlertCategory.OTHER;
};

const mapGDACSCategory = (eventType) => {
  const map = {
    'earthquake': AlertCategory.GEO,
    'flood': AlertCategory.MET,
    'cyclone': AlertCategory.MET,
    'volcano': AlertCategory.GEO,
    'tsunami': AlertCategory.GEO
  };
  return map[eventType] || AlertCategory.OTHER;
};

const extractGDACSeverity = (title) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('red') || titleLower.includes('high')) return AlertSeverity.EXTREME;
  if (titleLower.includes('orange') || titleLower.includes('moderate')) return AlertSeverity.SEVERE;
  if (titleLower.includes('green') || titleLower.includes('low')) return AlertSeverity.MODERATE;
  return AlertSeverity.UNKNOWN;
};

const extractLocationFromTitle = (title) => {
  // Try to extract location from GDACS title format
  const match = title.match(/in\s+([^,]+(?:,\s*[^,]+)?)/i);
  return match ? match[1].trim() : 'Global';
};

// Get severity color
export const getSeverityColor = (severity) => {
  const colors = {
    [AlertSeverity.EXTREME]: '#FF3B30',
    [AlertSeverity.SEVERE]: '#FF9500',
    [AlertSeverity.MODERATE]: '#FFCC00',
    [AlertSeverity.MINOR]: '#34C759',
    [AlertSeverity.UNKNOWN]: '#A1A1AA'
  };
  return colors[severity] || colors[AlertSeverity.UNKNOWN];
};

// Get severity label
export const getSeverityLabel = (severity) => {
  const labels = {
    [AlertSeverity.EXTREME]: 'EXTREME',
    [AlertSeverity.SEVERE]: 'SEVERE',
    [AlertSeverity.MODERATE]: 'MODERATE',
    [AlertSeverity.MINOR]: 'MINOR',
    [AlertSeverity.UNKNOWN]: 'UNKNOWN'
  };
  return labels[severity] || 'UNKNOWN';
};

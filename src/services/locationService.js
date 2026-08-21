/**
 * JuiceTap Location Service
 * Handles fetching location data from Google Apps Script API endpoint
 * with memory caching, fallback handling, and structured data formatting.
 */

// Default configuration endpoint (or custom environment variable)
const DEFAULT_API_URL = import.meta.env.VITE_LOCATION_API_URL || '';
const CACHE_KEY = 'juicetap_locations_cache_v1';
const CACHE_TTL_MS = 1000; // 1 second cache for instant Excel CSV sync

let memoryCache = null;
let memoryCacheTimestamp = 0;
let pendingFetchPromise = null;

/**
 * Transforms flat API locations array into structured city-grouped objects compatible with JuiceTap UI components.
 * 
 * API format per item:
 * { id, name, address, city, state, pincode, latitude, longitude, phone, timings }
 */
export function groupLocationsByCity(rawLocations = []) {
  if (!Array.isArray(rawLocations) || rawLocations.length === 0) {
    return [];
  }

  const cityMap = new Map();

  rawLocations.forEach((loc) => {
    const cityName = (loc.city || 'Surat').trim();
    const cityKey = cityName.toUpperCase();
    const stateName = (loc.state || '').trim();

    if (!cityMap.has(cityKey)) {
      cityMap.set(cityKey, {
        city: cityName,
        state: stateName,
        status: 'available',
        description: `Active JuiceTap machines serving 100% natural, freshly squeezed orange juice across ${cityName}.`,
        image: getCityDefaultImage(cityName),
        subLocations: [],
      });
    }

    const cityObj = cityMap.get(cityKey);
    if (stateName && !cityObj.state) {
      cityObj.state = stateName;
    }

    cityObj.subLocations.push({
      id: loc.id,
      name: String(loc.name || '').trim() || 'JuiceTap Kiosk',
      address: [loc.address, loc.city, loc.pincode].filter(Boolean).join(', '),
      rawAddress: loc.address || '',
      city: loc.city || cityName,
      state: loc.state || stateName,
      pincode: loc.pincode || '',
      latitude: loc.latitude,
      longitude: loc.longitude,
      phone: loc.phone || '',
      timings: loc.timings || '',
      type: loc.type || 'JuiceTap Location',
      image: loc.image || cityObj.image,
    });
  });

  return Array.from(cityMap.values());
}

function getCityDefaultImage(cityName) {
  const c = cityName.toLowerCase();
  if (c.includes('surat')) return '/assets/surat-location.jpg';
  if (c.includes('mumbai')) return '/assets/mumbai-location.jpg';
  if (c.includes('ahmedabad')) return '/assets/ahmedabad-location.jpg';
  if (c.includes('delhi')) return '/assets/delhi-location.jpg';
  if (c.includes('jaipur')) return '/assets/jaipur-location.jpg';
  if (c.includes('statue') || c.includes('unity')) return '/assets/statue-of-unity.jpg';
  return '/assets/business-locations.png';
}

/**
 * Fetches active locations from Google Apps Script endpoint.
 * Returns raw location objects and structured location groups.
 */
export async function fetchLocations(options = {}) {
  const { apiUrl = DEFAULT_API_URL, forceRefresh = false } = options;

  const now = Date.now();

  // Return cached result if available and fresh
  if (!forceRefresh && memoryCache && (now - memoryCacheTimestamp < CACHE_TTL_MS)) {
    return memoryCache;
  }

  // Deduplicate concurrent fetch requests
  if (pendingFetchPromise && !forceRefresh) {
    return pendingFetchPromise;
  }

  pendingFetchPromise = (async () => {
    // 1. Load from local Excel CSV file FIRST for instant spreadsheet updates
    try {
      const csvLocations = await fetchCsvLocations();
      if (csvLocations && csvLocations.length > 0) {
        const groupedLocations = groupLocationsByCity(csvLocations);
        const result = {
          success: true,
          rawLocations: csvLocations,
          groupedLocations,
          isConfigured: true,
          source: 'local_csv',
        };
        memoryCache = result;
        memoryCacheTimestamp = Date.now();
        saveLocalStorageCache(result);
        return result;
      }
    } catch (csvErr) {
      console.warn('[JuiceTap Location Service] CSV fetch warning, trying Google API:', csvErr);
    }

    // 2. Secondary fallback to Google Apps Script Web App
    if (apiUrl && apiUrl !== 'GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.success && Array.isArray(data.locations) && data.locations.length > 0) {
            const rawLocations = data.locations;
            const groupedLocations = groupLocationsByCity(rawLocations);
            const result = {
              success: true,
              rawLocations,
              groupedLocations,
              isConfigured: true,
              source: 'google_api',
            };
            memoryCache = result;
            memoryCacheTimestamp = Date.now();
            saveLocalStorageCache(result);
            return result;
          }
        }
      } catch (err) {
        console.error('[JuiceTap Location Service] Google API fetch error:', err);
      }
    }

    // Fallback to local storage cache if available
    const cached = loadLocalStorageCache();
    if (cached) {
      return { ...cached, fromCacheOnError: true };
    }

    return {
      success: false,
      error: 'Locations are temporarily unavailable. Please check again shortly.',
      rawLocations: [],
      groupedLocations: [],
      isConfigured: true,
    };
  })();

  return pendingFetchPromise;
}

async function fetchCsvLocations() {
  const res = await fetch('/JuiceTap_Locations_Template.csv');
  if (!res.ok) return [];
  const text = await res.text();
  return parseCsv(text);
}

function parseCsv(csvText) {
  if (!csvText || !csvText.trim()) return [];
  
  const delimiter = csvText.indexOf('\t') !== -1 && csvText.indexOf('\t') < csvText.indexOf('\n') ? '\t' : ',';
  
  // Custom CSV split respecting quoted strings
  const parseRow = (textLine) => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < textLine.length; i++) {
      const char = textLine[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(cur.replace(/^"|"$/g, '').trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.replace(/^"|"$/g, '').trim());
    return result;
  };

  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  if (lines.length <= 1) return [];

  const headers = parseRow(lines[0]).map(h => h.toLowerCase());
  const locations = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseRow(lines[i]);
    if (!row || row.length < 2) continue;

    const getVal = (col) => {
      const idx = headers.indexOf(col);
      return (idx !== -1 && idx < row.length) ? row[idx] : '';
    };

    const name = getVal('name');
    const address = getVal('address');
    const status = getVal('status').toLowerCase();

    if ((status === 'active' || !status) && (name || address)) {
      locations.push({
        id: getVal('id') || `JT${i.toString().padStart(3, '0')}`,
        name: name || address || 'JuiceTap Kiosk',
        address: address,
        city: getVal('city') || 'Surat',
        state: getVal('state') || '',
        pincode: getVal('pincode') || '',
        latitude: parseFloat(getVal('latitude')) || null,
        longitude: parseFloat(getVal('longitude')) || null,
        phone: getVal('phone') ? (getVal('phone').startsWith('+') ? getVal('phone') : '+' + getVal('phone')) : '+918511533004',
        timings: getVal('timings') || '10 AM - 10 PM',
      });
    }
  }

  return locations;
}

function saveLocalStorageCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch (e) {
    // Ignore storage quota errors
  }
}

function loadLocalStorageCache() {
  try {
    const item = localStorage.getItem(CACHE_KEY);
    if (!item) return null;
    const parsed = JSON.parse(item);
    if (Date.now() - parsed.timestamp < CACHE_TTL_MS * 4) { // Keep local backup up to 20 mins
      return parsed.data;
    }
  } catch (e) {
    return null;
  }
  return null;
}

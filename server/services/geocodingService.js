import axios from 'axios';

/**
 * OpenStreetMap Nominatim API — 100% FREE, no API key needed.
 * Rate limit: 1 req/sec (we respect this with User-Agent header).
 * Docs: https://nominatim.org/release-docs/latest/api/Search/
 */

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'PlanMyDate/1.0 (date-planning-app)';

/**
 * Geocode a city/address name → lat/lng
 */
export async function geocodeCity(query) {
    try {
        const { data } = await axios.get(`${NOMINATIM_BASE}/search`, {
            params: {
                q: query,
                format: 'json',
                limit: 1,
                addressdetails: 1,
            },
            headers: { 'User-Agent': USER_AGENT },
            timeout: 5000,
        });

        if (!data || data.length === 0) {
            return { city: query, lat: null, lng: null };
        }

        const result = data[0];
        return {
            city: result.display_name,
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
        };
    } catch (err) {
        console.warn('⚠️ Nominatim geocoding error:', err.message);
        return { city: query, lat: null, lng: null };
    }
}

/**
 * Reverse geocode lat/lng → city name
 */
export async function reverseGeocode(lat, lng) {
    try {
        const { data } = await axios.get(`${NOMINATIM_BASE}/reverse`, {
            params: {
                lat,
                lon: lng,
                format: 'json',
                addressdetails: 1,
            },
            headers: { 'User-Agent': USER_AGENT },
            timeout: 5000,
        });

        if (!data || !data.address) {
            return null;
        }

        const addr = data.address;
        return addr.city || addr.town || addr.village || addr.county || 'Unknown Location';
    } catch (err) {
        console.warn('⚠️ Reverse geocoding error:', err.message);
        return null;
    }
}

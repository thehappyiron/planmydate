import axios from 'axios';

/**
 * OpenStreetMap Overpass API — 100% FREE, no API key needed.
 * Searches for Points of Interest (POI) near a location.
 * Docs: https://wiki.openstreetmap.org/wiki/Overpass_API
 *
 * Also uses Nominatim search as a simpler fallback.
 */

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'PlanMyDate/1.0 (date-planning-app)';

// Map our categories to OSM amenity/leisure tags
const CATEGORY_OSM_MAP = {
    foodie: ['restaurant', 'cafe', 'bar', 'fast_food', 'pub'],
    romantic: ['restaurant', 'theatre', 'spa', 'garden'],
    adventurous: ['theme_park', 'sports_centre', 'climbing', 'water_park'],
    cultural: ['museum', 'gallery', 'library', 'theatre', 'arts_centre'],
    casual: ['cafe', 'cinema', 'bowling_alley', 'park'],
    outdoorsy: ['park', 'nature_reserve', 'garden', 'playground', 'beach'],
};

/**
 * Search for real venues near a location using Nominatim search.
 * This is simpler and more reliable than Overpass for our use case.
 */
export async function searchNearbyVenues({ lat, lng, category }) {
    try {
        // Get OSM tags for this category
        const osmTags = CATEGORY_OSM_MAP[category] || CATEGORY_OSM_MAP.casual;
        const searchTerm = osmTags[0]; // Use primary tag as search keyword

        const { data } = await axios.get(`${NOMINATIM_BASE}/search`, {
            params: {
                q: searchTerm,
                format: 'json',
                limit: 5,
                viewbox: `${lng - 0.05},${lat + 0.05},${lng + 0.05},${lat - 0.05}`,
                bounded: 1,
                addressdetails: 1,
            },
            headers: { 'User-Agent': USER_AGENT },
            timeout: 8000,
        });

        if (!data || data.length === 0) return [];

        return data.map((place) => ({
            name: place.display_name.split(',')[0], // First part is the name
            address: place.display_name.split(',').slice(1, 3).join(',').trim(),
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon),
            type: place.type,
        }));
    } catch (err) {
        console.warn('⚠️ Nominatim venue search error:', err.message);
        return [];
    }
}

/**
 * Enrich AI-generated date ideas with real venue data from OpenStreetMap.
 * Adds real nearby venue names where possible.
 */
export async function enrichWithVenues(dateIdeas, location) {
    if (!location.lat || !location.lng) return dateIdeas;

    // Process sequentially to respect Nominatim rate limit (1 req/sec)
    const enriched = [];
    for (const idea of dateIdeas) {
        try {
            const venues = await searchNearbyVenues({
                lat: location.lat,
                lng: location.lng,
                category: idea.category,
            });

            if (venues.length > 0) {
                const top = venues[0];
                enriched.push({
                    ...idea,
                    venue: top.name,
                    address: top.address,
                });
            } else {
                enriched.push(idea);
            }

            // Rate limit: wait 1.1 seconds between requests
            await new Promise((resolve) => setTimeout(resolve, 1100));
        } catch {
            enriched.push(idea);
        }
    }

    return enriched;
}

import { Router } from 'express';
import { geocodeCity, reverseGeocode } from '../services/geocodingService.js';
import { getWeather } from '../services/weatherService.js';

const router = Router();

// ── Geocode a city name (FREE — OpenStreetMap Nominatim) ──
router.get('/geocode', async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter "q" is required.' });
        }

        const result = await geocodeCity(q);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

// ── Reverse geocode lat/lng → city name ───────────
router.get('/reverse-geocode', async (req, res, next) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: 'lat and lng are required.' });
        }

        const city = await reverseGeocode(parseFloat(lat), parseFloat(lng));
        res.json({ city: city || 'Unknown Location' });
    } catch (err) {
        next(err);
    }
});

// ── Get Weather ───────────────────────────────────
router.get('/weather', async (req, res, next) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: 'lat and lng are required.' });
        }

        const weather = await getWeather(parseFloat(lat), parseFloat(lng));
        if (!weather) {
            return res.json({ weather: null, message: 'Weather data unavailable.' });
        }

        res.json({ weather });
    } catch (err) {
        next(err);
    }
});

export default router;

import { Router } from 'express';
import DatePlan from '../models/DatePlan.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { generateDateItinerary } from '../services/geminiService.js';
import { getWeather } from '../services/weatherService.js';

const router = Router();

// ── Generate Full Date Itinerary (core endpoint) ──
router.post('/generate', optionalAuth, async (req, res, next) => {
    try {
        const { location, budget, dateTypes, personality } = req.body;

        if (!location || !location.city) {
            return res.status(400).json({ error: 'Location is required.' });
        }

        // 1. Generate full AI itinerary
        const itinerary = await generateDateItinerary({
            location,
            budget: budget || 'moderate',
            dateTypes: dateTypes || [],
            personality: personality || { tags: [], custom: '' },
        });

        // 2. Get weather info (optional)
        let weather = null;
        if (location.lat && location.lng) {
            weather = await getWeather(location.lat, location.lng);
        }

        // 3. Save to DB if user logged in
        let datePlanId = null;
        if (req.user) {
            const plan = await DatePlan.create({
                userId: req.user._id,
                location,
                budget,
                dateTypes,
                personality,
                generatedDates: itinerary.itinerary?.flatMap((block) =>
                    block.activities.map((a) => ({
                        icon: a.icon || '💡',
                        title: a.title,
                        label: block.timeBlock,
                        description: a.description,
                        venue: a.place,
                        estimatedCost: a.estimatedCost,
                        category: a.category,
                    }))
                ) || [],
            });
            datePlanId = plan._id;
        }

        res.json({
            datePlanId,
            itinerary,
            weather,
        });
    } catch (err) {
        // Send clean error message, not raw API dump
        const status = err.statusCode || 500;
        const message = err.statusCode
            ? err.message
            : 'Something went wrong while generating your date plan. Please try again.';
        res.status(status).json({ error: message });
    }
});

// ── Get Date Plan History (protected) ─────────────
router.get('/history', protect, async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [plans, total] = await Promise.all([
            DatePlan.find({ userId: req.user._id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            DatePlan.countDocuments({ userId: req.user._id }),
        ]);

        res.json({ plans, page, totalPages: Math.ceil(total / limit), total });
    } catch (err) {
        next(err);
    }
});

// ── Get Single Date Plan ──────────────────────────
router.get('/:id', protect, async (req, res, next) => {
    try {
        const plan = await DatePlan.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!plan) {
            return res.status(404).json({ error: 'Date plan not found.' });
        }

        res.json({ plan });
    } catch (err) {
        next(err);
    }
});

export default router;

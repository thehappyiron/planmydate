import { Router } from 'express';
import SavedDate from '../models/SavedDate.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All saved routes require authentication
router.use(protect);

// ── Save a Date Idea ──────────────────────────────
router.post('/', async (req, res, next) => {
    try {
        const { datePlanId, dateItem } = req.body;

        if (!dateItem || !dateItem.title) {
            return res.status(400).json({ error: 'Date item with title is required.' });
        }

        const saved = await SavedDate.create({
            userId: req.user._id,
            datePlanId: datePlanId || null,
            dateItem,
        });

        res.status(201).json({ saved });
    } catch (err) {
        next(err);
    }
});

// ── Get All Saved Dates ───────────────────────────
router.get('/', async (req, res, next) => {
    try {
        const saved = await SavedDate.find({ userId: req.user._id })
            .sort({ savedAt: -1 })
            .lean();

        res.json({ saved, total: saved.length });
    } catch (err) {
        next(err);
    }
});

// ── Update Saved Date (notes, completed) ──────────
router.patch('/:id', async (req, res, next) => {
    try {
        const { notes, isCompleted } = req.body;

        const saved = await SavedDate.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { ...(notes !== undefined && { notes }), ...(isCompleted !== undefined && { isCompleted }) },
            { new: true, runValidators: true }
        );

        if (!saved) {
            return res.status(404).json({ error: 'Saved date not found.' });
        }

        res.json({ saved });
    } catch (err) {
        next(err);
    }
});

// ── Delete Saved Date ─────────────────────────────
router.delete('/:id', async (req, res, next) => {
    try {
        const saved = await SavedDate.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!saved) {
            return res.status(404).json({ error: 'Saved date not found.' });
        }

        res.json({ message: 'Removed from saved dates.' });
    } catch (err) {
        next(err);
    }
});

export default router;

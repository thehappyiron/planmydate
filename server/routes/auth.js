import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();

function signToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// ── Register ──────────────────────────────────────
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ error: 'Email already registered.' });
        }

        const user = await User.create({ name, email, password });
        const token = signToken(user._id);

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        next(err);
    }
});

// ── Login ─────────────────────────────────────────
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = signToken(user._id);

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        next(err);
    }
});

// ── Get Current User ──────────────────────────────
router.get('/me', protect, (req, res) => {
    res.json({
        user: { id: req.user._id, name: req.user.name, email: req.user.email },
    });
});

export default router;

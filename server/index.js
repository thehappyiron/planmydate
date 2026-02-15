import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import dateRoutes from './routes/dates.js';
import savedRoutes from './routes/saved.js';
import locationRoutes from './routes/location.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security ──────────────────────────────────────
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));

// ── Rate Limiting ─────────────────────────────────
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Stricter limit for AI generation endpoint
const generateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: { error: 'Generation limit reached. Please wait a moment.' },
});
app.use('/api/dates/generate', generateLimiter);

// ── Body Parsing ──────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ── Routes ────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/dates', dateRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/location', locationRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Error Handler ─────────────────────────────────
app.use(errorHandler);

// ── Database & Start ──────────────────────────────
async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');

        app.listen(PORT, () => {
            console.log(`🚀 PlanMyDate API running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    }
}

start();

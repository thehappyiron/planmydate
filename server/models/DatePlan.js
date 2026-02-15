import mongoose from 'mongoose';

const dateItemSchema = new mongoose.Schema({
    icon: { type: String, default: '💡' },
    title: { type: String, required: true },
    label: { type: String },
    description: { type: String },
    venue: { type: String },
    estimatedCost: { type: String },
    category: { type: String },
    placeId: { type: String },       // Google Places ID
    rating: { type: Number },
    address: { type: String },
}, { _id: true });

const datePlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    location: {
        city: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number },
    },
    budget: {
        type: String,
        enum: ['budget', 'moderate', 'luxury'],
        default: 'moderate',
    },
    dateTypes: [{ type: String }],
    personality: {
        tags: [{ type: String }],
        custom: { type: String, default: '' },
    },
    generatedDates: [dateItemSchema],
}, {
    timestamps: true,
});

export default mongoose.model('DatePlan', datePlanSchema);

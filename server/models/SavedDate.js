import mongoose from 'mongoose';

const savedDateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    datePlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DatePlan',
    },
    dateItem: {
        icon: { type: String, default: '💡' },
        title: { type: String, required: true },
        label: { type: String },
        description: { type: String },
        venue: { type: String },
        estimatedCost: { type: String },
    },
    notes: { type: String, default: '' },
    isCompleted: { type: Boolean, default: false },
}, {
    timestamps: { createdAt: 'savedAt', updatedAt: true },
});

export default mongoose.model('SavedDate', savedDateSchema);

import DateCard from './DateCard';
import './DateGrid.css';

export default function DateGrid({ dates, loading }) {
    if (loading) {
        return (
            <div className="loading-state" role="status" aria-live="polite">
                <div className="heart-pulse animate-heart-pulse">💕</div>
                <p>Finding perfect date spots...</p>
            </div>
        );
    }

    if (!dates || dates.length === 0) {
        return (
            <div className="empty-state" role="status">
                <span className="empty-icon">💔</span>
                <h3>No dates found</h3>
                <p>Try adjusting your preferences or budget</p>
            </div>
        );
    }

    return (
        <div className="date-grid">
            {dates.map((date, i) => (
                <DateCard
                    key={date.id}
                    icon={date.icon}
                    title={date.title}
                    label={date.label}
                    index={i}
                />
            ))}
        </div>
    );
}

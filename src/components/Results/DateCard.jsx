import './DateCard.css';

export default function DateCard({ icon, title, label, index }) {
    return (
        <div
            className={`date-card animate-float-up stagger-${index + 1}`}
            tabIndex={0}
            role="article"
            aria-label={`${title} date idea`}
        >
            <span className="date-icon" aria-hidden="true">{icon}</span>
            <h3 className="date-title">{title}</h3>
            <span className="date-label">{label}</span>
        </div>
    );
}

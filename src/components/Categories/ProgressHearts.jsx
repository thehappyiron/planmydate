export default function ProgressHearts({ filled = 0, total = 10 }) {
    return (
        <div className="progress-hearts" aria-label={`${filled} of ${total} completed`}>
            {Array.from({ length: total }, (_, i) => (
                <span key={i} className={i < filled ? 'heart filled' : 'heart'}>
                    {i < filled ? '❤️' : '🤍'}
                </span>
            ))}
        </div>
    );
}

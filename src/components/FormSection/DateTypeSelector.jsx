const dateTypes = [
    { key: 'foodie', icon: '🍷', label: 'Foodie' },
    { key: 'casual', icon: '☕', label: 'Casual' },
    { key: 'romantic', icon: '💕', label: 'Romantic' },
    { key: 'adventurous', icon: '🎭', label: 'Adventurous' },
    { key: 'cultural', icon: '🎨', label: 'Cultural' },
    { key: 'outdoorsy', icon: '🌳', label: 'Outdoorsy' },
];

export default function DateTypeSelector({ selected, onToggle }) {
    return (
        <div className="form-group">
            <label className="form-label">💕 What type of date are you planning?</label>
            <div className="chip-grid" role="group" aria-label="Date type selection">
                {dateTypes.map((dt) => (
                    <button
                        key={dt.key}
                        type="button"
                        className={`type-chip${selected.includes(dt.key) ? ' selected' : ''}`}
                        onClick={() => onToggle(dt.key)}
                        aria-pressed={selected.includes(dt.key)}
                    >
                        <span aria-hidden="true">{dt.icon}</span> {dt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

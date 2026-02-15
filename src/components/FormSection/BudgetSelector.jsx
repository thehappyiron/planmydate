const budgetOptions = [
    { key: 'budget', icon: '💵', label: 'Budget-Friendly', range: 'Under ₹500' },
    { key: 'moderate', icon: '💳', label: 'Moderate', range: '₹500-2000' },
    { key: 'luxury', icon: '💎', label: 'Luxury', range: '₹2000+' },
];

export default function BudgetSelector({ selected, onSelect }) {
    return (
        <div className="form-group">
            <label className="form-label">💰 What's your budget per person?</label>
            <div className="budget-grid" role="radiogroup" aria-label="Budget selection">
                {budgetOptions.map((opt) => (
                    <button
                        key={opt.key}
                        type="button"
                        className={`budget-card${selected === opt.key ? ' selected' : ''}`}
                        onClick={() => onSelect(opt.key)}
                        role="radio"
                        aria-checked={selected === opt.key}
                    >
                        <span className="budget-icon">{opt.icon}</span>
                        <span className="budget-label">{opt.label}</span>
                        <span className="budget-range">{opt.range}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

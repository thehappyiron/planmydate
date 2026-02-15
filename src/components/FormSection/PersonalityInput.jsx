const personalityTags = [
    'Introvert', 'Extrovert', 'Adventurous',
    'Laid-back', 'Artsy', 'Sporty',
];

export default function PersonalityInput({
    selectedTags,
    onToggleTag,
    customText,
    onCustomChange,
}) {
    return (
        <div className="form-group">
            <label className="form-label">
                ✨ Tell us about your partner's personality
            </label>
            <div className="chip-grid" role="group" aria-label="Personality tags">
                {personalityTags.map((tag) => (
                    <button
                        key={tag}
                        type="button"
                        className={`tag-btn${selectedTags.includes(tag) ? ' selected' : ''}`}
                        onClick={() => onToggleTag(tag)}
                        aria-pressed={selectedTags.includes(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>
            <textarea
                className="personality-textarea"
                placeholder="Anything else we should know? (optional)"
                value={customText}
                onChange={(e) => onCustomChange(e.target.value)}
                aria-label="Additional personality details"
                rows={3}
            />
        </div>
    );
}

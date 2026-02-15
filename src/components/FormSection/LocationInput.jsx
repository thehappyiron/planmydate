import './FormSection.css';

export default function LocationInput({ value, onChange, onUseLocation }) {
    return (
        <div className="form-group">
            <label className="form-label" htmlFor="location-input">
                📍 Where are you planning your date?
            </label>
            <div className="input-row">
                <input
                    id="location-input"
                    type="text"
                    className="form-input"
                    placeholder="Enter city or neighborhood"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    aria-describedby="location-hint"
                />
                <button
                    type="button"
                    className="location-btn"
                    onClick={onUseLocation}
                    aria-label="Use your current location"
                >
                    📍 Use Current Location
                </button>
            </div>
        </div>
    );
}

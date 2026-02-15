export default function GenerateButton({ onClick, loading }) {
    return (
        <button
            type="button"
            className="generate-btn"
            onClick={onClick}
            disabled={loading}
            aria-busy={loading}
        >
            <span>{loading ? 'Generating...' : '✨ Generate Date Ideas'}</span>
            {!loading && <span className="btn-arrow" aria-hidden="true">→</span>}
            {loading && <span className="btn-spinner" aria-hidden="true" />}
        </button>
    );
}

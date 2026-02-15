import './TwoColumnLayout.css';

export default function TwoColumnLayout({ left, right }) {
    return (
        <div className="two-column-layout">
            <aside className="column-left" aria-label="Date preferences form">
                {left}
            </aside>
            <main className="column-right" aria-label="Date suggestions">
                {right}
            </main>
        </div>
    );
}

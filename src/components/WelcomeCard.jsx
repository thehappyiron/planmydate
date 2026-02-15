import './WelcomeCard.css';

export default function WelcomeCard() {
    return (
        <div className="header-section">
            <h1 className="main-title">PlanMyDate 💕</h1>
            <div className="welcome-card" role="banner">
                <span className="welcome-icon" aria-hidden="true">📬</span>
                <div className="welcome-text">
                    <p className="welcome-main">
                        Welcome to PlanMyDate! This AI-powered tool helps you create
                        unforgettable date experiences based on your preferences, budget,
                        and your partner's personality.
                    </p>
                    <p className="welcome-sub">
                        Use the form below to tell us about your date plans, and we'll
                        curate the perfect options for you. Happy planning! ❤️
                    </p>
                </div>
            </div>
        </div>
    );
}

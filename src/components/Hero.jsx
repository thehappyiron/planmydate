import './Hero.css';

export default function Hero() {
    return (
        <section className="hero" aria-hidden="true">
            <div className="hero-hearts">
                <span className="hero-heart hero-heart-lg">💗</span>
                <span className="hero-heart hero-heart-sm">💕</span>
            </div>
            <div className="hero-wave"></div>
        </section>
    );
}

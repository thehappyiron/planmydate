import './CategoryCard.css';

const CATEGORY_DATA = {
    'Foodie': {
        icon: '🍽️',
        emoji2: '🧑‍🍳',
        tagline: 'Taste adventures await',
        gradient: 'linear-gradient(135deg, #FF6B35, #FF9E50)',
        ideas: ['Street food crawl', 'Fine dining', 'Cooking class'],
    },
    'Romantic': {
        icon: '💕',
        emoji2: '🌹',
        tagline: 'Sparks & magic',
        gradient: 'linear-gradient(135deg, #E91E63, #FF6090)',
        ideas: ['Sunset picnic', 'River walk', 'Candlelit dinner'],
    },
    'Adventurous': {
        icon: '🏔️',
        emoji2: '🎯',
        tagline: 'Thrill seekers unite',
        gradient: 'linear-gradient(135deg, #FF7043, #FFB74D)',
        ideas: ['Go-karting', 'Rock climbing', 'Escape room'],
    },
    'Cultural': {
        icon: '🎭',
        emoji2: '🖼️',
        tagline: 'Art, history & soul',
        gradient: 'linear-gradient(135deg, #7E57C2, #B388FF)',
        ideas: ['Museum tour', 'Live theater', 'Book café'],
    },
    'Casual': {
        icon: '☕',
        emoji2: '🎮',
        tagline: 'Chill vibes only',
        gradient: 'linear-gradient(135deg, #42A5F5, #80D8FF)',
        ideas: ['Café hopping', 'Board games', 'Movie night'],
    },
    'Outdoorsy': {
        icon: '🌿',
        emoji2: '🚴',
        tagline: 'Fresh air & freedom',
        gradient: 'linear-gradient(135deg, #66BB6A, #A5D6A7)',
        ideas: ['Hiking trail', 'Cycling date', 'Garden stroll'],
    },
};

export default function CategoryCard({ name, color }) {
    const data = CATEGORY_DATA[name] || {
        icon: '💡',
        emoji2: '✨',
        tagline: 'Something special',
        gradient: `linear-gradient(135deg, ${color}, ${color}88)`,
        ideas: ['Surprise date'],
    };

    return (
        <div className="category-card-v2">
            <div className="card-banner" style={{ background: data.gradient }}>
                <span className="banner-icon">{data.icon}</span>
                <span className="banner-icon-2">{data.emoji2}</span>
            </div>
            <div className="card-body">
                <h3 className="card-title">{name}</h3>
                <p className="card-tagline">{data.tagline}</p>
                <div className="card-ideas">
                    {data.ideas.map((idea, i) => (
                        <span key={i} className="idea-chip">{idea}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

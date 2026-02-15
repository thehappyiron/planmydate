import './ItineraryView.css';

export default function ItineraryView({ itinerary, weather }) {
    if (!itinerary) return null;

    return (
        <div className="itinerary-view animate-fade-in">
            {/* Header */}
            <div className="itinerary-header">
                <h2 className="itinerary-title">{itinerary.title || 'Your Perfect Date'} 💕</h2>
                <p className="itinerary-summary">{itinerary.summary}</p>

                <div className="itinerary-meta">
                    {itinerary.vibe && (
                        <span className="meta-chip vibe-chip">✨ {itinerary.vibe}</span>
                    )}
                    {itinerary.totalEstimatedCost && (
                        <span className="meta-chip cost-chip">💰 {itinerary.totalEstimatedCost}</span>
                    )}
                    {weather && (
                        <span className="meta-chip weather-chip">
                            🌤️ {weather.temp}°C — {weather.description}
                        </span>
                    )}
                </div>
            </div>

            {/* Quick Tips Row */}
            <div className="tips-row">
                {itinerary.whatToWear && (
                    <div className="tip-card">
                        <span className="tip-icon">👗</span>
                        <div>
                            <strong>What to Wear</strong>
                            <p>{itinerary.whatToWear}</p>
                        </div>
                    </div>
                )}
                {itinerary.proTip && (
                    <div className="tip-card">
                        <span className="tip-icon">💡</span>
                        <div>
                            <strong>Pro Tip</strong>
                            <p>{itinerary.proTip}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Timeline */}
            <div className="timeline">
                {itinerary.itinerary?.map((block, blockIdx) => (
                    <div key={blockIdx} className="time-block">
                        <div className="time-block-header">
                            <div className="time-dot" />
                            <div className="time-info">
                                <h3 className="time-block-title">
                                    {getTimeEmoji(block.timeBlock)} {block.timeBlock}
                                </h3>
                                <span className="time-range">{block.timeRange}</span>
                            </div>
                        </div>

                        <div className="time-block-content">
                            {block.activities?.map((activity, actIdx) => (
                                <div key={actIdx} className="activity-card">
                                    <div className="activity-header">
                                        <span className="activity-icon">{activity.icon || '📍'}</span>
                                        <div className="activity-title-row">
                                            <h4 className="activity-title">{activity.title}</h4>
                                            <span className={`activity-tag ${activity.category || 'activity'}`}>
                                                {activity.category || 'activity'}
                                            </span>
                                        </div>
                                    </div>

                                    {activity.place && (
                                        <div className="activity-place">
                                            <span className="place-icon">📍</span>
                                            <span className="place-name">{activity.place}</span>
                                            {activity.area && (
                                                <span className="place-area"> · {activity.area}</span>
                                            )}
                                        </div>
                                    )}

                                    <p className="activity-desc">{activity.description}</p>

                                    <div className="activity-details">
                                        {activity.estimatedCost && (
                                            <span className="detail-badge cost">💰 {activity.estimatedCost}</span>
                                        )}
                                        {activity.duration && (
                                            <span className="detail-badge duration">⏱️ {activity.duration}</span>
                                        )}
                                    </div>

                                    {activity.tips && (
                                        <div className="activity-tip">
                                            <span>💡</span> {activity.tips}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Conversation Starters */}
            {itinerary.conversationStarters && itinerary.conversationStarters.length > 0 && (
                <div className="extras-section">
                    <h3>💬 Conversation Starters</h3>
                    <div className="conversation-cards">
                        {itinerary.conversationStarters.map((topic, i) => (
                            <div key={i} className="conversation-card">
                                <span className="convo-num">{i + 1}</span>
                                <p>{topic}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Backup Plan */}
            {itinerary.backupPlan && (
                <div className="backup-section">
                    <h3>🌧️ Backup Plan</h3>
                    <p>{itinerary.backupPlan}</p>
                </div>
            )}
        </div>
    );
}

function getTimeEmoji(block) {
    const map = { Morning: '🌅', Afternoon: '☀️', Evening: '🌇', Night: '🌙' };
    return map[block] || '⏰';
}

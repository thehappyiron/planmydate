import './TabNavigation.css';

export default function TabNavigation({ tabs, activeTab, onTabChange }) {
    return (
        <div className="tab-nav" role="tablist">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
                    onClick={() => onTabChange(tab.key)}
                    role="tab"
                    aria-selected={activeTab === tab.key}
                    aria-controls={`panel-${tab.key}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

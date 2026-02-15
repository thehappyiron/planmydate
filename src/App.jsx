
import './styles/globals.css';
import './App.css';
import './components/FormSection/FormSection.css';

import Hero from './components/Hero';
import WelcomeCard from './components/WelcomeCard';
import MainContainer from './layouts/MainContainer';
import TwoColumnLayout from './layouts/TwoColumnLayout';

import LocationInput from './components/FormSection/LocationInput';
import BudgetSelector from './components/FormSection/BudgetSelector';
import DateTypeSelector from './components/FormSection/DateTypeSelector';
import PersonalityInput from './components/FormSection/PersonalityInput';
import GenerateButton from './components/FormSection/GenerateButton';

import CategoryCard from './components/Categories/CategoryCard';

import ItineraryView from './components/Results/ItineraryView';

import { useFormState } from './hooks/useFormState';

const categories = [
  { name: 'Foodie', color: '#FF6B35' },
  { name: 'Romantic', color: '#E91E63' },
  { name: 'Adventurous', color: '#FF7043' },
  { name: 'Casual', color: '#42A5F5' },
  { name: 'Cultural', color: '#7E57C2' },
  { name: 'Outdoorsy', color: '#66BB6A' },
];

export default function App() {
  const {
    formState,
    setLocation,
    useCurrentLocation,
    setBudget,
    toggleDateType,
    togglePersonalityTag,
    setCustomPersonality,
    generateDates,
  } = useFormState();



  const leftColumn = (
    <>
      {/* Form Inputs */}
      <LocationInput
        value={formState.location.city}
        onChange={setLocation}
        onUseLocation={useCurrentLocation}
      />
      <BudgetSelector
        selected={formState.budget}
        onSelect={setBudget}
      />
      <DateTypeSelector
        selected={formState.dateTypes}
        onToggle={toggleDateType}
      />
      <PersonalityInput
        selectedTags={formState.personality.tags}
        onToggleTag={togglePersonalityTag}
        customText={formState.personality.custom}
        onCustomChange={setCustomPersonality}
      />
      <GenerateButton
        onClick={generateDates}
        loading={formState.loading}
      />

      {/* Categories Section */}
      <div className="categories-section">
        <h2 className="section-title">✨ Date Inspiration</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <CategoryCard key={cat.name} {...cat} />
          ))}
        </div>
      </div>
    </>
  );

  const rightColumn = (
    <>
      <h2 className="section-title">💕 Your Personalized Date Plan</h2>

      {/* Loading State */}
      {formState.loading && (
        <div className="loading-state" role="status" aria-live="polite">
          <div className="heart-pulse animate-heart-pulse">💕</div>
          <p className="loading-text">Planning your perfect date...</p>
          <p className="loading-sub">Our AI is crafting a personalized itinerary just for you</p>
        </div>
      )}

      {/* Error State */}
      {formState.error && !formState.loading && !formState.itinerary && (
        <div className="error-state" role="alert">
          <span className="error-icon">😔</span>
          <h3>Oops, something went wrong</h3>
          <p>{formState.error}</p>
          <button className="retry-btn" onClick={generateDates}>Try Again</button>
        </div>
      )}

      {/* Itinerary */}
      {formState.itinerary && !formState.loading && (
        <ItineraryView
          itinerary={formState.itinerary}
          weather={formState.weather}
        />
      )}

      {/* Empty State */}
      {!formState.itinerary && !formState.loading && !formState.error && (
        <div className="empty-state">
          <span className="empty-icon">💝</span>
          <h3>Ready to plan your perfect date?</h3>
          <p>Fill in your preferences on the left and click <strong>"Generate Date Ideas"</strong> — we'll create a fully personalized itinerary with real places, restaurants, and activities in your city!</p>
        </div>
      )}
    </>
  );

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Hero />
      <MainContainer>
        <WelcomeCard />
        <div id="main-content">
          <TwoColumnLayout left={leftColumn} right={rightColumn} />
        </div>
      </MainContainer>
    </>
  );
}

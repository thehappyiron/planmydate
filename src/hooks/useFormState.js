import { useState, useCallback } from 'react';
import { api } from '../services/api.js';

const initialState = {
  location: { city: '', lat: null, lng: null },
  budget: 'moderate',
  dateTypes: [],
  personality: {
    tags: [],
    custom: '',
  },
  itinerary: null,
  weather: null,
  loading: false,
  error: null,
};

export function useFormState() {
  const [formState, setFormState] = useState(initialState);

  const setLocation = useCallback((city) => {
    setFormState((prev) => ({
      ...prev,
      location: { ...prev.location, city },
    }));
  }, []);

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormState((prev) => ({
          ...prev,
          location: {
            city: 'Current Location',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        }));
      },
      () => {
        setFormState((prev) => ({
          ...prev,
          error: 'Unable to get your location',
        }));
      }
    );
  }, []);

  const setBudget = useCallback((budget) => {
    setFormState((prev) => ({ ...prev, budget }));
  }, []);

  const toggleDateType = useCallback((type) => {
    setFormState((prev) => {
      const types = prev.dateTypes.includes(type)
        ? prev.dateTypes.filter((t) => t !== type)
        : [...prev.dateTypes, type];
      return { ...prev, dateTypes: types };
    });
  }, []);

  const togglePersonalityTag = useCallback((tag) => {
    setFormState((prev) => {
      const tags = prev.personality.tags.includes(tag)
        ? prev.personality.tags.filter((t) => t !== tag)
        : [...prev.personality.tags, tag];
      return { ...prev, personality: { ...prev.personality, tags } };
    });
  }, []);

  const setCustomPersonality = useCallback((custom) => {
    setFormState((prev) => ({
      ...prev,
      personality: { ...prev.personality, custom },
    }));
  }, []);

  const generateDates = useCallback(async () => {
    setFormState((prev) => ({ ...prev, loading: true, error: null, itinerary: null }));

    try {
      // Step 1: Geocode if needed
      let location = { ...formState.location };
      if (location.city && !location.lat) {
        try {
          const geo = await api.geocode(location.city);
          location = { city: geo.city || location.city, lat: geo.lat, lng: geo.lng };
        } catch {
          // Continue without coords
        }
      }

      // Step 2: Call backend for full itinerary
      const data = await api.generateDates({
        location,
        budget: formState.budget,
        dateTypes: formState.dateTypes,
        personality: formState.personality,
      });

      setFormState((prev) => ({
        ...prev,
        location,
        itinerary: data.itinerary || null,
        weather: data.weather || null,
        loading: false,
        error: null,
      }));
    } catch (err) {
      console.warn('API call failed:', err.message);
      setFormState((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Something went wrong. Please try again.',
        itinerary: null,
      }));
    }
  }, [formState.location, formState.budget, formState.dateTypes, formState.personality]);

  const resetForm = useCallback(() => {
    setFormState(initialState);
  }, []);

  return {
    formState,
    setLocation,
    useCurrentLocation,
    setBudget,
    toggleDateType,
    togglePersonalityTag,
    setCustomPersonality,
    generateDates,
    resetForm,
  };
}

const API_BASE = '/api';

class ApiClient {
    constructor() {
        this.token = localStorage.getItem('planmydate_token') || null;
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('planmydate_token', token);
        } else {
            localStorage.removeItem('planmydate_token');
        }
    }

    getToken() {
        return this.token;
    }

    isAuthenticated() {
        return !!this.token;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(this.token && { Authorization: `Bearer ${this.token}` }),
            ...options.headers,
        };

        const res = await fetch(url, {
            ...options,
            headers,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || `Request failed (${res.status})`);
        }

        return data;
    }

    // ── Auth ────────────────────────────────
    register(name, email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
    }

    login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    getMe() {
        return this.request('/auth/me');
    }

    // ── Dates ───────────────────────────────
    generateDates(preferences) {
        return this.request('/dates/generate', {
            method: 'POST',
            body: JSON.stringify(preferences),
        });
    }

    getDateHistory(page = 1, limit = 10) {
        return this.request(`/dates/history?page=${page}&limit=${limit}`);
    }

    getDatePlan(id) {
        return this.request(`/dates/${id}`);
    }

    // ── Saved ───────────────────────────────
    saveDate(datePlanId, dateItem) {
        return this.request('/saved', {
            method: 'POST',
            body: JSON.stringify({ datePlanId, dateItem }),
        });
    }

    getSavedDates() {
        return this.request('/saved');
    }

    updateSavedDate(id, updates) {
        return this.request(`/saved/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
    }

    deleteSavedDate(id) {
        return this.request(`/saved/${id}`, { method: 'DELETE' });
    }

    // ── Location ────────────────────────────
    geocode(query) {
        return this.request(`/location/geocode?q=${encodeURIComponent(query)}`);
    }

    getWeather(lat, lng) {
        return this.request(`/location/weather?lat=${lat}&lng=${lng}`);
    }
}

export const api = new ApiClient();

import axios from 'axios';

/**
 * Get current weather for a location.
 * Returns simplified weather object or null if unavailable.
 */
export async function getWeather(lat, lng) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) return null;

    try {
        const { data } = await axios.get(
            'https://api.openweathermap.org/data/2.5/weather',
            {
                params: {
                    lat,
                    lon: lng,
                    units: 'metric',
                    appid: apiKey,
                },
                timeout: 5000,
            }
        );

        return {
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather?.[0]?.description || '',
            icon: data.weather?.[0]?.icon || '',
            humidity: data.main.humidity,
            windSpeed: data.wind?.speed || 0,
            isGoodForOutdoor: !['Rain', 'Thunderstorm', 'Snow', 'Drizzle'].includes(
                data.weather?.[0]?.main
            ),
        };
    } catch (err) {
        console.warn('⚠️ Weather API error:', err.message);
        return null;
    }
}

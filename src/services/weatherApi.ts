import axios from 'axios';
import { GeocodingResponse, WeatherApiResponse, WeatherData } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
const GEOCODE_URL = import.meta.env.VITE_GEOCODE_API_URL;
const WEATHER_URL = import.meta.env.VITE_WEATHER_API_URL;

if (!API_KEY) {
  console.error('VITE_OPEN_WEATHER_API_KEY is not set in .env file!');
  throw new Error('VITE_OPEN_WEATHER_API_KEY is not configured.');
}
if (!GEOCODE_URL) {
  console.error('VITE_GEOCODE_API_URL is not set in .env file!');
  throw new Error('VITE_GEOCODE_API_URL is not configured.');
}
if (!WEATHER_URL) {
  console.error('VITE_WEATHER_API_URL is not set in .env file!');
  throw new Error('VITE_WEATHER_API_URL is not configured.');
}

async function fetchCityCoordinates(
  city: string,
): Promise<{ lat: number; lon: number; name: string }> {
  const inputCityTrimmed = city.trim();
  if (!inputCityTrimmed) {
    throw new Error('City name cannot be empty.');
  }

  try {
    const { data: geocodingData } = await axios.get<GeocodingResponse[]>(GEOCODE_URL, {
      params: { q: inputCityTrimmed, limit: 1, appid: API_KEY },
      timeout: 5000,
    });

    if (!geocodingData || geocodingData.length === 0) {
      console.log(`Geocoding API returned no results for "${inputCityTrimmed}"`);
      throw new Error(`City not found: ${inputCityTrimmed}`);
    }

    const { lat, lon, name: foundName } = geocodingData[0];
    if (!foundName.toLowerCase().includes(inputCityTrimmed.toLowerCase())) {
      console.warn(
        `Geocoding mismatch: Input "${inputCityTrimmed}" resulted in "${foundName}". Treating as not found.`,
      );
      throw new Error(`City not found: ${inputCityTrimmed}`);
    }

    console.log(
      `Coordinates validated for "${inputCityTrimmed}" as "${foundName}": lat=${lat}, lon=${lon}`,
    );
    return { lat, lon, name: foundName };
  } catch (error: any) {
    if (
      error.message.startsWith('City not found:') ||
      error.message.startsWith('City name cannot be empty')
    ) {
      throw error;
    }

    console.error('Geocoding API error:', error.response?.data || error.message);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Unauthorized: Invalid API Key for Geocoding.');
    }
    throw new Error(`Failed to get coordinates for ${inputCityTrimmed}. ${error.message}`);
  }
}

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  const { lat, lon, name: geocodedName } = await fetchCityCoordinates(city);

  try {
    const { data: weatherApiData } = await axios.get<WeatherApiResponse>(WEATHER_URL, {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: API_KEY,
      },
      timeout: 5000,
    });

    if (
      !weatherApiData ||
      !weatherApiData.main ||
      !weatherApiData.weather ||
      weatherApiData.weather.length === 0
    ) {
      throw new Error('Incomplete weather data received from API.');
    }
    const weatherResult: WeatherData = {
      cityName: weatherApiData.name || geocodedName,
      temperature: weatherApiData.main.temp,
      description: weatherApiData.weather[0].description,
      icon: weatherApiData.weather[0].icon,
      dt: weatherApiData.dt,
    };
    console.log('Weather data received:', weatherResult);
    return weatherResult;
  } catch (error: any) {
    if (error.message.includes('City not found:')) {
      throw error;
    }
    console.error('Weather API error:', error.response?.data || error.message);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Unauthorized: Invalid API Key for Weather.');
    }
    throw new Error(`Failed to fetch weather for ${city}. ${error.message}`);
  }
}

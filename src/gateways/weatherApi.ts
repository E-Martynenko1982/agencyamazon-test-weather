import axios from 'axios';
import { GeocodingResponse, WeatherApiResponse, WeatherData } from '../types/weather';
import { getValidCachedWeatherData, setCachedWeatherData } from '../utils/weatherCache';

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

const API_TIMEOUT = 5000;

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
      timeout: API_TIMEOUT,
    });

    if (!geocodingData || geocodingData.length === 0) {
      console.log(`Geocoding API returned no results for "${inputCityTrimmed}"`);
      throw new Error(`City not found: ${inputCityTrimmed}`);
    }

    const { lat, lon, name: foundName } = geocodingData[0];

    if (!foundName.toLowerCase().startsWith(inputCityTrimmed.toLowerCase())) {
      if (
        inputCityTrimmed.length <= 1 ||
        !foundName.toLowerCase().includes(inputCityTrimmed.toLowerCase())
      ) {
        console.warn(
          `Geocoding mismatch: Input "${inputCityTrimmed}" resulted in "${foundName}". Treating as not found.`,
        );
        throw new Error(`City not found: ${inputCityTrimmed}`);
      } else {
        console.log(
          `Geocoding slight difference: Input "${inputCityTrimmed}" resulted in "${foundName}". Proceeding.`,
        );
      }
    }
    return { lat, lon, name: foundName };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Geocoding API error:', error.response.status, error.response.data);
        if (error.response.status === 401) {
          throw new Error('Unauthorized: Invalid API Key for Geocoding.');
        } else if (error.response.status === 404 || error.message.startsWith('City not found:')) {
          throw new Error(`City not found: ${inputCityTrimmed}`);
        } else {
          throw new Error(`Geocoding API request failed with status ${error.response.status}`);
        }
      } else if (error.request) {
        console.error('Geocoding API no response:', error.message);
        throw new Error(`Failed to connect to Geocoding service for ${inputCityTrimmed}.`);
      }
    }

    if (
      error.message.startsWith('City not found:') ||
      error.message.startsWith('City name cannot be empty')
    ) {
      throw error;
    }

    console.error('Geocoding unexpected error:', error.message);
    throw new Error(`Failed to get coordinates for ${inputCityTrimmed}. ${error.message}`);
  }
}

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  const cityKey = city.trim();
  if (!cityKey) {
    throw new Error('City name cannot be empty.');
  }

  const cachedResult = getValidCachedWeatherData(cityKey);
  if (cachedResult) {
    console.log(`Using cached weather data for "${cityKey}"`);
    return cachedResult.data;
  }

  try {
    const { lat, lon, name: geocodedName } = await fetchCityCoordinates(cityKey);
    const { data: weatherApiData } = await axios.get<WeatherApiResponse>(WEATHER_URL, {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: API_KEY,
      },
      timeout: API_TIMEOUT,
    });
    if (
      !weatherApiData ||
      !weatherApiData.main ||
      !weatherApiData.weather ||
      weatherApiData.weather.length === 0
    ) {
      console.error('Incomplete weather data received:', weatherApiData);
      throw new Error('Incomplete weather data received from API.');
    }
    const finalCityName = weatherApiData.name || geocodedName;
    const weatherResult: WeatherData = {
      cityName: finalCityName,
      temperature: Math.round(weatherApiData.main.temp),
      description: weatherApiData.weather[0].description,
      icon: weatherApiData.weather[0].icon,
      dt: weatherApiData.dt,
    };
    setCachedWeatherData(cityKey, weatherResult);
    return weatherResult;
  } catch (error: any) {
    console.error(`Failed to fetch weather data for "${cityKey}":`, error.message);
    if (error.message.startsWith('City not found:')) {
      throw error;
    }
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Weather API error:', error.response.status, error.response.data);
        if (error.response.status === 401) {
          throw new Error('Unauthorized: Invalid API Key for Weather.');
        } else {
          throw new Error(`Weather API request failed with status ${error.response.status}`);
        }
      } else if (error.request) {
        console.error('Weather API no response:', error.message);
        throw new Error(`Failed to connect to Weather service for ${cityKey}.`);
      }
    }
    throw new Error(`Failed to fetch weather for ${cityKey}. ${error.message}`);
  }
}

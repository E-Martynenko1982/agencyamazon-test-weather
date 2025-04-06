import { useState, useCallback } from 'react';
import { fetchWeatherByCity } from '../services/weatherApi';
import { WeatherData } from '../types/weather';
import {
  getCachedWeatherData,
  setCachedWeatherData,
  isCacheValid,
  removeCachedWeather,
} from '../utils/weatherCache';

interface UseWeatherResult {
  weather: WeatherData | null;
  error: string;
  isLoading: boolean;
  fetchWeather: (city: string) => Promise<void>;
}

export const useWeather = (): UseWeatherResult => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchWeather = useCallback(async (city: string): Promise<void> => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError('Please enter a city name.');
      setIsLoading(false);
      setWeather(null);
      return;
    }

    setIsLoading(true);
    setError('');
    setWeather(null);

    const cachedData = getCachedWeatherData(trimmedCity);
    if (isCacheValid(cachedData)) {
      setWeather(cachedData!.data);
      setIsLoading(false);
      console.log(`Data for ${trimmedCity} loaded from cache.`);
      return;
    } else if (cachedData) {
      removeCachedWeather(trimmedCity);
      console.log(`Expired cache removed for ${trimmedCity}.`);
    }

    console.log(`Fetching data from API for ${trimmedCity}...`);
    try {
      const result = await fetchWeatherByCity(trimmedCity);
      setWeather(result);
      console.log(result);
      setCachedWeatherData(trimmedCity, result);
      console.log(`Data for ${trimmedCity} fetched from API and cached.`);
    } catch (err: any) {
      console.error('API Error in useWeather:', err);
      let errorMessage = 'Error fetching weather data. Please try again later.';
      if (err.message) {
        if (err.message.toLowerCase().includes('city not found')) {
          errorMessage = `City "${trimmedCity}" not found. Please check spelling.`;
        } else if (err.message.toLowerCase().includes('unauthorized')) {
          errorMessage = 'Invalid API key configured. Please contact support.';
        } else if (err.message.toLowerCase().includes('failed to fetch')) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { weather, error, isLoading, fetchWeather };
};

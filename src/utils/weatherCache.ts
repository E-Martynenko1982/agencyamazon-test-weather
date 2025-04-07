import { WeatherData, CachedWeather } from '../types/weather';

const CACHE_PREFIX = 'weather_';
const DEFAULT_CACHE_DURATION_MS = 5 * 60 * 1000;

const generateCacheKey = (city: string): string => {
  return `${CACHE_PREFIX}${city.trim().toLowerCase()}`;
};

export const getValidCachedWeatherData = (
  city: string,
  durationMs: number = DEFAULT_CACHE_DURATION_MS,
): CachedWeather | null => {
  const cacheKey = generateCacheKey(city);
  const cachedStr = localStorage.getItem(cacheKey);

  if (!cachedStr) {
    return null;
  }
  try {
    const cached: CachedWeather = JSON.parse(cachedStr);
    if (!cached || !cached.data || typeof cached.timestamp !== 'number') {
      localStorage.removeItem(cacheKey);
      return null;
    }
    const now = Date.now();
    if (now - cached.timestamp >= durationMs) {
      return null;
    }
    return cached;
  } catch (parseError) {
    console.error('Помилка розбору кешу, видалення:', cacheKey, parseError);
    localStorage.removeItem(cacheKey);
    return null;
  }
};

export const setCachedWeatherData = (city: string, data: WeatherData): void => {
  const cacheKey = generateCacheKey(city);
  const payload: CachedWeather = {
    data: data,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(cacheKey, JSON.stringify(payload));
  } catch (error) {
    console.error('Помилка збереження кешу:', cacheKey, error);
  }
};

export const removeCachedWeather = (city: string): void => {
  const cacheKey = generateCacheKey(city);
  localStorage.removeItem(cacheKey);
};

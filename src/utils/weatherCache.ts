import { WeatherData, CachedWeather } from '../types/weather';

const CACHE_PREFIX = 'weather_';
const DEFAULT_CACHE_DURATION_MS = 5 * 60 * 1000;

const generateCacheKey = (city: string): string => {
  return `${CACHE_PREFIX}${city.trim().toLowerCase()}`;
};

export const getCachedWeatherData = (city: string): CachedWeather | null => {
  const cacheKey = generateCacheKey(city);
  const cachedStr = localStorage.getItem(cacheKey);

  if (!cachedStr) {
    return null;
  }

  try {
    const cached: CachedWeather = JSON.parse(cachedStr);

    if (cached && cached.data && typeof cached.timestamp === 'number') {
      return cached;
    } else {
      console.warn('Invalid cache structure found, removing:', cacheKey);
      localStorage.removeItem(cacheKey);
      return null;
    }
  } catch (parseError) {
    console.error('Error parsing cache, removing:', cacheKey, parseError);
    localStorage.removeItem(cacheKey);
    return null;
  }
};

export const isCacheValid = (
  cachedItem: CachedWeather | null,
  durationMs: number = DEFAULT_CACHE_DURATION_MS,
): boolean => {
  if (!cachedItem) {
    return false;
  }
  const now = Date.now();
  return now - cachedItem.timestamp < durationMs;
};

export const setCachedWeatherData = (city: string, data: WeatherData): void => {
  const cacheKey = generateCacheKey(city);
  const payload: CachedWeather = {
    data: data,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(cacheKey, JSON.stringify(payload));
    console.log(`Weather data for ${city} cached.`);
  } catch (error) {
    console.error('Error setting cache:', cacheKey, error);
  }
};

export const removeCachedWeather = (city: string): void => {
  const cacheKey = generateCacheKey(city);
  localStorage.removeItem(cacheKey);
  console.log(`Cache removed for ${city}.`);
};

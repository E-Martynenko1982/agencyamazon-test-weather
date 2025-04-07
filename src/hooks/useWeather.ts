import { useState, useCallback } from 'react';
import { fetchWeatherByCity } from '../gateways/weatherApi';
import { WeatherData } from '../types/weather';

type UseWeatherResult = {
  weather: WeatherData | null;
  error: string;
  isLoading: boolean;
  fetchWeather: (city: string) => Promise<void>;
};

export const useWeather = (): UseWeatherResult => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchWeather = useCallback(async (city: string): Promise<void> => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError('Будь ласка, введіть назву міста.');
      setIsLoading(false);
      setWeather(null);
      return;
    }

    setIsLoading(true);
    setError('');
    setWeather(null);

    try {
      const result = await fetchWeatherByCity(trimmedCity);
      setWeather(result);
    } catch (err: any) {
      console.error('Error in useWeather hook:', err);
      let errorMessage = 'Помилка отримання даних про погоду. Спробуйте пізніше.';
      if (err && err.message) {
        if (err.message.toLowerCase().includes('city not found')) {
          errorMessage = `Місто "${trimmedCity}" не знайдено. Перевірте назву.`;
        } else if (err.message.toLowerCase().includes('unauthorized')) {
          errorMessage = 'Недійсний ключ API. Зверніться до адміністратора.';
        } else if (
          err.message.toLowerCase().includes('failed to connect') ||
          err.message.toLowerCase().includes('network error')
        ) {
          errorMessage =
            "Помилка мережі або не вдалося підключитися до сервісу. Перевірте з'єднання.";
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

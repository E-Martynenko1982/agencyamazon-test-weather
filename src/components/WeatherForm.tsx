import React, { useState } from "react";
import { fetchWeatherByCity } from "../services/weatherApi";
import {
  Box,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Typography,
  CardMedia,
} from "@mui/material";

// Тип, який будемо зберігати у стані weather
interface WeatherData {
  cityName: string;
  temperature: number;
  description: string;
  icon: string;
  dt: number;
}

// Тип для кешу
interface CachedWeather {
  data: WeatherData;
  timestamp: number;
}

const WeatherForm: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");

  // Функція запиту погоди
  const handleFetchWeather = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    setError("");

    // Перевірка кеша (дані дійсні 5 хвилин)
    const cacheKey = `weather_${trimmedCity.toLowerCase()}`;
    const cachedStr = localStorage.getItem(cacheKey);
    if (cachedStr) {
      const cached: CachedWeather = JSON.parse(cachedStr);
      const now = Date.now();
      if (now - cached.timestamp < 300000) {
        // Якщо кеш свіжіший за 5 хвилин
        setWeather(cached.data);
        return;
      }
    }

    // Якщо кеш неактуальний, робимо запит до API
    try {
      const result = await fetchWeatherByCity(trimmedCity);
      setWeather(result);

      // Зберігаємо у localStorage
      const payload: CachedWeather = {
        data: result,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(payload));
    } catch (err: any) {
      setError(err.message || "Error fetching weather data");
      setWeather(null);
    }
  };

  // Форматування часу з секунд у локальний рядок
  const formatTime = (dt: number) => {
    const date = new Date(dt * 1000);
    return date.toLocaleTimeString();
  };

  return (
    <Box
      sx={{
        width: 400,
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        label="City"
        variant="outlined"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        data-testid="city-input"
      />
      <Button variant="contained" onClick={handleFetchWeather}>
        Get Weather
      </Button>

      {error && (
        <Alert severity="error" data-testid="error-message">
          {error}
        </Alert>
      )}

      {weather && !error && (
        <Card data-testid="weather-data">
          <CardContent>
            <Typography variant="h5">{weather.cityName}</Typography>
            <Typography variant="body1">
              Temperature: {Math.round(weather.temperature)} °C
            </Typography>
            <Typography variant="body1">
              Description: {weather.description}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Last updated: {formatTime(weather.dt)}
            </Typography>
          </CardContent>

          {/* Якщо є іконка, показуємо */}
          {weather.icon && (
            <CardMedia
              component="img"
              sx={{ width: 80, margin: "0 auto 16px auto" }}
              image={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="weather icon"
            />
          )}
        </Card>
      )}
    </Box>
  );
};

export default WeatherForm;

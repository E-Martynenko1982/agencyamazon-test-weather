import React, { useState, useCallback } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import {
  weatherFormContainerStyles,
  weatherCardStyles,
  weatherIconStyles
} from "./WeatherForm.styles";
import { formatTime } from "../../utils/formatters";
import { useWeather } from "../../hooks/useWeather";

const WeatherForm: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const { weather, error, isLoading, fetchWeather } = useWeather();
  const handleSearch = useCallback(() => {
    fetchWeather(city);
  }, [city, fetchWeather]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <Box sx={weatherFormContainerStyles}>
      <TextField
        label="Enter city name"
        variant="outlined"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
        data-testid="city-input"
        fullWidth
        disabled={isLoading}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        fullWidth
        disabled={isLoading}
        sx={{ position: 'relative' }}
      >
        {isLoading ? (
          <CircularProgress size={24} sx={{ color: 'white', position: 'absolute' }} />
        ) : (
          'Get Weather'
        )}
      </Button>
      {error && !isLoading && (
        <Alert severity="error" data-testid="error-message">
          {error}
        </Alert>
      )}
      {weather && !error && !isLoading && (
        <Card data-testid="weather-data" sx={weatherCardStyles}>
          <CardContent sx={{ paddingBottom: 0 }}>
            <Typography variant="h5" gutterBottom>
              {weather.cityName}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {Math.round(weather.temperature)}°C
            </Typography>
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
              {weather.description}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
              (as of {formatTime(weather.dt)})
            </Typography>
          </CardContent>
          {weather.icon && (
            <CardMedia
              component="img"
              sx={weatherIconStyles}
              image={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
            />
          )}
        </Card>
      )}
    </Box>
  );
};

export default WeatherForm;
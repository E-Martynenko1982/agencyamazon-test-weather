import React, { useState, useCallback } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography
} from "@mui/material";
import { weatherFormContainerStyles } from "./WeatherForm.styles";
import { useWeather } from "../../hooks/useWeather";
import WeatherCard from "../WeatherCard";

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
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Weather App
      </Typography>
      <TextField
        label="Введіть назву міста"
        variant="outlined"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
        data-testid="city-input"
        fullWidth
        disabled={isLoading}
        placeholder="Наприклад, London"
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        fullWidth
        disabled={isLoading || !city.trim()}
        sx={{ position: 'relative', minHeight: 48 }}
      >
        {isLoading ? (
          <CircularProgress size={24} sx={{ color: 'white', position: 'absolute' }} />
        ) : (
          'Дізнатись погоду'
        )}
      </Button>


      {error && !isLoading && (
        <Alert severity="error" data-testid="error-message">
          {error}
        </Alert>
      )}

      {weather && !error && !isLoading && (
        <WeatherCard weather={weather} />
      )}

      {isLoading && !weather && !error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default WeatherForm;
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardMedia,

} from '@mui/material';
import { WeatherData } from '../../types/weather';
import { formatTime } from '../../utils/formatters';
import { weatherCardStyles, weatherIconStyles } from './WeatherCard.styles.ts';

type WeatherCardProps = {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const iconUrl = weather.icon ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png` : '';

  return (
    <Card data-testid="weather-data" sx={weatherCardStyles}>
      {/* Content Section */}
      <CardContent sx={{ paddingBottom: '0 !important', flexGrow: 1 }}>
        <Typography variant="h5" component="div" gutterBottom>
          {weather.cityName}
        </Typography>
        <Typography variant="h4" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
          {Math.round(weather.temperature)}°C
        </Typography>
        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
          {weather.description}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
          (станом на {formatTime(weather.dt)})
        </Typography>
      </CardContent>
      {iconUrl && (
        <CardMedia
          component="img"
          sx={weatherIconStyles}
          image={iconUrl}
          alt={weather.description}
          title={weather.description}
        />
      )}
    </Card>
  );
};

export default WeatherCard;
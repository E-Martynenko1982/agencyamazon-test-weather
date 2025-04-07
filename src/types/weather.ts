export type WeatherData = {
  cityName: string;
  temperature: number;
  description: string;
  icon: string;
  dt: number;
};

export type CachedWeather = {
  data: WeatherData;
  timestamp: number;
};

export type GeocodingResponse = {
  lat: number;
  lon: number;
  name: string;
  local_names?: { [key: string]: string };
  country?: string;
  state?: string;
};

export type WeatherApiResponse = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility?: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds?: {
    all: number;
  };
  rain?: {
    '1h'?: number;
  };
  snow?: {
    '1h'?: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country?: string;
    sunrise?: number;
    sunset?: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

import axios from "axios";

// Ключ API з файлу .env (наприклад, .env.local), мусить починатися з "VITE_"
const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

interface GeocodingResponse {
	lat: number;
	lon: number;
	name: string;
}

interface WeatherResponse {
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
		"1h"?: number;
	};
	snow?: {
		"1h"?: number;
	};
	dt: number; // час оновлення даних (Unix, UTC)
	sys: {
		type?: number;
		id?: number;
		country?: string;
		sunrise?: number;
		sunset?: number;
	};
	timezone: number; // зсув у секундах від UTC
	id: number;
	name: string; // назва міста
	cod: number;
}

// Ця функція виконує геокодування: перетворює назву міста на lat, lon
async function fetchCityCoordinates(
	city: string
): Promise<{ lat: number; lon: number; name: string }> {
	const geocodeUrl = "https://api.openweathermap.org/geo/1.0/direct";
	const resp = await axios.get<GeocodingResponse[]>(geocodeUrl, {
		params: {
			q: city,
			limit: 1,
			appid: API_KEY,
		},
	});

	if (!resp.data || resp.data.length === 0) {
		throw new Error("City not found");
	}

	const { lat, lon, name } = resp.data[0];
	return { lat, lon, name };
}

/**
 * Основна функція: за назвою міста визначаємо координати,
 * а потім отримуємо погоду з endpoint /data/2.5/weather
 */
export async function fetchWeatherByCity(city: string): Promise<{
	cityName: string;
	temperature: number;
	description: string;
	icon: string;
	dt: number;
}> {
	// 1. Спочатку отримуємо координати
	const { lat, lon } = await fetchCityCoordinates(city);

	// 2. Потім отримуємо погоду через /data/2.5/weather
	const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
	const response = await axios.get<WeatherResponse>(weatherUrl, {
		params: {
			lat,
			lon,
			units: "metric", // щоб отримати температуру в °C
			appid: API_KEY,
		},
	});

	const data = response.data;
	// Витягуємо основну інформацію
	return {
		cityName: data.name, // з поля "name"
		temperature: data.main.temp, // з поля "main.temp"
		description: data.weather[0].description,
		icon: data.weather[0].icon, // "weather[0].icon" -> код іконки
		dt: data.dt, // час оновлення
	};
}

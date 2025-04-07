import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import WeatherForm from '.';
import { formatTime } from '../../utils/formatters';
import { WeatherData } from '../../types/weather';

let mockWeatherData: WeatherData | null = null;
let mockError: string | null = null;
let mockIsLoading: boolean = false;
const mockFetchWeather = jest.fn();

jest.mock('../../hooks/useWeather', () => ({
  useWeather: () => ({
    weather: mockWeatherData,
    error: mockError,
    isLoading: mockIsLoading,
    fetchWeather: mockFetchWeather,
  }),
}));


const exampleWeatherData: WeatherData = {
  cityName: 'Test City',
  temperature: 25.3,
  description: 'Clear Sky',
  icon: '01d',
  dt: Math.floor(Date.now() / 1000),
};

describe('WeatherForm Component', () => {

  beforeEach(() => {
    mockWeatherData = null;
    mockError = null;
    mockIsLoading = false;
    mockFetchWeather.mockClear();
  });

  test('renders input field and button', () => {
    render(<WeatherForm />);
    expect(screen.getByRole('textbox', { name: /enter city name/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get weather/i })).toBeInTheDocument();
  });


  test('calls fetchWeather with the entered city when button is clicked', async () => {

    const user = userEvent.setup();
    render(<WeatherForm />);
    const input = screen.getByRole('textbox', { name: /enter city name/i });
    const button = screen.getByRole('button', { name: /get weather/i });
    const testCity = 'London';


    await user.type(input, testCity);
    await user.click(button);

    expect(mockFetchWeather).toHaveBeenCalledTimes(1);
    expect(mockFetchWeather).toHaveBeenCalledWith(testCity);
  });

  test('calls fetchWeather when Enter key is pressed in input', async () => {
    const user = userEvent.setup();
    render(<WeatherForm />);
    const input = screen.getByRole('textbox', { name: /enter city name/i });
    const testCity = 'Paris';

    await user.type(input, `${testCity}{enter}`);

    expect(mockFetchWeather).toHaveBeenCalledTimes(1);
    expect(mockFetchWeather).toHaveBeenCalledWith(testCity);
  });


  test('displays loading indicator when isLoading is true', () => {
    mockIsLoading = true;
    render(<WeatherForm />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('textbox', { name: /enter city name/i })).toBeDisabled();
  });

  test('displays an error message when an invalid city is entered (error state)', () => {
    const errorMessage = 'City not found or API error';
    mockError = errorMessage;
    render(<WeatherForm />);

    const errorAlert = screen.getByTestId('error-message');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(errorMessage);
    expect(screen.queryByTestId('weather-data')).not.toBeInTheDocument();
  });

  test('displays weather data correctly when valid data is received', () => {
    mockWeatherData = exampleWeatherData;
    render(<WeatherForm />);

    const weatherCard = screen.getByTestId('weather-data');
    expect(weatherCard).toBeInTheDocument();

    expect(screen.getByText(exampleWeatherData.cityName)).toBeInTheDocument();
    expect(screen.getByText(`${Math.round(exampleWeatherData.temperature)}°C`)).toBeInTheDocument();
    expect(screen.getByText(exampleWeatherData.description)).toBeInTheDocument();
    expect(screen.getByText(`(as of ${formatTime(exampleWeatherData.dt)})`)).toBeInTheDocument();

    const weatherIcon = screen.getByRole('img');
    expect(weatherIcon).toHaveAttribute('alt', exampleWeatherData.description);
    expect(weatherIcon).toHaveAttribute('src', `https://openweathermap.org/img/wn/${exampleWeatherData.icon}@2x.png`);

    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });
});
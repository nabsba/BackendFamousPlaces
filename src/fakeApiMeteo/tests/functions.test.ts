import { describe, expect, test } from '@jest/globals';

function getFakeWeather(city: string) {
  const randomFloat = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(1);
  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
  const randomDescription = () => {
    const descriptions = [
      'clear sky',
      'partly cloudy',
      'overcast',
      'light rain',
      'heavy rain',
      'thunderstorm',
      'snow',
      'foggy',
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const formatTime = (hours: number, minutes: number) =>
    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;

  const sunriseHours = randomInt(5, 8); // Sunrise between 5 AM and 8 AM
  const sunsetHours = randomInt(5, 9) + 12; // Sunset between 5 PM and 9 PM

  return {
    city: city,
    temperature: parseFloat(randomFloat(-10, 40)), // Temperature in Celsius
    description: randomDescription(),
    humidity: randomInt(20, 100), // Humidity percentage
    windSpeed: parseFloat(randomFloat(0, 20)), // Wind speed in km/h
    sunrise: formatTime(sunriseHours, randomInt(0, 59)),
    sunset: formatTime(sunsetHours, randomInt(0, 59)),
  };
}

describe('getFakeWeather', () => {
  test('should return a weather object with correct structure', () => {
    const city = 'Paris';
    const weather = getFakeWeather(city);

    expect(weather).toHaveProperty('city', city);
    expect(weather).toHaveProperty('temperature');
    expect(weather).toHaveProperty('description');
    expect(weather).toHaveProperty('humidity');
    expect(weather).toHaveProperty('windSpeed');
    expect(weather).toHaveProperty('sunrise');
    expect(weather).toHaveProperty('sunset');
  });

  test('temperature should be a number within range -10 to 40', () => {
    const weather = getFakeWeather('London');
    expect(weather.temperature).toBeGreaterThanOrEqual(-10);
    expect(weather.temperature).toBeLessThanOrEqual(40);
  });

  test('humidity should be an integer between 20 and 100', () => {
    const weather = getFakeWeather('New York');
    expect(weather.humidity).toBeGreaterThanOrEqual(20);
    expect(weather.humidity).toBeLessThanOrEqual(100);
    expect(Number.isInteger(weather.humidity)).toBe(true);
  });

  test('description should be one of the predefined options', () => {
    const descriptions = [
      'clear sky',
      'partly cloudy',
      'overcast',
      'light rain',
      'heavy rain',
      'thunderstorm',
      'snow',
      'foggy',
    ];
    const weather = getFakeWeather('Tokyo');
    expect(descriptions).toContain(weather.description);
  });

  test('windSpeed should be a number within range 0 to 20', () => {
    const weather = getFakeWeather('Berlin');
    expect(weather.windSpeed).toBeGreaterThanOrEqual(0);
    expect(weather.windSpeed).toBeLessThanOrEqual(20);
  });

  test('sunrise and sunset should be valid time strings', () => {
    const weather = getFakeWeather('Sydney');
    const timeRegex = /^[0-9]{2}:[0-9]{2} (AM|PM)$/;
    expect(weather.sunrise).toMatch(timeRegex);
    expect(weather.sunset).toMatch(timeRegex);
  });
});

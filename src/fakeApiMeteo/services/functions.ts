import { WeatherBody } from '../../famousPlace/type';

function getFakeWeather(data: WeatherBody) {
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
    city: data.city,
    temperature: parseFloat(randomFloat(-10, 40)), // Temperature in Celsius
    description: randomDescription(),
    humidity: randomInt(20, 100), // Humidity percentage
    windSpeed: parseFloat(randomFloat(0, 20)), // Wind speed in km/h
    sunrise: formatTime(sunriseHours, randomInt(0, 59)),
    sunset: formatTime(sunsetHours, randomInt(0, 59)),
  };
}

export { getFakeWeather };

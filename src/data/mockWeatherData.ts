export const currentWeather = {
  city: 'San Francisco',
  country: 'USA',
  temperature: 18,
  condition: 'Partly Cloudy',
  feelsLike: 16,
  humidity: 72,
  windSpeed: 15,
  date: 'Thursday, December 26',
};

export const hourlyForecast = [
  { time: 'Now', temperature: 18, condition: 'cloudy' as const },
  { time: '1PM', temperature: 19, condition: 'cloudy' as const },
  { time: '2PM', temperature: 20, condition: 'sunny' as const },
  { time: '3PM', temperature: 21, condition: 'sunny' as const },
  { time: '4PM', temperature: 20, condition: 'sunny' as const },
  { time: '5PM', temperature: 19, condition: 'cloudy' as const },
  { time: '6PM', temperature: 17, condition: 'cloudy' as const },
  { time: '7PM', temperature: 16, condition: 'cloudy' as const },
  { time: '8PM', temperature: 15, condition: 'rainy' as const },
  { time: '9PM', temperature: 14, condition: 'rainy' as const },
];

export const weeklyForecast = [
  { day: 'Today', date: 'Dec 26', condition: 'cloudy' as const, minTemp: 12, maxTemp: 21 },
  { day: 'Friday', date: 'Dec 27', condition: 'sunny' as const, minTemp: 14, maxTemp: 23 },
  { day: 'Saturday', date: 'Dec 28', condition: 'sunny' as const, minTemp: 15, maxTemp: 25 },
  { day: 'Sunday', date: 'Dec 29', condition: 'rainy' as const, minTemp: 11, maxTemp: 18 },
  { day: 'Monday', date: 'Dec 30', condition: 'stormy' as const, minTemp: 9, maxTemp: 14 },
  { day: 'Tuesday', date: 'Dec 31', condition: 'cloudy' as const, minTemp: 10, maxTemp: 17 },
  { day: 'Wednesday', date: 'Jan 1', condition: 'sunny' as const, minTemp: 13, maxTemp: 22 },
];

export const weatherMetrics = {
  humidity: { value: 72, unit: '%', description: 'Comfortable humidity levels' },
  windSpeed: { value: 15, unit: 'km/h', description: 'Light breeze from the west' },
  pressure: { value: 1013, unit: 'hPa', description: 'Normal atmospheric pressure' },
  visibility: { value: 10, unit: 'km', description: 'Excellent visibility' },
  uvIndex: { value: 6, unit: '', description: 'High - Use sun protection' },
  precipitation: { value: 20, unit: '%', description: 'Low chance of rain' },
};

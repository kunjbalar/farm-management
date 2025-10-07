import WeatherWidget from '../WeatherWidget';

export default function WeatherWidgetExample() {
  return (
    <WeatherWidget
      temperature="20°C"
      condition="Partly Cloudy"
      humidity="75%"
      wind="25 km/h"
      forecast={[
        { time: '9PM', temp: '19°' },
        { time: '10PM', temp: '19°' },
        { time: '11PM', temp: '18°' },
        { time: '12AM', temp: '18°' },
        { time: '1AM', temp: '18°' }
      ]}
    />
  );
}

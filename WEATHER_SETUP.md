# Weather Widget Setup

The Weather widget now fetches real-time weather data based on the user's farm location.

## Setup Instructions

### 1. Get a Free OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Click "Sign Up" to create a free account
3. After signing in, go to "API keys" section
4. Copy your API key

### 2. Add API Key to Environment Variables

Open the `.env` file in the root directory and replace `your_api_key_here` with your actual API key:

```
OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 3. Restart the Server

After adding the API key, restart your development server:

```bash
npm run dev
```

## How It Works

1. The Weather widget fetches data from the `/api/weather` endpoint
2. The backend uses the user's **Farm Location** (set in their profile) to query the OpenWeatherMap API
3. Weather data updates automatically every 10 minutes
4. If no location is set, the widget displays "No location set"

## Setting Your Farm Location

To see weather data:

1. Click on your profile in the sidebar
2. Click "Edit Profile"
3. Enter your farm location (e.g., "London", "New York", "Mumbai")
4. Save changes

The weather widget will automatically update with the weather for your location!

## Features

- **Current Weather**: Temperature, condition, humidity, wind speed
- **Dynamic Icons**: Weather icons change based on conditions (sun, cloud, rain, snow)
- **5-Hour Forecast**: Shows upcoming weather conditions
- **Auto-refresh**: Updates every 10 minutes
- **Location-based**: Uses your farm location from profile settings

## API Limits

The free tier of OpenWeatherMap allows:
- 1,000 API calls per day
- 60 calls per minute

This is more than enough for normal usage with auto-refresh every 10 minutes.

## Fallback Behavior

If the API key is not set or invalid:
- Widget shows "Unable to fetch weather"
- No errors are thrown
- User can still use all other features of the application

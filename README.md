# MiniPhone Weather Widget Setup

## API Keys Setup

1. Create a free account at [OpenWeather](https://openweathermap.org/api)
2. Once registered, get your API key from the "API keys" tab
3. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Open `.env` and replace the placeholder with your actual API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

Note: It may take a few hours for a new API key to become active. If you see an error, please wait and try again later.

## Features

- Current weather conditions
- 3-day forecast
- Wind speed and humidity
- Location search
- Automatic theme support (light/dark)
- Persistent location settings
- ToDo List with cutomization
- flappy bird game 

#How to install
- npm install
- npm run dev

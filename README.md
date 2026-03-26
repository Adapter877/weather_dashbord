# Weather Dashboard
#ohmtestgitea
A modern weather dashboard built with Next.js and Tailwind CSS.

## Features

- Live weather data from Open-Meteo
- Automatic geolocation (with fallback coordinates)
- 24-hour temperature chart
- 3-day forecast cards
- PM2.5 air quality indicator with severity colors
- Responsive dashboard UI

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Recharts
- Yarn
- Docker / Docker Compose

## Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Available variables:

```bash
DEFAULT_LAT=13.7563
DEFAULT_LON=100.5018
OPEN_METEO_BASE_URL=https://api.open-meteo.com
OPEN_METEO_AIR_QUALITY_BASE_URL=https://air-quality-api.open-meteo.com
NEXT_TELEMETRY_DISABLED=1
PORT=3000
```

## Run Locally

```bash
yarn install
yarn dev
```

Open `http://localhost:3000`.

## Run with Docker

```bash
docker compose up --build
```

Open `http://localhost:3000`.

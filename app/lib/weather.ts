export interface WeatherData {
  current: {
    temperature: number
    windSpeed: number
    weatherCode: number
    isDay: boolean
    pm25: number | null
  }
  daily: {
    time: string[]
    weatherCode: number[]
    temperatureMax: number[]
    temperatureMin: number[]
  }
  hourly: {
    isoTime: string
    time: string
    temp: number
    windSpeed: number
    weatherCode: number
    precipitationProbability: number | null
    humidity: number | null
    pm25: number | null
  }[]
}

const WEATHER_API_BASE_URL = (process.env.OPEN_METEO_BASE_URL ?? "https://api.open-meteo.com").replace(/\/$/, "")
const AIR_QUALITY_API_BASE_URL = (
  process.env.OPEN_METEO_AIR_QUALITY_BASE_URL ?? "https://air-quality-api.open-meteo.com"
).replace(/\/$/, "")

export async function getWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const weatherParams = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: "temperature_2m,weather_code,wind_speed_10m,is_day",
      daily: "weather_code,temperature_2m_max,temperature_2m_min",
      hourly: "temperature_2m,weather_code,wind_speed_10m,precipitation_probability,relative_humidity_2m",
      timezone: "auto",
      forecast_days: "3",
    })

    const airQualityParams = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      hourly: "pm2_5",
      timezone: "auto",
      forecast_days: "3",
    })

    const [weatherRes, airQualityRes] = await Promise.all([
      fetch(`${WEATHER_API_BASE_URL}/v1/forecast?${weatherParams.toString()}`, {
        next: { revalidate: 1800 },
      }),
      fetch(`${AIR_QUALITY_API_BASE_URL}/v1/air-quality?${airQualityParams.toString()}`, {
        next: { revalidate: 1800 },
      }),
    ])

    if (!weatherRes.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const weatherData = await weatherRes.json()
    const airQualityData = airQualityRes.ok ? await airQualityRes.json() : null

    const weatherTimes = weatherData.hourly.time as string[]
    const currentTime = weatherData.current.time as string | undefined
    const currentHourIndexFromCurrent = currentTime ? weatherTimes.findIndex((time) => time === currentTime) : -1
    const currentHourIndex =
      currentHourIndexFromCurrent >= 0 ? currentHourIndexFromCurrent : Math.min(new Date().getHours(), weatherTimes.length - 1)

    const hourlyData = weatherTimes.slice(currentHourIndex, currentHourIndex + 24).map((isoTime, index) => {
      const sourceIndex = currentHourIndex + index
      const pm25Series = airQualityData?.hourly?.pm2_5 as (number | null)[] | undefined
      const pm25 = pm25Series ? pm25Series[sourceIndex] : null

      return {
        isoTime,
        time: new Date(isoTime).toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
        temp: Math.round(weatherData.hourly.temperature_2m[sourceIndex]),
        windSpeed: Math.round(weatherData.hourly.wind_speed_10m[sourceIndex]),
        weatherCode: weatherData.hourly.weather_code[sourceIndex],
        precipitationProbability: weatherData.hourly.precipitation_probability?.[sourceIndex] ?? null,
        humidity: weatherData.hourly.relative_humidity_2m?.[sourceIndex] ?? null,
        pm25: pm25 ?? null,
      }
    })

    return {
      current: {
        temperature: weatherData.current.temperature_2m,
        weatherCode: weatherData.current.weather_code,
        windSpeed: weatherData.current.wind_speed_10m,
        isDay: !!weatherData.current.is_day,
        pm25: hourlyData[0]?.pm25 ?? null,
      },
      daily: {
        time: weatherData.daily.time,
        weatherCode: weatherData.daily.weather_code,
        temperatureMax: weatherData.daily.temperature_2m_max,
        temperatureMin: weatherData.daily.temperature_2m_min,
      },
      hourly: hourlyData,
    }
  } catch (error) {
    console.error("WeatherAPI Error:", error)
    return null
  }
}

// Helper to map WMO codes to descriptions/icons
export function getWeatherCondition(code: number): { label: string; iconName: string } {
    // Simple mapping
    if (code === 0) return { label: "Clear sky", iconName: "Sun" }
    if (code >= 1 && code <= 3) return { label: "Partly cloudy", iconName: "CloudSun" }
    if (code >= 45 && code <= 48) return { label: "Fog", iconName: "CloudFog" }
    if (code >= 51 && code <= 67) return { label: "Drizzle / Rain", iconName: "CloudRain" }
    if (code >= 71 && code <= 77) return { label: "Snow", iconName: "Snowflake" }
    if (code >= 80 && code <= 82) return { label: "Showers", iconName: "CloudRainWind" }
    if (code >= 95) return { label: "Thunderstorm", iconName: "CloudLightning" }
    return { label: "Unknown", iconName: "Cloud" }
}

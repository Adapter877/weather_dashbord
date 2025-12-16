export interface WeatherData {
    current: {
        temperature: number
        windSpeed: number
        weatherCode: number
        isDay: boolean
    }
    daily: {
        time: string[]
        weatherCode: number[]
        temperatureMax: number[]
        temperatureMin: number[]
    }
    hourly: {
        time: string;
        temp: number;
        windSpeed: number;
        weatherCode: number;
    }[];
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData | null> {
    try {
        const params = new URLSearchParams({
            latitude: lat.toString(),
            longitude: lon.toString(),
            current: "temperature_2m,weather_code,wind_speed_10m,is_day",
            daily: "weather_code,temperature_2m_max,temperature_2m_min",
            hourly: "temperature_2m",
            timezone: "auto",
            forecast_days: "3", // Limit to keep payload smaller but covering enough for chart
        })

        const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        })

        if (!res.ok) {
            throw new Error("Failed to fetch weather data")
        }

        const data = await res.json()

        // Process hourly data for the next 24 hours only
        const currentHourIndex = new Date().getHours()
        const hourlyData = data.hourly.time
            .slice(currentHourIndex, currentHourIndex + 24)
            .map((time: string, index: number) => ({
                time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
                temp: Math.round(data.hourly.temperature_2m[currentHourIndex + index])
            }))

        return {
            current: {
                temperature: data.current.temperature_2m,
                weatherCode: data.current.weather_code,
                windSpeed: data.current.wind_speed_10m,
                isDay: !!data.current.is_day,
            },
            daily: {
                time: data.daily.time,
                weatherCode: data.daily.weather_code,
                temperatureMax: data.daily.temperature_2m_max,
                temperatureMin: data.daily.temperature_2m_min,
            },
            hourly: hourlyData
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

import { getWeather, getWeatherCondition } from "./lib/weather"
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  Snowflake,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react"
import { LocationRequester } from "./components/LocationRequester"

const DEFAULT_LAT = Number(process.env.DEFAULT_LAT ?? "13.7563")
const DEFAULT_LON = Number(process.env.DEFAULT_LON ?? "100.5018")

const WeatherIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case "Sun":
      return <Sun className={className} />
    case "CloudSun":
      return <CloudSun className={className} />
    case "CloudFog":
      return <CloudFog className={className} />
    case "CloudRain":
      return <CloudRain className={className} />
    case "Snowflake":
      return <Snowflake className={className} />
    case "CloudRainWind":
      return <CloudRain className={className} />
    case "CloudLightning":
      return <CloudLightning className={className} />
    default:
      return <Cloud className={className} />
  }
}

export default async function Home(props: { searchParams: Promise<{ lat?: string; lon?: string }> }) {
  const searchParams = await props.searchParams

  const lat = searchParams.lat
    ? parseFloat(searchParams.lat)
    : Number.isFinite(DEFAULT_LAT)
      ? DEFAULT_LAT
      : 13.7563
  const lon = searchParams.lon
    ? parseFloat(searchParams.lon)
    : Number.isFinite(DEFAULT_LON)
      ? DEFAULT_LON
      : 100.5018
  const isDefaultLocation = !searchParams.lat

  const weather = await getWeather(lat, lon)
  const currentCondition = weather ? getWeatherCondition(weather.current.weatherCode) : { label: "Unknown", iconName: "Cloud" }

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-100">
      <div className="pointer-events-none absolute inset-0 site-grid opacity-25" />
      <div className="pointer-events-none absolute -top-56 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-sky-400/15 blur-3xl" />

      <LocationRequester />

      <header className="sticky top-0 z-40 border-b border-slate-700/30 bg-slate-950/65 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-sky-300/30 bg-sky-400/15 p-2">
              <CloudSun className="h-5 w-5 text-sky-200" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Weather Platform</p>
              <p className="text-base font-semibold text-slate-100">Weather Dash</p>
            </div>
          </div>

          <p className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-emerald-200">
            Public Dashboard
          </p>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl space-y-8 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {weather && (
          <>
            <section className="glass-panel overflow-hidden p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    Live Weather Snapshot
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-slate-400">
                      <MapPin className="h-4 w-4" />
                      {isDefaultLocation ? "Bangkok, Thailand" : `Lat: ${lat}, Lon: ${lon}`}
                    </div>
                    <p className="text-sm text-slate-300">
                      {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-end gap-4">
                    <div className="flex items-end gap-2">
                      <span className="text-7xl font-light leading-none tracking-tight text-slate-50 sm:text-8xl">
                        {Math.round(weather.current.temperature)}
                      </span>
                      <span className="pb-2 text-3xl font-light text-sky-300">°C</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-100">
                      <WeatherIcon name={currentCondition.iconName} className="h-4 w-4" />
                      {currentCondition.label}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-600/40 bg-slate-900/40 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Wind Speed</p>
                      <p className="mt-2 flex items-center gap-2 text-xl font-medium text-slate-100">
                        <Wind className="h-5 w-5 text-sky-300" />
                        {weather.current.windSpeed} km/h
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-600/40 bg-slate-900/40 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Temperature</p>
                      <p className="mt-2 flex items-center gap-2 text-xl font-medium text-slate-100">
                        <Thermometer className="h-5 w-5 text-cyan-300" />
                        {Math.round(weather.current.temperature)}°C
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {weather.daily.time.slice(0, 4).map((time, index) => {
                    const condition = getWeatherCondition(weather.daily.weatherCode[index])
                    const date = new Date(time)
                    const isToday = index === 0

                    return (
                      <div
                        key={time}
                        className={`rounded-2xl border p-5 transition ${
                          isToday
                            ? "border-sky-300/35 bg-gradient-to-r from-sky-500/20 to-cyan-400/10"
                            : "border-slate-700/40 bg-slate-900/30"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className={`text-sm font-semibold ${isToday ? "text-sky-200" : "text-slate-200"}`}>
                              {date.toLocaleDateString("en-US", { weekday: "short" })}
                            </p>
                            <p className="text-xs text-slate-400">{isToday ? "Today" : "Forecast"}</p>
                          </div>
                          <WeatherIcon name={condition.iconName} className="h-5 w-5 text-slate-200" />
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            <p className="text-2xl font-light text-slate-50">
                              {Math.round(weather.daily.temperatureMax[index])}°
                            </p>
                            <p className="text-xs text-slate-400">Max</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-light text-slate-300">
                              {Math.round(weather.daily.temperatureMin[index])}°
                            </p>
                            <p className="text-xs text-slate-400">Min</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="glass-panel overflow-hidden p-0">
                <div className="border-b border-slate-700/40 px-6 py-5">
                  <h2 className="text-lg font-semibold text-slate-100">Hourly Forecast</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    เรียงข้อมูลรายชั่วโมงแบบละเอียด พร้อมค่า PM2.5
                  </p>
                </div>

                <div className="hidden gap-3 border-b border-slate-700/30 px-6 py-3 text-xs uppercase tracking-[0.14em] text-slate-400 md:grid md:grid-cols-7">
                  <span>Time</span>
                  <span>Condition</span>
                  <span className="text-right">Temp</span>
                  <span className="text-right">Rain</span>
                  <span className="text-right">Wind</span>
                  <span className="text-right">Humidity</span>
                  <span className="text-right">PM2.5</span>
                </div>

                <div className="divide-y divide-slate-700/25">
                  {weather.hourly.slice(0, 24).map((hour, index) => {
                    const condition = getWeatherCondition(hour.weatherCode)
                    const isNow = index === 0

                    return (
                      <div
                        key={hour.isoTime}
                        className={`px-6 py-4 transition hover:bg-slate-900/30 ${isNow ? "bg-sky-500/10" : ""}`}
                      >
                        <div className="grid gap-3 md:grid-cols-7 md:items-center">
                          <p className={`text-sm font-medium ${isNow ? "text-sky-200" : "text-slate-200"}`}>
                            {isNow ? "Now" : hour.time}
                          </p>

                          <div className="flex items-center gap-2">
                            <WeatherIcon name={condition.iconName} className="h-4 w-4 text-slate-200" />
                            <span className="text-sm text-slate-200">{condition.label}</span>
                          </div>

                          <p className="text-sm text-slate-100 md:text-right">{hour.temp}°C</p>
                          <p className="text-sm text-slate-300 md:text-right">
                            {hour.precipitationProbability !== null ? `${hour.precipitationProbability}%` : "-"}
                          </p>
                          <p className="text-sm text-slate-300 md:text-right">{hour.windSpeed} km/h</p>
                          <p className="text-sm text-slate-300 md:text-right">
                            {hour.humidity !== null ? `${hour.humidity}%` : "-"}
                          </p>
                          <p className="text-sm md:text-right">
                            {hour.pm25 !== null ? (
                              <span className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-2 py-1 text-cyan-200">
                                {Math.round(hour.pm25)} µg/m³
                              </span>
                            ) : (
                              <span className="text-slate-500">-</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <aside className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-slate-100">Current Summary</h2>
                <p className="mt-1 text-sm text-slate-400">Real-time values from your selected coordinates.</p>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="rounded-xl border border-slate-700/50 bg-slate-900/35 p-4">
                    <p className="text-slate-400">Condition</p>
                    <p className="mt-1 text-base text-slate-100">{currentCondition.label}</p>
                  </div>
                  <div className="rounded-xl border border-slate-700/50 bg-slate-900/35 p-4">
                    <p className="text-slate-400">Wind Speed</p>
                    <p className="mt-1 text-base text-slate-100">{weather.current.windSpeed} km/h</p>
                  </div>
                  <div className="rounded-xl border border-slate-700/50 bg-slate-900/35 p-4">
                    <p className="text-slate-400">PM2.5</p>
                    <p className="mt-1 flex items-center gap-2 text-base text-slate-100">
                      <Droplets className="h-4 w-4 text-cyan-300" />
                      {weather.current.pm25 !== null ? `${Math.round(weather.current.pm25)} µg/m³` : "ไม่มีข้อมูล"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-700/50 bg-slate-900/35 p-4">
                    <p className="text-slate-400">Location</p>
                    <p className="mt-1 text-base text-slate-100">
                      {isDefaultLocation ? "Bangkok, Thailand" : `Lat: ${lat}, Lon: ${lon}`}
                    </p>
                  </div>
                </div>
              </aside>
            </section>
          </>
        )}

        <section className="glass-panel p-6">
          <details className="group">
            <summary className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-slate-200">
              <span>Debug Information</span>
              <span className="rounded border border-slate-600 bg-slate-900 px-2 py-0.5 font-mono text-xs text-slate-400">
                Developer Only
              </span>
            </summary>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Location Parameters
                </h3>
                <pre className="custom-scrollbar max-h-32 overflow-auto text-[10px] text-cyan-300">
                  {JSON.stringify({ lat, lon, isDefaultLocation }, null, 2)}
                </pre>
              </div>

              <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Weather Payload
                </h3>
                <pre className="custom-scrollbar max-h-40 overflow-auto text-[10px] text-sky-300">
                  {JSON.stringify(weather, null, 2)}
                </pre>
              </div>
            </div>
          </details>
        </section>
      </main>
    </div>
  )
}

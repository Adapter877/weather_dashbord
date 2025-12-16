import { auth, signIn, signOut } from "@/auth"
import { getWeather, getWeatherCondition } from "./lib/weather"
import { Wind, Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudSun, Snowflake, Droplets, MapPin, LogOut } from "lucide-react"
import { LocationRequester } from "./components/LocationRequester"
import { WeatherChart } from "./components/WeatherChart"

// Component to map icon name to Lucide component
const WeatherIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case "Sun": return <Sun className={className} />
    case "CloudSun": return <CloudSun className={className} />
    case "CloudFog": return <CloudFog className={className} />
    case "CloudRain": return <CloudRain className={className} />
    case "Snowflake": return <Snowflake className={className} />
    case "CloudRainWind": return <CloudRain className={className} />
    case "CloudLightning": return <CloudLightning className={className} />
    default: return <Cloud className={className} />
  }
}

export default async function Home(props: { searchParams: Promise<{ lat?: string; lon?: string }> }) {
  const searchParams = await props.searchParams
  const session = await auth()

  // Use params or default to Bangkok
  const lat = searchParams.lat ? parseFloat(searchParams.lat) : 13.7563
  const lon = searchParams.lon ? parseFloat(searchParams.lon) : 100.5018
  const isDefaultLocation = !searchParams.lat

  const weather = await getWeather(lat, lon)
  const currentCondition = weather ? getWeatherCondition(weather.current.weatherCode) : { label: "Unknown", iconName: "Cloud" }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <div className="text-center space-y-4">
          <CloudSun className="w-24 h-24 mx-auto text-blue-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Weather Dash
          </h1>
          <p className="text-slate-400">Please sign in to access the dashboard</p>
          <form
            action={async () => {
              "use server"
              await signIn("keycloak")
            }}
          >
            <button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 shadow-lg shadow-blue-900/50">
              Sign In with SSO
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      <LocationRequester />
      {/* Navbar */}
      <nav className="border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CloudSun className="w-6 h-6 text-blue-400" />
            <span className="font-bold text-lg">Weather Dash</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm text-slate-400">
              {session.user?.email}
            </div>
            <form
              action={async () => {
                "use server"
                await signOut()
              }}
            >
              <button className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white" title="Sign Out">
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Main Weather Card */}
        {weather && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm shadow-xl flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <WeatherIcon name={currentCondition.iconName} className="w-64 h-64 -mr-16 -mt-16" />
              </div>

              <div>
                <div className="flex items-center space-x-2 text-blue-300 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium tracking-wide uppercase">
                    {isDefaultLocation ? "Bangkok, Thailand" : `Lat: ${lat}, Lon: ${lon}`}
                  </span>
                </div>
                <div className="text-slate-400 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
              </div>

              <div className="mt-8">
                <div className="flex items-baseline">
                  <span className="text-8xl font-light tracking-tighter text-white">
                    {Math.round(weather.current.temperature)}
                  </span>
                  <span className="text-4xl text-blue-400 font-light ml-1">°C</span>
                </div>
                <div className="flex items-center space-x-3 mt-4">
                  <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-sm font-medium border border-blue-500/20 backdrop-blur-md">
                    {currentCondition.label}
                  </div>
                  <div className="flex items-center space-x-1 text-slate-400 text-sm">
                    <Wind className="w-4 h-4" />
                    <span>{weather.current.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {weather.daily.time.slice(0, 4).map((time, index) => {
                const condition = getWeatherCondition(weather.daily.weatherCode[index])
                const date = new Date(time)
                const isToday = index === 0

                return (
                  <div key={time} className={`p-6 rounded-2xl border flex flex-col justify-between ${isToday ? 'bg-slate-800/50 border-blue-500/30 ring-1 ring-blue-500/20' : 'bg-slate-900/30 border-slate-800/50 hover:bg-slate-800/30 transition-colors'}`}>
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-medium ${isToday ? 'text-blue-400' : 'text-slate-400'}`}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <WeatherIcon name={condition.iconName} className="w-6 h-6 text-slate-200" />
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-2xl font-light text-white">{Math.round(weather.daily.temperatureMax[index])}°</div>
                          <div className="text-sm text-slate-500">Max</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-light text-slate-400">{Math.round(weather.daily.temperatureMin[index])}°</div>
                          <div className="text-sm text-slate-600">Min</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Hourly Chart */}
        {weather && <WeatherChart data={weather.hourly} />}

        {/* Debug Section (Collapsible details) */}
        <div className="mt-12 border-t border-slate-800/50 pt-8">
          <details className="group">
            <summary className="cursor-pointer text-slate-500 hover:text-slate-300 text-sm font-medium flex items-center select-none">
              <span className="mr-2">Debug Information</span>
              <span className="border border-slate-700 px-2 py-0.5 rounded textxs font-mono bg-slate-900">Developer Only</span>
            </summary>
            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">

              {session.accessToken && (
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Keycloak Access Token</h3>
                  <div className="relative">
                    <pre className="text-[10px] text-emerald-400 font-mono break-all whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">
                      {session.accessToken}
                    </pre>
                  </div>
                </div>
              )}

              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Session Payload</h3>
                <pre className="text-[10px] text-blue-300 font-mono overflow-auto max-h-40 custom-scrollbar">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>

            </div>
          </details>
        </div>

      </main>
    </div>
  )
}

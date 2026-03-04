"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MapPin } from "lucide-react"

export function LocationRequester() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasLocation = searchParams.has("lat") && searchParams.has("lon")
  const [loading, setLoading] = useState(() => {
    if (hasLocation) return false
    if (typeof navigator === "undefined") return true
    return "geolocation" in navigator
  })

  useEffect(() => {
    if (!hasLocation && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const params = new URLSearchParams(searchParams.toString())
          params.set("lat", latitude.toFixed(4))
          params.set("lon", longitude.toFixed(4))
          router.replace(`?${params.toString()}`)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setLoading(false)
        },
      )
    }
  }, [hasLocation, router, searchParams])

  if (hasLocation) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-slate-600/60 bg-slate-950/85 px-3 py-2 text-sm text-slate-300 shadow-2xl backdrop-blur-md">
      <div className={`rounded-full p-2 ${loading ? "bg-cyan-500/20" : "bg-slate-800"}`}>
        <MapPin className={`h-4 w-4 ${loading ? "text-cyan-300 animate-pulse" : "text-slate-400"}`} />
      </div>
      <p>{loading ? "Locating..." : "Location access required for local weather"}</p>
    </div>
  )
}

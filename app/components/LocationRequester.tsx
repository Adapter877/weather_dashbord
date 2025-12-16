"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MapPin } from "lucide-react"

export function LocationRequester() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)

    // Check if we already have coordinates
    const hasLocation = searchParams.has("lat") && searchParams.has("lon")

    useEffect(() => {
        // If we don't have location, try to get it
        if (!hasLocation && "geolocation" in navigator) {
            setLoading(true)
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    const params = new URLSearchParams(searchParams.toString())
                    params.set("lat", latitude.toFixed(4))
                    params.set("lon", longitude.toFixed(4))
                    router.replace(`?${params.toString()}`)
                    setLoading(false)
                },
                (error) => {
                    console.error("Geolocation error:", error)
                    setLoading(false)
                }
            )
        }
    }, [hasLocation, router, searchParams])

    if (hasLocation) return null

    return (
        <div className="fixed bottom-4 right-4 bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-lg flex items-center space-x-3 animate-in slide-in-from-bottom-2 z-50">
            <div className={`p-2 rounded-full ${loading ? 'bg-blue-500/20 animate-pulse' : 'bg-slate-800'}`}>
                <MapPin className={`w-4 h-4 ${loading ? 'text-blue-400' : 'text-slate-400'}`} />
            </div>
            <div>
                <p className="text-xs font-medium text-slate-300">
                    {loading ? "Locating..." : "Location access required for local weather"}
                </p>
            </div>
        </div>
    )
}

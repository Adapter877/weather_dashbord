"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface WeatherChartProps {
  data: {
    time: string
    temp: number
  }[]
}

export const WeatherChart = ({ data }: WeatherChartProps) => {
  return (
    <div className="glass-panel p-6">
      <h3 className="mb-1 px-1 text-lg font-semibold text-slate-100">24-Hour Temperature Forecast</h3>
      <p className="mb-6 px-1 text-sm text-slate-400">Hourly trend for the next 24 hours.</p>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 8,
              right: 12,
              left: -18,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="8%" stopColor="#22d3ee" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              interval={2}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid rgba(125, 211, 252, 0.35)",
                borderRadius: "10px",
                color: "#e2e8f0",
              }}
              labelStyle={{ color: "#94a3b8" }}
              formatter={(value) => [`${value}°C`, "Temperature"]}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#22d3ee"
              strokeWidth={2.4}
              fillOpacity={1}
              fill="url(#colorTemp)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

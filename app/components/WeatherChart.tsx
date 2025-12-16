"use client"

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface WeatherChartProps {
    data: {
        time: string
        temp: number
    }[]
}

export const WeatherChart = ({ data }: WeatherChartProps) => {
    return (
        <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-slate-300 mb-6 px-2">24-Hour Temperature Forecast</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: -20,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="time"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            interval={2} // Show every 3rd label roughly
                        />
                        <YAxis
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}°`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                color: '#f1f5f9'
                            }}
                            labelStyle={{ color: '#94a3b8' }}
                            formatter={(value: any) => [`${value}°C`, 'Temperature']}
                        />
                        <Area
                            type="monotone"
                            dataKey="temp"
                            stroke="#60a5fa"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTemp)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

import { useEffect, useState } from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from "recharts"
import { api } from "../lib/api"
import type { Insights } from "../lib/types"

const FUNNEL_COLORS = ["#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6"]

function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
            <div className="text-3xl font-bold text-slate-800 mt-1">{value}</div>
            {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
        </div>
    )
}

export default function Dashboard() {
    const [data, setData] = useState<Insights | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api
            .get<Insights>("/analytics/insights")
            .then((res) => setData(res.data))
            .catch((err) => setError(err?.message ?? "Failed to load analytics"))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-slate-400">Loading dashboard...</p>
    if (error) return <p className="text-red-500">Error: {error}</p>
    if (!data) return null

    const { funnel, rates, insights } = data

    const chartData = [
        { stage: "Sent", value: funnel.sent },
        { stage: "Delivered", value: funnel.delivered },
        { stage: "Read", value: funnel.read },
        { stage: "Clicked", value: funnel.clicked },
        { stage: "Converted", value: funnel.converted },
    ]

    const summaryLines = insights.summary
        .split("\n")
        .filter((l) => l.trim().length > 0)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-slate-500 text-sm">Workspace-wide campaign performance</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Customers" value={String(data.customers)} />
                <KpiCard label="Campaigns" value={String(data.campaigns)} />
                <KpiCard
                    label="Delivered"
                    value={String(funnel.delivered)}
                    sub={rates.deliveryRate + "% of audience"}
                />
                <KpiCard
                    label="Conversion"
                    value={rates.conversionRate + "%"}
                    sub={funnel.converted + " converted"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <h2 className="font-semibold text-slate-700 mb-4">Engagement funnel</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="stage" tickLine={false} axisLine={false} />
                            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {chartData.map((_, i) => (
                                    <Cell key={i} fill={FUNNEL_COLORS[i % FUNNEL_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-slate-700">AI Insights</h2>
                        <span
                            className={
                                "text-[10px] px-2 py-0.5 rounded-full font-medium " +
                                (insights.source === "gemini"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-amber-100 text-amber-700")
                            }
                        >
                            {insights.source === "gemini" ? "Gemini" : "Rule-based"}
                        </span>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-600">
                        {summaryLines.map((line, i) => (
                            <li key={i} className="flex gap-2">
                                <span className="text-brand">â€¢</span>
                                <span>{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-center">
                {[
                    { label: "Read rate", value: rates.readRate + "%" },
                    { label: "Click rate", value: rates.clickRate + "%" },
                    { label: "Failed", value: String(funnel.failed) },
                    { label: "Failure rate", value: rates.failureRate + "%" },
                    { label: "Total sent", value: String(funnel.sent) },
                ].map((m) => (
                    <div key={m.label} className="bg-white rounded-lg border border-slate-100 p-3">
                        <div className="text-lg font-semibold text-slate-800">{m.value}</div>
                        <div className="text-[11px] text-slate-400">{m.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

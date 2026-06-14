import { useEffect, useState } from "react"
import { api } from "../lib/api"
import type { Campaign, CampaignAnalytics } from "../lib/types"

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        RUNNING: "bg-blue-100 text-blue-700",
        COMPLETED: "bg-green-100 text-green-700",
        DRAFT: "bg-slate-100 text-slate-600",
        FAILED: "bg-red-100 text-red-700",
    }
    const cls = map[status] ?? "bg-slate-100 text-slate-600"
    return (
        <span className={"text-[10px] px-2 py-0.5 rounded-full font-medium " + cls}>
            {status}
        </span>
    )
}

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selected, setSelected] = useState<string | null>(null)
    const [detail, setDetail] = useState<CampaignAnalytics | null>(null)
    const [detailLoading, setDetailLoading] = useState(false)

    useEffect(() => {
        api
            .get("/campaigns")
            .then((res) => {
                const data: any = res.data
                const list: Campaign[] = Array.isArray(data) ? data : data.value ?? []
                setCampaigns(list)
            })
            .catch((err) => setError(err?.message ?? "Failed to load campaigns"))
            .finally(() => setLoading(false))
    }, [])

    async function openDetail(id: string) {
        setSelected(id)
        setDetail(null)
        setDetailLoading(true)
        try {
            const res = await api.get<CampaignAnalytics>("/analytics/campaigns/" + id)
            setDetail(res.data)
        } catch {
            setDetail(null)
        } finally {
            setDetailLoading(false)
        }
    }

    if (loading) return <p className="text-slate-400">Loading campaigns...</p>
    if (error) return <p className="text-red-500">Error: {error}</p>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Campaigns</h1>
                <p className="text-slate-500 text-sm">
                    {campaigns.length} campaigns - click one to see its funnel
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                    {campaigns.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => openDetail(c.id)}
                            className={
                                "w-full text-left bg-white rounded-xl border p-4 transition hover:shadow-sm " +
                                (selected === c.id ? "border-brand ring-1 ring-brand/40" : "border-slate-100")
                            }
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="font-medium text-slate-800 text-sm truncate">{c.name}</div>
                                <StatusBadge status={c.status} />
                            </div>
                            <div className="text-xs text-slate-400 mt-1 truncate">{c.goal}</div>
                            <div className="flex gap-3 mt-2 text-xs text-slate-500">
                                <span>{c.channel}</span>
                                <span>- {c.audienceSize} recipients</span>
                                {c.launchedAt && (
                                    <span>- {new Date(c.launchedAt).toLocaleDateString()}</span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-xl border border-slate-100 p-5 h-fit sticky top-8">
                    {!selected ? (
                        <p className="text-sm text-slate-400">Select a campaign to view its funnel.</p>
                    ) : detailLoading ? (
                        <p className="text-sm text-slate-400">Loading funnel...</p>
                    ) : detail ? (
                        <div className="space-y-4">
                            <div>
                                <div className="font-semibold text-slate-800">{detail.campaign.name}</div>
                                <div className="text-xs text-slate-400">
                                    {detail.campaign.channel} - {detail.campaign.status}
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                {[
                                    { label: "Total", value: detail.funnel.total },
                                    { label: "Delivered", value: detail.funnel.delivered },
                                    { label: "Read", value: detail.funnel.read },
                                    { label: "Clicked", value: detail.funnel.clicked },
                                    { label: "Converted", value: detail.funnel.converted },
                                    { label: "Failed", value: detail.funnel.failed },
                                ].map((m) => (
                                    <div key={m.label} className="bg-slate-50 rounded-lg p-2">
                                        <div className="text-lg font-bold text-slate-800">{m.value}</div>
                                        <div className="text-[11px] text-slate-400">{m.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                                <div>Delivery: {detail.rates.deliveryRate}%</div>
                                <div>Read: {detail.rates.readRate}%</div>
                                <div>Click: {detail.rates.clickRate}%</div>
                                <div>Conversion: {detail.rates.conversionRate}%</div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-red-500">Failed to load funnel.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

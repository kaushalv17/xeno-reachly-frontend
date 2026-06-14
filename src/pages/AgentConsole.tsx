import { useState } from "react"
import { api } from "../lib/api"
import type { AgentRun, SegmentRule, SegmentCondition } from "../lib/types"

const EXAMPLE_GOALS = [
    "win back lapsed shoppers who spent more than 10000",
    "re-engage customers who have not ordered in 60 days",
    "reward loyal shoppers with more than 5 orders",
]

function ruleToText(rule: SegmentRule): string {
    const parts = rule.conditions.map((c) => {
        if ("conditions" in c) return "(" + ruleToText(c as SegmentRule) + ")"
        const cond = c as SegmentCondition
        return cond.field + " " + cond.operator + " " + cond.value
    })
    return parts.join(" " + rule.combinator.toUpperCase() + " ")
}

export default function AgentConsole() {
    const [goal, setGoal] = useState("")
    const [run, setRun] = useState<AgentRun | null>(null)
    const [loading, setLoading] = useState(false)
    const [launching, setLaunching] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function generatePlan() {
        if (!goal.trim()) return
        setLoading(true)
        setError(null)
        setRun(null)
        try {
            const res = await api.post<AgentRun>("/agent/run", { goal })
            setRun(res.data)
        } catch (err: any) {
            setError(err?.response?.data?.error ?? err?.message ?? "Failed to run agent")
        } finally {
            setLoading(false)
        }
    }

    async function approveAndLaunch() {
        if (!goal.trim()) return
        setLaunching(true)
        setError(null)
        try {
            const res = await api.post<AgentRun>("/agent/run", { goal, autoLaunch: true })
            setRun(res.data)
        } catch (err: any) {
            setError(err?.response?.data?.error ?? err?.message ?? "Failed to launch")
        } finally {
            setLaunching(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold">AI Agent</h1>
                <p className="text-slate-500 text-sm">
                    Describe a marketing goal in plain English. The agent plans the segment,
                    previews the audience, drafts messages, and waits for your approval before sending.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 space-y-3">
                <label className="text-sm font-medium text-slate-700">Campaign goal</label>
                <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    rows={3}
                    placeholder="e.g. win back lapsed shoppers who spent more than 10000"
                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
                <div className="flex flex-wrap gap-2">
                    {EXAMPLE_GOALS.map((g) => (
                        <button
                            key={g}
                            onClick={() => setGoal(g)}
                            className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
                        >
                            {g}
                        </button>
                    ))}
                </div>
                <button
                    onClick={generatePlan}
                    disabled={loading || !goal.trim()}
                    className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark disabled:opacity-50"
                >
                    {loading ? "Planning..." : "Generate plan"}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
                    {error}
                </div>
            )}

            {run && (
                <div className="space-y-5">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-slate-700">Agent plan</h2>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                planner: {run.planner}
                            </span>
                        </div>
                        <ol className="space-y-4">
                            {run.steps.map((step, i) => (
                                <li key={i} className="flex gap-3">
                                    <div className="flex-none w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-semibold">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-700">
                                            {step.tool.replace(/_/g, " ")}
                                        </div>
                                        <div className="text-xs text-slate-500">{step.thought}</div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 space-y-4">
                        <h2 className="font-semibold text-slate-700">Recommendation</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs uppercase text-slate-400 mb-1">Segment rule</div>
                                <code className="text-xs bg-slate-50 border border-slate-200 rounded p-2 block text-slate-700">
                                    {ruleToText(run.recommendation.rule)}
                                </code>
                            </div>
                            <div>
                                <div className="text-xs uppercase text-slate-400 mb-1">Audience</div>
                                <div className="text-2xl font-bold text-slate-800">
                                    {run.recommendation.audienceSize}
                                </div>
                                <div className="text-xs text-slate-400">shoppers matched</div>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs uppercase text-slate-400 mb-2">Message variants</div>
                            <div className="space-y-2">
                                {run.recommendation.messageVariants.map((v) => (
                                    <div
                                        key={v.label}
                                        className="border border-slate-200 rounded-lg p-3 text-sm text-slate-600"
                                    >
                                        <span className="text-xs font-semibold text-brand">{v.label}</span>
                                        <div className="mt-1">{v.message}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {run.status === "launched" && run.campaign ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="text-sm font-semibold text-green-700">Campaign launched</div>
                                <div className="text-xs text-green-600 mt-1">
                                    {run.campaign.name} - audience {run.campaign.audienceSize} - status {run.campaign.status}
                                </div>
                            </div>
                        ) : run.status === "no_audience" ? (
                            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg p-3">
                                No shoppers matched this goal. Try loosening the criteria.
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-slate-50 rounded-lg p-4">
                                <div className="text-xs text-slate-500">
                                    {run.approvalHint ?? "Review the plan, then approve to dispatch."}
                                </div>
                                <button
                                    onClick={approveAndLaunch}
                                    disabled={launching}
                                    className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark disabled:opacity-50"
                                >
                                    {launching ? "Launching..." : "Approve & launch"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export type Funnel = {
    total: number
    queued: number
    sent: number
    delivered: number
    read: number
    clicked: number
    converted: number
    failed: number
}

export type Rates = {
    deliveryRate: number
    readRate: number
    clickRate: number
    conversionRate: number
    failureRate: number
}

export type Overview = {
    scope: string
    campaigns: number
    customers: number
    funnel: Funnel
    rates: Rates
}

export type Insights = Overview & {
    insights: { source: "gemini" | "fallback"; summary: string }
}

export type SegmentCondition = {
    field: string
    operator: string
    value: string | number
}

export type SegmentRule = {
    combinator: "and" | "or"
    conditions: Array<SegmentCondition | SegmentRule>
}

export type MessageVariant = { label: string; message: string }

export type AgentStep = {
    tool: string
    thought: string
    input: Record<string, unknown>
    output: Record<string, unknown>
}

export type AgentRecommendation = {
    rule: SegmentRule
    audienceSize: number
    recommendedMessage: string
    messageVariants: MessageVariant[]
}

export type Campaign = {
    id: string
    name: string
    goal?: string
    channel: string
    messageTemplate: string
    status: string
    segmentId?: string
    audienceSize: number
    launchedAt?: string | null
    createdAt: string
    updatedAt: string
}

export type AgentRun = {
    goal: string
    channel: string
    planner: "deterministic" | "gemini"
    steps: AgentStep[]
    recommendation: AgentRecommendation
    launched: boolean
    status: "awaiting_approval" | "launched" | "no_audience"
    campaign: Campaign | null
    approvalHint?: string
}

export type CampaignAnalytics = {
    scope: string
    campaign: { id: string; name: string; status: string; channel: string }
    funnel: Funnel
    rates: Rates
}

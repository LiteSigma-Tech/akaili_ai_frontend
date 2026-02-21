<!-- pages/dashboard/analytics.vue -->
<template>
    <div class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 p-4 md:p-8 overflow-x-hidden">

        <div
            class="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-900/10 pointer-events-none">
        </div>

        <div class="relative z-10 max-w-7xl mx-auto">

            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-10">
                <div>
                    <div class="flex items-center gap-3 mb-1">
                        <h1 class="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Analytics</h1>
                        <span class="flex h-2.5 w-2.5 relative">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                    </div>
                    <p class="text-sm md:text-base text-gray-500 dark:text-gray-400">Real-time performance insights.</p>
                </div>

                <!-- Range selector -->
                <div
                    class="flex items-center bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
                    <button v-for="r in dateRanges" :key="r.val" @click="changeRange(r.val)"
                        class="flex-1 px-4 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap"
                        :class="selectedRange === r.val
                            ? 'bg-[#9E4CFF] text-white shadow-md'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'">
                        {{ r.label }}
                    </button>
                </div>
            </div>

            <!-- Error -->
            <div v-if="analyticsStore.error"
                class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-4 text-sm text-red-700 dark:text-red-300">
                Failed to load analytics.
                <button @click="changeRange(selectedRange)" class="underline font-semibold ml-1">Retry</button>
            </div>

            <!-- ── KPI Cards ── -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-10">

                <template v-if="analyticsStore.loading">
                    <div v-for="i in 4" :key="i"
                        class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 animate-pulse h-28">
                    </div>
                </template>

                <template v-else>
                    <div v-for="(stat, i) in kpiStats" :key="i"
                        class="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition-all duration-300">
                        <div class="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity"
                            :class="stat.gradient"></div>
                        <div class="relative z-10 flex justify-between items-start mb-3">
                            <div class="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white">
                                <component :is="stat.icon" class="w-5 h-5" />
                            </div>
                            <div v-if="stat.trend !== null"
                                class="flex items-center gap-1 text-[10px] md:text-xs font-bold px-2 py-1 rounded-full"
                                :class="stat.trendUp
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'">
                                <ArrowUpRight v-if="stat.trendUp" class="w-3 h-3" />
                                <ArrowDownRight v-else class="w-3 h-3" />
                                {{ Math.abs(stat.trend) }}%
                            </div>
                        </div>
                        <div class="relative z-10">
                            <!-- Star rating display for avg_rating card -->
                            <div v-if="stat.isRating" class="flex items-end gap-2">
                                <h3 class="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">{{
                                    stat.value }}</h3>
                                <div class="flex gap-0.5 mb-1">
                                    <span v-for="s in 5" :key="s" class="text-base"
                                        :class="s <= Math.round(analyticsStore.kpis?.avg_rating ?? 0) ? 'text-yellow-400' : 'text-gray-200 dark:text-slate-700'">★</span>
                                </div>
                            </div>
                            <h3 v-else class="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">{{
                                stat.value }}</h3>
                            <p class="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{{
                                stat.label }}</p>
                            <p v-if="stat.subLabel" class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{{
                                stat.subLabel }}</p>
                        </div>
                    </div>
                </template>
            </div>

            <!-- ── Traffic Chart + Source Breakdown ── -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-10">

                <!-- Traffic chart -->
                <div
                    class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-8 border border-gray-100 dark:border-slate-800 shadow-sm">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Traffic</h3>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Daily interactions</p>
                        </div>
                        <p class="text-xl md:text-2xl font-bold text-[#9E4CFF]">{{
                            analyticsStore.kpis?.total_conversations ?? '—'
                            }}</p>
                    </div>

                    <div v-if="analyticsStore.loading"
                        class="h-56 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                    <div v-else class="h-56 md:h-72 w-full flex items-end justify-between gap-1 md:gap-2 relative">
                        <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            <div v-for="i in 5" :key="i"
                                class="w-full border-t border-dashed border-gray-100 dark:border-slate-800/50 last:border-0">
                            </div>
                        </div>
                        <div v-for="(day, idx) in analyticsStore.dailyTraffic" :key="idx"
                            class="relative w-full h-full flex flex-col justify-end group/bar">
                            <div
                                class="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/bar:opacity-100 transition-all bg-gray-900 text-white text-xs py-1 px-2 rounded z-20">
                                {{ day.value }}
                            </div>
                            <div class="w-full bg-purple-100 dark:bg-slate-800 rounded-t-lg overflow-hidden relative"
                                :style="{ height: `${Math.max((day.value / analyticsStore.maxChartValue) * 100, 2)}%` }">
                                <div class="absolute inset-0 bg-gradient-to-t from-[#9E4CFF] to-purple-400"></div>
                            </div>
                            <span class="text-[10px] md:text-xs font-medium text-gray-400 mt-2 text-center">{{ day.label
                                }}</span>
                        </div>
                    </div>
                </div>

                <!-- Source breakdown -->
                <div
                    class="bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-8 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-5">Traffic Source</h3>

                    <div v-if="analyticsStore.loading" class="space-y-4">
                        <div v-for="i in 2" :key="i" class="h-8 bg-gray-100 dark:bg-slate-800 rounded animate-pulse">
                        </div>
                    </div>

                    <div v-else class="space-y-5">
                        <div v-for="src in analyticsStore.sourceBreakdown" :key="src.label">
                            <div class="flex justify-between items-end mb-1.5">
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate pr-4">{{
                                    src.label
                                    }}</span>
                                <span class="text-sm font-bold text-gray-900 dark:text-white">{{ src.value }}</span>
                            </div>
                            <div class="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-1000" :class="src.color"
                                    :style="{ width: sourcePercent(src.value) + '%' }"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Top chatbots -->
                    <div v-if="!analyticsStore.loading && analyticsStore.topChatbots.length"
                        class="mt-6 pt-5 border-t border-gray-100 dark:border-slate-800">
                        <h4 class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Top Chatbots</h4>
                        <div class="space-y-3">
                            <div v-for="bot in analyticsStore.topChatbots" :key="bot.name">
                                <div class="flex justify-between text-xs mb-1">
                                    <span class="text-gray-600 dark:text-gray-300 truncate pr-2">{{ bot.name }}</span>
                                    <span class="font-bold text-gray-900 dark:text-white shrink-0">{{ bot.percent
                                        }}%</span>
                                </div>
                                <div class="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5">
                                    <div class="h-full rounded-full bg-[#9E4CFF] transition-all duration-700"
                                        :style="{ width: bot.percent + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-auto pt-6">
                        <button @click="openFullReport"
                            class="w-full py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                            View Full Report →
                        </button>
                    </div>
                </div>
            </div>

            <!-- ── Recent Interactions ── -->
            <div
                class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div
                    class="p-5 md:p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Recent Interactions</h3>
                    <NuxtLink to="/dashboard/live-monitoring"
                        class="text-xs md:text-sm font-semibold text-[#9E4CFF] hover:text-purple-700">View All
                    </NuxtLink>
                </div>

                <div v-if="analyticsStore.loading" class="p-6 space-y-3">
                    <div v-for="i in 5" :key="i" class="h-12 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse">
                    </div>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="w-full text-left min-w-[540px]">
                        <thead class="bg-gray-50/50 dark:bg-slate-800/20">
                            <tr>
                                <th class="px-4 md:px-6 py-3 text-[10px] md:text-xs font-bold text-gray-500 uppercase">
                                    User</th>
                                <th class="px-4 md:px-6 py-3 text-[10px] md:text-xs font-bold text-gray-500 uppercase">
                                    Chatbot</th>
                                <th class="px-4 md:px-6 py-3 text-[10px] md:text-xs font-bold text-gray-500 uppercase">
                                    Status</th>
                                <th class="px-4 md:px-6 py-3 text-[10px] md:text-xs font-bold text-gray-500 uppercase">
                                    Rating</th>
                                <th
                                    class="px-4 md:px-6 py-3 text-[10px] md:text-xs font-bold text-gray-500 uppercase hidden md:table-cell">
                                    Msgs</th>
                                <th
                                    class="px-4 md:px-6 py-3 text-[10px] md:text-xs font-bold text-gray-500 uppercase text-right">
                                    Time</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                            <tr v-if="analyticsStore.recentSessions.length === 0">
                                <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                                    No interactions in this period.
                                </td>
                            </tr>
                            <tr v-for="session in analyticsStore.recentSessions" :key="session.id"
                                class="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td class="px-4 md:px-6 py-4">
                                    <div
                                        class="font-semibold text-gray-900 dark:text-white text-sm truncate max-w-[120px]">
                                        {{
                                        session.user }}</div>
                                    <div class="text-[10px] text-gray-400 uppercase">{{ session.source }}</div>
                                </td>
                                <td
                                    class="px-4 md:px-6 py-4 text-sm text-gray-600 dark:text-gray-300 truncate max-w-[120px]">
                                    {{
                                    session.chatbot_name }}</td>
                                <td class="px-4 md:px-6 py-4">
                                    <span
                                        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold border"
                                        :class="statusStyles[session.status] ?? statusStyles['Active']">
                                        <span class="w-1.5 h-1.5 rounded-full"
                                            :class="statusDot[session.status] ?? 'bg-gray-400'"></span>
                                        {{ session.status }}
                                    </span>
                                </td>
                                <td class="px-4 md:px-6 py-4">
                                    <div v-if="session.rating" class="flex gap-0.5">
                                        <span v-for="s in 5" :key="s" class="text-sm"
                                            :class="s <= session.rating ? 'text-yellow-400' : 'text-gray-200 dark:text-slate-700'">★</span>
                                    </div>
                                    <span v-else class="text-xs text-gray-400 dark:text-gray-500">—</span>
                                </td>
                                <td
                                    class="px-4 md:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                                    {{
                                    session.messages }}</td>
                                <td
                                    class="px-4 md:px-6 py-4 text-right text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                    {{ formatRelative(session.last_activity) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        <!-- Full Report Modal -->
        <FullReportModal v-if="showFullReport" :report-data="analyticsStore.reportData"
            :loading="analyticsStore.reportLoading" :range="selectedRange" @close="showFullReport = false" />

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { MessageSquare, Star, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-vue-next'
import FullReportModal from '~/components/analytics/FullReportModal.vue'

definePageMeta({ layout: 'dashboard' })

const analyticsStore = useAnalyticsStore()
const selectedRange = ref('7d')
const showFullReport = ref(false)

const dateRanges = [
    { label: '7D', val: '7d' },
    { label: '30D', val: '30d' },
    { label: '90D', val: '90d' },
]

const kpiStats = computed(() => {
    const k = analyticsStore.kpis
    if (!k) return []
    return [
        {
            label: 'Total Conversations',
            value: k.total_conversations,
            icon: MessageSquare,
            trend: k.trend_conversations,
            trendUp: k.trend_conversations >= 0,
            gradient: 'from-purple-500 to-indigo-500',
            isRating: false,
            subLabel: null,
        },
        {
            label: 'Widget Conversations',
            value: k.widget_conversations,
            icon: Users,
            trend: null,
            gradient: 'from-green-500 to-emerald-500',
            isRating: false,
            subLabel: null,
        },
        {
            label: 'Resolution Rate',
            value: k.resolution_rate + '%',
            icon: TrendingUp,
            trend: null,
            gradient: 'from-blue-500 to-cyan-500',
            isRating: false,
            subLabel: null,
        },
        {
            label: 'Avg. Rating',
            value: k.avg_rating !== null ? k.avg_rating + ' / 5' : 'No ratings yet',
            icon: Star,
            trend: null,
            gradient: 'from-yellow-400 to-orange-400',
            isRating: k.avg_rating !== null,
            subLabel: k.rated_count > 0 ? `from ${k.rated_count} rating${k.rated_count === 1 ? '' : 's'}` : null,
        },
    ]
})

const sourcePercent = (val) => {
    const total = analyticsStore.kpis?.total_conversations || 1
    return Math.round((val / total) * 100)
}

const changeRange = async (range) => {
    selectedRange.value = range
    await analyticsStore.fetchAnalytics(range)
}

const openFullReport = async () => {
    showFullReport.value = true
    await analyticsStore.fetchReport(selectedRange.value)
}

const formatRelative = (date) => {
    if (!date) return '—'
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const statusStyles = {
    'Rated': 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
    'Ended': 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700',
    'Handover': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
    'Awaiting': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    'Active': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    'Empty': 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-slate-800/50 dark:text-gray-400 dark:border-slate-700',
}

const statusDot = {
    'Rated': 'bg-yellow-500',
    'Ended': 'bg-gray-400',
    'Handover': 'bg-orange-500',
    'Awaiting': 'bg-blue-500 animate-pulse',
    'Active': 'bg-green-500 animate-pulse',
    'Empty': 'bg-gray-300',
}

onMounted(() => analyticsStore.fetchAnalytics(selectedRange.value))
</script>
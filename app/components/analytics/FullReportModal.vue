<!-- components/analytics/FullReportModal.vue -->
<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            @click.self="$emit('close')">
            <div
                class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-slate-700">

                <!-- Header -->
                <div
                    class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800 shrink-0">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Full Report</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            Detailed analytics for the last {{ rangeLabel }}
                        </p>
                    </div>
                    <button @click="$emit('close')"
                        class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="flex-1 flex items-center justify-center py-16">
                    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9E4CFF]"></div>
                </div>

                <!-- Content -->
                <div v-else-if="reportData" class="flex-1 overflow-y-auto p-6 space-y-8">

                    <!-- ── Summary Row ── -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div v-for="kpi in summaryKpis" :key="kpi.label"
                            class="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ kpi.label }}</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ kpi.value }}</p>
                        </div>
                    </div>

                    <!-- ── Traffic Chart ── -->
                    <div>
                        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">Daily Traffic</h3>
                        <div class="h-48 flex items-end gap-1 md:gap-2 relative">
                            <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                <div v-for="i in 4" :key="i"
                                    class="w-full border-t border-dashed border-gray-100 dark:border-slate-800"></div>
                            </div>
                            <div v-for="(day, idx) in reportData.weekly_traffic" :key="idx"
                                class="relative flex-1 h-full flex flex-col justify-end group/bar">
                                <div class="w-full bg-purple-100 dark:bg-slate-800 rounded-t-sm overflow-hidden"
                                    :style="{ height: `${(day.value / trafficMax) * 100}%` }">
                                    <div
                                        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover/bar:opacity-100 text-[10px] bg-gray-900 text-white px-1.5 py-0.5 rounded whitespace-nowrap z-10 transition-opacity">
                                        {{ day.value }}
                                    </div>
                                    <div class="w-full h-full bg-gradient-to-t from-[#9E4CFF] to-purple-400"></div>
                                </div>
                                <span class="text-[9px] md:text-[10px] text-gray-400 mt-1 text-center truncate">{{
                                    day.label }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- ── Source Trend ── -->
                    <div>
                        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">Widget vs. Test Traffic</h3>
                        <div class="space-y-2">
                            <div v-for="(day, idx) in reportData.source_trend" :key="idx"
                                class="flex items-center gap-3 text-sm">
                                <span
                                    class="w-14 md:w-20 text-[10px] text-gray-500 dark:text-gray-400 shrink-0 text-right">{{
                                    day.label }}</span>
                                <div class="flex-1 flex gap-1 h-5">
                                    <div class="bg-green-400 rounded-sm transition-all duration-700"
                                        :style="{ width: sourceTrendWidth(day.widget) }"
                                        :title="`Widget: ${day.widget}`"></div>
                                    <div class="bg-purple-400 rounded-sm transition-all duration-700"
                                        :style="{ width: sourceTrendWidth(day.test) }" :title="`Test: ${day.test}`">
                                    </div>
                                </div>
                                <span class="text-[10px] text-gray-400 w-10 shrink-0">{{ day.widget + day.test }}</span>
                            </div>
                        </div>
                        <div class="flex gap-4 mt-3">
                            <div class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                                <div class="w-3 h-3 rounded-sm bg-green-400"></div> Widget
                            </div>
                            <div class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                                <div class="w-3 h-3 rounded-sm bg-purple-400"></div> Test
                            </div>
                        </div>
                    </div>

                    <!-- ── Message Distribution ── -->
                    <div>
                        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">Messages per Conversation
                        </h3>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div v-for="bucket in reportData.message_distribution" :key="bucket.bucket"
                                class="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 text-center">
                                <p class="text-2xl font-bold text-[#9E4CFF]">{{ bucket.count }}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ bucket.bucket }} messages
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- ── Hourly Heatmap ── -->
                    <div>
                        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">Activity by Hour (UTC)</h3>
                        <div class="flex flex-wrap gap-1.5">
                            <div v-for="hour in reportData.hourly_distribution" :key="hour.hour"
                                class="group relative flex flex-col items-center">
                                <div class="w-7 h-7 rounded-md transition-colors cursor-default"
                                    :class="hourlyClass(hour.count)"
                                    :title="`${hour.hour}: ${hour.count} conversations`"></div>
                                <span class="text-[8px] text-gray-400 mt-0.5">{{ hour.hour.split(':')[0] }}</span>
                                <div
                                    class="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none transition-opacity">
                                    {{ hour.count }} convos
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ── Chatbot Comparison ── -->
                    <div v-if="reportData.chatbot_comparison?.length">
                        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">Chatbot Performance</h3>
                        <div class="space-y-3">
                            <div v-for="bot in reportData.chatbot_comparison" :key="bot.name" class="group">
                                <div class="flex justify-between items-end mb-1">
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate pr-4">{{
                                        bot.name }}</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white shrink-0">{{ bot.count
                                        }} <span class="text-xs text-gray-400 font-normal">({{ bot.percent
                                            }}%)</span></span>
                                </div>
                                <div class="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                    <div class="h-full rounded-full bg-[#9E4CFF] transition-all duration-700"
                                        :style="{ width: bot.percent + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ── Handover Stats ── -->
                    <div
                        class="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 rounded-xl p-5">
                        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">Human Handover</h3>
                        <div class="flex gap-6">
                            <div>
                                <p class="text-3xl font-bold text-orange-600 dark:text-orange-400">{{
                                    reportData.handover_total }}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total Handovers</p>
                            </div>
                            <div>
                                <p class="text-3xl font-bold text-orange-600 dark:text-orange-400">{{
                                    reportData.handover_rate }}%</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Handover Rate</p>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Footer -->
                <div v-if="!loading"
                    class="px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex justify-end gap-3 shrink-0">
                    <button @click="$emit('close')"
                        class="px-5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
    reportData: { type: Object, default: null },
    loading: { type: Boolean, default: false },
    range: { type: String, default: '7d' },
})

defineEmits(['close'])

const rangeLabel = computed(() => ({
    '7d': '7 days', '30d': '30 days', '90d': '90 days'
}[props.range] ?? props.range))

const summaryKpis = computed(() => {
    if (!props.reportData) return []
    return [
        { label: 'Total Conversations', value: props.reportData.total_conversations },
        { label: 'Handover Rate', value: props.reportData.handover_rate + '%' },
        { label: 'Total Handovers', value: props.reportData.handover_total },
        { label: 'Period', value: rangeLabel.value },
    ]
})

const trafficMax = computed(() => {
    const vals = (props.reportData?.weekly_traffic ?? []).map(d => d.value)
    return vals.length ? Math.max(...vals) * 1.2 || 1 : 1
})

const sourceTrendMax = computed(() => {
    const totals = (props.reportData?.source_trend ?? []).map(d => d.widget + d.test)
    return totals.length ? Math.max(...totals) || 1 : 1
})

const sourceTrendWidth = (val) => {
    return `${Math.round((val / sourceTrendMax.value) * 100)}%`
}

const hourlyClass = (count) => {
    const max = Math.max(...(props.reportData?.hourly_distribution ?? []).map(h => h.count), 1)
    const pct = count / max
    if (pct === 0) return 'bg-gray-100 dark:bg-slate-800'
    if (pct < 0.25) return 'bg-purple-100 dark:bg-purple-900/30'
    if (pct < 0.5) return 'bg-purple-300 dark:bg-purple-700/50'
    if (pct < 0.75) return 'bg-purple-500'
    return 'bg-[#9E4CFF]'
}
</script>
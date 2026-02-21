// stores/analyticsStore.js
import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/authStore'

export const useAnalyticsStore = defineStore('analytics', {
    state: () => ({
        loading: false,
        reportLoading: false,
        range: '7d',
        data: null,       // main dashboard data
        reportData: null, // detailed report modal data
        error: null,
    }),

    actions: {
        async fetchAnalytics(range = '7d') {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()
            this.loading = true
            this.range = range
            this.error = null
            try {
                const response = await $fetch(
                    `${config.public.apiBase}/api/analytics?range=${range}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                this.data = response.data
                return response.data
            } catch (err) {
                this.error = err?.data?.message || 'Failed to load analytics'
                throw err
            } finally {
                this.loading = false
            }
        },

        async fetchReport(range = '7d') {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()
            this.reportLoading = true
            try {
                const response = await $fetch(
                    `${config.public.apiBase}/api/analytics/report?range=${range}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                this.reportData = response.data
                return response.data
            } catch (err) {
                throw err
            } finally {
                this.reportLoading = false
            }
        },
    },

    getters: {
        kpis: (state) => state.data?.kpis ?? null,
        dailyTraffic: (state) => state.data?.daily_traffic ?? [],
        sourceBreakdown: (state) => state.data?.source_breakdown ?? [],
        topChatbots: (state) => state.data?.top_chatbots ?? [],
        recentSessions: (state) => state.data?.recent_sessions ?? [],
        maxChartValue: (state) => {
            const vals = (state.data?.daily_traffic ?? []).map(d => d.value)
            return vals.length ? Math.max(...vals) * 1.2 || 1 : 1
        },
    },
})
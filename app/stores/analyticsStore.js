// stores/analyticsStore.js
import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/authStore'

export const useAnalyticsStore = defineStore('analytics', {
    state: () => ({
        loading: false,
        reportLoading: false,
        topQuestionsLoading: false,
        abLoading: false,
        range: '7d',
        data: null,
        reportData: null,
        topQuestions: [],     // B4 — most asked questions
        abComparison: [],     // B5 — A/B variant comparison
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

        // B4 — Most asked questions
        async fetchTopQuestions(range = '7d') {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()
            this.topQuestionsLoading = true
            try {
                const response = await $fetch(
                    `${config.public.apiBase}/api/analytics/top-questions?range=${range}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                this.topQuestions = response.data ?? []
            } catch {
                this.topQuestions = []
            } finally {
                this.topQuestionsLoading = false
            }
        },

        // B5 — A/B comparison
        async fetchAbComparison(range = '7d') {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()
            this.abLoading = true
            try {
                const response = await $fetch(
                    `${config.public.apiBase}/api/analytics/ab-comparison?range=${range}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                this.abComparison = response.data ?? []
            } catch {
                this.abComparison = []
            } finally {
                this.abLoading = false
            }
        },
    },

    getters: {
        kpis: (state) => state.data?.kpis ?? null,
        dailyTraffic: (state) => state.data?.daily_traffic ?? [],
        sourceBreakdown: (state) => state.data?.source_breakdown ?? [],
        topChatbots: (state) => state.data?.top_chatbots ?? [],
        recentSessions: (state) => state.data?.recent_sessions ?? [],
        hasAbData: (state) => state.abComparison.length >= 2,
        maxChartValue: (state) => {
            const vals = (state.data?.daily_traffic ?? []).map(d => d.value)
            return vals.length ? Math.max(...vals) * 1.2 || 1 : 1
        },
    },
})

// ─── Intelligence Store (Point 5A + 5B) ──────────────────────────────────────

export const useIntelligenceStore = defineStore('intelligence', {
    state: () => ({
        insights: [],
        insightsLoading: false,
        insightsGeneratedAt: null,
        insightsStale: false,
        reports: [],
        reportsLoading: false,
        uploadLoading: false,
        error: null,
    }),

    actions: {
        async fetchInsights() {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()
            this.insightsLoading = true
            this.error = null
            try {
                const response = await $fetch(
                    `${config.public.apiBase}/api/intelligence/insights`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                this.insights = response.data ?? []
                this.insightsGeneratedAt = response.generated_at ?? null
                this.insightsStale = response.stale ?? false
            } catch {
                this.error = 'Failed to load insights'
            } finally {
                this.insightsLoading = false
            }
        },

        async refreshInsights() {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()
            try {
                await $fetch(`${config.public.apiBase}/api/intelligence/insights/generate`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                })
                setTimeout(() => this.fetchInsights(), 8000)
                return true
            } catch { return false }
        },

        async fetchReports(chatbotId = null) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()
            this.reportsLoading = true
            try {
                const qs = chatbotId ? `?chatbot_id=${chatbotId}` : ''
                const response = await $fetch(
                    `${config.public.apiBase}/api/intelligence/reports${qs}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                this.reports = response.data ?? []
            } catch {
                this.reports = []
            } finally {
                this.reportsLoading = false
            }
        },

        async uploadReport(file, name, chatbotId) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()
            this.uploadLoading = true
            try {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('chatbot_id', chatbotId)
                if (name) formData.append('name', name)
                const response = await $fetch(
                    `${config.public.apiBase}/api/intelligence/reports`,
                    { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData }
                )
                if (response.success) await this.fetchReports(chatbotId)
                return response
            } finally {
                this.uploadLoading = false
            }
        },

        async deleteReport(reportId) {
            const config = useRuntimeConfig()
            const { token } = useAuthStore()
            try {
                await $fetch(`${config.public.apiBase}/api/intelligence/reports/${reportId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                })
                this.reports = this.reports.filter(r => r.id !== reportId)
                return true
            } catch { return false }
        },
    },

    getters: {
        okInsights: (state) => state.insights.filter(i => i.status === 'ok'),
        embeddedReports: (state) => state.reports.filter(r => r.status === 'embedded'),
        totalChunks: (state) => state.reports.reduce((s, r) => s + (r.chunks_embedded ?? 0), 0),
    },
})
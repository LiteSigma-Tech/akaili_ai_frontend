<!-- EmailCampaignsTab.vue -->
<template>
    <div class="space-y-6">

        <!-- Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Campaigns</h2>
                <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                    {{ filteredCampaigns.length }} campaign{{ filteredCampaigns.length !== 1 ? 's' : '' }}
                    <span v-if="statusFilter">
                        · filtered by <span class="font-medium">{{ statusFilter }}</span>
                    </span>
                </p>
            </div>

            <div class="flex items-center gap-3">
                <div class="relative">
                    <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
                    </svg>
                    <input v-model="searchQuery" type="text" placeholder="Search..."
                        class="w-48 rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </div>

                <select v-model="statusFilter"
                    class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="sending">Sending</option>
                    <option value="sent">Sent</option>
                    <option value="paused">Paused</option>
                </select>

                <button
                    class="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700"
                    @click="createNewCampaign">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    New Campaign
                </button>
            </div>
        </div>

        <!-- Loading skeletons -->
        <div v-if="emailStore.campaignsLoading" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div v-for="i in 4" :key="i"
                class="animate-pulse rounded-xl border border-gray-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <div class="mb-4 flex items-start justify-between">
                    <div class="flex-1 space-y-2">
                        <div class="h-4 w-2/3 rounded bg-gray-200 dark:bg-slate-700"></div>
                        <div class="h-3 w-1/3 rounded bg-gray-100 dark:bg-slate-800"></div>
                    </div>
                    <div class="h-6 w-16 rounded-full bg-gray-100 dark:bg-slate-800"></div>
                </div>
                <div class="mb-4 grid grid-cols-3 gap-3">
                    <div v-for="j in 3" :key="j" class="h-12 rounded-lg bg-gray-100 dark:bg-slate-800"></div>
                </div>
                <div class="h-8 w-full rounded-lg bg-gray-100 dark:bg-slate-800"></div>
            </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredCampaigns.length === 0"
            class="flex flex-col items-center justify-center py-20 text-center">
            <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-900/20">
                <svg class="h-10 w-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                {{ searchQuery || statusFilter ? 'No campaigns found' : 'Create your first campaign' }}
            </h3>
            <p class="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                {{ searchQuery || statusFilter ? 'Try adjusting your filters' : 'Reach your audience with a targeted email campaign' }}
            </p>
            <button v-if="!searchQuery && !statusFilter"
                class="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
                @click="createNewCampaign">
                Create Campaign
            </button>
        </div>

        <!-- Campaign cards -->
        <div v-else class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div v-for="campaign in filteredCampaigns" :key="campaign.id"
                class="group overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-200 hover:border-purple-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-purple-700/50 dark:hover:shadow-none">

                <!-- Card body -->
                <div class="p-5 pb-4">
                    <div class="mb-3 flex items-start justify-between gap-3">
                        <div class="min-w-0 flex-1">
                            <h3 class="mb-1 truncate text-base font-semibold text-gray-900 dark:text-white">
                                {{ campaign.name }}
                            </h3>
                            <p v-if="campaign.subject" class="truncate text-xs text-gray-400 dark:text-gray-500">
                                ✉ {{ campaign.subject }}
                            </p>
                        </div>

                        <span :class="[
                            'inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                            getStatusStyle(campaign.status).badge
                        ]">
                            <span :class="[
                                'h-1.5 w-1.5 rounded-full',
                                getStatusStyle(campaign.status).dot,
                                campaign.status === 'sending' ? 'animate-pulse' : ''
                            ]"></span>
                            {{ formatStatus(campaign.status) }}
                        </span>
                    </div>

                    <!-- Sending progress -->
                    <div v-if="campaign.status === 'sending' && campaign.stats" class="mb-3">
                        <div class="mb-1.5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Sending in progress…</span>
                            <span>{{ campaign.stats.sent || 0 }} / {{ campaign.stats.total_recipients || '?' }}</span>
                        </div>
                        <div class="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
                            <div class="h-full rounded-full bg-purple-500 transition-all duration-500"
                                :style="{ width: getSendingProgress(campaign) + '%' }"></div>
                        </div>
                    </div>

                    <!-- Stats grid (sent) -->
                    <div v-if="campaign.status === 'sent' && campaign.stats" class="mb-1 grid grid-cols-4 gap-2">
                        <div class="rounded-lg bg-gray-50 p-2.5 text-center dark:bg-slate-800/50">
                            <p class="mb-0.5 text-lg font-bold leading-none text-gray-900 dark:text-white">
                                {{ formatCompact(campaign.stats.sent || 0) }}
                            </p>
                            <p class="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">Sent</p>
                        </div>
                        <div class="rounded-lg bg-blue-50 p-2.5 text-center dark:bg-blue-900/20">
                            <p class="mb-0.5 text-lg font-bold leading-none text-blue-600 dark:text-blue-400">
                                {{ campaign.open_rate || 0 }}%
                            </p>
                            <p class="text-[10px] uppercase tracking-wide text-blue-400 dark:text-blue-500">Opens</p>
                        </div>
                        <div class="rounded-lg bg-green-50 p-2.5 text-center dark:bg-green-900/20">
                            <p class="mb-0.5 text-lg font-bold leading-none text-green-600 dark:text-green-400">
                                {{ campaign.click_rate || 0 }}%
                            </p>
                            <p class="text-[10px] uppercase tracking-wide text-green-400 dark:text-green-500">Clicks</p>
                        </div>
                        <div class="rounded-lg bg-red-50 p-2.5 text-center dark:bg-red-900/20">
                            <p class="mb-0.5 text-lg font-bold leading-none text-red-500 dark:text-red-400">
                                {{ campaign.bounce_rate || 0 }}%
                            </p>
                            <p class="text-[10px] uppercase tracking-wide text-red-400 dark:text-red-500">Bounced</p>
                        </div>
                    </div>

                    <!-- Draft/scheduled metadata -->
                    <div v-if="campaign.status !== 'sent'"
                        class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400 dark:text-gray-500">
                        <span v-if="campaign.list_name" class="flex items-center gap-1">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {{ campaign.list_name }}
                        </span>
                        <span v-if="campaign.send_date" class="flex items-center gap-1">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {{ campaign.status === 'scheduled' ? 'Sends ' : '' }}{{ formatDate(campaign.send_date) }}
                        </span>
                        <span class="flex items-center gap-1">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {{ formatDateRelative(campaign.created_at) }}
                        </span>
                    </div>

                    <!-- Incomplete warning -->
                    <div v-if="campaign.status === 'draft' && campaign.missing_fields?.length"
                        class="mt-2.5 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                        <svg class="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Missing: {{ campaign.missing_fields.join(', ') }}
                    </div>
                </div>

                <!-- Card footer -->
                <div
                    class="flex items-center justify-between gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/30">
                    <div class="flex items-center gap-2">
                        <button v-if="campaign.can_send && campaign.status !== 'scheduled'"
                            class="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                            :disabled="actionLoading[campaign.id]" @click="confirmAction('send', campaign)">
                            <svg v-if="!actionLoading[campaign.id]" class="h-3.5 w-3.5" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <svg v-else class="h-3.5 w-3.5 animate-spin" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {{ actionLoading[campaign.id] ? 'Sending…' : 'Send Now' }}
                        </button>

                        <button v-if="campaign.status === 'sending'"
                            class="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
                            :disabled="actionLoading[campaign.id]" @click="pauseCampaign(campaign)">
                            <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                            Pause
                        </button>

                        <button v-if="campaign.status === 'paused'"
                            class="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                            :disabled="actionLoading[campaign.id]" @click="resumeCampaign(campaign)">
                            <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Resume
                        </button>

                        <button v-if="campaign.status === 'sent'"
                            class="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-purple-700"
                            @click="viewAnalytics(campaign)">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Analytics
                        </button>
                    </div>

                    <div class="flex items-center gap-1">
                        <button v-if="campaign.can_edit"
                            class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-slate-800 dark:hover:text-gray-200"
                            title="Edit campaign" @click="editCampaign(campaign)">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>

                        <button
                            class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-slate-800 dark:hover:text-gray-200"
                            title="Duplicate campaign" @click="duplicateCampaign(campaign)">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>

                        <button v-if="campaign.can_edit"
                            class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            :disabled="actionLoading[campaign.id]" title="Delete campaign"
                            @click="confirmAction('delete', campaign)">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Modals ──────────────────────────────────────────────────────── -->
        <CampaignEditorModal v-if="showEditorModal" :campaign="selectedCampaign" @close="closeEditor"
            @saved="handleCampaignSaved" />

        <CampaignAnalyticsModal v-if="showAnalyticsModal" :campaign="selectedCampaign"
            @close="showAnalyticsModal = false" />

        <!-- ── Confirmation Dialog (replaces browser confirm()) ───────────── -->
        <Teleport to="body">
            <div v-if="confirmDialog.show"
                class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                <div class="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
                    <div class="p-6">
                        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                            :class="confirmDialog.type === 'delete' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'">
                            <svg v-if="confirmDialog.type === 'delete'" class="h-6 w-6 text-red-600 dark:text-red-400"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <svg v-else class="h-6 w-6 text-green-600 dark:text-green-400" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                        <h3 class="mb-1 text-base font-bold text-gray-900 dark:text-white">{{ confirmDialog.title }}
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ confirmDialog.message }}</p>
                    </div>
                    <div
                        class="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
                        <button
                            class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
                            @click="confirmDialog.show = false">
                            Cancel
                        </button>
                        <button :class="[
                            'rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors',
                            confirmDialog.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                        ]" @click="executeConfirmedAction">
                            {{ confirmDialog.confirmLabel }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import CampaignEditorModal from './CampaignEditorModal.vue'
import CampaignAnalyticsModal from './CampaignAnalyticsModal.vue'
import { useToast } from 'vue-toastification'

const emailStore = useEmailMarketingStore()
const $toast = useToast()

const searchQuery = ref('')
const statusFilter = ref('')
const showEditorModal = ref(false)
const showAnalyticsModal = ref(false)
const selectedCampaign = ref(null)
const actionLoading = reactive({})

// ── Confirmation dialog state ────────────────────────────────────────────────
const confirmDialog = reactive({
    show: false,
    type: 'send',   // 'send' | 'delete'
    title: '',
    message: '',
    confirmLabel: '',
    campaign: null,
})

const confirmAction = (type, campaign) => {
    confirmDialog.campaign = campaign
    confirmDialog.type = type
    confirmDialog.show = true

    if (type === 'send') {
        const count = campaign.stats?.total_recipients
            || campaign.list_name
            || 'your list'
        confirmDialog.title = `Send "${campaign.name}"?`
        confirmDialog.message = `This will immediately dispatch emails to ${typeof count === 'number' ? count + ' recipients on' : ''} ${typeof count === 'string' ? count : ''}. This action cannot be undone.`
        confirmDialog.confirmLabel = 'Send Campaign'
    } else {
        confirmDialog.title = `Delete "${campaign.name}"?`
        confirmDialog.message = 'This campaign and all its data will be permanently removed. This cannot be undone.'
        confirmDialog.confirmLabel = 'Delete'
    }
}

const executeConfirmedAction = async () => {
    const campaign = confirmDialog.campaign
    confirmDialog.show = false

    if (confirmDialog.type === 'send') {
        await sendCampaign(campaign)
    } else {
        await deleteCampaign(campaign)
    }
}

// ── Computed ─────────────────────────────────────────────────────────────────

const filteredCampaigns = computed(() => {
    let campaigns = emailStore.campaigns || []
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        campaigns = campaigns.filter(
            (c) =>
                c.name?.toLowerCase().includes(q) ||
                c.description?.toLowerCase().includes(q) ||
                c.subject?.toLowerCase().includes(q)
        )
    }
    if (statusFilter.value) {
        campaigns = campaigns.filter((c) => c.status === statusFilter.value)
    }
    return campaigns
})

// ── Status helpers ────────────────────────────────────────────────────────────

const getStatusStyle = (status) => {
    const styles = {
        draft: { badge: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400', dot: 'bg-gray-400' },
        scheduled: { badge: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
        sending: { badge: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', dot: 'bg-purple-500' },
        sent: { badge: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400', dot: 'bg-green-500' },
        paused: { badge: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' },
        failed: { badge: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
    }
    return styles[status] || styles.draft
}

const formatStatus = (s) =>
    ({ draft: 'Draft', scheduled: 'Scheduled', sending: 'Sending', sent: 'Sent', paused: 'Paused', failed: 'Failed' }[s] || s)

const getSendingProgress = (campaign) => {
    if (!campaign.stats) return 0
    const sent = campaign.stats.sent || 0
    const total = campaign.stats.total_recipients || 1
    return Math.min(Math.round((sent / total) * 100), 100)
}

const formatDate = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatDateRelative = (d) => {
    if (!d) return ''
    const diff = Date.now() - new Date(d).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatCompact = (n) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
    return n.toString()
}

// ── Actions ───────────────────────────────────────────────────────────────────

const createNewCampaign = () => { selectedCampaign.value = null; showEditorModal.value = true }
const editCampaign = (campaign) => { selectedCampaign.value = campaign; showEditorModal.value = true }
const closeEditor = () => { showEditorModal.value = false; selectedCampaign.value = null }
const viewAnalytics = (campaign) => { selectedCampaign.value = campaign; showAnalyticsModal.value = true }

const handleCampaignSaved = async () => {
    closeEditor()
    await emailStore.fetchCampaigns()
    $toast.success('Campaign saved successfully')
}

const sendCampaign = async (campaign) => {
    actionLoading[campaign.id] = true
    try {
        await emailStore.sendCampaign(campaign.id)
        $toast.success('Campaign is being sent!')
    } catch (err) {
        const msg = err?.data?.message || 'Failed to send campaign'
        $toast.error(msg)
    } finally {
        actionLoading[campaign.id] = false
    }
}

const pauseCampaign = async (campaign) => {
    actionLoading[campaign.id] = true
    try {
        await emailStore.pauseCampaign(campaign.id)
        $toast.success('Campaign paused')
    } catch {
        $toast.error('Failed to pause campaign')
    } finally {
        actionLoading[campaign.id] = false
    }
}

const resumeCampaign = async (campaign) => {
    actionLoading[campaign.id] = true
    try {
        await emailStore.resumeCampaign(campaign.id)
        $toast.success('Campaign resumed')
    } catch {
        $toast.error('Failed to resume campaign')
    } finally {
        actionLoading[campaign.id] = false
    }
}

const duplicateCampaign = async (campaign) => {
    try {
        await emailStore.duplicateCampaign(campaign.id)
        $toast.success('Campaign duplicated')
    } catch {
        $toast.error('Failed to duplicate campaign')
    }
}

const deleteCampaign = async (campaign) => {
    actionLoading[campaign.id] = true
    try {
        await emailStore.deleteCampaign(campaign.id)
        $toast.success('Campaign deleted')
    } catch {
        $toast.error('Failed to delete campaign')
    } finally {
        actionLoading[campaign.id] = false
    }
}
</script>
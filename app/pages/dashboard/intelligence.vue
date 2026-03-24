<!-- pages/dashboard/intelligence.vue -->
<template>
    <div
        class="flex h-[100dvh] flex-col overflow-hidden bg-white font-sans selection:bg-purple-500/30 dark:bg-slate-950">

        <!-- ══════════════════════════════════════
         DESKTOP HEADER
    ══════════════════════════════════════ -->
        <div
            class="hidden shrink-0 border-b border-gray-200 bg-gray-50 p-6 dark:border-slate-800 dark:bg-slate-950 md:block">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600">
                        <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-2xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">
                            Digital Brain
                        </h1>
                        <p class="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Query your business data in plain English — full internal access
                        </p>
                    </div>
                </div>

                <!-- Active bot chip -->
                <div v-if="selectedChatbot"
                    class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div class="flex items-center gap-2">
                        <span class="h-2 w-2 rounded-full"
                            :class="selectedChatbot.is_active ? 'bg-green-500' : 'bg-yellow-400'"></span>
                        <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ selectedChatbot.name
                            }}</span>
                    </div>
                    <div class="h-4 w-px bg-gray-200 dark:bg-slate-700"></div>
                    <span class="text-xs font-medium text-purple-600 dark:text-purple-400">
                        {{ connectedDatabases }} source{{ connectedDatabases !== 1 ? 's' : '' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- ══════════════════════════════════════
         MOBILE TOP BAR
    ══════════════════════════════════════ -->
        <header
            class="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 md:hidden">
            <button class="-ml-2 p-2 text-slate-500 transition-transform active:scale-90 dark:text-slate-400"
                @click="mobilePanel = 'prompts'">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <button class="flex max-w-[200px] flex-col items-center group" @click="mobilePanel = 'settings'">
                <div class="flex items-center gap-1.5">
                    <svg class="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span class="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {{ selectedChatbot?.name || 'Digital Brain' }}
                    </span>
                    <svg class="h-3.5 w-3.5 text-slate-400 group-hover:text-purple-500 transition-colors" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <span class="text-[9px] font-black uppercase tracking-[0.2em] text-purple-500">
                    Internal · {{ connectedDatabases }} Sources
                </span>
            </button>

            <button class="-mr-2 p-2 text-slate-500 transition-transform active:scale-90 dark:text-slate-400"
                @click="resetChat">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </header>

        <!-- ══════════════════════════════════════
         MAIN LAYOUT
    ══════════════════════════════════════ -->
        <div class="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden md:flex-row md:gap-6 md:p-6">

            <!-- LEFT SIDEBAR -->
            <aside class="hidden w-72 shrink-0 flex-col gap-4 overflow-y-auto md:flex no-scrollbar">

                <!-- Agent selector -->
                <div
                    class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <label class="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-400">Active
                        Agent</label>
                    <select v-model="selectedChatbotId"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        @change="resetChat">
                        <option v-for="bot in availableChatbots" :key="bot.id" :value="bot.id">
                            {{ bot.name }}
                        </option>
                    </select>

                    <div v-if="connectedDatabases > 0"
                        class="mt-3 flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 dark:bg-purple-900/20">
                        <svg class="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582 4-8 4" />
                        </svg>
                        <span class="text-xs font-semibold text-purple-700 dark:text-purple-300">
                            {{ connectedDatabases }} connected database{{ connectedDatabases !== 1 ? 's' : '' }}
                        </span>
                    </div>
                    <div v-else
                        class="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-900/20">
                        <svg class="h-3.5 w-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
                        </svg>
                        <span class="text-xs font-medium text-amber-700 dark:text-amber-300">No database connected
                            yet</span>
                    </div>
                </div>

                <!-- Suggested prompts by category -->
                <div
                    class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div class="shrink-0 border-b border-gray-100 px-4 py-3 dark:border-slate-800">
                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Suggested
                            Queries</span>
                    </div>
                    <div class="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
                        <div v-for="category in promptCategories" :key="category.label">
                            <p
                                class="mb-1.5 flex items-center gap-1.5 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {{ category.icon }} {{ category.label }}
                            </p>
                            <div class="space-y-1">
                                <button v-for="prompt in category.prompts" :key="prompt"
                                    class="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 transition-colors hover:bg-purple-50 hover:text-purple-700 dark:text-slate-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"
                                    @click="usePrompt(prompt)">
                                    {{ prompt }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- ══════════════════════════════════════
           MAIN CHAT AREA
      ══════════════════════════════════════ -->
            <div
                class="relative flex flex-1 flex-col overflow-hidden border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:rounded-2xl">

                <!-- Empty — no chatbot yet -->
                <div v-if="!selectedChatbotId"
                    class="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                    <div
                        class="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/30">
                        <svg class="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">No agent selected</h3>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Select an agent from the sidebar to
                            start querying your business data.</p>
                    </div>
                    <NuxtLink to="/dashboard/chatbot-setup"
                        class="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700">
                        Set up an agent
                    </NuxtLink>
                </div>

                <!-- ChatWidget — no testMode prop passed = stays 'default' → user_type=internal -->
                <ChatWidget v-else ref="chatWidgetRef" :key="widgetKey" :chatbot-id="selectedChatbotId"
                    :chatbot-name="selectedChatbot?.name || 'Digital Brain'" :restore-session="sessionToRestore"
                    :fluid="true" class="h-full w-full" @session-saved="onSessionSaved" />

                <!-- Internal mode badge -->
                <div v-if="selectedChatbotId" class="pointer-events-none absolute right-3 top-[4.5rem] z-10">
                    <span
                        class="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                        <span class="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                        Internal · Full Access
                    </span>
                </div>
            </div>

            <!-- RIGHT SIDEBAR — session history (desktop lg+) -->
            <aside v-if="sessionHistory.length > 0"
                class="hidden w-56 shrink-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex">
                <div
                    class="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-slate-800">
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Sessions</span>
                    <button class="text-[9px] font-black uppercase text-purple-600 hover:underline dark:text-purple-400"
                        @click="loadSessionHistory">
                        Refresh
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800 no-scrollbar">
                    <button v-for="session in sessionHistory" :key="session.session_id"
                        class="w-full px-4 py-3 text-left transition-colors" :class="activeSessionId === session.session_id
                                ? 'border-r-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'
                            " @click="restoreSession(session)">
                        <p
                            class="mb-0.5 truncate text-xs font-semibold leading-tight text-slate-900 dark:text-slate-100">
                            {{ session.preview || 'Analytics session' }}
                        </p>
                        <span class="text-[10px] font-medium uppercase tracking-tighter text-gray-400">
                            {{ formatRelative(session.last_activity) }}
                        </span>
                    </button>
                </div>
            </aside>
        </div>

        <!-- ══════════════════════════════════════
         BOTTOM INFO BAR (Desktop)
    ══════════════════════════════════════ -->
        <div
            class="hidden shrink-0 border-t border-gray-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50 md:block">
            <div class="mx-auto flex max-w-7xl items-center justify-between">
                <div class="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-[11px] font-black uppercase tracking-widest">Internal Mode — Full Data
                        Access</span>
                </div>
                <ul class="flex items-center gap-8 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <li>• Ask for trends, comparisons, and growth rates</li>
                    <li>• "Top 10 customers by revenue last quarter"</li>
                    <li>• "Which product had the highest return rate?"</li>
                    <li>• Responses include BI insights, not just raw numbers</li>
                </ul>
            </div>
        </div>

        <!-- ══════════════════════════════════════
         MOBILE: AGENT SELECTOR SHEET
    ══════════════════════════════════════ -->
        <Teleport to="body">
            <Transition name="sheet">
                <div v-if="mobilePanel === 'settings'"
                    class="fixed inset-0 z-50 flex items-end justify-center md:hidden">
                    <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="mobilePanel = null"></div>
                    <div
                        class="relative flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-t-[32px] bg-white p-6 shadow-2xl dark:bg-slate-900 no-scrollbar">
                        <div class="mx-auto mb-8 h-1 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                        <h3 class="mb-6 text-xl font-black uppercase italic tracking-tighter dark:text-white">Select
                            Agent</h3>
                        <div class="space-y-2">
                            <button v-for="bot in availableChatbots" :key="bot.id"
                                class="w-full rounded-2xl border-2 px-5 py-4 text-left transition-all" :class="selectedChatbotId === bot.id
                                        ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                                        : 'border-slate-100 dark:border-slate-800 dark:text-white'
                                    " @click="selectedChatbotId = bot.id; resetChat(); mobilePanel = null">
                                <div class="flex items-center justify-between">
                                    <span class="font-bold">{{ bot.name }}</span>
                                    <div v-if="selectedChatbotId === bot.id" class="h-2 w-2 rounded-full bg-purple-500">
                                    </div>
                                </div>
                                <p class="mt-1 text-xs text-slate-400">{{ bot.is_active ? 'Active' : 'Inactive' }}</p>
                            </button>
                        </div>
                        <button
                            class="mt-8 w-full rounded-2xl bg-slate-950 py-5 text-xs font-black uppercase tracking-widest text-white dark:bg-white dark:text-slate-950"
                            @click="mobilePanel = null">
                            Done
                        </button>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- ══════════════════════════════════════
         MOBILE: SUGGESTED PROMPTS SHEET
    ══════════════════════════════════════ -->
        <Teleport to="body">
            <Transition name="sheet-left">
                <div v-if="mobilePanel === 'prompts'" class="fixed inset-0 z-50 flex md:hidden">
                    <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="mobilePanel = null"></div>
                    <div
                        class="relative flex h-full w-[85%] max-w-[320px] flex-col bg-white shadow-2xl dark:bg-slate-900">
                        <div
                            class="flex shrink-0 items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                            <h3 class="text-lg font-black uppercase italic tracking-tighter dark:text-white">Suggested
                                Queries</h3>
                            <button class="rounded-full bg-slate-50 p-2 dark:bg-slate-800" @click="mobilePanel = null">
                                <svg class="h-4 w-4 dark:text-white" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
                            <div v-for="category in promptCategories" :key="category.label">
                                <p
                                    class="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {{ category.icon }} {{ category.label }}
                                </p>
                                <div class="space-y-1.5">
                                    <button v-for="prompt in category.prompts" :key="prompt"
                                        class="w-full rounded-xl border border-slate-100 px-4 py-3 text-left text-xs font-medium text-slate-600 transition-colors active:bg-purple-50 dark:border-slate-800 dark:text-slate-400"
                                        @click="usePrompt(prompt); mobilePanel = null">
                                        {{ prompt }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ChatWidget from '~/components/chatbot-setup/ChatWidget.vue'

definePageMeta({ layout: 'dashboard' })

// ── Stores & composables ──────────────────────────────────
const chatbotStore = useChatbotStore()
const databaseStore = useDatabaseStore()
const { token } = useAuthStore()
const config = useRuntimeConfig()

// ── State ─────────────────────────────────────────────────
const selectedChatbotId = ref('')
const mobilePanel = ref(null)
const widgetKey = ref(0)
const chatWidgetRef = ref(null)
const sessionToRestore = ref(null)
const sessionHistory = ref([])
const historyLoading = ref(false)
const activeSessionId = ref(null)

// ── Computed ──────────────────────────────────────────────
const availableChatbots = computed(() => chatbotStore.chatbots || [])

const selectedChatbot = computed(() =>
    availableChatbots.value.find((b) => b.id === selectedChatbotId.value) || null
)

const connectedDatabases = computed(() =>
    databaseStore.connections?.filter((c) => c.status === 'connected').length || 0
)

// ── Suggested prompts ─────────────────────────────────────
// Clicking a prompt fills the ChatWidget input via the exposed setMessage() method.
// ChatWidget.vue must have `setMessage` in defineExpose (see ChatWidget patch).
const promptCategories = [
    {
        label: 'Sales & Revenue',
        icon: '📈',
        prompts: [
            'What was our total revenue last month?',
            'Show me our top 10 customers by revenue',
            'Which product category grew the most this quarter?',
            'Compare this month\'s sales to last month',
        ],
    },
    {
        label: 'Operations',
        icon: '⚙️',
        prompts: [
            'What are our most common support issues?',
            'Which orders have been pending the longest?',
            'Show me unfulfilled orders from the past 7 days',
            'What is our average order fulfillment time?',
        ],
    },
    {
        label: 'Customers',
        icon: '👥',
        prompts: [
            'How many new customers did we get this month?',
            'Which customers haven\'t ordered in 90 days?',
            'What is our customer retention rate?',
            'Show me customers with the highest lifetime value',
        ],
    },
    {
        label: 'Products',
        icon: '📦',
        prompts: [
            'Which products are running low on stock?',
            'What is our best-selling product this week?',
            'Show me products with the highest return rate',
            'Which items have never been ordered?',
        ],
    },
]

// ── Prompt injection via exposed method ────────────────────
const usePrompt = (prompt) => {
    chatWidgetRef.value?.setMessage(prompt)
}

// ── Session management ────────────────────────────────────
const loadSessionHistory = async () => {
    if (!selectedChatbotId.value) return
    historyLoading.value = true
    try {
        const data = await $fetch(
            `${config.public.apiBase}/api/conversation/test-sessions?chatbot_id=${selectedChatbotId.value}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        sessionHistory.value = data.data?.sessions ?? []
    } catch {
        sessionHistory.value = []
    } finally {
        historyLoading.value = false
    }
}

const restoreSession = (session) => {
    activeSessionId.value = session.session_id
    sessionToRestore.value = session
    widgetKey.value++
}

const resetChat = () => {
    sessionToRestore.value = null
    activeSessionId.value = null
    widgetKey.value++
    loadSessionHistory()
}

const onSessionSaved = (info) => {
    const existing = sessionHistory.value.find((s) => s.session_id === info.sessionId)
    if (existing) {
        existing.message_count = info.messageCount
        existing.preview = info.preview
        existing.last_activity = new Date().toISOString()
    } else {
        sessionHistory.value.unshift({
            session_id: info.sessionId,
            preview: info.preview,
            last_activity: new Date().toISOString(),
            chatbot_id: selectedChatbotId.value,
        })
    }
    activeSessionId.value = info.sessionId
}

const formatRelative = (dateStr) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    return hrs < 24
        ? `${hrs}h ago`
        : new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

// ── Lifecycle ─────────────────────────────────────────────
onMounted(async () => {
    await Promise.all([
        chatbotStore.fetchChatbots(),
        databaseStore.fetchConnections(),
    ])
    if (availableChatbots.value.length > 0) {
        selectedChatbotId.value = availableChatbots.value[0].id
        await loadSessionHistory()
    }
})

watch(selectedChatbotId, (newId) => {
    if (newId) loadSessionHistory()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.sheet-enter-active,
.sheet-leave-active,
.sheet-left-enter-active,
.sheet-left-leave-active {
    transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.sheet-enter-from,
.sheet-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

.sheet-left-enter-from,
.sheet-left-leave-to {
    transform: translateX(-100%);
}
</style>
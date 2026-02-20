<!-- pages/dashboard/test-chat.vue -->
<template>
    <div class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 p-6">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Test Your Chatbot</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">
                Test your AI assistant here to see how it responds to questions based on your connected data.
            </p>
        </div>

        <!-- Loading -->
        <div v-if="chatbotStore.loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9E4CFF]"></div>
            <span class="ml-2 text-gray-600 dark:text-gray-400">Loading chatbots...</span>
        </div>

        <!-- No Chatbots -->
        <div v-else-if="availableChatbots.length === 0" class="text-center py-12">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-lg mx-auto">
                <h3 class="text-lg font-medium text-yellow-800 mb-2">No Chatbots Found</h3>
                <p class="text-yellow-700 mb-4">You need to create a chatbot first before you can test it here.</p>
                <NuxtLink to="/dashboard/chatbot-setup"
                    class="inline-flex items-center px-4 py-2 bg-[#9E4CFF] text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Create Your First Chatbot
                </NuxtLink>
            </div>
        </div>

        <!-- Main Layout -->
        <div v-else class="flex gap-6 max-w-7xl mx-auto">

            <!-- ══════════════════════════════════
                 LEFT: History Sidebar
                 ══════════════════════════════════ -->
            <div class="w-72 shrink-0 flex flex-col gap-4">

                <!-- Chatbot + Mode selectors -->
                <div
                    class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div>
                        <label
                            class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Chatbot</label>
                        <select v-model="selectedChatbotId" @change="onChatbotChange"
                            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
                            <option v-for="chatbot in availableChatbots" :key="chatbot.id" :value="chatbot.id">
                                {{ chatbot.name }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label
                            class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Test
                            Mode</label>
                        <select v-model="testMode"
                            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
                            <option value="default">Default (As You)</option>
                            <option value="authenticated">Simulate Customer</option>
                            <option value="anonymous">Simulate Anonymous</option>
                        </select>
                        <!-- Customer data inputs -->
                        <div v-if="testMode === 'authenticated'"
                            class="mt-3 space-y-2 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700">
                            <input v-model="testCustomerData.id" type="text" placeholder="Customer ID"
                                class="w-full px-2.5 py-1.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-purple-500" />
                            <input v-model="testCustomerData.name" type="text" placeholder="Customer Name"
                                class="w-full px-2.5 py-1.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-purple-500" />
                            <input v-model="testCustomerData.email" type="email" placeholder="Customer Email"
                                class="w-full px-2.5 py-1.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-purple-500" />
                        </div>
                    </div>
                </div>

                <!-- Status mini-cards -->
                <div class="grid grid-cols-1 gap-2">
                    <div
                        class="bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 border-l-4 border-l-blue-500 shadow-sm">
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Status</p>
                        <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                            {{ selectedChatbot?.is_active ? '✅ Active' : '⚠️ Inactive' }}
                        </p>
                    </div>
                    <div
                        class="bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 border-l-4 border-l-green-500 shadow-sm">
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Data Sources</p>
                        <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{{ connectedDatabases }}
                            connected</p>
                    </div>
                </div>

                <!-- Session History (last 24h) -->
                <div
                    class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden flex-1">
                    <div
                        class="px-4 py-3 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 class="text-sm font-bold text-gray-900 dark:text-white">Session History</h3>
                        <span class="text-[10px] text-gray-400 bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Last
                            24h</span>
                    </div>

                    <!-- Loading sessions -->
                    <div v-if="historyLoading" class="p-4 flex items-center gap-2 text-xs text-gray-400">
                        <div
                            class="animate-spin w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full">
                        </div>
                        Loading sessions...
                    </div>

                    <!-- Empty -->
                    <div v-else-if="sessionHistory.length === 0" class="p-4 text-center">
                        <p class="text-xs text-gray-400 dark:text-gray-500">No past sessions in the last 24 hours.</p>
                        <p class="text-[10px] text-gray-300 dark:text-gray-600 mt-1">Start a conversation to see history
                            here.</p>
                    </div>

                    <!-- Session list -->
                    <div v-else class="divide-y divide-gray-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
                        <button v-for="session in sessionHistory" :key="session.session_id"
                            @click="restoreSession(session)" :class="[
                                'w-full text-left px-4 py-3 transition-colors',
                                activeSessionId === session.session_id
                                    ? 'bg-purple-50 dark:bg-purple-900/20'
                                    : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'
                            ]">
                            <p class="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{{
                                session.preview || 'Empty session' }}</p>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-[10px] text-gray-400">{{ session.message_count }} msgs</span>
                                <span class="text-[10px] text-gray-400">{{ formatRelative(session.last_activity)
                                    }}</span>
                            </div>
                        </button>
                    </div>

                    <div class="px-4 py-3 border-t border-gray-100 dark:border-slate-800">
                        <button @click="loadSessionHistory"
                            class="text-xs text-[#9E4CFF] dark:text-purple-400 font-semibold hover:underline">
                            Refresh history
                        </button>
                    </div>
                </div>
            </div>

            <!-- ══════════════════════════════════
                 RIGHT: Chat Widget
                 ══════════════════════════════════ -->
            <div class="flex-1 min-w-0">
                <ChatWidget v-if="selectedChatbotId" ref="chatWidgetRef" :key="widgetKey"
                    :chatbot-id="selectedChatbotId" :chatbot-name="selectedChatbot?.name || 'AI Assistant'"
                    :test-mode="testMode" :test-customer-data="testMode === 'authenticated' ? testCustomerData : null"
                    :restore-session="sessionToRestore" @session-saved="onSessionSaved" />
            </div>
        </div>

        <!-- Tips section -->
        <div
            class="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-6 mt-8 max-w-7xl mx-auto">
            <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">💡 Testing Tips</h3>
            <ul class="text-sm text-blue-800 dark:text-blue-400 space-y-2">
                <li>• Ask questions related to your connected database data</li>
                <li>• Try follow-up questions to test conversation memory</li>
                <li>• Check if sources are properly cited in responses</li>
                <li>• Sessions are automatically saved for 24 hours — use the history panel to resume them</li>
                <li>• Click any past session in the sidebar to restore it</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ChatWidget from '~/components/chatbot-setup/ChatWidget.vue'

definePageMeta({ layout: 'dashboard' })

const chatbotStore = useChatbotStore()
const databaseStore = useDatabaseStore()
const conversationStore = useConversationStore()
const { token } = useAuthStore()
const config = useRuntimeConfig()

const selectedChatbotId = ref('')
const testMode = ref('default')
const testCustomerData = ref({ id: '', name: '', email: '' })

const sessionHistory = ref([])
const historyLoading = ref(false)
const activeSessionId = ref(null)
const sessionToRestore = ref(null)
const widgetKey = ref(0)   // bump to remount ChatWidget on session restore
const chatWidgetRef = ref(null)

const availableChatbots = computed(() => chatbotStore.chatbots || [])
const selectedChatbot = computed(() => availableChatbots.value.find(b => b.id === selectedChatbotId.value))
const connectedDatabases = computed(() => databaseStore.connections?.filter(c => c.status === 'connected').length || 0)

// ── Load session history from backend ──
const loadSessionHistory = async () => {
    if (!selectedChatbotId.value) return
    historyLoading.value = true
    try {
        const data = await $fetch(
            `${config.public.apiBase}/api/conversation/test-sessions?chatbot_id=${selectedChatbotId.value}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        sessionHistory.value = data.data?.sessions ?? []
    } catch (e) {
        console.error('Failed to load session history', e)
        sessionHistory.value = []
    } finally {
        historyLoading.value = false
    }
}

// ── Restore a past session into the chat widget ──
const restoreSession = (session) => {
    activeSessionId.value = session.session_id
    sessionToRestore.value = session  // passes to ChatWidget via prop
    widgetKey.value++                 // forces remount with fresh state
}

// ── When chatbot changes, reload history and reset widget ──
const onChatbotChange = () => {
    sessionToRestore.value = null
    activeSessionId.value = null
    widgetKey.value++
    loadSessionHistory()
}

// ── When ChatWidget emits a new save, refresh the history list ──
const onSessionSaved = async (info) => {
    // Optimistically update/add entry in local list
    const existing = sessionHistory.value.find(s => s.session_id === info.sessionId)
    if (existing) {
        existing.message_count = info.messageCount
        existing.preview = info.preview
        existing.last_activity = new Date().toISOString()
    } else {
        sessionHistory.value.unshift({
            session_id: info.sessionId,
            conversation_id: info.conversationId,
            message_count: info.messageCount,
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
    return hrs < 24 ? `${hrs}h ago` : new Date(dateStr).toLocaleDateString()
}

const autoSelectChatbot = () => {
    if (availableChatbots.value.length > 0 && !selectedChatbotId.value) {
        selectedChatbotId.value = availableChatbots.value[0].id
    }
}

onMounted(async () => {
    try {
        await Promise.all([
            chatbotStore.fetchChatbots(),
            databaseStore.fetchConnections()
        ])
        autoSelectChatbot()
        if (selectedChatbotId.value) {
            await loadSessionHistory()
        }
    } catch (error) {
        console.error('Error loading data:', error)
    }
})

// Reload history when chatbot selection changes (without clicking the select)
watch(selectedChatbotId, (newId) => {
    if (newId) loadSessionHistory()
})
</script>
<template>
    <div class="h-[100dvh] bg-white dark:bg-slate-950 flex flex-col overflow-hidden selection:bg-purple-500/30 font-sans">
        
        <!-- ══════════════════════════════════
             DESKTOP HEADER
             ══════════════════════════════════ -->
        <div class="hidden md:block p-6 bg-gray-50 dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 shrink-0">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white uppercase italic tracking-tighter">Test Sandbox</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1 text-sm">Validate neural responses and database citations in a secure environment.</p>
        </div>

        <!-- ══════════════════════════════════
             MOBILE TOP BAR (OpenAI Inspired)
             ══════════════════════════════════ -->
        <header class="md:hidden sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 px-4 h-14 flex items-center justify-between shrink-0">
            <!-- Left: History Toggle -->
            <button @click="mobilePanel = 'history'" class="p-2 -ml-2 text-slate-500 dark:text-slate-400 active:scale-90 transition-transform">
                <HistoryIcon class="w-5 h-5" />
            </button>

            <!-- Center: Bot & Status Switcher -->
            <button @click="mobilePanel = 'settings'" class="flex flex-col items-center max-w-[200px] group">
                <div class="flex items-center gap-1.5">
                    <span class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ selectedChatbot?.name || 'Select Bot' }}</span>
                    <ChevronDown class="w-3.5 h-3.5 text-slate-400 group-hover:text-[#9E4CFF] transition-colors" />
                </div>
                <div class="flex items-center gap-1">
                    <div :class="selectedChatbot?.is_active ? 'bg-green-500' : 'bg-yellow-500'" class="w-1 h-1 rounded-full"></div>
                    <span class="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {{ selectedChatbot?.is_active ? 'Active' : 'Offline' }} • {{ connectedDatabases }} Sources
                    </span>
                </div>
            </button>

            <!-- Right: Reset Chat -->
            <button @click="onChatbotChange" class="p-2 -mr-2 text-slate-500 dark:text-slate-400 active:scale-90 transition-transform">
                <PlusIcon class="w-5 h-5" />
            </button>
        </header>

        <!-- Main Layout Wrapper -->
        <div class="flex-1 flex flex-col md:flex-row md:gap-6 md:p-6 max-w-7xl mx-auto w-full min-h-0 overflow-hidden">

            <!-- ══════════════════════════════════
                 LEFT SIDEBAR (Desktop Only)
                 ══════════════════════════════════ -->
            <aside class="hidden md:flex w-72 shrink-0 flex-col gap-4 overflow-y-auto no-scrollbar">
                <!-- Configuration -->
                <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div>
                        <label class="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Target Agent</label>
                        <select v-model="selectedChatbotId" @change="onChatbotChange" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
                            <option v-for="bot in availableChatbots" :key="bot.id" :value="bot.id">{{ bot.name }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Environment Mode</label>
                        <select v-model="testMode" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg outline-none">
                            <option value="default">Default (Admin)</option>
                            <option value="authenticated">Simulate Customer</option>
                            <option value="anonymous">Simulate Anonymous</option>
                        </select>
                        <div v-if="testMode === 'authenticated'" class="mt-3 space-y-2 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700">
                            <input v-model="testCustomerData.id" type="text" placeholder="ID" class="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded text-[10px] outline-none" />
                            <input v-model="testCustomerData.name" type="text" placeholder="Name" class="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded text-[10px] outline-none" />
                            <input v-model="testCustomerData.email" type="email" placeholder="Email" class="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded text-[10px] outline-none" />
                        </div>
                    </div>
                </div>

                <!-- Interaction logs (History) -->
                <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
                    <div class="px-4 py-3 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                        <span class="font-black uppercase text-[10px] tracking-widest text-slate-400">Interaction Logs</span>
                        <button @click="loadSessionHistory" class="text-[9px] font-black text-[#9E4CFF] hover:underline uppercase">Refresh</button>
                    </div>
                    <div class="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800 no-scrollbar">
                        <div v-if="historyLoading" class="p-4 text-[10px] text-gray-400 italic">Syncing...</div>
                        <button v-for="session in sessionHistory" :key="session.session_id" @click="restoreSession(session)"
                            :class="['w-full text-left px-4 py-4 transition-colors', activeSessionId === session.session_id ? 'bg-purple-50 dark:bg-purple-900/20 border-r-2 border-purple-500' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50']">
                            <p class="text-xs font-bold text-slate-900 dark:text-slate-100 truncate leading-tight mb-1">{{ session.preview || 'Untitled Interaction' }}</p>
                            <span class="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{{ formatRelative(session.last_activity) }}</span>
                        </button>
                    </div>
                </div>
            </aside>

            <!-- ══════════════════════════════════
                 MAIN CHAT AREA (Shared)
                 ══════════════════════════════════ -->
            <div class="flex-1 bg-white dark:bg-slate-950 md:bg-white md:dark:bg-slate-900 md:rounded-2xl md:border border-gray-200 dark:border-slate-800 flex flex-col overflow-hidden relative">
                <ChatWidget 
                    v-if="selectedChatbotId" 
                    ref="chatWidgetRef" 
                    :key="widgetKey"
                    :chatbot-id="selectedChatbotId" 
                    :chatbot-name="selectedChatbot?.name || 'AI Assistant'"
                    :test-mode="testMode" 
                    :test-customer-data="testMode === 'authenticated' ? testCustomerData : null"
                    :restore-session="sessionToRestore" 
                    @session-saved="onSessionSaved"
                    class="h-full w-full" 
                />
            </div>
        </div>

        <!-- ══════════════════════════════════
             TESTING TIPS (Desktop Only Bottom)
             ══════════════════════════════════ -->
        <div class="hidden md:block bg-slate-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-800 p-6 shrink-0">
            <div class="max-w-7xl mx-auto flex items-start gap-6">
                <div class="flex items-center gap-2 text-blue-500 shrink-0">
                    <Lightbulb class="w-5 h-5" />
                    <span class="text-xs font-black uppercase tracking-widest">💡 Testing Tips</span>
                </div>
                <ul class="flex-1 grid grid-cols-3 gap-x-8 gap-y-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <li>• Ask questions related to your connected database data</li>
                    <li>• Try follow-up questions to test conversation memory</li>
                    <li>• Check if sources are properly cited in responses</li>
                    <li>• Sessions are automatically saved for 24 hours</li>
                    <li>• Click any past session in the sidebar to restore it</li>
                </ul>
            </div>
        </div>

        <!-- ══════════════════════════════════
             MOBILE CONFIGURATION (Settings Sheet)
             ══════════════════════════════════ -->
        <Teleport to="body">
            <Transition name="sheet">
                <div v-if="mobilePanel === 'settings'" class="fixed inset-0 z-50 flex items-end justify-center md:hidden">
                    <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="mobilePanel = null"></div>
                    <div class="relative w-full bg-white dark:bg-slate-900 rounded-t-[32px] shadow-2xl p-6 flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
                        <div class="w-10 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-8 shrink-0"></div>
                        <h3 class="text-xl font-black uppercase italic tracking-tighter mb-6">Environment Settings</h3>
                        
                        <div class="space-y-6">
                            <div>
                                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Available Agents</label>
                                <div class="grid grid-cols-1 gap-2">
                                    <button v-for="bot in availableChatbots" :key="bot.id" 
                                            @click="selectedChatbotId = bot.id; onChatbotChange();"
                                            class="w-full text-left px-5 py-4 rounded-2xl border-2 transition-all"
                                            :class="selectedChatbotId === bot.id ? 'border-[#9E4CFF] bg-purple-50 dark:bg-purple-900/20 text-[#9E4CFF]' : 'border-slate-100 dark:border-slate-800 dark:text-white'">
                                        <div class="flex items-center justify-between">
                                            <span class="font-bold">{{ bot.name }}</span>
                                            <div v-if="selectedChatbotId === bot.id" class="w-2 h-2 rounded-full bg-[#9E4CFF]"></div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <span class="block text-[9px] font-black text-slate-400 uppercase mb-1">Status</span>
                                    <span class="text-xs font-bold dark:text-white uppercase">{{ selectedChatbot?.is_active ? 'Active' : 'Offline' }}</span>
                                </div>
                                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <span class="block text-[9px] font-black text-slate-400 uppercase mb-1">Citations</span>
                                    <span class="text-xs font-bold dark:text-white uppercase">{{ connectedDatabases }} Sources</span>
                                </div>
                            </div>

                            <div>
                                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Simulation Persona</label>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="m in ['default', 'authenticated', 'anonymous']" :key="m" @click="testMode = m"
                                            class="px-4 py-2 rounded-full border-2 text-[10px] font-black uppercase transition-all"
                                            :class="testMode === m ? 'border-[#9E4CFF] bg-[#9E4CFF] text-white' : 'border-slate-100 dark:border-slate-800 text-slate-400'">
                                        {{ m }}
                                    </button>
                                </div>
                            </div>

                            <div v-if="testMode === 'authenticated'" class="space-y-3 p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/20">
                                <input v-model="testCustomerData.name" type="text" placeholder="Full Name" class="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base outline-none focus:ring-2 focus:ring-purple-500 transition-all text-slate-900 dark:text-white" />
                                <input v-model="testCustomerData.email" type="email" placeholder="Email Address" class="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base outline-none focus:ring-2 focus:ring-purple-500 transition-all text-slate-900 dark:text-white" />
                            </div>
                        </div>
                        <button @click="mobilePanel = null" class="mt-8 w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs">Confirm Settings</button>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- ══════════════════════════════════
             MOBILE HISTORY (Side Sheet)
             ══════════════════════════════════ -->
        <Teleport to="body">
            <Transition name="sheet-left">
                <div v-if="mobilePanel === 'history'" class="fixed inset-0 z-50 flex md:hidden">
                    <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="mobilePanel = null"></div>
                    <div class="relative w-[85%] max-w-[320px] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col">
                        <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 class="text-lg font-black uppercase italic tracking-tighter">Interaction Logs</h3>
                            <button @click="mobilePanel = null" class="p-2 rounded-full bg-slate-50 dark:bg-slate-800"><XIcon class="w-4 h-4 dark:text-white" /></button>
                        </div>
                        <div class="px-6 py-4 flex justify-end">
                            <button @click="loadSessionHistory" class="text-[10px] font-black text-[#9E4CFF] uppercase">Refresh history</button>
                        </div>
                        <div class="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar">
                            <div v-if="sessionHistory.length === 0" class="py-20 text-center opacity-30 font-bold uppercase text-[10px]">No logs found</div>
                            <button v-for="session in sessionHistory" :key="session.session_id" @click="restoreSessionMobile(session)" 
                                    class="w-full text-left p-4 rounded-2xl border border-slate-100 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800 transition-colors">
                                <p class="font-bold text-xs truncate leading-tight mb-1 text-slate-900 dark:text-white">{{ session.preview || 'Untitled session' }}</p>
                                <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">{{ formatRelative(session.last_activity) }}</span>
                            </button>
                        </div>

                        <!-- Testing Tips (Mobile Bottom) -->
                        <div class="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-4">
                             <h4 class="text-[10px] font-black uppercase text-blue-500 tracking-widest">💡 Testing Tips</h4>
                             <ul class="space-y-3">
                                <li v-for="tip in ['Ask database related data', 'Test follow-up memory', 'Verify cited responses', 'Restore past sessions here']" :key="tip" class="flex items-start gap-2 text-[10px] font-bold text-slate-500">
                                    <div class="w-1 h-1 rounded-full bg-blue-500 mt-1"></div> {{ tip }}
                                </li>
                             </ul>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { 
    History as HistoryIcon, 
    Settings2, 
    ChevronDown, 
    Plus as PlusIcon, 
    X as XIcon,
    Lightbulb
} from 'lucide-vue-next'
import ChatWidget from '~/components/chatbot-setup/ChatWidget.vue'

definePageMeta({ layout: 'dashboard' })

const chatbotStore = useChatbotStore()
const databaseStore = useDatabaseStore()
const { token } = useAuthStore()
const config = useRuntimeConfig()

const selectedChatbotId = ref('')
const testMode = ref('default')
const testCustomerData = ref({ id: '', name: '', email: '' })
const mobilePanel = ref(null)

const sessionHistory = ref([])
const historyLoading = ref(false)
const activeSessionId = ref(null)
const sessionToRestore = ref(null)
const widgetKey = ref(0)

const availableChatbots = computed(() => chatbotStore.chatbots || [])
const selectedChatbot = computed(() => availableChatbots.value.find(b => b.id === selectedChatbotId.value))
const connectedDatabases = computed(() => databaseStore.connections?.filter(c => c.status === 'connected').length || 0)

const restoreSessionMobile = (session) => { restoreSession(session); mobilePanel.value = null }

const loadSessionHistory = async () => {
    if (!selectedChatbotId.value) return
    historyLoading.value = true
    try {
        const data = await $fetch(`${config.public.apiBase}/api/conversation/test-sessions?chatbot_id=${selectedChatbotId.value}`, { 
            headers: { Authorization: `Bearer ${token}` } 
        })
        sessionHistory.value = data.data?.sessions ?? []
    } catch (e) {
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

const onChatbotChange = () => {
    sessionToRestore.value = null
    activeSessionId.value = null
    widgetKey.value++
    loadSessionHistory()
}

const onSessionSaved = async (info) => {
    const existing = sessionHistory.value.find(s => s.session_id === info.sessionId)
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
    return hrs < 24 ? `${hrs}h ago` : new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

onMounted(async () => {
    await Promise.all([chatbotStore.fetchChatbots(), databaseStore.fetchConnections()])
    if (availableChatbots.value.length > 0) {
        selectedChatbotId.value = availableChatbots.value[0].id
        await loadSessionHistory()
    }
})

watch(selectedChatbotId, (newId) => { if (newId) loadSessionHistory() })
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }

/* Transitions */
.sheet-enter-active, .sheet-leave-active, 
.sheet-left-enter-active, .sheet-left-leave-active {
    transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}


.sheet-enter-from, .sheet-leave-to { transform: translateY(100%); opacity: 0; }
.sheet-left-enter-from, .sheet-left-leave-to { transform: translateX(-100%); }
</style>
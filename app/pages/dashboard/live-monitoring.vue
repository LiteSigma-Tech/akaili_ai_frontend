<!-- pages/dashboard/live-monitoring.vue -->
<template>
    <div class="space-y-6 min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 p-6">
        <!-- Header -->
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Conversations</h1>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Monitor and manage all conversations from your chatbots
                </p>
            </div>
        </div>

        <!-- Filters -->
        <div
            class="bg-white dark:bg-slate-900 shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-800 rounded-xl p-6 transition-colors duration-300">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Source</label>
                    <select v-model="filters.source" @change="fetchConversations"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
                        <option value="">All Sources</option>
                        <option value="test">Test (Dashboard)</option>
                        <option value="widget">Widget (Customer)</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chatbot</label>
                    <select v-model="filters.chatbot_id" @change="fetchConversations"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
                        <option value="">All Chatbots</option>
                        <option v-for="chatbot in availableChatbots" :key="chatbot.id" :value="chatbot.id">
                            {{ chatbot.name }}
                        </option>
                    </select>
                </div>

                <div class="flex items-end">
                    <button @click="refreshConversations"
                        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm">
                        Refresh
                    </button>
                </div>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Conversations" :value="totalConversations" icon="chat" color="blue" />
            <StatCard title="Widget Conversations" :value="widgetConversations" icon="globe" color="green" />
            <StatCard title="Test Conversations" :value="testConversations" icon="beaker" color="purple" />
        </div>

        <!-- Conversations List -->
        <div
            class="bg-white dark:bg-slate-900 shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden transition-colors duration-300">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Conversations</h3>
            </div>

            <div v-if="conversationStore.loading" class="p-12 text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading conversations...</p>
            </div>

            <div v-else-if="conversations.length === 0" class="p-12 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.468L3 21l2.532-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No conversations</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No conversations found with the current
                    filters.</p>
            </div>

            <div v-else class="divide-y divide-gray-200 dark:divide-slate-800">
                <div v-for="conversation in conversations" :key="conversation.id"
                    class="p-6 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    @click="viewConversation(conversation)">
                    <div class="flex items-center justify-between">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center space-x-3">
                                <span class="px-2.5 py-0.5 text-xs font-medium rounded-full"
                                    :class="getSourceBadgeClass(conversation.source)">
                                    {{ conversation.source === 'test' ? 'Test' : 'Customer' }}
                                </span>
                                <!-- FIXED: Use chatbot_name directly from API response -->
                                <span class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {{ conversation.chatbot_name || 'Unknown Chatbot' }}
                                </span>
                                <!-- Show status badge if present -->
                                <span v-if="conversation.status && conversation.status !== 'active'"
                                    class="px-2 py-0.5 text-xs font-medium rounded-full"
                                    :class="getStatusBadgeClass(conversation.status)">
                                    {{ conversation.status }}
                                </span>
                                <!-- Show rating stars if rated -->
                                <div v-if="conversation.rating" class="flex gap-0.5 ml-2">
                                    <span v-for="s in 5" :key="s" class="text-xs"
                                        :class="s <= conversation.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'">★</span>
                                </div>
                            </div>

                            <div class="mt-1">
                                <p class="text-sm text-gray-600 dark:text-gray-300 truncate">
                                    {{ getLastMessage(conversation) }}
                                </p>
                            </div>

                            <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                <span>{{ formatDate(conversation.last_activity) }}</span>
                                <span>{{ conversation.messages?.length || 0 }} messages</span>
                                <span v-if="conversation.customer_data?.email" class="truncate max-w-[200px]">
                                    {{ conversation.customer_data.email }}
                                </span>
                                <span v-else-if="conversation.metadata?.tester_email" class="truncate max-w-[200px]">
                                    {{ conversation.metadata.tester_email }}
                                </span>
                                <span v-if="conversation.ended_by" class="text-xs text-gray-400">
                                    ended by {{ conversation.ended_by }}
                                </span>
                            </div>
                        </div>

                        <div class="flex-shrink-0 ml-4">
                            <ChevronRight class="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="conversations.length > 0 && conversationStore.pagination.last_page > 1"
                class="px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                    Showing {{ conversationStore.pagination.from }} to {{ conversationStore.pagination.to }}
                    of {{ conversationStore.pagination.total }} results
                </div>
                <div class="flex gap-2">
                    <button @click="goToPage(conversationStore.pagination.current_page - 1)"
                        :disabled="conversationStore.pagination.current_page === 1"
                        class="px-3 py-1 text-sm border border-gray-300 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800">
                        Previous
                    </button>
                    <button @click="goToPage(conversationStore.pagination.current_page + 1)"
                        :disabled="conversationStore.pagination.current_page === conversationStore.pagination.last_page"
                        class="px-3 py-1 text-sm border border-gray-300 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800">
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- Conversation Detail Modal -->
        <ConversationDetailModal v-if="selectedConversation" :conversation="selectedConversation"
            @close="selectedConversation = null" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import StatCard from '~/components/StatCard.vue'
import ConversationDetailModal from '~/components/ConversationDetailModal.vue'

definePageMeta({ layout: 'dashboard' })

const conversationStore = useConversationStore()
const chatbotStore = useChatbotStore()

const filters = ref({ source: '', chatbot_id: '' })
const selectedConversation = ref(null)

const conversations = computed(() => conversationStore.conversations)
const availableChatbots = computed(() => chatbotStore.chatbots)

const totalConversations = computed(() => conversationStore.pagination.total)
const widgetConversations = computed(() => conversations.value.filter(c => c.source === 'widget').length)
const testConversations = computed(() => conversations.value.filter(c => c.source === 'test').length)

const fetchConversations = async () => {
    try {
        await conversationStore.fetchConversations(filters.value)
    } catch (error) {
        console.error('Error fetching conversations:', error)
    }
}

const refreshConversations = () => fetchConversations()

const goToPage = (page) => {
    if (page < 1 || page > conversationStore.pagination.last_page) return
    fetchConversations({ ...filters.value, page })
}

const viewConversation = (conversation) => {
    selectedConversation.value = conversation
}

const getSourceBadgeClass = (source) => source === 'test'
    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
    : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'

const getStatusBadgeClass = (status) => {
    const classes = {
        'rated': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
        'ended': 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
        'active': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
    }
    return classes[status] || 'bg-gray-100 text-gray-700'
}

const getLastMessage = (conversation) => {
    const messages = conversation.messages || []
    if (messages.length === 0) return 'No messages'
    const last = messages[messages.length - 1]
    const text = last.message ?? ''
    return text.length > 80 ? text.substring(0, 80) + '...' : text
}

const formatDate = (date) => {
    if (!date) return '—'
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return new Date(date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
    try {
        await Promise.all([chatbotStore.fetchChatbots(), fetchConversations()])
    } catch (error) {
        console.error('Error loading data:', error)
    }
})
</script>
<!-- components/chatbot-setup/ChatWidget.vue -->
<template>
    <div ref="widgetContainer" class="bg-white dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-none border border-gray-200 dark:border-slate-800 mx-auto transition-colors duration-300 flex flex-col relative group" :style="fluid ? {} : { width: widgetWidth + 'px', height: widgetHeight + 'px', maxWidth: '100%' }">
        <!-- Chat Header -->
        <div class="bg-[#9E4CFF] dark:bg-[#7C3AED] text-white px-6 py-4 flex justify-between items-center shrink-0 select-none" :class="fluid ? 'cursor-default' : 'cursor-move'" @mousedown="fluid ? null : startDrag($event)">
            <div>
                <h3 class="text-lg font-semibold">{{ chatbotName || 'AI Assistant' }}</h3>
                <p class="text-purple-100 text-sm">
                    <span v-if="handoverStatus === 'requested'">⏳ Connecting...</span>
                    <span v-else-if="handoverStatus === 'active'">✅ Chatting with {{ agentName || 'Agent' }}</span>
                    <span v-else>🤖 AI Assistant</span>
                </p>
            </div>
            <!-- End Chat Button - only show if conversation has messages -->
            <button
                v-if="messages.length > 0"
                class="text-purple-100 hover:text-white text-sm font-medium px-3 py-1.5 border border-purple-300/50 rounded-lg hover:bg-purple-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isEnding"
                @click="requestEndChat"
                >
                {{ isEnding ? 'Ending...' : 'End Chat' }}
            </button>
        </div>

        <!-- Handover banners -->
        <div
            v-if="handoverStatus === 'requested'"
            class="bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-800/50 p-3 shrink-0">
            <div class="flex items-center text-yellow-800 dark:text-yellow-200 text-sm">
                <div class="animate-spin mr-2 w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full" />
                <span>Finding an available agent...</span>
            </div>
        </div>
        <div
            v-if="handoverStatus === 'rejected'"
            class="bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800/50 p-3 shrink-0">
            <p class="text-red-800 dark:text-red-200 text-sm">❌ All agents are busy. Please continue with the AI.</p>
        </div>
        <div
            v-if="handoverStatus === 'active'"
            class="bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800/50 p-3 shrink-0">
            <p class="text-green-800 dark:text-green-200 text-sm flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Connected to {{ agentName || 'an agent' }}
            </p>
        </div>

        <!-- Session restored banner -->
        <div
            v-if="sessionRestored"
            class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800/50 p-2.5 shrink-0 flex items-center justify-between">
            <p class="text-blue-700 dark:text-blue-300 text-xs flex items-center gap-1.5">
                🔄 Previous session restored from {{ restoredFromLabel }}
            </p>
            <button
                class="text-blue-400 hover:text-blue-600 text-xs ml-4"
                @click="sessionRestored = false">✕</button>
        </div>

        <!-- Messages -->
        <div
            ref="messagesContainer"
            class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950">
            <div
                v-if="messages.length === 0"
                class="text-center text-gray-500 dark:text-gray-400 mt-12">
                <div class="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 inline-block max-w-xs mx-auto">
                    <p class="text-lg">👋</p>
                    <p class="mt-2 font-medium">Hello! I'm your AI assistant.</p>
                </div>
            </div>
            <div
                v-for="(message, index) in messages"
                :key="index"
                :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start']">
                <div
                    :class="[
                    'max-w-[90%] px-4 py-3 rounded-2xl text-sm shadow-sm',
                    message.role === 'user'
                        ? 'bg-[#9E4CFF] text-white rounded-br-none'
                        : message.role === 'system'
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800/50 text-xs italic mx-auto'
                            : message.role === 'agent'
                                ? 'bg-green-50 dark:bg-green-900/10 text-gray-800 dark:text-gray-200 border-l-4 border-green-500 rounded-bl-none'
                                : 'bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-800 rounded-bl-none'
                ]">
                <p
                    v-if="message.role === 'agent'"
                    class="text-xs text-green-600 dark:text-green-400 font-bold mb-1">
                    {{ message.metadata?.agent_name || 'Agent' }}
                </p>
                <div
                    v-if="message.role !== 'user'"
                    class="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed"
                    v-html="sanitizeHtml(formatMessage(message.message))" />
                <p v-else class="whitespace-pre-wrap leading-relaxed">{{ message.message }}</p>
                <div
                    v-if="message.role === 'assistant' && message.sources?.length"
                    class="mt-3 pt-2 border-t border-gray-100 dark:border-slate-700/50">
                        <p class="text-[10px] uppercase font-bold text-gray-400 mb-1">Sources</p>
                        <div class="text-xs text-gray-500 space-y-1">
                            <div
                                v-for="(s, i) in message.sources.slice(0, 2)"
                                :key="i">📄 {{ s.table || 'Document' }}
                            </div>
                        </div>
                    </div>
                    <p class="text-[10px] mt-2 text-right opacity-60">{{ formatTime(message.timestamp) }}</p>
                </div>
            </div>
            <div
                v-if="isTyping"
                class="flex justify-start">
                <div class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm px-4 py-3 rounded-2xl rounded-bl-none">
                    <div class="flex space-x-1.5 items-center h-4">
                        <div
                            v-for="i in 3"
                            :key="i"
                            class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            :style="{ animationDelay: `${(i - 1) * 0.1}s` }" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <div
                v-if="!handoverStatus && !isHandoverRequested"
                class="mb-3">
                <button
                    class="w-full text-xs sm:text-sm text-[#9E4CFF] dark:text-purple-400 hover:text-purple-700 font-medium py-2 border border-[#9E4CFF] dark:border-purple-500/50 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
                    @click="requestHumanAgent">
                    💬 Speak with a Human Agent
                </button>
            </div>
            <div class="flex space-x-2">
                <input
                    v-model="currentMessage"
                    type="text"
                    :disabled="isTyping"
                    placeholder="Type your message..."
                    class="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-colors placeholder-gray-400"
                    @keypress.enter="sendMessage">
                <button
                    :disabled="!currentMessage.trim() || isTyping"
                    class="px-5 py-3 bg-[#9E4CFF] hover:bg-purple-700 text-white rounded-xl disabled:opacity-50 transition-all shadow-md"
                    @click="sendMessage">
                    Send
                </button>
            </div>
        </div>

        <!-- Error toast -->
        <div
            v-if="error"
            class="absolute bottom-20 left-4 right-4 bg-red-50 dark:bg-red-900/90 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-200 text-center shadow-lg">
            {{ error }}
        </div>

        <!-- ══════════════════════════
             RATING MODAL
             ══════════════════════════ -->
        <Transition name="fade">
            <div
                v-if="showRatingModal"
                class="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 rounded-xl">
                <div
                    class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 mx-4 w-full max-w-sm border border-gray-100 dark:border-slate-800">
                    <div class="text-center mb-5">
                        <p class="text-3xl mb-2">🙌</p>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">How did we do?</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Rate your conversation to help us
                            improve</p>
                    </div>

                    <!-- Stars -->
                    <div class="flex justify-center gap-2 mb-5">
                        <button
                            v-for="star in 5"
                            :key="star"
                            class="text-3xl transition-transform hover:scale-110"
                            @click="hoveredRating = star; pendingRating = star"
                            @mouseenter="hoveredRating = star"
                            @mouseleave="hoveredRating = 0">
                            <span
                                :class="star <= (hoveredRating || pendingRating) ? 'text-yellow-400' : 'text-gray-200 dark:text-slate-700'">★</span>
                        </button>
                    </div>

                    <!-- Label -->
                    <p class="text-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-4 h-5">
                        {{ ratingLabel }}
                    </p>

                    <!-- Optional comment -->
                    <textarea
                        v-model="ratingComment"
                        rows="2"
                        placeholder="Any additional comments? (optional)"
                        class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-4 placeholder-gray-400" />

                    <div class="flex gap-3">
                        <button
                            class="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                            @click="skipRating">
                            Skip
                        </button>
                        <button
                            :disabled="!pendingRating || ratingSubmitting"
                            class="flex-1 py-2.5 rounded-xl bg-[#9E4CFF] hover:bg-purple-700 text-white text-sm font-semibold disabled:opacity-50 transition-all"
                            @click="submitRating">
                            {{ ratingSubmitting ? 'Submitting...' : 'Submit' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Resize handles — hidden in fluid/fullscreen mode -->
        <template v-if="!fluid">
            <div
                class="absolute right-0 top-0 bottom-4 w-3 cursor-ew-resize hover:bg-purple-500/10 z-50"
                @mousedown.prevent="startResize('right', $event)" />
            <div
                class="absolute left-0 top-0 bottom-4 w-3 cursor-ew-resize hover:bg-purple-500/10 z-50"
                @mousedown.prevent="startResize('left', $event)" />
            <div
                class="absolute left-4 bottom-0 right-4 h-3 cursor-ns-resize hover:bg-purple-500/10 z-50"
                @mousedown.prevent="startResize('bottom', $event)" />
            <div
                class="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50"
                @mousedown.prevent="startResize('bottom-right', $event)">
                <svg class="w-3 h-3 m-1 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 6 6">
                    <path d="M6 6H4V4h2v2zM6 3H4V1h2v2zM3 6H1V4h2v2z" />
                </svg>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    chatbotId: { type: String, required: true },
    chatbotName: { type: String, default: 'AI Assistant' },
    testMode: { type: String, default: 'default' },
    testCustomerData: { type: Object, default: null },
    restoreSession: { type: Object, default: null },
    // When true: fills its container, disables drag/resize (used on intelligence.vue)
    fluid: { type: Boolean, default: false },
})

const emit = defineEmits(['session-saved'])

// ── Composables ──
const config = useRuntimeConfig()
const { $echo } = useNuxtApp()

// Try to get auth store, but don't fail if it doesn't exist (for standalone widget usage)
let authStore = null
try {
    authStore = useAuthStore()
} catch {
    console.warn('Auth store not available - widget will run without authentication')
}

// ── Chat state ──
const messages = ref([])
const currentMessage = ref('')
const isTyping = ref(false)
const error = ref('')
const sessionId = ref(null)
const conversationId = ref(null)
const handoverStatus = ref(null)
const agentName = ref(null)
const isHandoverRequested = ref(false)
const sessionRestored = ref(false)
const restoredFromLabel = ref('')
const isEnding = ref(false)

// ── Rating state ──
const showRatingModal = ref(false)
const pendingRating = ref(0)
const hoveredRating = ref(0)
const ratingComment = ref('')
const ratingSubmitting = ref(false)

// ── Resize/drag ──
const widgetWidth = ref(520)
const widgetHeight = ref(600)
const resizeDirection = ref(null)
const startX = ref(0); const startY = ref(0)
const startWidth = ref(0); const startHeight = ref(0)
const widgetContainer = ref(null)
const messagesContainer = ref(null)

let conversationChannel = null

// ── Storage ──
const storageKey = computed(() => `akili_test_session_${props.chatbotId}`)

const persistSession = () => {
    try {
        localStorage.setItem(storageKey.value, JSON.stringify({
            sessionId: sessionId.value,
            conversationId: conversationId.value,
            messages: messages.value,
            savedAt: Date.now(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        }))
        emit('session-saved', {
            sessionId: sessionId.value,
            conversationId: conversationId.value,
            preview: messages.value.find(m => m.role === 'user')?.message?.substring(0, 60) ?? '',
            messageCount: messages.value.length,
        })
    } catch {
        // Ignore storage errors
    }
}

const loadPersistedSession = () => {
    try {
        const raw = localStorage.getItem(storageKey.value)
        if (!raw) return false
        const p = JSON.parse(raw)
        if (!p?.expiresAt || Date.now() > p.expiresAt) {
            localStorage.removeItem(storageKey.value)
            return false
        }
        return p
    } catch {
        return false
    }
}

const clearPersistedSession = () => {
    try {
        localStorage.removeItem(storageKey.value)
    } catch {
        // Ignore storage errors
    }
}

// ── Expose for parent ──
const restoreSpecificSession = (sessionData) => {
    clearConversationChannel()
    messages.value = sessionData.messages || []
    sessionId.value = sessionData.session_id
    conversationId.value = sessionData.conversation_id
    handoverStatus.value = null
    isHandoverRequested.value = false
    sessionRestored.value = true
    restoredFromLabel.value = 'history'
    scrollToBottom()
}
// Expose methods for parent components
const setMessage = (msg) => { currentMessage.value = msg }
defineExpose({ restoreSpecificSession, setMessage })

// ── Helpers ──
const ratingLabel = computed(() => {
    const labels = { 1: '😞 Very unsatisfied', 2: '😕 Unsatisfied', 3: '😐 Neutral', 4: '😊 Satisfied', 5: '🤩 Very satisfied' }
    return labels[hoveredRating.value || pendingRating.value] ?? ''
})

/**
 * Get auth headers if available, otherwise return empty object
 */
const getAuthHeaders = () => {
    if (authStore?.token) {
        return { Authorization: `Bearer ${authStore.token}` }
    }
    return {}
}

const formatMessage = (text) => {
    if (!text) return ''
    let html = ''
    let inList = false
    let listType = null
    for (const line of text.split('\n')) {
        const p = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-slate-800 px-1 rounded text-xs font-mono">$1</code>')
        if (/^[*-]\s+/.test(line)) {
            if (!inList || listType !== 'ul') {
                if (inList) html += '</ul>'
                html += '<ul class="list-disc pl-5 my-2">'
                inList = true
                listType = 'ul'
            }
            html += `<li>${p.replace(/^[*-]\s+/, '')}</li>`
        } else if (/^\d+\.\s+/.test(line)) {
            if (!inList || listType !== 'ol') {
                if (inList) html += '</ol>'
                html += '<ol class="list-decimal pl-5 my-2">'
                inList = true
                listType = 'ol'
            }
            html += `<li>${p.replace(/^\d+\.\s+/, '')}</li>`
        } else if (line.trim()) {
            if (inList) {
                html += listType === 'ul' ? '</ul>' : '</ol>'
                inList = false
                listType = null
            }
            html += `<p class="my-2">${p}</p>`
        }
    }
    if (inList) html += listType === 'ul' ? '</ul>' : '</ol>'
    return html
}

const sanitizeHtml = (html) => {
    const temp = document.createElement('div')
    temp.textContent = html
    return temp.innerHTML
}

const generateSessionId = () => 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
const formatTime = (ts) => ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
const scrollToBottom = async () => { await nextTick(); if (messagesContainer.value) messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight }

const clearConversationChannel = () => {
    if (conversationChannel && conversationId.value) {
        try {
            $echo.leave(`conversation.${conversationId.value}`)
        } catch {
            // Ignore echo errors
        }
        conversationChannel = null
    }
}

// ── End Chat & Rating ──

/** Called when user clicks "End Chat" button (only visible if messages.length > 0) */
const requestEndChat = async () => {
    if (isEnding.value) return
    isEnding.value = true

    // Mark conversation as ended on backend BEFORE showing rating modal
    if (conversationId.value) {
        try {
            await $fetch(`${config.public.apiBase}/api/conversation/end`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: { session_id: sessionId.value },
            })
        } catch (err) {
            console.error('Failed to mark conversation as ended:', err)
            // Continue anyway — rating will also mark it as ended
        }
    }

    isEnding.value = false

    // Show rating modal
    pendingRating.value = 0
    hoveredRating.value = 0
    ratingComment.value = ''
    showRatingModal.value = true
}

const submitRating = async () => {
    if (!pendingRating.value) return
    ratingSubmitting.value = true
    try {
        await $fetch(`${config.public.apiBase}/api/conversation/rate`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: { session_id: sessionId.value, rating: pendingRating.value, comment: ratingComment.value || null },
        })
    } catch (err) {
        console.error('Rating submission failed:', err)
    } finally {
        ratingSubmitting.value = false
    }

    showRatingModal.value = false
    doReset()
}

const skipRating = () => {
    showRatingModal.value = false
    doReset()
}

const doReset = () => {
    clearConversationChannel()
    clearPersistedSession()
    messages.value = []
    sessionId.value = generateSessionId()
    conversationId.value = null
    error.value = ''
    handoverStatus.value = null
    isHandoverRequested.value = false
    sessionRestored.value = false
}

// ── Chat ──
const requestHumanAgent = async () => {
    if (isHandoverRequested.value) return
    if (!conversationId.value) { error.value = 'Please send a message first'; return }
    isHandoverRequested.value = true
    messages.value.push({ role: 'user', message: 'I would like to speak with a human agent', timestamp: new Date().toISOString() })
    scrollToBottom(); isTyping.value = true
    try {
        const res = await $fetch(`${config.public.apiBase}/api/handover/request`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: { conversation_id: conversationId.value, session_id: sessionId.value, chatbot_id: props.chatbotId, user_message: 'Agent Requested' }
        })
        if (res.success) {
            handoverStatus.value = 'requested'
            messages.value.push({ role: 'system', message: 'Connecting you with an agent...', timestamp: new Date().toISOString() })
            setupConversationListener()
        }
    } catch {
        error.value = 'Failed to connect'
        isHandoverRequested.value = false
    }
    finally { isTyping.value = false; scrollToBottom() }
}

const setupConversationListener = () => {
    if (!conversationId.value || conversationChannel) return
    conversationChannel = $echo.channel(`conversation.${conversationId.value}`)
    conversationChannel.listen('.handover.accepted', (e) => { handoverStatus.value = 'active'; agentName.value = e.agent?.name; scrollToBottom() })
    conversationChannel.listen('.handover.rejected', (e) => { if (e.all_rejected) handoverStatus.value = 'rejected'; scrollToBottom() })
    conversationChannel.listen('.agent.message', (e) => {
        messages.value.push({ role: 'agent', message: e.message.message, timestamp: e.message.timestamp, metadata: { agent_name: e.agent.name } })
        persistSession(); scrollToBottom()
    })
}

const isHandoverActive = computed(() => handoverStatus.value === 'active')

const sendMessage = async () => {
    if (!currentMessage.value.trim() || isTyping.value) return
    const msg = currentMessage.value.trim(); currentMessage.value = ''; error.value = ''
    messages.value.push({ role: 'user', message: msg, timestamp: new Date().toISOString() })
    scrollToBottom(); isTyping.value = true
    try {
        if (isHandoverActive.value && authStore?.token) {
            await $fetch(`${config.public.apiBase}/api/agent-handover/message`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: { conversation_id: conversationId.value, message: msg }
            })
            isTyping.value = false; persistSession(); return
        }
        const body = { message: msg, chatbot_id: props.chatbotId, session_id: sessionId.value }
        if (props.testMode !== 'default') {
            body.test_mode = props.testMode
            if (props.testMode === 'authenticated' && props.testCustomerData?.email) {
                body.test_customer_data = props.testCustomerData
            }
        }
        const res = await $fetch(`${config.public.apiBase}/api/chat`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body
        })
        if (res.success) {
            if (res.session_id) sessionId.value = res.session_id
            if (res.conversation_id) conversationId.value = res.conversation_id
            if (!isHandoverActive.value) {
                messages.value.push({ role: 'assistant', message: res.data.response.text, timestamp: new Date().toISOString(), sources: res.data.response.sources || [] })
            }
            persistSession()
        }
    } catch {
        error.value = 'Failed to send message. Please try again.'
    }
    finally { isTyping.value = false; scrollToBottom() }
}

// ── Resize / drag ──
const startResize = (dir, e) => {
    resizeDirection.value = dir; startX.value = e.clientX; startY.value = e.clientY
    startWidth.value = widgetWidth.value; startHeight.value = widgetHeight.value
    window.addEventListener('mousemove', resize); window.addEventListener('mouseup', stopResize)
    document.body.style.userSelect = 'none'
}
const resize = (e) => {
    if (!resizeDirection.value) return
    const min = 320; const dx = e.clientX - startX.value; const dy = e.clientY - startY.value
    if (['right', 'bottom-right'].includes(resizeDirection.value)) { const w = startWidth.value + dx; if (w >= min) widgetWidth.value = w }
    if (['left', 'bottom-left'].includes(resizeDirection.value)) { const w = startWidth.value - dx; if (w >= min) widgetWidth.value = w }
    if (['bottom', 'bottom-right', 'bottom-left'].includes(resizeDirection.value)) { const h = startHeight.value + dy; if (h >= 400) widgetHeight.value = h }
}
const stopResize = () => { resizeDirection.value = null; window.removeEventListener('mousemove', resize); window.removeEventListener('mouseup', stopResize); document.body.style.userSelect = '' }
const startDrag = (e) => {
    if (e.target.tagName === 'BUTTON') return
    const el = widgetContainer.value; if (!el) return
    const sx = el.offsetLeft, sy = el.offsetTop, mx = e.clientX, my = e.clientY
    const onMove = (ev) => { el.style.left = (sx + ev.clientX - mx) + 'px'; el.style.top = (sy + ev.clientY - my) + 'px' }
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); document.body.style.userSelect = '' }
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp); document.body.style.userSelect = 'none'
}

// ── Lifecycle ──
onMounted(async () => {
    if (props.restoreSession) { restoreSpecificSession(props.restoreSession); return }
    const p = loadPersistedSession()
    if (p?.messages?.length > 0) {
        sessionId.value = p.sessionId
        conversationId.value = p.conversationId
        messages.value = p.messages
        sessionRestored.value = true
        restoredFromLabel.value = 'your last session'
        await scrollToBottom()
    } else {
        sessionId.value = generateSessionId()
    }
})

onUnmounted(() => { clearConversationChannel(); window.removeEventListener('mouseup', stopResize) })
</script>

<style scoped>
:deep(.prose ul),
:deep(.prose ol) {
    margin: 0.5rem 0;
}

:deep(.prose li) {
    margin: 0.25rem 0;
}

:deep(.prose strong) {
    font-weight: 700;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
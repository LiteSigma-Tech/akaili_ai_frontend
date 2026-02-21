<!-- components/ConversationDetailModal.vue -->
<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
            <div class="flex min-h-screen items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="$emit('close')">
                </div>

                <!-- Modal -->
                <div
                    class="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 max-h-[90vh] flex flex-col">

                    <!-- Header -->
                    <div
                        class="px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Conversation Details</h3>
                            <div class="flex items-center gap-3 mt-1">
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {{ conversation.chatbot_name || 'Unknown Chatbot' }}
                                </span>
                                <span class="px-2 py-0.5 text-xs font-medium rounded-full" :class="conversation.source === 'test'
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                                    : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'">
                                    {{ conversation.source === 'test' ? 'Test' : 'Customer' }}
                                </span>
                                <span v-if="conversation.status && conversation.status !== 'active'"
                                    class="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                    {{ conversation.status }}
                                </span>
                                <div v-if="conversation.rating" class="flex gap-0.5">
                                    <span v-for="s in 5" :key="s" class="text-sm"
                                        :class="s <= conversation.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'">★</span>
                                </div>
                            </div>
                        </div>
                        <button @click="$emit('close')"
                            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Metadata -->
                    <div
                        class="px-6 py-4 bg-gray-50/50 dark:bg-slate-800/30 border-b border-gray-200 dark:border-slate-800 shrink-0">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span class="text-gray-500 dark:text-gray-400">Session ID:</span>
                                <p class="font-mono text-xs text-gray-900 dark:text-white truncate">{{
                                    conversation.session_id }}</p>
                            </div>
                            <div>
                                <span class="text-gray-500 dark:text-gray-400">Messages:</span>
                                <p class="font-semibold text-gray-900 dark:text-white">{{ conversation.messages?.length
                                    || 0 }}</p>
                            </div>
                            <div>
                                <span class="text-gray-500 dark:text-gray-400">Last Activity:</span>
                                <p class="text-gray-900 dark:text-white">{{ formatDate(conversation.last_activity) }}
                                </p>
                            </div>
                            <div>
                                <span class="text-gray-500 dark:text-gray-400">User:</span>
                                <p class="text-gray-900 dark:text-white truncate">
                                    {{ conversation.customer_data?.email || conversation.metadata?.tester_email ||
                                    'Anonymous' }}
                                </p>
                            </div>
                        </div>
                        <div v-if="conversation.rating_comment"
                            class="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <p class="text-sm text-gray-700 dark:text-gray-300">
                                <strong>Rating Comment:</strong> {{ conversation.rating_comment }}
                            </p>
                        </div>
                    </div>

                    <!-- Messages -->
                    <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        <div v-for="(message, index) in conversation.messages" :key="index"
                            :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start']">
                            <div :class="[
                                'max-w-[85%] px-4 py-3 rounded-2xl',
                                message.role === 'user'
                                    ? 'bg-purple-600 text-white rounded-br-sm'
                                    : message.role === 'system'
                                        ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800 text-sm italic mx-auto rounded-lg'
                                        : message.role === 'agent'
                                            ? 'bg-green-50 dark:bg-green-900/20 text-gray-800 dark:text-gray-200 border-l-4 border-green-500 rounded-bl-sm'
                                            : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                            ]">
                                <p v-if="message.role === 'agent'"
                                    class="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                                    {{ message.metadata?.agent_name || 'Agent' }}
                                </p>
                                <p class="whitespace-pre-wrap break-words text-sm leading-relaxed">{{ message.message }}
                                </p>

                                <!-- Sources -->
                                <div v-if="message.metadata?.sources?.length"
                                    class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Sources:</p>
                                    <div class="space-y-1">
                                        <div v-for="(source, i) in message.metadata.sources.slice(0, 3)" :key="i"
                                            class="text-xs text-gray-600 dark:text-gray-300">
                                            📄 {{ source.table || 'Document' }} ({{ Math.round(source.confidence * 100)
                                            }}% match)
                                        </div>
                                    </div>
                                </div>

                                <p class="text-xs mt-2 opacity-60">{{ formatTime(message.timestamp) }}</p>
                            </div>
                        </div>

                        <div v-if="!conversation.messages || conversation.messages.length === 0"
                            class="text-center py-12">
                            <p class="text-gray-500 dark:text-gray-400">No messages in this conversation</p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex justify-end shrink-0">
                        <button @click="$emit('close')"
                            class="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
defineProps({
    conversation: {
        type: Object,
        required: true
    }
})

defineEmits(['close'])

const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatTime = (timestamp) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
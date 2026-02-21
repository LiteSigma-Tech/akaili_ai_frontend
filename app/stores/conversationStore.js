// stores/conversationStore.js
import { defineStore } from 'pinia'

export const useConversationStore = defineStore('conversation', {
    state: () => ({
        conversations: [],
        pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: 0
        },
        loading: false,
        error: null
    }),

    actions: {
        async fetchConversations(filters = {}) {
            this.loading = true
            this.error = null

            try {
                const config = useRuntimeConfig()
                const auth = useAuthStore()

                // Build query params
                const params = new URLSearchParams()
                if (filters.source) params.append('source', filters.source)
                if (filters.chatbot_id) params.append('chatbot_id', filters.chatbot_id)
                if (filters.status) params.append('status', filters.status)
                if (filters.has_handover) params.append('has_handover', 'true')
                if (filters.page) params.append('page', filters.page)

                const url = `${config.public.apiBase}/api/conversation${params.toString() ? '?' + params.toString() : ''}`

                const response = await $fetch(url, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                })

                if (response.success && response.data?.conversations) {
                    // CRITICAL FIX: Laravel pagination wraps data in "data" property
                    const paginatedData = response.data.conversations

                    // Extract conversations array from pagination wrapper
                    this.conversations = paginatedData.data || []

                    // Store pagination metadata
                    this.pagination = {
                        current_page: paginatedData.current_page,
                        last_page: paginatedData.last_page,
                        per_page: paginatedData.per_page,
                        total: paginatedData.total,
                        from: paginatedData.from,
                        to: paginatedData.to
                    }

                    console.log('✅ Loaded conversations:', this.conversations.length)
                } else {
                    console.error('❌ Unexpected API response structure:', response)
                    this.conversations = []
                }
            } catch (error) {
                console.error('❌ Error fetching conversations:', error)
                this.error = error.message || 'Failed to load conversations'
                this.conversations = []
            } finally {
                this.loading = false
            }
        },

        async fetchConversation(id) {
            try {
                const config = useRuntimeConfig()
                const auth = useAuthStore()

                const response = await $fetch(`${config.public.apiBase}/api/conversation/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                })

                if (response.success && response.data?.conversation) {
                    return response.data.conversation
                }

                return null
            } catch (error) {
                console.error('Error fetching conversation:', error)
                throw error
            }
        },

        clearError() {
            this.error = null
        }
    }
})
<template>
    <!-- Always closable — analysis continues in background via WebSocket -->
    <BaseModal :show="show" @close="$emit('close')" :closable="true" max-width="2xl">
        <template #header>
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="headerIconBg">
                    <svg v-if="isRunning" class="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <svg v-else-if="syncStatus.status === 'DONE'" class="w-5 h-5 text-green-600 dark:text-green-400"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <svg v-else-if="syncStatus.status === 'FAILED'" class="w-5 h-5 text-red-600 dark:text-red-400"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ modalTitle }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ connection?.name || 'Unknown Connection' }}
                    </p>
                </div>
            </div>
        </template>

        <template #body>
            <div class="space-y-5">

                <!-- Progress Bar -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ progressLabel }}
                        </span>
                        <span class="text-sm font-bold" :class="progressColorClass">
                            {{ syncStatus.progress || 0 }}%
                        </span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div class="h-3 rounded-full transition-all duration-500 ease-out" :class="progressBarClass"
                            :style="{ width: `${syncStatus.progress || 0}%` }" />
                    </div>
                </div>

                <!-- Analysis Steps — the single source of truth for what's happening -->
                <div class="border border-gray-100 dark:border-slate-700 rounded-xl p-4">
                    <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                        Analysis Steps
                    </h4>
                    <div class="space-y-3">
                        <div v-for="step in analysisSteps" :key="step.key" class="flex items-start gap-3">
                            <!-- Step indicator -->
                            <div class="mt-0.5 w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full"
                                :class="stepIndicatorClass(step)">
                                <svg v-if="step.done" class="w-3 h-3" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                                <svg v-else-if="step.active" class="animate-spin w-3 h-3" fill="none"
                                    viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" />
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <div v-else class="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                            </div>
                            <!-- Step label + sub-detail -->
                            <div>
                                <p class="text-sm leading-tight" :class="step.active ? 'text-blue-600 dark:text-blue-400 font-medium' :
                                    step.done ? 'text-green-700 dark:text-green-400' :
                                        'text-gray-400 dark:text-gray-500'">
                                    {{ step.label }}
                                </p>
                                <!-- Show current table name only inside the schema step -->
                                <p v-if="step.active && step.key === 'schema' && syncStatus.currentTable"
                                    class="text-xs text-blue-500 dark:text-blue-400 mt-0.5 font-mono">
                                    {{ syncStatus.currentTable }}
                                    <span class="font-sans ml-1 text-blue-400 dark:text-blue-500">
                                        ({{ syncStatus.processedTables || 0 }}/{{ syncStatus.totalTables || 0 }})
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Error -->
                <div v-if="syncStatus.status === 'FAILED'"
                    class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p class="text-sm font-medium text-red-900 dark:text-red-100">Analysis Failed</p>
                            <p class="text-sm text-red-700 dark:text-red-300 mt-0.5">{{ syncStatus.error }}</p>
                        </div>
                    </div>
                </div>

                <!-- Success -->
                <div v-if="syncStatus.status === 'DONE'"
                    class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p class="text-sm font-medium text-green-900 dark:text-green-100">Database Profile Built!
                            </p>
                            <p class="text-sm text-green-700 dark:text-green-300 mt-0.5">
                                Your AI chatbot now understands your database and can answer questions accurately.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Running hint -->
                <p v-if="isRunning" class="text-xs text-center text-gray-400 dark:text-gray-500">
                    You can close this window — analysis continues in the background.
                </p>
            </div>
        </template>

        <template #footer>
            <div class="flex items-center justify-end">
                <button @click="$emit('close')"
                    class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm">
                    {{ isRunning ? 'Close (runs in background)' : 'Close' }}
                </button>
            </div>
        </template>
    </BaseModal>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useDatabaseStore } from '~/stores/databaseStore'
import { useWebSocketStore } from '~/stores/websocketStore'

const props = defineProps({
    show: { type: Boolean, required: true },
    connection: { type: Object, default: null }
})
const emit = defineEmits(['close', 'sync-complete'])

const databaseStore = useDatabaseStore()
const websocketStore = useWebSocketStore()

const connectionId = computed(() => props.connection?._id || props.connection?.id)

const syncStatus = computed(() => {
    if (!connectionId.value) {
        return { status: 'IDLE', progress: 0, currentTable: null, message: null, error: null, totalTables: 0, processedTables: 0 }
    }
    return databaseStore.getSyncStatusForConnection(connectionId.value)
})

const isRunning = computed(() =>
    ['RUNNING', 'PENDING'].includes(syncStatus.value.status)
)

const modalTitle = computed(() => {
    if (syncStatus.value.status === 'DONE') return 'Profile Built Successfully'
    if (syncStatus.value.status === 'FAILED') return 'Analysis Failed'
    if (isRunning.value) return 'Building Database Profile'
    return 'Database Analysis'
})

const headerIconBg = computed(() => {
    if (syncStatus.value.status === 'DONE') return 'bg-green-100 dark:bg-green-900/30'
    if (syncStatus.value.status === 'FAILED') return 'bg-red-100 dark:bg-red-900/30'
    return 'bg-blue-100 dark:bg-blue-900/30'
})

const progressColorClass = computed(() => {
    if (syncStatus.value.status === 'FAILED') return 'text-red-600'
    if (syncStatus.value.status === 'DONE') return 'text-green-600'
    return 'text-blue-600 dark:text-blue-400'
})

const progressBarClass = computed(() => {
    if (syncStatus.value.status === 'FAILED') return 'bg-red-500'
    if (syncStatus.value.status === 'DONE') return 'bg-green-500'
    return 'bg-blue-600'
})

// Show message from backend as the progress label — it matches the active step
const progressLabel = computed(() => {
    if (!isRunning.value) {
        return syncStatus.value.status === 'DONE' ? 'Complete' : (syncStatus.value.error ? 'Failed' : 'Ready')
    }
    // Strip table name from message — table detail is shown inside the step label
    const msg = syncStatus.value.message || 'Analyzing...'
    return msg.replace(/:\s*\S+$/, '').trim() || msg
})

// Four steps that map to the 0→100% progress range
const analysisSteps = computed(() => {
    const pct = syncStatus.value.progress || 0
    const status = syncStatus.value.status

    return [
        {
            key: 'discover',
            label: 'Discovering all database tables',
            done: pct > 5,
            active: pct > 0 && pct <= 5,
        },
        {
            key: 'schema',
            label: 'Collecting schema & sample data',
            done: pct > 70,
            active: pct > 5 && pct <= 70,
        },
        {
            key: 'ai',
            label: 'Building AI intelligence profile',
            done: pct > 90,
            active: pct > 70 && pct <= 90,
        },
        {
            key: 'save',
            label: 'Saving profile & updating chatbot',
            done: status === 'DONE',
            active: pct > 90 && status !== 'DONE',
        },
    ]
})

const stepIndicatorClass = (step) => {
    if (step.done) return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
    if (step.active) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    return 'bg-gray-100 dark:bg-gray-800'
}

watch(() => syncStatus.value.status, (newStatus, oldStatus) => {
    if (oldStatus === 'RUNNING' && newStatus === 'DONE') {
        emit('sync-complete', props.connection)
    }
})

let unsubscribe = null
onMounted(() => {
    if (connectionId.value) {
        unsubscribe = websocketStore.on('sync.progress.updated', (event) => {
            if (event.connection_id === connectionId.value) {
                console.log('📊 SyncProgressModal update:', event.status, event.progress + '%', event.current_table || '')
            }
        }, 'sync-progress-modal')
    }
})
onUnmounted(() => {
    unsubscribe?.()
    websocketStore.offAll('sync-progress-modal')
})
</script>
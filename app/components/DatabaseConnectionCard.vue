<template>
  <div
    class="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 md:border md:border-gray-200 md:dark:border-slate-800 md:rounded-xl md:shadow-sm md:hover:shadow-md p-4 md:p-6 transition-all duration-300">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

      <!-- Icon & Title -->
      <div class="flex items-center">
        <div
          class="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/20 rounded-lg md:rounded-xl flex items-center justify-center mr-3 md:mr-4 shrink-0">
          <svg class="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
        </div>
        <div>
          <h3 class="text-base md:text-lg font-bold text-gray-900 dark:text-white">{{ connection.name }}</h3>
          <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-mono mt-0.5">
            {{ connection.type?.toUpperCase() }} • {{ connection.connection_config?.host }}
          </p>
          <div class="flex items-center gap-2 mt-1">
            <span v-if="hasProfile"
              class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              AI Profile Ready
            </span>
            <span v-else-if="connection.selected_tables?.length > 0"
              class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
              Needs Analysis
            </span>
          </div>
        </div>
      </div>

      <!-- Status & Actions -->
      <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 mt-2 sm:mt-0">
        <div class="text-left sm:text-right">
          <div class="flex items-center sm:justify-end text-sm">
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold border"
              :class="statusClasses">
              <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="statusDotClass"></span>
              {{ statusText }}
            </span>
          </div>
          <p v-if="connection.last_sync" class="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-1">
            Analyzed: {{ formatLastSync(connection.last_sync) }}
          </p>
        </div>

        <div class="flex items-center gap-1 md:gap-2">
          <!-- Analyze button — starts analysis without opening modal -->
          <button v-if="connection.selected_tables?.length > 0 && !isSyncing" @click="startAnalysis"
            class="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all duration-200 flex items-center gap-1.5 md:gap-2 border bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
            <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span class="hidden sm:inline">{{ hasProfile ? 'Re-analyze' : 'Analyze' }}</span>
          </button>

          <!-- View Progress button — only shown while analysis is running -->
          <button v-if="isSyncing" @click="openModal"
            class="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all duration-200 flex items-center gap-1.5 md:gap-2 border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30">
            <svg class="animate-spin h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span class="hidden sm:inline">{{ syncProgress }}% · View</span>
          </button>

          <button @click="$emit('edit', connectionId)"
            class="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition-colors border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800">
            Edit
          </button>
          <button @click="$emit('delete', connectionId)" :disabled="isSyncing"
            class="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition-colors border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed">
            Del
          </button>
        </div>
      </div>
    </div>

    <!-- Inline mini progress bar (visible even when modal is closed) -->
    <div v-if="isSyncing && syncProgress > 0" class="mt-4">
      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>{{ syncMessage || 'Analyzing...' }}</span>
        <span>{{ syncProgress }}%</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <div class="h-1.5 bg-blue-500 rounded-full transition-all duration-300"
          :style="{ width: `${syncProgress}%` }" />
      </div>
    </div>

    <!-- ─── Modal lives inside the card — each card fully owns its open/close state ─── -->
    <SyncProgressModal v-if="modalMounted" :show="showModal" :connection="connection" @close="closeModal"
      @sync-complete="onSyncComplete" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDatabaseStore } from '~/stores/databaseStore'
import SyncProgressModal from '~/components/sync/SyncProgressModal.vue'

const props = defineProps({
  connection: { type: Object, required: true },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['sync', 'edit', 'delete', 'selectTables'])

const databaseStore = useDatabaseStore()

// ── Connection identity & sync state — declared FIRST so everything below can use them ──
const connectionId = computed(() => props.connection._id || props.connection.id)
const hasProfile = computed(() => !!props.connection.profile_built_at || !!props.connection.database_profile)

const syncStatus = computed(() => databaseStore.getSyncStatusForConnection(connectionId.value))
const isSyncing = computed(() => ['RUNNING', 'PENDING'].includes(syncStatus.value?.status))

// ── Modal state — fully local, never shared with parent ──────────────────────
// modalMounted keeps the component in DOM so WebSocket state persists when minimised.
// showModal drives the visible open/close transition.
const showModal = ref(false)
const modalMounted = ref(false)

// Start analysis WITHOUT opening the modal
const startAnalysis = async () => {
  if (isSyncing.value) return
  try {
    const result = await databaseStore.syncConnection(connectionId.value)
    if (!result?.success) {
      console.error('Failed to start analysis:', result?.message)
    }
    // Auto-mount the modal component so WebSocket updates are tracked,
    // but keep it visually closed — user opens it via "View Progress" button
    modalMounted.value = true
  } catch (err) {
    console.error('Analysis error:', err)
  }
}

// Open progress modal (does NOT start a new sync)
const openModal = () => {
  modalMounted.value = true
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  if (!isSyncing.value) {
    setTimeout(() => { modalMounted.value = false }, 350)
  }
  // Don't fetchConnections on every close — onSyncComplete handles refresh when done
}

const onSyncComplete = async () => {
  // Refresh connection to show updated profile badge
  await databaseStore.fetchConnections()
  // Do NOT emit 'sync' — parent handlers can re-trigger analysis
}

// Watch: when sync finishes and modal is closed, unmount so next open is fresh
watch(() => syncStatus.value?.status, (status) => {
  if (status === 'DONE' && !showModal.value) {
    setTimeout(() => { modalMounted.value = false }, 350)
  }
})
const syncProgress = computed(() => syncStatus.value?.progress || 0)
const syncMessage = computed(() => syncStatus.value?.message)

const statusText = computed(() => {
  if (isSyncing.value) return 'Analyzing'
  if (props.connection.status === 'connected') return 'Connected'
  if (props.connection.status === 'error') return 'Error'
  return props.connection.status || 'Unknown'
})

const statusClasses = computed(() => {
  if (isSyncing.value) return 'bg-blue-50  dark:bg-blue-900/20  border-blue-200  dark:border-blue-800  text-blue-700  dark:text-blue-300'
  if (props.connection.status === 'connected') return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
  if (props.connection.status === 'error') return 'bg-red-50   dark:bg-red-900/20   border-red-200   dark:border-red-800   text-red-700   dark:text-red-300'
  return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
})

const statusDotClass = computed(() => {
  if (isSyncing.value) return 'bg-blue-500 animate-pulse'
  if (props.connection.status === 'connected') return 'bg-green-500'
  if (props.connection.status === 'error') return 'bg-red-500'
  return 'bg-gray-400'
})

const formatLastSync = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
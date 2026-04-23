<template>
    <div class="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-950">

        <!-- ── Header ─────────────────────────────────────────────────────── -->
        <div class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-center gap-4">
                <button
                    class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    title="Close Editor"
                    @click="handleClose">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div>
                    <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                        {{ headerTitle }}
                    </h2>
                    <p v-if="isCampaignMode || formData.name"
                        class="text-sm text-gray-500 dark:text-gray-400">
                        {{ isCampaignMode ? 'Editing campaign email' : formData.name }}
                    </p>
                </div>

                <span v-if="autoSaveStatus"
                    class="rounded-lg bg-blue-50 px-3 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {{ autoSaveStatus }}
                </span>
            </div>

            <div class="flex items-center gap-3">
                <button
                    class="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
                    @click="sendTestEmail">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Test
                </button>

                <!-- Template mode: Save Draft -->
                <button
                    v-if="!isCampaignMode"
                    :disabled="saving"
                    class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-slate-700 dark:text-gray-200 dark:hover:bg-slate-800"
                    @click="saveDraft">
                    {{ saving ? 'Saving…' : 'Save Draft' }}
                </button>

                <!-- Campaign mode: Apply to Campaign -->
                <button
                    v-if="isCampaignMode"
                    :disabled="saving"
                    class="flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                    @click="applyToCampaign">
                    <svg v-if="!saving" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <svg v-else class="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {{ saving ? 'Applying…' : 'Apply to Campaign' }}
                </button>

                <!-- Template mode: Publish -->
                <button
                    v-if="!isCampaignMode"
                    :disabled="!canPublish || publishing"
                    :class="[
                        'rounded-lg px-6 py-2 text-sm font-semibold transition-colors',
                        canPublish && !publishing
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-slate-700 dark:text-slate-500'
                    ]"
                    @click="publishTemplate">
                    {{ publishing ? 'Publishing…' : 'Publish Template' }}
                </button>
            </div>
        </div>

        <!-- ── Template details bar (template mode only) ───────────────────── -->
        <div v-if="!isCampaignMode"
            class="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
            <div class="grid grid-cols-3 gap-4">
                <div>
                    <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Template Name <span class="text-red-500">*</span>
                    </label>
                    <input v-model="formData.name" type="text" placeholder="e.g. Welcome Email"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                    <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <input v-model="formData.category" type="text" placeholder="e.g. Newsletter"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                    <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Subject Line <span class="text-red-500">*</span>
                    </label>
                    <input v-model="formData.subject" type="text" placeholder="Email subject…"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </div>
            </div>
        </div>

        <!-- ── Unlayer editor canvas ───────────────────────────────────────── -->
        <div class="relative flex-1 overflow-hidden">
            <!-- Loading overlay -->
            <div v-if="editorLoading"
                class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-950">
                <div class="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Loading editor…</p>
            </div>

            <!-- Error state -->
            <div v-if="editorError"
                class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-950">
                <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
                    <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200">Editor failed to load</p>
                <button
                    class="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
                    @click="retryInit">
                    Retry
                </button>
            </div>

            <div id="unlayer-editor-canvas" class="h-full w-full"></div>
        </div>

        <!-- ── Test Email Modal ────────────────────────────────────────────── -->
        <TestEmailModal v-if="showTestEmailModal" @send="handleSendTest" @close="showTestEmailModal = false" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, toRaw } from 'vue'
import TestEmailModal from './TestEmailModal.vue'
import { useToast } from 'vue-toastification'

// ─── Props ──────────────────────────────────────────────────────────────────

const props = defineProps({
   
    mode: {
        type: String,
        default: 'template',
        validator: (v) => ['template', 'campaign'].includes(v),
    },

    // Template mode
    template: {
        type: Object,
        default: null,
    },

    // Campaign mode: pre-load existing campaign content
    initialHtml: {
        type: String,
        default: '',
    },
    initialDesign: {
        type: [Object, String, Array],
        default: null,
    },
})

const emit = defineEmits(['close', 'saved', 'save'])

// ─── Setup ──────────────────────────────────────────────────────────────────

const emailStore  = useEmailMarketingStore()
const $toast      = useToast()

const formData = ref({
    name: '',
    description: '',
    subject: '',
    category: '',
    html_content: '',
    unlayer_design: null,
})

const autoSaveStatus    = ref('')
const showTestEmailModal = ref(false)
const templateId        = ref(null)
const autoSaveInterval  = ref(null)
const saving            = ref(false)
const publishing        = ref(false)
const editorLoading     = ref(true)
const editorError       = ref(false)

// ─── Computed ────────────────────────────────────────────────────────────────

const isCampaignMode = computed(() => props.mode === 'campaign')
const isEditing      = computed(() => !isCampaignMode.value && !!props.template)

const headerTitle = computed(() => {
    if (isCampaignMode.value) return 'Email Designer'
    return isEditing.value ? 'Edit Template' : 'Create Template'
})

const canPublish = computed(() => {
    if (isCampaignMode.value) return true
    return !!(formData.value.name && formData.value.subject)
})

// ─── Unlayer helpers ─────────────────────────────────────────────────────────

/**
 * Promisified exportHtml so we can properly await it.
 */
const exportHtmlAsync = () =>
    new Promise((resolve, reject) => {
        if (typeof unlayer === 'undefined') {
            reject(new Error('Unlayer is not initialised'))
            return
        }
        unlayer.exportHtml((data) => resolve(data))
    })

const initUnlayer = () => {
    if (typeof unlayer === 'undefined') {
        editorError.value   = true
        editorLoading.value = false
        return
    }

    editorError.value = false

    unlayer.init({
        id: 'unlayer-editor-canvas',
        projectId: 0,
        displayMode: 'email',
        mergeTags: {
            first_name:   { name: 'First Name',   value: '{{first_name}}'   },
            last_name:    { name: 'Last Name',     value: '{{last_name}}'    },
            full_name:    { name: 'Full Name',     value: '{{full_name}}'    },
            email:        { name: 'Email',         value: '{{email}}'        },
            company_name: { name: 'Company Name',  value: '{{company_name}}' },
        },
    })

    unlayer.addEventListener('editor:ready', () => {
        editorLoading.value = false
        loadDesignIfNeeded()
    })
}

const loadDesignIfNeeded = () => {
    if (isCampaignMode.value) {
        // Load campaign's existing design (if any)
        if (props.initialDesign) {
            const design = typeof props.initialDesign === 'string'
                ? JSON.parse(props.initialDesign)
                : toRaw(props.initialDesign)
            unlayer.loadDesign(design)
        }
        return
    }

    // Template mode
    if (isEditing.value && props.template?.unlayer_design) {
        const design = typeof props.template.unlayer_design === 'string'
            ? JSON.parse(props.template.unlayer_design)
            : toRaw(props.template.unlayer_design)
        unlayer.loadDesign(design)
    }
}

const retryInit = () => {
    editorError.value   = false
    editorLoading.value = true
    initUnlayer()
}

// ─── Template mode: auto-save ────────────────────────────────────────────────

const autoSave = async () => {
    if (isCampaignMode.value || !formData.value.name) return

    autoSaveStatus.value = 'Saving…'
    try {
        const data = await exportHtmlAsync()
        formData.value.html_content    = data.html
        formData.value.unlayer_design  = JSON.stringify(data.design)

        templateId.value = await emailStore.autoSaveTemplate(formData.value, templateId.value)
        autoSaveStatus.value = `Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } catch {
        autoSaveStatus.value = 'Auto-save failed'
    }
}

// ─── Template mode: Save Draft ───────────────────────────────────────────────

const saveDraft = async () => {
    saving.value = true
    try {
        const data = await exportHtmlAsync()
        formData.value.html_content   = data.html
        formData.value.unlayer_design = JSON.stringify(data.design)

        templateId.value = await emailStore.autoSaveTemplate(formData.value, templateId.value)
        $toast.success('Draft saved')
    } catch {
        $toast.error('Failed to save draft')
    } finally {
        saving.value = false
    }
}

// ─── Template mode: Publish ──────────────────────────────────────────────────

const publishTemplate = async () => {
    if (!canPublish.value || publishing.value) return

    publishing.value = true
    try {
        const data = await exportHtmlAsync()
        formData.value.html_content   = data.html
        formData.value.unlayer_design = JSON.stringify(data.design)
        formData.value.publish        = 1

        if (isEditing.value) {
            await emailStore.updateTemplate(props.template.id, formData.value)
        } else {
            await emailStore.createTemplate(formData.value)
        }

        $toast.success('Template published!')
        emit('saved')
    } catch {
        $toast.error('Failed to publish template')
    } finally {
        publishing.value = false
    }
}

// ─── Campaign mode: Apply to Campaign ────────────────────────────────────────

const applyToCampaign = async () => {
    saving.value = true
    try {
        const data = await exportHtmlAsync()
        // Emit back to CampaignEditorModal with {html, design}
        emit('save', {
            html:   data.html,
            design: data.design,
        })
    } catch {
        $toast.error('Failed to export design please try again')
    } finally {
        saving.value = false
    }
}

// ─── Test email ──────────────────────────────────────────────────────────────

const sendTestEmail = () => {
    showTestEmailModal.value = true
}

const handleSendTest = async (email) => {
    try {
        const data = await exportHtmlAsync()
        await emailStore.sendTestEmail({
            to_email:     email,
            subject:      formData.value.subject || 'Test email',
            html_content: data.html,
        })
        $toast.success(`Test email sent to ${email}`)
        showTestEmailModal.value = false
    } catch {
        $toast.error('Failed to send test email')
    }
}

// ─── Close ───────────────────────────────────────────────────────────────────

const handleClose = () => {
    emit('close')
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────

onMounted(() => {
    // Pre-populate form for template editing
    if (isEditing.value && props.template) {
        Object.assign(formData.value, props.template)
        templateId.value = props.template.id
    }

    const mountEditor = () => {
        initUnlayer()
        // Only start auto-save interval in template mode
        if (!isCampaignMode.value) {
            autoSaveInterval.value = setInterval(autoSave, 30_000)
        }
    }

    if (typeof window.unlayer === 'undefined') {
        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src*="editor.unlayer.com"]')
        if (existingScript) {
            existingScript.addEventListener('load', mountEditor)
        } else {
            const script     = document.createElement('script')
            script.src       = '//editor.unlayer.com/embed.js'
            script.async     = true
            script.onload    = mountEditor
            script.onerror   = () => {
                editorError.value   = true
                editorLoading.value = false
            }
            document.head.appendChild(script)
        }
    } else {
        mountEditor()
    }
})

onUnmounted(() => {
    if (autoSaveInterval.value) {
        clearInterval(autoSaveInterval.value)
    }
})
</script>
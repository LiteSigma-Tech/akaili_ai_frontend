<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
            style="max-height: 85vh;">

            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-slate-800">
                <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">Choose Email Template</h2>
                    <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Start from a template or build from
                        scratch</p>
                </div>
                <button
                    class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-800 dark:hover:text-gray-200"
                    @click="$emit('close')">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Filters -->
            <div
                class="flex flex-col gap-3 border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30 sm:flex-row sm:items-center">
                <div class="relative flex-1">
                    <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
                    </svg>
                    <input v-model="searchQuery" type="text" placeholder="Search templates…"
                        class="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-gray-500" />
                </div>

                <select v-model="categoryFilter"
                    class="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option value="">All Categories</option>
                    <option v-for="category in emailStore.templateCategories" :key="category" :value="category">
                        {{ category }}
                    </option>
                </select>

                <select v-model="ownershipFilter"
                    class="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option value="all">All Templates</option>
                    <option value="my">My Templates</option>
                    <option value="global">Global Templates</option>
                </select>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-6">

                <!-- Loading -->
                <div v-if="emailStore.templatesLoading" class="flex flex-col items-center justify-center py-16 gap-3">
                    <div class="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600">
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Loading templates…</p>
                </div>

                <!-- Empty State -->
                <div v-else-if="filteredTemplates.length === 0"
                    class="flex flex-col items-center justify-center py-16 text-center">
                    <div
                        class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800">
                        <svg class="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 class="mb-1 text-base font-semibold text-gray-900 dark:text-white">No templates found</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters</p>
                </div>

                <!-- Templates Grid -->
                <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    <!-- Start from Scratch card -->
                    <div class="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-8 text-center transition-all hover:border-purple-400 hover:bg-purple-50 dark:border-slate-700 dark:hover:border-purple-600 dark:hover:bg-purple-900/10"
                        @click="selectBlank">
                        <div
                            class="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 transition-colors group-hover:bg-purple-100 dark:bg-slate-800 dark:group-hover:bg-purple-900/30">
                            <svg class="h-7 w-7 text-gray-400 transition-colors group-hover:text-purple-600 dark:text-gray-500 dark:group-hover:text-purple-400"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <p
                            class="font-semibold text-gray-900 transition-colors group-hover:text-purple-700 dark:text-white dark:group-hover:text-purple-300">
                            Start from Scratch
                        </p>
                        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Build your own template from a blank
                            canvas</p>
                    </div>

                    <!-- Template Cards -->
                    <div v-for="template in filteredTemplates" :key="template.id"
                        class="group overflow-hidden rounded-xl border border-gray-200 transition-all hover:border-purple-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-purple-600 dark:hover:shadow-none">

                        <!-- Thumbnail -->
                        <div
                            class="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
                            <img v-if="template.thumbnail" :src="template.thumbnail" :alt="template.name"
                                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            <div v-else class="flex h-full w-full items-center justify-center">
                                <svg class="h-12 w-12 text-gray-300 dark:text-slate-700" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>

                            <!-- Badges -->
                            <div class="absolute left-2 top-2 flex gap-1.5">
                                <span v-if="template.is_global"
                                    class="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                                    Global
                                </span>
                                <span v-else
                                    class="rounded-full bg-purple-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                                    My Template
                                </span>
                            </div>

                            <!-- Hover action overlay -->
                            <div
                                class="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                <button
                                    class="rounded-lg border border-white/70 bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                                    @click.stop="openPreview(template)">
                                    Preview
                                </button>
                                <button
                                    class="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white shadow-md transition-colors hover:bg-purple-700"
                                    @click.stop="selectTemplate(template)">
                                    Use Template
                                </button>
                            </div>
                        </div>

                        <!-- Info -->
                        <div class="p-4">
                            <h3 class="mb-1 truncate font-semibold text-gray-900 dark:text-white">{{ template.name }}
                            </h3>
                            <p v-if="template.description"
                                class="mb-2 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                                {{ template.description }}
                            </p>
                            <div class="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                                <span v-if="template.category"
                                    class="rounded bg-gray-100 px-2 py-0.5 dark:bg-slate-800">{{ template.category
                                    }}</span>
                                <span v-if="template.usage_count">{{ template.usage_count }} uses</span>
                            </div>
                            <div v-if="template.tags?.length" class="mt-2 flex flex-wrap gap-1">
                                <span v-for="tag in template.tags.slice(0, 3)" :key="tag"
                                    class="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400">
                                    {{ tag }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Preview Modal -->
        <EmailPreviewModal v-if="showPreview && previewItem" :html-content="previewHtml" :subject="previewItem.subject"
            @close="closePreview" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EmailPreviewModal from './EmailPreviewModal.vue'
import { useToast } from 'vue-toastification'

const emit = defineEmits(['select', 'close'])
const emailStore = useEmailMarketingStore()
const $toast = useToast()

const searchQuery = ref('')
const categoryFilter = ref('')
const ownershipFilter = ref('all')
const showPreview = ref(false)
const previewItem = ref(null)
const previewHtml = ref('')

const filteredTemplates = computed(() => {
    let templates = emailStore.templates

    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        templates = templates.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q)
        )
    }

    if (categoryFilter.value) {
        templates = templates.filter(t => t.category === categoryFilter.value)
    }

    if (ownershipFilter.value === 'my') {
        templates = templates.filter(t => !t.is_global)
    } else if (ownershipFilter.value === 'global') {
        templates = templates.filter(t => t.is_global)
    }

    return templates
})

const selectBlank = () => {
    // Emit a minimal blank object; CampaignEditorModal will still open the editor
    emit('select', { id: null, name: 'Blank Template', html_content: '', unlayer_design: null })
}

const selectTemplate = (template) => {
    emit('select', template)
}

const openPreview = async (template) => {
    try {
        const data = await emailStore.previewTemplate(template.id)
        previewHtml.value = data.html_content
        previewItem.value = template
        showPreview.value = true
    } catch {
        $toast.error('Failed to load template preview')
    }
}

const closePreview = () => {
    showPreview.value = false
    previewItem.value = null
    previewHtml.value = ''
}

onMounted(async () => {
    if (emailStore.templates.length === 0) {
        await emailStore.fetchTemplates()
    }
    if (emailStore.templateCategories.length === 0) {
        await emailStore.fetchTemplateCategories()
    }
})
</script>
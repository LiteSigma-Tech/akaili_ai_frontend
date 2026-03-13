<!-- CampaignEditorModal.vue — Step-by-step campaign wizard -->
<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
            style="max-height: 90vh;">

            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-slate-800">
                <div>
                    <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                        {{ isEditing ? 'Edit Campaign' : 'New Campaign' }}
                    </h2>
                    <p v-if="autoSavedAt" class="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                        Saved {{ autoSavedAt }}
                    </p>
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

            <!-- Step indicator -->
            <div class="border-b border-gray-100 px-6 py-4 dark:border-slate-800">
                <div class="flex items-center gap-0">
                    <div v-for="(step, idx) in steps" :key="idx" class="flex items-center"
                        :class="idx < steps.length - 1 ? 'flex-1' : ''">
                        <button class="group flex flex-col items-center gap-1 disabled:cursor-default"
                            :disabled="!canGoToStep(idx)" @click="goToStep(idx)">
                            <div :class="[
                                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all',
                                currentStep === idx
                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-purple-900/30'
                                    : idx < currentStep
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-gray-500'
                            ]">
                                <svg v-if="idx < currentStep" class="h-4 w-4" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                                <span v-else>{{ idx + 1 }}</span>
                            </div>
                            <span :class="[
                                'whitespace-nowrap text-xs font-medium transition-colors',
                                currentStep === idx
                                    ? 'text-purple-600 dark:text-purple-400'
                                    : idx < currentStep
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-gray-400 dark:text-gray-500'
                            ]">{{ step.label }}</span>
                        </button>

                        <div v-if="idx < steps.length - 1" class="mb-5 h-0.5 flex-1 mx-3 transition-colors"
                            :class="idx < currentStep ? 'bg-green-400' : 'bg-gray-200 dark:bg-slate-700'"></div>
                    </div>
                </div>
            </div>

            <!-- Step content -->
            <div class="flex-1 overflow-y-auto">

                <!-- STEP 0: Setup -->
                <div v-if="currentStep === 0" class="space-y-5 p-6">
                    <div>
                        <h3 class="mb-1 text-base font-semibold text-gray-900 dark:text-white">Campaign details</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Give your campaign a name and choose your
                            audience.</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Campaign name <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.name" type="text" placeholder="e.g. November Newsletter"
                                class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                        </div>

                        <div class="col-span-2">
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description <span class="font-normal text-gray-400">(optional)</span>
                            </label>
                            <textarea v-model="form.description" rows="2"
                                placeholder="Internal notes about this campaign…"
                                class="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"></textarea>
                        </div>
                    </div>

                    <hr class="border-gray-100 dark:border-slate-800">

                    <div>
                        <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Sender details</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                                    From name <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.from_name" type="text" placeholder="Your Company"
                                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                            </div>
                            <div>
                                <label class="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                                    From email <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.from_email" type="email" placeholder="hello@yourcompany.com"
                                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                            </div>
                            <div class="col-span-2">
                                <label class="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Reply-to <span class="font-normal text-gray-400">(optional)</span>
                                </label>
                                <input v-model="form.reply_to" type="email" placeholder="replies@yourcompany.com"
                                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                            </div>
                        </div>
                    </div>

                    <hr class="border-gray-100 dark:border-slate-800">

                    <div>
                        <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Recipients</h4>
                        <label class="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Email list <span class="text-red-500">*</span>
                        </label>
                        <select v-model="form.list_id"
                            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                            <option value="">Select a list…</option>
                            <option v-for="list in emailStore.lists" :key="list.id" :value="list.id">
                                {{ list.name }} ({{ list.active_subscribers || 0 }} subscribers)
                            </option>
                        </select>

                        <div v-if="selectedList"
                            class="mt-3 flex items-center gap-3 rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                            <div
                                class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
                                <svg class="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-purple-700 dark:text-purple-300">
                                    {{ selectedList.active_subscribers || 0 }} recipients
                                </p>
                                <p class="text-xs text-purple-500 dark:text-purple-400">from {{ selectedList.name }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- STEP 1: Content -->
                <div v-if="currentStep === 1" class="space-y-5 p-6">
                    <div>
                        <h3 class="mb-1 text-base font-semibold text-gray-900 dark:text-white">Email content</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Write your subject line and design your
                            email.</p>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Subject line <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.subject" type="text" placeholder="Your email subject line…"
                            class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                        <p class="mt-1.5 text-xs text-gray-400">
                            {{ form.subject?.length || 0 }}/100 characters
                            <span v-if="form.subject && form.subject.length > 60" class="text-amber-500">
                                · Consider shortening for better open rates
                            </span>
                        </p>
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Email
                            design</label>

                        <!-- No design yet -->
                        <div v-if="!form.html_content"
                            class="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center dark:border-slate-700">
                            <div
                                class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800">
                                <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">No design yet</p>
                            <p class="mb-4 text-xs text-gray-400 dark:text-gray-500">Choose a template or build from
                                scratch.</p>
                            <div class="flex items-center justify-center gap-3">
                                <button
                                    class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
                                    @click="showTemplateSelector = true">
                                    Choose template
                                </button>
                                <button
                                    class="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700"
                                    @click="openEditor">
                                    Open editor
                                </button>
                            </div>
                        </div>

                        <!-- Has design -->
                        <div v-else class="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700">
                            <div class="relative h-32 overflow-hidden bg-gray-50 dark:bg-slate-800">
                                <iframe class="pointer-events-none h-full w-full origin-top-left"
                                    style="transform: scale(0.5); width: 200%; height: 200%;"
                                    :srcdoc="form.html_content"
                                    sandbox="allow-same-origin"></iframe>
                                <div
                                    class="absolute inset-0 bg-gradient-to-b from-transparent to-white/40 dark:to-slate-800/40">
                                </div>
                            </div>
                            <div class="flex items-center justify-between p-3">
                                <div class="flex items-center gap-2">
                                    <span class="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                                d="M5 13l4 4L19 7" />
                                        </svg>
                                        Email design ready
                                    </span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button class="text-xs text-purple-600 hover:underline dark:text-purple-400"
                                        @click="previewEmail = true">
                                        Preview
                                    </button>
                                    <button
                                        class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
                                        @click="openEditor">
                                        Edit
                                    </button>
                                    <button
                                        class="rounded-lg border border-blue-200 px-3 py-1.5 text-xs text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                        @click="sendTestEmail">
                                        Send test
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- STEP 2: Schedule -->
                <div v-if="currentStep === 2" class="space-y-5 p-6">
                    <div>
                        <h3 class="mb-1 text-base font-semibold text-gray-900 dark:text-white">When to send</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Send immediately or schedule for a future
                            date and time.</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <button :class="[
                            'rounded-xl border-2 p-4 text-left transition-all',
                            sendImmediately
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-200 hover:border-purple-200 dark:border-slate-700 dark:hover:border-purple-700/50'
                        ]" @click="sendImmediately = true; form.send_date = null">
                            <div class="mb-2 flex items-center justify-between">
                                <div
                                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <svg class="h-4 w-4 text-green-600 dark:text-green-400" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </div>
                                <div v-if="sendImmediately"
                                    class="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600">
                                    <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                    </svg>
                                </div>
                            </div>
                            <p class="text-sm font-semibold text-gray-900 dark:text-white">Send immediately</p>
                            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Start sending as soon as you
                                confirm</p>
                        </button>

                        <button :class="[
                            'rounded-xl border-2 p-4 text-left transition-all',
                            !sendImmediately
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-200 hover:border-purple-200 dark:border-slate-700 dark:hover:border-purple-700/50'
                        ]" @click="sendImmediately = false">
                            <div class="mb-2 flex items-center justify-between">
                                <div
                                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <svg class="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div v-if="!sendImmediately"
                                    class="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600">
                                    <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                    </svg>
                                </div>
                            </div>
                            <p class="text-sm font-semibold text-gray-900 dark:text-white">Schedule for later</p>
                            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Pick a date and time to send</p>
                        </button>
                    </div>

                    <div v-if="!sendImmediately" class="space-y-3">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    class="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">Date</label>
                                <input v-model="scheduleDate" type="date" :min="today"
                                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                            </div>
                            <div>
                                <label
                                    class="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">Time</label>
                                <input v-model="scheduleTime" type="time"
                                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                            </div>
                        </div>

                        <div v-if="scheduleDate && scheduleTime"
                            class="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                            <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Will be sent on {{ formatScheduledDate }}
                        </div>
                    </div>
                </div>

                <!-- STEP 3: Review -->
                <div v-if="currentStep === 3" class="space-y-5 p-6">
                    <div>
                        <h3 class="mb-1 text-base font-semibold text-gray-900 dark:text-white">Review &amp; confirm</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Check everything looks right before sending.
                        </p>
                    </div>

                    <div
                        class="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 dark:divide-slate-800 dark:border-slate-700">
                        <div class="flex items-center justify-between px-4 py-3">
                            <span class="text-sm text-gray-500 dark:text-gray-400">Campaign</span>
                            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ form.name }}</span>
                        </div>
                        <div class="flex items-center justify-between px-4 py-3">
                            <span class="text-sm text-gray-500 dark:text-gray-400">Subject</span>
                            <span class="max-w-xs truncate text-sm font-medium text-gray-900 dark:text-white">{{
                                form.subject }}</span>
                        </div>
                        <div class="flex items-center justify-between px-4 py-3">
                            <span class="text-sm text-gray-500 dark:text-gray-400">From</span>
                            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ form.from_name }} &lt;{{
                                form.from_email }}&gt;</span>
                        </div>
                        <div class="flex items-center justify-between px-4 py-3">
                            <span class="text-sm text-gray-500 dark:text-gray-400">Recipients</span>
                            <span class="text-sm font-semibold text-purple-600 dark:text-purple-400">
                                {{ selectedList?.active_subscribers || 0 }} contacts from {{ selectedList?.name }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between px-4 py-3">
                            <span class="text-sm text-gray-500 dark:text-gray-400">Send time</span>
                            <span class="text-sm font-medium text-gray-900 dark:text-white">
                                {{ sendImmediately ? 'Immediately' : formatScheduledDate }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between px-4 py-3">
                            <span class="text-sm text-gray-500 dark:text-gray-400">Email design</span>
                            <span
                                :class="['text-sm font-medium', form.html_content ? 'text-green-600 dark:text-green-400' : 'text-red-500']">
                                {{ form.html_content ? '✓ Ready' : '✗ Missing' }}
                            </span>
                        </div>
                    </div>

                    <div :class="[
                        'flex items-start gap-3 rounded-xl border p-4',
                        isReadyToSend
                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                            : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
                    ]">
                        <svg v-if="isReadyToSend" class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <svg v-else class="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <p :class="['text-sm font-medium',
                                isReadyToSend ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300']">
                                {{ isReadyToSend ? 'Campaign is ready to send!' : 'Incomplete — please fix before sending' }}
                            </p>
                            <ul v-if="!isReadyToSend" class="mt-1 space-y-0.5">
                                <li v-for="issue in reviewIssues" :key="issue"
                                    class="text-xs text-amber-600 dark:text-amber-400">
                                    · {{ issue }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between border-t border-gray-100 px-6 py-4 dark:border-slate-800">
                <div class="flex items-center gap-3">
                    <button v-if="currentStep > 0"
                        class="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
                        @click="currentStep--">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                    <button
                        class="text-sm text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50 dark:text-gray-500 dark:hover:text-gray-300"
                        :disabled="saving" @click="saveDraft">
                        {{ saving ? 'Saving…' : 'Save draft' }}
                    </button>
                </div>

                <div>
                    <button v-if="currentStep < steps.length - 1"
                        class="flex items-center gap-1.5 rounded-lg bg-purple-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                        :disabled="!canAdvance" @click="nextStep">
                        Next
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <button v-else :class="[
                        'flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40',
                        sendImmediately ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                    ]" :disabled="!isReadyToSend || sending" @click="confirmSend">
                        <svg v-if="!sending" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path v-if="sendImmediately" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <svg v-else class="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {{ sending ? 'Processing…' : sendImmediately ? 'Send Campaign' : 'Schedule Campaign' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Sub-modals -->
        <TemplateSelectorModal v-if="showTemplateSelector" @select="onTemplateSelected"
            @close="showTemplateSelector = false" />

        <!--
            FIX: Pass mode="campaign" so the editor:
              - Shows "Apply to Campaign" instead of "Publish Template"
              - Emits @save (not @saved) with {html, design}
              - Does NOT call autoSaveTemplate in the background
              - Loads from :initial-html/:initial-design instead of :template
        -->
        <TemplateEditorFullscreen
            v-if="showFullEditor"
            mode="campaign"
            :initial-html="form.html_content"
            :initial-design="form.unlayer_design"
            @save="onEditorSave"
            @close="showFullEditor = false" />

        <EmailPreviewModal v-if="previewEmail && form.html_content" :html-content="form.html_content"
            :subject="form.subject" @close="previewEmail = false" />

        <TestEmailModal v-if="showTestEmailModal" @send="handleSendTest" @close="showTestEmailModal = false" />
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import TemplateSelectorModal from './TemplateSelectorModal.vue'
import TemplateEditorFullscreen from './TemplateEditorFullscreen.vue'
import EmailPreviewModal from './EmailPreviewModal.vue'
import TestEmailModal from './TestEmailModal.vue'
import { useToast } from 'vue-toastification'

const props = defineProps({
    campaign: { type: Object, default: null },
})
const emit = defineEmits(['close', 'saved'])

const emailStore = useEmailMarketingStore()
const $toast     = useToast()

const currentStep         = ref(0)
const saving              = ref(false)
const sending             = ref(false)
const campaignId          = ref(null)
const autoSavedAt         = ref(null)
const sendImmediately     = ref(true)
const scheduleDate        = ref('')
const scheduleTime        = ref('09:00')
const showTemplateSelector = ref(false)
const showFullEditor      = ref(false)
const previewEmail        = ref(false)
const showTestEmailModal  = ref(false)

const form = ref({
    name:           '',
    description:    '',
    subject:        '',
    from_name:      '',
    from_email:     '',
    reply_to:       '',
    list_id:        '',
    html_content:   '',
    unlayer_design: null,
    send_date:      null,
})

const steps = [
    { label: 'Setup' },
    { label: 'Content' },
    { label: 'Schedule' },
    { label: 'Review' },
]

const isEditing        = computed(() => !!props.campaign)
const today            = computed(() => new Date().toISOString().split('T')[0])
const selectedList     = computed(() => emailStore.lists?.find((l) => l.id === form.value.list_id) || null)

const formatScheduledDate = computed(() => {
    if (!scheduleDate.value || !scheduleTime.value) return ''
    const d = new Date(`${scheduleDate.value}T${scheduleTime.value}`)
    return d.toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true,
    })
})

const canAdvance = computed(() => {
    if (currentStep.value === 0)
        return !!(form.value.name && form.value.from_name && form.value.from_email && form.value.list_id)
    if (currentStep.value === 1)
        return !!(form.value.subject && form.value.html_content)
    if (currentStep.value === 2)
        return sendImmediately.value || !!(scheduleDate.value && scheduleTime.value)
    return true
})

const reviewIssues = computed(() => {
    const issues = []
    if (!form.value.name)       issues.push('Campaign name is required')
    if (!form.value.subject)    issues.push('Subject line is required')
    if (!form.value.from_email) issues.push('From email is required')
    if (!form.value.list_id)    issues.push('Recipient list is required')
    if (!form.value.html_content) issues.push('Email design is required')
    if (!sendImmediately.value && (!scheduleDate.value || !scheduleTime.value))
        issues.push('Schedule date and time are required')
    return issues
})

const isReadyToSend = computed(() => reviewIssues.value.length === 0)
const canGoToStep   = (idx) => idx <= currentStep.value
const goToStep      = (idx) => { if (canGoToStep(idx)) currentStep.value = idx }

let autoSaveTimer = null
watch(form, () => {
    clearTimeout(autoSaveTimer)
    autoSaveTimer = setTimeout(autoSave, 5000)
}, { deep: true })

const autoSave = async () => {
    if (!form.value.name) return
    try {
        const id = await emailStore.autoSaveCampaign(form.value, campaignId.value)
        if (id) campaignId.value = id
        autoSavedAt.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
        // silent — auto-save failures don't need to surface to the user
    }
}

const nextStep = () => {
    if (canAdvance.value && currentStep.value < steps.length - 1) {
        autoSave()
        currentStep.value++
    }
}

const saveDraft = async () => {
    saving.value = true
    try {
        const id = await emailStore.autoSaveCampaign(form.value, campaignId.value)
        if (id) campaignId.value = id
        autoSavedAt.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        $toast.success('Draft saved')
    } catch {
        $toast.error('Failed to save draft')
    } finally {
        saving.value = false
    }
}

const confirmSend = async () => {
    if (!isReadyToSend.value || sending.value) return
    sending.value = true
    try {
        // Ensure campaign is saved before dispatching
        if (!campaignId.value) {
            const id = await emailStore.autoSaveCampaign(form.value, null)
            campaignId.value = id
        } else {
            await emailStore.autoSaveCampaign(form.value, campaignId.value)
        }

        if (sendImmediately.value) {
            await emailStore.sendCampaign(campaignId.value)
            $toast.success('Campaign is being sent!')
        } else {
            const sendDate = new Date(`${scheduleDate.value}T${scheduleTime.value}`).toISOString()
            await emailStore.scheduleCampaign(campaignId.value, sendDate)
            $toast.success('Campaign scheduled successfully!')
        }
        emit('saved')
    } catch (err) {
        const msg = err?.data?.message || err?.message || 'Failed to process campaign'
        $toast.error(msg)
    } finally {
        sending.value = false
    }
}

const openEditor = () => { showFullEditor.value = true }

const onTemplateSelected = (template) => {
    showTemplateSelector.value = false
    if (template.html_content) {
        form.value.html_content    = template.html_content
        form.value.unlayer_design  = template.unlayer_design || null
    }
    // Always open the editor so user can further customise
    showFullEditor.value = true
}

/**
 * FIX: this is called by @save from TemplateEditorFullscreen (campaign mode).
 * The editor emits { html, design } via the promisified exportHtml.
 */
const onEditorSave = ({ html, design }) => {
    form.value.html_content    = html
    form.value.unlayer_design  = design
    showFullEditor.value       = false
    // Immediately auto-save so the content is persisted
    autoSave()
}

const sendTestEmail = () => { showTestEmailModal.value = true }

const handleSendTest = async (email) => {
    try {
        await emailStore.sendTestEmail({
            to_email:     email,
            subject:      form.value.subject || 'Test email',
            html_content: form.value.html_content,
        })
        $toast.success(`Test email sent to ${email}`)
        showTestEmailModal.value = false
    } catch {
        $toast.error('Failed to send test email')
    }
}

onMounted(async () => {
    if (!emailStore.lists?.length) {
        await emailStore.fetchLists()
    }
    if (props.campaign) {
        Object.assign(form.value, props.campaign)
        // Normalise: backend may return either 'content' or 'html_content'
        if (!form.value.html_content && props.campaign.content) {
            form.value.html_content = props.campaign.content
        }
        campaignId.value    = props.campaign.id
        sendImmediately.value = !props.campaign.send_date
        if (props.campaign.send_date) {
            const d            = new Date(props.campaign.send_date)
            scheduleDate.value = d.toISOString().split('T')[0]
            scheduleTime.value = d.toTimeString().slice(0, 5)
        }
    }
})
</script>
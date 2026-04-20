<!-- pages/dashboard/intelligence.vue -->
<template>
    <div
        class="flex h-[100dvh] flex-col overflow-hidden bg-white font-sans selection:bg-purple-500/30 dark:bg-slate-950">

        <!-- ══════════════════════════════════════
         DESKTOP HEADER
    ══════════════════════════════════════ -->
        <div
            class="hidden shrink-0 border-b border-gray-200 bg-gray-50 p-6 dark:border-slate-800 dark:bg-slate-950 md:block">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600">
                        <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-2xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">
                            Digital Brain
                        </h1>
                        <p class="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Query your business data in plain English, full internal access
                        </p>
                    </div>
                </div>

                <!-- Active bot chip -->
                <div v-if="selectedChatbot"
                    class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div class="flex items-center gap-2">
                        <span class="h-2 w-2 rounded-full"
                            :class="selectedChatbot.is_active ? 'bg-green-500' : 'bg-yellow-400'"></span>
                        <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ selectedChatbot.name
                        }}</span>
                    </div>
                    <div class="h-4 w-px bg-gray-200 dark:bg-slate-700"></div>
                    <span class="text-xs font-medium text-purple-600 dark:text-purple-400">
                        {{ connectedDatabases }} source{{ connectedDatabases !== 1 ? 's' : '' }}
                    </span>
                </div>

                <!-- Point 5A/5B quick-access buttons -->
                <div class="flex items-center gap-2 ml-2">
                    <button @click="showInsightsPanel = !showInsightsPanel"
                        class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors border"
                        :class="showInsightsPanel
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 dark:bg-slate-900 dark:text-gray-300 dark:border-slate-700'">
                        <span>📊</span> Insights
                        <span v-if="intelligenceStore.okInsights.length"
                            class="ml-0.5 bg-white/20 text-white rounded-full px-1.5 py-0.5 text-[10px] font-black">
                            {{ intelligenceStore.okInsights.length }}
                        </span>
                    </button>
                    <button @click="showReportsPanel = !showReportsPanel"
                        class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors border"
                        :class="showReportsPanel
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 dark:bg-slate-900 dark:text-gray-300 dark:border-slate-700'">
                        <span>📁</span> Reports
                    </button>
                </div>
            </div>
        </div>

        <!-- ══════════════════════════════════════
         MOBILE TOP BAR
    ══════════════════════════════════════ -->
        <header
            class="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 md:hidden">
            <button class="-ml-2 p-2 text-slate-500 transition-transform active:scale-90 dark:text-slate-400"
                @click="mobilePanel = 'prompts'">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <button class="flex max-w-[200px] flex-col items-center group" @click="mobilePanel = 'settings'">
                <div class="flex items-center gap-1.5">
                    <svg class="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span class="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {{ selectedChatbot?.name || 'Digital Brain' }}
                    </span>
                    <svg class="h-3.5 w-3.5 text-slate-400 group-hover:text-purple-500 transition-colors" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <span class="text-[9px] font-black uppercase tracking-[0.2em] text-purple-500">
                    Internal · {{ connectedDatabases }} Sources
                </span>
            </button>

            <button class="-mr-2 p-2 text-slate-500 transition-transform active:scale-90 dark:text-slate-400"
                @click="resetChat">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </header>

        <!-- ══════════════════════════════════════
         MAIN LAYOUT
    ══════════════════════════════════════ -->
        <div class="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden md:flex-row md:gap-6 md:p-6">

            <!-- LEFT SIDEBAR -->
            <aside class="hidden w-72 shrink-0 flex-col gap-4 overflow-y-auto md:flex no-scrollbar">

                <!-- Agent selector -->
                <div
                    class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <label class="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-400">Active
                        Agent</label>
                    <select v-model="selectedChatbotId"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        @change="resetChat">
                        <option v-for="bot in availableChatbots" :key="bot.id" :value="bot.id">
                            {{ bot.name }}
                        </option>
                    </select>

                    <div v-if="connectedDatabases > 0"
                        class="mt-3 flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 dark:bg-purple-900/20">
                        <svg class="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582 4-8 4" />
                        </svg>
                        <span class="text-xs font-semibold text-purple-700 dark:text-purple-300">
                            {{ connectedDatabases }} connected database{{ connectedDatabases !== 1 ? 's' : '' }}
                        </span>
                    </div>
                    <div v-else
                        class="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-900/20">
                        <svg class="h-3.5 w-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
                        </svg>
                        <span class="text-xs font-medium text-amber-700 dark:text-amber-300">No database connected
                            yet</span>
                    </div>
                </div>

                <!-- Suggested prompts by category -->
                <div
                    class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div class="shrink-0 border-b border-gray-100 px-4 py-3 dark:border-slate-800">
                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Suggested
                            Queries</span>
                    </div>
                    <div class="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
                        <div v-for="category in promptCategories" :key="category.label">
                            <p
                                class="mb-1.5 flex items-center gap-1.5 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {{ category.icon }} {{ category.label }}
                            </p>
                            <div class="space-y-1">
                                <button v-for="prompt in category.prompts" :key="prompt"
                                    class="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 transition-colors hover:bg-purple-50 hover:text-purple-700 dark:text-slate-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"
                                    @click="usePrompt(prompt)">
                                    {{ prompt }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- ══════════════════════════════════════
           MAIN CHAT AREA
      ══════════════════════════════════════ -->
            <div
                class="relative flex flex-1 flex-col overflow-hidden border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:rounded-2xl">

                <!-- Empty — no chatbot yet -->
                <div v-if="!selectedChatbotId"
                    class="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                    <div
                        class="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/30">
                        <svg class="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">No agent selected</h3>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Select an agent from the sidebar to
                            start querying your business data.</p>
                    </div>
                    <NuxtLink to="/dashboard/chatbot-setup"
                        class="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700">
                        Set up an agent
                    </NuxtLink>
                </div>

                <!-- ChatWidget — no testMode prop passed = stays 'default' → user_type=internal -->
                <ChatWidget v-else ref="chatWidgetRef" :key="widgetKey" :chatbot-id="selectedChatbotId"
                    :chatbot-name="selectedChatbot?.name || 'Digital Brain'" :restore-session="sessionToRestore"
                    :fluid="true" class="h-full w-full" @session-saved="onSessionSaved" />

                <!-- Internal mode badge -->
                <div v-if="selectedChatbotId" class="pointer-events-none absolute right-3 top-[4.5rem] z-10">
                    <span
                        class="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                        <span class="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                        Internal · Full Access
                    </span>
                </div>
            </div>

            <!-- RIGHT SIDEBAR — session history (desktop lg+) -->
            <aside v-if="sessionHistory.length > 0"
                class="hidden w-56 shrink-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex">
                <div
                    class="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-slate-800">
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Sessions</span>
                    <button class="text-[9px] font-black uppercase text-purple-600 hover:underline dark:text-purple-400"
                        @click="loadSessionHistory">
                        Refresh
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800 no-scrollbar">
                    <button v-for="session in sessionHistory" :key="session.session_id"
                        class="w-full px-4 py-3 text-left transition-colors" :class="activeSessionId === session.session_id
                            ? 'border-r-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'
                            " @click="restoreSession(session)">
                        <p
                            class="mb-0.5 truncate text-xs font-semibold leading-tight text-slate-900 dark:text-slate-100">
                            {{ session.preview || 'Analytics session' }}
                        </p>
                        <span class="text-[10px] font-medium uppercase tracking-tighter text-gray-400">
                            {{ formatRelative(session.last_activity) }}
                        </span>
                    </button>
                </div>
            </aside>
        </div>

        <!-- ══════════════════════════════════════
         BOTTOM INFO BAR (Desktop)
    ══════════════════════════════════════ -->
        <div
            class="hidden shrink-0 border-t border-gray-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50 md:block">
            <div class="mx-auto flex max-w-7xl items-center justify-between">
                <div class="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-[11px] font-black uppercase tracking-widest">Internal Mode  Full Data
                        Access</span>
                </div>
                <ul class="flex items-center gap-8 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <li>• Ask for trends, comparisons, and growth rates</li>
                    <li>• "Top 10 customers by revenue last quarter"</li>
                    <li>• "Which product had the highest return rate?"</li>
                    <li>• Responses include BI insights, not just raw numbers</li>
                </ul>
            </div>
        </div>

        <!-- ══════════════════════════════════════
         MOBILE: AGENT SELECTOR SHEET
    ══════════════════════════════════════ -->
        <Teleport to="body">
            <Transition name="sheet">
                <div v-if="mobilePanel === 'settings'"
                    class="fixed inset-0 z-50 flex items-end justify-center md:hidden">
                    <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="mobilePanel = null"></div>
                    <div
                        class="relative flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-t-[32px] bg-white p-6 shadow-2xl dark:bg-slate-900 no-scrollbar">
                        <div class="mx-auto mb-8 h-1 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                        <h3 class="mb-6 text-xl font-black uppercase italic tracking-tighter dark:text-white">Select
                            Agent</h3>
                        <div class="space-y-2">
                            <button v-for="bot in availableChatbots" :key="bot.id"
                                class="w-full rounded-2xl border-2 px-5 py-4 text-left transition-all" :class="selectedChatbotId === bot.id
                                    ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                                    : 'border-slate-100 dark:border-slate-800 dark:text-white'
                                    " @click="selectedChatbotId = bot.id; resetChat(); mobilePanel = null">
                                <div class="flex items-center justify-between">
                                    <span class="font-bold">{{ bot.name }}</span>
                                    <div v-if="selectedChatbotId === bot.id" class="h-2 w-2 rounded-full bg-purple-500">
                                    </div>
                                </div>
                                <p class="mt-1 text-xs text-slate-400">{{ bot.is_active ? 'Active' : 'Inactive' }}</p>
                            </button>
                        </div>
                        <button
                            class="mt-8 w-full rounded-2xl bg-slate-950 py-5 text-xs font-black uppercase tracking-widest text-white dark:bg-white dark:text-slate-950"
                            @click="mobilePanel = null">
                            Done
                        </button>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- ══════════════════════════════════════
         MOBILE: SUGGESTED PROMPTS SHEET
    ══════════════════════════════════════ -->
        <Teleport to="body">
            <Transition name="sheet-left">
                <div v-if="mobilePanel === 'prompts'" class="fixed inset-0 z-50 flex md:hidden">
                    <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="mobilePanel = null"></div>
                    <div
                        class="relative flex h-full w-[85%] max-w-[320px] flex-col bg-white shadow-2xl dark:bg-slate-900">
                        <div
                            class="flex shrink-0 items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                            <h3 class="text-lg font-black uppercase italic tracking-tighter dark:text-white">Suggested
                                Queries</h3>
                            <button class="rounded-full bg-slate-50 p-2 dark:bg-slate-800" @click="mobilePanel = null">
                                <svg class="h-4 w-4 dark:text-white" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
                            <div v-for="category in promptCategories" :key="category.label">
                                <p
                                    class="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {{ category.icon }} {{ category.label }}
                                </p>
                                <div class="space-y-1.5">
                                    <button v-for="prompt in category.prompts" :key="prompt"
                                        class="w-full rounded-xl border border-slate-100 px-4 py-3 text-left text-xs font-medium text-slate-600 transition-colors active:bg-purple-50 dark:border-slate-800 dark:text-slate-400"
                                        @click="usePrompt(prompt); mobilePanel = null">
                                        {{ prompt }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- ══════════════════════════════════════
             Point 5A — Insight Cards Slide-over Panel
        ══════════════════════════════════════ -->
        <Teleport to="body">
            <Transition name="sheet">
                <div v-if="showInsightsPanel" class="fixed inset-0 z-50 flex items-end md:items-start md:justify-end"
                    @click.self="showInsightsPanel = false">
                    <div
                        class="w-full md:w-[480px] md:h-full md:max-h-screen bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-none md:rounded-l-3xl shadow-2xl flex flex-col max-h-[85vh] md:max-h-screen overflow-hidden border-l border-gray-200 dark:border-slate-700">

                        <!-- Header -->
                        <div
                            class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 shrink-0">
                            <div>
                                <h2 class="text-base font-bold text-gray-900 dark:text-white">Business Insights</h2>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    <span v-if="intelligenceStore.insightsGeneratedAt">
                                        Updated {{ formatRelative(intelligenceStore.insightsGeneratedAt) }}
                                    </span>
                                    <span v-else>Auto-generated from your database</span>
                                    <span v-if="intelligenceStore.insightsStale" class="ml-1 text-orange-500">·
                                        Refreshing…</span>
                                </p>
                            </div>
                            <div class="flex items-center gap-2">
                                <button @click="handleInsightRefresh" :disabled="insightRefreshing"
                                    class="p-2 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors disabled:opacity-40">
                                    <svg class="w-4 h-4" :class="insightRefreshing ? 'animate-spin' : ''" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                                <button @click="showInsightsPanel = false"
                                    class="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Insights list -->
                        <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3">

                            <!-- Loading -->
                            <div v-if="intelligenceStore.insightsLoading" class="space-y-3">
                                <div v-for="i in 4" :key="i"
                                    class="h-28 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                            </div>

                            <!-- No database connected -->
                            <div v-else-if="connectedDatabases === 0"
                                class="flex flex-col items-center justify-center py-16 text-center px-6">
                                <div class="text-4xl mb-3">🔌</div>
                                <p class="font-semibold text-gray-700 dark:text-gray-300">No database connected</p>
                                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Connect a database to unlock
                                    proactive business insights</p>
                            </div>

                            <!-- Empty -->
                            <div v-else-if="!intelligenceStore.insights.length"
                                class="flex flex-col items-center justify-center py-16 text-center px-6">
                                <div class="text-4xl mb-3">📊</div>
                                <p class="font-semibold text-gray-700 dark:text-gray-300">Generating insights…</p>
                                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">This takes about 15 seconds on
                                    first run</p>
                            </div>

                            <!-- Insight cards -->
                            <template v-else>
                                <div v-for="insight in intelligenceStore.insights" :key="insight.id"
                                    class="rounded-2xl border overflow-hidden transition-all"
                                    :class="insight.status === 'ok'
                                        ? 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800/50'
                                        : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 opacity-60'">

                                    <!-- Card header -->
                                    <div class="flex items-center gap-3 px-4 pt-4 pb-2">
                                        <div class="w-8 h-8 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br shrink-0"
                                            :class="insightCategoryColor(insight.category)">
                                            {{ insight.icon }}
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p
                                                class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                {{ insight.label }}</p>
                                            <p v-if="insight.value !== null && insight.value !== undefined"
                                                class="text-xl font-black text-gray-900 dark:text-white leading-tight">
                                                {{ typeof insight.value === 'number' ? insight.value.toLocaleString() :
                                                insight.value }}
                                            </p>
                                        </div>
                                        <span class="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                                            :class="insight.status === 'ok' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400'">
                                            {{ insight.status === 'ok' ? 'Live' : insight.status }}
                                        </span>
                                    </div>

                                    <!-- Narrative -->
                                    <div v-if="insight.narrative" class="px-4 pb-3">
                                        <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{
                                            insight.narrative }}</p>
                                    </div>

                                    <!-- Ask in chat CTA -->
                                    <div v-if="insight.status === 'ok'" class="px-4 pb-4">
                                        <button
                                            @click="usePrompt(`Tell me more about ${insight.label.toLowerCase()}`); showInsightsPanel = false"
                                            class="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                                            Ask the bot →
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- ══════════════════════════════════════
             Point 5B — Report Upload Slide-over Panel
        ══════════════════════════════════════ -->
        <Teleport to="body">
            <Transition name="sheet">
                <div v-if="showReportsPanel" class="fixed inset-0 z-50 flex items-end md:items-start md:justify-end"
                    @click.self="showReportsPanel = false">
                    <div
                        class="w-full md:w-[480px] md:h-full bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-none md:rounded-l-3xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-screen overflow-hidden border-l border-gray-200 dark:border-slate-700">

                        <!-- Header -->
                        <div
                            class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 shrink-0">
                            <div>
                                <h2 class="text-base font-bold text-gray-900 dark:text-white">Internal Reports</h2>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {{ intelligenceStore.embeddedReports.length }} embedded · {{
                                        intelligenceStore.totalChunks.toLocaleString() }} chunks searchable
                                </p>
                            </div>
                            <button @click="showReportsPanel = false"
                                class="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <!-- Upload area -->
                        <div class="px-5 py-4 border-b border-gray-100 dark:border-slate-800 shrink-0">
                            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                                Upload
                                New Report</p>

                            <!-- File drop zone -->
                            <label
                                class="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 p-6 cursor-pointer hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors">
                                <input ref="reportFileInputRef" type="file"
                                    accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.txt,.json" class="hidden"
                                    @change="handleFileChange" />
                                <div class="text-3xl">{{ reportUploadFile ? '📄' : '📂' }}</div>
                                <p v-if="reportUploadFile"
                                    class="text-sm font-semibold text-purple-600 dark:text-purple-400 text-center">{{
                                    reportUploadFile.name }}</p>
                                <p v-else class="text-sm text-gray-500 dark:text-gray-400 text-center">Drop PDF, DOCX,
                                    Excel, or
                                    CSV here</p>
                                <p class="text-[10px] text-gray-400 dark:text-gray-500">Max 20 MB · PDF, DOCX, XLSX,
                                    CSV, TXT
                                </p>
                            </label>

                            <!-- Name input -->
                            <input v-if="reportUploadFile" v-model="reportUploadName"
                                placeholder="Report name (optional)"
                                class="mt-3 w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors" />

                            <!-- Error / success -->
                            <p v-if="reportUploadError" class="mt-2 text-xs text-red-600 dark:text-red-400">{{
                                reportUploadError
                                }}</p>
                            <p v-if="reportUploadSuccess"
                                class="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">✓
                                {{ reportUploadSuccess }}</p>

                            <!-- Upload button -->
                            <button v-if="reportUploadFile" @click="handleReportUpload"
                                :disabled="intelligenceStore.uploadLoading"
                                class="mt-3 w-full rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-bold py-2.5 transition-colors">
                                {{ intelligenceStore.uploadLoading ? 'Embedding…' : 'Embed Report' }}
                            </button>
                        </div>

                        <!-- Reports list -->
                        <div class="flex-1 overflow-y-auto px-4 py-4">
                            <div v-if="intelligenceStore.reportsLoading" class="space-y-2">
                                <div v-for="i in 3" :key="i"
                                    class="h-14 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                            </div>

                            <div v-else-if="!intelligenceStore.reports.length"
                                class="flex flex-col items-center justify-center py-10 text-center">
                                <div class="text-3xl mb-2">📑</div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">No reports uploaded yet</p>
                                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Upload a P&amp;L, report, or
                                    CSV and
                                    ask the bot questions about it</p>
                            </div>

                            <div v-else class="space-y-2">
                                <div v-for="report in intelligenceStore.reports" :key="report.id"
                                    class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors group">
                                    <div class="text-xl">{{
                                        { pdf: '📕', docx: '📘', doc: '📘', xlsx: '📗', xls: '📗', csv: '📊', txt: '📄',json:'📋'}[report.file_type]
                                        ?? '📄' }}</div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{
                                            report.name
                                            }}</p>
                                        <p class="text-xs text-gray-400 dark:text-gray-500">{{ report.chunks_embedded }}
                                            chunks
                                            · {{ formatRelative(report.uploaded_at) }}</p>
                                    </div>
                                    <div class="flex items-center gap-2 shrink-0">
                                        <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                                            :class="reportStatusClass(report.status)">
                                            {{ report.status }}
                                        </span>
                                        <button @click="handleDeleteReport(report.id)"
                                            class="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ChatWidget from '~/components/chatbot-setup/ChatWidget.vue'
import { useIntelligenceStore } from '~/stores/analyticsStore'

definePageMeta({ layout: 'dashboard' })

// ── Stores & composables ──────────────────────────────────
const chatbotStore = useChatbotStore()
const databaseStore = useDatabaseStore()
const intelligenceStore = useIntelligenceStore()
const { token } = useAuthStore()
const config = useRuntimeConfig()

// ── State ─────────────────────────────────────────────────
const selectedChatbotId = ref('')
const mobilePanel = ref(null)
const widgetKey = ref(0)
const chatWidgetRef = ref(null)
const sessionToRestore = ref(null)
const sessionHistory = ref([])
const historyLoading = ref(false)
const activeSessionId = ref(null)

// Point 5A — Insight cards panel
const showInsightsPanel = ref(false)
const insightRefreshing = ref(false)

// Point 5B — Report upload panel
const showReportsPanel = ref(false)
const reportUploadName = ref('')
const reportUploadFile = ref(null)
const reportUploadError = ref(null)
const reportUploadSuccess = ref(null)
const reportFileInputRef = ref(null)

// ── Computed ──────────────────────────────────────────────
const availableChatbots = computed(() => chatbotStore.chatbots || [])

const selectedChatbot = computed(() =>
    availableChatbots.value.find((b) => b.id === selectedChatbotId.value) || null
)

const connectedDatabases = computed(() =>
    databaseStore.connections?.filter((c) => c.status === 'connected').length || 0
)

// ── Suggested prompts ─────────────────────────────────────
// Clicking a prompt fills the ChatWidget input via the exposed setMessage() method.
// ChatWidget.vue must have `setMessage` in defineExpose (see ChatWidget patch).
const promptCategories = [
    {
        label: 'Sales & Revenue',
        icon: '📈',
        prompts: [
            'What was our total revenue last month?',
            'Show me our top 10 customers by revenue',
            'Which product category grew the most this quarter?',
            'Compare this month\'s sales to last month',
        ],
    },
    {
        label: 'Operations',
        icon: '⚙️',
        prompts: [
            'What are our most common support issues?',
            'Which orders have been pending the longest?',
            'Show me unfulfilled orders from the past 7 days',
            'What is our average order fulfillment time?',
        ],
    },
    {
        label: 'Customers',
        icon: '👥',
        prompts: [
            'How many new customers did we get this month?',
            'Which customers haven\'t ordered in 90 days?',
            'What is our customer retention rate?',
            'Show me customers with the highest lifetime value',
        ],
    },
    {
        label: 'Products',
        icon: '📦',
        prompts: [
            'Which products are running low on stock?',
            'What is our best-selling product this week?',
            'Show me products with the highest return rate',
            'Which items have never been ordered?',
        ],
    },
]

// ── Prompt injection via exposed method ────────────────────
const usePrompt = (prompt) => {
    chatWidgetRef.value?.setMessage(prompt)
}

// ── Session management ────────────────────────────────────
const loadSessionHistory = async () => {
    if (!selectedChatbotId.value) return
    historyLoading.value = true
    try {
        const data = await $fetch(
            `${config.public.apiBase}/api/conversation/test-sessions?chatbot_id=${selectedChatbotId.value}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        sessionHistory.value = data.data?.sessions ?? []
    } catch {
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

const resetChat = () => {
    sessionToRestore.value = null
    activeSessionId.value = null
    widgetKey.value++
    loadSessionHistory()
}

const onSessionSaved = (info) => {
    const existing = sessionHistory.value.find((s) => s.session_id === info.sessionId)
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
    return hrs < 24
        ? `${hrs}h ago`
        : new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

// ── Lifecycle ─────────────────────────────────────────────
onMounted(async () => {
    await Promise.all([
        chatbotStore.fetchChatbots(),
        databaseStore.fetchConnections(),
        intelligenceStore.fetchInsights(),   // Point 5A
    ])
    if (availableChatbots.value.length > 0) {
        selectedChatbotId.value = availableChatbots.value[0].id
        await Promise.all([
            loadSessionHistory(),
            intelligenceStore.fetchReports(selectedChatbotId.value),  // Point 5B
        ])
    }
})

// Point 5A — Refresh insight cards
const handleInsightRefresh = async () => {
    insightRefreshing.value = true
    await intelligenceStore.refreshInsights()
    insightRefreshing.value = false
}

// Point 5B — Report upload
const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    reportUploadFile.value = f
    if (!reportUploadName.value) {
        reportUploadName.value = f.name.replace(/\.[^.]+$/, '')
    }
    reportUploadError.value = null
}

const handleReportUpload = async () => {
    if (!reportUploadFile.value || !selectedChatbotId.value) return
    reportUploadError.value = null
    reportUploadSuccess.value = null
    try {
        const res = await intelligenceStore.uploadReport(
            reportUploadFile.value,
            reportUploadName.value,
            selectedChatbotId.value
        )
        if (res?.success) {
            reportUploadSuccess.value = `"${reportUploadName.value}" embedded successfully.`
            reportUploadFile.value = null
            reportUploadName.value = ''
            if (reportFileInputRef.value) reportFileInputRef.value.value = ''
        }
    } catch (err) {
        reportUploadError.value = err?.message || 'Upload failed. Please try again.'
    }
}

const handleDeleteReport = async (reportId) => {
    if (!confirm('Delete this report? Its content will no longer be searchable.')) return
    await intelligenceStore.deleteReport(reportId)
}

const reportStatusClass = (status) => ({
    embedded: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    processing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    pending: 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400',
}[status] || 'bg-gray-100 text-gray-500')

const insightCategoryColor = (category) => ({
    revenue: 'from-green-500 to-emerald-600',
    operations: 'from-blue-500 to-cyan-600',
    growth: 'from-purple-500 to-violet-600',
    products: 'from-orange-500 to-amber-600',
    inventory: 'from-red-500 to-rose-600',
}[category] || 'from-gray-400 to-gray-500')

watch(selectedChatbotId, (newId) => {
    if (newId) loadSessionHistory()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.sheet-enter-active,
.sheet-leave-active,
.sheet-left-enter-active,
.sheet-left-leave-active {
    transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.sheet-enter-from,
.sheet-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

.sheet-left-enter-from,
.sheet-left-leave-to {
    transform: translateX(-100%);
}
</style>
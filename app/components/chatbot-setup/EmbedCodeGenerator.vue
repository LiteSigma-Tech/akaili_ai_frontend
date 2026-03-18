<!-- components/chatbot-setup/EmbedCodeGenerator.vue -->
<template>
    <div class="space-y-8">

        <!-- ── Header row ── -->
        <div class="flex items-center justify-between">
            <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Widget Integration</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Add your chatbot to any website or app
                </p>
            </div>
            <div class="flex gap-2">
                <button @click="loadEmbedCode" :disabled="isGenerating"
                    class="text-sm border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors font-medium">
                    {{ isGenerating ? 'Loading…' : 'Refresh' }}
                </button>
                <button @click="regenerateToken" :disabled="isRegenerating"
                    class="text-sm border border-red-100 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-40 transition-colors font-medium">
                    {{ isRegenerating ? 'Regenerating…' : '↺ New Token' }}
                </button>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="isGenerating" class="flex flex-col items-center justify-center py-16">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span class="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading embed code…</span>
        </div>

        <template v-else-if="embedCode">

            <!-- ── Widget token pill ── -->
            <div
                class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700">
                <span
                    class="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 shrink-0">Token</span>
                <code
                    class="flex-1 text-xs font-mono text-gray-700 dark:text-gray-300 truncate select-all">{{ widgetToken }}</code>
                <button @click="copy(widgetToken, 'token')"
                    class="shrink-0 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                    {{ copied.token ? '✓ Copied' : 'Copy' }}
                </button>
            </div>

            <!-- ── Framework tabs ── -->
            <div>
                <p class="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                    Choose your framework
                </p>

                <!-- Tab pills — scrollable on mobile -->
                <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    <button v-for="fw in frameworks" :key="fw.id" @click="activeFramework = fw.id"
                        class="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                        :class="activeFramework === fw.id
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'">
                        {{ fw.label }}
                    </button>
                    <!-- Other -->
                    <button @click="activeFramework = 'other'"
                        class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                        :class="activeFramework === 'other'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'">
                        <Sparkles class="w-3 h-3" />
                        Other
                    </button>
                </div>

                <!-- ── Pre-written guide ── -->
                <div v-if="activeFramework !== 'other'" class="mt-5 space-y-6">
                    <div v-if="activeGuide">

                        <!-- Step 1: Script installation -->
                        <div class="rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
                            <div
                                class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                                <div class="flex items-center gap-2">
                                    <span
                                        class="flex items-center justify-center w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-black">1</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">Script
                                        Installation</span>
                                </div>
                                <button @click="copy(activeGuide.install, 'install')"
                                    class="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 border border-gray-200 dark:border-slate-700 px-2.5 py-1 rounded-lg transition-colors">
                                    {{ copied.install ? '✓ Copied' : 'Copy' }}
                                </button>
                            </div>
                            <div class="p-4 bg-gray-50 dark:bg-slate-900/50">
                                <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    📍 <strong class="text-gray-700 dark:text-gray-300">File:</strong>
                                    <code
                                        class="ml-1 text-purple-600 dark:text-purple-400 font-mono">{{ activeGuide.file }}</code>
                                </p>
                                <CodeBlock :code="activeGuide.install" :language="activeGuide.language" />
                            </div>
                        </div>

                        <!-- Step 2: Identify (auth) -->
                        <div class="rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
                            <div
                                class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                                <div class="flex items-center gap-2">
                                    <span
                                        class="flex items-center justify-center w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-black">2</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">Identify Logged-in
                                        Users <span class="text-xs font-normal text-gray-400">(optional)</span></span>
                                </div>
                                <button @click="copy(activeGuide.identify, 'identify')"
                                    class="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 border border-gray-200 dark:border-slate-700 px-2.5 py-1 rounded-lg transition-colors">
                                    {{ copied.identify ? '✓ Copied' : 'Copy' }}
                                </button>
                            </div>
                            <div class="p-4 bg-gray-50 dark:bg-slate-900/50">
                                <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    When a user logs in, call this so the chatbot knows who it's talking to.
                                </p>
                                <CodeBlock :code="activeGuide.identify" :language="activeGuide.language" />
                            </div>
                        </div>

                        <!-- Note -->
                        <div
                            class="flex gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 text-sm text-blue-800 dark:text-blue-300">
                            <span class="text-base">💡</span>
                            <p>{{ activeGuide.note }}</p>
                        </div>
                    </div>
                </div>

                <!-- ── On-demand generator ── -->
                <div v-else class="mt-5 space-y-4">
                    <div
                        class="p-5 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/20">
                        <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Don't see your framework?
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
                            Type any framework or language and we'll generate a tailored guide for you.
                        </p>
                        <div class="flex gap-2">
                            <input v-model="customFramework"
                                placeholder="e.g. Remix, SvelteKit, Ruby on Rails, Flutter…"
                                @keydown.enter="generateCustomGuide"
                                class="flex-1 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors" />
                            <button @click="generateCustomGuide"
                                :disabled="!customFramework.trim() || isGeneratingGuide"
                                class="shrink-0 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                {{ isGeneratingGuide ? 'Generating…' : 'Generate' }}
                            </button>
                        </div>
                    </div>

                    <!-- Generated guide output -->
                    <div v-if="isGeneratingGuide"
                        class="flex items-center gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 shrink-0"></div>
                        <span class="text-sm text-purple-700 dark:text-purple-400">Generating guide for <strong>{{
                                customFramework }}</strong>…</span>
                    </div>

                    <div v-else-if="generatedGuide"
                        class="rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
                        <div
                            class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                            <span class="text-sm font-bold text-gray-900 dark:text-white">
                                ✨ {{ generatedGuideFramework }} Guide
                            </span>
                            <button @click="copy(generatedGuide, 'generated')"
                                class="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 border border-gray-200 dark:border-slate-700 px-2.5 py-1 rounded-lg transition-colors">
                                {{ copied.generated ? '✓ Copied' : 'Copy All' }}
                            </button>
                        </div>
                        <!-- Render markdown-ish output as formatted text -->
                        <div
                            class="p-5 prose prose-sm dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            <div v-html="renderMarkdown(generatedGuide)"></div>
                        </div>
                    </div>

                    <div v-else-if="guideError"
                        class="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 text-sm text-red-700 dark:text-red-400">
                        {{ guideError }}
                    </div>
                </div>
            </div>

        </template>

        <!-- Empty state -->
        <div v-else class="flex flex-col items-center justify-center py-16 text-center">
            <svg class="w-12 h-12 text-gray-200 dark:text-slate-700 mb-4" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <p class="font-medium text-gray-600 dark:text-gray-400 mb-1">No embed code yet</p>
            <p class="text-sm text-gray-400 dark:text-gray-500">Click Refresh to generate your widget token</p>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Sparkles } from 'lucide-vue-next'
import CodeBlock from './CodeBlock.vue'

const props = defineProps({
    chatbotId: { type: String, required: true },
    chatbotName: { type: String, default: 'AI Assistant' },
})

// ── State ─────────────────────────────────────────────────────────────────────
const embedCode = ref('')
const widgetToken = ref('')
const isGenerating = ref(false)
const isRegenerating = ref(false)
const activeFramework = ref('html')
const customFramework = ref('')
const isGeneratingGuide = ref(false)
const generatedGuide = ref('')
const generatedGuideFramework = ref('')
const guideError = ref('')
const copied = ref({ token: false, install: false, identify: false, generated: false })

// ── Framework definitions ─────────────────────────────────────────────────────
// scriptTag is computed from the loaded widgetToken so it always stays current
const scriptTag = computed(() =>
    `<script src="${useRuntimeConfig().public.apiBase}/widget.js?token=${widgetToken.value}" async><\/script>`
)

const frameworks = computed(() => {
    const tag = scriptTag.value
    const token = widgetToken.value

    return [
        {
            id: 'html',
            label: 'HTML',
            language: 'html',
            file: 'index.html (any page)',
            install: `<!DOCTYPE html>
<html>
  <head>...</head>
  <body>

    <!-- Your page content -->

    <!-- XeliAI Widget — paste before </body> -->
    ${tag}
  </body>
</html>`,
            identify: `<script>
  // Call this after your user logs in
  XeliAI.identify({
    user_id: "user_123",
    email:   "jane@example.com",
    name:    "Jane Doe",
    plan:    "pro"           // optional
  });
<\/script>`,
            note: 'Paste the script tag on every page where you want the widget to appear, or in a shared layout/template file.',
        },
        {
            id: 'nextjs-app',
            label: 'Next.js',
            language: 'javascript',
            file: 'app/layout.tsx',
            install: `// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* XeliAI Widget */}
        <Script
          src="${useRuntimeConfig().public.apiBase}/widget.js?token=${token}"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}`,
            identify: `// In any Client Component after auth
'use client'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export function XeliAIIdentify() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user && window.XeliAI) {
      window.XeliAI.identify({
        user_id: session.user.id,
        email:   session.user.email,
        name:    session.user.name,
      })
    }
  }, [session])

  return null
}`,
            note: 'Using Next.js App Router. For Pages Router, add the Script tag inside _app.tsx instead.',
        },
        {
            id: 'react',
            label: 'React',
            language: 'javascript',
            file: 'index.html + App.jsx',
            install: `<!-- public/index.html — paste before </body> -->
${tag}`,
            identify: `// src/App.jsx — call after login
import { useEffect } from 'react'
import { useAuth } from './contexts/AuthContext' // your auth hook

export default function App() {
  const { user } = useAuth()

  useEffect(() => {
    if (user && window.XeliAI) {
      window.XeliAI.identify({
        user_id: user.id,
        email:   user.email,
        name:    user.displayName,
        plan:    user.plan,
      })
    }
  }, [user])

  // ...
}`,
            note: 'Add the script tag once in index.html so it loads globally. Call XeliAI.identify() inside a useEffect whenever the auth state changes.',
        },
        {
            id: 'nuxt',
            label: 'Nuxt / Vue',
            language: 'javascript',
            file: 'plugins/xeliai.client.js',
            install: `// plugins/xeliai.client.js
export default defineNuxtPlugin(() => {
  const script = document.createElement('script')
  script.src = '${useRuntimeConfig().public.apiBase}/widget.js?token=${token}'
  script.async = true
  document.body.appendChild(script)
})

// Then register in nuxt.config.ts:
// plugins: ['~/plugins/xeliai.client.js']`,
            identify: `// In any component or composable after login
import { useAuthStore } from '~/stores/authStore'
import { watch } from 'vue'

const authStore = useAuthStore()

watch(() => authStore.user, (user) => {
  if (user && window.XeliAI) {
    window.XeliAI.identify({
      user_id: user.id,
      email:   user.email,
      name:    user.name,
      plan:    user.plan,
    })
  }
}, { immediate: true })`,
            note: 'The .client.js suffix ensures the plugin only runs in the browser (not during SSR). Watch the auth store so identify() fires whenever the user changes.',
        },
        {
            id: 'laravel',
            label: 'Laravel',
            language: 'html',
            file: 'resources/views/layouts/app.blade.php',
            install: `{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html>
<head>...</head>
<body>
    @yield('content')

    {{-- XeliAI Widget --}}
    <script src="${useRuntimeConfig().public.apiBase}/widget.js?token=${token}" async><\/script>

    @stack('scripts')
</body>
</html>`,
            identify: `{{-- Add this after the script tag in your layout --}}
@auth
<script>
  window.addEventListener('load', function () {
    if (window.XeliAI) {
      XeliAI.identify({
        user_id: "{{ auth()->id() }}",
        email:   "{{ auth()->user()->email }}",
        name:    "{{ auth()->user()->name }}",
        plan:    "{{ auth()->user()->subscription?->plan ?? 'free' }}"
      });
    }
  });
<\/script>
@endauth`,
            note: 'The @auth directive ensures identify() only runs for authenticated users. The subscription plan is optional — remove that line if you don\'t use plans.',
        },
        {
            id: 'wordpress',
            label: 'WordPress',
            language: 'php',
            file: 'functions.php (child theme)',
            install: `<?php
// Add to your child theme's functions.php

function xeliai_enqueue_widget() {
    wp_enqueue_script(
        'xeliai-widget',
        '${useRuntimeConfig().public.apiBase}/widget.js?token=${token}',
        [],
        null,
        true  // load in footer
    );
}
add_action('wp_enqueue_scripts', 'xeliai_enqueue_widget');`,
            identify: `<?php
// Also in functions.php — identify logged-in users

function xeliai_identify_user() {
    if (!is_user_logged_in()) return;
    $user = wp_get_current_user();
    ?>
    <script>
    window.addEventListener('load', function () {
      if (window.XeliAI) {
        XeliAI.identify({
          user_id: "<?php echo esc_js($user->ID); ?>",
          email:   "<?php echo esc_js($user->user_email); ?>",
          name:    "<?php echo esc_js($user->display_name); ?>"
        });
      }
    });
    <\/script>
    <?php
}
add_action('wp_footer', 'xeliai_identify_user');`,
            note: 'Using wp_enqueue_script is the WordPress-correct way to load external scripts. Never add script tags directly to functions.php.',
        },
        {
            id: 'django',
            label: 'Django',
            language: 'html',
            file: 'templates/base.html',
            install: `{# templates/base.html #}
<!DOCTYPE html>
<html>
<head>...</head>
<body>
  {% block content %}{% endblock %}

  {# XeliAI Widget #}
  <script src="${useRuntimeConfig().public.apiBase}/widget.js?token=${token}" async><\/script>

  {% block extra_scripts %}{% endblock %}
</body>
</html>`,
            identify: `{# Add after the widget script tag in base.html #}
{% if user.is_authenticated %}
<script>
  window.addEventListener('load', function () {
    if (window.XeliAI) {
      XeliAI.identify({
        user_id: "{{ user.id }}",
        email:   "{{ user.email }}",
        name:    "{{ user.get_full_name|default:user.username }}"
      });
    }
  });
<\/script>
{% endif %}`,
            note: 'Django\'s template context processor automatically provides the user object in all templates that extend base.html.',
        },
        {
            id: 'node',
            label: 'Node / Express',
            language: 'html',
            file: 'views/layout.ejs (or .hbs)',
            install: `<!-- views/layout.ejs -->
<!DOCTYPE html>
<html>
<head>...</head>
<body>
  <%- body %>

  <!-- XeliAI Widget -->
  <script src="${useRuntimeConfig().public.apiBase}/widget.js?token=${token}" async><\/script>
</body>
</html>`,
            identify: `<!-- Add after the widget script — req.user from your auth middleware -->
<% if (locals.user) { %>
<script>
  window.addEventListener('load', function () {
    if (window.XeliAI) {
      XeliAI.identify({
        user_id: "<%= user.id %>",
        email:   "<%= user.email %>",
        name:    "<%= user.name %>"
      });
    }
  });
<\/script>
<% } %>`,
            note: 'This uses EJS templating. If you use Handlebars (.hbs), the syntax is {{user.id}} and {{#if user}}...{{/if}} instead.',
        },
    ]
})

const activeGuide = computed(() =>
    frameworks.value.find(fw => fw.id === activeFramework.value) ?? null
)

// ── API calls ─────────────────────────────────────────────────────────────────
const loadEmbedCode = async () => {
    isGenerating.value = true
    try {
        const { token } = useAuthStore()
        const cfg = useRuntimeConfig()
        const res = await $fetch(`${cfg.public.apiBase}/api/chatbots/${props.chatbotId}/embed-code`, {
            method: 'POST', headers: { Authorization: `Bearer ${token}` },
        })
        if (res.success) {
            widgetToken.value = res.data.widget_token
            embedCode.value = res.data.embed_code
        }
    } catch (e) { console.error('loadEmbedCode:', e) }
    finally { isGenerating.value = false }
}

const regenerateToken = async () => {
    if (!confirm('Regenerate token? Your current embed code will stop working and you\'ll need to update your website.')) return
    isRegenerating.value = true
    try {
        const { token } = useAuthStore()
        const cfg = useRuntimeConfig()
        const res = await $fetch(`${cfg.public.apiBase}/api/chatbots/${props.chatbotId}/regenerate-token`, {
            method: 'POST', headers: { Authorization: `Bearer ${token}` },
        })
        if (res.success) {
            widgetToken.value = res.data.widget_token
            embedCode.value = res.data.embed_code
        }
    } catch (e) { alert('Failed to regenerate token. Please try again.') }
    finally { isRegenerating.value = false }
}

const generateCustomGuide = async () => {
    if (!customFramework.value.trim()) return
    isGeneratingGuide.value = true
    generatedGuide.value = ''
    guideError.value = ''
    generatedGuideFramework.value = customFramework.value.trim()
    try {
        const { token } = useAuthStore()
        const cfg = useRuntimeConfig()
        const res = await $fetch(`${cfg.public.apiBase}/api/chatbots/${props.chatbotId}/generate-guide`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: { framework: customFramework.value.trim() },
        })
        if (res.success) {
            generatedGuide.value = res.data.guide
        } else {
            guideError.value = res.message || 'Generation failed.'
        }
    } catch (e) {
        guideError.value = 'Failed to generate guide. Please try again.'
    } finally {
        isGeneratingGuide.value = false
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const copy = async (text, key) => {
    try { await navigator.clipboard.writeText(text) }
    catch {
        const el = document.createElement('textarea')
        el.value = text; el.style.position = 'fixed'; el.style.opacity = '0'
        document.body.appendChild(el); el.select(); document.execCommand('copy')
        document.body.removeChild(el)
    }
    copied.value[key] = true
    setTimeout(() => copied.value[key] = false, 2000)
}

// Very simple markdown renderer for the AI-generated guide
const renderMarkdown = (text) => {
    if (!text) return ''
    return text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        // Headings
        .replace(/^### (.+)$/gm, '<h3 class="text-sm font-bold text-gray-800 dark:text-gray-200 mt-4 mb-1">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold text-gray-900 dark:text-white mt-5 mb-2">$1</h2>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Code blocks
        .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="bg-slate-900 text-gray-200 rounded-xl p-4 overflow-x-auto text-xs font-mono mt-2 mb-3"><code>$1</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
        // Line breaks
        .replace(/\n\n/g, '</p><p class="mb-2">')
        .replace(/\n/g, '<br />')
}

onMounted(loadEmbedCode)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
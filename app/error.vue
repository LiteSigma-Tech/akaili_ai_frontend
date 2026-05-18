<!-- app/error.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 transition-colors duration-300">

    <!-- Logo -->
    <div class="mb-10">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="w-9 h-9 rounded-xl bg-[#9E4CFF] flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
          </svg>
        </div>
        <span class="text-xl font-bold text-gray-900 dark:text-white">Xeli AI</span>
      </NuxtLink>
    </div>

    <!-- Error card -->
    <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-10 text-center">

      <!-- 404 state -->
      <template v-if="error.statusCode === 404">
        <div class="w-20 h-20 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-[#9E4CFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-6xl font-extrabold text-[#9E4CFF] mb-3">404</p>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Page not found</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </template>

      <!-- 500+ state -->
      <template v-else>
        <div class="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <p class="text-6xl font-extrabold text-red-500 mb-3">{{ error.statusCode || 500 }}</p>

        <!-- Friendlier message when a stale/reused verification link triggers the error -->
        <template v-if="isVerificationError">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Link already used</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-8">
            This verification link has already been used or has expired.
            Your email is already verified — please log in to continue.
          </p>
        </template>
        <template v-else>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Something went wrong</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-8">
            We hit an unexpected error. Our team has been notified. Please try again in a moment.
          </p>
        </template>
      </template>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          @click="handleError"
          class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#9E4CFF] hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Go to Login
        </button>
        <NuxtLink
          to="/"
          class="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 font-semibold rounded-xl transition-colors text-sm"
        >
          Go to Homepage
        </NuxtLink>
      </div>
    </div>

    <!-- Footer note -->
    <p class="mt-8 text-xs text-gray-400 dark:text-gray-600">
      If this keeps happening, please contact support.
    </p>
  </div>
</template>

<script setup>
// Nuxt 3: error.vue receives an `error` prop with statusCode and message
const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

// Detect when a 500 was caused by clicking an already-used verification link.
// The backend throws when it finds email_verified_at is already set and the
// token is consumed — the URL always contains /verify-email or /auth/verify.
const isVerificationError = computed(() => {
  if (props.error.statusCode !== 500) return false
  const url = props.error.url || ''
  return url.includes('verify-email') || url.includes('/auth/verify')
})

// Always redirect to /login — never to /dashboard — so that:
//   1. Users who just hit a stale verification link land on a page they can act on.
//   2. Users who have not completed onboarding cannot bypass it via the error page.
const handleError = () => clearError({ redirect: '/login' })
</script>

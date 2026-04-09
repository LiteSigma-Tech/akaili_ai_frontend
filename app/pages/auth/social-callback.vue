<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"
        aria-label="Loading"></div>
      <p class="text-gray-600" role="status" aria-live="polite">{{ statusMessage }}</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'empty',
  middleware: []
})

const route = useRoute()
const authStore = useAuthStore()
const config = useRuntimeConfig()
const statusMessage = ref('Processing authentication...')

onMounted(async () => {
  try {
    const token = route.query.token
    const verified = route.query.verified === 'true'

    if (!token) {
      statusMessage.value = 'Invalid authentication data'
      handleFailure('Invalid authentication data')
      return
    }

    // Item 4: Store the token first, then fetch user data from the API.
    // Previously the user object was passed as a URL query parameter (?user=...),
    // which exposed name, email, and plan info in browser history, server logs,
    // and any analytics tool that captures page URLs.
    statusMessage.value = 'Verifying your account...'

    // Store token in cookie so the follow-up API call is authenticated
    authStore.setTokenCookie(token)

    // Fetch user data from the authenticated endpoint — never from the URL
    const userData = await $fetch(`${config.public.apiBase}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!userData?.data?.user) {
      throw new Error('Could not retrieve account details')
    }

    const user = userData.data.user

    statusMessage.value = 'Setting up your account...'
    authStore.setAuth(token, user)

    if (!authStore.isLoggedIn || !authStore.user) {
      throw new Error('Failed to set authentication')
    }

    statusMessage.value = 'Redirecting...'

    // If in popup, send success message to opener
    if (window.opener) {
      window.opener.postMessage({
        type: 'social-auth-success',
        token: token,
        user: user,
        verified: verified
      }, window.location.origin)

      setTimeout(() => { window.close() }, 500)
    } else {
      await nextTick()
      const pendingPlan = localStorage.getItem('pendingPlan')

      if (pendingPlan) {
        if (!user.onboarding_completed) {
          navigateTo('/dashboard/onboarding')
        } else if (!user.current_business_id) {
          navigateTo('/select-business')
        } else {
          localStorage.removeItem('pendingPlan')
          navigateTo({ path: '/checkout', query: { plan: pendingPlan } })
        }
      } else {
        if (!user.onboarding_completed) {
          navigateTo('/dashboard/onboarding')
        } else if (!user.current_business_id) {
          navigateTo('/select-business')
        } else {
          navigateTo('/dashboard')
        }
      }
    }
  } catch (error) {
    console.error('Social auth callback error:', error)
    statusMessage.value = 'Authentication failed'
    handleFailure(error.message || 'Authentication failed')
  }
})

function handleFailure(message) {
  if (window.opener) {
    window.opener.postMessage({ type: 'social-auth-error', message }, window.location.origin)
    setTimeout(() => { window.close() }, 2000)
  } else {
    setTimeout(() => {
      navigateTo('/login?error=' + encodeURIComponent(message))
    }, 2000)
  }
}
</script>

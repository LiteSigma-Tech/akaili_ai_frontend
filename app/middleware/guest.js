// middleware/guest.js
import { useAuthStore } from '~/stores/authStore'

export default defineNuxtRouteMiddleware((to, from) => {
    // Only run on client side
    if (process.server) return

    const authStore = useAuthStore()

    // Initialize auth from cookies
    // authStore.initializeAuth()

    // If user is already logged in, redirect to appropriate page
    if (authStore.isLoggedIn) {
        const user = authStore.user

        // Guard: isLoggedIn can be true while user is still null (auth plugin race).
        // Fall through to let the page load rather than crashing with a TypeError.
        if (!user) return

        // If onboarding not completed, go to onboarding
        if (!user.onboarding_completed) {
            return navigateTo('/dashboard/onboarding')
        }

        // If no business selected, go to business selector
        if (!user.current_business_id) {
            return navigateTo('/select-business')
        }

        // Otherwise, go to dashboard
        return navigateTo('/dashboard')
    }
})
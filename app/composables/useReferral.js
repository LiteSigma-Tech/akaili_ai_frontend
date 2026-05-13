// composables/useReferral.js
// Thin composable that exposes the referral store and bootstraps the referral
// code as soon as the user is available.  Import this in the dashboard layout
// (or any page) to guarantee the store is always initialised.
import { watch, onMounted } from 'vue'
import { useReferralStore } from '~/stores/referralStore'
import { useAuthStore } from '~/stores/authStore'

export function useReferral() {
  const referralStore = useReferralStore()
  const authStore = useAuthStore()

  // Generate the user's unique referral code if it hasn't been created yet.
  // Safe to call multiple times — the store action is idempotent.
  function initCode() {
    const username = authStore.user?.name
    if (username) {
      referralStore.generateCode(username)
    }
  }

  onMounted(initCode)

  // Re-init if the user object becomes available after mount (e.g. SSR hydration).
  watch(() => authStore.user, initCode)

  return {
    referralStore,
    xptBalance: computed(() => referralStore.xptBalance),
    canWithdraw: computed(() => referralStore.canWithdraw),
    referralCode: computed(() => referralStore.referralCode),
    shareUrl: computed(() =>
      referralStore.referralCode
        ? `https://xeliai.com/register?ref=${referralStore.referralCode}`
        : ''
    ),
  }
}
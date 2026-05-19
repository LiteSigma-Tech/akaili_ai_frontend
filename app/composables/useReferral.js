// composables/useReferral.js
// Thin wrapper that exposes referral store state to dashboard components.
// Phase 3 will replace this with an onMounted -> store.fetchDashboard() call.
import { computed } from 'vue'
import { useReferralStore } from '~/stores/referralStore'

export function useReferral() {
  const referralStore = useReferralStore()

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

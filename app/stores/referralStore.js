import { defineStore } from 'pinia'

export const useReferralStore = defineStore('referral', {
  state: () => ({
    referralCode: null,

    economy: {
      signupBonusXpt: 2,
      conversionBonusXpt: 5,
      milestoneBonusXpt: 10,
      milestoneEvery: 3,
      discountCostXpt: 15,
      discountPercent: 10,
      withdrawalMinXpt: 50,
      nairaPerXpt: 400,
      withdrawalCurrency: 'NGN',
    },

    referrals: [
      { id: '1', name: 'Amaka Okonkwo',  email: 'am***@gmail.com',   joinedAt: '2026-02-10T09:00:00Z', plan: 'professional', converted: true,  discountEarned: true  },
      { id: '2', name: 'Tunde Adeyemi',  email: 'tu***@yahoo.com',   joinedAt: '2026-02-18T11:00:00Z', plan: 'professional', converted: true,  discountEarned: true  },
      { id: '3', name: 'Chisom Eze',     email: 'ch***@gmail.com',   joinedAt: '2026-03-01T08:00:00Z', plan: 'enterprise',   converted: true,  discountEarned: false },
      { id: '4', name: 'Bello Ibrahim',  email: 'be***@outlook.com', joinedAt: '2026-03-15T14:00:00Z', plan: 'starter',      converted: false, discountEarned: false },
      { id: '5', name: 'Ngozi Okafor',   email: 'ng***@gmail.com',   joinedAt: '2026-04-01T10:00:00Z', plan: 'starter',      converted: false, discountEarned: false },
    ],
    usedDiscounts: 2,
    appliedPromoCode: null,
    generatedDiscountCode: null,
    milestoneBonusEarned: false,
    xptBalance: 38,
    xptLifetimeEarned: 49,
    xptHistory: [
      { date: '2026-02-10', amount: 2,   reason: 'Referral signup bonus: Amaka Okonkwo' },
      { date: '2026-02-18', amount: 2,   reason: 'Referral signup bonus: Tunde Adeyemi' },
      { date: '2026-02-18', amount: 5,   reason: 'Referral paid conversion: Tunde Adeyemi' },
      { date: '2026-03-01', amount: 2,   reason: 'Referral signup bonus: Chisom Eze' },
      { date: '2026-03-01', amount: 5,   reason: 'Referral paid conversion: Chisom Eze' },
      { date: '2026-03-01', amount: 10,  reason: 'Milestone bonus: 3 paid referrals' },
      { date: '2026-03-10', amount: -15, reason: 'Subscription discount redeemed' },
      { date: '2026-04-01', amount: 2,   reason: 'Referral signup bonus: Ngozi Okafor' },
    ],
    withdrawalHistory: [
      { id: 'w1', xptAmount: 10, nairaAmount: 4000, status: 'paid', requestedAt: '2026-01-20T10:00:00Z', paidAt: '2026-01-23T14:00:00Z' }
    ],
    pendingWithdrawal: false,
  }),

  getters: {
    totalReferrals:     (state) => state.referrals.length,
    totalPaidReferrals: (state) => state.referrals.filter(r => r.converted).length,
    milestoneProgress: (state) => {
      const every = state.economy?.milestoneEvery ?? 3
      return state.referrals.filter(r => r.converted).length % every
    },
    milestoneEarned: (state) => {
      const every = state.economy?.milestoneEvery ?? 3
      return Math.floor(state.referrals.filter(r => r.converted).length / every)
    },
    canWithdraw:        (state) => state.xptBalance >= (state.economy?.withdrawalMinXpt ?? 0),
    withdrawableNaira:  (state) => state.xptBalance * (state.economy?.nairaPerXpt ?? 0),
    xptToWithdrawal:    (state) => Math.max(0, (state.economy?.withdrawalMinXpt ?? 0) - state.xptBalance),
    freePerkActive:     (state) => state.referrals.length > 0,
  },

  actions: {
    applyReferralCode(_code) {
      return { valid: false, reason: 'not_wired' }
    },
    redeemSubscriptionDiscount() {
      return { success: false, reason: 'not_wired', message: 'Discount redemption is not yet available.' }
    },
    consumeDiscount() {
      return { success: false, reason: 'not_wired' }
    },
    setAppliedPromoCode(code) {
      this.appliedPromoCode = code
    },
    requestWithdrawal(_bank, _amount) {
      return { success: false, reason: 'not_wired', message: 'Withdrawal requests are not yet available.' }
    },
  },
})

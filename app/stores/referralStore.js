import { defineStore } from 'pinia'

function randomChars(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const useReferralStore = defineStore('referral', {
  state: () => ({
    referralCode: null,
    referrals: [
      { id: '1', name: 'Amaka Okonkwo',  email: 'am***@gmail.com',   joinedAt: '2026-02-10T09:00:00Z', plan: 'professional', converted: true,  discountEarned: true  },
      { id: '2', name: 'Tunde Adeyemi',  email: 'tu***@yahoo.com',   joinedAt: '2026-02-18T11:00:00Z', plan: 'professional', converted: true,  discountEarned: true  },
      { id: '3', name: 'Chisom Eze',     email: 'ch***@gmail.com',   joinedAt: '2026-03-01T08:00:00Z', plan: 'enterprise',   converted: true,  discountEarned: false },
      { id: '4', name: 'Bello Ibrahim',  email: 'be***@outlook.com', joinedAt: '2026-03-15T14:00:00Z', plan: 'starter',      converted: false, discountEarned: false },
      { id: '5', name: 'Ngozi Okafor',   email: 'ng***@gmail.com',   joinedAt: '2026-04-01T10:00:00Z', plan: 'starter',      converted: false, discountEarned: false },
    ],
    pendingDiscount: 1,
    usedDiscounts: 2,
    appliedPromoCode: null,
    generatedDiscountCode: null,
    freePerkActive: true,
    milestoneBonusEarned: false,
    xptBalance: 38,
    xptLifetimeEarned: 49,
    xptHistory: [
      { date: '2026-02-10', amount: 2, reason: 'Referral signup bonus: Amaka Okonkwo' },
      { date: '2026-02-18', amount: 2, reason: 'Referral signup bonus: Tunde Adeyemi' },
      { date: '2026-02-18', amount: 5, reason: 'Referral paid conversion: Tunde Adeyemi' },
      { date: '2026-03-01', amount: 2, reason: 'Referral signup bonus: Chisom Eze' },
      { date: '2026-03-01', amount: 5, reason: 'Referral paid conversion: Chisom Eze' },
      { date: '2026-03-01', amount: 10, reason: 'Milestone bonus: 3 paid referrals' },
      { date: '2026-03-10', amount: -15, reason: 'Subscription discount redeemed' },
      { date: '2026-04-01', amount: 2, reason: 'Referral signup bonus: Ngozi Okafor' },
    ],
    withdrawalHistory: [
      { id: 'w1', xptAmount: 10, nairaAmount: 4000, status: 'paid', requestedAt: '2026-01-20T10:00:00Z', paidAt: '2026-01-23T14:00:00Z' }
    ],
    pendingWithdrawal: false,
  }),

  getters: {
    totalReferrals:      (state) => state.referrals.length,
    totalPaidReferrals:  (state) => state.referrals.filter(r => r.converted).length,
    milestoneProgress:   (state) => Math.min(state.referrals.filter(r => r.converted).length, 3),
    canWithdraw:         (state) => state.xptBalance >= 50,
    withdrawableNaira:   (state) => state.xptBalance * 400,
    xptToWithdrawal:     (state) => Math.max(0, 50 - state.xptBalance),
    discountPercent:     (state) => state.pendingDiscount > 0 ? 10 : 0,
  },

  actions: {
    generateCode(username) {
      if (!this.referralCode) {
        this.referralCode = `${username.toUpperCase()}-${randomChars(4)}`
      }
    },
    applyReferralCode(code) {
      if (code && code.trim()) {
        return { valid: true, message: 'Referral code accepted' }
      }
      return { valid: false, message: 'Invalid referral code' }
    },
    consumeDiscount() {
      if (this.pendingDiscount > 0) {
        this.pendingDiscount--
        this.usedDiscounts++
        return true
      }
      return false
    },
    setAppliedPromoCode(code) {
      this.appliedPromoCode = code
    },
    redeemSubscriptionDiscount() {
      if (this.xptBalance < 15) {
        return { success: false, code: null, message: 'Insufficient XPT. You need 15 XPT.' }
      }
      if (this.generatedDiscountCode) {
        return { success: false, code: this.generatedDiscountCode, message: 'You already have an unused discount code.' }
      }
      this.xptBalance -= 15
      const code = `XPDISC-${randomChars(6)}`
      this.generatedDiscountCode = code
      this.xptHistory.push({ date: new Date().toISOString().slice(0,10), amount: -15, reason: 'Subscription discount redeemed' })
      return { success: true, code, message: 'Discount code generated successfully.' }
    },
    requestWithdrawal(bankDetails) {
      if (this.xptBalance < 50) {
        return { success: false, message: 'You need at least 50 XPT to withdraw.' }
      }
      if (this.pendingWithdrawal) {
        return { success: false, message: 'You already have a withdrawal pending review.' }
      }
      const naira = this.xptBalance * 400
      this.withdrawalHistory.push({
        id: `w${this.withdrawalHistory.length + 1}`,
        xptAmount: this.xptBalance,
        nairaAmount: naira,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        paidAt: null
      })
      this.xptHistory.push({ date: new Date().toISOString().slice(0,10), amount: -this.xptBalance, reason: 'Withdrawal requested' })
      this.xptBalance = 0
      this.pendingWithdrawal = true
      return { success: true, message: 'Withdrawal request submitted. Processing takes 3 to 5 business days.' }
    },
    awardSignupBonus() {
      this.xptBalance += 2
      this.xptLifetimeEarned += 2
      this.xptHistory.push({ date: new Date().toISOString().slice(0,10), amount: 2, reason: 'Referral signup bonus' })
    },
    awardConversionBonus() {
      this.xptBalance += 5
      this.xptLifetimeEarned += 5
      this.xptHistory.push({ date: new Date().toISOString().slice(0,10), amount: 5, reason: 'Referral paid conversion' })
    },
  }
})

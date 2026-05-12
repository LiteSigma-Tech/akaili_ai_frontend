<script setup>
import { useReferralStore } from '~/stores/referralStore'
import { useAuthStore } from '~/stores/authStore'
import { Gift, Copy, Check, Share2, Users, Tag, Zap, BookOpen, Trophy, Info, Landmark } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Referrals and Rewards | Xeliai' })

const referralStore = useReferralStore()
const authStore = useAuthStore()

const toastVisible = ref(false)
const toastMessage = ref('')
const toastSuccess = ref(true)
const withdrawModalOpen = ref(false)
const bankDetails = reactive({ accountName: '', accountNumber: '', bankName: '' })
const bankErrors = reactive({ accountName: '', accountNumber: '', bankName: '' })
const copyState = ref(false)
const copyShareState = ref(false)
const milestoneDots = [33, 66, 100]

onMounted(() => {
  referralStore.generateCode(authStore.user?.name ?? 'user')
})

function showToast(message, success = true) {
  toastMessage.value = message
  toastSuccess.value = success
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 4000)
}

function handleCopy(code, type = 'code') {
  navigator.clipboard.writeText(code)
  if (type === 'code') {
    copyState.value = true
    setTimeout(() => { copyState.value = false }, 2000)
  } else {
    copyShareState.value = true
    setTimeout(() => { copyShareState.value = false }, 2000)
  }
}

function handleWithdrawal() {
  bankErrors.accountName = ''
  bankErrors.accountNumber = ''
  bankErrors.bankName = ''
  let valid = true
  if (!bankDetails.accountName.trim()) { bankErrors.accountName = 'Account name is required'; valid = false }
  if (!/^\d{10}$/.test(bankDetails.accountNumber)) { bankErrors.accountNumber = 'Enter a valid 10-digit account number'; valid = false }
  if (!bankDetails.bankName.trim()) { bankErrors.bankName = 'Bank name is required'; valid = false }
  if (!valid) return
  const result = referralStore.requestWithdrawal({ ...bankDetails })
  withdrawModalOpen.value = false
  showToast(result.message, result.success)
}

const xptHistoryWithBalance = computed(() => {
  const sorted = [...referralStore.xptHistory].sort((a, b) => new Date(a.date) - new Date(b.date))
  let running = 0
  return sorted.map(e => { running += e.amount; return { ...e, balanceAfter: running } }).reverse()
})

const shareUrl = computed(() => `https://xeliai.com/register?ref=${referralStore.referralCode}`)

const refSections = [0, 80, 160, 240, 320, 400]
</script>

<template>
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="mb-6 rounded-2xl border border-blue-200 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-800 p-4">
    <p class="text-sm text-blue-900 dark:text-blue-100">
      The Referrals & Rewards section has moved to <NuxtLink to="/dashboard/settings" class="font-semibold underline text-blue-900 dark:text-blue-100">Settings → Referrals & Rewards</NuxtLink>.
    </p>
  </div>
  <!-- Section 1: Page header -->
  <div class="mb-8 ref-enter" :style="{ animationDelay: refSections[0] + 'ms' }">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Referrals and Rewards</h1>
    <p class="text-gray-500 dark:text-gray-400 mt-1">Track referrals, earn XPT tokens, and redeem rewards.</p>
  </div>

  <!-- Section 2: XPT Wallet card -->
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6 ref-enter" :style="{ animationDelay: refSections[1] + 'ms' }">
    <div class="lg:col-span-2">
      <div class="flex items-center gap-2 mb-2">
        <Zap class="w-4 h-4 text-yellow-400" />
        <span class="uppercase text-xs font-semibold text-gray-400">XPT Wallet</span>
      </div>
      <div class="flex items-end gap-3">
        <span class="text-6xl font-bold text-gray-900 dark:text-white">{{ referralStore.xptBalance }}</span>
        <span class="text-lg font-semibold text-gray-500">XPT</span>
      </div>
      <div class="text-gray-400 text-sm mb-2">Referral Tokens</div>
      <div v-if="!referralStore.canWithdraw">
        <div class="flex justify-between text-xs text-gray-500 mb-1">
          <span>{{ referralStore.xptBalance }} of 50 XPT to withdrawal threshold</span>
        </div>
        <div class="h-2 w-full rounded-full bg-gray-100 dark:bg-slate-700">
          <div class="bg-[#9E4CFF] h-2 rounded-full transition-all duration-700" :style="{ width: Math.min(100, (referralStore.xptBalance / 50) * 100) + '%' }" />
        </div>
      </div>
      <div v-else class="mt-2">
        <div class="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2">
          <Check class="w-4 h-4" /> Withdrawal threshold reached
        </div>
      </div>
      <div class="mt-3 text-xs text-gray-400">Lifetime earned: {{ referralStore.xptLifetimeEarned }} XPT</div>
    </div>
    <div class="flex flex-col gap-4">
      <div class="bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-3">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">XPT needed to withdraw</div>
        <div class="text-xl font-bold">{{ referralStore.xptToWithdrawal }} XPT</div>
      </div>
      <div class="bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-3">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Current withdrawal value</div>
        <div class="text-xl font-bold">₦{{ referralStore.withdrawableNaira.toLocaleString('en-NG') }}</div>
      </div>
      <div class="bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-3">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Past withdrawals</div>
        <div class="text-xl font-bold">{{ referralStore.withdrawalHistory.length }}</div>
      </div>
    </div>
  </div>

  <!-- Section 3: Three stat chips row -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 ref-enter" :style="{ animationDelay: refSections[2] + 'ms' }">
    <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
      <Users class="w-7 h-7 text-gray-400" />
      <div>
        <div class="text-2xl font-bold">{{ referralStore.totalReferrals }}</div>
        <div class="text-xs text-gray-500 mt-1">Total Referrals</div>
      </div>
    </div>
    <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
      <Trophy class="w-7 h-7 text-[#9E4CFF]" />
      <div>
        <div class="flex items-center gap-2">
          <span class="text-2xl font-bold">{{ referralStore.totalPaidReferrals }}</span>
          <UBadge v-if="referralStore.totalPaidReferrals > 0" color="purple" size="xs">Earning discounts</UBadge>
        </div>
        <div class="text-xs text-gray-500 mt-1">Paid Conversions</div>
      </div>
    </div>
    <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
      <Tag class="w-7 h-7 text-yellow-500" />
      <div>
        <div class="text-2xl font-bold">{{ referralStore.pendingDiscount }}</div>
        <div class="text-xs text-gray-500 mt-1">Discounts Queued</div>
        <div class="text-xs text-gray-400">10 percent each</div>
      </div>
    </div>
  </div>

  <!-- Section 4: Referral Code card -->
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm mb-6 ref-enter" :style="{ animationDelay: refSections[3] + 'ms' }">
    <div class="uppercase text-xs font-semibold text-gray-400 mb-2">Your Referral Code</div>
    <div class="flex items-center justify-between bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-5 py-4 mb-4">
      <span class="font-mono text-xl font-bold tracking-widest text-gray-900 dark:text-white">{{ referralStore.referralCode }}</span>
      <button @click="handleCopy(referralStore.referralCode, 'code')" class="flex items-center gap-2 text-[#9E4CFF] font-semibold">
        <component :is="copyState ? Check : Copy" class="w-5 h-5" />
        <span v-if="copyState">Copied</span>
        <span v-else>Copy</span>
      </button>
    </div>
    <div class="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 mt-4">
      <Share2 class="w-5 h-5 text-gray-400" />
      <span class="font-mono text-sm text-gray-900 dark:text-white truncate">{{ shareUrl }}</span>
      <button @click="handleCopy(shareUrl, 'share')" class="flex items-center gap-2 text-[#9E4CFF] font-semibold">
        <component :is="copyShareState ? Check : Copy" class="w-5 h-5" />
        <span v-if="copyShareState">Copied</span>
        <span v-else>Copy</span>
      </button>
    </div>
  </div>

  <!-- Section 5: Milestone tracker -->
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm mb-6 ref-enter" :style="{ animationDelay: refSections[4] + 'ms' }">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <Trophy class="w-5 h-5 text-[#9E4CFF]" />
        <span class="font-semibold">Milestone Progress</span>
      </div>
      <span class="text-xs text-gray-500">{{ referralStore.milestoneProgress }} of 3 paid referrals</span>
    </div>
    <div class="h-2 w-full rounded-full bg-gray-100 dark:bg-slate-700 mb-3 relative">
      <div class="bg-[#9E4CFF] h-2 rounded-full transition-all duration-700" :style="{ width: Math.min(100, (referralStore.milestoneProgress / 3) * 100) + '%' }" />
      <template v-for="(dot, i) in milestoneDots" :key="i">
        <div :style="{ left: dot + '%' }" class="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900" :class="referralStore.milestoneProgress > i ? 'bg-[#9E4CFF]' : 'bg-gray-300 dark:bg-slate-700'" />
      </template>
    </div>
    <div v-if="referralStore.milestoneBonusEarned" class="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2 mt-2">
      <Check class="w-4 h-4" /> Milestone unlocked. One free billing cycle earned.
    </div>
    <div v-else class="text-xs text-gray-400 mt-2">Reach 3 concurrent paid referrals to unlock one free billing cycle.</div>
  </div>

  <!-- Section 6: Redemption cards -->
  <div>
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Redeem Your XPT</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4 ref-enter" :style="{ animationDelay: refSections[5] + 'ms' }">
      <!-- Card 1: Subscription Discount -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
        <div class="flex items-center gap-2 mb-2">
          <div class="bg-purple-50 dark:bg-purple-500/10 rounded-lg p-2"><Tag class="w-5 h-5 text-[#9E4CFF]" /></div>
          <span class="font-semibold">Subscription Discount</span>
        </div>
        <div class="text-gray-500 dark:text-gray-400 text-sm mb-2">Generate a 15 percent discount code for your next payment. Stacks with other discounts up to 25 percent total.</div>
        <div class="flex items-center gap-2 mb-2">
          <UBadge color="purple">15 XPT</UBadge>
          <span v-if="referralStore.xptBalance >= 15" class="text-green-500 text-xs">Available</span>
          <span v-else class="text-gray-400 text-xs">Not enough XPT</span>
        </div>
        <div v-if="referralStore.generatedDiscountCode" class="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 mt-2">
          <span class="font-mono text-sm font-bold text-gray-900 dark:text-white">{{ referralStore.generatedDiscountCode }}</span>
          <button @click="handleCopy(referralStore.generatedDiscountCode, 'code')" class="flex items-center gap-2 text-[#9E4CFF] font-semibold">
            <component :is="copyState ? Check : Copy" class="w-5 h-5" />
            <span v-if="copyState">Copied</span>
            <span v-else>Copy</span>
          </button>
        </div>
        <template v-else>
          <UButton :disabled="referralStore.xptBalance < 15" color="primary" class="mt-2" @click="() => {
            const result = referralStore.redeemSubscriptionDiscount();
            showToast(result.message, result.success)
          }">
            Generate Discount Code
          </UButton>
        </template>
      </div>
      <!-- Card 2: Cash Withdrawal -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
        <div class="flex items-center gap-2 mb-2">
          <div class="bg-yellow-50 dark:bg-yellow-500/10 rounded-lg p-2"><Landmark class="w-5 h-5 text-yellow-500" /></div>
          <span class="font-semibold">Cash Withdrawal</span>
        </div>
        <div class="text-gray-500 dark:text-gray-400 text-sm mb-2">Reach 50 XPT and withdraw real money. Each token is worth ₦400. Minimum withdrawal is ₦20,000 at 50 XPT.</div>
        <div class="text-[#9E4CFF] text-xs font-semibold mb-2">Your balance is worth ₦{{ referralStore.withdrawableNaira.toLocaleString('en-NG') }}</div>
        <div v-if="referralStore.pendingWithdrawal" class="bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-lg px-4 py-2 text-xs font-semibold flex items-center gap-2 mb-2">
          <Info class="w-4 h-4" /> Withdrawal pending review
        </div>
        <UButton v-if="referralStore.canWithdraw && !referralStore.pendingWithdrawal" color="primary" class="mt-2" @click="() => withdrawModalOpen = true">
          Request Withdrawal
        </UButton>
        <UButton v-else :disabled="true" class="mt-2">{{ referralStore.canWithdraw ? 'Pending Review' : referralStore.xptToWithdrawal + ' more XPT needed' }}</UButton>
      </div>
      <!-- Card 3: Free Referral Perks -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
        <div class="flex items-center gap-2 mb-2">
          <div class="bg-green-50 dark:bg-green-500/10 rounded-lg p-2"><Gift class="w-5 h-5 text-green-600 dark:text-green-400" /></div>
          <span class="font-semibold">Free Referral Perks</span>
        </div>
        <div class="text-gray-500 dark:text-gray-400 text-sm mb-2">Active when any referred user has an account, even on the free plan.</div>
        <div v-if="referralStore.freePerkActive" class="flex flex-wrap gap-2 mt-2">
          <span class="flex items-center gap-1 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full px-3 py-1 text-xs font-semibold animate-pulse"><span class="w-2 h-2 bg-green-400 rounded-full"></span>+5 Daily Messages</span>
          <span class="flex items-center gap-1 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full px-3 py-1 text-xs font-semibold animate-pulse"><span class="w-2 h-2 bg-green-400 rounded-full"></span>+1 Team Seat</span>
          <span class="flex items-center gap-1 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full px-3 py-1 text-xs font-semibold animate-pulse"><span class="w-2 h-2 bg-green-400 rounded-full"></span>+1 Weekly Upload</span>
        </div>
        <div v-else class="flex flex-wrap gap-2 mt-2">
          <span class="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 text-gray-400 rounded-full px-3 py-1 text-xs font-semibold">Refer someone to unlock</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Withdrawal Modal -->
  <UModal v-model="withdrawModalOpen">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-8 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Withdrawal Request</h3>
        <div class="mb-4 text-yellow-700 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg px-4 py-2 text-xs">Bank details must match your account name. Processing takes 3 to 5 business days.</div>
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Name</label>
          <input v-model="bankDetails.accountName" type="text" class="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white border-gray-300 text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
          <div v-if="bankErrors.accountName" class="text-xs text-red-500 mt-1">{{ bankErrors.accountName }}</div>
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Number</label>
          <input v-model="bankDetails.accountNumber" type="text" maxlength="10" inputmode="numeric" class="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white border-gray-300 text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
          <div v-if="bankErrors.accountNumber" class="text-xs text-red-500 mt-1">{{ bankErrors.accountNumber }}</div>
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
          <input v-model="bankDetails.bankName" type="text" class="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white border-gray-300 text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
          <div v-if="bankErrors.bankName" class="text-xs text-red-500 mt-1">{{ bankErrors.bankName }}</div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <UButton color="gray" @click="withdrawModalOpen = false">Cancel</UButton>
          <UButton color="primary" @click="handleWithdrawal">Submit Request</UButton>
        </div>
      </div>
    </div>
  </UModal>

  <!-- Section 7: Referrals table -->
  <div class="overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-800 mt-8 ref-enter" :style="{ animationDelay: refSections[0] + 'ms' }">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
      <thead>
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Joined</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Plan</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Discount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in [...referralStore.referrals].sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))" :key="r.id" class="bg-white dark:bg-slate-900">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ r.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ r.email }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ new Date(r.joinedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' }) }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold" :class="r.converted ? 'text-[#9E4CFF]' : 'text-gray-500'">{{ r.plan }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span v-if="r.converted" class="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full px-2.5 py-0.5 text-xs font-semibold">Converted</span>
            <span v-else class="bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full px-2.5 py-0.5 text-xs font-semibold">Free Tier</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span v-if="r.converted && !r.discountEarned" class="bg-purple-50 dark:bg-purple-500/10 text-[#9E4CFF] rounded-full px-2.5 py-0.5 text-xs font-semibold">Pending</span>
            <span v-else-if="r.discountEarned" class="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 text-gray-400 rounded-full px-2.5 py-0.5 text-xs font-semibold"><Check class="w-4 h-4" />Applied</span>
            <span v-else class="bg-gray-100 dark:bg-slate-700 text-gray-400 rounded-full px-2.5 py-0.5 text-xs font-semibold">Not yet</span>
          </td>
        </tr>
        <tr v-if="referralStore.referrals.length === 0">
          <td colspan="6" class="py-12 text-center">
            <Gift class="mx-auto w-10 h-10 text-gray-300 mb-2" />
            <div class="text-gray-400 mb-2">No referrals yet</div>
            <div class="flex items-center gap-2 justify-center">
              <span class="font-mono text-sm text-gray-900 dark:text-white">{{ shareUrl }}</span>
              <button @click="handleCopy(shareUrl, 'share')" class="flex items-center gap-2 text-[#9E4CFF] font-semibold">
                <component :is="copyShareState ? Check : Copy" class="w-5 h-5" />
                <span v-if="copyShareState">Copied</span>
                <span v-else>Copy</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Section 8: Withdrawal History -->
  <div v-if="referralStore.withdrawalHistory.length > 0" class="mt-8 ref-enter" :style="{ animationDelay: refSections[1] + 'ms' }">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Withdrawal History</h3>
    <div class="overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-800">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
        <thead>
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date Requested</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">XPT Spent</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Naira Value</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Paid On</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="w in referralStore.withdrawalHistory" :key="w.id" class="bg-white dark:bg-slate-900">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ new Date(w.requestedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' }) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#9E4CFF]">{{ w.xptAmount }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">₦{{ w.nairaAmount.toLocaleString('en-NG') }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ w.paidAt ? new Date(w.paidAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' }) : '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="w.status === 'paid'" class="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full px-2.5 py-0.5 text-xs font-semibold">Paid</span>
              <span v-else class="bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full px-2.5 py-0.5 text-xs font-semibold">Pending</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Section 9: XPT Activity Log -->
  <div class="mt-8 ref-enter" :style="{ animationDelay: refSections[2] + 'ms' }">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">XPT Activity Log</h3>
    <div class="overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-800">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
        <thead>
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Activity</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Balance After</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in xptHistoryWithBalance" :key="e.date + e.reason" class="bg-white dark:bg-slate-900">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ new Date(e.date).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' }) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ e.reason }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold" :class="e.amount > 0 ? 'text-[#9E4CFF]' : 'text-red-400'">{{ e.amount > 0 ? '+' : '' }}{{ e.amount }} XPT</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ e.balanceAfter }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Section 10: How it works — info box -->
  <div class="bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 mt-8 ref-enter" :style="{ animationDelay: refSections[3] + 'ms' }">
    <div class="flex items-center gap-2 mb-2">
      <Info class="w-5 h-5 text-[#9E4CFF]" />
      <span class="font-semibold">How Rewards Work</span>
    </div>
    <div class="text-gray-500 dark:text-gray-400 text-sm space-y-2">
      <p>Free referral perks: Refer any user (even on free plan) to unlock bonus daily messages, extra team seat, and weekly upload.</p>
      <p>Paid referral discounts: When your referral upgrades, you earn XPT tokens and 10% discounts for both of you.</p>
      <p>Milestone bonus: Reach 3 concurrent paid referrals to unlock a one-time 10 XPT bonus and a free billing cycle.</p>
      <p>Withdrawals: Each XPT is worth ₦400. Minimum withdrawal is 50 XPT (₦20,000).</p>
    </div>
  </div>

  <!-- Toast -->
  <Transition name="toast">
    <div v-if="toastVisible"
      class="fixed bottom-6 right-6 z-50 max-w-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-5 py-4 shadow-xl"
      role="alert" aria-live="polite">
      <div class="flex items-start gap-3">
        <component :is="toastSuccess ? Check : Info" class="w-5 h-5 shrink-0 mt-0.5"
          :class="toastSuccess ? 'text-green-500' : 'text-red-400'" />
        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ toastMessage }}</p>
      </div>
    </div>
  </Transition>
</div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
.ref-enter {
  opacity: 0;
  transform: translateY(14px);
  animation: ref-rise 0.4s ease forwards;
}
@keyframes ref-rise {
  to { opacity: 1; transform: translateY(0); }
}
</style>

<!-- dashboard/onboarding.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 py-1 px-6 transition-colors duration-300">
      <div class="max-w-4xl mx-auto flex justify-between items-center">
        <NuxtLink to="/" aria-label="Xeli AI Home">
          <NuxtImg width="100" height="60" src="/logo-small.png" alt="Xeli AI Logo" loading="eager" />
        </NuxtLink>
        <button @click="handleLogout"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-3 py-1 transition-colors">
          Logout
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 py-12 px-6">
      <div class="max-w-4xl mx-auto">
        <!-- Progress Indicator -->
        <div class="mb-12">
          <OnboardingProgress :current="currentStepNumber" />
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Step 1: Business Setup -->
        <div v-else-if="currentStep === 'business_setup'"
          class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-8 transition-colors duration-300">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Setup Your Business Profile</h2>

          <form @submit.prevent="handleCompanySetup" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Company Name -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Company Name</label>
                <input v-model="companyForm.company_name" type="text" required placeholder="Xeli AI Ltd"
                  class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500" />
              </div>

              <!-- Industry -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Industry</label>
                <select v-model="companyForm.industry" required
                  class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white">
                  <option value="">Select Industry</option>
                  <option value="technology">Technology</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Website URL -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Website URL</label>
                <input v-model="companyForm.website_url" type="url" placeholder="https://xeli.ai"
                  class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500" />
              </div>

              <!-- Company Size -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Company Size</label>
                <select v-model="companyForm.company_size"
                  class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white">
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201+">201+ employees</option>
                </select>
              </div>

              <!-- Location -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Location</label>
                <input v-model="companyForm.location" type="text" placeholder="Lagos, Nigeria"
                  class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500" />
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Business Description</label>
              <textarea v-model="companyForm.description" rows="3" placeholder="Briefly describe your business..."
                class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500 resize-none"></textarea>
            </div>

            <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {{ error }}
            </div>

            <button type="submit" :disabled="setupLoading"
              class="w-full bg-[#9E4CFF] text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold">
              {{ setupLoading ? 'Setting up...' : 'Continue to Chatbot Setup' }}
            </button>
          </form>
        </div>

        <!-- Step 2: Chatbot Creation -->
        <div v-else-if="currentStep === 'chatbot_creation'"
          class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-8 transition-colors duration-300">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Your AI Chatbot</h2>

          <form @submit.prevent="handleChatbotCreation" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Chatbot Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Chatbot Name</label>
                <input v-model="chatbotForm.name" type="text" required placeholder="e.g. Javis"
                  class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500" />
              </div>

              <!-- Chatbot Type (THE ERROR FIX) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Chatbot Type</label>
                <select v-model="chatbotForm.type"
                  class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white">
                  <option value="general">General</option>
                  <option value="customer_support">Customer Support</option>
                  <option value="sales">Sales Assistant</option>
                </select>
              </div>

              <!-- Personality -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">AI Personality</label>
                <select v-model="chatbotForm.personality"
                  class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white">
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                </select>
              </div>

              <!-- Brand Color -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Brand Color</label>
                <div class="flex items-center gap-3">
                  <input v-model="chatbotForm.primary_color" type="color" class="h-10 w-20 rounded border border-gray-300 dark:border-slate-700 bg-transparent p-1" />
                  <span class="text-sm font-mono uppercase text-gray-500">{{ chatbotForm.primary_color }}</span>
                </div>
              </div>

              <!-- Widget Position -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Widget Position</label>
                <select v-model="chatbotForm.widget_position"
                  class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white">
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>

              <!-- Handoff Toggle -->
              <div class="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-slate-800">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Handoff to Human</span>
                <input v-model="chatbotForm.handoff_to_human" type="checkbox" class="w-5 h-5 accent-purple-600" />
              </div>
            </div>

            <!-- Welcome Message -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Welcome Message</label>
              <textarea v-model="chatbotForm.welcome_message" rows="4"
                class="w-full rounded-lg p-3 outline-none transition-all border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500 resize-none"
                placeholder="Welcome! what would you like to do?" required></textarea>
            </div>

            <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {{ error }}
            </div>

            <div class="flex space-x-4">
              <button type="button" @click="goBack"
                class="flex-1 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                Back
              </button>
              <button type="submit" :disabled="setupLoading"
                class="flex-[2] bg-[#9E4CFF] text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold">
                {{ setupLoading ? 'Creating...' : 'Complete Setup' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Completed State -->
        <div v-else-if="currentStep === 'completed'"
          class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-12 text-center">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Setup Complete!</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-8">Account configured. Access your dashboard to start training your AI.</p>
          <button @click="finishOnboarding"
            class="bg-[#9E4CFF] text-white py-3 px-12 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
            Go to Dashboard
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'empty', middleware: 'auth' })

const authStore = useAuthStore()
const onboardingStore = useOnboardingStore()
const businessStore = useBusinessStore()
const chatbotStore = useChatbotStore()
const router = useRouter()

const loading = ref(true)
const setupLoading = ref(false)
const error = ref('')
const currentStep = ref('business_setup')

const companyForm = ref({
  company_name: '',
  industry: '',
  plan: 'free', // Default from your backend example
  description: '',
  website_url: '',
  company_size: '1-10',
  location: '',
  timezone: 'UTC', // Default from your backend example
  primary_language: 'en' // Default from your backend example
})

const chatbotForm = ref({
  name: '',
  description: '',
  type: 'general', // FIX: Matches your working backend record
  personality: 'friendly',
  primary_color: '#9E4CFF',
  widget_position: 'bottom-right',
  welcome_message: 'Welcome! what would you like to do?',
  handoff_to_human: false,
  is_active: true // Backend uses boolean
})

const currentStepNumber = computed(() => {
  if (currentStep.value === 'business_setup') return 1
  if (currentStep.value === 'chatbot_creation') return 2
  return 3
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleCompanySetup = async () => {
  setupLoading.value = true
  error.value = ''

  try {
    const result = await businessStore.createBusiness(companyForm.value)

    if (result.success) {
      currentStep.value = 'chatbot_creation'
    } else {
      const msg = typeof result.message === 'string' ? result.message : JSON.stringify(result.message);
      
      if (msg.includes('User already has a business')) {
        currentStep.value = 'chatbot_creation'
      } else {
        error.value = result.message || 'Failed to setup company'
      }
    }
  } catch (err) {
    if (err.message && err.message.includes('User already has a business')) {
      currentStep.value = 'chatbot_creation'
    } else {
      error.value = err.message || 'An error occurred'
    }
  } finally {
    setupLoading.value = false
  }
}

const handleChatbotCreation = async () => {
  setupLoading.value = true
  error.value = ''
  try {
    const result = await chatbotStore.createChatbot(chatbotForm.value)
    if (result.success) {
      await onboardingStore.completeOnboarding()
      currentStep.value = 'completed'
    } else {
      // Backend error like "type is invalid" will appear here
      error.value = JSON.stringify(result.message) || 'Failed to create chatbot'
    }
  } catch (err) {
    error.value = err.message || 'An error occurred'
  } finally {
    setupLoading.value = false
  }
}

const goBack = () => { currentStep.value = 'business_setup' }

const finishOnboarding = () => {
  const pendingPlan = localStorage.getItem('pendingPlan')
  if (pendingPlan) {
    localStorage.removeItem('pendingPlan')
    router.push({ path: '/checkout', query: { plan: pendingPlan } })
  } else {
    router.push('/dashboard')
  }
}

onMounted(async () => {
  try {
    if (!authStore.isLoggedIn) { router.push('/login'); return }
    const savedPlan = localStorage.getItem('pendingPlan')
    if (savedPlan) companyForm.value.plan = savedPlan
    const user = authStore.user
    if (user?.onboarding_step) currentStep.value = user.onboarding_step
    await onboardingStore.getStatus()
    if (user?.current_business_id && currentStep.value === 'business_setup') {
      currentStep.value = 'chatbot_creation'
    }
  } catch (err) {
    router.push('/login')
  } finally {
    loading.value = false
  }
})
</script>
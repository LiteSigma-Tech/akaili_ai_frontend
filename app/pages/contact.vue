<template>
  <section class="min-h-screen pt-30 md:pt-24 lg:pt-28 bg-white dark:bg-[#0b1020] transition-colors duration-300">
    <div class="max-w-7xl pt-19 mx-auto px-6 lg:px-8">
      
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#9E4CFF] to-blue-600 dark:from-[#9E4CFF] dark:to-white">
          Get in Touch
        </h1>
        <p class="mt-3 text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Have a question about our AI chatbots or want a demo? Fill the form or reach us directly.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- SIDEBAR INFO CARD -->
        <aside class="lg:col-span-4 rounded-2xl p-6 shadow-xl border transition-colors
          bg-gray-50 border-gray-100 
          dark:bg-white/5 dark:border-white/10 backdrop-blur-sm">
          
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 dark:bg-white/10 text-purple-600 dark:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Contact Sales & Support</h3>
              <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">We're here to help with setup, integrations, and trials.</p>
            </div>
          </div>

          <dl class="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <dt class="font-medium text-gray-900 dark:text-gray-200">Email</dt>
              <dd class="mt-1">support@xeli.ai</dd>
            </div>
            <div>
              <dt class="font-medium text-gray-900 dark:text-gray-200">Phone</dt>
              <dd class="mt-1">+234 810 308 3111</dd>
            </div>
            <div>
              <dt class="font-medium text-gray-900 dark:text-gray-200">Hours</dt>
              <dd class="mt-1">Mon–Fri, 9:00 AM — 6:00 PM</dd>
            </div>
          </dl>

          <div class="mt-6">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-200">Or reach us on</h4>
            <div class="flex items-center gap-3 mt-3 text-gray-500 dark:text-white">
              <a aria-label="Twitter" href="#" class="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-white/5 dark:hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8.29 20c7.547 0 11.675-6.155 11.675-11.49 0-.175 0-.349-.012-.522A8.18 8.18 0 0022 5.92a8.27 8.27 0 01-2.357.637 4.07 4.07 0 001.804-2.245 8.18 8.18 0 01-2.605.98A4.11 4.11 0 0015.447 4c-2.266 0-4.102 1.827-4.102 4.08 0 .32.036.632.105.931A11.66 11.66 0 013 5.15a4.07 4.07 0 001.27 5.444 4.06 4.06 0 01-1.856-.512v.05C4.41 13.13 6.25 14.5 8.47 14.69a4.1 4.1 0 01-1.85.07 4.11 4.11 0 003.83 2.83A8.233 8.233 0 012 18.58 11.616 11.616 0 008.29 20"/></svg>
              </a>
              <a aria-label="LinkedIn" href="https://www.linkedin.com/company/xeli-ai" class="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-white/5 dark:hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-14h4v2a4 4 0 014-1zM2 9h4v11H2z"/></svg>
              </a>
            </div>
          </div>
        </aside>

        <!-- MAIN CONTENT AREA -->
        <div class="lg:col-span-8">
          
          <!-- 1. THE FORM (Visible if isSubmitted is false) -->
          <form v-if="!isSubmitted" @submit.prevent="handleSubmit" class="rounded-2xl p-6 shadow-xl border transition-colors
            bg-gray-50 border-gray-100 
            dark:bg-white/5 dark:border-white/10 backdrop-blur-sm">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Full name</label>
                <input v-model="form.name" type="text" required placeholder="Jane Doe" 
                  class="mt-2 w-full rounded-lg p-3 outline-none transition-all
                  bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500
                  dark:bg-slate-900/50 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                <input v-model="form.email" type="email" required placeholder="jane@company.com" 
                  class="mt-2 w-full rounded-lg p-3 outline-none transition-all
                  bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500
                  dark:bg-slate-900/50 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Company (optional)</label>
                <input v-model="form.company" type="text" placeholder="Acme Inc." 
                  class="mt-2 w-full rounded-lg p-3 outline-none transition-all
                  bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500
                  dark:bg-slate-900/50 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Phone (optional)</label>
                <input v-model="form.phone" type="tel" placeholder="+1 555 000 0000" 
                  class="mt-2 w-full rounded-lg p-3 outline-none transition-all
                  bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500
                  dark:bg-slate-900/50 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500" />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Subject</label>
                <input v-model="form.subject" type="text" required placeholder="How can we help?" 
                  class="mt-2 w-full rounded-lg p-3 outline-none transition-all
                  bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500
                  dark:bg-slate-900/50 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500" />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Message</label>
                <textarea v-model="form.message" required rows="6" placeholder="Tell us about your use case..." 
                  class="mt-2 w-full rounded-lg p-3 outline-none resize-none transition-all
                  bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500
                  dark:bg-slate-900/50 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:ring-purple-500"></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Contact Preference</label>
                <select v-model="form.preference" 
                  class="mt-2 w-full rounded-lg p-3 outline-none transition-all appearance-none
                  bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-purple-500
                  dark:bg-slate-900/50 dark:border-white/10 dark:text-white">
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="either">Either</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Attach file (optional)</label>
                <input ref="fileInput" @change="handleFile" type="file" 
                  class="mt-2 w-full rounded-lg p-2 text-sm outline-none transition-all
                  bg-white border border-gray-300 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100
                  dark:bg-slate-900/50 dark:border-white/10 dark:text-gray-300 dark:file:bg-purple-600 dark:file:text-white" />
              </div>

              <input v-model="form._honeypot" type="text" name="_honeypot" class="hidden" autocomplete="off" tabindex="-1" />
            </div>

            <div class="mt-6 flex items-center gap-3">
              <button :disabled="isSubmitting" type="submit" 
                class="inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium shadow bg-[#9E4CFF] hover:bg-purple-700 text-white transition-colors disabled:opacity-50">
                <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                <svg v-else class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v4m0 8v4m8-8h-4M4 12H0"/></svg>
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>

              <button type="button" @click="clearForm" 
                class="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white transition-colors">
                Clear
              </button>
            </div>
            
            <p v-if="errorMessage" class="mt-4 text-red-500 text-sm font-medium">{{ errorMessage }}</p>
          </form>

          <!-- 2. SUCCESS CONTAINER (Visible if isSubmitted is true) -->
          <div v-else class="h-full min-h-[500px] flex flex-col items-center justify-center rounded-2xl p-12 shadow-xl border border-green-100 bg-green-50/30 dark:bg-emerald-500/5 dark:border-emerald-500/20 backdrop-blur-sm text-center animate-in fade-in zoom-in duration-500">
            <div class="w-20 h-20 bg-green-100 dark:bg-emerald-500/20 text-green-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Message Sent!</h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 max-w-md mb-8">
              Thank you, <span class="font-semibold text-purple-600 dark:text-purple-400">{{ form.name }}</span>. We've received your request and will get back to you within one business day.
            </p>
            <button @click="resetForm" class="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              ← Send another message
            </button>
          </div>
        </div>
      </div>

      <!-- FAQ SECTION -->
      <div class="mt-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 rounded-2xl border transition-colors bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-white/10">
            <h4 class="font-semibold text-gray-900 dark:text-white">Sales FAQ</h4>
            <p class="text-sm mt-2 text-gray-600 dark:text-gray-300">How long does setup take? — Usually 1–2 weeks depending on integrations.</p>
          </div>
          <div class="p-6 rounded-2xl border transition-colors bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-white/10">
            <h4 class="font-semibold text-gray-900 dark:text-white">Privacy</h4>
            <p class="text-sm mt-2 text-gray-600 dark:text-gray-300">We prioritize data privacy and can sign a custom DPA for enterprise customers.</p>
          </div>
          <div class="p-6 rounded-2xl border transition-colors bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-white/10">
            <h4 class="font-semibold text-gray-900 dark:text-white">Integrations</h4>
            <p class="text-sm mt-2 text-gray-600 dark:text-gray-300">Connect to Zendesk, Slack, and WhatsApp Business via our integrations layer.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'

const fileInput = ref(null)
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  company: '',
  phone: '',
  subject: '',
  message: '',
  preference: 'email',
  file: null,
  _honeypot: ''
})

function handleFile(e) {
  const f = e.target.files && e.target.files[0]
  form.file = f || null
}

function clearForm() {
  // Clear all fields but maintain preference default
  Object.keys(form).forEach(key => {
    form[key] = key === 'preference' ? 'email' : ''
  })
  form.file = null
  if (fileInput.value) fileInput.value.value = null
  errorMessage.value = ''
}

async function handleSubmit() {
  errorMessage.value = ''
  
  // Security Check (Honeypot)
  if (form._honeypot) {
    errorMessage.value = 'Submission failed.'
    return
  }

  isSubmitting.value = true

  try {
    // Package data
    const fd = new FormData()
    Object.keys(form).forEach(key => fd.append(key, form[key]))

    // SIMULATED API CALL
    await new Promise(resolve => setTimeout(resolve, 1500))

    // SHOW SUCCESS CONTAINER
    isSubmitted.value = true
  } catch (err) {
    errorMessage.value = 'Something went wrong. Please try again later.'
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  clearForm()
  isSubmitted.value = false
}
</script>

<style scoped>
/* Ensure file input text remains legible in different themes */
input[type="file"] { background-clip: padding-box; }

/* Simple fade animation for success message */
.animate-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
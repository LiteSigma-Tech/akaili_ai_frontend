<template>
  <Teleport to="body">
    <!-- Wrap in a transition to handle smooth entry/exit -->
    <Transition name="fade">
      <div v-if="isActive" class="fixed inset-0 z-[50] pointer-events-none">
        
        <!-- Backdrop with Hole (Behind z-60 modal) -->
        <div 
          class="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px] transition-all duration-500"
          :style="overlayStyle"
        ></div>

        <!-- Tooltip Card -->
        <div 
          ref="tooltip"
          class="absolute z-[51] w-[300px] p-6 rounded-[24px] bg-white dark:bg-slate-900 shadow-2xl border border-purple-100 dark:border-white/10 transition-all duration-300 ease-out pointer-events-auto"
          :style="tooltipPosition"
        >
          <div class="flex flex-col gap-4">
            <!-- Progress Bar -->
            <div class="flex gap-1">
              <div v-for="(_, i) in steps" :key="i"
                class="h-1 rounded-full transition-all duration-300"
                :style="{ 
                  width: i === currentStep ? '40px' : '8px', 
                  backgroundColor: i === currentStep ? '#9E4CFF' : '#e2e8f0' 
                }"
              ></div>
            </div>

            <div class="space-y-1">
              <h3 class="text-sm font-bold text-[#9E4CFF] uppercase tracking-widest">
                {{ steps[currentStep].title }}
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ steps[currentStep].content }}
              </p>
            </div>

            <div class="flex items-center justify-between pt-2">
              <button @click="skipTour" class="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                Dismiss Guide
              </button>
              <button @click="nextStep" 
                class="px-5 py-2.5 rounded-xl bg-[#9E4CFF] hover:bg-[#8A3DFF] text-white text-xs font-bold shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                {{ isLastStep ? 'Finish' : 'Next Step' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'

const props = defineProps(['isSidebarOpen'])
const emit = defineEmits(['update:isSidebarOpen'])

const isActive = ref(false)
const currentStep = ref(0)
const tooltipPosition = reactive({ top: '20px', left: '20px' })
const overlayStyle = ref('')

// Formal Step Definitions
const steps = [
  { target: '#step-dashboard', title: 'Analytics Overview', content: 'Monitor real-time performance metrics and system engagement via the primary dashboard.' },
  { target: '#step-chatbot', title: 'Agent Configuration', content: 'Define your AI’s persona, visual identity, and behavioral parameters.' },
  { target: '#step-kb', title: 'Knowledge Repository', content: 'Upload documentation and link URLs to synchronize your AI’s data source.' },
  { target: '#step-db', title: 'Database Integration', content: 'Connect structured data sources to enable complex query handling.' },
  { target: '#step-convos', title: 'Live Monitoring', content: 'Review and manage active dialogue streams between users and your AI agents.' },
  { target: '#step-analytics', title: 'Data Insights', content: 'Access deep-dive reports on user intent, conversion rates, and chat efficiency.' },
  { target: '#step-test', title: 'Sandbox Environment', content: 'Validate your configuration changes in a secure testing interface before deployment.' },
  { target: '#step-team', title: 'Access Control', content: 'Manage organizational roles and administrative permissions for team members.' },
  { target: '#step-email', title: 'Automated Outreach', content: 'Configure email sequences triggered by AI interactions and lead captures.' },
  { target: '#step-agent', title: 'Human Handoff', content: 'Seamlessly transition complex inquiries from AI to professional human agents.' },
  { target: '#step-settings', title: 'System Preferences', content: 'Adjust global account configurations, billing, and API authentication keys.' }
]

const isLastStep = computed(() => currentStep.value === steps.length - 1)

const updatePosition = async () => {
  await nextTick()
  const isMobile = window.innerWidth < 1024
  
  // Force sidebar open if needed
  if (isMobile && !props.isSidebarOpen) {
    emit('update:isSidebarOpen', true)
    await new Promise(r => setTimeout(r, 400))
  }

  const step = steps[currentStep.value]
  const el = document.querySelector(step.target)
  
  if (el) {
    const rect = el.getBoundingClientRect()
    const padding = 8
    const viewportHeight = window.innerHeight

    // SMART POSITIONING LOGIC
    // If element is in the bottom 30% of the screen, move tooltip ABOVE the element
    if (rect.top > viewportHeight * 0.7) {
      tooltipPosition.top = `${rect.top - 200}px` // Sit above
    } else {
      tooltipPosition.top = `${rect.top}px` // Sit beside
    }

    if (isMobile) {
      tooltipPosition.left = '16px'
      tooltipPosition.top = `${rect.bottom + 12}px`
    } else {
      tooltipPosition.left = `${rect.right + 20}px`
    }

    // Highlighting logic
    overlayStyle.value = `clip-path: polygon(
      0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 
      ${rect.left - padding}px ${rect.top - padding}px, 
      ${rect.right + padding}px ${rect.top - padding}px, 
      ${rect.right + padding}px ${rect.bottom + padding}px, 
      ${rect.left - padding}px ${rect.bottom + padding}px, 
      ${rect.left - padding}px ${rect.top - padding}px
    );`
  }
}

const nextStep = () => {
  if (isLastStep.value) {
    completeTour()
  } else {
    currentStep.value++
    updatePosition()
  }
}

const skipTour = () => completeTour()

const completeTour = () => {
  isActive.value = false
  emit('update:isSidebarOpen', false)
  localStorage.setItem('xeli_tour_completed', 'true')
}

onMounted(() => {
  const isDone = localStorage.getItem('xeli_tour_completed')
  if (!isDone) {
    setTimeout(() => {
      isActive.value = true
      updatePosition()
    }, 1200)
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

div[style*="clip-path"] {
  transition: clip-path 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
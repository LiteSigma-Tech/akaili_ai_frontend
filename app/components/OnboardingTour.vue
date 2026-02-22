<template>
  <Teleport to="body">
    <Transition name="tour-fade">
      <!-- We hide the guide if a modal is detected via the 'isSuppressed' logic -->
      <div v-if="isActive && !isSuppressed" class="fixed inset-0 z-[55] pointer-events-none">
        
        <!-- Backdrop with hole -->
        <div 
          class="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px] transition-all duration-700 pointer-events-auto"
          :style="overlayStyle"
        ></div>

        <!-- Tooltip Card -->
        <div 
          ref="tooltip"
          class="absolute z-[56] w-[320px] p-6 rounded-[20px] bg-white dark:bg-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-purple-100 dark:border-white/10 transition-all duration-500 ease-in-out pointer-events-auto"
          :style="tooltipPosition"
        >
          <div class="flex flex-col gap-5">
            <!-- Formal Progress Bar -->
            <div class="flex gap-1.5 h-1">
              <div v-for="(_, i) in steps" :key="i"
                class="flex-1 rounded-full transition-all duration-500"
                :style="{ backgroundColor: i <= currentStep ? '#9E4CFF' : '#e2e8f0' }"
              ></div>
            </div>

            <div class="space-y-2">
              <h3 class="text-xs font-bold text-[#9E4CFF] uppercase tracking-[0.2em]">
                {{ steps[currentStep].title }}
              </h3>
              <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {{ steps[currentStep].content }}
              </p>
            </div>

            <div class="flex items-center justify-between pt-2">
              <button @click="skipTour" class="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 uppercase tracking-widest transition-colors">
                Skip Briefing
              </button>
              <div class="flex gap-2">
                <button @click="nextStep" 
                  class="px-5 py-2.5 rounded-xl bg-[#9E4CFF] hover:bg-[#8A3DFF] text-white text-xs font-bold shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  {{ isLastStep ? 'Complete' : 'Continue' }}
                </button>
              </div>
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
const isSuppressed = ref(false) // Temporarily hide if a modal pops up
const currentStep = ref(0)
const tooltipPosition = reactive({ top: '20px', left: '20px' })
const overlayStyle = ref('')

const steps = [
  { target: '#step-dashboard', title: 'Operational Overview', content: 'Primary monitoring interface for system health and high-level engagement metrics.' },
  { target: '#step-chatbot', title: 'Agent Architecture', content: 'Configure the core identity, visual parameters, and behavioral logic of your AI nodes.' },
  { target: '#step-kb', title: 'Information Assets', content: 'Central repository for document ingestion and URL synchronization for AI training.' },
  { target: '#step-db', title: 'Relational Integration', content: 'Management layer for connecting structured external databases to the AI reasoning engine.' },
  { target: '#step-convos', title: 'Interaction Audit', content: 'Secure interface for monitoring and auditing live user-to-agent dialogue streams.' },
  { target: '#step-analytics', title: 'Intelligence Reports', content: 'Detailed statistical analysis regarding user intent and conversion performance.' },
  { target: '#step-test', title: 'Diagnostic Sandbox', content: 'Secure environment for validating configuration test and monitor knowledge base.' },
  { target: '#step-team', title: 'Identity Management', content: 'Administrative control for organizational roles, security permissions, and team access.' },
  { target: '#step-email', title: 'Outbound Automation', content: 'Management of automated communication sequences based on intelligence-driven triggers.' },
  { target: '#step-agent', title: 'Assisted Transition', content: 'Logic configuration for seamless handoff between AI agents and professional human staff.' },
  { target: '#step-settings', title: 'System Configuration', content: 'Global administrative preferences, security tokens, and billing infrastructure.' }
]

const isLastStep = computed(() => currentStep.value === steps.length - 1)

// CHECK FOR ACTIVE MODALS
// If there is any element with z-[60] or higher, we suppress the guide
const checkConflicts = () => {
  const modalBackdrop = document.querySelector('.bg-gray-900\\/40'); // Matches your modal backdrop class
  isSuppressed.value = !!modalBackdrop;
}

const updatePosition = async () => {
  await nextTick()
  checkConflicts()

  const isMobile = window.innerWidth < 1024
  if (isMobile && !props.isSidebarOpen) {
    emit('update:isSidebarOpen', true)
    await new Promise(r => setTimeout(r, 400))
  }

  const step = steps[currentStep.value]
  const el = document.querySelector(step.target)
  
  if (el) {
    const rect = el.getBoundingClientRect()
    const padding = 10
    const vh = window.innerHeight

    // SMART POSITIONING (Prevents settings overflow)
    // If the element is too low on the screen, show tooltip ABOVE it
    if (rect.top > vh - 260) {
      tooltipPosition.top = `${rect.top - 200}px` 
    } else {
      tooltipPosition.top = `${rect.top}px`
    }

    if (isMobile) {
      tooltipPosition.left = '10px'
      tooltipPosition.top = `${rect.bottom + 15}px`
    } else {
      tooltipPosition.left = `${rect.right + 25}px`
    }

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
  localStorage.setItem('xeli_tour_complete', 'true')
}

onMounted(() => {
  const isDone = localStorage.getItem('xeli_tour_complete')
  if (!isDone) {
    
    setTimeout(() => {
      isActive.value = true
      updatePosition()
      setInterval(checkConflicts, 500)
    }, 2000)
  }
})
</script>

<style scoped>
.tour-fade-enter-active, .tour-fade-leave-active { transition: opacity 0.6s ease; }
.tour-fade-enter-from, .tour-fade-leave-to { opacity: 0; }

div[style*="clip-path"] {
  transition: clip-path 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
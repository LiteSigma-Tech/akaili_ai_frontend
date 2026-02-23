<template>
  <Teleport to="body">
    <Transition name="tour-fade">
      <!-- Logic: isActive = true, isSuppressed = false (no modal conflict) -->
      <div v-if="isActive && !isSuppressed" class="fixed inset-0 z-[55] pointer-events-none">
        
        <!-- Backdrop with hole -->
        <div 
          class="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px] transition-all duration-700 pointer-events-auto"
          :style="overlayStyle"
        ></div>

        <!-- Tooltip Card -->
        <div 
          ref="tooltip"
          class="absolute z-[56] w-[280px] sm:w-[320px] p-6 rounded-[20px] bg-white dark:bg-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-purple-100 dark:border-white/10 transition-all duration-500 ease-in-out pointer-events-auto"
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
              <button @click="nextStep" 
                class="px-5 py-2.5 rounded-xl bg-[#9E4CFF] hover:bg-[#8A3DFF] text-white text-xs font-bold shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
              >
                {{ isLastStep ? 'Complete' : 'Continue' }}
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
const isSuppressed = ref(false) 
const currentStep = ref(0)
const tooltipPosition = reactive({ top: '20px', left: '20px' })
const overlayStyle = ref('')

// formal terminology matching your sidebar links
const steps = [
  { target: '#step-dashboard', mobileTarget: '#step-dashboard-mob', title: 'Operational Overview', content: 'Central hub for monitoring real-time system performance and key engagement metrics.' },
  { target: '#step-chatbot', mobileTarget: '#step-chatbot-mob', title: 'Agent Configuration', content: 'Define behavioral logic, visual identity, and core persona settings for your AI agents.' },
  { target: '#step-kb', mobileTarget: '#step-kb-mob', title: 'Intelligence Memory', content: 'Securely upload documentation and link URLs to synchronize your AI Knowledge Base.' },
  { target: '#step-db', mobileTarget: '#step-db-mob', title: 'Relational Integration', content: 'Management interface for connecting external structured databases to the AI engine.' },
  { target: '#step-convos', mobileTarget: '#step-convos-mob', title: 'Interaction Audit', content: 'Review live interaction streams to ensure quality control and conversational accuracy.' },
  { target: '#step-analytics', mobileTarget: '#step-analytics-mob', title: 'Data Insights', content: 'Access comprehensive reports regarding user intent trends and conversion statistics.' },
  { target: '#step-test', mobileTarget: '#step-test-mob', title: 'Diagnostic Sandbox', content: 'Validate configuration updates and test Knowledge Base accuracy before deployment.' },
  { target: '#step-team', mobileTarget: '#step-team-mob', title: 'Identity Management', content: 'Administrative control for organizational roles, team access, and security permissions.' },
  { target: '#step-email', mobileTarget: '#step-email-mob', title: 'Outbound Automation', content: 'Configure automated communication sequences triggered by AI-detected leads.' },
  { target: '#step-agent', mobileTarget: '#step-agent-mob', title: 'Assisted Transition', content: 'Logic parameters for seamless hand-off from AI agents to professional human staff.' },
  { target: '#step-settings', mobileTarget: '#step-settings-mob', title: 'System Preferences', content: 'Configure global account settings, API keys, and subscription infrastructure.' }
]

const isLastStep = computed(() => currentStep.value === steps.length - 1)

// Conflict check for z-60 modals
const checkConflicts = () => {
  const modalBackdrop = document.querySelector('.bg-gray-900\\/40'); 
  isSuppressed.value = !!modalBackdrop;
}

const updatePosition = async () => {
  await nextTick()
  checkConflicts()

  const isMobile = window.innerWidth < 1024
  
  // CRITICAL MOBILE FIX: Force sidebar open if it's closed during the tour
  if (isMobile && !props.isSidebarOpen) {
    emit('update:isSidebarOpen', true)
    // Wait for the sidebar transition to finish before calculating positions
    await new Promise(r => setTimeout(r, 450)) 
  }

  const step = steps[currentStep.value]
  const targetId = isMobile ? step.mobileTarget : step.target
  const el = document.querySelector(targetId)
  
  if (el) {
    const rect = el.getBoundingClientRect()
    const padding = 10
    const vh = window.innerHeight
    const vw = window.innerWidth

    // SMART POSITIONING (Prevents clipping at the bottom - e.g. Settings)
    if (rect.top > vh - 280) {
      tooltipPosition.top = `${rect.top - 210}px` // Shift above the element
    } else {
      tooltipPosition.top = `${rect.top}px`
    }

    if (isMobile) {
      // On mobile, the sidebar is a drawer. We place the tooltip next to the drawer links.
      tooltipPosition.left = `${rect.right + 15}px`
      // Check if tooltip goes off-screen horizontally on small phones
      if (parseInt(tooltipPosition.left) + 280 > vw) {
         tooltipPosition.left = '20px'
         tooltipPosition.top = `${rect.bottom + 15}px`
      }
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
  
  // Recalculate position on window resize
  window.addEventListener('resize', updatePosition)
})
</script>

<style scoped>
.tour-fade-enter-active, .tour-fade-leave-active { transition: opacity 0.6s ease; }
.tour-fade-enter-from, .tour-fade-leave-to { opacity: 0; }

div[style*="clip-path"] {
  transition: clip-path 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hide scrollbar on tooltip if content gets long */
.custom-scrollbar::-webkit-scrollbar { width: 0px; }
</style>
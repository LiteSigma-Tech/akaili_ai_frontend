<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'; 
import { X, CheckCircle2, ArrowRight, Play } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean
});
const emit = defineEmits(['close']);

const videoRef = ref(null);
const isVideoEnded = ref(false);
const currentTime = ref(0);

const steps = [
  { id: 1, title: 'Upload Document', time: 0, description: 'Feed your AI PDFs or Docs.' },
  { id: 2, title: 'Train AI', time: 26, description: 'The AI learns your specific data.' },
  { id: 3, title: 'Test Chat', time: 44, description: 'Instant, accurate answers.' }
];

const seekTo = (seconds) => {
  if (videoRef.value) {
    videoRef.value.currentTime = seconds;
    videoRef.value.play();
    isVideoEnded.value = false;
  }
};

const handleTimeUpdate = () => {
  if (videoRef.value) currentTime.value = videoRef.value.currentTime;
};

const handleVideoEnd = () => {
  isVideoEnded.value = true;
};

// Prevent background scroll when modal is open
watch(() => props.isOpen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    await nextTick();
    if (videoRef.value) {
      videoRef.value.currentTime = 0;
      videoRef.value.play().catch(() => {});
    }
  } else {
    if (videoRef.value) videoRef.value.pause();
    isVideoEnded.value = false;
  }
});

onMounted(() => {
  const handleEsc = (e) => { if (e.key === 'Escape' && props.isOpen) emit('close'); };
  window.addEventListener('keydown', handleEsc);
  onUnmounted(() => window.removeEventListener('keydown', handleEsc));
});
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-6">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" @click="emit('close')"></div>

        <!-- Modal Container -->
        <div 
          class="relative w-full max-w-6xl max-h-full sm:max-h-[90vh] bg-white dark:bg-slate-900 sm:rounded-[2rem] shadow-2xl overflow-hidden border border-white/10 flex flex-col lg:flex-row transition-all"
          @click.stop
        >
          
          <!-- Close Button (Mobile Optimized) -->
          <button 
            @click="emit('close')"
            class="absolute top-4 right-4 z-[110] p-2.5 rounded-full bg-black/20 backdrop-blur-md text-white sm:bg-slate-100 sm:dark:bg-slate-800 sm:text-slate-500 hover:scale-110 transition-all"
            aria-label="Close modal"
          >
            <X class="w-5 h-5" />
          </button>

          <!-- LEFT: Video Player Section -->
          <div class="w-full lg:w-[65%] xl:w-[70%] bg-black relative flex items-center justify-center aspect-video lg:aspect-auto overflow-hidden">
            <video
              ref="videoRef"
              class="w-full h-full object-contain"
              playsinline
              controls
              autoplay
              @timeupdate="handleTimeUpdate"
              @ended="handleVideoEnd"
            >
              <source src="/videos/demo.mp4" type="video/mp4" />
            </video>

            <!-- Video End Overlay (Modern Style) -->
            <Transition name="slide-up">
              <div v-if="isVideoEnded" class="absolute inset-0 z-20 flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md">
                <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center transform scale-105 transition-all">
                  <div class="w-16 h-16 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 class="text-[#9E4CFF] w-10 h-10" />
                  </div>
                  <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Ready to try?</h3>
                  <p class="text-slate-500 dark:text-slate-400 mb-6 text-sm">Join 500+ companies automating their workflows today.</p>
                  
                  <NuxtLink 
                    to="/get-started" 
                    class="flex items-center justify-center gap-2 w-full py-4 bg-[#9E4CFF] text-white rounded-2xl font-bold hover:bg-[#8A3EE5] hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                  >
                    Start Free Trial <ArrowRight class="w-5 h-5" />
                  </NuxtLink>
                  
                  <button @click="seekTo(0)" class="mt-4 text-sm font-semibold text-slate-400 hover:text-[#9E4CFF] transition-colors">
                    Watch Again
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- RIGHT: Walkthrough Section -->
          <div class="w-full lg:w-[35%] xl:w-[30%] flex flex-col bg-slate-50 dark:bg-slate-900/50 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800">
            <div class="p-6 sm:p-8 overflow-y-auto">
              <div class="flex items-center gap-2 mb-6">
                <span class="px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/40 text-[10px] font-bold text-[#9E4CFF] uppercase tracking-wider">Demo</span>
                <h4 class="text-sm font-bold text-slate-400 uppercase tracking-widest">Platform Tour</h4>
              </div>
              
              <div class="space-y-4">
                <button 
                  v-for="step in steps" 
                  :key="step.id"
                  @click="seekTo(step.time)"
                  class="w-full text-left group p-4 rounded-2xl transition-all border flex items-start gap-4"
                  :class="[
                    currentTime >= step.time && (steps[steps.indexOf(step)+1] ? currentTime < steps[steps.indexOf(step)+1].time : true)
                    ? 'bg-white dark:bg-slate-800 border-purple-500/50 shadow-md ring-1 ring-purple-500/20'
                    : 'bg-transparent border-transparent opacity-50 hover:opacity-100'
                  ]"
                >
                  <div 
                    class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
                    :class="currentTime >= step.time ? 'bg-[#9E4CFF] text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'"
                  >
                    <Play v-if="currentTime >= step.time && (steps[steps.indexOf(step)+1] ? currentTime < steps[steps.indexOf(step)+1].time : true)" class="w-3 h-3 fill-current" />
                    <span v-else>{{ step.id }}</span>
                  </div>
                  <div>
                    <h5 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white transition-colors group-hover:text-[#9E4CFF]">
                      {{ step.title }}
                    </h5>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{{ step.description }}</p>
                  </div>
                </button>
              </div>
            </div>

            <!-- Footer for Mobile/Tablet context -->
            <div class="mt-auto p-6 border-t border-slate-200 dark:border-slate-800 hidden lg:block">
              <div class="flex items-center gap-3 text-xs text-slate-400">
                <div class="flex -space-x-2">
                  <div class="w-6 h-6 rounded-full bg-slate-200 border border-white dark:border-slate-900"></div>
                  <div class="w-6 h-6 rounded-full bg-slate-300 border border-white dark:border-slate-900"></div>
                </div>
                <span>Guided by AI Assistant</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Smooth Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from { opacity: 0; transform: translateY(20px) scale(0.95); }

/* Custom Scrollbar for the Steps area */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark ::-webkit-scrollbar-thumb { background: #334155; }
</style>
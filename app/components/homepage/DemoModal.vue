<script setup>
// 1. Add nextTick to your imports
import { ref, watch, onMounted, nextTick } from 'vue'; 
import { X, CheckCircle2, ArrowRight } from 'lucide-vue-next';

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

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && props.isOpen) emit('close');
  });
});

// 2. Update the watch logic
watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    // When modal opens, wait for DOM to render the video element
    await nextTick();
    if (videoRef.value) {
      videoRef.value.currentTime = 0; // Reset to start
      videoRef.value.play().catch(error => {
        console.error("Autoplay was prevented by browser. User interaction required.", error);
      });
    }
  } else {
    // When modal closes
    if (videoRef.value) {
      videoRef.value.pause();
    }
    isVideoEnded.value = false;
  }
});
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop Transition -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <!-- Gray Backdrop -->
        <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md" @click="emit('close')"></div>

        <!-- Modal Content Transition -->
        <Transition
          appear
          enter-active-class="transition duration-300 ease-out transform"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in transform"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div v-if="isOpen" class="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10" @click.stop>
            
            <!-- Close Button -->
            <button 
              @click="emit('close')"
              type="button"
              class="absolute top-4 right-4 z-[110] p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#9E4CFF] transition-colors"
            >
              <X class="w-6 h-6" />
            </button>

            <div class="grid grid-cols-1 lg:grid-cols-12">
              <!-- LEFT: Video Player -->
              <div class="lg:col-span-8 bg-black aspect-video relative flex items-center justify-center">
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

                <!-- Video End Overlay -->
                <Transition
                  enter-active-class="transition duration-500 ease-out"
                  enter-from-class="opacity-0 translate-y-8"
                  enter-to-class="opacity-100 translate-y-0"
                >
                  <div v-if="isVideoEnded" class="absolute inset-0 bg-[#9E4CFF] flex flex-col items-center justify-center text-center p-8 z-20">
                    <div class="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full">
                      <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 class="text-[#9E4CFF] w-10 h-10" />
                      </div>
                      <h3 class="text-2xl font-bold text-slate-900 mb-2">Ready to try?</h3>
                      <p class="text-slate-600 mb-6">Build your first smart assistant in less than 2 minutes.</p>
                      
                      <NuxtLink 
                        to="/get-started" 
                        class="nav_primary_btn flex items-center justify-center gap-2 w-full py-4 text-white rounded-xl font-bold hover:bg-purple-700 transition-all"
                      >
                        Get Started Free <ArrowRight class="w-5 h-5" />
                      </NuxtLink>
                      
                      <button @click="seekTo(0)" class="mt-4 text-sm text-slate-400 hover:text-slate-600 font-medium">
                        Replay Demo
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- RIGHT: Walkthrough -->
              <div class="lg:col-span-4 p-6 sm:p-8 bg-slate-50 dark:bg-slate-900/50 border-l border-gray-100 dark:border-slate-800 overflow-y-auto max-h-[400px] lg:max-h-none">
                <h4 class="text-sm font-bold uppercase tracking-widest text-purple-500 mb-6">Product Walkthrough</h4>
                
                <div class="space-y-6">
                  <button 
                    v-for="step in steps" 
                    :key="step.id"
                    @click="seekTo(step.time)"
                    type="button"
                    :class="[
                      'w-full text-left group p-4 rounded-2xl transition-all border-2 flex items-start gap-4',
                      currentTime >= step.time && (steps[steps.indexOf(step)+1] ? currentTime < steps[steps.indexOf(step)+1].time : true)
                      ? 'bg-white dark:bg-slate-800 border-purple-500 shadow-lg scale-[1.02]'
                      : 'bg-transparent border-transparent grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
                    ]"
                  >
                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-[#9E4CFF] font-bold text-sm">
                      {{ step.id }}
                    </div>
                    <div>
                      <h5 class="font-bold text-slate-900 dark:text-white group-hover:text-[#9E4CFF] transition-colors">
                        {{ step.title }}
                      </h5>
                      <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">{{ step.description }}</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
<!-- components/homepage/WordRotator.vue -->
<template>
  <div class="relative inline-flex flex-col h-[1.2em] overflow-hidden align-middle">
    <Transition
      mode="out-in"
      enter-active-class="transition duration-500 ease-[cubic-bezier(0.32,0,0.67,0)]"
      enter-from-class="opacity-0 translate-y-[80%] blur-sm"
      enter-to-class="opacity-100 translate-y-0 blur-0"
      leave-active-class="transition duration-400 ease-[cubic-bezier(0.33,1,0.68,1)]"
      leave-from-class="opacity-100 translate-y-0 blur-0"
      leave-to-class="opacity-0 -translate-y-[80%] blur-sm"
    >
      <span 
        :key="currentIndex"
        :class="mainClassName"
        class="whitespace-nowrap"
      >
        {{ texts[currentIndex] }}
      </span>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  texts: { type: Array, required: true },
  interval: { type: Number, default: 3000 },
  mainClassName: { type: String, default: '' }
});

const currentIndex = ref(0);
let timer = null;

onMounted(() => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.texts.length;
  }, props.interval);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
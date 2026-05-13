<template>
  <footer class="relative overflow-hidden bg-[#0A0F1A] text-white">
    <!-- Ambient background glow -->
    <div class="pointer-events-none absolute inset-0 z-0">
      <div class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div class="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-violet-600/8 blur-[100px]" />
      <div class="absolute bottom-0 left-1/2 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
    </div>

    <!-- Top border accent -->
    <div class="relative z-10 h-px w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

    <!-- Main content -->
    <div class="relative z-10 mx-auto max-w-6xl px-6 pt-14 pb-10">

      <!-- Upper grid -->
      <div class="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

        <!-- Brand column -->
        <div class="footer-col lg:col-span-1">
          <NuxtLink to="/" aria-label="Xeli AI Home" class="group inline-flex items-center gap-3 no-underline">
            <NuxtImg
              width="100"
              height="80"
              src="/logo-footer.png"
              format="webp"
              alt="Xeli AI Logo"
              loading="eager"
              class="transition-opacity duration-300 group-hover:opacity-90"
            />
          </NuxtLink>

          <p class="mt-5 max-w-[240px] text-sm font-medium leading-relaxed text-white/50">
            Intelligent chatbots that connect to your data and provide exceptional customer experiences.
          </p>

          <!-- Social icons -->
          <div class="mt-7 flex items-center gap-3">
            <NuxtLink
              to="https://www.facebook.com/people/Xeli-AI/61586431143047/"
              target="_blank"
              aria-label="Facebook"
              class="social-icon group"
            >
              <span class="social-icon-bg" />
              <Facebook class="social-icon-svg text-[#1877F2]" />
            </NuxtLink>

            <NuxtLink
              to="https://www.instagram.com/xeli_ai/"
              target="_blank"
              aria-label="Instagram"
              class="social-icon group"
            >
              <span class="social-icon-bg" />
              <Instagram class="social-icon-svg text-[#C13584]" />
            </NuxtLink>

            <NuxtLink
              to="https://www.linkedin.com/company/xeli-ai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              class="social-icon group"
            >
              <span class="social-icon-bg" />
              <Linkedin class="social-icon-svg text-[#0077B5]" />
            </NuxtLink>
          </div>
        </div>

        <!-- Product column -->
        <div class="footer-col">
          <h3 class="footer-heading">Product</h3>
          <nav class="mt-5 flex flex-col gap-3">
            <NuxtLink to="/features" class="footer-link">Features</NuxtLink>
            <NuxtLink to="/pricing" class="footer-link">Pricing</NuxtLink>
          </nav>
        </div>

        <!-- Company column -->
        <div class="footer-col">
          <h3 class="footer-heading">Company</h3>
          <nav class="mt-5 flex flex-col gap-3">
            <NuxtLink to="/about" class="footer-link">About</NuxtLink>
            <NuxtLink
              href="https://blog.xeliai.com"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-link"
            >
              Blog
              <ExternalLink class="ml-1 inline h-3 w-3 opacity-40" />
            </NuxtLink>
          </nav>
        </div>

        <!-- Support column -->
        <div class="footer-col">
          <h3 class="footer-heading">Support</h3>
          <nav class="mt-5 flex flex-col gap-3">
            <NuxtLink to="/contact" class="footer-link">Help Center</NuxtLink>
            <NuxtLink to="/contact" class="footer-link">Contact</NuxtLink>
            <NuxtLink to="/contact" class="footer-link">Privacy</NuxtLink>
            <NuxtLink to="/terms" class="footer-link">Terms of Service</NuxtLink>
          </nav>
        </div>
      </div>

      <!-- Divider -->
      <div class="h-px w-full bg-white/[0.07]" />

      <!-- Bottom bar -->
      <div class="mt-7 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
          © {{ new Date().getFullYear() }} Xeli AI · All rights reserved
        </p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/terms" class="bottom-link">Terms of Service</NuxtLink>
          <NuxtLink to="/contact" class="bottom-link">Privacy</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Facebook, Instagram, Linkedin, ExternalLink } from "lucide-vue-next";
</script>

<style scoped>
/* Social icon wrapper */
.social-icon {
  @apply relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-transform duration-200 hover:scale-110;
}

.social-icon-bg {
  @apply absolute inset-0 rounded-full bg-white/8 transition-colors duration-200;
}

.social-icon:hover .social-icon-bg {
  @apply bg-white/14;
}

.social-icon-svg {
  @apply relative z-10 h-4 w-4;
}

/* Heading */
.footer-heading {
  @apply text-[10px] font-black uppercase tracking-[0.22em] text-white/40;
}

/* Nav links */
.footer-link {
  @apply inline-flex items-center text-sm font-semibold text-white/55 transition-colors duration-200 hover:text-white;
}

/* Bottom bar links */
.bottom-link {
  @apply text-xs font-bold uppercase tracking-widest text-white/30 transition-colors duration-200 hover:text-white/70;
}

/* Staggered column entrance (CSS only) */
.footer-col {
  animation: colFadeUp 0.55s ease both;
}

.footer-col:nth-child(1) { animation-delay: 0ms; }
.footer-col:nth-child(2) { animation-delay: 70ms; }
.footer-col:nth-child(3) { animation-delay: 140ms; }
.footer-col:nth-child(4) { animation-delay: 210ms; }

@keyframes colFadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
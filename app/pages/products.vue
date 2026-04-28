<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-purple-500/30 font-sans productspage">
    
    <!-- SECTION 1: THE MAIN STAGE (Hero) -->
    <section class="relative pt-20 pb-20 lg:pt-38 lg:pb-32 overflow-hidden">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-purple-600/5 blur-[120px] pointer-events-none"></div>
      
      <div class="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div class="reveal-down inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#9E4CFF] text-[10px] font-black uppercase tracking-[0.2em] mb-10">
          The Future of Business Intelligence
        </div>
        
        <h1 class="reveal-up text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-10">
          Your Data. <br /> 
          <span class="text-transparent bg-clip-text bg-gradient-to-b from-[#9E4CFF] to-purple-900 dark:to-purple-400 italic">Now Conversational.</span>
        </h1>
        
        <p class="reveal-up delay-100 max-w-3xl mx-auto text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12">
          Xeli AI turns your business documents, databases, and website content into a single, smart assistant that talks to your customers like a pro.
        </p>
        
        <div class="reveal-up delay-200 flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <NuxtLink to="/get-started" class="w-full sm:w-auto px-10 py-5 bg-[#9E4CFF] text-white rounded-2xl font-black text-xl shadow-2xl shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all">
            GET STARTED
          </NuxtLink>
          <NuxtLink to="/contact" class="w-full sm:w-auto px-10 py-5 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
            TALK TO SALES
          </NuxtLink>
        </div>

        <!-- HERO IMAGE: Main Dashboard Preview -->
        <div class="reveal-up delay-300 relative max-w-6xl mx-auto rounded-[32px] border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-2 shadow-2xl shadow-purple-500/10 transition-transform duration-700 hover:scale-[1.01]">
           <div class="bg-slate-100 dark:bg-slate-950 rounded-[24px] aspect-[16/9] overflow-hidden flex items-center justify-center">
              <img 
                src="/dashboard-main.webp" 
                alt="Xeli AI Dashboard Overview" 
                class="w-full h-full object-cover"
              />
           </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: STICKY SUB-NAV -->
    <div class="sticky top-[64px] z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-y border-slate-100 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
        <div class="flex items-center gap-8 overflow-x-auto no-scrollbar w-full justify-center">
          <a href="#agent-architecture" class="hover:text-[#9E4CFF] transition-colors whitespace-nowrap">Personality Setup</a>
          <a href="#intelligence-sync" class="hover:text-[#9E4CFF] transition-colors whitespace-nowrap">Smart Learning</a>
          <a href="#audit-streams" class="hover:text-[#9E4CFF] transition-colors whitespace-nowrap">Live Monitoring</a>
          <a href="#automation-services" class="hover:text-[#9E4CFF] transition-colors whitespace-nowrap">Setup Services</a>
        </div>
      </div>
    </div>

    <!-- SECTION 3: PRODUCT DEEP DIVES -->
    <div class="py-32 space-y-48">
      
      <!-- FEATURE A: AGENT ARCHITECTURE -->
      <section id="agent-architecture" class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
        <div class="space-y-8 reveal-left">
          <div class="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-[#9E4CFF]">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h2 class="text-5xl md:text-6xl font-black tracking-tight leading-none italic uppercase">Design Your <br/> AI Personality</h2>
          <p class="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Give your AI a name and a voice that matches your brand. Whether you want a professional assistant or a friendly helper, you control exactly how your AI sounds and looks on your site.
          </p>
          <div class="grid grid-cols-2 gap-6 pt-4">
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <h4 class="font-black uppercase text-[10px] tracking-widest text-[#9E4CFF] mb-2">Custom Colors</h4>
              <p class="text-sm text-slate-400">Match your brand's look perfectly.</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <h4 class="font-black uppercase text-[10px] tracking-widest text-[#9E4CFF] mb-2">Chat Tone</h4>
              <p class="text-sm text-slate-400">Choose from Formal to Playful.</p>
            </div>
          </div>
        </div>
        <!-- FEATURE IMAGE: Appearance Settings -->
        <div class="reveal-right aspect-square bg-slate-50 dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all hover:border-purple-500/50">
          <img src="/appearance-studio.webp" alt="AI Personality Designer" class="w-full h-full object-cover" />
        </div>
      </section>

      <!-- FEATURE B: KNOWLEDGE BASE & DB -->
      <section id="intelligence-sync" class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
        <!-- FEATURE IMAGE: Knowledge Base / Training Visual -->
        <div class="reveal-left order-2 lg:order-1 aspect-square bg-slate-50 dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all hover:border-blue-500/50">
          <img src="/intelligence-hub.webp" alt="AI Learning Center" class="w-full h-full object-cover" />
        </div>
        <div class="order-1 lg:order-2 space-y-8 reveal-right">
          <div class="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
          </div>
          <h2 class="text-5xl md:text-6xl font-black tracking-tight leading-none italic uppercase">The AI <br/> Learning Hub</h2>
          <p class="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Link your website, upload your PDFs, or connect your actual databases. Your AI creates its own memory from your data, making sure it gives the most accurate and up-to-date answers possible.
          </p>
          <ul class="space-y-4">
             <li class="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#9E4CFF]">
               <span class="w-8 h-[2px] bg-[#9E4CFF]"></span> Auto-Update from Website
             </li>
             <li class="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#9E4CFF]">
               <span class="w-8 h-[2px] bg-[#9E4CFF]"></span> PDF & Document Upload
             </li>
             <li class="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#9E4CFF]">
               <span class="w-8 h-[2px] bg-[#9E4CFF]"></span> Live Database Connection
             </li>
          </ul>
        </div>
      </section>

      <!-- FEATURE C: DIALOGUE AUDIT -->
      <section id="audit-streams" class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
        <div class="space-y-8 reveal-left">
          <div class="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.906-1.468L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
          <h2 class="text-5xl md:text-6xl font-black tracking-tight leading-none italic uppercase">Real-Time <br/> Quality Control</h2>
          <p class="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Watch your AI talk to customers in real-time. Review conversation quality, track customer satisfaction, and jump in whenever a human touch is needed.
          </p>
        </div>
        <!-- FEATURE IMAGE: Live Monitoring / Conversation List -->
        <div class="reveal-right aspect-video bg-slate-50 dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          <img src="/live-monitoring.webp" alt="Live Chat Audit Interface" class="w-full h-full object-cover" />
        </div>
      </section>
    </div>

    <!-- SECTION 4: PROFESSIONAL SERVICES -->
    <section id="automation-services" class="py-32 bg-slate-50 dark:bg-slate-900/50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20 reveal-up">
          <div class="max-w-2xl space-y-4">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-[#9E4CFF]">Concierge Services</h3>
            <h2 class="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">We help you <br/> grow faster.</h2>
          </div>
          <p class="max-w-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            We don't just provide the software; we ensure your entire setup is optimized for sales and support from day one.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Card 1: Email Marketing -->
          <div class="reveal-left p-10 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#9E4CFF] transition-all group">
            <div class="flex flex-col lg:flex-row gap-8 items-start">
               <div class="flex-1">
                  <div class="w-12 h-12 rounded-xl bg-purple-500 text-white flex items-center justify-center mb-8 shadow-xl shadow-purple-500/20">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l9 6 9-6M3 8v8a2 2 0 002 2h14a2 2 0 002-2V8M3 8l9 6 9-6" /></svg>
                  </div>
                  <h3 class="text-2xl font-black uppercase italic mb-4">Smart Lead Outreach</h3>
                  <p class="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                    Every chat is a potential customer. We set up automated email systems that follow up with leads immediately after they finish talking to your AI.
                  </p>
               </div>
               <!-- OPTIONAL SMALL ICON OR MINI IMAGE HERE -->
            </div>
            <div class="h-1 w-12 bg-slate-200 dark:bg-slate-800 group-hover:w-full transition-all duration-700"></div>
          </div>

          <!-- Card 2: Done-For-You Setup -->
          <div class="reveal-right p-10 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#9E4CFF] transition-all group">
            <div class="w-12 h-12 rounded-xl bg-slate-950 text-white flex items-center justify-center mb-8">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.618.271a2 2 0 01-1.083.184l-2.44-.305a2 2 0 01-1.026-.547l-2.387-2.387a2 2 0 010-2.828l2.387-2.387a2 2 0 011.026-.547l2.44-.305a2 2 0 011.083.184l.618.271a6 6 0 003.86.517l2.387-.477a2 2 0 011.022-.547l2.387-2.387a2 2 0 012.828 0l2.387 2.387a2 2 0 010 2.828l-2.387 2.387z" /></svg>
            </div>
            <h3 class="text-2xl font-black uppercase italic mb-4">Done-For-You Setup</h3>
            <p class="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              Don't have time to build? Our experts handle the full integration. We connect your databases, clean your documents, and launch your agent for you.
            </p>
            <div class="h-1 w-12 bg-slate-200 dark:bg-slate-800 group-hover:w-full transition-all duration-700"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 5: CTA BANNER -->
    <CtaBanner />
  
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import CtaBanner from '~/components/homepage/CtaBanner.vue'

onMounted(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active')
      }
    })
  }, observerOptions)

  const elements = document.querySelectorAll('.reveal-up, .reveal-down, .reveal-left, .reveal-right')
  elements.forEach(el => observer.observe(el))
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* ANIMATION BASE STATES */
.reveal-up { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
.reveal-down { opacity: 0; transform: translateY(-30px); transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
.reveal-left { opacity: 0; transform: translateX(-30px); transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
.reveal-right { opacity: 0; transform: translateX(30px); transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }

/* ACTIVE STATE */
.active { opacity: 1; transform: translate(0, 0); }

/* STAGGER DELAYS */
.delay-100 { transition-delay: 0.1s; }
.delay-200 { transition-delay: 0.2s; }
.delay-300 { transition-delay: 0.3s; }

.productspage {
  scroll-behavior: smooth;
}
</style>
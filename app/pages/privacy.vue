<template>
    <section class="min-h-screen pt-30 md:pt-24 lg:pt-28 bg-white dark:bg-[#0b1020] transition-colors duration-300">
        <div class="max-w-4xl pt-10 pb-24 mx-auto px-6 lg:px-8">

            <!-- Header -->
            <div class="text-center mb-14">
                <h1
                    class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#9E4CFF] to-blue-600 dark:from-[#9E4CFF] dark:to-white">
                    Privacy Policy
                </h1>
                <p class="mt-4 text-base text-gray-500 dark:text-gray-400">
                    Effective Date: {{ effectiveDate }}
                </p>
                <p class="mt-3 text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                    Your privacy matters to us. This policy explains exactly what data Xeli AI collects, why we collect
                    it, and how we protect it.
                </p>
            </div>

            <!-- Body -->
            <div class="prose-content space-y-10">

                <!-- 1. Who We Are -->
                <div class="policy-card">
                    <h2 class="section-title">1. Who We Are</h2>
                    <p class="body-text">
                        Xeli AI is an AI-powered customer engagement platform that enables businesses to deploy
                        intelligent chatbots, manage knowledge bases, run email marketing campaigns, and analyse
                        customer interactions. We are operated by Xeli AI ("we", "us", or "our"). For any
                        privacy-related enquiries, contact us at
                        <a href="mailto:hello@xeliai.com" class="text-[#9E4CFF] hover:underline">hello@xeliai.com</a>.
                    </p>
                </div>

                <!-- 2. Information We Collect -->
                <div class="policy-card">
                    <h2 class="section-title">2. Information We Collect</h2>
                    <p class="body-text mb-4">We collect information in the following categories depending on how you
                        use the platform:</p>

                    <div class="space-y-5">

                        <div class="info-block">
                            <h3 class="info-title">Account &amp; Identity Data</h3>
                            <p class="body-text">When you register, we collect your name, email address, password
                                (stored as a secure hash), and profile avatar. If you sign up via Google or Facebook
                                OAuth, we receive a provider ID and avatar from those services. We also log your last
                                login timestamp and IP address for security purposes.</p>
                        </div>

                        <div class="info-block">
                            <h3 class="info-title">Business &amp; Team Data</h3>
                            <p class="body-text">When you create or join a business workspace on Xeli AI, we store your
                                business name, industry, and any configuration data for your chatbots, including
                                appearance settings, behaviour rules, and system prompts. Team member names, emails, and
                                roles are also stored to manage access permissions.</p>
                        </div>

                        <div class="info-block">
                            <h3 class="info-title">Knowledge Base Content</h3>
                            <p class="body-text">Files you upload to train your chatbot — including PDFs, Word
                                documents, Excel spreadsheets, JSON files, and plain text — are processed, chunked, and
                                stored as vector embeddings to power AI responses. You are responsible for ensuring the
                                content you upload does not contain third-party personal data without authorisation.</p>
                        </div>

                        <div class="info-block">
                            <h3 class="info-title">Chatbot Visitor Data</h3>
                            <p class="body-text">When end-users interact with a chatbot you deploy, we may collect their
                                name, email, and phone number if they provide them during a conversation. We also store
                                cross-session visitor profiles keyed to a SHA-256 hash of their email or device
                                fingerprint. These profiles record visit count, first and last seen timestamps, session
                                IDs, and inferred preferences (such as intent, budget, and location) to personalise
                                repeat interactions. Raw identifiers are never stored in plain text.</p>
                        </div>

                        <div class="info-block">
                            <h3 class="info-title">Conversation History</h3>
                            <p class="body-text">Chat messages between your visitors and your AI chatbot are stored to
                                support live monitoring, handover to human agents, and analytics reporting. Short-term
                                conversation memory is maintained within a session to support contextual responses.</p>
                        </div>

                        <div class="info-block">
                            <h3 class="info-title">Email Marketing Data</h3>
                            <p class="body-text">If you use our email marketing features, we store the contact lists you
                                create or import, including names, email addresses, phone numbers, tags, and custom
                                fields. We also record email engagement events such as delivery status, opens, and
                                clicks.</p>
                        </div>

                        <div class="info-block">
                            <h3 class="info-title">Payment &amp; Billing Data</h3>
                            <p class="body-text">We record your active subscription plan, billing history, and payment
                                transaction references. Full card details are never stored by Xeli AI — they are handled
                                exclusively by our payment processor.</p>
                        </div>

                        <div class="info-block">
                            <h3 class="info-title">Usage &amp; Analytics Data</h3>
                            <p class="body-text">We collect platform usage data such as feature interactions, chatbot
                                performance metrics, conversation volume, and system events. This helps us operate the
                                platform reliably and provide you with actionable business insights.</p>
                        </div>

                    </div>
                </div>

                <!-- 3. How We Use Your Information -->
                <div class="policy-card">
                    <h2 class="section-title">3. How We Use Your Information</h2>
                    <ul class="list-disc pl-5 space-y-2 body-text">
                        <li><span class="font-semibold text-gray-900 dark:text-white">Service delivery:</span> To
                            operate your account, run your chatbots, process knowledge base files, and deliver email
                            campaigns.</li>
                        <li><span class="font-semibold text-gray-900 dark:text-white">AI processing:</span> To generate
                            chatbot responses by passing relevant context — including visitor profiles and your
                            knowledge base — to AI language model providers.</li>
                        <li><span class="font-semibold text-gray-900 dark:text-white">Analytics &amp; insights:</span>
                            To produce business reports, conversation summaries, and usage statistics visible in your
                            dashboard.</li>
                        <li><span class="font-semibold text-gray-900 dark:text-white">Security:</span> To detect abuse,
                            authenticate sessions, and protect the platform from unauthorised access.</li>
                        <li><span class="font-semibold text-gray-900 dark:text-white">Communication:</span> To send
                            transactional emails such as account verification, password resets, and billing receipts.
                        </li>
                        <li><span class="font-semibold text-gray-900 dark:text-white">Platform improvement:</span> To
                            understand how the platform is used and improve its features and reliability.</li>
                    </ul>
                </div>

                <!-- 4. AI Providers & Third Parties -->
                <div class="policy-card">
                    <h2 class="section-title">4. AI Providers &amp; Third-Party Services</h2>
                    <p class="body-text mb-4">To power our AI features, conversation data and knowledge base content are
                        processed by the following third-party AI providers:</p>
                    <ul class="list-disc pl-5 space-y-2 body-text">
                        <li><span class="font-semibold text-gray-900 dark:text-white">Google Gemini</span> — our primary
                            AI language model. Governed by Google's data processing terms.</li>
                        <li><span class="font-semibold text-gray-900 dark:text-white">Groq (Llama 3)</span> — used as a
                            fallback AI model. Governed by Groq's data processing terms.</li>
                    </ul>
                    <p class="body-text mt-4">We also work with third parties for:</p>
                    <ul class="list-disc pl-5 space-y-2 body-text mt-2">
                        <li><span class="font-semibold text-gray-900 dark:text-white">Payment processing</span> — your
                            payment details are handled directly by our payment processor; we only store transaction
                            references.</li>
                        <li><span class="font-semibold text-gray-900 dark:text-white">Social authentication</span> — if
                            you sign in via Google or Facebook, those providers handle authentication and share limited
                            profile data with us under their OAuth terms.</li>
                        <li><span class="font-semibold text-gray-900 dark:text-white">Email delivery</span> —
                            transactional and campaign emails are routed through email service providers.</li>
                    </ul>
                    <p class="body-text mt-4">We do not sell your data to any third party.</p>
                </div>

                <!-- 5. Data Retention -->
                <div class="policy-card">
                    <h2 class="section-title">5. Data Retention</h2>
                    <p class="body-text">We retain your account and business data for as long as your account is active.
                        Visitor chat profiles and conversation history are retained to support analytics and
                        cross-session memory. If you delete your account or request data deletion, we will remove your
                        personal data within 30 days, except where we are required to retain it for legal or financial
                        compliance reasons.</p>
                </div>

                <!-- 6. Your Rights -->
                <div class="policy-card">
                    <h2 class="section-title">6. Your Rights</h2>
                    <p class="body-text mb-4">Depending on your location, you may have the right to:</p>
                    <ul class="list-disc pl-5 space-y-2 body-text">
                        <li>Access the personal data we hold about you.</li>
                        <li>Request correction of inaccurate data.</li>
                        <li>Request deletion of your data.</li>
                        <li>Object to or restrict how we process your data.</li>
                        <li>Export your data in a portable format.</li>
                    </ul>
                    <p class="body-text mt-4">To exercise any of these rights, email us at <a
                            href="mailto:hello@xeliai.com" class="text-[#9E4CFF] hover:underline">hello@xeliai.com</a>.
                        We will respond within 30 days.</p>
                </div>

                <!-- 7. Cookies -->
                <div class="policy-card">
                    <h2 class="section-title">7. Cookies &amp; Local Storage</h2>
                    <p class="body-text">We use cookies and browser local storage to maintain your login session,
                        remember your preferences, and support analytics. Essential cookies are required for the
                        platform to function. You can control non-essential cookies through your browser settings,
                        though doing so may affect certain features.</p>
                </div>

                <!-- 8. Security -->
                <div class="policy-card">
                    <h2 class="section-title">8. Security</h2>
                    <p class="body-text">We apply industry-standard security practices including password hashing, API
                        token authentication, encrypted data transmission (HTTPS), and IP-based login tracking. Visitor
                        identifiers are stored as one-way SHA-256 hashes. No security system is infallible; if you
                        suspect unauthorised access to your account, contact us immediately.</p>
                </div>

                <!-- 9. Children -->
                <div class="policy-card">
                    <h2 class="section-title">9. Children's Privacy</h2>
                    <p class="body-text">Xeli AI is a business platform not intended for use by individuals under the
                        age of 18. We do not knowingly collect personal data from minors. If you believe a minor has
                        submitted data through a chatbot you operate, please contact us to arrange removal.</p>
                </div>

                <!-- 10. Changes -->
                <div class="policy-card">
                    <h2 class="section-title">10. Changes to This Policy</h2>
                    <p class="body-text">We may update this Privacy Policy from time to time. When we do, we will update
                        the effective date at the top of this page. Continued use of the platform after changes are
                        posted constitutes acceptance of the revised policy. For material changes, we will notify
                        account holders by email.</p>
                </div>

                <!-- 11. Contact -->
                <div class="policy-card">
                    <h2 class="section-title">11. Contact Us</h2>
                    <p class="body-text">If you have any questions about this Privacy Policy or how we handle your data,
                        please contact us:</p>
                    <div class="mt-4 space-y-1 body-text">
                        <p><span class="font-semibold text-gray-900 dark:text-white">Email:</span> <a
                                href="mailto:hello@xeliai.com"
                                class="text-[#9E4CFF] hover:underline">hello@xeliai.com</a></p>
                        <p><span class="font-semibold text-gray-900 dark:text-white">Phone:</span> +234 810 308 3111</p>
                        <p><span class="font-semibold text-gray-900 dark:text-white">Hours:</span> Mon–Fri, 9:00 AM –
                            6:00 PM</p>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<script setup>
const effectiveDate = new Date('2025-08-01').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

definePageMeta({ layout: 'default' });

useSeoMeta({
    title: 'Privacy Policy – Xeli AI',
    description: 'Learn how Xeli AI collects, uses, and protects your personal data.',
});
</script>

<style scoped>
.policy-card {
    @apply rounded-2xl p-6 shadow-sm border transition-colors bg-gray-50 border-gray-100 dark:bg-white/5 dark:border-white/10;
}

.section-title {
    @apply text-xl font-bold text-gray-900 dark:text-white mb-3;
}

.info-title {
    @apply text-base font-semibold text-gray-800 dark:text-gray-100 mb-1;
}

.info-block {
    @apply pl-4 border-l-2 border-[#9E4CFF]/40;
}

.body-text {
    @apply text-gray-600 dark:text-gray-300 leading-relaxed text-[15px];
}
</style>
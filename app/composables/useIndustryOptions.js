// composables/useIndustryOptions.js
// Item 8: Single source of truth for industry options.
// Import this in onboarding.vue and settings.vue so both pages always stay in sync.

export const useIndustryOptions = () => {
  const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'education', label: 'Education / EdTech' },
    { value: 'finance', label: 'Finance & Fintech' },
    { value: 'retail', label: 'Retail' },
    { value: 'hospitality', label: 'Hospitality & Tourism' },
    { value: 'logistics', label: 'Logistics & Supply Chain' },
    { value: 'legal', label: 'Legal Services' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'other', label: 'Other' },
  ]

  return { industries }
}

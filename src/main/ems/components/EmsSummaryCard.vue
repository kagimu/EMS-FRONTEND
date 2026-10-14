<template>
  <div class="ems-summary" :class="available ? `ems-summary--${tone}` : 'ems-summary--muted'">
    <span class="ems-summary__icon">
      <i :class="available ? icon : 'bi bi-slash-circle'"></i>
    </span>
    <span class="ems-summary__label">{{ label }}</span>
    <span class="ems-summary__value" :style="available ? null : 'font-size: 14px; font-weight: 600;'">
      {{ available ? value : reason || 'Unavailable' }}
    </span>
    <span v-if="available && hint" class="ems-summary__hint">{{ hint }}</span>
    <router-link v-if="available && to" class="ems-summary__link" :to="to">View</router-link>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: '' },
  icon: { type: String, default: 'bi bi-bar-chart' },
  tone: { type: String, default: 'blue' },
  hint: { type: String, default: '' },
  available: { type: Boolean, default: true },
  reason: { type: String, default: '' },
  to: { type: [String, Object], default: null },
})
</script>

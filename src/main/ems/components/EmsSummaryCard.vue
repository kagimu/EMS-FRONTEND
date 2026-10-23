<template>
  <component
    :is="to ? RouterLink : 'div'"
    :to="to || undefined"
    class="ems-summary"
    :class="available ? `ems-summary--${tone}` : 'ems-summary--muted'"
  >
    <span class="ems-summary__icon">
      <i :class="available ? icon : 'bi bi-slash-circle'"></i>
    </span>
    <span class="ems-summary__label">{{ label }}</span>
    <span class="ems-summary__value" :style="available ? null : 'font-size: 14px; font-weight: 600;'">
      {{ available ? value : reason || 'Unavailable' }}
    </span>
    <span v-if="available && hint" class="ems-summary__hint">{{ hint }}</span>
    <span v-if="to" class="ems-summary__link">
      View <i class="bi bi-arrow-right" aria-hidden="true"></i>
    </span>
  </component>
</template>

<script setup>
import { RouterLink } from 'vue-router'

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

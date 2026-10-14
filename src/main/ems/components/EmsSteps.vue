<template>
  <ol class="ems-steps" :aria-label="'Setup progress, step ' + (current + 1) + ' of ' + steps.length">
    <template v-for="(step, index) in steps" :key="step">
      <li
        class="ems-step"
        :class="{ 'ems-step--active': index === current, 'ems-step--done': index < current }"
        :aria-current="index === current ? 'step' : undefined"
      >
        <span class="ems-step__dot" aria-hidden="true">{{ index < current ? '✓' : index + 1 }}</span>
        <span class="ems-step__label">{{ step }}</span>
      </li>
      <span v-if="index < steps.length - 1" class="ems-step__connector" aria-hidden="true"></span>
    </template>
  </ol>
</template>

<script setup>
defineProps({
  steps: { type: Array, required: true },
  current: { type: Number, required: true },
})
</script>

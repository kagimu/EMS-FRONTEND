<template>
  <div class="ems-state" role="status" aria-live="polite">
    <span v-if="state === 'loading'" class="ems-state__spinner" aria-hidden="true"></span>
    <p v-if="title" class="ems-state__title">{{ title }}</p>
    <p v-if="message" class="ems-state__msg">{{ message }}</p>

    <button v-if="state === 'error'" type="button" class="ems-btn ems-btn--primary" @click="$emit('retry')">
      Try again
    </button>
  </div>
</template>

<script setup>
defineProps({
  state: { type: String, default: 'loading' }, // 'loading' | 'error'
  title: { type: String, default: '' },
  message: { type: String, default: '' },
})

defineEmits(['retry'])
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ems-modal" role="dialog" aria-modal="true" :aria-labelledby="titleId">
      <div class="ems-modal__overlay" @click="$emit('close')"></div>
      <div class="ems-panel ems-modal-panel" :class="{ 'ems-modal-panel--wide': wide }">
        <h2 :id="titleId" class="ems-panel__title" style="margin-bottom: 12px;">
          <i v-if="icon" :class="icon" aria-hidden="true"></i>
          {{ title }}
        </h2>
        <slot />
        <div class="ems-modal-actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  icon: { type: String, default: '' },
  wide: { type: Boolean, default: false },
})

defineEmits(['close'])

const titleId = `ems-modal-title-${Math.random().toString(36).slice(2, 10)}`
</script>

<style scoped>
.ems-modal-panel {
  width: min(600px, 100%);
  margin: 0;
  padding: 18px;
}

.ems-modal-panel--wide {
  width: min(820px, 100%);
}

.ems-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .ems-modal-panel {
    padding: 14px;
  }
}
</style>

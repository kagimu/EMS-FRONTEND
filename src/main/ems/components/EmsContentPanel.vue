<template>
  <section class="ems-panel">
    <header class="ems-panel__head">
      <div class="ems-panel__titlewrap">
        <h2 class="ems-panel__title">
          <i v-if="icon" :class="icon" aria-hidden="true"></i>
          {{ title }}
        </h2>
        <p class="ems-panel__desc">
          <template v-if="count !== null && count !== undefined">
            {{ count }} {{ count === 1 ? (countNoun || 'record') : (countNounPlural || 'records') }}
          </template>
          <template v-if="description">{{ count !== null ? ' · ' : '' }}{{ description }}</template>
        </p>
      </div>
      <div class="ems-panel__actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="ems-panel__body">
      <slot name="toolbar" />

      <div v-if="state === 'loading'" class="ems-skeleton" role="status" aria-label="Loading">
        <span class="ems-skeleton__row ems-skeleton__row--title" aria-hidden="true"></span>
        <span class="ems-skeleton__row" aria-hidden="true"></span>
        <span class="ems-skeleton__row" aria-hidden="true"></span>
        <span class="ems-skeleton__row ems-skeleton__row--short" aria-hidden="true"></span>
      </div>

      <div v-else-if="state === 'error'" class="ems-empty">
        <p class="ems-empty__title">Could not load this section</p>
        <p class="ems-empty__msg">{{ errorMessage || 'Please try again.' }}</p>
      </div>

      <div v-else-if="state === 'empty'" class="ems-empty">
        <slot name="empty">
          <p class="ems-empty__title">Nothing to show yet</p>
          <p class="ems-empty__msg">There are no records for this section.</p>
        </slot>
      </div>

      <slot v-else />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  count: { type: Number, default: null },
  countNoun: { type: String, default: '' },
  countNounPlural: { type: String, default: '' },
  state: { type: String, default: 'ready' }, // ready | loading | error | empty
  errorMessage: { type: String, default: '' },
})
</script>

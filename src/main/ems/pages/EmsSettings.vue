<template>
  <div>
    <EmsContentPanel
      title="Settings"
      icon="bi bi-gear"
      description="Organisation, account and workflow settings."
      :count="null"
      :state="phase"
      :error-message="errorMessage"
    >
      <div v-if="phase === 'ready'" class="ems-dash__grid">
        <section class="ems-card">
          <h2 class="ems-card__title">Organisation</h2>
          <dl class="ems-kv">
            <dt>Name</dt><dd>{{ entity?.name || '—' }}</dd>
            <dt>Number</dt><dd>{{ entity?.number || '—' }}</dd>
            <dt>Status</dt><dd>{{ entity?.status || '—' }}</dd>
          </dl>
        </section>

        <section class="ems-card">
          <h2 class="ems-card__title">Your account</h2>
          <dl class="ems-kv">
            <dt>Name</dt><dd>{{ displayName }}</dd>
            <dt>Email</dt><dd>{{ profile?.email || profile?.contacts?.email || '—' }}</dd>
            <dt>Account type</dt><dd>{{ profile?.type || '—' }}</dd>
          </dl>
        </section>

        <section class="ems-card">
          <h2 class="ems-card__title">Workflow deadlines</h2>
          <p v-if="deadlineLoading" class="ems-small ems-muted">Loading…</p>
          <dl v-else-if="deadline" class="ems-kv">
            <dt>Default deadline (hours)</dt><dd>{{ deadline.default_hours ?? deadline.default_deadline_hours ?? '—' }}</dd>
            <dt>Reminder window (hours)</dt><dd>{{ deadline.reminder_hours ?? '—' }}</dd>
          </dl>
          <p v-else class="ems-small ems-muted">Workflow deadline configuration is not available for your organisation.</p>
        </section>
      </div>
    </EmsContentPanel>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

import api from '@/config/api.js'
import EmsContentPanel from '@/main/ems/components/EmsContentPanel.vue'

const entity = ref(null)
const profile = ref(null)
const deadline = ref(null)
const deadlineLoading = ref(true)
const phase = ref('loading')
const errorMessage = ref('')

const displayName = computed(() => {
  const p = profile.value
  if (!p) return '—'
  return [p.first_name, p.second_name].filter(Boolean).join(' ') || '—'
})

onMounted(async () => {
  phase.value = 'loading'
  errorMessage.value = ''
  try {
    // Core context: organisation + account. If this fails, the page fails.
    const [entityRes, profileRes] = await Promise.all([
      api.get('main/eos/entity/current'),
      api.get('main/profile'),
    ])
    entity.value = entityRes?.data?.data || null
    profile.value = profileRes?.data?.data || null
    phase.value = 'ready'
  } catch (error) {
    errorMessage.value = 'Could not load your settings. Please try again.'
    phase.value = 'error'
    return
  }

  // Non-critical: workflow deadlines. A failure must not break the page.
  try {
    const res = await api.get('main/ems/workflow/deadline-config')
    deadline.value = res?.data?.data || null
  } catch (error) {
    deadline.value = null
  } finally {
    deadlineLoading.value = false
  }
})
</script>

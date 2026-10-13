<template>
  <section class="dc-panel">
    <div class="dc-panel__title">
      <h2>Setup Status</h2>
      <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="refresh">Refresh</button>
    </div>

    <p class="dc-note">Informational summary of the data already retrieved from the backend for the active session.</p>

    <table class="dc-table">
      <tbody>
        <tr>
          <th>Session</th>
          <td>
            <span :class="session?.status === 'authenticated' ? 'dc-ok' : 'dc-error'">
              {{ session?.status === 'authenticated' ? '✓ authenticated' : '✗ not authenticated' }}
            </span>
            <span class="dc-muted dc-small"> — {{ session?.label || 'none' }}</span>
          </td>
        </tr>
        <tr>
          <th>Organisation / entity</th>
          <td>
            <template v-if="session?.entity && session.entity.number">
              ✓ {{ session.entity.name || '(unnamed)' }} ({{ session.entity.number }})
            </template>
            <span v-else class="dc-muted">no active entity set</span>
          </td>
        </tr>
        <tr>
          <th>Units</th>
          <td>{{ counts.units === null ? '—' : counts.units }}</td>
        </tr>
        <tr>
          <th>Stakeholders</th>
          <td>{{ counts.stakeholders === null ? '—' : counts.stakeholders }}</td>
        </tr>
        <tr>
          <th>Active owners</th>
          <td>{{ counts.owners === null ? '—' : counts.owners }}</td>
        </tr>
        <tr>
          <th>Assignments</th>
          <td>{{ counts.assignments === null ? '—' : counts.assignments }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="errorMessage" class="dc-error">{{ errorMessage }}</p>
  </section>
</template>

<script setup>
import { computed, reactive } from 'vue'

import { useDevRequest } from '@/dev/composables/useDevRequest.js'
import { useDevSessionStore } from '@/dev/store/devSession.js'

const sessionStore = useDevSessionStore()
const { busy, errorMessage, run } = useDevRequest()

const session = computed(() => sessionStore.activeSession)
const counts = reactive({ units: null, stakeholders: null, owners: null, assignments: null })

async function refresh() {
  const units = await run({ method: 'GET', url: '/main/ems/organisation-units' })
  counts.units = units.ok ? (units.body?.data || []).length : null

  const stakeholders = await run({ method: 'GET', url: '/main/ems/stakeholders' })
  counts.stakeholders = stakeholders.ok ? (stakeholders.body?.data || []).length : null

  const owners = await run({
    method: 'GET',
    url: '/main/ems/stakeholders',
    params: { stakeholder_type: 'owner' },
  })
  counts.owners = owners.ok
    ? (owners.body?.data || []).filter((owner) => owner.status === 'ACTIVE').length
    : null

  const assignments = await run({ method: 'GET', url: '/main/ems/user-assignments' })
  counts.assignments = assignments.ok ? (assignments.body?.data || []).length : null
}
</script>

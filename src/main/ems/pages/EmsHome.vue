<template>
  <div>
    <div class="ems-cards">
      <EmsSummaryCard
        label="Organisation units"
        icon="bi bi-diagram-3"
        tone="blue"
        :value="cardValue(cards.units)"
        :available="cards.units.available"
        :reason="cards.units.reason"
        :to="{ path: '/ems/organisation', query: { tab: 'structure' } }"
      />
      <EmsSummaryCard
        label="Stakeholders"
        icon="bi bi-people"
        tone="green"
        :value="cardValue(cards.stakeholders)"
        :available="cards.stakeholders.available"
        :reason="cards.stakeholders.reason"
        :to="{ path: '/ems/organisation', query: { tab: 'people' } }"
      />
      <EmsSummaryCard
        label="Open approvals"
        icon="bi bi-check2-square"
        tone="orange"
        :value="cardValue(cards.approvals)"
        :available="cards.approvals.available"
        :reason="cards.approvals.reason"
        :to="{ path: '/ems/organisation', query: { tab: 'approvals' } }"
      />
      <EmsSummaryCard
        label="Unread notifications"
        icon="bi bi-bell"
        tone="purple"
        :value="cardValue(cards.notifications)"
        :available="cards.notifications.available"
        :reason="cards.notifications.reason"
        to="/ems/notifications"
      />
      <EmsSummaryCard
        label="Licence"
        icon="bi bi-patch-check"
        tone="indigo"
        :value="cards.licence.value"
        :available="cards.licence.available"
        :reason="cards.licence.reason"
        to="/ems/licensing"
      />
    </div>

    <EmsContentPanel
      title="EMS modules"
      icon="bi bi-grid-3x3-gap"
      :description="modulesDescription"
      :count="modules.length"
      count-noun="module"
      count-noun-plural="modules"
      :state="modulesState"
      :error-message="modulesReason"
    >
      <template v-if="modulesState === 'ready'" #toolbar>
        <div class="ems-toolbar">
          <label class="ems-search">
            <i class="bi bi-search" aria-hidden="true"></i>
            <input v-model.trim="moduleQuery" type="search" placeholder="Search modules…" aria-label="Search modules" />
          </label>
        </div>
      </template>

      <table v-if="modulesState === 'ready' && filteredModules.length" class="ems-table">
        <thead>
          <tr>
            <th>Module</th>
            <th>Code</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="module in filteredModules" :key="module.code || module.number">
            <td class="ems-table__primary">{{ module.name || module.label || module.code }}</td>
            <td class="ems-table__muted">{{ module.code || '—' }}</td>
            <td>
              <span class="ems-badge" :class="module.enabled ? 'ems-badge--ok' : 'ems-badge--muted'">
                {{ module.enabled ? 'Enabled' : 'Disabled' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </EmsContentPanel>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

import EmsContentPanel from '@/main/ems/components/EmsContentPanel.vue'
import EmsSummaryCard from '@/main/ems/components/EmsSummaryCard.vue'
import { fetchList, fetchObject } from '@/main/ems/services/emsApi.js'

const AVAILABLE = { available: false, reason: 'Checking…' }

const cards = reactive({
  units: { ...AVAILABLE },
  stakeholders: { ...AVAILABLE },
  approvals: { ...AVAILABLE },
  notifications: { ...AVAILABLE },
  licence: { ...AVAILABLE, value: '' },
})

const modules = ref([])
const modulesState = ref('loading')
const modulesReason = ref('')
const moduleQuery = ref('')

const filteredModules = computed(() => {
  const term = moduleQuery.value.toLowerCase()
  if (!term) return modules.value
  return modules.value.filter((m) =>
    [m.name, m.label, m.code].some((v) => String(v ?? '').toLowerCase().includes(term)),
  )
})

const modulesDescription = computed(() =>
  modulesState.value === 'ready' ? 'Modules available to your organisation.' : '',
)

function cardValue(card) {
  return card.count === undefined || card.count === null ? '—' : card.count
}

async function loadCount(url, filter) {
  const result = await fetchList(url)
  if (!result.available) {
    return { available: false, reason: result.reason, count: null }
  }
  const list = filter ? result.list.filter(filter) : result.list
  return { available: true, reason: '', count: list.length }
}

onMounted(async () => {
  const [units, stakeholders, approvals, notifications, licence] = await Promise.all([
    loadCount('/main/ems/organisation-units'),
    loadCount('/main/ems/stakeholders'),
    loadCount('/main/ems/approvals', (r) => String(r.status || '').toUpperCase() === 'PENDING'),
    loadCount('/main/ems/notifications', (r) => !r.read_at),
    fetchObject('/main/ems/licence'),
  ])

  Object.assign(cards.units, units)
  Object.assign(cards.stakeholders, stakeholders)
  Object.assign(cards.approvals, approvals)
  Object.assign(cards.notifications, notifications)

  if (licence.available && licence.object) {
    cards.licence.available = true
    cards.licence.reason = ''
    cards.licence.value = licence.object.effective_status || licence.object.status || 'Active'
  } else {
    cards.licence.available = false
    cards.licence.reason = licence.reason || 'No licence'
    cards.licence.value = ''
  }

  const result = await fetchList('/main/ems/modules')
  if (result.available) {
    modules.value = result.list
    modulesState.value = 'ready'
  } else {
    modulesReason.value = result.reason
    modulesState.value = 'error'
  }
})
</script>

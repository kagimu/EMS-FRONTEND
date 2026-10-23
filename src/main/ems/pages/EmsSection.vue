<template>
  <div>
    <div v-if="config.manageTab" class="ems-manage-banner">
      <div>
        <strong>This is the read-only view.</strong>
        <span class="ems-small ems-muted">Create and manage these records in the Organisation workspace.</span>
      </div>
      <router-link
        class="ems-btn ems-btn--primary"
        :to="{ path: '/ems/organisation', query: { tab: config.manageTab } }"
      >
        Manage in Organisation
      </router-link>
    </div>

    <EmsContentPanel
      :title="config.title"
      :icon="config.icon"
      :count="config.single ? null : filtered.length"
      :count-noun="config.countNoun"
      :count-noun-plural="`${config.countNoun}s`"
      :state="state"
      :error-message="reason"
    >
      <template v-if="!config.single && state === 'ready'" #toolbar>
        <div class="ems-toolbar">
          <label class="ems-search">
            <i class="bi bi-search" aria-hidden="true"></i>
            <input v-model.trim="query" type="search" placeholder="Search…" aria-label="Search" />
          </label>
        </div>
      </template>

      <table v-if="!config.single && state === 'ready' && filtered.length" class="ems-table">
        <thead>
          <tr>
            <th v-for="col in config.columns" :key="col.key">{{ col.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in filtered" :key="row.number || row.id || index">
            <td v-for="col in config.columns" :key="col.key" :class="{ 'ems-table__primary': col.primary }">
              <template v-if="col.type === 'status'">
                <span class="ems-badge" :class="badgeClass(cellValue(row, col))">{{ cellValue(row, col) || '—' }}</span>
              </template>
              <template v-else-if="col.type === 'date'">
                <span class="ems-table__muted">{{ formatDate(cellValue(row, col)) }}</span>
              </template>
              <template v-else-if="col.type === 'read'">
                <span class="ems-badge" :class="cellValue(row, col) ? 'ems-badge--ok' : 'ems-badge--warn'">
                  {{ cellValue(row, col) ? 'Read' : 'Unread' }}
                </span>
              </template>
              <template v-else>
                {{ cellValue(row, col) || '—' }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>

      <dl v-if="config.single && state === 'ready' && licenceFields.length" class="ems-kv-card">
        <template v-for="field in licenceFields" :key="field.key">
          <dt>{{ field.label }}</dt>
          <dd>{{ field.value }}</dd>
        </template>
      </dl>
    </EmsContentPanel>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import EmsContentPanel from '@/main/ems/components/EmsContentPanel.vue'
import { fetchList, fetchObject } from '@/main/ems/services/emsApi.js'
import { emsSections } from '@/main/ems/shell/sections.js'

const route = useRoute()

const config = computed(() => emsSections[String(route.name)] || emsSections['ems-organisation'])

const phase = ref('loading') // loading | ready | error
const reason = ref('')
const rows = ref([])
const object = ref(null)
const query = ref('')

const state = computed(() => {
  if (phase.value === 'loading') return 'loading'
  if (phase.value === 'error') return 'error'
  if (config.value.single) return object.value ? 'ready' : 'empty'
  return filtered.value.length ? 'ready' : 'empty'
})

const filtered = computed(() => {
  const term = query.value.toLowerCase()
  if (!term) return rows.value
  const keys = config.value.searchKeys || []
  return rows.value.filter((row) =>
    keys.some((key) => String(row[key] ?? '').toLowerCase().includes(term)),
  )
})

const licenceFields = computed(() => {
  const o = object.value
  if (!o || typeof o !== 'object') return []
  const map = [
    ['number', 'Licence number'],
    ['effective_status', 'Effective status'],
    ['status', 'Status'],
    ['valid_from', 'Valid from'],
    ['valid_to', 'Valid to'],
    ['organisation_number', 'Organisation'],
  ]
  const fields = []
  for (const [key, label] of map) {
    if (o[key] !== undefined && o[key] !== null && o[key] !== '') {
      fields.push({ key, label, value: key.startsWith('valid_') ? formatDate(o[key]) : String(o[key]) })
    }
  }
  if (Array.isArray(o.licensed_addons) && o.licensed_addons.length) {
    fields.push({ key: 'licensed_addons', label: 'Licensed addons', value: o.licensed_addons.join(', ') })
  }
  return fields
})

function cellValue(row, col) {
  const value = row[col.key]
  return value === undefined || value === null ? '' : value
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function badgeClass(value) {
  const upper = String(value || '').toUpperCase()
  if (['ACTIVE', 'APPROVED', 'ENABLED', 'GRANTED'].includes(upper)) return 'ems-badge--ok'
  if (['PENDING', 'REMINDER', 'OVERDUE', 'GRACE', 'INACTIVE'].includes(upper)) return 'ems-badge--warn'
  if (['REJECTED', 'RETURNED', 'ENDED', 'REVOKED', 'SUSPENDED', 'BLOCKED', 'CANCELLED'].includes(upper)) {
    return 'ems-badge--danger'
  }
  return 'ems-badge--muted'
}

async function load() {
  phase.value = 'loading'
  reason.value = ''
  if (config.value.single) {
    const result = await fetchObject(config.value.endpoint)
    if (result.available) {
      object.value = result.object
      phase.value = 'ready'
    } else {
      reason.value = result.reason
      phase.value = 'error'
    }
    return
  }
  const result = await fetchList(config.value.endpoint)
  if (result.available) {
    rows.value = result.list
    phase.value = 'ready'
  } else {
    reason.value = result.reason
    phase.value = 'error'
  }
}

onMounted(load)
</script>

<style scoped>
.ems-manage-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  background: #fff;
  border: 1px solid #e6e9f0;
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 14px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
}

.ems-manage-banner > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>

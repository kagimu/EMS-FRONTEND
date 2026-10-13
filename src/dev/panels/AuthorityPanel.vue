<template>
  <div>
    <!-- SECTION A — AUTHORITY CONFIGURATION -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Foundation D — Authority Configuration</h2>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="load">Load authorities</button>
      </div>

      <p class="dc-note">
        Exactly one anchor is required: <strong>Role</strong> OR <strong>Stakeholder Type</strong> (never both).
        Organisation scope comes from the authenticated session — it is never sent by the console.
        MinAmount is informational; coverage is decided by the backend using MaxAmount.
      </p>

      <div class="dc-form">
        <label class="dc-field">
          <span>decision_type</span>
          <input v-model.trim="filters.decision_type" class="dc-input" />
        </label>
        <label class="dc-field">
          <span>status</span>
          <select v-model="filters.status" class="dc-select">
            <option value="">(any)</option>
            <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>
      </div>

      <form class="dc-form" @submit.prevent="save">
        <label class="dc-field">
          <span>decision_type</span>
          <input v-model.trim="form.decision_type" class="dc-input" required />
        </label>
        <label class="dc-field">
          <span>approval_level</span>
          <input v-model.trim="form.approval_level" class="dc-input" type="number" min="1" required />
        </label>
        <label class="dc-field">
          <span>min_amount</span>
          <input v-model.trim="form.min_amount" class="dc-input" placeholder="optional" />
        </label>
        <label class="dc-field">
          <span>max_amount</span>
          <input v-model.trim="form.max_amount" class="dc-input" placeholder="optional" />
        </label>
        <label class="dc-field">
          <span>anchor_type</span>
          <select v-model="form.anchor_type" class="dc-select">
            <option value="role">ROLE</option>
            <option value="stakeholder_type">STAKEHOLDER TYPE</option>
          </select>
        </label>
        <label v-if="form.anchor_type === 'role'" class="dc-field">
          <span>role_number</span>
          <input v-model.trim="form.role_number" class="dc-input" />
        </label>
        <label v-else class="dc-field">
          <span>stakeholder_type</span>
          <input v-model.trim="form.stakeholder_type" class="dc-input" placeholder="owner, director, …" />
        </label>
        <label class="dc-field">
          <span>organisation_unit_number</span>
          <input v-model.trim="form.organisation_unit_number" class="dc-input" placeholder="optional (active on write)" />
        </label>
        <label class="dc-field">
          <span>valid_from</span>
          <input v-model="form.valid_from" class="dc-input" type="datetime-local" />
        </label>
        <label class="dc-field">
          <span>valid_to</span>
          <input v-model="form.valid_to" class="dc-input" type="datetime-local" />
        </label>
        <button class="dc-btn dc-btn--primary" type="submit" :disabled="busy">
          {{ editing ? 'Update authority' : 'Create authority' }}
        </button>
        <button v-if="editing" class="dc-btn" type="button" @click="resetForm">Cancel</button>
      </form>

      <p v-if="errorMessage" class="dc-error">{{ errorMessage }}</p>

      <p v-if="items.length === 0" class="dc-muted dc-small">No authorities loaded.</p>

      <table v-else class="dc-table">
        <thead>
          <tr>
            <th>number</th><th>decision_type</th><th>level</th><th>min</th><th>max</th>
            <th>anchor</th><th>unit</th><th>status</th><th>valid from</th><th>valid to</th><th>actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.number">
            <td class="dc-small">{{ item.number }}</td>
            <td>{{ item.decision_type }}</td>
            <td>{{ item.approval_level }}</td>
            <td>{{ item.min_amount ?? '—' }}</td>
            <td>{{ item.max_amount ?? '—' }}</td>
            <td>
              <span v-if="item.role_number">ROLE: {{ item.role_number }}</span>
              <span v-else-if="item.stakeholder_type">STAKEHOLDER TYPE: {{ item.stakeholder_type }}</span>
              <span v-else class="dc-error">no anchor</span>
            </td>
            <td class="dc-small">{{ item.organisation_unit_number || 'org-wide' }}</td>
            <td><span class="dc-status" :class="statusClass(item.status)">{{ item.status }}</span></td>
            <td class="dc-small">{{ short(item.valid_from) }}</td>
            <td class="dc-small">{{ short(item.valid_to) }}</td>
            <td class="dc-actions">
              <button class="dc-btn dc-btn--ghost" type="button" @click="edit(item)">Edit</button>
              <select class="dc-select" @change="applyStatus(item, $event.target.value)">
                <option value="">status…</option>
                <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- SECTION B — AUTHORITY RESOLUTION -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Foundation D — Resolve Authority</h2>
      </div>

      <p class="dc-note">
        Read-only resolution: given a decision type and amount (and optional organisation unit), the backend
        returns the required approval path. Leave the unit blank to test <strong>organisation-wide</strong>
        resolution; a unit-scoped authority is never treated as organisation-wide.
      </p>

      <form class="dc-form" @submit.prevent="resolve">
        <label class="dc-field">
          <span>decision_type</span>
          <input v-model.trim="resolveForm.decision_type" class="dc-input" required />
        </label>
        <label class="dc-field">
          <span>amount</span>
          <input v-model.trim="resolveForm.amount" class="dc-input" inputmode="decimal" placeholder="e.g. 500000" required />
        </label>
        <label class="dc-field">
          <span>organisation_unit (optional)</span>
          <input v-model.trim="resolveForm.organisation_unit" class="dc-input" placeholder="blank = org-wide" />
        </label>
        <button class="dc-btn dc-btn--primary" type="submit" :disabled="busy">Resolve</button>
      </form>

      <p v-if="resolveError" class="dc-error">{{ resolveError }}</p>

      <div v-if="resolution" class="dc-resolution">
        <p>
          <strong>Configured:</strong>
          <span :class="resolution.configured ? 'dc-ok' : 'dc-error'">{{ resolution.configured ? 'YES' : 'NO' }}</span>
        </p>

        <p><strong>Required Approval Path:</strong></p>
        <ul v-if="resolution.required_path && resolution.required_path.length" class="dc-path">
          <li v-for="level in resolution.required_path" :key="level.approval_level">
            Level {{ level.approval_level }}
            <span class="dc-muted dc-small">
              —
              <template v-if="level.anchors && level.anchors.length">
                <span v-for="(anchor, i) in level.anchors" :key="i">
                  {{ anchor.type }}:{{ anchor.value }}<span v-if="anchor.organisation_unit_number">@{{ anchor.organisation_unit_number }}</span><span v-if="i < level.anchors.length - 1">, </span>
                </span>
              </template>
              <template v-else>(no anchors)</template>
            </span>
          </li>
        </ul>
        <p v-else class="dc-muted">
          {{ resolution.configured
            ? 'Authority is configured, but no approval path was returned for this resolution.'
            : 'No authority is configured for this decision type in this organisation.' }}
        </p>

        <p>
          <strong>Exceeds Declared Authority:</strong>
          <span :class="resolution.exceeds_declared_authority ? 'dc-error' : 'dc-ok'">
            {{ resolution.exceeds_declared_authority ? 'YES' : 'NO' }}
          </span>
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

import { useDevRequest } from '@/dev/composables/useDevRequest.js'

const statuses = ['ACTIVE', 'INACTIVE', 'ENDED']

const { busy, errorMessage, run } = useDevRequest()

const items = ref([])
const editing = ref(false)
const editNumber = ref(null)

const filters = reactive({ decision_type: '', status: '' })
const form = reactive({
  decision_type: '', approval_level: '', min_amount: '', max_amount: '',
  anchor_type: 'role', role_number: '', stakeholder_type: '', organisation_unit_number: '',
  valid_from: '', valid_to: '',
})

const resolveForm = reactive({ decision_type: '', amount: '', organisation_unit: '' })
const resolution = ref(null)
const resolveError = ref(null)

function statusClass(status) {
  return `dc-status--${String(status || '').toLowerCase()}`
}

function short(value) {
  return value ? String(value).slice(0, 10) : '—'
}

function toIso(local) {
  if (!local) return undefined
  const date = new Date(local)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

async function load() {
  const params = {}
  if (filters.decision_type) params.decision_type = filters.decision_type
  if (filters.status) params.status = filters.status
  const result = await run({ method: 'GET', url: '/main/ems/decision-authorities', params })
  if (result.ok) items.value = result.body?.data || []
}

function buildPayload() {
  const payload = {
    decision_type: form.decision_type,
    approval_level: Number(form.approval_level),
  }
  if (form.min_amount) payload.min_amount = Number(form.min_amount)
  if (form.max_amount) payload.max_amount = Number(form.max_amount)
  // Exactly one anchor is sent (Role OR Stakeholder Type) — never both.
  if (form.anchor_type === 'role') {
    if (form.role_number) payload.role_number = form.role_number
  } else if (form.stakeholder_type) {
    payload.stakeholder_type = form.stakeholder_type
  }
  if (form.organisation_unit_number) payload.organisation_unit_number = form.organisation_unit_number
  const from = toIso(form.valid_from)
  if (from) payload.valid_from = from
  const to = toIso(form.valid_to)
  if (to) payload.valid_to = to
  return payload
}

async function save() {
  const payload = buildPayload()
  const result = editing.value
    ? await run({ method: 'PUT', url: `/main/ems/decision-authorities/${editNumber.value}`, data: payload })
    : await run({ method: 'POST', url: '/main/ems/decision-authorities', data: payload })
  if (result.ok) {
    resetForm()
    await load()
  }
}

function edit(item) {
  editing.value = true
  editNumber.value = item.number
  form.decision_type = item.decision_type
  form.approval_level = item.approval_level
  form.min_amount = item.min_amount ?? ''
  form.max_amount = item.max_amount ?? ''
  if (item.role_number) {
    form.anchor_type = 'role'
    form.role_number = item.role_number
    form.stakeholder_type = ''
  } else {
    form.anchor_type = 'stakeholder_type'
    form.stakeholder_type = item.stakeholder_type || ''
    form.role_number = ''
  }
  form.organisation_unit_number = item.organisation_unit_number || ''
  form.valid_from = ''
  form.valid_to = ''
}

function resetForm() {
  editing.value = false
  editNumber.value = null
  form.decision_type = ''
  form.approval_level = ''
  form.min_amount = ''
  form.max_amount = ''
  form.anchor_type = 'role'
  form.role_number = ''
  form.stakeholder_type = ''
  form.organisation_unit_number = ''
  form.valid_from = ''
  form.valid_to = ''
}

async function applyStatus(item, status) {
  if (!status) return
  const result = await run({ method: 'PATCH', url: `/main/ems/decision-authorities/${item.number}/status`, data: { status } })
  if (result.ok) await load()
}

async function resolve() {
  resolveError.value = null
  resolution.value = null
  const params = { decision_type: resolveForm.decision_type, amount: resolveForm.amount }
  if (resolveForm.organisation_unit) params.organisation_unit = resolveForm.organisation_unit
  const result = await run({ method: 'GET', url: '/main/ems/authority-resolution', params })
  if (result.ok) {
    resolution.value = result.body?.data || null
  } else {
    resolveError.value = (result.body && result.body.message) || result.error || 'Resolution failed'
  }
}
</script>

<style scoped>
.dc-resolution {
  border: 1px solid #cfd6df;
  border-radius: 6px;
  background: #f8fafc;
  padding: 12px;
  margin-top: 10px;
  font-size: 13px;
}
.dc-resolution p {
  margin: 4px 0;
}
.dc-path {
  margin: 4px 0;
  padding-left: 18px;
}
</style>

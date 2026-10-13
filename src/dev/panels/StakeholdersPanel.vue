<template>
  <section class="dc-panel">
    <div class="dc-panel__title">
      <h2>Foundation C1 — Stakeholders</h2>
      <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="load">Load stakeholders</button>
    </div>

    <div class="dc-form">
      <label class="dc-field">
        <span>stakeholder_type</span>
        <select v-model="filters.stakeholder_type" class="dc-select">
          <option value="">(any)</option>
          <option v-for="t in stakeholderTypes" :key="t" :value="t">{{ t }}</option>
        </select>
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
        <span>user_number</span>
        <input v-model.trim="form.user_number" class="dc-input" :disabled="editing" required />
      </label>
      <label class="dc-field">
        <span>stakeholder_type</span>
        <select v-model="form.stakeholder_type" class="dc-select" :disabled="editing" required>
          <option v-for="t in stakeholderTypes" :key="t" :value="t">{{ t }}</option>
        </select>
      </label>
      <label class="dc-field">
        <span>title</span>
        <input v-model.trim="form.title" class="dc-input" />
      </label>
      <label class="dc-field">
        <span>share_percentage</span>
        <input v-model.trim="form.share_percentage" class="dc-input" placeholder="0–100" />
      </label>
      <label class="dc-field">
        <span>shares</span>
        <input v-model.trim="form.shares" class="dc-input" />
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
        {{ editing ? 'Update stakeholder' : 'Create stakeholder' }}
      </button>
      <button v-if="editing" class="dc-btn" type="button" @click="resetForm">Cancel</button>
    </form>

    <p class="dc-note">
      A stakeholder is not a system user: a stakeholder may exist without a login. Creating a stakeholder
      never creates an account. Where a user is referenced, only the user number is exposed.
    </p>

    <p v-if="errorMessage" class="dc-error">{{ errorMessage }}</p>

    <p v-if="items.length === 0" class="dc-muted dc-small">No stakeholders loaded.</p>

    <table v-else class="dc-table">
      <thead>
        <tr>
          <th>number</th><th>user_number</th><th>type</th><th>title</th><th>share %</th><th>status</th>
          <th>valid from</th><th>valid to</th><th>login?</th><th>actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.number">
          <td class="dc-small">{{ item.number }}</td>
          <td class="dc-small">{{ item.user_number }}</td>
          <td>{{ item.stakeholder_type }}</td>
          <td>{{ item.title || '—' }}</td>
          <td>{{ item.share_percentage ?? '—' }}</td>
          <td><span class="dc-status" :class="statusClass(item.status)">{{ item.status }}</span></td>
          <td class="dc-small">{{ short(item.valid_from) }}</td>
          <td class="dc-small">{{ short(item.valid_to) }}</td>
          <td class="dc-small">{{ item.can_authenticate ? 'yes' : 'no' }}</td>
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
</template>

<script setup>
import { reactive, ref } from 'vue'

import { useDevRequest } from '@/dev/composables/useDevRequest.js'

const stakeholderTypes = [
  'owner', 'shareholder', 'board_member', 'director', 'executive', 'staff', 'consultant', 'partner', 'other',
]
const statuses = ['ACTIVE', 'INACTIVE', 'ENDED']

const { busy, errorMessage, run } = useDevRequest()

const items = ref([])
const editing = ref(false)
const editNumber = ref(null)

const filters = reactive({ stakeholder_type: '', status: '' })
const form = reactive({
  user_number: '', stakeholder_type: 'staff', title: '',
  share_percentage: '', shares: '', valid_from: '', valid_to: '',
})

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
  if (filters.stakeholder_type) params.stakeholder_type = filters.stakeholder_type
  if (filters.status) params.status = filters.status
  const result = await run({ method: 'GET', url: '/main/ems/stakeholders', params })
  if (result.ok) items.value = result.body?.data || []
}

function buildPayload() {
  const payload = {}
  if (!editing.value) {
    payload.user_number = form.user_number
    payload.stakeholder_type = form.stakeholder_type
  }
  if (form.title) payload.title = form.title
  if (form.share_percentage) payload.share_percentage = Number(form.share_percentage)
  if (form.shares) payload.shares = Number(form.shares)
  const from = toIso(form.valid_from)
  if (from) payload.valid_from = from
  const to = toIso(form.valid_to)
  if (to) payload.valid_to = to
  return payload
}

async function save() {
  const payload = buildPayload()
  const result = editing.value
    ? await run({ method: 'PUT', url: `/main/ems/stakeholders/${editNumber.value}`, data: payload })
    : await run({ method: 'POST', url: '/main/ems/stakeholders', data: payload })
  if (result.ok) {
    resetForm()
    await load()
  }
}

function edit(item) {
  editing.value = true
  editNumber.value = item.number
  form.user_number = item.user_number
  form.stakeholder_type = item.stakeholder_type
  form.title = item.title || ''
  form.share_percentage = item.share_percentage ?? ''
  form.shares = item.shares ?? ''
  form.valid_from = ''
  form.valid_to = ''
}

function resetForm() {
  editing.value = false
  editNumber.value = null
  form.user_number = ''
  form.title = ''
  form.share_percentage = ''
  form.shares = ''
  form.valid_from = ''
  form.valid_to = ''
}

async function applyStatus(item, status) {
  if (!status) return
  const result = await run({ method: 'PATCH', url: `/main/ems/stakeholders/${item.number}/status`, data: { status } })
  if (result.ok) await load()
}
</script>

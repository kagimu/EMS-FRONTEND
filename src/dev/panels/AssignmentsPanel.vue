<template>
  <section class="dc-panel">
    <div class="dc-panel__title">
      <h2>Foundation C3 — User Assignments</h2>
      <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="load">Load assignments</button>
    </div>

    <div class="dc-form">
      <label class="dc-field">
        <span>organisation_unit_number</span>
        <input v-model.trim="filters.organisation_unit_number" class="dc-input" />
      </label>
      <label class="dc-field">
        <span>user_number</span>
        <input v-model.trim="filters.user_number" class="dc-input" />
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
        <input v-model.trim="form.user_number" class="dc-input" :disabled="editing" placeholder="existing user number" required />
      </label>
      <label class="dc-field">
        <span>organisation_unit_number</span>
        <input v-model.trim="form.organisation_unit_number" class="dc-input" required />
      </label>
      <label class="dc-field">
        <span>assignment_type</span>
        <select v-model="form.assignment_type" class="dc-select" required>
          <option v-for="t in assignmentTypes" :key="t" :value="t">{{ t }}</option>
        </select>
      </label>
      <label class="dc-field">
        <span>position_title</span>
        <input v-model.trim="form.position_title" class="dc-input" />
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
        {{ editing ? 'Update assignment' : 'Create assignment' }}
      </button>
      <button v-if="editing" class="dc-btn" type="button" @click="resetForm">Cancel</button>
    </form>

    <p class="dc-note">
      An assignment records WHERE a person operates (organisation unit) and in what capacity. The user is
      immutable on update. It grants no permission or authority.
    </p>

    <p v-if="errorMessage" class="dc-error">{{ errorMessage }}</p>

    <p v-if="items.length === 0" class="dc-muted dc-small">No assignments loaded.</p>

    <table v-else class="dc-table">
      <thead>
        <tr>
          <th>number</th><th>user_number</th><th>unit</th><th>type</th><th>position</th>
          <th>valid from</th><th>valid to</th><th>status</th><th>actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.number">
          <td class="dc-small">{{ item.number }}</td>
          <td class="dc-small">{{ item.user_number }}</td>
          <td class="dc-small">{{ item.organisation_unit_number }}</td>
          <td>{{ item.assignment_type }}</td>
          <td>{{ item.position_title || '—' }}</td>
          <td class="dc-small">{{ short(item.valid_from) }}</td>
          <td class="dc-small">{{ short(item.valid_to) }}</td>
          <td><span class="dc-status" :class="statusClass(item.status)">{{ item.status }}</span></td>
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

const assignmentTypes = ['member', 'manager', 'head', 'staff']
const statuses = ['ACTIVE', 'INACTIVE', 'ENDED']

const { busy, errorMessage, run } = useDevRequest()

const items = ref([])
const editing = ref(false)
const editNumber = ref(null)

const filters = reactive({ organisation_unit_number: '', user_number: '', status: '' })
const form = reactive({
  user_number: '', organisation_unit_number: '', assignment_type: 'member',
  position_title: '', valid_from: '', valid_to: '',
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
  if (filters.organisation_unit_number) params.organisation_unit_number = filters.organisation_unit_number
  if (filters.user_number) params.user_number = filters.user_number
  if (filters.status) params.status = filters.status
  const result = await run({ method: 'GET', url: '/main/ems/user-assignments', params })
  if (result.ok) items.value = result.body?.data || []
}

function buildPayload() {
  const payload = {
    organisation_unit_number: form.organisation_unit_number,
    assignment_type: form.assignment_type,
  }
  if (!editing.value) payload.user_number = form.user_number
  if (form.position_title) payload.position_title = form.position_title
  const from = toIso(form.valid_from)
  if (from) payload.valid_from = from
  const to = toIso(form.valid_to)
  if (to) payload.valid_to = to
  return payload
}

async function save() {
  const payload = buildPayload()
  const result = editing.value
    ? await run({ method: 'PUT', url: `/main/ems/user-assignments/${editNumber.value}`, data: payload })
    : await run({ method: 'POST', url: '/main/ems/user-assignments', data: payload })
  if (result.ok) {
    resetForm()
    await load()
  }
}

function edit(item) {
  editing.value = true
  editNumber.value = item.number
  form.user_number = item.user_number
  form.organisation_unit_number = item.organisation_unit_number
  form.assignment_type = item.assignment_type
  form.position_title = item.position_title || ''
  form.valid_from = ''
  form.valid_to = ''
}

function resetForm() {
  editing.value = false
  editNumber.value = null
  form.user_number = ''
  form.organisation_unit_number = ''
  form.assignment_type = 'member'
  form.position_title = ''
  form.valid_from = ''
  form.valid_to = ''
}

async function applyStatus(item, status) {
  if (!status) return
  const result = await run({ method: 'PATCH', url: `/main/ems/user-assignments/${item.number}/status`, data: { status } })
  if (result.ok) await load()
}
</script>

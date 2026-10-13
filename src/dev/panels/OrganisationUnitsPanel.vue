<template>
  <section class="dc-panel">
    <div class="dc-panel__title">
      <h2>Foundation B — Organisation Units</h2>
      <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="load">Load units</button>
    </div>

    <div class="dc-form">
      <label class="dc-field">
        <span>parent</span>
        <input v-model.trim="filters.parent" class="dc-input" placeholder="unit number (optional)" />
      </label>
      <label class="dc-field">
        <span>status</span>
        <select v-model="filters.status" class="dc-select">
          <option value="">(any)</option>
          <option v-for="s in unitStatuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </label>
    </div>

    <form class="dc-form" @submit.prevent="save">
      <label class="dc-field">
        <span>name</span>
        <input v-model.trim="form.name" class="dc-input" required />
      </label>
      <label class="dc-field">
        <span>unit_type</span>
        <input v-model.trim="form.unit_type" class="dc-input" placeholder="free text" required />
      </label>
      <label class="dc-field">
        <span>code</span>
        <input v-model.trim="form.code" class="dc-input" />
      </label>
      <label class="dc-field">
        <span>parent_number</span>
        <input v-model.trim="form.parent_number" class="dc-input" />
      </label>
      <button class="dc-btn dc-btn--primary" type="submit" :disabled="busy">
        {{ editing ? 'Update unit' : 'Create unit' }}
      </button>
      <button v-if="editing" class="dc-btn" type="button" @click="resetForm">Cancel</button>
    </form>

    <p v-if="errorMessage" class="dc-error">{{ errorMessage }}</p>

    <p v-if="items.length === 0" class="dc-muted dc-small">No units loaded.</p>

    <template v-else>
      <table class="dc-table">
        <thead>
          <tr>
            <th>number</th><th>name</th><th>type</th><th>code</th><th>parent</th><th>status</th><th>actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="unit in items" :key="unit.number">
            <td class="dc-small">{{ unit.number }}</td>
            <td>{{ unit.name }}</td>
            <td>{{ unit.unit_type }}</td>
            <td>{{ unit.code }}</td>
            <td class="dc-small">{{ unit.parent_number || '—' }}</td>
            <td><span class="dc-status" :class="statusClass(unit.status)">{{ unit.status }}</span></td>
            <td class="dc-actions">
              <button class="dc-btn dc-btn--ghost" type="button" @click="edit(unit)">Edit</button>
              <select class="dc-select" @change="applyStatus(unit, $event.target.value)">
                <option value="">status…</option>
                <option v-for="s in unitStatuses" :key="s" :value="s">{{ s }}</option>
              </select>
              <button class="dc-btn dc-btn--danger" type="button" @click="remove(unit)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="dc-small">Hierarchy</h3>
      <ul class="dc-tree">
        <li v-for="node in tree" :key="node.number">
          {{ node.name }} <span class="dc-muted dc-small">({{ node.unit_type }}, {{ node.status }})</span>
          <ul v-if="node.children.length">
            <li v-for="child in node.children" :key="child.number">
              {{ child.name }} <span class="dc-muted dc-small">({{ child.unit_type }})</span>
            </li>
          </ul>
        </li>
      </ul>
    </template>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

import { useDevRequest } from '@/dev/composables/useDevRequest.js'

const unitStatuses = ['ACTIVE', 'INACTIVE']

const { busy, errorMessage, run } = useDevRequest()

const items = ref([])
const editing = ref(false)
const editNumber = ref(null)

const filters = reactive({ parent: '', status: '' })
const form = reactive({ name: '', unit_type: '', code: '', parent_number: '' })

function statusClass(status) {
  return `dc-status--${String(status || '').toLowerCase()}`
}

function buildPayload() {
  const payload = { name: form.name, unit_type: form.unit_type }
  if (form.code) payload.code = form.code
  if (form.parent_number) payload.parent_number = form.parent_number
  return payload
}

async function load() {
  const params = {}
  if (filters.parent) params.parent = filters.parent
  if (filters.status) params.status = filters.status
  const result = await run({ method: 'GET', url: '/main/ems/organisation-units', params })
  if (result.ok) items.value = result.body?.data || []
}

async function save() {
  const payload = buildPayload()
  const result = editing.value
    ? await run({ method: 'PUT', url: `/main/ems/organisation-units/${editNumber.value}`, data: payload })
    : await run({ method: 'POST', url: '/main/ems/organisation-units', data: payload })
  if (result.ok) {
    resetForm()
    await load()
  }
}

function edit(unit) {
  editing.value = true
  editNumber.value = unit.number
  form.name = unit.name
  form.unit_type = unit.unit_type
  form.code = unit.code
  form.parent_number = unit.parent_number
}

function resetForm() {
  editing.value = false
  editNumber.value = null
  form.name = ''
  form.unit_type = ''
  form.code = ''
  form.parent_number = ''
}

async function applyStatus(unit, status) {
  if (!status) return
  const result = await run({ method: 'PATCH', url: `/main/ems/organisation-units/${unit.number}/status`, data: { status } })
  if (result.ok) await load()
}

async function remove(unit) {
  const result = await run({ method: 'DELETE', url: `/main/ems/organisation-units/${unit.number}` })
  if (result.ok) await load()
}

const tree = computed(() => {
  const byNumber = new Map(items.value.map((unit) => [unit.number, { ...unit, children: [] }]))
  const roots = []
  for (const node of byNumber.values()) {
    const parent = node.parent_number ? byNumber.get(node.parent_number) : null
    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
})
</script>

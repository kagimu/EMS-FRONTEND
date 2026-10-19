<template>
  <EmsContentPanel
    title="Organisation structure"
    icon="bi bi-diagram-3"
    description="Configurable units for your current organisation. Unit types are free text."
    :count="units.length"
    count-noun="unit"
    count-noun-plural="units"
    :state="listState"
    :error-message="listError"
  >
    <template #actions>
      <button type="button" class="ems-btn ems-btn--ghost" :disabled="listState === 'loading'" @click="loadUnits">
        Refresh
      </button>
      <button v-if="canManage" type="button" class="ems-btn ems-btn--primary" @click="openCreate()">
        New unit
      </button>
    </template>

    <template #empty>
      <p class="ems-empty__title">No organisation units yet</p>
      <p class="ems-empty__msg">
        Units describe how your organisation is structured. Create the first unit to get started.
      </p>
      <div v-if="canManage" class="ems-actions" style="justify-content: center; margin-top: 14px;">
        <button type="button" class="ems-btn ems-btn--primary" @click="openCreate()">Create first unit</button>
      </div>
    </template>

    <div v-if="listState === 'ready'" class="ems-form">
      <div v-if="notice" class="ems-alert" :class="notice.ok ? 'ems-alert--success' : 'ems-alert--error'" role="status">
        {{ notice.text }}
      </div>

      <p v-if="!canManage" class="ems-small ems-muted">
        You can view the organisation structure. Creating, editing and deactivating units requires the
        organisation management permission.
      </p>

      <div class="ems-toolbar">
        <label class="ems-search">
          <i class="bi bi-search" aria-hidden="true"></i>
          <input
            v-model="search"
            type="search"
            placeholder="Search by name, code or type"
            aria-label="Search organisation units"
          />
        </label>
        <select v-model="statusFilter" class="ems-select" aria-label="Filter by status">
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <button
          v-if="!isFiltering"
          type="button"
          class="ems-btn ems-btn--ghost"
          @click="toggleAll"
        >
          {{ allExpanded ? 'Collapse all' : 'Expand all' }}
        </button>
        <button v-if="isFiltering" type="button" class="ems-btn ems-btn--ghost" @click="clearFilters">
          Clear filters
        </button>
      </div>

      <div v-if="!displayRows.length" class="ems-empty">
        <p class="ems-empty__title">No units match your filters</p>
        <p class="ems-empty__msg">Try a different search term or status.</p>
      </div>

      <div v-else class="ems-unit-scroll">
        <table class="ems-table ems-unit-table">
          <thead>
            <tr>
              <th scope="col">Unit</th>
              <th scope="col">Type</th>
              <th scope="col">Code</th>
              <th scope="col">Status</th>
              <th scope="col" class="ems-unit-actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in displayRows" :key="row.unit.number">
              <td>
                <div class="ems-unit-name" :style="{ paddingLeft: `${row.depth * 18}px` }">
                  <button
                    v-if="row.hasChildren"
                    type="button"
                    class="ems-tree-toggle"
                    :aria-label="isExpanded(row.unit.number) ? `Collapse ${row.unit.name}` : `Expand ${row.unit.name}`"
                    :aria-expanded="isExpanded(row.unit.number)"
                    @click="toggle(row.unit.number)"
                  >
                    <i :class="isExpanded(row.unit.number) ? 'bi bi-chevron-down' : 'bi bi-chevron-right'"></i>
                  </button>
                  <span v-else class="ems-tree-spacer" aria-hidden="true"></span>
                  <button type="button" class="ems-link ems-unit-link" @click="openDetails(row.unit)">
                    {{ row.unit.name }}
                  </button>
                  <span v-if="row.path" class="ems-small ems-muted">— {{ row.path }}</span>
                </div>
              </td>
              <td>{{ row.unit.unit_type || '—' }}</td>
              <td class="ems-table__muted">{{ row.unit.code || '—' }}</td>
              <td>
                <span class="ems-badge" :class="statusClass(row.unit.status)">{{ row.unit.status }}</span>
              </td>
              <td>
                <div class="ems-unit-actions">
                  <button type="button" class="ems-link" @click="openDetails(row.unit)">View</button>
                  <template v-if="canManage">
                    <button type="button" class="ems-link" @click="openCreate(row.unit.number)">Add child</button>
                    <button type="button" class="ems-link" @click="openEdit(row.unit)">Edit</button>
                    <button
                      type="button"
                      class="ems-link"
                      @click="requestStatus(row.unit, row.unit.status === 'ACTIVE' ? 'deactivate' : 'activate')"
                    >
                      {{ row.unit.status === 'ACTIVE' ? 'Deactivate' : 'Activate' }}
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="ems-small ems-muted" style="margin-top: 10px;">
        Units can be nested to any depth. Unit types are free text, so the structure can represent any kind of
        organisation.
      </p>
    </div>
  </EmsContentPanel>

  <Teleport to="body">
    <!-- Create / edit unit -->
    <div v-if="formOpen" class="ems-modal" role="dialog" aria-modal="true" aria-labelledby="ems-unit-form-title">
      <div class="ems-modal__overlay" @click="closeForm"></div>
      <div class="ems-panel ems-modal-panel">
        <h2 id="ems-unit-form-title" class="ems-panel__title" style="margin-bottom: 12px;">
          <i class="bi bi-diagram-3" aria-hidden="true"></i>
          {{ formMode === 'create' ? 'New organisation unit' : 'Edit organisation unit' }}
        </h2>

        <div class="ems-form">
          <EmsField v-model="form.name" label="Name" required :error="formErrors.name" placeholder="e.g. Operations" />
          <label class="ems-field">
            <span class="ems-field__label">Unit type<span class="ems-field__req">*</span></span>
            <span class="ems-field__control" :class="{ 'ems-field__control--error': !!formErrors.unit_type }">
              <input
                v-model="form.unit_type"
                class="ems-field__input"
                list="ems-unit-type-options"
                placeholder="e.g. Division, Branch, Department"
                autocomplete="off"
              />
            </span>
            <datalist id="ems-unit-type-options">
              <option v-for="type in unitTypes" :key="type" :value="type"></option>
            </datalist>
            <span v-if="formErrors.unit_type" class="ems-field__error">{{ formErrors.unit_type }}</span>
            <span v-else class="ems-small ems-muted">Free text. Existing types are suggested.</span>
          </label>
          <EmsField v-model="form.code" label="Code (optional)" placeholder="e.g. OPS" />
          <label class="ems-field">
            <span class="ems-field__label">Parent unit</span>
            <span class="ems-field__control">
              <select v-model="form.parent_number" class="ems-field__input">
                <option value="">— No parent (top level) —</option>
                <option v-for="option in parentOptions" :key="option.number" :value="option.number">
                  {{ option.name }}{{ option.code ? ` (${option.code})` : '' }}{{ option.status === 'INACTIVE' ? ' — inactive' : '' }}
                </option>
              </select>
            </span>
            <span v-if="formErrors.parent_number" class="ems-field__error">{{ formErrors.parent_number }}</span>
            <span v-else class="ems-small ems-muted">Only active units can be parents.</span>
          </label>

          <div v-if="formErrors.general" class="ems-alert ems-alert--error" role="alert">
            {{ formErrors.general }}
          </div>

          <div class="ems-modal-actions">
            <button type="button" class="ems-btn ems-btn--ghost" :disabled="formSaving" @click="closeForm">Cancel</button>
            <button type="button" class="ems-btn ems-btn--primary" :disabled="formSaving" @click="saveUnit">
              {{ formSaving ? 'Saving…' : formMode === 'create' ? 'Create unit' : 'Save changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Unit details -->
    <div v-if="detailUnit" class="ems-modal" role="dialog" aria-modal="true" aria-labelledby="ems-unit-detail-title">
      <div class="ems-modal__overlay" @click="detailUnit = null"></div>
      <div class="ems-panel ems-modal-panel">
        <h2 id="ems-unit-detail-title" class="ems-panel__title" style="margin-bottom: 12px;">
          <i class="bi bi-diagram-3" aria-hidden="true"></i>
          {{ detailUnit.name }}
        </h2>

        <dl class="ems-kv-card">
          <dt>Type</dt>
          <dd>{{ detailUnit.unit_type || '—' }}</dd>
          <dt>Code</dt>
          <dd>{{ detailUnit.code || '—' }}</dd>
          <dt>Parent</dt>
          <dd>{{ parentName(detailUnit) }}</dd>
          <dt>Status</dt>
          <dd><span class="ems-badge" :class="statusClass(detailUnit.status)">{{ detailUnit.status }}</span></dd>
          <dt>Created</dt>
          <dd>{{ formatDate(detailUnit.created_at) }}</dd>
          <dt>Updated</dt>
          <dd>{{ formatDate(detailUnit.updated_at) }}</dd>
          <dt>Unit number</dt>
          <dd class="ems-table__muted">{{ detailUnit.number }}</dd>
        </dl>

        <div class="ems-modal-actions">
          <button type="button" class="ems-btn ems-btn--ghost" @click="detailUnit = null">Close</button>
          <template v-if="canManage">
            <button type="button" class="ems-btn" @click="openCreate(detailUnit.number)">Add child</button>
            <button type="button" class="ems-btn" @click="openEdit(detailUnit)">Edit</button>
            <button
              type="button"
              class="ems-btn"
              :class="detailUnit.status === 'ACTIVE' ? 'ems-btn--danger-outline' : 'ems-btn--primary'"
              @click="requestStatus(detailUnit, detailUnit.status === 'ACTIVE' ? 'deactivate' : 'activate')"
            >
              {{ detailUnit.status === 'ACTIVE' ? 'Deactivate' : 'Activate' }}
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Status confirmation -->
    <div v-if="confirmState.open" class="ems-modal" role="dialog" aria-modal="true" aria-labelledby="ems-unit-confirm-title">
      <div class="ems-modal__overlay" @click="closeConfirm"></div>
      <div class="ems-panel ems-modal-panel">
        <h2 id="ems-unit-confirm-title" class="ems-panel__title" style="margin-bottom: 10px;">
          {{ confirmState.action === 'deactivate' ? 'Deactivate unit?' : 'Activate unit?' }}
        </h2>
        <p class="ems-small">
          <template v-if="confirmState.action === 'deactivate'">
            <strong>{{ confirmState.unit?.name }}</strong> will be marked inactive. Its children and existing
            assignments are preserved, but it will no longer be available as a parent. You can reactivate it later.
          </template>
          <template v-else>
            <strong>{{ confirmState.unit?.name }}</strong> will be marked active and available as a parent again.
          </template>
        </p>

        <div v-if="confirmState.error" class="ems-alert ems-alert--error" role="alert">
          {{ confirmState.error }}
        </div>

        <div class="ems-modal-actions">
          <button type="button" class="ems-btn ems-btn--ghost" :disabled="statusSaving" @click="closeConfirm">Cancel</button>
          <button
            type="button"
            class="ems-btn"
            :class="confirmState.action === 'deactivate' ? 'ems-btn--danger' : 'ems-btn--primary'"
            :disabled="statusSaving"
            @click="applyStatus"
          >
            {{ statusSaving ? 'Updating…' : confirmState.action === 'deactivate' ? 'Deactivate' : 'Activate' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useAbility } from '@casl/vue'

import api from '@/config/api.js'
import EmsContentPanel from '@/main/ems/components/EmsContentPanel.vue'
import EmsField from '@/main/ems/components/EmsField.vue'

const API = 'main/ems/organisation-units'
const { can } = useAbility()

const canManage = computed(
  () =>
    can('manage_ems_organisation', 'general') ||
    can('manage_ems_organisation', 'all') ||
    can('manage', 'all'),
)

const units = ref([])
const listState = ref('loading')
const listError = ref('')
const notice = ref(null)
const search = ref('')
const statusFilter = ref('ALL')
const expanded = ref(new Set())

const formOpen = ref(false)
const formMode = ref('create')
const formSaving = ref(false)
const form = reactive({ number: '', name: '', unit_type: '', code: '', parent_number: '' })
const formErrors = reactive({ name: '', unit_type: '', parent_number: '', general: '' })

const detailUnit = ref(null)
const confirmState = reactive({ open: false, unit: null, action: 'deactivate', error: '' })
const statusSaving = ref(false)

const unitMap = computed(() => new Map(units.value.map((unit) => [unit.number, unit])))
const unitTypes = computed(() =>
  [...new Set(units.value.map((unit) => (unit.unit_type || '').trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  ),
)
const isFiltering = computed(() => search.value.trim() !== '' || statusFilter.value !== 'ALL')

const filteredUnits = computed(() => {
  const term = search.value.trim().toLowerCase()
  return units.value.filter((unit) => {
    if (statusFilter.value !== 'ALL' && unit.status !== statusFilter.value) {
      return false
    }
    if (!term) {
      return true
    }
    return [unit.name, unit.code, unit.unit_type].some((value) =>
      String(value || '').toLowerCase().includes(term),
    )
  })
})

const treeRows = computed(() => {
  const byParent = new Map()
  for (const unit of units.value) {
    const parent = unit.parent_number && unitMap.value.has(unit.parent_number) ? unit.parent_number : ''
    if (!byParent.has(parent)) {
      byParent.set(parent, [])
    }
    byParent.get(parent).push(unit)
  }
  for (const list of byParent.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name))
  }

  const rows = []
  const seen = new Set()
  const walk = (parent, depth) => {
    for (const unit of byParent.get(parent) || []) {
      if (seen.has(unit.number)) {
        continue
      }
      seen.add(unit.number)
      const children = byParent.get(unit.number) || []
      rows.push({ unit, depth, hasChildren: children.length > 0, path: '' })
      if (children.length && isExpanded(unit.number)) {
        walk(unit.number, depth + 1)
      }
    }
  }
  walk('', 0)
  return rows
})

const flatRows = computed(() =>
  [...filteredUnits.value]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((unit) => ({ unit, depth: 0, hasChildren: false, path: pathOf(unit) })),
)

const displayRows = computed(() => (isFiltering.value ? flatRows.value : treeRows.value))

const allExpanded = computed(() => {
  const parents = units.value.filter((unit) => units.value.some((child) => child.parent_number === unit.number))
  return parents.length > 0 && parents.every((unit) => expanded.value.has(unit.number))
})

const parentOptions = computed(() =>
  units.value
    .filter(
      (unit) =>
        (unit.status === 'ACTIVE' || unit.number === form.parent_number) &&
        unit.number !== form.number &&
        !isDescendantOf(unit, form.number),
    )
    .sort((a, b) => a.name.localeCompare(b.name)),
)

function isExpanded(number) {
  return expanded.value.has(number)
}

function toggle(number) {
  const next = new Set(expanded.value)
  if (next.has(number)) {
    next.delete(number)
  } else {
    next.add(number)
  }
  expanded.value = next
}

function toggleAll() {
  if (allExpanded.value) {
    expanded.value = new Set()
    return
  }
  expanded.value = new Set(
    units.value
      .filter((unit) => units.value.some((child) => child.parent_number === unit.number))
      .map((unit) => unit.number),
  )
}

function isDescendantOf(candidate, ancestorNumber) {
  if (!ancestorNumber) {
    return false
  }
  let current = candidate
  let guard = 0
  while (current && guard < 200) {
    if (current.parent_number === ancestorNumber) {
      return true
    }
    current = unitMap.value.get(current.parent_number)
    guard += 1
  }
  return false
}

function pathOf(unit) {
  const parts = []
  let current = unitMap.value.get(unit.parent_number)
  let guard = 0
  while (current && guard < 200) {
    parts.unshift(current.name)
    current = unitMap.value.get(current.parent_number)
    guard += 1
  }
  return parts.join(' / ')
}

function parentName(unit) {
  const parent = unit?.parent_number ? unitMap.value.get(unit.parent_number) : null
  return parent ? parent.name : '—'
}

function statusClass(status) {
  return status === 'ACTIVE' ? 'ems-badge--ok' : 'ems-badge--muted'
}

function formatDate(value) {
  if (!value) {
    return '—'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function apiError(error, fallback) {
  const status = error?.response?.status
  const message = error?.response?.data?.message
  if (status === 401) {
    return 'Your session has expired. Please sign in again.'
  }
  if (status === 403) {
    return 'You do not have permission to perform this action.'
  }
  if (status === 404) {
    return 'This organisation unit was not found. It may have been removed.'
  }
  if (status === 409) {
    return message || 'The change conflicts with another record. Refresh and try again.'
  }
  if (status === 400) {
    return message || 'Please check the values and try again.'
  }
  return message || fallback
}

async function loadUnits() {
  listState.value = 'loading'
  listError.value = ''
  try {
    const response = await api.get(API, { timeout: 15000 })
    units.value = Array.isArray(response?.data?.data) ? response.data.data : []
    expanded.value = new Set(units.value.map((unit) => unit.number))
    listState.value = units.value.length ? 'ready' : 'empty'
  } catch (error) {
    listError.value = apiError(error, 'Could not load the organisation structure.')
    listState.value = 'error'
  }
}

function clearFilters() {
  search.value = ''
  statusFilter.value = 'ALL'
}

function resetFormErrors() {
  formErrors.name = ''
  formErrors.unit_type = ''
  formErrors.parent_number = ''
  formErrors.general = ''
}

function openCreate(parentNumber = '') {
  resetFormErrors()
  form.number = ''
  form.name = ''
  form.unit_type = ''
  form.code = ''
  form.parent_number = parentNumber
  formMode.value = 'create'
  formOpen.value = true
  detailUnit.value = null
}

function openEdit(unit) {
  resetFormErrors()
  if (!unit) {
    return
  }
  form.number = unit.number
  form.name = unit.name
  form.unit_type = unit.unit_type
  form.code = unit.code
  form.parent_number = unit.parent_number || ''
  formMode.value = 'edit'
  formOpen.value = true
  detailUnit.value = null
}

function closeForm() {
  if (formSaving.value) {
    return
  }
  formOpen.value = false
  resetFormErrors()
}

function validateForm() {
  resetFormErrors()
  let valid = true
  if (!form.name.trim()) {
    formErrors.name = 'Name is required.'
    valid = false
  }
  if (!form.unit_type.trim()) {
    formErrors.unit_type = 'Unit type is required.'
    valid = false
  }
  if (form.parent_number && form.parent_number === form.number) {
    formErrors.parent_number = 'A unit cannot be its own parent.'
    valid = false
  }
  return valid
}

async function saveUnit() {
  if (formSaving.value || !validateForm()) {
    return
  }

  formSaving.value = true
  notice.value = null
  const payload = {
    name: form.name.trim(),
    unit_type: form.unit_type.trim(),
    code: form.code.trim(),
    parent_number: form.parent_number || '',
  }

  try {
    let response
    if (formMode.value === 'create') {
      response = await api.post(API, payload, { timeout: 20000 })
    } else {
      response = await api.put(`${API}/${form.number}`, payload, { timeout: 20000 })
    }
    const saved = response?.data?.data
    formOpen.value = false
    notice.value = {
      ok: true,
      text: formMode.value === 'create' ? 'Organisation unit created.' : 'Organisation unit updated.',
    }
    await loadUnits()
    if (saved?.number) {
      const next = new Set(expanded.value)
      next.add(saved.number)
      if (saved.parent_number) {
        next.add(saved.parent_number)
      }
      expanded.value = next
    }
  } catch (error) {
    formErrors.general = apiError(error, 'Could not save the organisation unit.')
  } finally {
    formSaving.value = false
  }
}

function requestStatus(unit, action) {
  confirmState.open = true
  confirmState.unit = unit
  confirmState.action = action
  confirmState.error = ''
  detailUnit.value = null
}

function closeConfirm() {
  if (statusSaving.value) {
    return
  }
  confirmState.open = false
  confirmState.unit = null
  confirmState.error = ''
}

async function applyStatus() {
  if (statusSaving.value || !confirmState.unit) {
    return
  }
  statusSaving.value = true
  confirmState.error = ''
  const target = confirmState.unit
  const nextStatus = confirmState.action === 'deactivate' ? 'INACTIVE' : 'ACTIVE'
  try {
    await api.patch(`${API}/${target.number}/status`, { status: nextStatus }, { timeout: 15000 })
    confirmState.open = false
    notice.value = {
      ok: true,
      text: nextStatus === 'ACTIVE' ? 'Organisation unit activated.' : 'Organisation unit deactivated.',
    }
    await loadUnits()
  } catch (error) {
    confirmState.error = apiError(error, 'Could not update the unit status.')
  } finally {
    statusSaving.value = false
  }
}

function openDetails(unit) {
  detailUnit.value = unit
}

onMounted(loadUnits)
</script>

<style scoped>
.ems-unit-scroll {
  overflow-x: auto;
}

.ems-unit-table {
  min-width: 560px;
}

.ems-unit-name {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.ems-unit-link {
  border: 0;
  background: transparent;
  padding: 0;
  font: inherit;
  font-weight: 600;
  color: var(--ems-ink);
  cursor: pointer;
  text-align: left;
}

.ems-unit-link:hover {
  color: var(--ems-brand);
  text-decoration: underline;
}

.ems-tree-toggle {
  border: 0;
  background: transparent;
  padding: 2px 4px;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
}

.ems-tree-toggle:hover {
  background: #eef2fb;
  color: var(--ems-brand);
}

.ems-tree-spacer {
  display: inline-block;
  width: 22px;
  flex: none;
}

.ems-unit-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.ems-unit-actions-head {
  white-space: nowrap;
}

.ems-modal-panel {
  width: min(560px, 100%);
  margin: 0;
  padding: 18px;
}

.ems-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.ems-btn--danger {
  background: #b3261e;
  border-color: #b3261e;
  color: #fff;
}

.ems-btn--danger:hover {
  background: #9d211a;
  border-color: #9d211a;
}

.ems-btn--danger-outline {
  background: #fff;
  border-color: #e2a3a3;
  color: #b3261e;
}

.ems-btn--danger-outline:hover {
  background: #fff6f6;
  border-color: #b3261e;
}

@media (max-width: 640px) {
  .ems-unit-table th:nth-child(3),
  .ems-unit-table td:nth-child(3) {
    display: none;
  }

  .ems-modal-panel {
    padding: 14px;
  }
}
</style>

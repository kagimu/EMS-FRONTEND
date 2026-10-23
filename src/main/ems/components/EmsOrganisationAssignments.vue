<template>
  <EmsContentPanel
    title="Assignments"
    icon="bi bi-person-badge"
    description="Where people operate in the organisation and in what capacity. Assignments grant no system permissions."
    :count="assignments.length"
    count-noun="assignment"
    count-noun-plural="assignments"
    :state="listState"
    :error-message="listError"
  >
    <template #actions>
      <button type="button" class="ems-btn ems-btn--ghost" :disabled="listState === 'loading'" @click="load">
        Refresh
      </button>
      <button v-if="canManage" type="button" class="ems-btn ems-btn--primary" @click="openCreate">
        New assignment
      </button>
    </template>

    <template #empty>
      <p class="ems-empty__title">No assignments recorded yet</p>
      <p class="ems-empty__msg">
        Assign an existing person to an active organisation unit and record their position title. People must
        already have EMS user accounts.
      </p>
      <div v-if="canManage && activeUnits.length" class="ems-actions" style="justify-content: center; margin-top: 14px;">
        <button type="button" class="ems-btn ems-btn--primary" @click="openCreate">Create the first assignment</button>
      </div>
      <div v-else-if="canManage && !unitsError" class="ems-actions" style="justify-content: center; margin-top: 14px;">
        <router-link
          class="ems-btn ems-btn--primary"
          :to="{ path: '/ems/organisation', query: { tab: 'structure' } }"
        >
          Create or activate an organisation unit
        </router-link>
      </div>
      <p v-else-if="unitsError" class="ems-small ems-muted">{{ unitsError }}</p>
    </template>

    <div v-if="listState === 'ready'" class="ems-form">
      <div v-if="notice" class="ems-alert" :class="notice.ok ? 'ems-alert--success' : 'ems-alert--error'" role="status">
        {{ notice.text }}
      </div>

      <p v-if="!canManage" class="ems-small ems-muted">
        You can view assignments. Creating, editing and changing status requires the assignment management
        permission.
      </p>

      <p class="ems-small ems-muted">
        An assignment connects a person to an organisation unit and position title. A position title is a job
        title, not a software role; one person can have several assignments. Create units and user accounts first.
      </p>

      <p v-if="unitsError" class="ems-small ems-muted">{{ unitsError }}</p>

      <div class="ems-toolbar">
        <label class="ems-search">
          <i class="bi bi-search" aria-hidden="true"></i>
          <input
            v-model="search"
            type="search"
            placeholder="Search by user number, position or unit"
            aria-label="Search assignments"
          />
        </label>
        <select v-model="unitFilter" class="ems-select" aria-label="Filter by organisation unit">
          <option value="ALL">All units</option>
          <option v-for="unit in units" :key="unit.number" :value="unit.number">{{ unit.name }}</option>
        </select>
        <select v-model="typeFilter" class="ems-select" aria-label="Filter by assignment type">
          <option value="ALL">All types</option>
          <option v-for="type in assignmentTypeOptions" :key="type.value" :value="type.value">{{ type.label }}</option>
        </select>
        <select v-model="statusFilter" class="ems-select" aria-label="Filter by status">
          <option value="ALL">All statuses</option>
          <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
        </select>
        <button v-if="isFiltering" type="button" class="ems-btn ems-btn--ghost" @click="clearFilters">
          Clear filters
        </button>
      </div>

      <p class="ems-small ems-muted">
        An assignment records a placement and position title only. It does not create a user, grant a system
        role, or confer decision-making authority. The person is immutable on edit; end the assignment and create
        a new one to change the person.
      </p>

      <div v-if="!filteredAssignments.length" class="ems-empty">
        <p class="ems-empty__title">No assignments match your filters</p>
        <p class="ems-empty__msg">Try a different search, unit, type or status.</p>
      </div>

      <div v-else class="ems-table-scroll">
        <table class="ems-table ems-assignment-table">
          <thead>
            <tr>
              <th scope="col">Person</th>
              <th scope="col">Unit</th>
              <th scope="col">Assignment</th>
              <th scope="col">Position</th>
              <th scope="col">Status</th>
              <th scope="col">Validity</th>
              <th scope="col" class="ems-assignment-actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredAssignments" :key="item.number">
              <td>
                <button type="button" class="ems-link ems-assignment-link" @click="openDetails(item)">
                  {{ item.user_number }}
                </button>
              </td>
              <td>
                {{ unitLabel(item.organisation_unit_number) }}
                <div v-if="unitIsInactive(item.organisation_unit_number)" class="ems-small ems-muted">inactive unit</div>
              </td>
              <td>{{ assignmentTypeLabel(item.assignment_type) }}</td>
              <td>{{ item.position_title || '—' }}</td>
              <td>
                <span class="ems-badge" :class="statusClass(item.status)">{{ item.status }}</span>
              </td>
              <td class="ems-small ems-muted">{{ validity(item) }}</td>
              <td>
                <div class="ems-assignment-actions">
                  <button type="button" class="ems-link" @click="openDetails(item)">View</button>
                  <template v-if="canManage">
                    <button type="button" class="ems-link" @click="openEdit(item)">Edit</button>
                    <button
                      v-if="item.status !== 'ACTIVE'"
                      type="button"
                      class="ems-link"
                      @click="requestStatus(item, 'ACTIVE')"
                    >
                      Activate
                    </button>
                    <template v-else>
                      <button type="button" class="ems-link" @click="requestStatus(item, 'INACTIVE')">
                        Deactivate
                      </button>
                      <button type="button" class="ems-link" @click="requestStatus(item, 'ENDED')">End</button>
                    </template>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </EmsContentPanel>

  <!-- Create / edit assignment -->
  <EmsModal
    :open="formOpen"
    :title="formMode === 'create' ? 'New assignment' : 'Edit assignment'"
    icon="bi bi-person-badge"
    @close="closeForm"
  >
    <div class="ems-form">
      <label v-if="formMode === 'create'" class="ems-field">
        <span class="ems-field__label">User number<span class="ems-field__req">*</span></span>
        <span class="ems-field__control" :class="{ 'ems-field__control--error': !!formErrors.user_number }">
          <input
            v-model.trim="form.user_number"
            class="ems-field__input"
            list="ems-assignment-user-options"
            placeholder="Existing EMS user number"
            autocomplete="off"
          />
        </span>
        <datalist id="ems-assignment-user-options">
          <option v-for="user in userSuggestions" :key="user" :value="user"></option>
        </datalist>
        <span v-if="formErrors.user_number" class="ems-field__error">{{ formErrors.user_number }}</span>
        <span v-else class="ems-small ems-muted">
          The user must already exist. This does not create a login or change membership.
        </span>
      </label>

      <div v-else class="ems-kv-card" style="margin-bottom: 8px;">
        <dt>Person</dt>
        <dd>{{ form.user_number }}</dd>
      </div>

      <label class="ems-field">
        <span class="ems-field__label">Organisation unit<span class="ems-field__req">*</span></span>
        <span class="ems-field__control" :class="{ 'ems-field__control--error': !!formErrors.unit }">
          <select v-model="form.organisation_unit_number" class="ems-field__input">
            <option value="">— Select an active unit —</option>
            <option v-for="unit in formUnitOptions" :key="unit.number" :value="unit.number">
              {{ unit.name }}{{ unit.code ? ` (${unit.code})` : '' }}{{ unit.status === 'INACTIVE' ? ' — inactive' : '' }}
            </option>
          </select>
        </span>
        <span v-if="formErrors.unit" class="ems-field__error">{{ formErrors.unit }}</span>
        <span v-else-if="formMode === 'edit' && unitIsInactive(form.organisation_unit_number)" class="ems-small ems-muted">
          The current unit is inactive. Select an active unit to save changes.
        </span>
        <span v-else class="ems-small ems-muted">Only active units can receive a new assignment.</span>
      </label>

      <label class="ems-field">
        <span class="ems-field__label">Assignment type<span class="ems-field__req">*</span></span>
        <span class="ems-field__control" :class="{ 'ems-field__control--error': !!formErrors.assignment_type }">
          <input
            v-model.trim="form.assignment_type"
            class="ems-field__input"
            list="ems-assignment-type-options"
            placeholder="e.g. Manager, Deputy Head, Coordinator"
            maxlength="30"
            autocomplete="off"
          />
        </span>
        <datalist id="ems-assignment-type-options">
          <option v-for="type in assignmentTypeOptions" :key="type.value" :value="type.value">{{ type.label }}</option>
        </datalist>
        <span v-if="formErrors.assignment_type" class="ems-field__error">{{ formErrors.assignment_type }}</span>
        <span v-else class="ems-small ems-muted">Choose a suggestion or type a custom assignment title.</span>
      </label>

      <EmsField v-model="form.position_title" label="Position title (optional)" placeholder="e.g. Operations Manager" />

      <div class="ems-toolbar">
        <label class="ems-field">
          <span class="ems-field__label">Valid from (optional)</span>
          <span class="ems-field__control">
            <input v-model="form.valid_from" class="ems-field__input" type="date" />
          </span>
        </label>
        <label class="ems-field">
          <span class="ems-field__label">Valid to (optional)</span>
          <span class="ems-field__control" :class="{ 'ems-field__control--error': !!formErrors.dates }">
            <input v-model="form.valid_to" class="ems-field__input" type="date" />
          </span>
          <span v-if="formErrors.dates" class="ems-field__error">{{ formErrors.dates }}</span>
        </label>
      </div>

      <div v-if="formErrors.general" class="ems-alert ems-alert--error" role="alert">
        {{ formErrors.general }}
      </div>
    </div>

    <template #actions>
      <button type="button" class="ems-btn ems-btn--ghost" :disabled="formSaving" @click="closeForm">Cancel</button>
      <button type="button" class="ems-btn ems-btn--primary" :disabled="formSaving" @click="save">
        {{ formSaving ? 'Saving…' : formMode === 'create' ? 'Create assignment' : 'Save changes' }}
      </button>
    </template>
  </EmsModal>

  <!-- Details -->
  <EmsModal :open="!!detailItem" title="Assignment details" icon="bi bi-person-badge" @close="detailItem = null">
    <dl v-if="detailItem" class="ems-kv-card">
      <dt>User number</dt>
      <dd>{{ detailItem.user_number }}</dd>
      <dt>Organisation unit</dt>
      <dd>
        {{ unitLabel(detailItem.organisation_unit_number) }}
        <span v-if="unitIsInactive(detailItem.organisation_unit_number)" class="ems-badge ems-badge--warn">inactive</span>
      </dd>
      <dt>Assignment type</dt>
      <dd>{{ assignmentTypeLabel(detailItem.assignment_type) }}</dd>
      <dt>Position title</dt>
      <dd>{{ detailItem.position_title || '—' }}</dd>
      <dt>Status</dt>
      <dd><span class="ems-badge" :class="statusClass(detailItem.status)">{{ detailItem.status }}</span></dd>
      <dt>Valid from</dt>
      <dd>{{ formatDate(detailItem.valid_from) }}</dd>
      <dt>Valid to</dt>
      <dd>{{ formatDate(detailItem.valid_to) }}</dd>
      <dt>Recorded</dt>
      <dd>{{ formatDate(detailItem.created_at) }}</dd>
      <dt>Record number</dt>
      <dd class="ems-table__muted">{{ detailItem.number }}</dd>
    </dl>

    <template #actions>
      <button type="button" class="ems-btn ems-btn--ghost" @click="detailItem = null">Close</button>
      <template v-if="canManage && detailItem">
        <button type="button" class="ems-btn" @click="openEdit(detailItem)">Edit</button>
        <button
          v-if="detailItem.status !== 'ACTIVE'"
          type="button"
          class="ems-btn ems-btn--primary"
          @click="requestStatus(detailItem, 'ACTIVE')"
        >
          Activate
        </button>
        <template v-else>
          <button type="button" class="ems-btn" @click="requestStatus(detailItem, 'INACTIVE')">Deactivate</button>
          <button type="button" class="ems-btn ems-btn--danger-outline" @click="requestStatus(detailItem, 'ENDED')">End</button>
        </template>
      </template>
    </template>
  </EmsModal>

  <!-- Status confirmation -->
  <EmsModal :open="confirmState.open" :title="confirmTitle" icon="bi bi-exclamation-circle" @close="closeConfirm">
    <p class="ems-small">
      <template v-if="confirmState.status === 'ACTIVE'">
        Activate this assignment for <strong>{{ confirmState.item?.user_number }}</strong>? The server re-checks
        duplicate active assignments.
      </template>
      <template v-else-if="confirmState.status === 'INACTIVE'">
        Mark this assignment for <strong>{{ confirmState.item?.user_number }}</strong> as inactive? The record is
        retained.
      </template>
      <template v-else>
        End this assignment for <strong>{{ confirmState.item?.user_number }}</strong>? The record is retained for
        history. This does not change the person's stakeholder or login status.
      </template>
    </p>
    <div v-if="confirmState.error" class="ems-alert ems-alert--error" role="alert">
      {{ confirmState.error }}
    </div>

    <template #actions>
      <button type="button" class="ems-btn ems-btn--ghost" :disabled="statusSaving" @click="closeConfirm">Cancel</button>
      <button
        type="button"
        class="ems-btn"
        :class="confirmState.status === 'ACTIVE' ? 'ems-btn--primary' : 'ems-btn--danger'"
        :disabled="statusSaving"
        @click="applyStatus"
      >
        {{ statusSaving ? 'Updating…' : confirmTitle }}
      </button>
    </template>
  </EmsModal>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useAbility } from '@casl/vue'
import { useRoute, useRouter } from 'vue-router'

import api from '@/config/api.js'
import EmsContentPanel from '@/main/ems/components/EmsContentPanel.vue'
import EmsField from '@/main/ems/components/EmsField.vue'
import EmsModal from '@/main/ems/components/EmsModal.vue'

const API = 'main/ems/user-assignments'
const UNITS_API = 'main/ems/organisation-units'
const STAKEHOLDERS_API = 'main/ems/stakeholders'
const route = useRoute()
const router = useRouter()
const { can } = useAbility()

const canManage = computed(
  () =>
    can('manage_ems_assignments', 'general') ||
    can('manage_ems_assignments', 'all') ||
    can('manage', 'all'),
)

const assignmentTypes = [
  { value: 'member', label: 'Member' },
  { value: 'manager', label: 'Manager' },
  { value: 'head', label: 'Head' },
  { value: 'staff', label: 'Staff' },
]
const statuses = ['ACTIVE', 'INACTIVE', 'ENDED']

const assignments = ref([])
const units = ref([])
const stakeholderUsers = ref([])
const listState = ref('loading')
const listError = ref('')
const unitsError = ref('')
const notice = ref(null)

const search = ref('')
const unitFilter = ref('ALL')
const typeFilter = ref('ALL')
const statusFilter = ref('ALL')

const formOpen = ref(false)
const formMode = ref('create')
const formSaving = ref(false)
const form = reactive({
  number: '',
  user_number: '',
  organisation_unit_number: '',
  assignment_type: 'member',
  position_title: '',
  valid_from: '',
  valid_to: '',
})
const formErrors = reactive({ user_number: '', unit: '', assignment_type: '', dates: '', general: '' })

const detailItem = ref(null)
const confirmState = reactive({ open: false, item: null, status: 'INACTIVE', error: '' })
const statusSaving = ref(false)

const unitMap = computed(() => new Map(units.value.map((unit) => [unit.number, unit])))
const activeUnits = computed(() => units.value.filter((unit) => unit.status === 'ACTIVE'))

const assignmentTypeOptions = computed(() => {
  const options = new Map(assignmentTypes.map((type) => [type.value, type.label]))
  for (const item of assignments.value) {
    const value = String(item.assignment_type || '').trim()
    if (value && !options.has(value)) {
      options.set(value, humanize(value))
    }
  }
  return [...options.entries()].map(([value, label]) => ({ value, label }))
})

const userSuggestions = computed(() =>
  [
    ...new Set(
      [...assignments.value.map((item) => item.user_number), ...stakeholderUsers.value]
        .map((value) => String(value || '').trim())
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b)),
)
const isFiltering = computed(
  () =>
    search.value.trim() !== '' ||
    unitFilter.value !== 'ALL' ||
    typeFilter.value !== 'ALL' ||
    statusFilter.value !== 'ALL',
)
const formUnitOptions = computed(() => {
  const options = [...activeUnits.value]
  if (form.organisation_unit_number && !options.some((unit) => unit.number === form.organisation_unit_number)) {
    const current = unitMap.value.get(form.organisation_unit_number)
    options.push(
      current || {
        number: form.organisation_unit_number,
        name: form.organisation_unit_number,
        status: 'UNKNOWN',
      },
    )
  }
  return options
})

const filteredAssignments = computed(() => {
  const term = search.value.trim().toLowerCase()
  return assignments.value.filter((item) => {
    if (unitFilter.value !== 'ALL' && item.organisation_unit_number !== unitFilter.value) {
      return false
    }
    if (typeFilter.value !== 'ALL' && item.assignment_type !== typeFilter.value) {
      return false
    }
    if (statusFilter.value !== 'ALL' && item.status !== statusFilter.value) {
      return false
    }
    if (!term) {
      return true
    }
    return [item.user_number, item.position_title, unitLabel(item.organisation_unit_number), item.assignment_type].some(
      (value) => String(value || '').toLowerCase().includes(term),
    )
  })
})

const confirmTitle = computed(() => {
  if (confirmState.status === 'ACTIVE') return 'Activate assignment'
  if (confirmState.status === 'ENDED') return 'End assignment'
  return 'Deactivate assignment'
})

function humanize(value) {
  return String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (character) => character.toUpperCase())
}

function assignmentTypeLabel(value) {
  const known = assignmentTypes.find((type) => type.value === value)
  if (known) {
    return known.label
  }
  return value ? humanize(value) : '—'
}

function statusClass(status) {
  if (status === 'ACTIVE') return 'ems-badge--ok'
  if (status === 'INACTIVE') return 'ems-badge--warn'
  return 'ems-badge--muted'
}

function unitLabel(number) {
  return unitMap.value.get(number)?.name || number || '—'
}

function unitIsInactive(number) {
  const unit = unitMap.value.get(number)
  return !!unit && unit.status !== 'ACTIVE'
}

function validity(item) {
  if (!item.valid_from && !item.valid_to) {
    return 'No time limit'
  }
  return `${formatDate(item.valid_from)} – ${formatDate(item.valid_to)}`
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

function toIso(value) {
  if (!value) {
    return null
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function toDateInput(value) {
  if (!value) {
    return ''
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

function apiError(error, fallback) {
  const status = error?.response?.status
  const message = error?.response?.data?.message
  if (status === 401) return 'Your session has expired. Please sign in again.'
  if (status === 403) return 'You do not have permission to perform this action.'
  if (status === 404) return message || 'The assignment was not found.'
  if (status === 409) return message || 'The change conflicts with another record.'
  if (status === 400) return message || 'Please check the values and try again.'
  return message || fallback
}

async function load() {
  listState.value = 'loading'
  listError.value = ''
  unitsError.value = ''
  try {
    const [assignmentsResult, unitsResult, stakeholdersResult] = await Promise.allSettled([
      api.get(API, { timeout: 15000 }),
      api.get(UNITS_API, { timeout: 15000 }),
      api.get(STAKEHOLDERS_API, { timeout: 15000 }),
    ])

    if (assignmentsResult.status === 'rejected') {
      throw assignmentsResult.reason
    }
    assignments.value = Array.isArray(assignmentsResult.value?.data?.data)
      ? assignmentsResult.value.data.data
      : []

    if (unitsResult.status === 'fulfilled') {
      units.value = Array.isArray(unitsResult.value?.data?.data) ? unitsResult.value.data.data : []
    } else {
      units.value = []
      unitsError.value = 'Organisation units could not be loaded; unit names may be shown as numbers.'
    }

    if (stakeholdersResult.status === 'fulfilled') {
      const stakeholders = Array.isArray(stakeholdersResult.value?.data?.data)
        ? stakeholdersResult.value.data.data
        : []
      stakeholderUsers.value = stakeholders
        .filter((item) => item.status === 'ACTIVE')
        .map((item) => item.user_number)
        .filter(Boolean)
    } else {
      stakeholderUsers.value = []
    }

    listState.value = assignments.value.length ? 'ready' : 'empty'
  } catch (error) {
    listError.value = apiError(error, 'Could not load assignments.')
    listState.value = 'error'
  }
}

function clearFilters() {
  search.value = ''
  unitFilter.value = 'ALL'
  typeFilter.value = 'ALL'
  statusFilter.value = 'ALL'
}

function resetFormErrors() {
  formErrors.user_number = ''
  formErrors.unit = ''
  formErrors.assignment_type = ''
  formErrors.dates = ''
  formErrors.general = ''
}

function openCreate() {
  if (!activeUnits.value.length) {
    notice.value = {
      ok: false,
      text:
        unitsError.value ||
        'Create an active organisation unit before assigning people.',
    }
    return
  }
  resetFormErrors()
  form.number = ''
  form.user_number = ''
  form.organisation_unit_number = ''
  form.assignment_type = 'member'
  form.position_title = ''
  form.valid_from = ''
  form.valid_to = ''
  formMode.value = 'create'
  formOpen.value = true
  detailItem.value = null
}

function openEdit(item) {
  resetFormErrors()
  form.number = item.number
  form.user_number = item.user_number
  form.organisation_unit_number = item.organisation_unit_number
  form.assignment_type = item.assignment_type
  form.position_title = item.position_title || ''
  form.valid_from = toDateInput(item.valid_from)
  form.valid_to = toDateInput(item.valid_to)
  formMode.value = 'edit'
  formOpen.value = true
  detailItem.value = null
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

  if (formMode.value === 'create' && !form.user_number.trim()) {
    formErrors.user_number = 'User number is required.'
    valid = false
  }
  if (!form.organisation_unit_number) {
    formErrors.unit = 'Select an organisation unit.'
    valid = false
  }
  if (!form.assignment_type || !form.assignment_type.trim()) {
    formErrors.assignment_type = 'Assignment type is required.'
    valid = false
  } else if (form.assignment_type.trim().length > 30) {
    formErrors.assignment_type = 'Use 30 characters or fewer.'
    valid = false
  }
  if (form.valid_from && form.valid_to) {
    if (new Date(form.valid_from).getTime() > new Date(form.valid_to).getTime()) {
      formErrors.dates = 'Valid from cannot be after valid to.'
      valid = false
    }
  }
  return valid
}

async function save() {
  if (formSaving.value || !validateForm()) {
    return
  }

  formSaving.value = true
  notice.value = null

  const payload = {
    organisation_unit_number: form.organisation_unit_number,
    assignment_type: form.assignment_type.trim(),
    position_title: form.position_title.trim(),
    valid_from: toIso(form.valid_from),
    valid_to: toIso(form.valid_to),
  }

  try {
    if (formMode.value === 'create') {
      payload.user_number = form.user_number.trim()
      await api.post(API, payload, { timeout: 20000 })
    } else {
      await api.put(`${API}/${form.number}`, payload, { timeout: 20000 })
    }
    formOpen.value = false
    notice.value = {
      ok: true,
      text: formMode.value === 'create' ? 'Assignment created.' : 'Assignment updated.',
    }
    await load()
  } catch (error) {
    formErrors.general = apiError(error, 'Could not save the assignment.')
  } finally {
    formSaving.value = false
  }
}

function requestStatus(item, status) {
  confirmState.open = true
  confirmState.item = item
  confirmState.status = status
  confirmState.error = ''
  detailItem.value = null
}

function closeConfirm() {
  if (statusSaving.value) {
    return
  }
  confirmState.open = false
  confirmState.item = null
  confirmState.error = ''
}

async function applyStatus() {
  if (statusSaving.value || !confirmState.item) {
    return
  }
  statusSaving.value = true
  confirmState.error = ''
  const item = confirmState.item
  try {
    await api.patch(`${API}/${item.number}/status`, { status: confirmState.status }, { timeout: 15000 })
    confirmState.open = false
    notice.value = {
      ok: true,
      text:
        confirmState.status === 'ACTIVE'
          ? 'Assignment activated.'
          : confirmState.status === 'ENDED'
            ? 'Assignment ended.'
            : 'Assignment deactivated.',
    }
    await load()
  } catch (error) {
    confirmState.error = apiError(error, 'Could not change the assignment status.')
  } finally {
    statusSaving.value = false
  }
}

function openDetails(item) {
  detailItem.value = item
}

onMounted(async () => {
  await load()

  if (!canManage.value) {
    return
  }
  const requestedUser = String(route.query.user || '').trim()
  if (requestedUser && activeUnits.value.length) {
    openCreate()
    form.user_number = requestedUser
    router.replace({ query: { ...route.query, user: undefined } })
  }
})
</script>

<style scoped>
.ems-table-scroll {
  overflow-x: auto;
}

.ems-assignment-table {
  min-width: 780px;
}

.ems-assignment-link {
  border: 0;
  background: transparent;
  padding: 0;
  font: inherit;
  font-weight: 600;
  color: var(--ems-ink);
  cursor: pointer;
  text-align: left;
}

.ems-assignment-link:hover {
  color: var(--ems-brand);
  text-decoration: underline;
}

.ems-assignment-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.ems-assignment-actions-head {
  white-space: nowrap;
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
</style>

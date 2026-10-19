<template>
  <EmsContentPanel
    title="People & ownership"
    icon="bi bi-people"
    description="Stakeholders, owners and their effective dates for your current organisation."
    :count="items.length"
    count-noun="record"
    count-noun-plural="records"
    :state="listState"
    :error-message="listError"
  >
    <template #actions>
      <button type="button" class="ems-btn ems-btn--ghost" :disabled="listState === 'loading'" @click="load">
        Refresh
      </button>
      <template v-if="canManage">
        <button type="button" class="ems-btn" @click="openCreate('staff')">Add person</button>
        <button type="button" class="ems-btn ems-btn--primary" @click="openCreate('owner')">Add owner</button>
      </template>
    </template>

    <template #empty>
      <p class="ems-empty__title">No stakeholders recorded yet</p>
      <p class="ems-empty__msg">
        Record the people who own, govern, work for or relate to your organisation.
      </p>
      <div v-if="canManage" class="ems-actions" style="justify-content: center; margin-top: 14px;">
        <button type="button" class="ems-btn" @click="openCreate('staff')">Add the first person</button>
        <button type="button" class="ems-btn ems-btn--primary" @click="openCreate('owner')">Add an owner</button>
      </div>
    </template>

    <div v-if="listState === 'ready'" class="ems-form">
      <div v-if="notice" class="ems-alert" :class="notice.ok ? 'ems-alert--success' : 'ems-alert--error'" role="status">
        {{ notice.text }}
      </div>

      <p v-if="!canManage" class="ems-small ems-muted">
        You can view stakeholders. Creating, editing and changing status requires the stakeholder management
        permission.
      </p>

      <div class="ems-kpis">
        <div class="ems-kpi ems-kpi--ok">
          <span class="ems-kpi__label">Effective owners</span>
          <strong class="ems-kpi__value">{{ summary.effective }}</strong>
        </div>
        <div class="ems-kpi ems-kpi--warn">
          <span class="ems-kpi__label">Ownership not started</span>
          <strong class="ems-kpi__value">{{ summary.upcoming }}</strong>
        </div>
        <div class="ems-kpi ems-kpi--danger">
          <span class="ems-kpi__label">Ownership ended</span>
          <strong class="ems-kpi__value">{{ summary.expired }}</strong>
        </div>
        <div class="ems-kpi ems-kpi--muted">
          <span class="ems-kpi__label">Inactive / ended records</span>
          <strong class="ems-kpi__value">{{ summary.inactive }}</strong>
        </div>
      </div>

      <div class="ems-toolbar">
        <label class="ems-search">
          <i class="bi bi-search" aria-hidden="true"></i>
          <input
            v-model="search"
            type="search"
            placeholder="Search by user number or title"
            aria-label="Search stakeholders"
          />
        </label>
        <select v-model="typeFilter" class="ems-select" aria-label="Filter by stakeholder type">
          <option value="ALL">All types</option>
          <option v-for="type in stakeholderTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
        </select>
        <select v-model="statusFilter" class="ems-select" aria-label="Filter by status">
          <option value="ALL">All statuses</option>
          <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
        </select>
        <button type="button" class="ems-btn ems-btn--ghost" @click="toggleOwnersOnly">
          {{ typeFilter === 'owner' ? 'Show all types' : 'Owners only' }}
        </button>
        <button v-if="isFiltering" type="button" class="ems-btn ems-btn--ghost" @click="clearFilters">
          Clear filters
        </button>
      </div>

      <p class="ems-small ems-muted">
        The table shows each person's name from the identity record. Contact details and login data are not
        exposed by the EMS stakeholder API. Ownership is a stakeholder record, not a system role.
      </p>

      <div v-if="!filteredItems.length" class="ems-empty">
        <p class="ems-empty__title">No records match your filters</p>
        <p class="ems-empty__msg">Try a different search, type or status.</p>
      </div>

      <div v-else class="ems-table-scroll">
        <table class="ems-table ems-people-table">
          <thead>
            <tr>
              <th scope="col">Person</th>
              <th scope="col">Type</th>
              <th scope="col">Status</th>
              <th scope="col">Ownership</th>
              <th scope="col">Validity</th>
              <th scope="col">Shares</th>
              <th scope="col" class="ems-people-actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.number">
              <td>
                <button type="button" class="ems-link ems-people-link" @click="openDetails(item)">
                  {{ item.display_name || item.user_number }}
                </button>
                <div v-if="item.display_name" class="ems-small ems-muted">{{ item.user_number }}</div>
                <div v-if="item.title" class="ems-small ems-muted">{{ item.title }}</div>
              </td>
              <td>{{ typeLabel(item.stakeholder_type) }}</td>
              <td>
                <span class="ems-badge" :class="statusClass(item.status)">{{ item.status }}</span>
              </td>
              <td>
                <span
                  v-if="item.stakeholder_type === 'owner'"
                  class="ems-badge"
                  :class="ownershipClass(item)"
                >
                  {{ ownershipLabel(item) }}
                </span>
                <span v-else class="ems-table__muted">—</span>
              </td>
              <td class="ems-small ems-muted">{{ validity(item) }}</td>
              <td class="ems-small ems-muted">{{ shares(item) }}</td>
              <td>
                <div class="ems-people-actions">
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

  <!-- Create / edit stakeholder -->
  <EmsModal
    :open="formOpen"
    :title="formMode === 'create' ? 'Add stakeholder' : 'Edit stakeholder'"
    icon="bi bi-person-plus"
    @close="closeForm"
  >
    <div class="ems-form">
      <label v-if="formMode === 'create'" class="ems-field">
        <span class="ems-field__label">User number<span class="ems-field__req">*</span></span>
        <span class="ems-field__control" :class="{ 'ems-field__control--error': !!formErrors.user_number }">
          <input
            v-model.trim="form.user_number"
            class="ems-field__input"
            list="ems-people-user-options"
            placeholder="Existing EMS user number"
            autocomplete="off"
          />
        </span>
        <datalist id="ems-people-user-options">
          <option v-for="user in userSuggestions" :key="user" :value="user"></option>
        </datalist>
        <span v-if="formErrors.user_number" class="ems-field__error">{{ formErrors.user_number }}</span>
        <span v-else class="ems-small ems-muted">
          The user must already exist. Membership and login are separate from this stakeholder record.
        </span>
      </label>

      <label v-if="formMode === 'create'" class="ems-field">
        <span class="ems-field__label">Stakeholder type<span class="ems-field__req">*</span></span>
        <span class="ems-field__control">
          <select v-model="form.stakeholder_type" class="ems-field__input">
            <option v-for="type in stakeholderTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
          </select>
        </span>
        <span class="ems-small ems-muted">The person and type cannot be changed after creation.</span>
      </label>

      <div v-else class="ems-kv-card" style="margin-bottom: 8px;">
        <dt>Person</dt>
        <dd>{{ form.user_number }}</dd>
        <dt>Type</dt>
        <dd>{{ typeLabel(form.stakeholder_type) }}</dd>
      </div>

      <EmsField v-model="form.title" label="Title / role description" placeholder="e.g. Chairperson" :error="formErrors.title" />

      <div class="ems-toolbar">
        <EmsField
          v-model="form.share_percentage"
          label="Share percentage (optional)"
          type="number"
          inputmode="decimal"
          :error="formErrors.share_percentage"
        />
        <EmsField
          v-model="form.shares"
          label="Shares (optional)"
          type="number"
          inputmode="numeric"
          :error="formErrors.shares"
        />
      </div>

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

      <p class="ems-small ems-muted">
        Leaving the validity dates empty means the record has no time limit. Owners are effective only while
        their status is ACTIVE and today is within the validity window.
      </p>

      <div v-if="formErrors.general" class="ems-alert ems-alert--error" role="alert">
        {{ formErrors.general }}
      </div>
    </div>

    <template #actions>
      <button type="button" class="ems-btn ems-btn--ghost" :disabled="formSaving" @click="closeForm">Cancel</button>
      <button type="button" class="ems-btn ems-btn--primary" :disabled="formSaving" @click="save">
        {{ formSaving ? 'Saving…' : formMode === 'create' ? 'Add stakeholder' : 'Save changes' }}
      </button>
    </template>
  </EmsModal>

  <!-- Details -->
  <EmsModal :open="!!detailItem" title="Stakeholder details" icon="bi bi-person" @close="detailItem = null">
    <dl v-if="detailItem" class="ems-kv-card">
      <dt>Name</dt>
      <dd>{{ detailItem.display_name || '—' }}</dd>
      <dt>User number</dt>
      <dd>{{ detailItem.user_number }}</dd>
      <dt>Type</dt>
      <dd>{{ typeLabel(detailItem.stakeholder_type) }}</dd>
      <dt>Title</dt>
      <dd>{{ detailItem.title || '—' }}</dd>
      <dt>Status</dt>
      <dd><span class="ems-badge" :class="statusClass(detailItem.status)">{{ detailItem.status }}</span></dd>
      <dt v-if="detailItem.stakeholder_type === 'owner'">Ownership</dt>
      <dd v-if="detailItem.stakeholder_type === 'owner'">
        <span class="ems-badge" :class="ownershipClass(detailItem)">{{ ownershipLabel(detailItem) }}</span>
      </dd>
      <dt>Valid from</dt>
      <dd>{{ formatDate(detailItem.valid_from) }}</dd>
      <dt>Valid to</dt>
      <dd>{{ formatDate(detailItem.valid_to) }}</dd>
      <dt>Share percentage</dt>
      <dd>{{ detailItem.share_percentage ?? '—' }}</dd>
      <dt>Shares</dt>
      <dd>{{ detailItem.shares ?? '—' }}</dd>
      <dt>Can authenticate</dt>
      <dd>{{ detailItem.can_authenticate ? 'Yes' : 'No' }}</dd>
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
        Activate <strong>{{ confirmState.item?.user_number }}</strong> as a
        {{ typeLabel(confirmState.item?.stakeholder_type) }} record?
      </template>
      <template v-else-if="confirmState.status === 'INACTIVE'">
        Deactivate <strong>{{ confirmState.item?.user_number }}</strong>? The record is retained for history.
      </template>
      <template v-else>
        End <strong>{{ confirmState.item?.user_number }}</strong>? The relationship is retained for history and
        cannot be reused as an active record.
      </template>
    </p>
    <p v-if="confirmState.item?.stakeholder_type === 'owner' && confirmState.status !== 'ACTIVE'" class="ems-small ems-muted">
      The server refuses any change that would leave the organisation without an effective owner.
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

import api from '@/config/api.js'
import EmsContentPanel from '@/main/ems/components/EmsContentPanel.vue'
import EmsField from '@/main/ems/components/EmsField.vue'
import EmsModal from '@/main/ems/components/EmsModal.vue'

const API = 'main/ems/stakeholders'
const { can } = useAbility()

const canManage = computed(
  () =>
    can('manage_ems_stakeholders', 'general') ||
    can('manage_ems_stakeholders', 'all') ||
    can('manage', 'all'),
)

const stakeholderTypes = [
  { value: 'owner', label: 'Owner' },
  { value: 'shareholder', label: 'Shareholder' },
  { value: 'board_member', label: 'Board member' },
  { value: 'director', label: 'Director' },
  { value: 'executive', label: 'Executive' },
  { value: 'staff', label: 'Staff' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'partner', label: 'Partner' },
  { value: 'other', label: 'Other' },
]
const statuses = ['ACTIVE', 'INACTIVE', 'ENDED']

const items = ref([])
const listState = ref('loading')
const listError = ref('')
const notice = ref(null)
const search = ref('')
const typeFilter = ref('ALL')
const statusFilter = ref('ALL')

const formOpen = ref(false)
const formMode = ref('create')
const formSaving = ref(false)
const form = reactive({
  number: '',
  user_number: '',
  stakeholder_type: 'staff',
  title: '',
  share_percentage: '',
  shares: '',
  valid_from: '',
  valid_to: '',
})
const formErrors = reactive({
  user_number: '',
  title: '',
  share_percentage: '',
  shares: '',
  dates: '',
  general: '',
})

const detailItem = ref(null)
const confirmState = reactive({ open: false, item: null, status: 'INACTIVE', error: '' })
const statusSaving = ref(false)

const userSuggestions = computed(() =>
  [...new Set(items.value.map((item) => item.user_number).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
)

const isFiltering = computed(
  () => search.value.trim() !== '' || typeFilter.value !== 'ALL' || statusFilter.value !== 'ALL',
)

const filteredItems = computed(() => {
  const term = search.value.trim().toLowerCase()
  return items.value
    .filter((item) => {
      if (typeFilter.value !== 'ALL' && item.stakeholder_type !== typeFilter.value) {
        return false
      }
      if (statusFilter.value !== 'ALL' && item.status !== statusFilter.value) {
        return false
      }
      if (!term) {
        return true
      }
      return [item.display_name, item.user_number, item.title, item.stakeholder_type].some((value) =>
        String(value || '').toLowerCase().includes(term),
      )
    })
    .sort((a, b) => {
      const ownerRank = (item) => (item.stakeholder_type === 'owner' ? 0 : 1)
      return (
        ownerRank(a) - ownerRank(b) ||
        typeLabel(a.stakeholder_type).localeCompare(typeLabel(b.stakeholder_type)) ||
        String(a.user_number).localeCompare(String(b.user_number))
      )
    })
})

const summary = computed(() => {
  const result = { effective: 0, upcoming: 0, expired: 0, inactive: 0 }
  for (const item of items.value) {
    if (item.stakeholder_type !== 'owner') {
      continue
    }
    const state = ownershipState(item)
    if (result[state] !== undefined) {
      result[state] += 1
    }
  }
  return result
})

const confirmTitle = computed(() => {
  if (confirmState.status === 'ACTIVE') return 'Activate record'
  if (confirmState.status === 'ENDED') return 'End record'
  return 'Deactivate record'
})

function typeLabel(value) {
  return stakeholderTypes.find((type) => type.value === value)?.label || value || '—'
}

function statusClass(status) {
  if (status === 'ACTIVE') return 'ems-badge--ok'
  if (status === 'INACTIVE') return 'ems-badge--warn'
  return 'ems-badge--muted'
}

function ownershipState(item) {
  if (item.stakeholder_type !== 'owner') {
    return ''
  }
  if (item.status !== 'ACTIVE') {
    return 'inactive'
  }
  const now = Date.now()
  if (item.valid_from && new Date(item.valid_from).getTime() > now) {
    return 'upcoming'
  }
  if (item.valid_to && new Date(item.valid_to).getTime() < now) {
    return 'expired'
  }
  return 'effective'
}

function ownershipLabel(item) {
  const state = ownershipState(item)
  if (state === 'effective') return 'Effective'
  if (state === 'upcoming') return 'Not started'
  if (state === 'expired') return 'Ended'
  return 'Inactive'
}

function ownershipClass(item) {
  const state = ownershipState(item)
  if (state === 'effective') return 'ems-badge--ok'
  if (state === 'upcoming') return 'ems-badge--warn'
  if (state === 'expired') return 'ems-badge--danger'
  return 'ems-badge--muted'
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

function validity(item) {
  if (!item.valid_from && !item.valid_to) {
    return 'No time limit'
  }
  return `${formatDate(item.valid_from)} – ${formatDate(item.valid_to)}`
}

function shares(item) {
  const parts = []
  if (item.share_percentage !== null && item.share_percentage !== undefined) {
    parts.push(`${item.share_percentage}%`)
  }
  if (item.shares !== null && item.shares !== undefined) {
    parts.push(`${item.shares} shares`)
  }
  return parts.length ? parts.join(' · ') : '—'
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
  if (status === 404) return message || 'The stakeholder record was not found.'
  if (status === 409) return message || 'The change conflicts with another record.'
  if (status === 400) return message || 'Please check the values and try again.'
  return message || fallback
}

async function load() {
  listState.value = 'loading'
  listError.value = ''
  try {
    const response = await api.get(API, { timeout: 15000 })
    items.value = Array.isArray(response?.data?.data) ? response.data.data : []
    listState.value = items.value.length ? 'ready' : 'empty'
  } catch (error) {
    listError.value = apiError(error, 'Could not load stakeholders.')
    listState.value = 'error'
  }
}

function clearFilters() {
  search.value = ''
  typeFilter.value = 'ALL'
  statusFilter.value = 'ALL'
}

function toggleOwnersOnly() {
  typeFilter.value = typeFilter.value === 'owner' ? 'ALL' : 'owner'
}

function resetFormErrors() {
  formErrors.user_number = ''
  formErrors.title = ''
  formErrors.share_percentage = ''
  formErrors.shares = ''
  formErrors.dates = ''
  formErrors.general = ''
}

function openCreate(type) {
  resetFormErrors()
  form.number = ''
  form.user_number = ''
  form.stakeholder_type = type || 'staff'
  form.title = ''
  form.share_percentage = ''
  form.shares = ''
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
  form.stakeholder_type = item.stakeholder_type
  form.title = item.title || ''
  form.share_percentage =
    item.share_percentage !== null && item.share_percentage !== undefined ? String(item.share_percentage) : ''
  form.shares = item.shares !== null && item.shares !== undefined ? String(item.shares) : ''
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

  if (formMode.value === 'create') {
    if (!form.user_number.trim()) {
      formErrors.user_number = 'User number is required.'
      valid = false
    }
    if (!form.stakeholder_type) {
      formErrors.general = 'Select a stakeholder type.'
      valid = false
    }
  }

  if (form.share_percentage !== '' && form.share_percentage !== null) {
    const value = Number(form.share_percentage)
    if (Number.isNaN(value) || value < 0 || value > 100) {
      formErrors.share_percentage = 'Enter a percentage between 0 and 100.'
      valid = false
    }
  }

  if (form.shares !== '' && form.shares !== null) {
    const value = Number(form.shares)
    if (!Number.isInteger(value) || value < 0) {
      formErrors.shares = 'Enter a whole number of shares, zero or greater.'
      valid = false
    }
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
    title: form.title.trim(),
    share_percentage:
      form.share_percentage === '' || form.share_percentage === null ? null : Number(form.share_percentage),
    shares: form.shares === '' || form.shares === null ? null : Number(form.shares),
    valid_from: toIso(form.valid_from),
    valid_to: toIso(form.valid_to),
  }

  try {
    if (formMode.value === 'create') {
      payload.user_number = form.user_number.trim()
      payload.stakeholder_type = form.stakeholder_type
      await api.post(API, payload, { timeout: 20000 })
    } else {
      await api.put(`${API}/${form.number}`, payload, { timeout: 20000 })
    }
    formOpen.value = false
    notice.value = {
      ok: true,
      text: formMode.value === 'create' ? 'Stakeholder added.' : 'Stakeholder updated.',
    }
    await load()
  } catch (error) {
    formErrors.general = apiError(error, 'Could not save the stakeholder record.')
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
          ? 'Stakeholder record activated.'
          : confirmState.status === 'ENDED'
            ? 'Stakeholder relationship ended.'
            : 'Stakeholder record deactivated.',
    }
    await load()
  } catch (error) {
    confirmState.error = apiError(error, 'Could not change the stakeholder status.')
  } finally {
    statusSaving.value = false
  }
}

function openDetails(item) {
  detailItem.value = item
}

onMounted(load)
</script>

<style scoped>
.ems-kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}

.ems-kpi {
  border: 1px solid #e6e9f0;
  border-radius: 12px;
  padding: 10px 12px;
  background: #fbfcfe;
}

.ems-kpi__label {
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 4px;
}

.ems-kpi__value {
  font-size: 20px;
  color: var(--ems-ink);
}

.ems-kpi--ok { border-color: #bfe6d0; background: #f4fbf7; }
.ems-kpi--warn { border-color: #f2ddb0; background: #fffaf0; }
.ems-kpi--danger { border-color: #efc4c0; background: #fff8f7; }
.ems-kpi--muted { border-color: #e2e6ee; background: #f7f8fb; }

.ems-table-scroll {
  overflow-x: auto;
}

.ems-people-table {
  min-width: 760px;
}

.ems-people-link {
  border: 0;
  background: transparent;
  padding: 0;
  font: inherit;
  font-weight: 600;
  color: var(--ems-ink);
  cursor: pointer;
  text-align: left;
}

.ems-people-link:hover {
  color: var(--ems-brand);
  text-decoration: underline;
}

.ems-people-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.ems-people-actions-head {
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

@media (max-width: 900px) {
  .ems-kpis {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .ems-kpis {
    grid-template-columns: 1fr;
  }
}
</style>

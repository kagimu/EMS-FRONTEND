<template>
  <EmsContentPanel
    title="Reporting lines"
    icon="bi bi-diagram-2"
    description="Explicit person-to-person reporting between assignments. Reporting grants no system permissions."
    :count="lines.length"
    count-noun="reporting line"
    count-noun-plural="reporting lines"
    :state="listState"
    :error-message="listError"
  >
    <template #actions>
      <button type="button" class="ems-btn ems-btn--ghost" :disabled="listState === 'loading'" @click="load">
        Refresh
      </button>
      <button v-if="canManage" type="button" class="ems-btn ems-btn--primary" @click="openCreate">
        New reporting line
      </button>
    </template>

    <template #empty>
      <p class="ems-empty__title">No reporting lines recorded yet</p>
      <p class="ems-empty__msg">
        Link one assignment to the assignment of the person it reports to. Both ends must be active assignments
        in this organisation.
      </p>
      <div v-if="canManage" class="ems-actions" style="justify-content: center; margin-top: 14px;">
        <button type="button" class="ems-btn ems-btn--primary" @click="openCreate">Create the first line</button>
      </div>
    </template>

    <div v-if="listState === 'ready'" class="ems-form">
      <div v-if="notice" class="ems-alert" :class="notice.ok ? 'ems-alert--success' : 'ems-alert--error'" role="status">
        {{ notice.text }}
      </div>

      <p v-if="!canManage" class="ems-small ems-muted">
        You can view reporting lines. Creating, editing and changing status requires the assignment management
        permission.
      </p>

      <p v-if="unitsError" class="ems-small ems-muted">{{ unitsError }}</p>
      <p v-if="stakeholdersError" class="ems-small ems-muted">{{ stakeholdersError }}</p>

      <div class="ems-toolbar">
        <label class="ems-search">
          <i class="bi bi-search" aria-hidden="true"></i>
          <input
            v-model="search"
            type="search"
            placeholder="Search by person, position or unit"
            aria-label="Search reporting lines"
          />
        </label>
        <select v-model="statusFilter" class="ems-select" aria-label="Filter by status">
          <option value="ALL">All statuses</option>
          <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
        </select>
        <button v-if="isFiltering" type="button" class="ems-btn ems-btn--ghost" @click="clearFilters">
          Clear filters
        </button>
      </div>

      <p class="ems-small ems-muted">
        A reporting line is attached to assignments, not stakeholders or the unit hierarchy. It does not create a
        login, a system role, a decision authority or any permission. Ended lines are retained as history.
        Ending an assignment does not end its reporting lines; such lines remain in history and are shown as
        “Assignment inactive” rather than as current.
      </p>

      <div v-if="!filteredLines.length" class="ems-empty">
        <p class="ems-empty__title">No reporting lines match your filters</p>
        <p class="ems-empty__msg">Try a different search or status.</p>
      </div>

      <div v-else class="ems-table-scroll">
        <table class="ems-table ems-reporting-table">
          <thead>
            <tr>
              <th scope="col">Subordinate</th>
              <th scope="col">Reports to</th>
              <th scope="col">Status</th>
              <th scope="col">Effective</th>
              <th scope="col">Validity</th>
              <th scope="col" class="ems-reporting-actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="line in filteredLines" :key="line.number">
              <td>
                <div class="ems-report-person">{{ assignmentName(line.subordinate_assignment_number) }}</div>
                <div class="ems-small ems-muted">{{ assignmentSubLabel(line.subordinate_assignment_number) }}</div>
              </td>
              <td>
                <div class="ems-report-person">{{ assignmentName(line.manager_assignment_number) }}</div>
                <div class="ems-small ems-muted">{{ assignmentSubLabel(line.manager_assignment_number) }}</div>
              </td>
              <td><span class="ems-badge" :class="statusClass(line.status)">{{ line.status }}</span></td>
              <td>
                <span class="ems-badge" :class="effectiveClass(line.effective_state)">
                  {{ effectiveLabel(line.effective_state) }}
                </span>
              </td>
              <td class="ems-small ems-muted">{{ validity(line) }}</td>
              <td>
                <div class="ems-reporting-actions">
                  <button type="button" class="ems-link" @click="openDetails(line)">View</button>
                  <template v-if="canManage">
                    <button type="button" class="ems-link" @click="openEdit(line)">Edit</button>
                    <button
                      v-if="line.status !== 'ACTIVE'"
                      type="button"
                      class="ems-link"
                      @click="requestStatus(line, 'ACTIVE')"
                    >
                      Activate
                    </button>
                    <template v-else>
                      <button type="button" class="ems-link" @click="requestStatus(line, 'INACTIVE')">
                        Deactivate
                      </button>
                      <button type="button" class="ems-link" @click="requestStatus(line, 'ENDED')">End</button>
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

  <EmsContentPanel
    title="Reporting chart"
    icon="bi bi-diagram-3"
    description="The active and currently effective reporting hierarchy built from assignments and effective reporting lines."
    :state="chartState"
    :error-message="chartError"
  >
    <template #empty>
      <p class="ems-empty__title">No reporting chart yet</p>
      <p class="ems-empty__msg">{{ chartEmptyReason }}</p>
    </template>
    <div class="ems-chart">
      <div
        v-for="row in chartRows"
        :key="row.assignment.number"
        class="ems-chart__row"
        :style="{ paddingLeft: `${row.depth * 22}px` }"
      >
        <button
          v-if="row.hasChildren"
          type="button"
          class="ems-tree-toggle"
          :aria-label="row.expanded ? 'Collapse reports' : 'Expand reports'"
          :aria-expanded="row.expanded"
          @click="toggleCollapse(row.assignment.number)"
        >
          <i :class="row.expanded ? 'bi bi-chevron-down' : 'bi bi-chevron-right'"></i>
        </button>
        <span v-else class="ems-tree-spacer" aria-hidden="true"></span>
        <div class="ems-report-card">
          <div class="ems-report-card__name">{{ assignmentName(row.assignment.number) }}</div>
          <div class="ems-small ems-muted">{{ assignmentSubLabel(row.assignment.number) }}</div>
          <span class="ems-badge ems-badge--ok">ACTIVE</span>
        </div>
      </div>
    </div>
    <p class="ems-small ems-muted" style="margin-top: 10px;">
      The chart shows active assignments and currently effective reporting lines only. Future-dated, expired,
      ended and assignment-inactive lines are retained in the list above but are not presented as current.
      Vacant positions cannot be represented because positions are free-text on assignments.
    </p>
  </EmsContentPanel>

  <!-- Create / edit line -->
  <EmsModal
    :open="formOpen"
    :title="formMode === 'create' ? 'New reporting line' : 'Edit reporting line'"
    icon="bi bi-diagram-2"
    @close="closeForm"
  >
    <div class="ems-form">
      <label v-if="formMode === 'create'" class="ems-field">
        <span class="ems-field__label">Subordinate assignment<span class="ems-field__req">*</span></span>
        <span class="ems-field__control" :class="{ 'ems-field__control--error': !!formErrors.subordinate }">
          <select v-model="form.subordinate_assignment_number" class="ems-field__input">
            <option value="">— Select an active assignment —</option>
            <option v-for="assignment in activeAssignments" :key="assignment.number" :value="assignment.number">
              {{ assignmentOptionLabel(assignment) }}
            </option>
          </select>
        </span>
        <span v-if="formErrors.subordinate" class="ems-field__error">{{ formErrors.subordinate }}</span>
        <span v-else class="ems-small ems-muted">The subordinate is immutable on edit.</span>
      </label>

      <div v-else class="ems-kv-card" style="margin-bottom: 8px;">
        <dt>Subordinate</dt>
        <dd>{{ assignmentName(form.subordinate_assignment_number) }}</dd>
        <dt>Assignment</dt>
        <dd class="ems-small ems-muted">{{ assignmentSubLabel(form.subordinate_assignment_number) }}</dd>
      </div>

      <label class="ems-field">
        <span class="ems-field__label">Reports to (manager assignment)<span class="ems-field__req">*</span></span>
        <span class="ems-field__control" :class="{ 'ems-field__control--error': !!formErrors.manager }">
          <select v-model="form.manager_assignment_number" class="ems-field__input">
            <option value="">— Select an active assignment —</option>
            <option v-for="assignment in managerOptions" :key="assignment.number" :value="assignment.number">
              {{ assignmentOptionLabel(assignment) }}
            </option>
          </select>
        </span>
        <span v-if="formErrors.manager" class="ems-field__error">{{ formErrors.manager }}</span>
        <span v-else class="ems-small ems-muted">
          Self-reporting and assignments that would create a reporting cycle are excluded.
        </span>
      </label>

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
      <button type="button" class="ems-btn ems-btn--primary" :disabled="formSaving || !activeAssignments.length" @click="save">
        {{ formSaving ? 'Saving…' : formMode === 'create' ? 'Create line' : 'Save changes' }}
      </button>
    </template>
  </EmsModal>

  <!-- Details -->
  <EmsModal :open="!!detailItem" title="Reporting line details" icon="bi bi-diagram-2" @close="detailItem = null">
    <dl v-if="detailItem" class="ems-kv-card">
      <dt>Subordinate</dt>
      <dd>{{ assignmentName(detailItem.subordinate_assignment_number) }}</dd>
      <dt>Subordinate assignment</dt>
      <dd class="ems-small ems-muted">{{ assignmentSubLabel(detailItem.subordinate_assignment_number) }}</dd>
      <dt>Reports to</dt>
      <dd>{{ assignmentName(detailItem.manager_assignment_number) }}</dd>
      <dt>Manager assignment</dt>
      <dd class="ems-small ems-muted">{{ assignmentSubLabel(detailItem.manager_assignment_number) }}</dd>
      <dt>Status</dt>
      <dd><span class="ems-badge" :class="statusClass(detailItem.status)">{{ detailItem.status }}</span></dd>
      <dt>Effective</dt>
      <dd>
        <span class="ems-badge" :class="effectiveClass(detailItem.effective_state)">
          {{ effectiveLabel(detailItem.effective_state) }}
        </span>
      </dd>
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
        Activate this reporting line? The server re-checks that both assignments are active, that the subordinate
        has no other active manager and that no cycle is created.
      </template>
      <template v-else-if="confirmState.status === 'INACTIVE'">
        Mark this reporting line as inactive? The record is retained and the chart excludes it.
      </template>
      <template v-else>
        End this reporting line? The record is retained for history and the chart excludes it. This does not
        change either assignment, stakeholder or login.
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

import api from '@/config/api.js'
import EmsContentPanel from '@/main/ems/components/EmsContentPanel.vue'
import EmsModal from '@/main/ems/components/EmsModal.vue'

const API = 'main/ems/reporting-lines'
const ASSIGNMENTS_API = 'main/ems/user-assignments'
const UNITS_API = 'main/ems/organisation-units'
const STAKEHOLDERS_API = 'main/ems/stakeholders'
const { can } = useAbility()

const canManage = computed(
  () =>
    can('manage_ems_assignments', 'general') ||
    can('manage_ems_assignments', 'all') ||
    can('manage', 'all'),
)

const statuses = ['ACTIVE', 'INACTIVE', 'ENDED']

const lines = ref([])
const assignments = ref([])
const units = ref([])
const stakeholders = ref([])
const listState = ref('loading')
const listError = ref('')
const unitsError = ref('')
const stakeholdersError = ref('')
const notice = ref(null)

const search = ref('')
const statusFilter = ref('ALL')
const collapsed = ref(new Set())

const formOpen = ref(false)
const formMode = ref('create')
const formSaving = ref(false)
const form = reactive({
  number: '',
  subordinate_assignment_number: '',
  manager_assignment_number: '',
  valid_from: '',
  valid_to: '',
})
const formErrors = reactive({ subordinate: '', manager: '', dates: '', general: '' })

const detailItem = ref(null)
const confirmState = reactive({ open: false, item: null, status: 'INACTIVE', error: '' })
const statusSaving = ref(false)

const assignmentMap = computed(() => new Map(assignments.value.map((assignment) => [assignment.number, assignment])))
const unitMap = computed(() => new Map(units.value.map((unit) => [unit.number, unit])))
const stakeholderNameByUser = computed(() => {
  const result = new Map()
  for (const stakeholder of stakeholders.value) {
    if (!stakeholder.user_number || result.has(stakeholder.user_number)) {
      continue
    }
    if (stakeholder.display_name) {
      result.set(stakeholder.user_number, stakeholder.display_name)
    }
  }
  return result
})
const activeAssignments = computed(() => assignments.value.filter((assignment) => assignment.status === 'ACTIVE'))
const activeAssignmentMap = computed(() => new Map(activeAssignments.value.map((assignment) => [assignment.number, assignment])))
const effectiveLines = computed(() => lines.value.filter((line) => line.effective))
const graphLines = computed(() =>
  lines.value.filter(
    (line) =>
      line.status === 'ACTIVE' &&
      (line.effective_state === 'EFFECTIVE' || line.effective_state === 'UPCOMING'),
  ),
)
const managerBySubordinate = computed(() => {
  const result = new Map()
  for (const line of effectiveLines.value) {
    result.set(line.subordinate_assignment_number, line.manager_assignment_number)
  }
  return result
})
const graphManagerBySubordinate = computed(() => {
  const result = new Map()
  for (const line of graphLines.value) {
    result.set(line.subordinate_assignment_number, line.manager_assignment_number)
  }
  return result
})
const childrenByManager = computed(() => {
  const result = new Map()
  for (const line of effectiveLines.value) {
    if (!activeAssignmentMap.value.has(line.manager_assignment_number) || !activeAssignmentMap.value.has(line.subordinate_assignment_number)) {
      continue
    }
    const list = result.get(line.manager_assignment_number) || []
    list.push(line.subordinate_assignment_number)
    result.set(line.manager_assignment_number, list)
  }
  return result
})
const isFiltering = computed(() => search.value.trim() !== '' || statusFilter.value !== 'ALL')
const filteredLines = computed(() => {
  const term = search.value.trim().toLowerCase()
  return lines.value.filter((line) => {
    if (statusFilter.value !== 'ALL' && line.status !== statusFilter.value) {
      return false
    }
    if (!term) {
      return true
    }
    return [
      assignmentName(line.subordinate_assignment_number),
      assignmentName(line.manager_assignment_number),
      assignmentSubLabel(line.subordinate_assignment_number),
      assignmentSubLabel(line.manager_assignment_number),
    ].some((value) => String(value || '').toLowerCase().includes(term))
  })
})
const confirmTitle = computed(() => {
  if (confirmState.status === 'ACTIVE') return 'Activate line'
  if (confirmState.status === 'ENDED') return 'End line'
  return 'Deactivate line'
})

const chartState = computed(() => {
  if (listState.value === 'loading') return 'loading'
  if (listState.value === 'error') return 'error'
  if (!activeAssignments.value.length) return 'empty'
  return 'ready'
})
const chartError = computed(() => (listState.value === 'error' ? listError.value : ''))
const chartEmptyReason = computed(() => {
  if (!assignments.value.length) {
    return 'No assignments exist yet, so there is no reporting chart to show.'
  }
  if (!activeAssignments.value.length) {
    return 'No active assignments exist, so there is no reporting chart to show.'
  }
  return ''
})
const chartRows = computed(() => {
  const rows = []
  const visited = new Set()

  const walk = (assignment, depth) => {
    if (!assignment || visited.has(assignment.number)) {
      return
    }
    visited.add(assignment.number)
    const children = (childrenByManager.value.get(assignment.number) || [])
      .map((number) => activeAssignmentMap.value.get(number))
      .filter(Boolean)
      .sort((a, b) => assignmentName(a.number).localeCompare(assignmentName(b.number)))

    const expanded = !collapsed.value.has(assignment.number)
    rows.push({ assignment, depth, hasChildren: children.length > 0, expanded })
    if (expanded) {
      children.forEach((child) => walk(child, depth + 1))
    }
  }

  const roots = activeAssignments.value
    .filter((assignment) => {
      const manager = managerBySubordinate.value.get(assignment.number)
      return !manager || !activeAssignmentMap.value.has(manager)
    })
    .sort((a, b) => assignmentName(a.number).localeCompare(assignmentName(b.number)))

  roots.forEach((root) => walk(root, 0))

  // Defensive: include any active assignment not reachable from a root (data
  // corruption or a legacy cycle) so it is never silently hidden.
  for (const assignment of activeAssignments.value) {
    if (!visited.has(assignment.number)) {
      walk(assignment, 0)
    }
  }

  return rows
})

const managerOptions = computed(() => {
  const subordinate = form.subordinate_assignment_number
  return activeAssignments.value
    .filter((assignment) => assignment.number !== subordinate)
    .filter((assignment) => !wouldCreateCycle(subordinate, assignment.number))
    .sort((a, b) => assignmentOptionLabel(a).localeCompare(assignmentOptionLabel(b)))
})

function wouldCreateCycle(subordinate, manager) {
  if (!subordinate || !manager) {
    return false
  }
  let current = manager
  const visited = new Set()
  while (current) {
    if (current === subordinate) {
      return true
    }
    if (visited.has(current)) {
      return true
    }
    visited.add(current)
    current = graphManagerBySubordinate.value.get(current) || ''
  }
  return false
}

function assignmentName(number) {
  const assignment = assignmentMap.value.get(number)
  if (!assignment) {
    return number || '—'
  }
  return stakeholderNameByUser.value.get(assignment.user_number) || assignment.user_number || number
}

function assignmentSubLabel(number) {
  const assignment = assignmentMap.value.get(number)
  if (!assignment) {
    return 'assignment not found'
  }
  const position = assignment.position_title || 'No position title'
  const unit = unitMap.value.get(assignment.organisation_unit_number)?.name || assignment.organisation_unit_number
  return `${position} · ${unit}${assignment.status !== 'ACTIVE' ? ` · ${assignment.status}` : ''}`
}

function assignmentOptionLabel(assignment) {
  const name = stakeholderNameByUser.value.get(assignment.user_number) || assignment.user_number
  const position = assignment.position_title || 'No position title'
  return `${name} (${assignment.user_number}) — ${position}`
}

function statusClass(status) {
  if (status === 'ACTIVE') return 'ems-badge--ok'
  if (status === 'INACTIVE') return 'ems-badge--warn'
  return 'ems-badge--muted'
}

function effectiveLabel(state) {
  if (state === 'EFFECTIVE') return 'Effective'
  if (state === 'UPCOMING') return 'Not started'
  if (state === 'EXPIRED') return 'Expired'
  if (state === 'ASSIGNMENT_INACTIVE') return 'Assignment inactive'
  return 'Inactive'
}

function effectiveClass(state) {
  if (state === 'EFFECTIVE') return 'ems-badge--ok'
  if (state === 'UPCOMING') return 'ems-badge--warn'
  if (state === 'EXPIRED') return 'ems-badge--danger'
  return 'ems-badge--muted'
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function validity(line) {
  if (!line.valid_from && !line.valid_to) return 'No time limit'
  return `${formatDate(line.valid_from)} – ${formatDate(line.valid_to)}`
}

function toIso(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function toDateInput(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

function apiError(error, fallback) {
  const status = error?.response?.status
  const message = error?.response?.data?.message
  if (status === 401) return 'Your session has expired. Please sign in again.'
  if (status === 403) return 'You do not have permission to perform this action.'
  if (status === 404) return message || 'The reporting line or assignment was not found.'
  if (status === 409) return message || 'The change conflicts with another reporting line.'
  if (status === 400) return message || 'Please check the values and try again.'
  return message || fallback
}

async function load() {
  listState.value = 'loading'
  listError.value = ''
  unitsError.value = ''
  stakeholdersError.value = ''
  try {
    const [linesResult, assignmentsResult, unitsResult, stakeholdersResult] = await Promise.allSettled([
      api.get(API, { timeout: 15000 }),
      api.get(ASSIGNMENTS_API, { timeout: 15000 }),
      api.get(UNITS_API, { timeout: 15000 }),
      api.get(STAKEHOLDERS_API, { timeout: 15000 }),
    ])

    if (linesResult.status === 'rejected') {
      throw linesResult.reason
    }
    if (assignmentsResult.status === 'rejected') {
      throw assignmentsResult.reason
    }

    lines.value = Array.isArray(linesResult.value?.data?.data) ? linesResult.value.data.data : []
    assignments.value = Array.isArray(assignmentsResult.value?.data?.data) ? assignmentsResult.value.data.data : []
    units.value = unitsResult.status === 'fulfilled' && Array.isArray(unitsResult.value?.data?.data)
      ? unitsResult.value.data.data
      : []
    stakeholders.value =
      stakeholdersResult.status === 'fulfilled' && Array.isArray(stakeholdersResult.value?.data?.data)
        ? stakeholdersResult.value.data.data
        : []

    if (unitsResult.status === 'rejected') {
      unitsError.value = 'Organisation units could not be loaded; unit names may be shown as numbers.'
    }
    if (stakeholdersResult.status === 'rejected') {
      stakeholdersError.value = 'Stakeholder names could not be loaded; user numbers are shown instead.'
    }

    listState.value = lines.value.length ? 'ready' : 'empty'
  } catch (error) {
    listError.value = apiError(error, 'Could not load reporting lines.')
    listState.value = 'error'
  }
}

function clearFilters() {
  search.value = ''
  statusFilter.value = 'ALL'
}

function toggleCollapse(number) {
  const next = new Set(collapsed.value)
  if (next.has(number)) {
    next.delete(number)
  } else {
    next.add(number)
  }
  collapsed.value = next
}

function resetFormErrors() {
  formErrors.subordinate = ''
  formErrors.manager = ''
  formErrors.dates = ''
  formErrors.general = ''
}

function openCreate() {
  resetFormErrors()
  form.number = ''
  form.subordinate_assignment_number = ''
  form.manager_assignment_number = ''
  form.valid_from = ''
  form.valid_to = ''
  formMode.value = 'create'
  formOpen.value = true
  detailItem.value = null
}

function openEdit(line) {
  resetFormErrors()
  form.number = line.number
  form.subordinate_assignment_number = line.subordinate_assignment_number
  form.manager_assignment_number = line.manager_assignment_number
  form.valid_from = toDateInput(line.valid_from)
  form.valid_to = toDateInput(line.valid_to)
  formMode.value = 'edit'
  formOpen.value = true
  detailItem.value = null
}

function closeForm() {
  if (formSaving.value) return
  formOpen.value = false
  resetFormErrors()
}

function validateForm() {
  resetFormErrors()
  let valid = true
  if (formMode.value === 'create' && !form.subordinate_assignment_number) {
    formErrors.subordinate = 'Select the subordinate assignment.'
    valid = false
  }
  if (!form.manager_assignment_number) {
    formErrors.manager = 'Select the manager assignment.'
    valid = false
  }
  if (form.subordinate_assignment_number && form.subordinate_assignment_number === form.manager_assignment_number) {
    formErrors.manager = 'An assignment cannot report to itself.'
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
  if (formSaving.value || !validateForm()) return
  formSaving.value = true
  notice.value = null

  const payload = {
    manager_assignment_number: form.manager_assignment_number,
    valid_from: toIso(form.valid_from),
    valid_to: toIso(form.valid_to),
  }

  try {
    if (formMode.value === 'create') {
      payload.subordinate_assignment_number = form.subordinate_assignment_number
      await api.post(API, payload, { timeout: 20000 })
    } else {
      await api.put(`${API}/${form.number}`, payload, { timeout: 20000 })
    }
    formOpen.value = false
    notice.value = {
      ok: true,
      text: formMode.value === 'create' ? 'Reporting line created.' : 'Reporting line updated.',
    }
    await load()
  } catch (error) {
    formErrors.general = apiError(error, 'Could not save the reporting line.')
  } finally {
    formSaving.value = false
  }
}

function requestStatus(line, status) {
  if (status === 'ACTIVE' && line.effective_state === 'EXPIRED') {
    notice.value = {
      ok: false,
      text: 'This reporting line has expired. Update the validity dates, then activate it.',
    }
    openEdit(line)
    return
  }
  if (status === 'ACTIVE' && line.effective_state === 'ASSIGNMENT_INACTIVE') {
    notice.value = {
      ok: false,
      text: 'Both assignments must be active before this reporting line can be activated.',
    }
    return
  }
  confirmState.open = true
  confirmState.item = line
  confirmState.status = status
  confirmState.error = ''
  detailItem.value = null
}

function closeConfirm() {
  if (statusSaving.value) return
  confirmState.open = false
  confirmState.item = null
  confirmState.error = ''
}

async function applyStatus() {
  if (statusSaving.value || !confirmState.item) return
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
          ? 'Reporting line activated.'
          : confirmState.status === 'ENDED'
            ? 'Reporting line ended.'
            : 'Reporting line deactivated.',
    }
    await load()
  } catch (error) {
    confirmState.error = apiError(error, 'Could not change the reporting line status.')
  } finally {
    statusSaving.value = false
  }
}

function openDetails(line) {
  detailItem.value = line
}

onMounted(load)
</script>

<style scoped>
.ems-table-scroll {
  overflow-x: auto;
}

.ems-reporting-table {
  min-width: 720px;
}

.ems-report-person {
  font-weight: 600;
  color: var(--ems-ink);
}

.ems-reporting-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.ems-reporting-actions-head {
  white-space: nowrap;
}

.ems-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-x: auto;
}

.ems-chart__row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  min-width: 260px;
}

.ems-report-card {
  border: 1px solid #e6e9f0;
  border-radius: 10px;
  padding: 8px 12px;
  background: #fbfcfe;
  min-width: 220px;
}

.ems-report-card__name {
  font-weight: 700;
  color: var(--ems-ink);
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

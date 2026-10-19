<template>
  <EmsContentPanel
    title="Decision authority"
    icon="bi bi-shield-check"
    description="Who is authorised to decide, for which decisions, at which approval level and within which limits."
    :count="authorities.length"
    count-noun="authority"
    count-noun-plural="authorities"
    :state="listState"
    :error-message="listError"
  >
    <template #actions>
      <button type="button" class="ems-btn ems-btn--ghost" :disabled="listState === 'loading'" @click="load">
        Refresh
      </button>
      <button v-if="canManage" type="button" class="ems-btn ems-btn--primary" @click="openCreate">
        New authority
      </button>
    </template>

    <template #empty>
      <p class="ems-empty__title">No decision authorities recorded yet</p>
      <p class="ems-empty__msg">
        Define who may approve each decision type, at which level and within which amount limits.
      </p>
      <div v-if="canManage" class="ems-actions" style="justify-content: center; margin-top: 14px;">
        <button type="button" class="ems-btn ems-btn--primary" @click="openCreate">Create the first authority</button>
      </div>
    </template>

    <div v-if="listState === 'ready'" class="ems-form">
      <div v-if="notice" class="ems-alert" :class="notice.ok ? 'ems-alert--success' : 'ems-alert--error'" role="status">
        {{ notice.text }}
      </div>

      <p v-if="!canManage" class="ems-small ems-muted">
        You can view decision authority. Creating, editing and changing status requires the authority management
        permission.
      </p>

      <p v-if="unitsError" class="ems-small ems-muted">{{ unitsError }}</p>
      <p v-if="rolesError" class="ems-small ems-muted">{{ rolesError }}</p>

      <div class="ems-toolbar">
        <label class="ems-search">
          <i class="bi bi-search" aria-hidden="true"></i>
          <input
            v-model="search"
            type="search"
            placeholder="Search by decision, holder or unit"
            aria-label="Search decision authorities"
          />
        </label>
        <select v-model="decisionFilter" class="ems-select" aria-label="Filter by decision type">
          <option value="ALL">All decision types</option>
          <option v-for="type in decisionTypes" :key="type" :value="type">{{ type }}</option>
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
        Authority is defined by a system role or a stakeholder type — not by an individual person. Being an
        owner, stakeholder or assignee does not itself grant approval authority. Amount limits are numeric; no
        currency is modelled.
      </p>

      <div v-if="!filteredAuthorities.length" class="ems-empty">
        <p class="ems-empty__title">No authorities match your filters</p>
        <p class="ems-empty__msg">Try a different search, decision type or status.</p>
      </div>

      <div v-else class="ems-table-scroll">
        <table class="ems-table ems-authority-table">
          <thead>
            <tr>
              <th scope="col">Decision</th>
              <th scope="col">Level</th>
              <th scope="col">Holder</th>
              <th scope="col">Scope</th>
              <th scope="col">Limits</th>
              <th scope="col">Status</th>
              <th scope="col">Validity</th>
              <th scope="col" class="ems-authority-actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredAuthorities" :key="item.number">
              <td>
                <button type="button" class="ems-link ems-authority-link" @click="openDetails(item)">
                  {{ item.decision_type }}
                </button>
              </td>
              <td>Level {{ item.approval_level }}</td>
              <td>{{ holderLabel(item) }}</td>
              <td>{{ scopeLabel(item.organisation_unit_number) }}</td>
              <td class="ems-small ems-muted">{{ limitsLabel(item) }}</td>
              <td><span class="ems-badge" :class="statusClass(item.status)">{{ item.status }}</span></td>
              <td class="ems-small ems-muted">{{ validity(item) }}</td>
              <td>
                <div class="ems-authority-actions">
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

      <div class="ems-alert ems-alert--info" role="note" style="margin-top: 14px;">
        <strong>Reporting:</strong> person-to-person reporting lines are not modelled by the current backend.
        The organisation-unit hierarchy is structural and is not treated as a reporting relationship.
      </div>
    </div>
  </EmsContentPanel>

  <EmsContentPanel
    title="Who must approve?"
    icon="bi bi-signpost-split"
    description="Read-only authority resolution. It describes the required approval path; it does not create or execute an approval."
    :state="'ready'"
  >
    <div class="ems-form">
      <div class="ems-toolbar">
        <label class="ems-field">
          <span class="ems-field__label">Decision type<span class="ems-field__req">*</span></span>
          <span class="ems-field__control" :class="{ 'ems-field__control--error': !!resolveErrors.decision_type }">
            <input
              v-model="resolveForm.decision_type"
              class="ems-field__input"
              list="ems-authority-decision-types"
              placeholder="e.g. purchase"
              autocomplete="off"
            />
          </span>
          <datalist id="ems-authority-decision-types">
            <option v-for="type in decisionTypes" :key="type" :value="type"></option>
          </datalist>
          <span v-if="resolveErrors.decision_type" class="ems-field__error">{{ resolveErrors.decision_type }}</span>
        </label>
        <label class="ems-field">
          <span class="ems-field__label">Amount<span class="ems-field__req">*</span></span>
          <span class="ems-field__control" :class="{ 'ems-field__control--error': !!resolveErrors.amount }">
            <input v-model="resolveForm.amount" class="ems-field__input" type="number" inputmode="decimal" min="0" />
          </span>
          <span v-if="resolveErrors.amount" class="ems-field__error">{{ resolveErrors.amount }}</span>
        </label>
        <label class="ems-field">
          <span class="ems-field__label">Organisation unit (optional)</span>
          <span class="ems-field__control">
            <select v-model="resolveForm.organisation_unit_number" class="ems-field__input">
              <option value="">Organisation-wide</option>
              <option v-for="unit in units" :key="unit.number" :value="unit.number">
                {{ unit.name }}{{ unit.status !== 'ACTIVE' ? ' — inactive' : '' }}
              </option>
            </select>
          </span>
        </label>
        <div class="ems-field" style="align-self: flex-end;">
          <button type="button" class="ems-btn ems-btn--primary" :disabled="resolveState === 'loading'" @click="resolveAuthority">
            {{ resolveState === 'loading' ? 'Resolving…' : 'Resolve authority path' }}
          </button>
        </div>
      </div>

      <div v-if="resolveError" class="ems-alert ems-alert--error" role="alert">
        {{ resolveError }}
      </div>

      <template v-if="resolution">
        <div v-if="!resolution.configured" class="ems-alert ems-alert--info" role="status">
          No authority is configured for <strong>{{ resolution.decision_type }}</strong> in this organisation.
        </div>
        <div v-else-if="!resolution.required_path.length" class="ems-alert ems-alert--info" role="status">
          Authority is configured for <strong>{{ resolution.decision_type }}</strong>, but no definition applies
          to the selected unit scope.
        </div>
        <template v-else>
          <div v-if="resolution.exceeds_declared_authority" class="ems-alert ems-alert--error" role="alert">
            The amount exceeds the declared authority for this scope.
          </div>
          <ol class="ems-authority-path">
            <li v-for="level in resolution.required_path" :key="level.approval_level" class="ems-authority-level">
              <span class="ems-badge ems-badge--ok">Level {{ level.approval_level }}</span>
              <ul class="ems-authority-anchors">
                <li v-for="(anchor, index) in level.anchors" :key="`${anchor.type}-${anchor.value}-${anchor.organisation_unit_number}-${index}`">
                  <strong>{{ anchorLabel(anchor) }}</strong>
                  <span class="ems-small ems-muted"> · {{ scopeLabel(anchor.organisation_unit_number) }}</span>
                </li>
              </ul>
            </li>
          </ol>
        </template>
        <p class="ems-small ems-muted">
          Approval levels are walked in ascending order until one covers the amount. Coverage is determined by
          the maximum amount; a blank maximum means unlimited. This is the configured required path — it does
          not create, assign or execute a workflow approval.
        </p>
      </template>
    </div>
  </EmsContentPanel>

  <!-- Create / edit authority -->
  <EmsModal
    :open="formOpen"
    :title="formMode === 'create' ? 'New decision authority' : 'Edit decision authority'"
    icon="bi bi-shield-check"
    @close="closeForm"
  >
    <div class="ems-form">
      <label class="ems-field">
        <span class="ems-field__label">Decision type<span class="ems-field__req">*</span></span>
        <span class="ems-field__control" :class="{ 'ems-field__control--error': !!formErrors.decision_type }">
          <input
            v-model="form.decision_type"
            class="ems-field__input"
            list="ems-authority-form-decision-types"
            placeholder="e.g. purchase"
            autocomplete="off"
          />
        </span>
        <datalist id="ems-authority-form-decision-types">
          <option v-for="type in decisionTypes" :key="type" :value="type"></option>
        </datalist>
        <span v-if="formErrors.decision_type" class="ems-field__error">{{ formErrors.decision_type }}</span>
        <span v-else class="ems-small ems-muted">Free text. Existing decision types are suggested.</span>
      </label>

      <EmsField
        v-model="form.approval_level"
        label="Approval level"
        type="number"
        inputmode="numeric"
        required
        :error="formErrors.approval_level"
      />

      <label class="ems-field">
        <span class="ems-field__label">Authority holder<span class="ems-field__req">*</span></span>
        <span class="ems-field__control">
          <select v-model="form.anchor_type" class="ems-field__input" @change="onAnchorChange">
            <option value="role">System role</option>
            <option value="stakeholder_type">Stakeholder type</option>
          </select>
        </span>
        <span class="ems-small ems-muted">
          Exactly one holder type is required. Authority is not assigned to an individual person here.
        </span>
      </label>

      <label v-if="form.anchor_type === 'role'" class="ems-field">
        <span class="ems-field__label">Role<span class="ems-field__req">*</span></span>
        <span v-if="roles.length" class="ems-field__control" :class="{ 'ems-field__control--error': !!formErrors.anchor }">
          <select v-model="form.role_number" class="ems-field__input">
            <option value="">— Select a role —</option>
            <option v-for="role in roleOptions" :key="role.number" :value="role.number">
              {{ role.name }}{{ role.number === form.role_number && !role.known ? ' — current' : '' }}
            </option>
          </select>
        </span>
        <span v-else class="ems-field__control" :class="{ 'ems-field__control--error': !!formErrors.anchor }">
          <input
            v-model.trim="form.role_number"
            class="ems-field__input"
            list="ems-authority-role-numbers"
            placeholder="Existing role number"
            autocomplete="off"
          />
        </span>
        <datalist id="ems-authority-role-numbers">
          <option v-for="number in authorityRoleNumbers" :key="number" :value="number"></option>
        </datalist>
        <span v-if="formErrors.anchor" class="ems-field__error">{{ formErrors.anchor }}</span>
      </label>

      <label v-else class="ems-field">
        <span class="ems-field__label">Stakeholder type<span class="ems-field__req">*</span></span>
        <span class="ems-field__control" :class="{ 'ems-field__control--error': !!formErrors.anchor }">
          <select v-model="form.stakeholder_type" class="ems-field__input">
            <option value="">— Select a stakeholder type —</option>
            <option v-for="type in stakeholderTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
          </select>
        </span>
        <span v-if="formErrors.anchor" class="ems-field__error">{{ formErrors.anchor }}</span>
      </label>

      <label class="ems-field">
        <span class="ems-field__label">Organisation unit scope</span>
        <span class="ems-field__control">
          <select v-model="form.organisation_unit_number" class="ems-field__input">
            <option value="">Organisation-wide</option>
            <option v-for="unit in formUnitOptions" :key="unit.number" :value="unit.number">
              {{ unit.name }}{{ unit.status === 'INACTIVE' ? ' — inactive' : '' }}
            </option>
          </select>
        </span>
        <span class="ems-small ems-muted">
          A unit scope applies to that unit and its descendants. Leaving it blank covers the whole organisation.
        </span>
      </label>

      <div class="ems-toolbar">
        <EmsField
          v-model="form.min_amount"
          label="Minimum amount (optional)"
          type="number"
          inputmode="decimal"
          :error="formErrors.amount"
        />
        <EmsField
          v-model="form.max_amount"
          label="Maximum amount (optional)"
          type="number"
          inputmode="decimal"
          :error="formErrors.amount"
        />
      </div>
      <p class="ems-small ems-muted">
        A blank maximum means unlimited. Coverage is determined by the maximum amount; the minimum is stored as a
        declared lower bound. No currency is modelled.
      </p>

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
        {{ formSaving ? 'Saving…' : formMode === 'create' ? 'Create authority' : 'Save changes' }}
      </button>
    </template>
  </EmsModal>

  <!-- Details -->
  <EmsModal :open="!!detailItem" title="Decision authority details" icon="bi bi-shield-check" @close="detailItem = null">
    <dl v-if="detailItem" class="ems-kv-card">
      <dt>Decision type</dt>
      <dd>{{ detailItem.decision_type }}</dd>
      <dt>Approval level</dt>
      <dd>Level {{ detailItem.approval_level }}</dd>
      <dt>Holder</dt>
      <dd>{{ holderLabel(detailItem) }}</dd>
      <dt>Unit scope</dt>
      <dd>{{ scopeLabel(detailItem.organisation_unit_number) }}</dd>
      <dt>Minimum amount</dt>
      <dd>{{ detailItem.min_amount ?? '—' }}</dd>
      <dt>Maximum amount</dt>
      <dd>{{ detailItem.max_amount ?? 'Unlimited' }}</dd>
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
        Activate this authority definition? It will be included in the authority resolver while its validity
        window is current.
      </template>
      <template v-else-if="confirmState.status === 'INACTIVE'">
        Deactivate this authority definition? It will be excluded from the resolver. The record is retained.
      </template>
      <template v-else>
        End this authority definition? It will be excluded from the resolver and retained for history.
      </template>
    </p>
    <p class="ems-small ems-muted">
      Authority is not assigned to an individual person. Changing this record can change who is required to
      approve <strong>{{ confirmState.item?.decision_type }}</strong> at this level.
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

const API = 'main/ems/decision-authorities'
const UNITS_API = 'main/ems/organisation-units'
const ROLES_API = 'main/settings/roles'
const RESOLVE_API = 'main/ems/authority-resolution'
const { can } = useAbility()

const canManage = computed(
  () =>
    can('manage_ems_authority', 'general') ||
    can('manage_ems_authority', 'all') ||
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

const authorities = ref([])
const units = ref([])
const roles = ref([])
const listState = ref('loading')
const listError = ref('')
const unitsError = ref('')
const rolesError = ref('')
const notice = ref(null)

const search = ref('')
const decisionFilter = ref('ALL')
const statusFilter = ref('ALL')

const formOpen = ref(false)
const formMode = ref('create')
const formSaving = ref(false)
const form = reactive({
  number: '',
  decision_type: '',
  approval_level: '1',
  anchor_type: 'role',
  role_number: '',
  stakeholder_type: '',
  organisation_unit_number: '',
  min_amount: '',
  max_amount: '',
  valid_from: '',
  valid_to: '',
})
const formErrors = reactive({
  decision_type: '',
  approval_level: '',
  anchor: '',
  amount: '',
  dates: '',
  general: '',
})

const detailItem = ref(null)
const confirmState = reactive({ open: false, item: null, status: 'INACTIVE', error: '' })
const statusSaving = ref(false)

const resolveForm = reactive({ decision_type: '', amount: '', organisation_unit_number: '' })
const resolveErrors = reactive({ decision_type: '', amount: '' })
const resolveState = ref('idle')
const resolveError = ref('')
const resolution = ref(null)

const unitMap = computed(() => new Map(units.value.map((unit) => [unit.number, unit])))
const roleMap = computed(() => new Map(roles.value.map((role) => [role.number, role])))
const decisionTypes = computed(() =>
  [...new Set(authorities.value.map((item) => (item.decision_type || '').trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  ),
)
const authorityRoleNumbers = computed(() =>
  [...new Set(authorities.value.map((item) => item.role_number).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
)
const activeUnits = computed(() => units.value.filter((unit) => unit.status === 'ACTIVE'))
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
const roleOptions = computed(() => {
  const options = roles.value.map((role) => ({
    number: role.number,
    name: role.name || role.number,
    known: true,
  }))
  if (form.role_number && !options.some((role) => role.number === form.role_number)) {
    options.push({ number: form.role_number, name: form.role_number, known: false })
  }
  return options
})
const isFiltering = computed(
  () => search.value.trim() !== '' || decisionFilter.value !== 'ALL' || statusFilter.value !== 'ALL',
)
const filteredAuthorities = computed(() => {
  const term = search.value.trim().toLowerCase()
  return authorities.value.filter((item) => {
    if (decisionFilter.value !== 'ALL' && item.decision_type !== decisionFilter.value) {
      return false
    }
    if (statusFilter.value !== 'ALL' && item.status !== statusFilter.value) {
      return false
    }
    if (!term) {
      return true
    }
    return [
      item.decision_type,
      holderLabel(item),
      scopeLabel(item.organisation_unit_number),
      String(item.approval_level),
    ].some((value) => String(value || '').toLowerCase().includes(term))
  })
})
const confirmTitle = computed(() => {
  if (confirmState.status === 'ACTIVE') return 'Activate authority'
  if (confirmState.status === 'ENDED') return 'End authority'
  return 'Deactivate authority'
})

function roleName(number) {
  return roleMap.value.get(number)?.name || number || '—'
}

function stakeholderTypeLabel(value) {
  return stakeholderTypes.find((type) => type.value === value)?.label || value || '—'
}

function holderLabel(item) {
  if (!item) return '—'
  if (item.role_number) return `Role: ${roleName(item.role_number)}`
  if (item.stakeholder_type) return `Stakeholder: ${stakeholderTypeLabel(item.stakeholder_type)}`
  return '—'
}

function anchorLabel(anchor) {
  if (!anchor) return '—'
  if (anchor.type === 'role') return `Role: ${roleName(anchor.value)}`
  return `Stakeholder: ${stakeholderTypeLabel(anchor.value)}`
}

function scopeLabel(number) {
  if (!number) return 'Organisation-wide'
  return unitMap.value.get(number)?.name || number
}

function limitsLabel(item) {
  const min = item.min_amount === null || item.min_amount === undefined ? null : Number(item.min_amount)
  const max = item.max_amount === null || item.max_amount === undefined ? null : Number(item.max_amount)
  if (min === null && max === null) return 'No limits'
  if (min !== null && max !== null) return `${formatAmount(min)} – ${formatAmount(max)}`
  if (min !== null) return `From ${formatAmount(min)}`
  return `Up to ${formatAmount(max)}`
}

function formatAmount(value) {
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function validity(item) {
  if (!item.valid_from && !item.valid_to) return 'No time limit'
  return `${formatDate(item.valid_from)} – ${formatDate(item.valid_to)}`
}

function statusClass(status) {
  if (status === 'ACTIVE') return 'ems-badge--ok'
  if (status === 'INACTIVE') return 'ems-badge--warn'
  return 'ems-badge--muted'
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
  if (status === 404) return message || 'The authority record was not found.'
  if (status === 409) return message || 'The change conflicts with another record.'
  if (status === 400) return message || 'Please check the values and try again.'
  return message || fallback
}

async function load() {
  listState.value = 'loading'
  listError.value = ''
  unitsError.value = ''
  rolesError.value = ''
  try {
    const [authoritiesResult, unitsResult, rolesResult] = await Promise.allSettled([
      api.get(API, { timeout: 15000 }),
      api.get(UNITS_API, { timeout: 15000 }),
      api.get(ROLES_API, { timeout: 15000 }),
    ])

    if (authoritiesResult.status === 'rejected') {
      throw authoritiesResult.reason
    }
    authorities.value = Array.isArray(authoritiesResult.value?.data?.data)
      ? authoritiesResult.value.data.data
      : []

    if (unitsResult.status === 'fulfilled') {
      units.value = Array.isArray(unitsResult.value?.data?.data) ? unitsResult.value.data.data : []
    } else {
      units.value = []
      unitsError.value = 'Organisation units could not be loaded; unit scopes may be shown as numbers.'
    }

    if (rolesResult.status === 'fulfilled') {
      roles.value = Array.isArray(rolesResult.value?.data?.data) ? rolesResult.value.data.data : []
    } else {
      roles.value = []
      rolesError.value =
        'Roles could not be loaded; enter an existing role number instead. Role names may be shown as numbers.'
    }

    listState.value = authorities.value.length ? 'ready' : 'empty'
  } catch (error) {
    listError.value = apiError(error, 'Could not load decision authorities.')
    listState.value = 'error'
  }
}

function clearFilters() {
  search.value = ''
  decisionFilter.value = 'ALL'
  statusFilter.value = 'ALL'
}

function resetFormErrors() {
  formErrors.decision_type = ''
  formErrors.approval_level = ''
  formErrors.anchor = ''
  formErrors.amount = ''
  formErrors.dates = ''
  formErrors.general = ''
}

function onAnchorChange() {
  if (form.anchor_type === 'role') {
    form.stakeholder_type = ''
  } else {
    form.role_number = ''
  }
}

function openCreate() {
  resetFormErrors()
  form.number = ''
  form.decision_type = ''
  form.approval_level = '1'
  form.anchor_type = 'role'
  form.role_number = ''
  form.stakeholder_type = ''
  form.organisation_unit_number = ''
  form.min_amount = ''
  form.max_amount = ''
  form.valid_from = ''
  form.valid_to = ''
  formMode.value = 'create'
  formOpen.value = true
  detailItem.value = null
}

function openEdit(item) {
  resetFormErrors()
  form.number = item.number
  form.decision_type = item.decision_type
  form.approval_level = String(item.approval_level)
  form.anchor_type = item.role_number ? 'role' : 'stakeholder_type'
  form.role_number = item.role_number || ''
  form.stakeholder_type = item.stakeholder_type || ''
  form.organisation_unit_number = item.organisation_unit_number || ''
  form.min_amount = item.min_amount === null || item.min_amount === undefined ? '' : String(item.min_amount)
  form.max_amount = item.max_amount === null || item.max_amount === undefined ? '' : String(item.max_amount)
  form.valid_from = toDateInput(item.valid_from)
  form.valid_to = toDateInput(item.valid_to)
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

  if (!form.decision_type.trim()) {
    formErrors.decision_type = 'Decision type is required.'
    valid = false
  }

  const level = Number(form.approval_level)
  if (!Number.isInteger(level) || level < 1) {
    formErrors.approval_level = 'Approval level must be a whole number of at least 1.'
    valid = false
  }

  if (form.anchor_type === 'role' && !form.role_number.trim()) {
    formErrors.anchor = 'Select or enter a role.'
    valid = false
  }
  if (form.anchor_type === 'stakeholder_type' && !form.stakeholder_type) {
    formErrors.anchor = 'Select a stakeholder type.'
    valid = false
  }

  const min = form.min_amount === '' ? null : Number(form.min_amount)
  const max = form.max_amount === '' ? null : Number(form.max_amount)
  if (
    (min !== null && (Number.isNaN(min) || min < 0)) ||
    (max !== null && (Number.isNaN(max) || max < 0))
  ) {
    formErrors.amount = 'Amounts must be zero or greater.'
    valid = false
  } else if (min !== null && max !== null && min > max) {
    formErrors.amount = 'Minimum amount cannot be greater than maximum amount.'
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
    decision_type: form.decision_type.trim(),
    approval_level: Number(form.approval_level),
    min_amount: form.min_amount === '' ? null : Number(form.min_amount),
    max_amount: form.max_amount === '' ? null : Number(form.max_amount),
    role_number: form.anchor_type === 'role' ? form.role_number.trim() : '',
    stakeholder_type: form.anchor_type === 'stakeholder_type' ? form.stakeholder_type : '',
    organisation_unit_number: form.organisation_unit_number || '',
    valid_from: toIso(form.valid_from),
    valid_to: toIso(form.valid_to),
  }

  try {
    if (formMode.value === 'create') {
      await api.post(API, payload, { timeout: 20000 })
    } else {
      await api.put(`${API}/${form.number}`, payload, { timeout: 20000 })
    }
    formOpen.value = false
    notice.value = {
      ok: true,
      text: formMode.value === 'create' ? 'Decision authority created.' : 'Decision authority updated.',
    }
    await load()
  } catch (error) {
    formErrors.general = apiError(error, 'Could not save the decision authority.')
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
          ? 'Decision authority activated.'
          : confirmState.status === 'ENDED'
            ? 'Decision authority ended.'
            : 'Decision authority deactivated.',
    }
    await load()
  } catch (error) {
    confirmState.error = apiError(error, 'Could not change the authority status.')
  } finally {
    statusSaving.value = false
  }
}

function openDetails(item) {
  detailItem.value = item
}

async function resolveAuthority() {
  resolveErrors.decision_type = ''
  resolveErrors.amount = ''
  resolveError.value = ''
  resolution.value = null

  if (!resolveForm.decision_type.trim()) {
    resolveErrors.decision_type = 'Decision type is required.'
    return
  }
  const amount = Number(resolveForm.amount)
  if (resolveForm.amount === '' || Number.isNaN(amount) || amount < 0) {
    resolveErrors.amount = 'Enter an amount of zero or greater.'
    return
  }

  resolveState.value = 'loading'
  try {
    const response = await api.get(RESOLVE_API, {
      params: {
        decision_type: resolveForm.decision_type.trim(),
        amount,
        organisation_unit: resolveForm.organisation_unit_number || '',
      },
      timeout: 15000,
    })
    resolution.value = response?.data?.data || null
  } catch (error) {
    resolveError.value = apiError(error, 'Could not resolve the authority path.')
  } finally {
    resolveState.value = 'idle'
  }
}

onMounted(load)
</script>

<style scoped>
.ems-table-scroll {
  overflow-x: auto;
}

.ems-authority-table {
  min-width: 860px;
}

.ems-authority-link {
  border: 0;
  background: transparent;
  padding: 0;
  font: inherit;
  font-weight: 600;
  color: var(--ems-ink);
  cursor: pointer;
  text-align: left;
}

.ems-authority-link:hover {
  color: var(--ems-brand);
  text-decoration: underline;
}

.ems-authority-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.ems-authority-actions-head {
  white-space: nowrap;
}

.ems-authority-path {
  margin: 0 0 10px;
  padding-left: 18px;
}

.ems-authority-level {
  margin-bottom: 10px;
}

.ems-authority-anchors {
  margin: 6px 0 0;
  padding-left: 18px;
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
  .ems-authority-table th:nth-child(2),
  .ems-authority-table td:nth-child(2),
  .ems-authority-table th:nth-child(5),
  .ems-authority-table td:nth-child(5) {
    display: none;
  }
}
</style>

<template>
  <div v-if="notice" class="ems-alert" :class="notice.ok ? 'ems-alert--success' : 'ems-alert--error'" role="status">
    {{ notice.text }}
  </div>

  <EmsContentPanel
    title="My approvals"
    icon="bi bi-inbox"
    description="Approval tasks that are currently actionable by you."
    :count="tasks.length"
    count-noun="task"
    count-noun-plural="tasks"
    :state="tasksState"
    :error-message="tasksError"
  >
    <template #actions>
      <button type="button" class="ems-btn ems-btn--ghost" :disabled="tasksState === 'loading'" @click="loadTasks">
        Refresh
      </button>
    </template>

    <template #empty>
      <p class="ems-empty__title">No approvals require your action</p>
      <p class="ems-empty__msg">
        When you are an eligible approver for a pending request, it appears here. Eligibility is re-checked by the
        server when you act.
      </p>
    </template>

    <div v-if="tasksState === 'ready'" class="ems-form">
      <p class="ems-small ems-muted">
        The inbox is a read-time view of actionable assignments. It never substitutes an approver and never
        bypasses the decision record.
      </p>
      <div class="ems-table-scroll">
        <table class="ems-table ems-approval-table">
          <thead>
            <tr>
              <th scope="col">Decision</th>
              <th scope="col">Resource</th>
              <th scope="col">Amount</th>
              <th scope="col">Level</th>
              <th scope="col">Deadline</th>
              <th scope="col" class="ems-approval-actions-head">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.assignment_number">
              <td>
                <button type="button" class="ems-link ems-approval-link" @click="openDetails(task.request_number)">
                  {{ task.decision_type }}
                </button>
                <div class="ems-small ems-muted">{{ task.request_number }}</div>
              </td>
              <td>
                {{ task.module }} / {{ task.resource_type }}
                <div class="ems-small ems-muted">{{ task.resource_number }}</div>
              </td>
              <td>{{ task.amount === null || task.amount === undefined ? '—' : formatAmount(task.amount) }}</td>
              <td>Level {{ task.approval_level }}</td>
              <td>
                <span v-if="task.overdue" class="ems-badge ems-badge--danger">Overdue</span>
                <span v-else-if="task.reminder" class="ems-badge ems-badge--warn">Due soon</span>
                <span v-else class="ems-badge ems-badge--muted">{{ formatDate(task.deadline_at) }}</span>
              </td>
              <td>
                <button type="button" class="ems-link" @click="openDetails(task.request_number)">Review</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </EmsContentPanel>

  <EmsContentPanel
    title="Approval requests"
    icon="bi bi-check2-square"
    description="Organisation-scoped approval requests and their snapshotted authority paths."
    :count="requests.length"
    count-noun="request"
    count-noun-plural="requests"
    :state="listState"
    :error-message="listError"
  >
    <template #actions>
      <button type="button" class="ems-btn ems-btn--ghost" :disabled="listState === 'loading'" @click="applyFilters">
        Refresh
      </button>
      <button v-if="canManageWorkflow" type="button" class="ems-btn ems-btn--primary" @click="openCreate()">
        New request
      </button>
    </template>

    <template #empty>
      <p class="ems-empty__title">No approval requests yet</p>
      <p class="ems-empty__msg">
        Create a request to have the configured decision authority resolve the required approval path.
      </p>
      <div v-if="canManageWorkflow" class="ems-actions" style="justify-content: center; margin-top: 14px;">
        <button type="button" class="ems-btn ems-btn--primary" @click="openCreate()">Create the first request</button>
      </div>
    </template>

    <div v-if="listState === 'ready'" class="ems-form">
      <p v-if="enrichmentWarning" class="ems-small ems-muted">{{ enrichmentWarning }}</p>

      <div class="ems-toolbar">
        <select v-model="filters.status" class="ems-select" aria-label="Filter by status">
          <option value="ALL">All statuses</option>
          <option v-for="status in requestStatuses" :key="status" :value="status">{{ status }}</option>
        </select>
        <input v-model="filters.module" class="ems-field__input ems-filter-input" placeholder="Module" aria-label="Filter by module" />
        <input v-model="filters.resource_type" class="ems-field__input ems-filter-input" placeholder="Resource type" aria-label="Filter by resource type" />
        <input v-model="filters.resource_number" class="ems-field__input ems-filter-input" placeholder="Resource number" aria-label="Filter by resource number" @keyup.enter="applyFilters" />
        <button type="button" class="ems-btn" @click="applyFilters">Apply</button>
        <button type="button" class="ems-btn ems-btn--ghost" @click="clearFilters">Clear</button>
      </div>

      <div class="ems-table-scroll">
        <table class="ems-table ems-approval-table">
          <thead>
            <tr>
              <th scope="col">Request</th>
              <th scope="col">Resource</th>
              <th scope="col">Amount</th>
              <th scope="col">Unit</th>
              <th scope="col">Status</th>
              <th scope="col">Level</th>
              <th scope="col">Created</th>
              <th scope="col" class="ems-approval-actions-head">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in requests" :key="request.number">
              <td>
                <button type="button" class="ems-link ems-approval-link" @click="openDetails(request.number)">
                  {{ request.decision_type }}
                </button>
                <div class="ems-small ems-muted">{{ request.number }}</div>
                <div v-if="request.stalled" class="ems-small ems-muted">stalled — no eligible candidate</div>
              </td>
              <td>
                {{ request.module }} / {{ request.resource_type }}
                <div class="ems-small ems-muted">{{ request.resource_number }}</div>
              </td>
              <td>{{ request.amount === null || request.amount === undefined ? '—' : formatAmount(request.amount) }}</td>
              <td>{{ request.organisation_unit_number ? unitLabel(request.organisation_unit_number) : 'Organisation-wide' }}</td>
              <td><span class="ems-badge" :class="requestStatusClass(request.status)">{{ request.status }}</span></td>
              <td>Level {{ request.current_level }}</td>
              <td class="ems-small ems-muted">{{ formatDate(request.created_at) }}</td>
              <td>
                <button type="button" class="ems-link" @click="openDetails(request.number)">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="hasMore" class="ems-actions" style="justify-content: center; margin-top: 12px;">
        <button type="button" class="ems-btn" :disabled="loadingMore" @click="loadMore">
          {{ loadingMore ? 'Loading…' : 'Load more' }}
        </button>
      </div>
    </div>
  </EmsContentPanel>

  <EmsContentPanel
    title="Workflow deadline"
    icon="bi bi-clock-history"
    description="The organisation's default advisory deadline for new approval requests."
    :state="deadlineState"
    :error-message="deadlineError"
  >
    <div class="ems-form">
      <p class="ems-small ems-muted">
        Current default: <strong>{{ deadlineConfig?.default_deadline_hours ?? '—' }} hours</strong>. The default
        applies to new requests; existing requests keep the deadline stored when they were created. Deadlines are
        advisory and never change a request's status.
      </p>
      <div v-if="canManageWorkflow" class="ems-toolbar">
        <label class="ems-field">
          <span class="ems-field__label">Default deadline (hours)</span>
          <span class="ems-field__control" :class="{ 'ems-field__control--error': !!deadlineFormError }">
            <input v-model="deadlineHours" class="ems-field__input" type="number" inputmode="numeric" min="1" max="8760" />
          </span>
          <span v-if="deadlineFormError" class="ems-field__error">{{ deadlineFormError }}</span>
          <span v-else class="ems-small ems-muted">Between 1 and 8760 hours.</span>
        </label>
        <div class="ems-field" style="align-self: flex-end;">
          <button type="button" class="ems-btn ems-btn--primary" :disabled="deadlineSaving" @click="saveDeadline">
            {{ deadlineSaving ? 'Saving…' : 'Save default' }}
          </button>
        </div>
      </div>
      <p v-else class="ems-small ems-muted">You can view the deadline but not change it.</p>
    </div>
  </EmsContentPanel>

  <!-- Create / resubmit request -->
  <EmsModal
    :open="createOpen"
    :title="createMode === 'resubmit' ? 'Resubmit returned request' : 'New approval request'"
    icon="bi bi-plus-square"
    @close="closeCreate"
  >
    <div class="ems-form">
      <div v-if="createMode === 'resubmit'" class="ems-alert ems-alert--info" role="status">
        Resubmitting returned request <strong>{{ createForm.previous_request_number }}</strong>. The authority path
        is resolved again; the previous decision path is never reused.
      </div>

      <p class="ems-small ems-muted">
        The module and resource fields identify the business record generically. This engine does not process
        Finance, Procurement or any other business transaction.
      </p>

      <div class="ems-toolbar">
        <EmsField v-model="createForm.module" label="Module" required placeholder="e.g. finance" :error="createErrors.module" />
        <EmsField v-model="createForm.resource_type" label="Resource type" required placeholder="e.g. purchase_request" :error="createErrors.resource_type" />
      </div>
      <EmsField v-model="createForm.resource_number" label="Resource number" required placeholder="Business record reference" :error="createErrors.resource_number" />

      <label class="ems-field">
        <span class="ems-field__label">Decision type<span class="ems-field__req">*</span></span>
        <span class="ems-field__control" :class="{ 'ems-field__control--error': !!createErrors.decision_type }">
          <input v-model="createForm.decision_type" class="ems-field__input" list="ems-approval-decision-types" placeholder="e.g. purchase" autocomplete="off" />
        </span>
        <datalist id="ems-approval-decision-types">
          <option v-for="type in decisionTypes" :key="type" :value="type"></option>
        </datalist>
        <span v-if="createErrors.decision_type" class="ems-field__error">{{ createErrors.decision_type }}</span>
        <span v-else class="ems-small ems-muted">The authority resolver uses this decision type and the amount.</span>
      </label>

      <div class="ems-toolbar">
        <EmsField v-model="createForm.amount" label="Amount (optional)" type="number" inputmode="decimal" :error="createErrors.amount" />
        <label class="ems-field">
          <span class="ems-field__label">Organisation unit (optional)</span>
          <span class="ems-field__control">
            <select v-model="createForm.organisation_unit_number" class="ems-field__input">
              <option value="">Organisation-wide</option>
              <option v-for="unit in units" :key="unit.number" :value="unit.number">
                {{ unit.name }}{{ unit.status !== 'ACTIVE' ? ' — inactive' : '' }}
              </option>
            </select>
          </span>
        </label>
      </div>

      <label class="ems-field">
        <span class="ems-field__label">Deadline (optional)</span>
        <span class="ems-field__control" :class="{ 'ems-field__control--error': !!createErrors.deadline_at }">
          <input v-model="createForm.deadline_at" class="ems-field__input" type="datetime-local" />
        </span>
        <span v-if="createErrors.deadline_at" class="ems-field__error">{{ createErrors.deadline_at }}</span>
        <span v-else class="ems-small ems-muted">Advisory only. If omitted, the organisation default applies.</span>
      </label>

      <EmsField
        v-model="createForm.previous_request_number"
        label="Previous request number (optional)"
        placeholder="Returned request being corrected"
        :error="createErrors.previous_request_number"
      />

      <div v-if="canViewAuthority" class="ems-authority-preview">
        <button type="button" class="ems-btn ems-btn--ghost" :disabled="authorityLoading" @click="previewAuthority">
          {{ authorityLoading ? 'Checking…' : 'Check authority path' }}
        </button>
        <p class="ems-small ems-muted" style="margin-top: 6px;">
          Preview only. The path is resolved again and snapshotted when the request is created.
        </p>
        <div v-if="authorityError" class="ems-alert ems-alert--error" role="alert">{{ authorityError }}</div>
        <div v-else-if="authorityPreview">
          <div v-if="!authorityPreview.configured" class="ems-alert ems-alert--info" role="status">
            No authority is configured for this decision type.
          </div>
          <div v-else-if="!authorityPreview.required_path.length" class="ems-alert ems-alert--info" role="status">
            Authority is configured, but no definition applies to this unit scope.
          </div>
          <template v-else>
            <div v-if="authorityPreview.exceeds_declared_authority" class="ems-alert ems-alert--error" role="alert">
              The amount exceeds the declared authority for this scope. The request will be refused.
            </div>
            <ol class="ems-authority-path">
              <li v-for="level in authorityPreview.required_path" :key="level.approval_level" class="ems-authority-level">
                <span class="ems-badge ems-badge--ok">Level {{ level.approval_level }}</span>
                <ul class="ems-authority-anchors">
                  <li v-for="(anchor, index) in level.anchors" :key="`${anchor.type}-${anchor.value}-${anchor.organisation_unit_number}-${index}`">
                    <strong>{{ anchorLabel(anchor) }}</strong>
                    <span class="ems-small ems-muted"> · {{ anchor.organisation_unit_number ? unitLabel(anchor.organisation_unit_number) : 'Organisation-wide' }}</span>
                  </li>
                </ul>
              </li>
            </ol>
          </template>
        </div>
      </div>

      <div v-if="createErrors.general" class="ems-alert ems-alert--error" role="alert">
        {{ createErrors.general }}
      </div>
    </div>

    <template #actions>
      <button type="button" class="ems-btn ems-btn--ghost" :disabled="createSaving" @click="closeCreate">Cancel</button>
      <button type="button" class="ems-btn ems-btn--primary" :disabled="createSaving" @click="submitCreate">
        {{ createSaving ? 'Creating…' : 'Create request' }}
      </button>
    </template>
  </EmsModal>

  <!-- Details -->
  <EmsModal :open="detailsOpen" title="Approval request" icon="bi bi-check2-square" wide @close="closeDetails">
    <div v-if="selectedLoading" class="ems-small ems-muted">Loading request…</div>
    <div v-else-if="selectedError" class="ems-alert ems-alert--error" role="alert">{{ selectedError }}</div>
    <template v-else-if="selected">
      <div class="ems-approval-summary">
        <div>
          <span class="ems-small ems-muted">Decision</span>
          <strong>{{ selected.decision_type }}</strong>
        </div>
        <div>
          <span class="ems-small ems-muted">Status</span>
          <span class="ems-badge" :class="requestStatusClass(selected.status)">{{ selected.status }}</span>
        </div>
        <div>
          <span class="ems-small ems-muted">Amount</span>
          <strong>{{ selected.amount === null || selected.amount === undefined ? '—' : formatAmount(selected.amount) }}</strong>
        </div>
        <div>
          <span class="ems-small ems-muted">Level</span>
          <strong>{{ selected.current_level }}</strong>
        </div>
      </div>

      <dl class="ems-kv-card">
        <dt>Request number</dt>
        <dd class="ems-table__muted">{{ selected.number }}</dd>
        <dt>Resource</dt>
        <dd>{{ selected.module }} / {{ selected.resource_type }} / {{ selected.resource_number }}</dd>
        <dt>Unit</dt>
        <dd>{{ selected.organisation_unit_number ? unitLabel(selected.organisation_unit_number) : 'Organisation-wide' }}</dd>
        <dt>Requested by</dt>
        <dd>{{ userLabel(selected.requested_by_number) }}</dd>
        <dt>Created</dt>
        <dd>{{ formatDateTime(selected.created_at) }}</dd>
        <dt>Deadline</dt>
        <dd>
          {{ formatDateTime(selected.deadline_at) }}
          <span v-if="selected.overdue" class="ems-badge ems-badge--danger">Overdue</span>
          <span v-else-if="selected.reminder" class="ems-badge ems-badge--warn">Due soon</span>
        </dd>
        <dt v-if="selected.previous_request_number">Previous request</dt>
        <dd v-if="selected.previous_request_number">{{ selected.previous_request_number }}</dd>
      </dl>

      <div v-if="selected.status === 'BLOCKED'" class="ems-alert ems-alert--error" role="alert">
        No eligible candidate was available when this request's path was snapshotted. The engine does not
        substitute, re-resolve or auto-approve.
      </div>
      <div v-if="selected.stalled" class="ems-alert ems-alert--info" role="status">
        This request is stalled: no snapshotted candidate for the current level is currently eligible. There is
        no automatic reassignment; the requester may cancel and raise a new request.
      </div>

      <h3 class="ems-small" style="margin: 14px 0 6px; font-weight: 800; color: #5b6472;">APPROVAL PATH</h3>
      <div v-for="step in (selected.steps || [])" :key="step.number" class="ems-step-card">
        <div class="ems-step-card__head">
          <span class="ems-badge ems-badge--ok">Level {{ step.approval_level }}</span>
          <span class="ems-badge" :class="stepStatusClass(step.status)">{{ step.status }}</span>
          <span v-if="step.actionable" class="ems-badge ems-badge--warn">Actionable</span>
        </div>
        <div class="ems-small ems-muted" style="margin: 4px 0;">
          Anchors:
          <span v-for="(anchor, index) in step.anchors" :key="`${anchor.type}-${anchor.value}-${index}`">
            {{ anchorLabel(anchor) }} ({{ anchor.organisation_unit_number ? unitLabel(anchor.organisation_unit_number) : 'organisation-wide' }}){{ index < step.anchors.length - 1 ? ', ' : '' }}
          </span>
        </div>
        <div v-if="!step.assignments.length" class="ems-small ems-muted">No eligible candidate at creation.</div>
        <ul v-else class="ems-assignment-list">
          <li v-for="assignment in step.assignments" :key="assignment.number">
            <strong>{{ userLabel(assignment.user_number) }}</strong>
            <span class="ems-badge" :class="assignmentStatusClass(assignment.status)">{{ assignment.status }}</span>
            <span v-if="assignment.comment" class="ems-small ems-muted"> · {{ assignment.comment }}</span>
            <span v-if="assignment.decided_at" class="ems-small ems-muted"> · {{ formatDateTime(assignment.decided_at) }}</span>
          </li>
        </ul>
      </div>

      <div v-if="canApproveSelected" class="ems-actions" style="margin-top: 14px;">
        <button type="button" class="ems-btn ems-btn--primary" @click="openAction('approve')">Approve</button>
        <button type="button" class="ems-btn ems-btn--danger-outline" @click="openAction('reject')">Reject</button>
        <button type="button" class="ems-btn" @click="openAction('return')">Return for correction</button>
      </div>
      <div v-if="canCancelSelected || canResubmitSelected" class="ems-actions" style="margin-top: 10px;">
        <button v-if="canCancelSelected" type="button" class="ems-btn ems-btn--danger-outline" @click="openAction('cancel')">Cancel request</button>
        <button v-if="canResubmitSelected" type="button" class="ems-btn ems-btn--primary" @click="openResubmit(selected)">Resubmit</button>
      </div>
    </template>

    <template #actions>
      <button type="button" class="ems-btn ems-btn--ghost" @click="closeDetails">Close</button>
    </template>
  </EmsModal>

  <!-- Action confirmation -->
  <EmsModal :open="actionState.open" :title="actionTitle" icon="bi bi-exclamation-circle" @close="closeAction">
    <p class="ems-small">{{ actionDescription }}</p>
    <div v-if="actionState.type !== 'cancel'" class="ems-form">
      <label class="ems-field">
        <span class="ems-field__label">
          {{ actionRequiresComment ? 'Reason (required)' : 'Comment (optional)' }}
        </span>
        <span class="ems-field__control" :class="{ 'ems-field__control--error': !!actionState.error }">
          <textarea v-model="actionState.comment" class="ems-field__input" rows="3" maxlength="1000"></textarea>
        </span>
      </label>
    </div>
    <div v-if="actionState.error" class="ems-alert ems-alert--error" role="alert">{{ actionState.error }}</div>

    <template #actions>
      <button type="button" class="ems-btn ems-btn--ghost" :disabled="actionState.saving" @click="closeAction">Cancel</button>
      <button
        type="button"
        class="ems-btn"
        :class="actionState.type === 'approve' ? 'ems-btn--primary' : 'ems-btn--danger'"
        :disabled="actionState.saving"
        @click="submitAction"
      >
        {{ actionState.saving ? 'Submitting…' : actionTitle }}
      </button>
    </template>
  </EmsModal>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useAbility } from '@casl/vue'

import api from '@/config/api.js'
import { useAuthStore } from '@/main/auth/store/auth.js'
import EmsContentPanel from '@/main/ems/components/EmsContentPanel.vue'
import EmsField from '@/main/ems/components/EmsField.vue'
import EmsModal from '@/main/ems/components/EmsModal.vue'

const APPROVALS_API = 'main/ems/approvals'
const TASKS_API = 'main/ems/approval-tasks'
const DEADLINE_API = 'main/ems/workflow/deadline-config'
const UNITS_API = 'main/ems/organisation-units'
const ROLES_API = 'main/settings/roles'
const STAKEHOLDERS_API = 'main/ems/stakeholders'
const AUTHORITIES_API = 'main/ems/decision-authorities'
const RESOLVE_API = 'main/ems/authority-resolution'
const { can } = useAbility()
const authStore = useAuthStore()

const canManageWorkflow = computed(
  () => can('manage_ems_workflow', 'general') || can('manage_ems_workflow', 'all') || can('manage', 'all'),
)
const canActApproval = computed(
  () => can('act_ems_approval', 'general') || can('act_ems_approval', 'all') || can('manage', 'all'),
)
const canViewAuthority = computed(
  () =>
    can('view_ems_authority', 'general') ||
    can('manage_ems_authority', 'general') ||
    can('manage', 'all'),
)

const requestStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'RETURNED', 'CANCELLED', 'BLOCKED']
const maxCommentLen = 1000

const notice = ref(null)
const tasks = ref([])
const tasksState = ref('loading')
const tasksError = ref('')
const requests = ref([])
const listState = ref('loading')
const listError = ref('')
const loadingMore = ref(false)
const hasMore = ref(false)
const filters = reactive({ status: 'ALL', module: '', resource_type: '', resource_number: '' })
const pageOffset = ref(0)

const units = ref([])
const roles = ref([])
const stakeholders = ref([])
const authorityTypes = ref([])
const enrichmentWarning = ref('')

const deadlineConfig = ref(null)
const deadlineHours = ref('')
const deadlineState = ref('loading')
const deadlineError = ref('')
const deadlineSaving = ref(false)
const deadlineFormError = ref('')

const createOpen = ref(false)
const createMode = ref('create')
const createSaving = ref(false)
const createForm = reactive({
  module: '',
  resource_type: '',
  resource_number: '',
  decision_type: '',
  amount: '',
  organisation_unit_number: '',
  deadline_at: '',
  previous_request_number: '',
})
const createErrors = reactive({
  module: '',
  resource_type: '',
  resource_number: '',
  decision_type: '',
  amount: '',
  deadline_at: '',
  previous_request_number: '',
  general: '',
})

const authorityLoading = ref(false)
const authorityError = ref('')
const authorityPreview = ref(null)

const detailsOpen = ref(false)
const selected = ref(null)
const selectedLoading = ref(false)
const selectedError = ref('')

const actionState = reactive({ open: false, type: 'approve', comment: '', error: '', saving: false })

const currentUserNumber = computed(() => authStore.userNumber || authStore.profile?.number || '')
const unitMap = computed(() => new Map(units.value.map((unit) => [unit.number, unit])))
const roleMap = computed(() => new Map(roles.value.map((role) => [role.number, role])))
const stakeholderNameByUser = computed(() => {
  const result = new Map()
  for (const stakeholder of stakeholders.value) {
    if (stakeholder.user_number && stakeholder.display_name && !result.has(stakeholder.user_number)) {
      result.set(stakeholder.user_number, stakeholder.display_name)
    }
  }
  return result
})
const decisionTypes = computed(() =>
  [...new Set(authorityTypes.value.map((item) => (item.decision_type || '').trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  ),
)
const myTaskRequestNumbers = computed(() => new Set(tasks.value.map((task) => task.request_number)))
const canApproveSelected = computed(
  () =>
    !!selected.value &&
    canActApproval.value &&
    selected.value.status === 'PENDING' &&
    myTaskRequestNumbers.value.has(selected.value.number),
)
const canCancelSelected = computed(
  () =>
    !!selected.value &&
    canManageWorkflow.value &&
    (selected.value.status === 'PENDING' || selected.value.status === 'BLOCKED') &&
    selected.value.requested_by_number === currentUserNumber.value,
)
const canResubmitSelected = computed(
  () =>
    !!selected.value &&
    canManageWorkflow.value &&
    selected.value.status === 'RETURNED' &&
    selected.value.requested_by_number === currentUserNumber.value,
)
const actionTitle = computed(() => {
  switch (actionState.type) {
    case 'approve':
      return 'Approve request'
    case 'reject':
      return 'Reject request'
    case 'return':
      return 'Return for correction'
    default:
      return 'Cancel request'
  }
})
const actionDescription = computed(() => {
  switch (actionState.type) {
    case 'approve':
      return 'Your decision is recorded against the current level. The server re-checks your eligibility and the request state before accepting it.'
    case 'reject':
      return 'Rejection is terminal for this request. A reason is required.'
    case 'return':
      return 'Returning sends the request back to the requester for correction. A reason is required. The requester must submit a new linked request.'
    default:
      return 'Withdraw this request? This cannot be undone.'
  }
})
const actionRequiresComment = computed(() => actionState.type === 'reject' || actionState.type === 'return')

function apiError(error, fallback) {
  const status = error?.response?.status
  const message = error?.response?.data?.message
  if (status === 401) return 'Your session has expired. Please sign in again.'
  if (status === 403) return message || 'You are not authorised to perform this action.'
  if (status === 404) return message || 'The approval request was not found.'
  if (status === 409) return message || 'The request is not in a state that permits this action.'
  if (status === 400) return message || 'Please check the values and try again.'
  return message || fallback
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

function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function toIso(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function userLabel(number) {
  return stakeholderNameByUser.value.get(number) || number || '—'
}

function unitLabel(number) {
  return unitMap.value.get(number)?.name || number || '—'
}

function roleLabel(number) {
  return roleMap.value.get(number)?.name || number || '—'
}

function stakeholderTypeLabel(value) {
  const labels = {
    owner: 'Owner',
    shareholder: 'Shareholder',
    board_member: 'Board member',
    director: 'Director',
    executive: 'Executive',
    staff: 'Staff',
    consultant: 'Consultant',
    partner: 'Partner',
    other: 'Other',
  }
  return labels[value] || value || '—'
}

function anchorLabel(anchor) {
  if (!anchor) return '—'
  if (anchor.type === 'role') return `Role: ${roleLabel(anchor.value)}`
  return `Stakeholder: ${stakeholderTypeLabel(anchor.value)}`
}

function requestStatusClass(status) {
  if (status === 'APPROVED') return 'ems-badge--ok'
  if (status === 'PENDING') return 'ems-badge--warn'
  if (status === 'REJECTED' || status === 'BLOCKED') return 'ems-badge--danger'
  if (status === 'RETURNED') return 'ems-badge--warn'
  return 'ems-badge--muted'
}

function stepStatusClass(status) {
  if (status === 'APPROVED') return 'ems-badge--ok'
  if (status === 'PENDING') return 'ems-badge--warn'
  if (status === 'REJECTED' || status === 'BLOCKED') return 'ems-badge--danger'
  if (status === 'RETURNED') return 'ems-badge--warn'
  return 'ems-badge--muted'
}

function assignmentStatusClass(status) {
  if (status === 'APPROVED') return 'ems-badge--ok'
  if (status === 'UNDECIDED') return 'ems-badge--muted'
  if (status === 'REJECTED') return 'ems-badge--danger'
  if (status === 'RETURNED') return 'ems-badge--warn'
  return 'ems-badge--muted'
}

async function loadEnrichment() {
  const [unitsResult, rolesResult, stakeholdersResult, authoritiesResult] = await Promise.allSettled([
    api.get(UNITS_API, { timeout: 15000 }),
    api.get(ROLES_API, { timeout: 15000 }),
    api.get(STAKEHOLDERS_API, { timeout: 15000 }),
    canViewAuthority.value ? api.get(AUTHORITIES_API, { timeout: 15000 }) : Promise.resolve({ data: { data: [] } }),
  ])

  units.value =
    unitsResult.status === 'fulfilled' && Array.isArray(unitsResult.value?.data?.data)
      ? unitsResult.value.data.data
      : []
  roles.value =
    rolesResult.status === 'fulfilled' && Array.isArray(rolesResult.value?.data?.data)
      ? rolesResult.value.data.data
      : []
  stakeholders.value =
    stakeholdersResult.status === 'fulfilled' && Array.isArray(stakeholdersResult.value?.data?.data)
      ? stakeholdersResult.value.data.data
      : []
  authorityTypes.value =
    authoritiesResult.status === 'fulfilled' && Array.isArray(authoritiesResult.value?.data?.data)
      ? authoritiesResult.value.data.data
      : []

  if (unitsResult.status === 'rejected' || rolesResult.status === 'rejected' || stakeholdersResult.status === 'rejected') {
    enrichmentWarning.value = 'Some names or unit labels could not be loaded; identifiers are shown instead.'
  } else {
    enrichmentWarning.value = ''
  }
}

async function loadTasks() {
  tasksState.value = 'loading'
  tasksError.value = ''
  try {
    const response = await api.get(TASKS_API, { timeout: 15000 })
    tasks.value = Array.isArray(response?.data?.data) ? response.data.data : []
    tasksState.value = tasks.value.length ? 'ready' : 'empty'
  } catch (error) {
    tasksError.value = apiError(error, 'Could not load your approval tasks.')
    tasksState.value = 'error'
  }
}

async function loadRequests(reset = true) {
  if (reset) {
    listState.value = 'loading'
    listError.value = ''
    pageOffset.value = 0
  } else {
    loadingMore.value = true
  }

  const params = { limit: 50, offset: pageOffset.value }
  if (filters.status !== 'ALL') params.status = filters.status
  if (filters.module.trim()) params.module = filters.module.trim()
  if (filters.resource_type.trim()) params.resource_type = filters.resource_type.trim()
  if (filters.resource_number.trim()) params.resource_number = filters.resource_number.trim()

  try {
    const response = await api.get(APPROVALS_API, { params, timeout: 15000 })
    const data = Array.isArray(response?.data?.data) ? response.data.data : []
    requests.value = reset ? data : [...requests.value, ...data]
    pageOffset.value += data.length
    hasMore.value = data.length === params.limit
    if (reset) {
      listState.value = requests.value.length ? 'ready' : 'empty'
    }
  } catch (error) {
    if (reset) {
      listError.value = apiError(error, 'Could not load approval requests.')
      listState.value = 'error'
    } else {
      notice.value = { ok: false, text: apiError(error, 'Could not load more requests.') }
    }
  } finally {
    loadingMore.value = false
  }
}

function applyFilters() {
  loadRequests(true)
}

function clearFilters() {
  filters.status = 'ALL'
  filters.module = ''
  filters.resource_type = ''
  filters.resource_number = ''
  loadRequests(true)
}

function loadMore() {
  if (!hasMore.value || loadingMore.value) return
  loadRequests(false)
}

async function loadDeadline() {
  deadlineState.value = 'loading'
  deadlineError.value = ''
  try {
    const response = await api.get(DEADLINE_API, { timeout: 15000 })
    deadlineConfig.value = response?.data?.data || null
    deadlineHours.value = String(deadlineConfig.value?.default_deadline_hours ?? '')
    deadlineState.value = 'ready'
  } catch (error) {
    deadlineError.value = apiError(error, 'Could not load the workflow deadline configuration.')
    deadlineState.value = 'error'
  }
}

async function saveDeadline() {
  deadlineFormError.value = ''
  const hours = Number(deadlineHours.value)
  if (!Number.isInteger(hours) || hours < 1 || hours > 8760) {
    deadlineFormError.value = 'Enter a whole number between 1 and 8760.'
    return
  }
  deadlineSaving.value = true
  try {
    const response = await api.put(DEADLINE_API, { default_deadline_hours: hours }, { timeout: 15000 })
    deadlineConfig.value = response?.data?.data || deadlineConfig.value
    notice.value = { ok: true, text: 'Workflow deadline updated. Existing requests keep their stored deadline.' }
  } catch (error) {
    deadlineFormError.value = apiError(error, 'Could not update the workflow deadline.')
  } finally {
    deadlineSaving.value = false
  }
}

function resetCreateErrors() {
  for (const key of Object.keys(createErrors)) {
    createErrors[key] = ''
  }
  authorityError.value = ''
  authorityPreview.value = null
}

function openCreate() {
  resetCreateErrors()
  createMode.value = 'create'
  createForm.module = ''
  createForm.resource_type = ''
  createForm.resource_number = ''
  createForm.decision_type = ''
  createForm.amount = ''
  createForm.organisation_unit_number = ''
  createForm.deadline_at = ''
  createForm.previous_request_number = ''
  createOpen.value = true
  detailsOpen.value = false
}

function openResubmit(request) {
  resetCreateErrors()
  createMode.value = 'resubmit'
  createForm.module = request.module
  createForm.resource_type = request.resource_type
  createForm.resource_number = request.resource_number
  createForm.decision_type = request.decision_type
  createForm.amount = request.amount === null || request.amount === undefined ? '' : String(request.amount)
  createForm.organisation_unit_number = request.organisation_unit_number || ''
  createForm.deadline_at = ''
  createForm.previous_request_number = request.number
  createOpen.value = true
  detailsOpen.value = false
}

function closeCreate() {
  if (createSaving.value) return
  createOpen.value = false
}

function validateCreate() {
  resetCreateErrors()
  let valid = true
  if (!createForm.module.trim()) {
    createErrors.module = 'Module is required.'
    valid = false
  } else if (createForm.module.trim().length > 50) {
    createErrors.module = 'Module must be 50 characters or fewer.'
    valid = false
  }
  if (!createForm.resource_type.trim()) {
    createErrors.resource_type = 'Resource type is required.'
    valid = false
  } else if (createForm.resource_type.trim().length > 50) {
    createErrors.resource_type = 'Resource type must be 50 characters or fewer.'
    valid = false
  }
  if (!createForm.resource_number.trim()) {
    createErrors.resource_number = 'Resource number is required.'
    valid = false
  } else if (createForm.resource_number.trim().length > 36) {
    createErrors.resource_number = 'Resource number must be 36 characters or fewer.'
    valid = false
  }
  if (!createForm.decision_type.trim()) {
    createErrors.decision_type = 'Decision type is required.'
    valid = false
  } else if (createForm.decision_type.trim().length > 50) {
    createErrors.decision_type = 'Decision type must be 50 characters or fewer.'
    valid = false
  }
  if (createForm.amount !== '') {
    const amount = Number(createForm.amount)
    if (Number.isNaN(amount) || amount < 0) {
      createErrors.amount = 'Amount must be zero or greater.'
      valid = false
    }
  }
  if (createForm.deadline_at) {
    const deadline = new Date(createForm.deadline_at)
    if (Number.isNaN(deadline.getTime()) || deadline.getTime() <= Date.now()) {
      createErrors.deadline_at = 'Deadline must be in the future.'
      valid = false
    }
  }
  return valid
}

async function submitCreate() {
  if (createSaving.value || !validateCreate()) return
  createSaving.value = true
  try {
    const payload = {
      module: createForm.module.trim(),
      resource_type: createForm.resource_type.trim(),
      resource_number: createForm.resource_number.trim(),
      decision_type: createForm.decision_type.trim(),
      amount: createForm.amount === '' ? null : Number(createForm.amount),
      organisation_unit_number: createForm.organisation_unit_number || '',
      deadline_at: toIso(createForm.deadline_at),
      previous_request_number: createForm.previous_request_number.trim(),
    }
    const response = await api.post(APPROVALS_API, payload, { timeout: 25000 })
    const created = response?.data?.data
    createOpen.value = false
    notice.value = { ok: true, text: 'Approval request created.' }
    await Promise.all([loadTasks(), loadRequests(true)])
    if (created?.number) {
      openDetails(created.number)
    }
  } catch (error) {
    createErrors.general = apiError(error, 'Could not create the approval request.')
  } finally {
    createSaving.value = false
  }
}

async function previewAuthority() {
  authorityError.value = ''
  authorityPreview.value = null
  if (!createForm.decision_type.trim()) {
    authorityError.value = 'Enter a decision type first.'
    return
  }
  authorityLoading.value = true
  try {
    const response = await api.get(RESOLVE_API, {
      params: {
        decision_type: createForm.decision_type.trim(),
        amount: createForm.amount === '' ? 0 : Number(createForm.amount),
        organisation_unit: createForm.organisation_unit_number || '',
      },
      timeout: 15000,
    })
    authorityPreview.value = response?.data?.data || null
  } catch (error) {
    authorityError.value = apiError(error, 'Could not resolve the authority path.')
  } finally {
    authorityLoading.value = false
  }
}

async function openDetails(number) {
  detailsOpen.value = true
  selectedLoading.value = true
  selectedError.value = ''
  selected.value = null
  try {
    const response = await api.get(`${APPROVALS_API}/${number}`, { timeout: 15000 })
    selected.value = response?.data?.data || null
    if (!selected.value) {
      selectedError.value = 'The approval request could not be loaded.'
    }
  } catch (error) {
    selectedError.value = apiError(error, 'Could not load the approval request.')
  } finally {
    selectedLoading.value = false
  }
}

function closeDetails() {
  detailsOpen.value = false
  selected.value = null
  selectedError.value = ''
}

function openAction(type) {
  actionState.open = true
  actionState.type = type
  actionState.comment = ''
  actionState.error = ''
  actionState.saving = false
}

function closeAction() {
  if (actionState.saving) return
  actionState.open = false
  actionState.error = ''
  actionState.comment = ''
}

async function submitAction() {
  if (actionState.saving || !selected.value) return
  const comment = actionState.comment.trim()

  if (actionRequiresComment.value && !comment) {
    actionState.error = 'A reason is required.'
    return
  }
  if (comment.length > maxCommentLen) {
    actionState.error = `The comment must be ${maxCommentLen} characters or fewer.`
    return
  }

  actionState.saving = true
  actionState.error = ''
  try {
    const type = actionState.type
    const response = await api.post(
      `${APPROVALS_API}/${selected.value.number}/${type}`,
      type === 'cancel' ? {} : { comment },
      { timeout: 20000 },
    )
    selected.value = response?.data?.data || selected.value
    actionState.open = false
    notice.value = {
      ok: true,
      text:
        type === 'approve'
          ? 'Approval recorded.'
          : type === 'reject'
            ? 'Request rejected.'
            : type === 'return'
              ? 'Request returned for correction.'
              : 'Request cancelled.',
    }
    await Promise.all([loadTasks(), loadRequests(true)])
  } catch (error) {
    actionState.error = apiError(error, 'Could not record the decision.')
  } finally {
    actionState.saving = false
  }
}

onMounted(() => {
  loadEnrichment()
  loadTasks()
  loadRequests(true)
  loadDeadline()
})
</script>

<style scoped>
.ems-table-scroll {
  overflow-x: auto;
}

.ems-approval-table {
  min-width: 820px;
}

.ems-filter-input {
  min-width: 140px;
  flex: 1 1 140px;
}

.ems-approval-link {
  border: 0;
  background: transparent;
  padding: 0;
  font: inherit;
  font-weight: 600;
  color: var(--ems-ink);
  cursor: pointer;
  text-align: left;
}

.ems-approval-link:hover {
  color: var(--ems-brand);
  text-decoration: underline;
}

.ems-approval-actions-head {
  white-space: nowrap;
}

.ems-approval-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.ems-approval-summary > div {
  border: 1px solid #e6e9f0;
  border-radius: 10px;
  padding: 8px 10px;
  background: #fbfcfe;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ems-step-card {
  border: 1px solid #e6e9f0;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: #fbfcfe;
}

.ems-step-card__head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ems-assignment-list {
  margin: 6px 0 0;
  padding-left: 18px;
}

.ems-authority-preview {
  border-top: 1px solid #eef1f6;
  padding-top: 10px;
  margin-top: 6px;
}

.ems-authority-path {
  margin: 8px 0 0;
  padding-left: 18px;
}

.ems-authority-level {
  margin-bottom: 8px;
}

.ems-authority-anchors {
  margin: 4px 0 0;
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

@media (max-width: 700px) {
  .ems-approval-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

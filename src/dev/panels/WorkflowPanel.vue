<template>
  <div>
    <!-- A — APPROVAL REQUEST CREATION -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Foundation E1 — Create Approval Request</h2>
      </div>

      <p class="dc-note">
        The backend resolves authority, snapshots the approval path and decides status (PENDING / BLOCKED).
        The console sends only the fields below. Organisation is taken from the authenticated session.
        Deadline features are out of scope for H2.4 and are intentionally not shown.
      </p>

      <form class="dc-form" @submit.prevent="createRequest">
        <label class="dc-field">
          <span>module</span>
          <input v-model.trim="createForm.module" class="dc-input" required />
        </label>
        <label class="dc-field">
          <span>resource_type</span>
          <input v-model.trim="createForm.resource_type" class="dc-input" required />
        </label>
        <label class="dc-field">
          <span>resource_number</span>
          <input v-model.trim="createForm.resource_number" class="dc-input" required />
        </label>
        <label class="dc-field">
          <span>decision_type</span>
          <input v-model.trim="createForm.decision_type" class="dc-input" required />
        </label>
        <label class="dc-field">
          <span>amount</span>
          <input v-model.trim="createForm.amount" class="dc-input" inputmode="decimal" placeholder="optional" />
        </label>
        <label class="dc-field">
          <span>organisation_unit_number</span>
          <input v-model.trim="createForm.organisation_unit_number" class="dc-input" placeholder="optional" />
        </label>
        <button class="dc-btn dc-btn--primary" type="submit" :disabled="busy">Create request</button>
      </form>
    </section>

    <!-- B — REQUEST LIST -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Approval Requests</h2>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="loadList">Load requests</button>
      </div>

      <div class="dc-form">
        <label class="dc-field">
          <span>status</span>
          <select v-model="listFilters.status" class="dc-select">
            <option value="">(any)</option>
            <option v-for="s in requestStatuses" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>
        <label class="dc-field">
          <span>module</span>
          <input v-model.trim="listFilters.module" class="dc-input" />
        </label>
        <label class="dc-field">
          <span>resource_type</span>
          <input v-model.trim="listFilters.resource_type" class="dc-input" />
        </label>
        <label class="dc-field">
          <span>resource_number</span>
          <input v-model.trim="listFilters.resource_number" class="dc-input" />
        </label>
      </div>

      <p v-if="items.length === 0" class="dc-muted dc-small">No requests loaded.</p>

      <table v-else class="dc-table">
        <thead>
          <tr>
            <th>number</th><th>status</th><th>module</th><th>resource</th><th>decision</th>
            <th>amount</th><th>requester</th><th>level</th><th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.number" :class="{ 'dc-row--selected': item.number === selectedNumber }">
            <td class="dc-small">{{ item.number }}</td>
            <td><span class="dc-status" :class="statusClass(item.status)">{{ item.status }}</span></td>
            <td>{{ item.module }}</td>
            <td class="dc-small">{{ item.resource_type }} / {{ item.resource_number }}</td>
            <td>{{ item.decision_type }}</td>
            <td>{{ item.amount ?? '—' }}</td>
            <td class="dc-small">{{ item.requested_by_number }}</td>
            <td>{{ item.current_level }}</td>
            <td><button class="dc-btn dc-btn--ghost" type="button" @click="openRequest(item.number)">Open</button></td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- C — TASK INBOX -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Approval Task Inbox (current session)</h2>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="loadTasks">Load tasks</button>
      </div>

      <p class="dc-note">
        The backend returns only tasks the current session is actually eligible to act on (E3 stale-task suppression).
      </p>

      <p v-if="tasks.length === 0" class="dc-muted dc-small">No actionable tasks for the current session.</p>

      <table v-else class="dc-table">
        <thead>
          <tr>
            <th>request</th><th>level</th><th>step</th><th>assignment</th><th>status</th>
            <th>decision</th><th>amount</th><th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.assignment_number">
            <td class="dc-small">{{ task.request_number }}</td>
            <td>{{ task.approval_level }}</td>
            <td class="dc-small">{{ task.step_number }}</td>
            <td class="dc-small">{{ task.assignment_number }}</td>
            <td><span class="dc-status" :class="statusClass(task.request_status)">{{ task.request_status }}</span></td>
            <td>{{ task.decision_type }}</td>
            <td>{{ task.amount ?? '—' }}</td>
            <td><button class="dc-btn dc-btn--ghost" type="button" @click="openRequest(task.request_number)">Open</button></td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- D — ACTIONS -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Workflow Actions</h2>
        <span class="dc-small dc-muted">{{ selectedNumber ? `selected: ${selectedNumber}` : 'no request selected' }}</span>
      </div>

      <p class="dc-note">
        The backend is authoritative for eligibility, progression and terminal states. A 403/409 here is the
        real backend decision (e.g. self-approval, ineligible actor, already decided, not actionable).
      </p>

      <div class="dc-form">
        <label class="dc-field" style="flex: 1 1 320px;">
          <span>comment (mandatory for reject / return)</span>
          <input v-model="comment" class="dc-input" maxlength="1000" style="min-width: 320px;" />
        </label>
      </div>

      <div class="dc-actions" style="flex-wrap: wrap;">
        <button class="dc-btn dc-btn--primary" type="button" :disabled="!selectedNumber || busy" @click="approve">Approve</button>
        <button class="dc-btn" type="button" :disabled="!selectedNumber || busy" @click="reject">Reject</button>
        <button class="dc-btn" type="button" :disabled="!selectedNumber || busy" @click="returnForCorrection">Return</button>
        <button class="dc-btn dc-btn--danger" type="button" :disabled="!selectedNumber || busy" @click="cancelRequest">Cancel</button>
        <button
          class="dc-btn"
          type="button"
          :disabled="!isReturned || busy"
          :title="isReturned ? '' : 'enabled only when the selected request is RETURNED'"
          @click="resubmit"
        >
          Resubmit selected (as new request)
        </button>
      </div>

      <p v-if="errorMessage" class="dc-error">{{ errorMessage }}</p>
      <p v-if="note" class="dc-ok">{{ note }}</p>
    </section>

    <!-- E — WORKFLOW STATE -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Workflow State</h2>
        <button class="dc-btn" type="button" :disabled="!selectedNumber || busy" @click="openRequest(selectedNumber)">Refresh</button>
      </div>

      <p v-if="!selected" class="dc-muted dc-small">Open a request to inspect its snapshotted path and decisions.</p>

      <div v-else>
        <dl class="dc-kv">
          <dt>number</dt><dd>{{ selected.number }}</dd>
          <dt>status</dt><dd><span class="dc-status" :class="statusClass(selected.status)">{{ selected.status }}</span></dd>
          <dt>requester</dt><dd>{{ selected.requested_by_number }}</dd>
          <dt>module / resource</dt><dd>{{ selected.module }} / {{ selected.resource_type }} / {{ selected.resource_number }}</dd>
          <dt>decision type</dt><dd>{{ selected.decision_type }}</dd>
          <dt>amount</dt><dd>{{ selected.amount ?? '—' }}</dd>
          <dt>current level</dt><dd>{{ selected.current_level }}</dd>
          <dt>organisation unit</dt><dd>{{ selected.organisation_unit_number || '—' }}</dd>
          <dt>previous request</dt><dd>{{ selected.previous_request_number || '—' }}</dd>
        </dl>

        <h3 class="dc-small">Steps &amp; Assignments</h3>
        <table class="dc-table">
          <thead>
            <tr><th>level</th><th>step status</th><th>actionable</th><th>anchors</th><th>assignments (status)</th></tr>
          </thead>
          <tbody>
            <tr v-for="step in selected.steps" :key="step.number">
              <td>{{ step.approval_level }}</td>
              <td><span class="dc-status" :class="statusClass(step.status)">{{ step.status }}</span></td>
              <td>{{ step.actionable ? 'yes' : 'no' }}</td>
              <td class="dc-small">
                <template v-if="step.anchors && step.anchors.length">
                  <span v-for="(a, i) in step.anchors" :key="i">
                    {{ a.type }}:{{ a.value }}<span v-if="a.organisation_unit_number">@{{ a.organisation_unit_number }}</span><span v-if="i < step.anchors.length - 1">, </span>
                  </span>
                </template>
                <span v-else class="dc-muted">—</span>
              </td>
              <td class="dc-small">
                <div v-for="assignment in step.assignments" :key="assignment.number">
                  {{ assignment.user_number }}:
                  <span class="dc-status" :class="statusClass(assignment.status)">{{ assignment.status }}</span>
                  <span v-if="assignment.comment"> — “{{ assignment.comment }}”</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

import { useDevRequest } from '@/dev/composables/useDevRequest.js'

const requestStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'RETURNED', 'CANCELLED', 'BLOCKED']

const { busy, errorMessage, run } = useDevRequest()

const items = ref([])
const tasks = ref([])
const selected = ref(null)
const selectedNumber = ref('')
const comment = ref('')
const note = ref(null)

const createForm = reactive({
  module: '', resource_type: '', resource_number: '', decision_type: '', amount: '', organisation_unit_number: '',
})
const listFilters = reactive({ status: '', module: '', resource_type: '', resource_number: '' })

const isReturned = computed(() => selected.value && selected.value.status === 'RETURNED')

function statusClass(status) {
  return `dc-status--${String(status || '').toLowerCase()}`
}

function createPayload() {
  const payload = {
    module: createForm.module,
    resource_type: createForm.resource_type,
    resource_number: createForm.resource_number,
    decision_type: createForm.decision_type,
  }
  if (createForm.amount) payload.amount = Number(createForm.amount)
  if (createForm.organisation_unit_number) payload.organisation_unit_number = createForm.organisation_unit_number
  return payload
}

async function refreshAll() {
  await loadList()
  await loadTasks()
}

async function createRequest() {
  note.value = null
  const result = await run({ method: 'POST', url: '/main/ems/approvals', data: createPayload() })
  if (result.ok) {
    note.value = `Created ${result.body?.data?.number} (${result.body?.data?.status})`
    if (result.body?.data?.number) {
      selectedNumber.value = result.body.data.number
      selected.value = result.body.data
    }
    await refreshAll()
  }
}

async function loadList() {
  const params = {}
  if (listFilters.status) params.status = listFilters.status
  if (listFilters.module) params.module = listFilters.module
  if (listFilters.resource_type) params.resource_type = listFilters.resource_type
  if (listFilters.resource_number) params.resource_number = listFilters.resource_number
  const result = await run({ method: 'GET', url: '/main/ems/approvals', params })
  if (result.ok) items.value = result.body?.data || []
}

async function loadTasks() {
  const result = await run({ method: 'GET', url: '/main/ems/approval-tasks' })
  if (result.ok) tasks.value = result.body?.data || []
}

async function openRequest(number) {
  note.value = null
  selectedNumber.value = number
  const result = await run({ method: 'GET', url: `/main/ems/approvals/${number}` })
  if (result.ok) selected.value = result.body?.data || null
}

async function act(path, requireReason) {
  note.value = null
  if (requireReason && !comment.value.trim()) {
    errorMessage.value = 'A reason (comment) is required for this action.'
    return
  }
  const result = await run({ method: 'POST', url: `/main/ems/approvals/${selectedNumber.value}/${path}`, data: { comment: comment.value } })
  if (result.ok) {
    note.value = `${path} succeeded — status ${result.body?.data?.status}`
    selected.value = result.body?.data || selected.value
    await refreshAll()
  }
}

function approve() {
  return act('approve', false)
}

function reject() {
  return act('reject', true)
}

function returnForCorrection() {
  return act('return', true)
}

async function cancelRequest() {
  note.value = null
  const result = await run({ method: 'POST', url: `/main/ems/approvals/${selectedNumber.value}/cancel`, data: {} })
  if (result.ok) {
    note.value = `cancel succeeded — status ${result.body?.data?.status}`
    selected.value = result.body?.data || selected.value
    await refreshAll()
  }
}

async function resubmit() {
  if (!selected.value) return
  note.value = null
  const source = selected.value
  const payload = {
    module: source.module,
    resource_type: source.resource_type,
    resource_number: source.resource_number,
    decision_type: source.decision_type,
    previous_request_number: source.number,
  }
  if (source.amount !== null && source.amount !== undefined) payload.amount = source.amount
  if (source.organisation_unit_number) payload.organisation_unit_number = source.organisation_unit_number

  const result = await run({ method: 'POST', url: '/main/ems/approvals', data: payload })
  if (result.ok) {
    note.value = `Resubmitted as ${result.body?.data?.number} (previous ${source.number})`
    selectedNumber.value = result.body?.data?.number || selectedNumber.value
    selected.value = result.body?.data || selected.value
    await refreshAll()
  }
}
</script>

<style scoped>
.dc-row--selected {
  background: #eef4ff;
}
</style>

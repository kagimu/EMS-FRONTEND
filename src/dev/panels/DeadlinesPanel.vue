<template>
  <div>
    <!-- A — WORKFLOW DEADLINE CONFIGURATION -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Foundation E4 — Workflow Deadline Configuration</h2>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="loadConfig">Load config</button>
      </div>

      <p class="dc-note">
        Organisation-scoped default advisory deadline. The backend is authoritative. Explanatory bounds:
        minimum <strong>1 hour</strong>, maximum <strong>8760 hours</strong>, built-in default <strong>168 hours</strong>
        (7 days). A request with no explicit override receives <code>CreatedAt + DefaultDeadlineHours</code>.
        Changing the default never rewrites an existing request's deadline. Permission:
        GET needs <code>view_ems_workflow</code>; PUT needs <code>manage_ems_workflow</code>.
      </p>

      <dl v-if="config" class="dc-kv">
        <dt>organisation_number</dt><dd>{{ config.organisation_number || '—' }}</dd>
        <dt>default_deadline_hours</dt><dd>{{ config.default_deadline_hours }}</dd>
      </dl>

      <div class="dc-form">
        <label class="dc-field">
          <span>default_deadline_hours (1–8760)</span>
          <input v-model.trim="configForm.default_deadline_hours" class="dc-input" type="number" min="1" max="8760" />
        </label>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="saveConfig">Save configuration</button>
      </div>

      <p v-if="errorMessage" class="dc-error">{{ errorMessage }}</p>
      <p v-if="configNote" class="dc-ok">{{ configNote }}</p>
    </section>

    <!-- B — REQUEST DEADLINE TESTING -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Create Approval Request (with deadline)</h2>
      </div>

      <p class="dc-note">
        Mode <strong>Configured default</strong> omits <code>deadline_at</code> (no deadline action audited).
        Mode <strong>Explicit override</strong> sends <code>deadline_at</code> and is the only mode that produces
        the authoritative <code>approval.deadline_set</code> audit fact. The backend requires the override to be a
        future instant and rejects past/invalid values.
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
      </form>

      <div class="dc-form">
        <label class="dc-field">
          <span>deadline mode</span>
          <select v-model="deadlineMode" class="dc-select">
            <option value="default">Configured default (omit deadline_at)</option>
            <option value="override">Explicit override (send deadline_at)</option>
          </select>
        </label>
        <template v-if="deadlineMode === 'override'">
          <label class="dc-field">
            <span>deadline_at (UTC, RFC3339)</span>
            <input v-model.trim="deadlineAt" class="dc-input" style="min-width: 320px;" placeholder="2030-01-01T15:00:00Z" />
          </label>
          <label class="dc-field">
            <span>quick fill (hours from now)</span>
            <input v-model.trim="quickHours" class="dc-input" type="number" style="min-width: 90px;" placeholder="e.g. 25" />
          </label>
          <button class="dc-btn" type="button" @click="fillFromNow">Fill UTC</button>
        </template>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="createRequest">Create request</button>
      </div>

      <p class="dc-small dc-muted">
        Values are sent exactly as typed; the console performs no timezone conversion. <code>deadline_at</code>
        is transmitted verbatim to <code>POST /main/ems/approvals</code>.
      </p>
      <p v-if="createNote" class="dc-ok">{{ createNote }}</p>
      <p v-if="errorMessage" class="dc-error">{{ errorMessage }}</p>
    </section>

    <!-- C — DEADLINE STATE INSPECTOR -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Deadline State Inspector</h2>
        <button class="dc-btn" type="button" :disabled="!requestNumber || busy" @click="loadRequest">Load / refresh</button>
      </div>

      <div class="dc-form">
        <label class="dc-field">
          <span>approval request number</span>
          <input v-model.trim="requestNumber" class="dc-input" placeholder="request number" />
        </label>
      </div>

      <p v-if="!request" class="dc-muted dc-small">Enter a request number to inspect its backend-derived deadline state.</p>

      <div v-else>
        <p>
          <strong>Deadline state (from backend):</strong>
          <span class="dc-status" :class="stateClass(request)">{{ deadlineState(request) }}</span>
        </p>
        <dl class="dc-kv">
          <dt>number</dt><dd>{{ request.number }}</dd>
          <dt>status</dt><dd><span class="dc-status" :class="statusClass(request.status)">{{ request.status }}</span></dd>
          <dt>deadline_at</dt><dd>{{ request.deadline_at || '—' }}</dd>
          <dt>overdue</dt><dd>{{ boolText(request.overdue) }}</dd>
          <dt>reminder</dt><dd>{{ boolText(request.reminder) }}</dd>
          <dt>stalled</dt><dd>{{ boolText(request.stalled) }}</dd>
          <dt>current_level</dt><dd>{{ request.current_level }}</dd>
          <dt>requested_by_number</dt><dd>{{ request.requested_by_number }}</dd>
          <dt>decision_type</dt><dd>{{ request.decision_type }}</dd>
          <dt>created_at</dt><dd>{{ request.created_at }}</dd>
          <dt>updated_at</dt><dd>{{ request.updated_at }}</dd>
        </dl>
        <p v-if="request.overdue && request.reminder" class="dc-error">
          Backend observation: both overdue and reminder are true. Reminder and overdue are expected to be mutually
          exclusive; this is reported as returned, not corrected.
        </p>
      </div>
    </section>

    <!-- D — TEST SCENARIOS -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Deadline Test Scenarios</h2>
      </div>
      <ol class="dc-small">
        <li>Default deadline: create with mode “Configured default” → backend applies the configured default.</li>
        <li>Explicit deadline: create with mode “Explicit override” and a future <code>deadline_at</code> → backend persists it.</li>
        <li>Explicit deadline audit: the override is the only mode that records <code>approval.deadline_set</code>.</li>
        <li>Change default configuration (e.g. 168 → 24), then create a new request → it receives the new default.</li>
        <li>Existing request preservation: change the configuration and re-load an existing request → its
          <code>deadline_at</code> is unchanged.</li>
        <li>Reminder window: a request whose deadline is within 24 hours → <code>reminder = true</code>.</li>
        <li>Exact deadline boundary: at exactly <code>DeadlineAt</code> → <code>reminder = true</code>, <code>overdue = false</code>.
          (The backend/system clock is authoritative; the console does not manipulate time.)</li>
        <li>Overdue: after <code>DeadlineAt</code> → <code>overdue = true</code>; the request stays PENDING unless a
          separate authoritative workflow action changes it.</li>
        <li>Non-pending request: a non-PENDING request is never reminder/overdue merely because time passes.</li>
        <li>Permission denial: use a session without <code>manage_ems_workflow</code> to PUT the config → backend denial.</li>
        <li>Invalid configuration: 0 or 8761 hours → backend validation rejection.</li>
        <li>Past deadline: create with a past <code>deadline_at</code> → backend rejection.</li>
      </ol>
      <p class="dc-note">
        Reminder/overdue are derived at read time and create no durable notification and no audit fact. H2.5 does not
        poll, schedule or generate notifications.
      </p>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

import { useDevRequest } from '@/dev/composables/useDevRequest.js'

const { busy, errorMessage, run } = useDevRequest()

const config = ref(null)
const configForm = reactive({ default_deadline_hours: 168 })
const configNote = ref(null)

const deadlineMode = ref('default')
const deadlineAt = ref('')
const quickHours = ref('')
const createForm = reactive({
  module: '', resource_type: '', resource_number: '', decision_type: '', amount: '', organisation_unit_number: '',
})
const createNote = ref(null)

const requestNumber = ref('')
const request = ref(null)

function boolText(value) {
  return value ? 'true' : 'false'
}

function statusClass(status) {
  return `dc-status--${String(status || '').toLowerCase()}`
}

function deadlineState(req) {
  if (!req) return '—'
  if (req.overdue && req.reminder) return 'BACKEND OBSERVATION (both)'
  if (req.overdue) return 'OVERDUE'
  if (req.reminder) return 'REMINDER'
  return 'NORMAL'
}

function stateClass(req) {
  return deadlineState(req) === 'OVERDUE' ? 'dc-status--rejected'
    : deadlineState(req) === 'REMINDER' ? 'dc-status--pending'
      : 'dc-status--approved'
}

async function loadConfig() {
  configNote.value = null
  const result = await run({ method: 'GET', url: '/main/ems/workflow/deadline-config' })
  if (result.ok) {
    config.value = result.body?.data || null
    if (config.value && config.value.default_deadline_hours) {
      configForm.default_deadline_hours = config.value.default_deadline_hours
    }
  }
}

async function saveConfig() {
  configNote.value = null
  const result = await run({
    method: 'PUT',
    url: '/main/ems/workflow/deadline-config',
    data: { default_deadline_hours: Number(configForm.default_deadline_hours) },
  })
  if (result.ok) {
    config.value = result.body?.data || config.value
    if (config.value && config.value.default_deadline_hours) {
      configForm.default_deadline_hours = config.value.default_deadline_hours
    }
    configNote.value = 'Deadline configuration saved (backend response in inspector).'
  }
}

function fillFromNow() {
  const hours = Number(quickHours.value)
  if (!Number.isFinite(hours)) return
  deadlineAt.value = new Date(Date.now() + hours * 3600 * 1000).toISOString()
}

async function createRequest() {
  createNote.value = null
  const payload = {
    module: createForm.module,
    resource_type: createForm.resource_type,
    resource_number: createForm.resource_number,
    decision_type: createForm.decision_type,
  }
  if (createForm.amount) payload.amount = Number(createForm.amount)
  if (createForm.organisation_unit_number) payload.organisation_unit_number = createForm.organisation_unit_number
  if (deadlineMode.value === 'override' && deadlineAt.value) {
    // Sent verbatim; no timezone conversion is performed here.
    payload.deadline_at = deadlineAt.value
  }

  const result = await run({ method: 'POST', url: '/main/ems/approvals', data: payload })
  if (result.ok) {
    const created = result.body?.data
    createNote.value = `Created ${created?.number} (${created?.status}); deadline_at=${created?.deadline_at ?? '—'}`
    if (created?.number) {
      requestNumber.value = created.number
      request.value = created
    }
  }
}

async function loadRequest() {
  const result = await run({ method: 'GET', url: `/main/ems/approvals/${requestNumber.value}` })
  if (result.ok) request.value = result.body?.data || null
}
</script>

<style scoped>
ol {
  padding-left: 18px;
}
ol li {
  margin: 3px 0;
}
</style>

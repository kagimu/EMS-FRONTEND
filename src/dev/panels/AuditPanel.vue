<template>
  <div>
    <!-- A — ORGANISATION AUDIT (client plane) -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Foundation G1/G2 — Organisation Audit (client plane)</h2>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="loadOrg()">Load audit</button>
      </div>

      <p class="dc-note">
        Organisation-scoped, read-only. Requires <code>view_ems_audit</code>. Supported filters only:
        <code>actor</code>, <code>action</code>, <code>entity_type</code>, <code>entity_id</code>,
        <code>limit</code> (default 50, max 200), <code>offset</code>. The console never creates, edits,
        deletes or acknowledges audit records.
      </p>

      <div class="dc-form">
        <label class="dc-field"><span>actor</span><input v-model.trim="org.actor" class="dc-input" /></label>
        <label class="dc-field"><span>action</span><input v-model.trim="org.action" class="dc-input" placeholder="e.g. approval.create" /></label>
        <label class="dc-field"><span>entity_type</span><input v-model.trim="org.entity_type" class="dc-input" /></label>
        <label class="dc-field"><span>entity_id</span><input v-model.trim="org.entity_id" class="dc-input" /></label>
        <label class="dc-field"><span>limit</span><input v-model.trim="org.limit" class="dc-input" type="number" min="1" max="200" style="min-width: 80px;" /></label>
        <label class="dc-field"><span>offset</span><input v-model.trim="org.offset" class="dc-input" type="number" min="0" style="min-width: 80px;" /></label>
      </div>

      <p class="dc-small dc-muted">Total matching: {{ orgTotal === null ? '—' : orgTotal }}</p>
      <p v-if="orgItems.length === 0" class="dc-muted dc-small">No audit records loaded.</p>

      <table v-else class="dc-table">
        <thead>
          <tr><th>number</th><th>actor</th><th>action</th><th>entity</th><th>created_at</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="row in orgItems" :key="row.number">
            <td class="dc-small">{{ row.number }}</td>
            <td class="dc-small">{{ row.actor_user_number }}</td>
            <td>{{ row.action }}</td>
            <td class="dc-small">{{ row.entity_type }} / {{ row.entity_id }}</td>
            <td class="dc-small">{{ row.created_at }}</td>
            <td><button class="dc-btn dc-btn--ghost" type="button" @click="loadDetail(row.number)">Open</button></td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- B — AUDIT DETAIL (client plane) -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Audit Record Detail</h2>
        <button class="dc-btn" type="button" :disabled="!detailNumber || busy" @click="loadDetail(detailNumber)">Refresh</button>
      </div>

      <div class="dc-form">
        <label class="dc-field"><span>audit number</span><input v-model.trim="detailNumber" class="dc-input" placeholder="audit record number" /></label>
      </div>

      <p v-if="!detail" class="dc-muted dc-small">Open a record from the list, or enter its number.</p>

      <div v-else>
        <dl class="dc-kv">
          <dt>number</dt><dd>{{ detail.number }}</dd>
          <dt>organisation_number</dt><dd>{{ detail.organisation_number }}</dd>
          <dt>actor_user_number</dt><dd>{{ detail.actor_user_number }}</dd>
          <dt>action</dt><dd>{{ detail.action }}</dd>
          <dt>entity_type</dt><dd>{{ detail.entity_type }}</dd>
          <dt>entity_id</dt><dd>{{ detail.entity_id }}</dd>
          <dt>correlation_id</dt><dd>{{ detail.correlation_id || '—' }}</dd>
          <dt>workflow_instance_number</dt><dd>{{ detail.workflow_instance_number || '—' }}</dd>
          <dt>ip</dt><dd>{{ detail.ip || '—' }}</dd>
          <dt>created_at</dt><dd>{{ detail.created_at }}</dd>
        </dl>

        <h3 class="dc-small">old_values (raw JSON)</h3>
        <pre class="dc-detail">{{ pretty(detail.old_values) }}</pre>
        <h3 class="dc-small">new_values (raw JSON)</h3>
        <pre class="dc-detail">{{ pretty(detail.new_values) }}</pre>
      </div>

      <p v-if="errorMessage" class="dc-error">{{ errorMessage }}</p>
    </section>

    <!-- C — AUDIT REGISTRY (control plane) -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Audit Registry (control plane)</h2>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="loadRegistry">Load registry</button>
      </div>

      <p class="dc-note">
        Cross-organisation audit requires the explicit <code>manage_ems_audit</code> authority — there is no generic
        Admin bypass. This section never supplies an organisation for identity; the optional
        <code>organisation</code> filter is a control-plane query parameter enforced by the backend. Registry rows
        are shown inline (there is no separate registry-detail route).
      </p>

      <div class="dc-form">
        <label class="dc-field"><span>organisation</span><input v-model.trim="reg.organisation" class="dc-input" placeholder="optional org filter" /></label>
        <label class="dc-field"><span>actor</span><input v-model.trim="reg.actor" class="dc-input" /></label>
        <label class="dc-field"><span>action</span><input v-model.trim="reg.action" class="dc-input" /></label>
        <label class="dc-field"><span>entity_type</span><input v-model.trim="reg.entity_type" class="dc-input" /></label>
        <label class="dc-field"><span>entity_id</span><input v-model.trim="reg.entity_id" class="dc-input" /></label>
        <label class="dc-field"><span>limit</span><input v-model.trim="reg.limit" class="dc-input" type="number" min="1" max="200" style="min-width: 80px;" /></label>
        <label class="dc-field"><span>offset</span><input v-model.trim="reg.offset" class="dc-input" type="number" min="0" style="min-width: 80px;" /></label>
      </div>

      <p class="dc-small dc-muted">Total matching: {{ regTotal === null ? '—' : regTotal }}</p>
      <p v-if="regItems.length === 0" class="dc-muted dc-small">No registry records loaded (or the session lacks manage_ems_audit).</p>

      <table v-else class="dc-table">
        <thead>
          <tr><th>number</th><th>org</th><th>actor</th><th>action</th><th>entity</th><th>created_at</th><th></th></tr>
        </thead>
        <tbody>
          <template v-for="row in regItems" :key="row.number">
            <tr>
              <td class="dc-small">{{ row.number }}</td>
              <td class="dc-small">{{ row.organisation_number }}</td>
              <td class="dc-small">{{ row.actor_user_number }}</td>
              <td>{{ row.action }}</td>
              <td class="dc-small">{{ row.entity_type }} / {{ row.entity_id }}</td>
              <td class="dc-small">{{ row.created_at }}</td>
              <td><button class="dc-btn dc-btn--ghost" type="button" @click="toggleReg(row.number)">Details</button></td>
            </tr>
            <tr v-if="expandedReg.includes(row.number)">
              <td colspan="7">
                <pre class="dc-detail">{{ pretty({ old_values: row.old_values, new_values: row.new_values }) }}</pre>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </section>

    <!-- D — READ-ONLY / BOUNDARY GUIDANCE -->
    <section class="dc-panel">
      <div class="dc-panel__title"><h2>Audit boundaries</h2></div>
      <ul class="dc-small">
        <li>Read-only: no create/edit/delete/purge/acknowledge; audit is append-only.</li>
        <li>Authoritative actions are audited (e.g. <code>approval.create</code>, <code>approval.approve</code>,
          <code>approval.reject</code>, <code>approval.return</code>, <code>approval.cancel</code>,
          <code>approval.deadline_set</code> for an explicit deadline override, stakeholder/assignment changes,
          workflow deadline-config changes).</li>
        <li>Derived observations are NOT audited: reminder window, overdue, stalled, read-time eligibility, licence
          effective-status observation.</li>
        <li>An explicit per-request deadline override yields <code>approval.deadline_set</code>; the automatically
          applied default deadline is not separately audited.</li>
        <li>Licensing event history lives in <code>ems_licence_events</code> (Foundation F); this panel does not
          duplicate it or fabricate audit records.</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

import { useDevRequest } from '@/dev/composables/useDevRequest.js'

const { busy, errorMessage, run } = useDevRequest()

const org = reactive({ actor: '', action: '', entity_type: '', entity_id: '', limit: '50', offset: '0' })
const orgItems = ref([])
const orgTotal = ref(null)

const detailNumber = ref('')
const detail = ref(null)

const reg = reactive({ organisation: '', actor: '', action: '', entity_type: '', entity_id: '', limit: '50', offset: '0' })
const regItems = ref([])
const regTotal = ref(null)
const expandedReg = ref([])

function pretty(value) {
  if (value === null || value === undefined || value === '') return '(none)'
  try {
    return JSON.stringify(value, null, 2)
  } catch (error) {
    return String(value)
  }
}

function orgParams() {
  const params = {}
  for (const key of ['actor', 'action', 'entity_type', 'entity_id']) {
    if (org[key]) params[key] = org[key]
  }
  if (org.limit) params.limit = org.limit
  if (org.offset) params.offset = org.offset
  return params
}

function regParams() {
  const params = {}
  for (const key of ['organisation', 'actor', 'action', 'entity_type', 'entity_id']) {
    if (reg[key]) params[key] = reg[key]
  }
  if (reg.limit) params.limit = reg.limit
  if (reg.offset) params.offset = reg.offset
  return params
}

async function loadOrg() {
  const result = await run({ method: 'GET', url: '/main/ems/audit', params: orgParams() })
  if (result.ok) {
    orgItems.value = result.body?.data || []
    orgTotal.value = typeof result.body?.total === 'number' ? result.body.total : null
  }
}

async function loadDetail(number) {
  if (!number) return
  detailNumber.value = number
  const result = await run({ method: 'GET', url: `/main/ems/audit/${number}` })
  if (result.ok) detail.value = result.body?.data || null
}

async function loadRegistry() {
  const result = await run({ method: 'GET', url: '/main/ems/audit-registry', params: regParams() })
  if (result.ok) {
    regItems.value = result.body?.data || []
    regTotal.value = typeof result.body?.total === 'number' ? result.body.total : null
  }
}

function toggleReg(number) {
  const index = expandedReg.value.indexOf(number)
  if (index === -1) expandedReg.value.push(number)
  else expandedReg.value.splice(index, 1)
}
</script>

<style scoped>
ul {
  padding-left: 18px;
}
ul li {
  margin: 3px 0;
}
</style>

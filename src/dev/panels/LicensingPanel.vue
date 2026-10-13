<template>
  <div>
    <!-- A — CLIENT LICENCE STATUS -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Foundation F — Client Licence Status</h2>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="loadClientStatus()">Load status</button>
      </div>
      <p class="dc-note">
        <code>GET /main/ems/licence</code> (<code>view_licence_status</code>) returns the organisation's own
        licence. Effective status and grace are <strong>backend-derived</strong> — the console never calculates them.
        The licence key is never returned here.
      </p>
      <dl v-if="clientStatus" class="dc-kv">
        <dt>number</dt><dd>{{ clientStatus.number }}</dd>
        <dt>effective_status</dt><dd>{{ clientStatus.effective_status }}</dd>
        <dt>valid_from</dt><dd>{{ clientStatus.valid_from }}</dd>
        <dt>valid_to</dt><dd>{{ clientStatus.valid_to }}</dd>
        <dt>grace_days</dt><dd>{{ clientStatus.grace_days }}</dd>
        <dt>max_installations</dt><dd>{{ clientStatus.max_installations }}</dd>
        <dt>licensed_addons</dt><dd>{{ (clientStatus.licensed_addons || []).join(', ') || '—' }}</dd>
        <dt>renewal_requested_at</dt><dd>{{ clientStatus.renewal_requested_at || '—' }}</dd>
      </dl>
      <p v-if="!clientStatus" class="dc-muted dc-small">No client licence status loaded.</p>
    </section>

    <!-- B — CLIENT INSTALLATIONS -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Client Installations</h2>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="loadClientInstallations">Load installations</button>
      </div>
      <p class="dc-note"><code>GET /main/ems/licence/installations</code> (<code>view_licence_status</code>).</p>
      <p v-if="clientInstallations.length === 0" class="dc-muted dc-small">No installations loaded.</p>
      <table v-else class="dc-table">
        <thead><tr><th>number</th><th>identity</th><th>licence</th><th>status</th><th>activated_at</th><th>released_at</th></tr></thead>
        <tbody>
          <tr v-for="row in clientInstallations" :key="row.number">
            <td class="dc-small">{{ row.number }}</td>
            <td class="dc-small">{{ row.installation_identity }}</td>
            <td class="dc-small">{{ row.licence_number }}</td>
            <td>{{ row.status }}</td>
            <td class="dc-small">{{ row.activated_at }}</td>
            <td class="dc-small">{{ row.released_at || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- C — ACTIVATE / DEACTIVATE / RENEW (client) -->
    <section class="dc-panel">
      <div class="dc-panel__title"><h2>Client Actions</h2></div>

      <h3 class="dc-small">Activate installation — <code>POST /main/ems/licence/activate</code> (<code>activate_licence_installation</code>, rate-limited)</h3>
      <div class="dc-form">
        <label class="dc-field"><span>licence_key</span><input v-model.trim="activate.licence_key" class="dc-input" style="min-width: 300px;" /></label>
        <label class="dc-field"><span>installation_identity</span><input v-model.trim="activate.installation_identity" class="dc-input" /></label>
        <label class="dc-field"><span>addon_code (optional)</span><input v-model.trim="activate.addon_code" class="dc-input" /></label>
        <label class="dc-field"><span>replaces_installation_number (optional)</span><input v-model.trim="activate.replaces_installation_number" class="dc-input" /></label>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="doActivate">Activate</button>
      </div>

      <h3 class="dc-small">Deactivate own installation — <code>POST /main/ems/licence/installations/:number/deactivate</code> (<code>deactivate_own_installation</code>)</h3>
      <div class="dc-form">
        <label class="dc-field"><span>installation number</span><input v-model.trim="deactivateNumber" class="dc-input" /></label>
        <button class="dc-btn" type="button" :disabled="busy || !deactivateNumber" @click="doDeactivate">Deactivate</button>
      </div>

      <h3 class="dc-small">Request renewal — <code>POST /main/ems/licence/renewal-request</code> (<code>request_licence_renewal</code>)</h3>
      <div class="dc-form">
        <button class="dc-btn" type="button" :disabled="busy" @click="doRequestRenewal">Request renewal</button>
      </div>

      <p v-if="clientNote" class="dc-ok">{{ clientNote }}</p>
      <p v-if="errorMessage" class="dc-error">{{ errorMessage }}</p>
    </section>

    <!-- D — REGISTRY: LICENCES -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Registry — Licences (control plane)</h2>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="listLicences">List licences</button>
      </div>
      <p class="dc-note">
        Control plane requires the explicit <code>manage_licence_registry</code> authority — there is no Admin
        bypass. Filters: <code>organisation</code>, <code>status</code>.
      </p>
      <div class="dc-form">
        <label class="dc-field"><span>organisation</span><input v-model.trim="licFilters.organisation" class="dc-input" /></label>
        <label class="dc-field"><span>status</span><input v-model.trim="licFilters.status" class="dc-input" placeholder="ACTIVE / SUSPENDED / REVOKED" /></label>
      </div>
      <p v-if="licences.length === 0" class="dc-muted dc-small">No licences loaded.</p>
      <table v-else class="dc-table">
        <thead><tr><th>number</th><th>org</th><th>status</th><th>effective_status</th><th>valid_to</th><th></th></tr></thead>
        <tbody>
          <tr v-for="row in licences" :key="row.number">
            <td class="dc-small">{{ row.number }}</td>
            <td class="dc-small">{{ row.organisation_number }}</td>
            <td>{{ row.status }}</td>
            <td>{{ row.effective_status }}</td>
            <td class="dc-small">{{ row.valid_to }}</td>
            <td><button class="dc-btn dc-btn--ghost" type="button" @click="loadLicence(row.number)">Open</button></td>
          </tr>
        </tbody>
      </table>

      <h3 class="dc-small">Licence detail</h3>
      <div class="dc-form">
        <label class="dc-field"><span>licence number</span><input v-model.trim="licenceNumber" class="dc-input" /></label>
        <button class="dc-btn" type="button" :disabled="busy || !licenceNumber" @click="loadLicence(licenceNumber)">Get</button>
      </div>
      <dl v-if="licence" class="dc-kv">
        <dt>number</dt><dd>{{ licence.number }}</dd>
        <dt>organisation_number</dt><dd>{{ licence.organisation_number }}</dd>
        <dt>status</dt><dd>{{ licence.status }}</dd>
        <dt>effective_status</dt><dd>{{ licence.effective_status }}</dd>
        <dt>valid_from / valid_to</dt><dd>{{ licence.valid_from }} — {{ licence.valid_to }}</dd>
        <dt>grace_days</dt><dd>{{ licence.grace_days }}</dd>
        <dt>max_installations</dt><dd>{{ licence.max_installations }}</dd>
        <dt>licensed_addons</dt><dd>{{ (licence.licensed_addons || []).join(', ') || '—' }}</dd>
        <dt>replaced_by_number</dt><dd>{{ licence.replaced_by_number || '—' }}</dd>
        <dt>renewal_requested_at</dt><dd>{{ licence.renewal_requested_at || '—' }}</dd>
      </dl>
    </section>

    <!-- E — REGISTRY: MUTATIONS -->
    <section class="dc-panel">
      <div class="dc-panel__title"><h2>Registry — Licence Actions (control plane)</h2></div>

      <h3 class="dc-small">Issue — <code>POST /main/ems/licence-registry/licences</code> (returns the opaque key)</h3>
      <div class="dc-form">
        <label class="dc-field"><span>organisation_number</span><input v-model.trim="issue.organisation_number" class="dc-input" /></label>
        <label class="dc-field"><span>valid_from (RFC3339 UTC)</span><input v-model.trim="issue.valid_from" class="dc-input" placeholder="2030-01-01T00:00:00Z" /></label>
        <label class="dc-field"><span>valid_to (RFC3339 UTC)</span><input v-model.trim="issue.valid_to" class="dc-input" placeholder="2031-01-01T00:00:00Z" /></label>
        <label class="dc-field"><span>max_installations</span><input v-model.trim="issue.max_installations" class="dc-input" type="number" min="0" style="min-width: 90px;" /></label>
        <label class="dc-field"><span>licensed_addons (csv)</span><input v-model.trim="issue.licensed_addons" class="dc-input" placeholder="education" /></label>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="doIssue">Issue licence</button>
      </div>

      <h3 class="dc-small">Configure — <code>PUT /main/ems/licence-registry/licences/:number</code> (nil fields unchanged)</h3>
      <div class="dc-form">
        <label class="dc-field"><span>licence number</span><input v-model.trim="configure.number" class="dc-input" /></label>
        <label class="dc-field"><span>valid_to (optional)</span><input v-model.trim="configure.valid_to" class="dc-input" /></label>
        <label class="dc-field"><span>max_installations (optional)</span><input v-model.trim="configure.max_installations" class="dc-input" type="number" style="min-width: 90px;" /></label>
        <label class="dc-field"><span>licensed_addons (csv, optional)</span><input v-model.trim="configure.licensed_addons" class="dc-input" /></label>
        <button class="dc-btn" type="button" :disabled="busy || !configure.number" @click="doConfigure">Configure</button>
      </div>

      <h3 class="dc-small">Renew — <code>POST /main/ems/licence-registry/licences/:number/renew</code></h3>
      <div class="dc-form">
        <label class="dc-field"><span>licence number</span><input v-model.trim="renew.number" class="dc-input" /></label>
        <label class="dc-field"><span>valid_to (RFC3339 UTC)</span><input v-model.trim="renew.valid_to" class="dc-input" /></label>
        <button class="dc-btn" type="button" :disabled="busy || !renew.number" @click="doRenew">Renew</button>
      </div>

      <h3 class="dc-small">Replace — <code>POST /main/ems/licence-registry/licences/:number/replace</code> (new licence + key; releases old capacity-holding installations)</h3>
      <div class="dc-form">
        <label class="dc-field"><span>licence number</span><input v-model.trim="replace.number" class="dc-input" /></label>
        <label class="dc-field"><span>organisation_number</span><input v-model.trim="replace.organisation_number" class="dc-input" /></label>
        <label class="dc-field"><span>valid_from (RFC3339 UTC)</span><input v-model.trim="replace.valid_from" class="dc-input" /></label>
        <label class="dc-field"><span>valid_to (RFC3339 UTC)</span><input v-model.trim="replace.valid_to" class="dc-input" /></label>
        <label class="dc-field"><span>max_installations</span><input v-model.trim="replace.max_installations" class="dc-input" type="number" style="min-width: 90px;" /></label>
        <label class="dc-field"><span>licensed_addons (csv)</span><input v-model.trim="replace.licensed_addons" class="dc-input" /></label>
        <label class="dc-field"><span>reason (required)</span><input v-model.trim="replace.reason" class="dc-input" /></label>
        <button class="dc-btn" type="button" :disabled="busy || !replace.number" @click="doReplace">Replace</button>
      </div>

      <h3 class="dc-small">Suspend / Revoke (no body)</h3>
      <div class="dc-form">
        <label class="dc-field"><span>licence number</span><input v-model.trim="lifecycle.number" class="dc-input" /></label>
        <button class="dc-btn" type="button" :disabled="busy || !lifecycle.number" @click="doSuspend">Suspend</button>
        <button class="dc-btn dc-btn--danger" type="button" :disabled="busy || !lifecycle.number" @click="doRevoke">Revoke</button>
      </div>

      <div v-if="issuedKey" class="dc-detail">
        <strong>New licence key (shown only here; masked in the inspector):</strong>
        <pre>{{ issuedKey }}</pre>
        <p class="dc-small dc-muted">Copy this key to test client activation. It is not persisted anywhere.</p>
      </div>

      <p v-if="registryNote" class="dc-ok">{{ registryNote }}</p>
      <p v-if="errorMessage" class="dc-error">{{ errorMessage }}</p>
    </section>

    <!-- F — REGISTRY: INSTALLATIONS + RELEASE -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Registry — Installations</h2>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="listRegistryInstallations">List installations</button>
      </div>
      <p class="dc-note">Filters: <code>licence</code>, <code>organisation</code>, <code>status</code>. Release is the only action that frees capacity (F-Q3A).</p>
      <div class="dc-form">
        <label class="dc-field"><span>licence</span><input v-model.trim="instFilters.licence" class="dc-input" /></label>
        <label class="dc-field"><span>organisation</span><input v-model.trim="instFilters.organisation" class="dc-input" /></label>
        <label class="dc-field"><span>status</span><input v-model.trim="instFilters.status" class="dc-input" /></label>
      </div>
      <p v-if="registryInstallations.length === 0" class="dc-muted dc-small">No registry installations loaded.</p>
      <table v-else class="dc-table">
        <thead><tr><th>number</th><th>identity</th><th>licence</th><th>org</th><th>status</th><th>released_at</th><th></th></tr></thead>
        <tbody>
          <tr v-for="row in registryInstallations" :key="row.number">
            <td class="dc-small">{{ row.number }}</td>
            <td class="dc-small">{{ row.installation_identity }}</td>
            <td class="dc-small">{{ row.licence_number }}</td>
            <td class="dc-small">{{ row.organisation_number }}</td>
            <td>{{ row.status }}</td>
            <td class="dc-small">{{ row.released_at || '—' }}</td>
            <td>
              <button class="dc-btn dc-btn--danger" type="button" :disabled="busy" @click="openRelease(row.number)">Release</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="releaseNumber" class="dc-form">
        <label class="dc-field"><span>release installation</span><input v-model.trim="releaseNumber" class="dc-input" /></label>
        <label class="dc-field"><span>reason (required)</span><input v-model.trim="releaseReason" class="dc-input" /></label>
        <button class="dc-btn dc-btn--danger" type="button" :disabled="busy" @click="doRelease">Confirm release</button>
        <button class="dc-btn" type="button" @click="releaseNumber = ''">Cancel</button>
      </div>
    </section>

    <!-- G — REGISTRY: EVENTS -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Registry — Licence Events</h2>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="listEvents">Load events</button>
      </div>
      <p class="dc-note">
        <code>GET /main/ems/licence-registry/events</code> — authoritative <code>ems_licence_events</code> history
        (read-only). Filters: <code>licence</code>, <code>organisation</code>, <code>type</code>, <code>limit</code>,
        <code>offset</code>.
      </p>
      <div class="dc-form">
        <label class="dc-field"><span>licence</span><input v-model.trim="eventFilters.licence" class="dc-input" /></label>
        <label class="dc-field"><span>organisation</span><input v-model.trim="eventFilters.organisation" class="dc-input" /></label>
        <label class="dc-field"><span>type</span><input v-model.trim="eventFilters.type" class="dc-input" /></label>
        <label class="dc-field"><span>limit</span><input v-model.trim="eventFilters.limit" class="dc-input" type="number" min="1" max="200" style="min-width: 80px;" /></label>
        <label class="dc-field"><span>offset</span><input v-model.trim="eventFilters.offset" class="dc-input" type="number" min="0" style="min-width: 80px;" /></label>
      </div>
      <p class="dc-small dc-muted">Total: {{ eventTotal === null ? '—' : eventTotal }}</p>
      <p v-if="events.length === 0" class="dc-muted dc-small">No events loaded.</p>
      <table v-else class="dc-table">
        <thead><tr><th>number</th><th>event_type</th><th>licence</th><th>org</th><th>actor</th><th>client_initiated</th><th>created_at</th></tr></thead>
        <tbody>
          <tr v-for="row in events" :key="row.number">
            <td class="dc-small">{{ row.number }}</td>
            <td>{{ row.event_type }}</td>
            <td class="dc-small">{{ row.licence_number }}</td>
            <td class="dc-small">{{ row.organisation_number }}</td>
            <td class="dc-small">{{ row.actor_user_number }}</td>
            <td>{{ row.client_initiated ? 'yes' : 'no' }}</td>
            <td class="dc-small">{{ row.created_at }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- H — GUIDANCE -->
    <section class="dc-panel">
      <div class="dc-panel__title"><h2>Licensing boundaries</h2></div>
      <ul class="dc-small">
        <li>Effective status (ACTIVE / IN_GRACE / EXPIRED / SUSPENDED / REVOKED) and the 14-day grace are
          <strong>backend-derived</strong>; the console never computes them.</li>
        <li>The client plane never returns the licence key; only issue/replace do. The key is shown once in the
          immediate result and masked in the inspector; it is never persisted or placed in a URL/query.</li>
        <li>The registry requires <code>manage_licence_registry</code> (explicit authority, no Admin bypass); client
          actions use their own permissions (<code>view_licence_status</code>,
          <code>activate_licence_installation</code>, <code>deactivate_own_installation</code>,
          <code>request_licence_renewal</code>).</li>
        <li>Entitlement enforcement (<code>RequireLicenceEntitlement("education")</code>) applies to non-EMS
          <code>/main</code> routes; <code>/main/ems/**</code> and <code>/main/profile</code> are exempt. The console
          does not implement any entitlement gate.</li>
        <li>Owner ≠ administrator: licensing ownership is a distinct concept; no licensing authority is inferred from
          a session label.</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

import { useDevRequest } from '@/dev/composables/useDevRequest.js'

const { busy, errorMessage, run } = useDevRequest()

function csv(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

// A/B/C — client plane
const clientStatus = ref(null)
const clientInstallations = ref([])
const clientNote = ref(null)
const activate = reactive({ licence_key: '', installation_identity: '', addon_code: '', replaces_installation_number: '' })
const deactivateNumber = ref('')

async function loadClientStatus() {
  clientNote.value = null
  const result = await run({ method: 'GET', url: '/main/ems/licence' })
  if (result.ok) clientStatus.value = result.body?.data || null
}

async function loadClientInstallations() {
  const result = await run({ method: 'GET', url: '/main/ems/licence/installations' })
  if (result.ok) clientInstallations.value = result.body?.data || []
}

async function doActivate() {
  clientNote.value = null
  const payload = {
    licence_key: activate.licence_key,
    installation_identity: activate.installation_identity,
  }
  if (activate.addon_code) payload.addon_code = activate.addon_code
  if (activate.replaces_installation_number) payload.replaces_installation_number = activate.replaces_installation_number
  const result = await run({ method: 'POST', url: '/main/ems/licence/activate', data: payload })
  if (result.ok) {
    const d = result.body?.data
    clientNote.value = `Activated ${d?.installation_number} (status ${d?.status}; capacity_used ${d?.capacity_used})`
    await loadClientInstallations()
  }
}

async function doDeactivate() {
  clientNote.value = null
  const result = await run({ method: 'POST', url: `/main/ems/licence/installations/${deactivateNumber.value}/deactivate` })
  if (result.ok) {
    clientNote.value = `Deactivated ${result.body?.data?.number}`
    await loadClientInstallations()
  }
}

async function doRequestRenewal() {
  clientNote.value = null
  const result = await run({ method: 'POST', url: '/main/ems/licence/renewal-request' })
  if (result.ok) {
    clientNote.value = 'Renewal requested (backend response in inspector).'
    await loadClientStatus()
  }
}

// D/E — registry licences
const licFilters = reactive({ organisation: '', status: '' })
const licences = ref([])
const licenceNumber = ref('')
const licence = ref(null)
const issue = reactive({ organisation_number: '', valid_from: '', valid_to: '', max_installations: '', licensed_addons: '' })
const configure = reactive({ number: '', valid_to: '', max_installations: '', licensed_addons: '' })
const renew = reactive({ number: '', valid_to: '' })
const replace = reactive({ number: '', organisation_number: '', valid_from: '', valid_to: '', max_installations: '', licensed_addons: '', reason: '' })
const lifecycle = reactive({ number: '' })
const issuedKey = ref('')
const registryNote = ref(null)

async function listLicences() {
  const params = {}
  if (licFilters.organisation) params.organisation = licFilters.organisation
  if (licFilters.status) params.status = licFilters.status
  const result = await run({ method: 'GET', url: '/main/ems/licence-registry/licences', params })
  if (result.ok) licences.value = result.body?.data || []
}

async function loadLicence(number) {
  licenceNumber.value = number
  const result = await run({ method: 'GET', url: `/main/ems/licence-registry/licences/${number}` })
  if (result.ok) licence.value = result.body?.data || null
}

async function doIssue() {
  issuedKey.value = ''
  registryNote.value = null
  const payload = {
    organisation_number: issue.organisation_number,
    valid_from: issue.valid_from,
    valid_to: issue.valid_to,
    max_installations: Number(issue.max_installations),
    licensed_addons: csv(issue.licensed_addons),
  }
  const result = await run({ method: 'POST', url: '/main/ems/licence-registry/licences', data: payload })
  if (result.ok) {
    issuedKey.value = result.body?.data?.licence_key || ''
    registryNote.value = `Issued ${result.body?.data?.number}`
    await listLicences()
  }
}

async function doConfigure() {
  registryNote.value = null
  const payload = {}
  if (configure.valid_to) payload.valid_to = configure.valid_to
  if (configure.max_installations) payload.max_installations = Number(configure.max_installations)
  if (configure.licensed_addons) payload.licensed_addons = csv(configure.licensed_addons)
  const result = await run({ method: 'PUT', url: `/main/ems/licence-registry/licences/${configure.number}`, data: payload })
  if (result.ok) {
    licence.value = result.body?.data || licence.value
    registryNote.value = 'Licence configured.'
    await listLicences()
  }
}

async function doRenew() {
  registryNote.value = null
  const result = await run({ method: 'POST', url: `/main/ems/licence-registry/licences/${renew.number}/renew`, data: { valid_to: renew.valid_to } })
  if (result.ok) {
    licence.value = result.body?.data || licence.value
    registryNote.value = 'Licence renewed.'
    await listLicences()
  }
}

async function doReplace() {
  issuedKey.value = ''
  registryNote.value = null
  const payload = {
    organisation_number: replace.organisation_number,
    valid_from: replace.valid_from,
    valid_to: replace.valid_to,
    max_installations: Number(replace.max_installations),
    licensed_addons: csv(replace.licensed_addons),
    reason: replace.reason,
  }
  const result = await run({ method: 'POST', url: `/main/ems/licence-registry/licences/${replace.number}/replace`, data: payload })
  if (result.ok) {
    issuedKey.value = result.body?.data?.licence_key || ''
    registryNote.value = `Replaced with ${result.body?.data?.number}`
    await listLicences()
  }
}

async function doSuspend() {
  registryNote.value = null
  const result = await run({ method: 'POST', url: `/main/ems/licence-registry/licences/${lifecycle.number}/suspend` })
  if (result.ok) {
    licence.value = result.body?.data || licence.value
    registryNote.value = 'Licence suspended.'
    await listLicences()
  }
}

async function doRevoke() {
  registryNote.value = null
  const result = await run({ method: 'POST', url: `/main/ems/licence-registry/licences/${lifecycle.number}/revoke` })
  if (result.ok) {
    licence.value = result.body?.data || licence.value
    registryNote.value = 'Licence revoked.'
    await listLicences()
  }
}

// F — registry installations
const instFilters = reactive({ licence: '', organisation: '', status: '' })
const registryInstallations = ref([])
const releaseNumber = ref('')
const releaseReason = ref('')

async function listRegistryInstallations() {
  const params = {}
  if (instFilters.licence) params.licence = instFilters.licence
  if (instFilters.organisation) params.organisation = instFilters.organisation
  if (instFilters.status) params.status = instFilters.status
  const result = await run({ method: 'GET', url: '/main/ems/licence-registry/installations', params })
  if (result.ok) registryInstallations.value = result.body?.data || []
}

function openRelease(number) {
  releaseNumber.value = number
  releaseReason.value = ''
}

async function doRelease() {
  registryNote.value = null
  const result = await run({ method: 'POST', url: `/main/ems/licence-registry/installations/${releaseNumber.value}/release`, data: { reason: releaseReason.value } })
  if (result.ok) {
    registryNote.value = `Released ${result.body?.data?.number}`
    releaseNumber.value = ''
    releaseReason.value = ''
    await listRegistryInstallations()
  }
}

// G — registry events
const eventFilters = reactive({ licence: '', organisation: '', type: '', limit: '50', offset: '0' })
const events = ref([])
const eventTotal = ref(null)

async function listEvents() {
  const params = {}
  if (eventFilters.licence) params.licence = eventFilters.licence
  if (eventFilters.organisation) params.organisation = eventFilters.organisation
  if (eventFilters.type) params.type = eventFilters.type
  if (eventFilters.limit) params.limit = eventFilters.limit
  if (eventFilters.offset) params.offset = eventFilters.offset
  const result = await run({ method: 'GET', url: '/main/ems/licence-registry/events', params })
  if (result.ok) {
    events.value = result.body?.data || []
    eventTotal.value = typeof result.body?.total === 'number' ? result.body.total : null
  }
}
</script>

<style scoped>
ul {
  padding-left: 18px;
}
ul li {
  margin: 3px 0;
}
h3 {
  margin: 14px 0 4px;
}
</style>

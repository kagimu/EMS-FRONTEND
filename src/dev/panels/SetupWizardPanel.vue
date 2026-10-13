<template>
  <div>
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>First-Time Registration &amp; Setup</h2>
        <button class="dc-btn dc-btn--ghost" type="button" @click="goToSignIn">
          Already have an account? Sign in
        </button>
      </div>
      <p class="dc-note">
        The entry point for a <strong>new EMS installation</strong>. This guided, real-API walkthrough registers the
        first owner account and establishes the authenticated session — every step calls the <strong>existing
        backend</strong> and nothing is simulated. Steps 1–2 are public (no session needed); Step 3 signs in through the
        existing console <strong>Session</strong> store; steps 4+ use that signed-in identity. Passwords and activation
        tokens are held only in this page's memory and are never persisted or logged.
      </p>
    </section>

    <!-- STAGE 1 -->
    <section class="dc-panel">
      <div class="dc-panel__title"><h2>1. Owner Registration</h2></div>
      <p class="dc-note">
        <code>POST /auth/register</code>. Creates an <strong>Inactive</strong> user and returns an activation
        <code>tokenInfo</code>. The backend also <strong>sends a confirmation email</strong> and rolls back if that email
        fails — so registration requires working SMTP. When the user table is empty, the first user becomes the
        <strong>Admin</strong>.
      </p>
      <div class="dc-form">
        <label class="dc-field"><span>first_name</span><input v-model.trim="reg.first_name" class="dc-input" required /></label>
        <label class="dc-field"><span>second_name</span><input v-model.trim="reg.second_name" class="dc-input" required /></label>
        <label class="dc-field"><span>last_name</span><input v-model.trim="reg.last_name" class="dc-input" /></label>
        <label class="dc-field"><span>gender</span>
          <select v-model="reg.gender" class="dc-select"><option>Male</option><option>Female</option></select>
        </label>
        <label class="dc-field"><span>email</span><input v-model.trim="reg.email" class="dc-input" required /></label>
        <label class="dc-field"><span>phone</span><input v-model.trim="reg.phone" class="dc-input" required /></label>
        <button
          class="dc-btn dc-btn--primary"
          type="button"
          :disabled="busyPublic || onboarding.accountCreated"
          @click="doRegister"
        >
          {{ registerLoading ? 'Registering…' : (onboarding.accountCreated ? 'Account already registered' : 'Register owner') }}
        </button>
        <button v-if="onboarding.accountCreated" class="dc-btn" type="button" @click="startNewRegistration">
          Register a different account
        </button>
      </div>
      <p v-if="regNote" class="dc-ok">{{ regNote }}</p>
      <p v-if="flags.ownerRegistered && !onboarding.accountActivated" class="dc-note">
        An account was registered from this console. Continue to <strong>Stage 2</strong> to activate it — do
        <strong>not</strong> register again (the backend rejects a duplicate email/phone, and a second account must
        never be created by accident). To use a different identity, choose “Register a different account”.
      </p>
      <p v-if="stageError" class="dc-error">{{ stageError }}</p>
      <p v-if="registerError" class="dc-error">{{ registerError }}</p>
    </section>

    <!-- STAGE 2 -->
    <section class="dc-panel">
      <div class="dc-panel__title"><h2>2. Account Activation</h2></div>
      <p class="dc-note">
        <code>POST /auth/set-password</code>. Sets the password and activates the account. The token is the
        <code>tokenInfo</code> from Stage 1 (pre-filled) or from the registration email link. Never log or persist it.
      </p>
      <div class="dc-form">
        <label class="dc-field"><span>token</span><input v-model.trim="act.token" class="dc-input" style="min-width: 320px;" /></label>
        <label class="dc-field"><span>new password</span><input v-model="act.password" type="password" class="dc-input" autocomplete="off" /></label>
        <label class="dc-field"><span>confirm password</span><input v-model="act.confirm_password" type="password" class="dc-input" autocomplete="off" /></label>
        <button
          class="dc-btn dc-btn--primary"
          type="button"
          :disabled="busyPublic"
          @click="doActivate"
        >
          {{ activateLoading ? 'Activating account…' : 'Activate account' }}
        </button>
      </div>
      <p class="dc-note">
        The activation token above is kept <strong>in memory only</strong>. If the page was refreshed and the token is
        gone, recover through the existing backend flow — the activation link in the confirmation email, or a password
        reset — and do <strong>not</strong> register the same email again.
      </p>
      <p v-if="actNote" class="dc-ok">{{ actNote }}</p>
      <p v-if="activateError" class="dc-error">{{ activateError }}</p>
    </section>

    <!-- STAGE 3 -->
    <section class="dc-panel">
      <div class="dc-panel__title"><h2>3. Owner Sign-In</h2></div>
      <p class="dc-note">
        Signs in using the existing console <strong>Session</strong> store (<code>POST /auth/login</code>). This is the
        same authenticated session shown in the <strong>Session</strong> tab — no second authentication system is used.
        After success, the real identity and organisation context are shown below and in the Session tab.
      </p>
      <div class="dc-form">
        <label class="dc-field"><span>email</span><input v-model.trim="signin.email" class="dc-input" /></label>
        <label class="dc-field"><span>password</span><input v-model="signin.password" type="password" class="dc-input" autocomplete="off" /></label>
        <button
          class="dc-btn dc-btn--primary"
          type="button"
          :disabled="sessionStore.busy || !signin.email || !signin.password"
          @click="doSignIn"
        >
          {{ sessionStore.busy ? 'Signing in…' : 'Sign in' }}
        </button>
        <button class="dc-btn" type="button" :disabled="sessionStore.busy" @click="loadCurrentEntity()">Refresh current organisation</button>
      </div>
      <p v-if="signinError" class="dc-error">{{ signinError }}</p>
      <dl class="dc-kv">
        <dt>session</dt>
        <dd>
          <span :class="flags.ownerSignedIn ? 'dc-ok' : 'dc-error'">
            {{ flags.ownerSignedIn ? 'authenticated' : 'not authenticated' }}
          </span>
          — {{ activeSession?.label }}
        </dd>
        <dt>identity</dt><dd>{{ identityText }}</dd>
        <dt>current organisation</dt>
        <dd>{{ currentEntityText }}</dd>
      </dl>
    </section>

    <!-- STAGE 4 -->
    <section class="dc-panel">
      <div class="dc-panel__title"><h2>4. Register the Organisation</h2></div>
      <p class="dc-note">
        <code>POST /main/eos/entity/add</code> (authenticated; the creator is linked to the new entity). The backend
        does <strong>not</strong> return the new entity number, so we retrieve it via
        <code>GET /main/eos/my-entities</code>. Confirmation is required to avoid accidental duplicates.
      </p>
      <div class="dc-form">
        <label class="dc-field"><span>name</span><input v-model.trim="org.name" class="dc-input" /></label>
        <label class="dc-field"><span>phone</span><input v-model.trim="org.phone" class="dc-input" /></label>
        <label class="dc-field"><span>email</span><input v-model.trim="org.email" class="dc-input" /></label>
        <label class="dc-field"><span>address</span><input v-model.trim="org.address" class="dc-input" style="min-width: 240px;" /></label>
        <button
          class="dc-btn dc-btn--primary"
          type="button"
          :disabled="busy || !org.name || !org.phone || !org.email || !org.address"
          @click="doCreateOrg"
        >
          {{ orgCreateLoading ? 'Creating organisation…' : 'Create organisation' }}
        </button>
        <button class="dc-btn" type="button" :disabled="busy || orgCreateLoading" @click="loadMyEntities">Load my organisations</button>
      </div>
      <p v-if="myEntities.length" class="dc-small">
        My organisations:
        <span v-for="(e, i) in myEntities" :key="e.number">{{ e.name }} ({{ e.number }})<span v-if="i < myEntities.length - 1">, </span></span>
      </p>
      <p v-else class="dc-muted dc-small">No organisations loaded yet.</p>
      <p v-if="orgError" class="dc-error">{{ orgError }}</p>
    </section>

    <!-- STAGE 5 -->
    <section class="dc-panel">
      <div class="dc-panel__title"><h2>5. Set Current Organisation</h2></div>
      <p class="dc-note">
        <code>POST /main/eos/entity/current?entity_number=…</code> (membership required). Pick a number from Stage 4 or
        paste one. <code>GET /main/eos/entity/current</code> confirms the active organisation.
      </p>
      <div class="dc-form">
        <label class="dc-field"><span>entity_number</span><input v-model.trim="chosenEntity" class="dc-input" style="min-width: 320px;" /></label>
        <button
          class="dc-btn dc-btn--primary"
          type="button"
          :disabled="busy || !chosenEntity"
          @click="setCurrent"
        >
          {{ currentOrgLoading ? 'Setting current organisation…' : 'Set current organisation' }}
        </button>
      </div>
      <p class="dc-small">Current: {{ currentEntityText }}</p>
      <p v-if="currentOrgError" class="dc-error">{{ currentOrgError }}</p>
    </section>

    <!-- STAGE 6 -->
    <section class="dc-panel">
      <div class="dc-panel__title"><h2>6. Establish Ownership</h2></div>
      <p class="dc-note">
        <code>POST /main/ems/stakeholders {user_number, stakeholder_type:"owner"}</code> (needs
        <code>manage_ems_stakeholders</code>). The owner is the signed-in user's own <code>number</code>. The panel
        checks for an existing active owner first to avoid duplicates; the backend enforces ownership invariants.
      </p>
      <div class="dc-form">
        <label class="dc-field"><span>user_number</span><input v-model.trim="ownerForm.user_number" class="dc-input" style="min-width: 320px;" /></label>
        <button
          class="dc-btn dc-btn--primary"
          type="button"
          :disabled="busy || !ownerForm.user_number"
          @click="createOwner"
        >
          {{ ownerCreateLoading ? 'Creating owner stakeholder…' : 'Create owner stakeholder' }}
        </button>
        <button class="dc-btn" type="button" :disabled="busy || ownerCreateLoading" @click="checkOwner">Check existing owner</button>
      </div>
      <p v-if="ownerNote" class="dc-ok">{{ ownerNote }}</p>
      <p v-if="ownerError" class="dc-error">{{ ownerError }}</p>
    </section>

    <!-- STAGE 7 -->
    <section class="dc-panel">
      <div class="dc-panel__title"><h2>7. Add Other Users (optional)</h2></div>
      <p class="dc-note">
        <strong>Create role:</strong> <code>POST /main/settings/roles {name, description, permissions[], entity_number}</code>
        (admin). <strong>Create active user:</strong> <code>POST /main/users {…, roles:[{role_number, expiry_date}], entity_number}</code>
        — this creates an <strong>already-Active</strong> Staff user (no email activation), separate from registration.
      </p>
      <div class="dc-form">
        <label class="dc-field"><span>role name</span><input v-model.trim="roleForm.name" class="dc-input" /></label>
        <label class="dc-field"><span>entity_number</span><input v-model.trim="roleForm.entity_number" class="dc-input" /></label>
        <label class="dc-field"><span>permissions (csv)</span><input v-model.trim="roleForm.permissions" class="dc-input" placeholder="e.g. view_ems_workflow" /></label>
        <button class="dc-btn" type="button" :disabled="busy || !roleForm.name || !roleForm.entity_number" @click="createRole">
          {{ roleCreateLoading ? 'Creating role…' : 'Create role' }}
        </button>
      </div>
      <div class="dc-form">
        <label class="dc-field"><span>first_name</span><input v-model.trim="userForm.first_name" class="dc-input" /></label>
        <label class="dc-field"><span>second_name</span><input v-model.trim="userForm.second_name" class="dc-input" /></label>
        <label class="dc-field"><span>last_name</span><input v-model.trim="userForm.last_name" class="dc-input" /></label>
        <label class="dc-field"><span>gender</span><select v-model="userForm.gender" class="dc-select"><option>Male</option><option>Female</option></select></label>
        <label class="dc-field"><span>email</span><input v-model.trim="userForm.email" class="dc-input" /></label>
        <label class="dc-field"><span>phone</span><input v-model.trim="userForm.phone" class="dc-input" /></label>
        <label class="dc-field"><span>role_number</span><input v-model.trim="userForm.role_number" class="dc-input" /></label>
        <label class="dc-field"><span>expiry_date (YYYY-MM-DD)</span><input v-model.trim="userForm.expiry_date" class="dc-input" /></label>
        <label class="dc-field"><span>entity_number</span><input v-model.trim="userForm.entity_number" class="dc-input" /></label>
        <button
          class="dc-btn dc-btn--primary"
          type="button"
          :disabled="busy || !userForm.first_name || !userForm.second_name || !userForm.email || !userForm.phone || !userForm.role_number || !userForm.expiry_date || !userForm.entity_number"
          @click="createUser"
        >
          {{ userCreateLoading ? 'Creating active user…' : 'Create active user' }}
        </button>
      </div>
      <p v-if="userNote" class="dc-ok">{{ userNote }}</p>
      <p v-if="roleError || userError" class="dc-error">{{ roleError || userError }}</p>
    </section>

    <!-- STAGE 8 -->
    <section class="dc-panel">
      <div class="dc-panel__title"><h2>8. Licence &amp; Software Activation</h2></div>
      <p class="dc-note">
        Account registration is <strong>not</strong> licensing. <code>GET /main/ems/licence</code> shows this
        organisation's licence state (client plane). Issuing/suspending a licence is a <strong>privileged
        control-plane</strong> action requiring <code>manage_licence_registry</code> — use the <strong>Licensing</strong>
        tab for that, as the appropriate operator.
      </p>
      <div class="dc-form">
        <button
          class="dc-btn dc-btn--primary"
          type="button"
          :disabled="busy"
          @click="loadLicence"
        >
          {{ licenceLoadLoading ? 'Loading licence status…' : 'Review licence status' }}
        </button>
      </div>
      <dl v-if="licence" class="dc-kv">
        <dt>number</dt><dd>{{ licence.number || '—' }}</dd>
        <dt>effective_status</dt><dd>{{ licence.effective_status || '—' }}</dd>
        <dt>valid_to</dt><dd>{{ licence.valid_to || '—' }}</dd>
      </dl>
      <p v-if="licenceNote" class="dc-ok">{{ licenceNote }}</p>
      <p v-if="licenceError" class="dc-error">{{ licenceError }}</p>
    </section>

    <!-- STAGE 9 -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>9. Setup Checklist</h2>
        <button class="dc-btn" type="button" @click="resetChecklist">Reset checklist</button>
      </div>
      <table class="dc-table">
        <tbody>
          <tr v-for="row in checklist" :key="row.label">
            <th>{{ row.label }}</th>
            <td>
              <span :class="row.required ? 'dc-error' : 'dc-muted'" v-if="row.required">required</span>
              <span class="dc-muted" v-else>optional</span>
            </td>
            <td>
              <span :class="row.done ? 'dc-ok' : 'dc-muted'">{{ row.done ? 'Complete' : 'Incomplete' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="readyForConfiguration" class="dc-ok">Core setup complete — EMS is ready for further configuration.</p>
      <p v-else class="dc-error">Core setup incomplete — complete the required stages above.</p>
    </section>

    <!-- STAGE 10: developer test-system reset -->
    <section class="dc-panel dc-panel--danger">
      <div class="dc-panel__title"><h2>10. Reset Test System (developer)</h2></div>
      <p class="dc-error">
        DESTRUCTIVE DEVELOPER OPERATION. This erases <strong>all application data</strong> — every user,
        organisation, membership, licence, ownership, assignment, authority, workflow request, notification
        and audit record — from the dedicated disposable onboarding test database
        (<code>db_wholesome_onboarding_test</code>). It never touches <code>db_wholesome</code> or
        <code>db_wholesome_e2_test</code>, and the database schema is preserved. It requires a
        <strong>signed-in administrator</strong> and a backend started with the developer reset enabled.
      </p>
      <div class="dc-form">
        <label class="dc-field">
          <span>type RESET EMS TEST SYSTEM to arm</span>
          <input
            v-model="resetPhrase"
            class="dc-input"
            style="min-width: 320px;"
            autocomplete="off"
            placeholder="RESET EMS TEST SYSTEM"
          />
        </label>
        <button
          class="dc-btn dc-btn--danger"
          type="button"
          :disabled="resetLoading || resetPhrase !== resetPhraseExpected"
          @click="doResetSystem"
        >
          {{ resetLoading ? 'Resetting…' : 'Reset Test System' }}
        </button>
      </div>
      <p class="dc-muted dc-small">A separate final confirmation is shown before anything is erased.</p>
      <p v-if="resetNote" class="dc-ok">{{ resetNote }}</p>
      <p v-if="resetError" class="dc-error">{{ resetError }}</p>
    </section>

    <p v-if="errorMessage" class="dc-error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

import { sendRequest } from '@/dev/api/devApi.js'
import { useDevRequest } from '@/dev/composables/useDevRequest.js'
import { useDevInspectorStore } from '@/dev/store/devInspector.js'
import { useDevOnboardingStore } from '@/dev/store/devOnboarding.js'
import { useDevSessionStore } from '@/dev/store/devSession.js'

const emit = defineEmits(['navigate'])

const inspector = useDevInspectorStore()
const sessionStore = useDevSessionStore()
const onboarding = useDevOnboardingStore()
const { busy, errorMessage, run } = useDevRequest()

const activeSession = computed(() => sessionStore.activeSession)
const identityText = computed(() => {
  const id = activeSession.value?.identity
  if (!id) return '—'
  return `${id.firstName || ''} ${id.secondName || ''} (${id.number || '—'}, ${id.type || '—'})`
})
const currentEntityText = computed(() => {
  const e = activeSession.value?.entity
  return e && e.number ? `${e.name || '(unnamed)'} (${e.number})` : 'no active entity set'
})

const flags = reactive({
  ownerRegistered: onboarding.accountCreated,
  ownerActivated: onboarding.accountActivated,
  ownerSignedIn: false,
  organisationCreated: false,
  currentOrgSelected: false,
  ownerStakeholder: false,
  additionalUsers: false,
  licenceVerified: false,
})

// Returning-user recovery: reveal the Session tab and switch to it.
function goToSignIn() {
  onboarding.requestSignIn()
  emit('navigate', 'session')
}

// Local loading and error refs for granular UX
const registerLoading = ref(false)
const registerError = ref(null)
const activateLoading = ref(false)
const activateError = ref(null)
const orgCreateLoading = ref(false)
const orgError = ref(null)
const myEntitiesLoading = ref(false)
const currentOrgLoading = ref(false)
const currentOrgError = ref(null)
const ownerCreateLoading = ref(false)
const ownerError = ref(null)
const roleCreateLoading = ref(false)
const roleError = ref(null)
const userCreateLoading = ref(false)
const userError = ref(null)
const licenceLoadLoading = ref(false)
const licenceError = ref(null)

// Helper to extract user-friendly error from response
function getErrorMessage(result, fallback) {
  if (!result) return fallback
  if (result.status === 409) {
    const msg = result.body?.message || 'Conflict'
    return `${msg} — This endpoint requires an active organisation. If you are on a fresh installation, ensure the licence bootstrap fix has been applied, or contact the administrator.`
  }
  return result.body?.message || result.error || fallback
}

// Public endpoints (no bearer token). Recorded in the shared inspector.
const busyPublic = ref(false)
async function runPublic({ method = 'POST', url, data }) {
  busyPublic.value = true
  const result = await sendRequest({ method, url, data })
  inspector.record({ actor: 'public', ...result })
  busyPublic.value = false
  return result
}

// ---- Stage 1: register ----
const reg = reactive({ first_name: '', second_name: '', last_name: '', gender: 'Male', email: '', phone: '' })
const regNote = ref(null)
async function doRegister() {
  registerError.value = null
  regNote.value = null
  if (onboarding.accountCreated) {
    regNote.value = 'An account is already registered from this console. Use “Register a different account” to start over.'
    return
  }
  registerLoading.value = true
  try {
    const result = await runPublic({ url: '/auth/register', data: { ...reg } })
    if (result.ok) {
      act.token = result.body?.tokenInfo || ''
      flags.ownerRegistered = true
      onboarding.markRegistered({ email: reg.email })
      signin.email = reg.email
      regNote.value = 'Registered. The account is INACTIVE until Stage 2. (Registration also sends an email; the backend rolls back if email delivery fails.)'
    } else {
      registerError.value = getErrorMessage(result, 'Registration failed. Check the details and try again.')
    }
  } finally {
    registerLoading.value = false
  }
}

// Deliberate reset so a different identity can be registered — clears only local
// onboarding progress; it never deletes a backend record.
function startNewRegistration() {
  if (!window.confirm('Start a new registration? This clears the local onboarding progress for the account just registered (no backend record is deleted).')) return
  onboarding.reset()
  flags.ownerRegistered = false
  flags.ownerActivated = false
  flags.ownerSignedIn = false
  act.token = ''
  regNote.value = null
  actNote.value = null
  signin.email = ''
  signin.password = ''
  registerError.value = null
  activateError.value = null
}

// ---- Stage 2: activate ----
const act = reactive({ token: '', password: '', confirm_password: '' })
const actNote = ref(null)
async function doActivate() {
  activateError.value = null
  actNote.value = null
  activateLoading.value = true
  try {
    const result = await runPublic({ url: '/auth/set-password', data: { ...act } })
    act.password = ''
    act.confirm_password = ''
    if (result.ok) {
      flags.ownerActivated = true
      onboarding.markActivated()
      actNote.value = 'Account activated — you can now sign in (Stage 3).'
    } else {
      activateError.value = getErrorMessage(result, 'Activation failed. Check the token and passwords.')
    }
  } finally {
    activateLoading.value = false
  }
}

// ---- Stage 3: sign in ----
const signin = reactive({ email: '', password: '' })
const signinError = ref(null)
async function doSignIn() {
  const session = activeSession.value
  if (!session) return
  signinError.value = null
  try {
    await sessionStore.login(session.id, signin.email, signin.password)
    signin.password = ''
    flags.ownerSignedIn = sessionStore.activeSession?.status === 'authenticated'
    if (flags.ownerSignedIn) {
      onboarding.markSignedIn()
      ownerForm.user_number = sessionStore.activeSession?.identity?.number || ''
      await loadCurrentEntity()
    } else {
      signinError.value =
        sessionStore.activeSession?.lastError || 'Sign-in failed — check the email and password and retry.'
    }
  } finally {
    // sessionStore.busy is managed internally
  }
}

onMounted(() => {
  if (!signin.email && onboarding.registerEmail) {
    signin.email = onboarding.registerEmail
  }
})

async function loadCurrentEntity() {
  const result = await run({ method: 'GET', url: '/main/eos/entity/current' })
  if (result.ok) {
    const e = result.body?.data
    const session = sessionStore.activeSession
    if (session) session.entity = e && e.number ? e : null
    flags.currentOrgSelected = !!(e && e.number)
  }
}

// ---- Stage 4: create organisation ----
const org = reactive({ name: '', phone: '', email: '', address: '' })
const myEntities = ref([])
async function doCreateOrg() {
  orgError.value = null
  if (!window.confirm('Create this organisation? The backend creates a new Entity and links you to it.')) return
  orgCreateLoading.value = true
  try {
    const result = await run({ method: 'POST', url: '/main/eos/entity/add', data: { ...org } })
    if (result.ok) {
      flags.organisationCreated = true
      await loadMyEntities()
    } else {
      orgError.value = getErrorMessage(result, 'Organisation creation failed. Check the details and try again.')
    }
  } finally {
    orgCreateLoading.value = false
  }
}
async function loadMyEntities() {
  myEntitiesLoading.value = true
  try {
    const result = await run({ method: 'GET', url: '/main/eos/my-entities' })
    if (result.ok) {
      myEntities.value = result.body || []
      if (myEntities.value.length && !chosenEntity.value) chosenEntity.value = myEntities.value[myEntities.value.length - 1].number
      if (myEntities.value.length) flags.organisationCreated = true
    } else {
      orgError.value = getErrorMessage(result, 'Failed to load organisations.')
    }
  } finally {
    myEntitiesLoading.value = false
  }
}

// ---- Stage 5: set current ----
const chosenEntity = ref('')
async function setCurrent() {
  currentOrgError.value = null
  if (!chosenEntity.value) return
  currentOrgLoading.value = true
  try {
    const result = await run({ method: 'POST', url: '/main/eos/entity/current', params: { entity_number: chosenEntity.value } })
    if (result.ok) {
      flags.currentOrgSelected = true
      await loadCurrentEntity()
    } else {
      currentOrgError.value = getErrorMessage(result, 'Failed to set current organisation. Ensure the entity number is correct and you are a member.')
    }
  } finally {
    currentOrgLoading.value = false
  }
}

// ---- Stage 6: owner stakeholder ----
const ownerForm = reactive({ user_number: '' })
const ownerNote = ref(null)
async function checkOwner() {
  ownerNote.value = null
  ownerError.value = null
  const result = await run({ method: 'GET', url: '/main/ems/stakeholders', params: { stakeholder_type: 'owner' } })
  if (result.ok) {
    const owners = (result.body?.data || []).filter((o) => o.status === 'ACTIVE')
    flags.ownerStakeholder = owners.some((o) => o.user_number === ownerForm.user_number)
    ownerNote.value = flags.ownerStakeholder
      ? 'An active owner already exists for this user.'
      : `${owners.length} active owner(s) exist; none for this user.`
  } else {
    ownerError.value = getErrorMessage(result, 'Failed to check existing owners.')
  }
}
async function createOwner() {
  ownerError.value = null
  ownerNote.value = null
  if (!window.confirm('Create an owner stakeholder for this user? This is an ownership record.')) return
  await checkOwner()
  if (flags.ownerStakeholder) {
    ownerNote.value = 'An active owner already exists for this user — not creating a duplicate.'
    return
  }
  ownerCreateLoading.value = true
  try {
    const result = await run({ method: 'POST', url: '/main/ems/stakeholders', data: { user_number: ownerForm.user_number, stakeholder_type: 'owner' } })
    if (result.ok) {
      flags.ownerStakeholder = true
      ownerNote.value = 'Owner stakeholder created.'
    } else {
      ownerError.value = getErrorMessage(result, 'Failed to create owner stakeholder. Ensure you have the required permissions.')
    }
  } finally {
    ownerCreateLoading.value = false
  }
}

// ---- Stage 7: roles + users ----
const roleForm = reactive({ name: '', entity_number: '', permissions: '' })
const userForm = reactive({
  first_name: '', second_name: '', last_name: '', gender: 'Male', email: '', phone: '',
  role_number: '', expiry_date: '', entity_number: '',
})
const userNote = ref(null)
function csvList(value) {
  return String(value || '').split(',').map((s) => s.trim()).filter(Boolean)
}
async function createRole() {
  roleError.value = null
  userNote.value = null
  if (!roleForm.name || !roleForm.entity_number) return
  roleCreateLoading.value = true
  try {
    const payload = { name: roleForm.name, description: roleForm.name, permissions: csvList(roleForm.permissions), entity_number: roleForm.entity_number }
    const result = await run({ method: 'POST', url: '/main/settings/roles', data: payload })
    if (result.ok) userNote.value = 'Role created (see inspector for the role number).'
    else roleError.value = getErrorMessage(result, 'Role creation failed.')
  } finally {
    roleCreateLoading.value = false
  }
}
async function createUser() {
  userError.value = null
  userNote.value = null
  if (!userForm.first_name || !userForm.second_name || !userForm.email || !userForm.phone || !userForm.role_number || !userForm.expiry_date || !userForm.entity_number) return
  userCreateLoading.value = true
  try {
    const payload = {
      first_name: userForm.first_name, second_name: userForm.second_name, last_name: userForm.last_name,
      gender: userForm.gender, email: userForm.email, phone: userForm.phone,
      roles: [{ role_number: userForm.role_number, expiry_date: userForm.expiry_date }],
      entity_number: userForm.entity_number,
    }
    const result = await run({ method: 'POST', url: '/main/users', data: payload })
    if (result.ok) {
      flags.additionalUsers = true
      userNote.value = 'Active user created and linked to the organisation.'
    } else {
      userError.value = getErrorMessage(result, 'User creation failed. Ensure the role exists and you have admin rights.')
    }
  } finally {
    userCreateLoading.value = false
  }
}

// ---- Stage 8: licence ----
const licence = ref(null)
const licenceNote = ref(null)
async function loadLicence() {
  licenceError.value = null
  licenceNote.value = null
  licenceLoadLoading.value = true
  try {
    const result = await run({ method: 'GET', url: '/main/ems/licence' })
    if (result.ok) {
      licence.value = result.body?.data || null
      flags.licenceVerified = true
      licenceNote.value = 'Licence status fetched (client plane).'
    } else {
      licenceError.value = getErrorMessage(result, 'Failed to load licence status.')
    }
  } finally {
    licenceLoadLoading.value = false
  }
}

// ---- Stage 9 ----
const checklist = computed(() => [
  { label: 'Owner registered', required: true, done: flags.ownerRegistered },
  { label: 'Owner account activated', required: true, done: flags.ownerActivated },
  { label: 'Owner signed in', required: true, done: flags.ownerSignedIn && activeSession.value?.status === 'authenticated' },
  { label: 'Organisation created', required: true, done: flags.organisationCreated },
  { label: 'Current organisation selected', required: true, done: flags.currentOrgSelected },
  { label: 'Owner stakeholder established', required: true, done: flags.ownerStakeholder },
  { label: 'Additional users configured', required: false, done: flags.additionalUsers },
  { label: 'Licence status verified', required: false, done: flags.licenceVerified },
])
const readyForConfiguration = computed(() => checklist.value.filter((r) => r.required).every((r) => r.done))
function resetChecklist() {
  Object.keys(flags).forEach((key) => { flags[key] = false })
}
const stageError = computed(() => errorMessage.value)

// ---- Stage 10: developer test-system reset ----
// Destructive, developer-only. The backend independently verifies the
// environment, the disposable database identity, the admin caller and the
// confirmation phrase. Local state is cleared ONLY after the backend confirms
// success; a failure never reports success and never clears progress.
const resetPhraseExpected = 'RESET EMS TEST SYSTEM'
const resetPhrase = ref('')
const resetLoading = ref(false)
const resetError = ref(null)
const resetNote = ref(null)
async function doResetSystem() {
  resetError.value = null
  resetNote.value = null
  if (resetPhrase.value !== resetPhraseExpected) {
    resetError.value = `Type exactly “${resetPhraseExpected}” to arm the reset.`
    return
  }
  const confirmed = window.confirm(
    'FINAL CONFIRMATION: erase ALL application data in the disposable onboarding test database? This cannot be undone.',
  )
  if (!confirmed) {
    return
  }
  resetLoading.value = true
  try {
    const result = await run({
      method: 'POST',
      url: '/main/dev/reset-onboarding',
      data: { confirmation: resetPhrase.value },
    })
    if (!result.ok) {
      resetError.value = getErrorMessage(result, 'Reset failed — the backend did not confirm success.')
      return
    }
    // Backend confirmed success: only now clear local milestones and sessions.
    onboarding.reset()
    sessionStore.logoutAll()
    Object.keys(flags).forEach((key) => { flags[key] = false })
    act.token = ''
    signin.password = ''
    resetPhrase.value = ''
    resetNote.value =
      'Backend confirmed the reset. The onboarding database is empty and all sessions are signed out — start again with Step 1 (owner registration).'
  } finally {
    resetLoading.value = false
  }
}
</script>

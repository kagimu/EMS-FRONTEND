<template>
  <!-- Initial status check -->
  <EmsAuthLayout v-if="phase !== 'ready'">
    <EmsStateBlock
      :state="phase === 'error' ? 'error' : 'loading'"
      :title="phase === 'error' ? 'We could not reach EMS' : 'Preparing first-time setup'"
      :message="
        phase === 'error'
          ? errorMessage
          : 'Checking whether this installation is ready for setup…'
      "
      @retry="checkStatus"
    />
  </EmsAuthLayout>

  <!-- Payment-confirmation gate: a validated, paid setup token is required
       before the customer can create an account or subscribe. -->
  <EmsAuthLayout
    v-else-if="!gateConfirmed"
    eyebrow="Payment confirmation"
    heading="Confirm your setup payment"
  >
    <p class="ems-note">
      Enter the setup token issued after your setup payment. This confirms that you have paid and are eligible to
      continue to account setup and subscription.
    </p>
    <EmsField v-model="setupToken" label="Setup activation token" />
    <div v-if="tokenError" class="ems-alert ems-alert--error" role="alert">{{ tokenError }}</div>
    <button
      type="button"
      class="ems-btn ems-btn--primary ems-btn--block"
      :disabled="tokenChecking || !setupToken"
      @click="confirmSetupPayment"
    >
      <span v-if="tokenChecking" class="ems-btn__spinner" aria-hidden="true"></span>
      {{ tokenChecking ? 'Confirming…' : 'Confirm payment and continue' }}
    </button>
    <p class="ems-small ems-muted" style="margin-top: 12px;">
      Haven’t paid for setup yet? <button type="button" class="ems-link" @click="goToCommercial">Start installation setup</button>.
    </p>
  </EmsAuthLayout>

  <EmsAuthLayout v-else wide eyebrow="First-time setup" heading="Set up your EMS">
    <EmsSteps :steps="stepLabels" :current="step" />

    <!-- Step 0 — register owner -->
    <section v-if="step === 0" class="ems-form">
      <p class="ems-note">
        Create the initial owner account. The first account in a fresh installation becomes the EMS
        administrator; the account starts <strong>inactive</strong> until you subscribe and activate it.
      </p>
      <EmsField v-model="registerForm.first_name" label="First name" :error="formErrors.first_name" required />
      <EmsField v-model="registerForm.second_name" label="Second name" :error="formErrors.second_name" required />
      <EmsField v-model="registerForm.last_name" label="Last name" />
      <label class="ems-field">
        <span class="ems-field__label">Gender<span class="ems-field__req">*</span></span>
        <span class="ems-field__control" :class="{ 'ems-field__control--error': !!formErrors.gender }">
          <select v-model="registerForm.gender" class="ems-field__input">
            <option value="" disabled>Select…</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </span>
        <span v-if="formErrors.gender" class="ems-field__error">{{ formErrors.gender }}</span>
      </label>
      <EmsField v-model="registerForm.email" label="Email address" type="email" inputmode="email" :error="formErrors.email" required />
      <EmsField v-model="registerForm.phone" label="Phone number" inputmode="tel" :error="formErrors.phone" required />
      <div v-if="stepError" class="ems-alert ems-alert--error" role="alert">{{ stepError }}</div>
      <button type="button" class="ems-btn ems-btn--primary ems-btn--block" :disabled="loading || done.register" @click="doRegister">
        <span v-if="loading" class="ems-btn__spinner" aria-hidden="true"></span>
        {{ loading ? 'Creating account…' : done.register ? 'Account created' : 'Create owner account' }}
      </button>
    </section>

    <!-- Step 1 — subscription (the payment issues the account activation token) -->
    <section v-else-if="step === 1" class="ems-form">
      <p class="ems-note">
        Subscribe to a period of access. A successful payment issues your <strong>activation token</strong>, which you
        will enter next to activate your account.
      </p>
      <EmsSubscriptionPanel mode="onboarding" :setup-token="setupToken" @issued="onActivationTokenIssued" />
      <div v-if="stepError" class="ems-alert ems-alert--error" role="alert">{{ stepError }}</div>
      <button type="button" class="ems-btn ems-btn--primary ems-btn--block" :disabled="!activationTokenIssued" @click="goToActivate">
        Continue to account activation
      </button>
    </section>

    <!-- Step 2 — activate the account with the activation token -->
    <section v-else-if="step === 2" class="ems-form">
      <p class="ems-note">
        Enter the <strong>activation token</strong> issued after your successful subscription payment and choose a
        password to activate your account. Tokens and passwords are never stored by this page.
      </p>
      <EmsField v-model="activateForm.token" label="Activation token" :error="formErrors.token" required />
      <EmsField v-model="activateForm.password" label="New password" type="password" autocomplete="new-password" :error="formErrors.password" required />
      <EmsField v-model="activateForm.confirm_password" label="Confirm password" type="password" autocomplete="new-password" :error="formErrors.confirm_password" required />
      <div v-if="stepError" class="ems-alert ems-alert--error" role="alert">{{ stepError }}</div>
      <button type="button" class="ems-btn ems-btn--primary ems-btn--block" :disabled="loading || done.activate" @click="doActivate">
        <span v-if="loading" class="ems-btn__spinner" aria-hidden="true"></span>
        {{ loading ? 'Activating…' : done.activate ? 'Account activated' : 'Activate account' }}
      </button>
      <p class="ems-small ems-muted">
        The activation token comes from your subscription payment. If you have not subscribed yet, go back to the
        previous step.
      </p>
    </section>

    <!-- Step 3 — sign in -->
    <section v-else-if="step === 3" class="ems-form">
      <p class="ems-note">Sign in with the account you just activated. Your session is established using the existing EMS authentication.</p>
      <EmsField v-model="signInForm.email" label="Email address" type="email" inputmode="email" :error="formErrors.email2" required />
      <EmsField v-model="signInForm.password" label="Password" type="password" autocomplete="current-password" :error="formErrors.password2" required />
      <div v-if="stepError" class="ems-alert ems-alert--error" role="alert">{{ stepError }}</div>
      <button type="button" class="ems-btn ems-btn--primary ems-btn--block" :disabled="loading || done.signin" @click="doSignIn">
        <span v-if="loading" class="ems-btn__spinner" aria-hidden="true"></span>
        {{ loading ? 'Signing in…' : done.signin ? 'Signed in' : 'Sign in' }}
      </button>
    </section>

    <!-- Step 4 — organisation -->
    <section v-else-if="step === 4" class="ems-form">
      <p class="ems-note">Register your organisation. This creates the EMS entity your user will belong to.</p>
      <EmsField v-model="orgForm.name" label="Organisation name" :error="formErrors.org_name" required />
      <EmsField v-model="orgForm.phone" label="Organisation phone" inputmode="tel" :error="formErrors.org_phone" required />
      <EmsField v-model="orgForm.email" label="Organisation email" type="email" inputmode="email" :error="formErrors.org_email" required />
      <EmsField v-model="orgForm.address" label="Address" :error="formErrors.org_address" required />
      <div v-if="stepError" class="ems-alert ems-alert--error" role="alert">{{ stepError }}</div>
      <button type="button" class="ems-btn ems-btn--primary ems-btn--block" :disabled="loading || done.org" @click="doCreateOrg">
        <span v-if="loading" class="ems-btn__spinner" aria-hidden="true"></span>
        {{ loading ? 'Registering organisation…' : done.org ? 'Organisation registered' : 'Register organisation' }}
      </button>
    </section>

    <!-- Step 5 — select organisation -->
    <section v-else-if="step === 5" class="ems-form">
      <p class="ems-note">Choose the organisation to work in and set it as your current organisation.</p>
      <label class="ems-field">
        <span class="ems-field__label">Organisation</span>
        <span class="ems-field__control">
          <select v-model="selectedEntity" class="ems-field__input">
            <option v-for="entity in organisations" :key="entity.number" :value="entity.number">
              {{ entity.name }} ({{ entity.number }})
            </option>
          </select>
        </span>
      </label>
      <div v-if="stepError" class="ems-alert ems-alert--error" role="alert">{{ stepError }}</div>
      <button type="button" class="ems-btn ems-btn--primary ems-btn--block" :disabled="loading || done.select || !selectedEntity" @click="doSelectOrg">
        <span v-if="loading" class="ems-btn__spinner" aria-hidden="true"></span>
        {{ loading ? 'Setting current organisation…' : done.select ? 'Current organisation set' : 'Set current organisation' }}
      </button>
    </section>

    <!-- Step 6 — ownership -->
    <section v-else-if="step === 6" class="ems-form">
      <p class="ems-note">
        Establish the owner stakeholder for your account. Ownership is an explicit EMS relationship and is
        separate from the administrator role; this step does not change your account type.
      </p>
      <div v-if="stepError" class="ems-alert ems-alert--error" role="alert">{{ stepError }}</div>
      <button type="button" class="ems-btn ems-btn--primary ems-btn--block" :disabled="loading || done.owner" @click="doCreateOwner">
        <span v-if="loading" class="ems-btn__spinner" aria-hidden="true"></span>
        {{ loading ? 'Establishing ownership…' : done.owner ? 'Owner established' : 'Establish owner stakeholder' }}
      </button>
    </section>

    <!-- Step 7 — done -->
    <section v-else class="ems-form">
      <div class="ems-alert ems-alert--success" role="status">Your EMS installation is set up and your account is active.</div>
      <dl class="ems-kv">
        <dt>Owner account</dt><dd>{{ registerForm.email || '—' }}</dd>
        <dt>Organisation</dt><dd>{{ currentOrgLabel }}</dd>
        <dt>Ownership</dt><dd>{{ done.owner ? 'Owner stakeholder established' : '—' }}</dd>
        <dt>Subscription</dt><dd>{{ subscriptionActive ? 'Active' : '—' }}</dd>
      </dl>
      <button type="button" class="ems-btn ems-btn--primary ems-btn--block" @click="enterEms">Enter EMS</button>
    </section>

    <!-- Navigation -->
    <div class="ems-links">
      <button v-if="step > 0 && step < 7" type="button" class="ems-link" @click="back">Back</button>
      <span></span>
      <span class="ems-small ems-muted">Step {{ Math.min(step + 1, stepLabels.length) }} of {{ stepLabels.length }}</span>
    </div>
  </EmsAuthLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import axios from 'axios'
import api from '@/config/api.js'
import { useAuthStore } from '@/main/auth/store/auth.js'
import EmsAuthLayout from '@/main/ems/components/EmsAuthLayout.vue'
import EmsField from '@/main/ems/components/EmsField.vue'
import EmsStateBlock from '@/main/ems/components/EmsStateBlock.vue'
import EmsSteps from '@/main/ems/components/EmsSteps.vue'
import EmsSubscriptionPanel from '@/main/ems/components/EmsSubscriptionPanel.vue'
import { SETUP_INITIALIZED, fetchSetupStatus } from '@/main/ems/services/setupStatus.js'

const router = useRouter()
const authStore = useAuthStore()
const baseURL = `${import.meta.env.VITE_APP_BASE_URL}`

const stepLabels = ['Owner account', 'Subscription', 'Activate account', 'Sign in', 'Organisation', 'Select', 'Ownership', 'Finish']

const phase = ref('loading') // loading | error | ready
const errorMessage = ref('')
// Payment-confirmation gate: the raw setup token is held in memory only and is
// required (validated) before the customer can create an account or subscribe.
const gateConfirmed = ref(false)
const setupToken = ref('')
const tokenError = ref('')
const tokenChecking = ref(false)
// Activation token issued by the (onboarding) subscription payment; the account
// is activated with it. registrationToken is the account's registration token
// (held in memory) used to set the password.
const activationTokenIssued = ref(false)
const activationToken = ref('')
const registrationToken = ref('')
const subscriptionActive = ref(false)
const step = ref(0)
const loading = ref(false)
const stepError = ref('')

const done = reactive({ register: false, activate: false, signin: false, org: false, select: false, owner: false })

const registerForm = reactive({ first_name: '', second_name: '', last_name: '', gender: '', email: '', phone: '' })
const activateForm = reactive({ token: '', password: '', confirm_password: '' })
const signInForm = reactive({ email: '', password: '' })
const orgForm = reactive({ name: '', phone: '', email: '', address: '' })

const formErrors = reactive({
  first_name: '', second_name: '', gender: '', email: '', phone: '',
  token: '', password: '', confirm_password: '',
  email2: '', password2: '',
  org_name: '', org_phone: '', org_email: '', org_address: '',
})

const organisations = ref([])
const selectedEntity = ref('')
const currentOrgLabel = ref('—')

const currentOwnerNumber = computed(() => authStore.profile?.number || authStore.userNumber || '')

onMounted(checkStatus)

async function checkStatus() {
  phase.value = 'loading'
  errorMessage.value = ''
  try {
    const state = await fetchSetupStatus()
    if (state === SETUP_INITIALIZED) {
      // The installation is already configured — setup is not permitted.
      router.replace({ name: 'login' })
      return
    }
    phase.value = 'ready'
  } catch (error) {
    errorMessage.value = 'We could not establish the installation status. Check your connection and try again.'
    phase.value = 'error'
  }
}

// Confirm the setup payment by validating the setup token (public, read-only).
// The raw token is kept in memory only — never persisted or logged.
async function confirmSetupPayment() {
  tokenError.value = ''
  if (!setupToken.value) {
    return
  }
  tokenChecking.value = true
  try {
    await axios.post(`${baseURL}/setup/tokens/validate`, { token: setupToken.value }, {
      headers: { Accept: 'application/json' },
      timeout: 15000,
    })
    gateConfirmed.value = true
  } catch (error) {
    tokenError.value = error?.response?.data?.message || 'This setup token is not valid. Check it and try again.'
  } finally {
    tokenChecking.value = false
  }
}

function goToCommercial() {
  router.push({ name: 'ems-commercial' })
}

function clearErrors() {
  Object.keys(formErrors).forEach((key) => {
    formErrors[key] = ''
  })
  stepError.value = ''
}

function back() {
  clearErrors()
  if (step.value > 0) {
    step.value -= 1
  }
}

function safeMessage(error, fallback) {
  const message = error?.response?.data?.message || error?.message
  if (typeof message === 'string' && message.length > 0) {
    return message
  }
  return fallback
}

// ---- Step 0: register ----
function validateRegister() {
  formErrors.first_name = registerForm.first_name ? '' : 'Enter a first name.'
  formErrors.second_name = registerForm.second_name ? '' : 'Enter a second name.'
  formErrors.gender = (registerForm.gender === 'Male' || registerForm.gender === 'Female') ? '' : 'Select a gender.'
  formErrors.email = /^\S+@\S+\.\S+$/.test(registerForm.email) ? '' : 'Enter a valid email address.'
  formErrors.phone = registerForm.phone ? '' : 'Enter a phone number.'
  return !formErrors.first_name && !formErrors.second_name && !formErrors.gender && !formErrors.email && !formErrors.phone
}

async function doRegister() {
  clearErrors()
  if (done.register || !validateRegister()) {
    return
  }
  loading.value = true
  try {
    authStore.errorMessage = null
    await authStore.userRegistration({ ...registerForm })
    if (!authStore.registrationResponse) {
      stepError.value = authStore.errorMessage?.message || 'Registration failed. Check the details and try again.'
      return
    }
    const token = authStore.registrationResponse.tokenInfo
    if (token) {
      registrationToken.value = token
    }
    signInForm.email = registerForm.email
    done.register = true
    step.value = 1
  } catch (error) {
    stepError.value = safeMessage(error, 'Registration failed. Please try again.')
  } finally {
    loading.value = false
  }
}

// ---- Step 1: subscription (issues the activation token) ----
function onActivationTokenIssued(token) {
  activationToken.value = token
  activateForm.token = token
  activationTokenIssued.value = true
}

function goToActivate() {
  stepError.value = ''
  step.value = 2
}

// ---- Step 2: activate the account with the activation token ----
function validateActivate() {
  formErrors.token = activateForm.token ? '' : 'Enter the activation token.'
  formErrors.password = activateForm.password.length >= 6 ? '' : 'Use at least 6 characters.'
  formErrors.confirm_password = activateForm.confirm_password === activateForm.password ? '' : 'Passwords do not match.'
  return !formErrors.token && !formErrors.password && !formErrors.confirm_password
}

async function doActivate() {
  clearErrors()
  if (done.activate || !validateActivate()) {
    return
  }
  loading.value = true
  try {
    // 1. Confirm the activation token issued by the subscription payment.
    await axios.post(`${baseURL}/setup/subscription/tokens/validate`, { token: activateForm.token }, {
      headers: { Accept: 'application/json' },
      timeout: 15000,
    })
    // 2. Activate the account (set password) using the registration token.
    authStore.errorMessage = null
    await authStore.setUserPassword({
      token: registrationToken.value,
      password: activateForm.password,
      confirm_password: activateForm.confirm_password,
    })
    if (!authStore.setUserPasswordResponse) {
      stepError.value = authStore.errorMessage?.message || 'Activation failed. Check the tokens and try again.'
      return
    }
    activateForm.password = ''
    activateForm.confirm_password = ''
    signInForm.password = ''
    done.activate = true
    step.value = 3
  } catch (error) {
    stepError.value = error?.response?.data?.message || safeMessage(error, 'Activation failed. Please try again.')
  } finally {
    loading.value = false
  }
}

// ---- Step 2: sign in ----
function validateSignIn() {
  formErrors.email2 = signInForm.email ? '' : 'Enter your email address.'
  formErrors.password2 = signInForm.password ? '' : 'Enter your password.'
  return !formErrors.email2 && !formErrors.password2
}

async function doSignIn() {
  clearErrors()
  if (done.signin || !validateSignIn()) {
    return
  }
  loading.value = true
  try {
    authStore.errorMessage = null
    await authStore.userLogin({ email: signInForm.email, password: signInForm.password })
    if (!authStore.token) {
      stepError.value = 'Incorrect email or password. Please try again.'
      return
    }
    await authStore.userProfile()
    if (!authStore.profile) {
      stepError.value = 'Signed in, but your profile could not be loaded. Please try again.'
      return
    }
    signInForm.password = ''
    done.signin = true
    step.value = 4
  } catch (error) {
    stepError.value = 'Sign-in failed due to a connection problem. Please try again.'
  } finally {
    loading.value = false
  }
}

// ---- Step 3: organisation ----
function validateOrg() {
  formErrors.org_name = orgForm.name ? '' : 'Enter the organisation name.'
  formErrors.org_phone = orgForm.phone ? '' : 'Enter a phone number.'
  formErrors.org_email = /^\S+@\S+\.\S+$/.test(orgForm.email) ? '' : 'Enter a valid email address.'
  formErrors.org_address = orgForm.address ? '' : 'Enter an address.'
  return !formErrors.org_name && !formErrors.org_phone && !formErrors.org_email && !formErrors.org_address
}

async function doCreateOrg() {
  clearErrors()
  if (done.org || !validateOrg()) {
    return
  }
  loading.value = true
  try {
    await api.post('main/eos/entity/add', { ...orgForm })
    await loadOrganisations()
    done.org = true
    step.value = 5
  } catch (error) {
    stepError.value = safeMessage(error, 'Organisation registration failed. Please try again.')
  } finally {
    loading.value = false
  }
}

async function loadOrganisations() {
  const response = await api.get('main/eos/my-entities')
  const data = response?.data
  organisations.value = Array.isArray(data) ? data : data?.data || []
  if (organisations.value.length) {
    selectedEntity.value = organisations.value[organisations.value.length - 1].number
  }
}

// ---- Step 4: select organisation ----
async function doSelectOrg() {
  clearErrors()
  if (done.select || !selectedEntity.value) {
    return
  }
  loading.value = true
  try {
    await api.post('main/eos/entity/current', null, { params: { entity_number: selectedEntity.value } })

    // Link (redeem) the paid setup token to this organisation. One-shot: the
    // backend refuses a reused token.
    if (setupToken.value) {
      await api.post('main/ems/setup/redeem', { token: setupToken.value })
    }

    // Activate the licence with the subscription activation token now that the
    // organisation exists (one-shot).
    if (activationToken.value) {
      await api.post('main/ems/subscription/activate', { token: activationToken.value })
      subscriptionActive.value = true
    }

    const chosen = organisations.value.find((entity) => entity.number === selectedEntity.value)
    currentOrgLabel.value = chosen ? `${chosen.name} (${chosen.number})` : selectedEntity.value
    done.select = true
    step.value = 6
  } catch (error) {
    stepError.value = safeMessage(error, 'Could not set the current organisation. Please try again.')
  } finally {
    loading.value = false
  }
}

// ---- Step 5: owner stakeholder ----
async function doCreateOwner() {
  clearErrors()
  if (done.owner) {
    return
  }
  if (!currentOwnerNumber.value) {
    stepError.value = 'Your account could not be identified. Please sign in again.'
    return
  }
  loading.value = true
  try {
    await api.post('main/ems/stakeholders', {
      user_number: currentOwnerNumber.value,
      stakeholder_type: 'owner',
    })
    done.owner = true
    step.value = 7
  } catch (error) {
    stepError.value = safeMessage(error, 'Could not establish ownership. Please try again.')
  } finally {
    loading.value = false
  }
}

function enterEms() {
  router.push({ name: 'ems-dashboard' })
}
</script>


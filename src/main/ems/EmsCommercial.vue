<template>
  <EmsAuthLayout wide test-reset eyebrow="Commercial setup" heading="Set up your EMS installation">
    <template #topRight>
      <EmsSignInPill />
    </template>
    <div class="ems-alert ems-alert--info" role="status">
      DEVELOPMENT / TEST PAYMENT ONLY. NO REAL MONEY WILL BE PROCESSED.
    </div>

    <ol class="ems-steps" aria-label="Commercial setup progress">
      <li v-for="(label, index) in stepLabels" :key="label" class="ems-step"
          :class="{ 'ems-step--active': index === step, 'ems-step--done': index < step }">
        <span class="ems-step__dot" aria-hidden="true">{{ index < step ? '✓' : index + 1 }}</span>
        <span class="ems-step__label">{{ label }}</span>
      </li>
    </ol>

    <div v-if="phase === 'loading'" class="ems-empty">
      <span class="ems-inline-spinner" aria-hidden="true"></span>
    </div>
    <div v-else-if="phase === 'error'" class="ems-alert ems-alert--error" role="alert">{{ errorMessage }}</div>

    <!-- Step 0: package -->
    <section v-else-if="step === 0" class="ems-form">
      <p class="ems-note">Choose an installation package. Prices are calculated by the server.</p>
      <label class="ems-field">
        <span class="ems-field__label">Installation package</span>
        <span class="ems-field__control">
          <select v-model="selectedPackageNumber" class="ems-field__input">
            <option value="" disabled>Select a package…</option>
            <option v-for="pkg in packages" :key="pkg.number" :value="pkg.number">
              {{ pkg.name }}{{ pkg.custom ? ' — custom quotation' : ` — ${money(pkg.base_price_ugx)}` }}
            </option>
          </select>
        </span>
      </label>

      <div v-if="selectedPackage" class="ems-card">
        <h3 class="ems-card__title">{{ selectedPackage.name }}</h3>
        <p class="ems-small ems-muted" style="margin-top: -4px;">{{ selectedPackage.deployment_description || selectedPackage.description }}</p>
        <dl class="ems-kv">
          <dt>Setup price</dt>
          <dd>{{ selectedPackage.custom ? 'Custom quotation' : money(selectedPackage.base_price_ugx) }}</dd>
          <dt>Included users</dt><dd>{{ selectedPackage.custom ? 'Determined after assessment' : selectedPackage.included_users }}</dd>
          <dt>Included client computers</dt><dd>{{ selectedPackage.custom ? 'Determined after assessment' : selectedPackage.included_devices }}</dd>
          <dt>Included locations</dt><dd>{{ selectedPackage.custom ? 'Determined after assessment' : selectedPackage.included_locations }}</dd>
          <dt>Training allowance</dt><dd>{{ selectedPackage.custom ? 'Agreed after assessment' : `${selectedPackage.training_hours} hour(s)` }}</dd>
          <dt>Estimated duration</dt><dd>{{ selectedPackage.custom ? 'Agreed after assessment' : `${selectedPackage.estimated_days} working day(s)` }}</dd>
        </dl>
      </div>

      <button
        v-if="selectedPackage && selectedPackage.custom"
        type="button"
        class="ems-btn ems-btn--primary ems-btn--block"
        @click="requestCustomQuote"
      >
        Request a Custom Quote
      </button>
      <button
        v-else
        type="button"
        class="ems-btn ems-btn--primary ems-btn--block"
        :disabled="!selectedPackageNumber"
        @click="step = 1"
      >
        Continue
      </button>
      <p v-if="customQuoteNote" class="ems-alert ems-alert--info" role="status">{{ customQuoteNote }}</p>
    </section>

    <!-- Step 1: configure -->
    <section v-else-if="step === 1" class="ems-form">
      <p class="ems-note">Configure your installation. The server validates and prices this configuration.</p>
      <EmsField v-model.number="config.users" label="Users" type="number" inputmode="numeric" />
      <EmsField v-model.number="config.devices" label="Client computers / devices" type="number" inputmode="numeric" />
      <EmsField v-model.number="config.locations" label="Locations" type="number" inputmode="numeric" />
      <label v-if="methods.length" class="ems-field">
        <span class="ems-field__label">Installation method</span>
        <span class="ems-field__control">
          <select v-model="config.method" class="ems-field__input">
            <option v-for="m in methods" :key="m" :value="m">{{ m }}</option>
          </select>
        </span>
      </label>
      <label v-if="config.method === 'onsite'" class="ems-field">
        <span class="ems-field__label">Installation location (in Uganda)</span>
        <span class="ems-field__control">
          <select v-model="config.location" class="ems-field__input">
            <option value="" disabled>Select a location…</option>
            <option v-for="loc in locations" :key="loc.name" :value="loc.name">
              {{ loc.name }} — ~{{ loc.distance_km }} km from Kampala
            </option>
          </select>
        </span>
      </label>
      <p v-if="config.method === 'onsite' && selectedLocationKm > 0" class="ems-small ems-muted">
        Distance from Kampala City Centre: ~{{ selectedLocationKm }} km. Transport is charged as the standard fee for
        this package size.
      </p>
      <p v-if="config.method === 'onsite' && config.location === 'Kampala City Centre'" class="ems-small ems-muted">
        Kampala City Centre is local — no transport charge applies.
      </p>
      <div v-if="services.length" class="ems-form">
        <span class="ems-field__label">Additional services</span>
        <label v-for="service in services" :key="service.code" class="ems-small">
          <input type="checkbox" :value="service.code" v-model="config.service_codes" />
          {{ service.name }} ({{ money(service.price_ugx) }})
        </label>
      </div>
      <div v-if="stepError" class="ems-alert ems-alert--error" role="alert">{{ stepError }}</div>
      <div class="ems-links">
        <button type="button" class="ems-link" @click="step = 0">Back</button>
      </div>
      <button type="button" class="ems-btn ems-btn--primary ems-btn--block" :disabled="loading" @click="createOrder">
        <span v-if="loading" class="ems-btn__spinner" aria-hidden="true"></span>
        {{ loading ? 'Calculating…' : 'Generate quotation' }}
      </button>
    </section>

    <!-- Step 2: quotation + simulated payment -->
    <section v-else-if="step === 2 && quote" class="ems-form">
      <h3 class="ems-panel__title">Quotation {{ order?.number }}</h3>
      <table class="ems-table">
        <tbody>
          <tr v-for="(line, i) in quote.lines" :key="i">
            <td>{{ line.label }}</td>
            <td style="text-align: right;">{{ money(line.amount_ugx) }}</td>
          </tr>
          <tr>
            <td class="ems-table__primary">Total</td>
            <td class="ems-table__primary" style="text-align: right;">{{ money(quote.total_ugx) }}</td>
          </tr>
        </tbody>
      </table>
      <p class="ems-small ems-muted">Estimated installation duration: {{ quote.estimated_days }} day(s).</p>

      <div v-if="stepError" class="ems-alert ems-alert--error" role="alert">{{ stepError }}</div>
      <p class="ems-small ems-muted">Test payment — choose a scenario:</p>
      <div class="ems-actions">
        <button type="button" class="ems-btn ems-btn--primary" :disabled="loading" @click="simulatePayment('success')">Simulate successful payment</button>
        <button type="button" class="ems-btn" :disabled="loading" @click="simulatePayment('failed')">Simulate failed</button>
        <button type="button" class="ems-btn" :disabled="loading" @click="simulatePayment('pending')">Simulate pending</button>
      </div>
    </section>

    <!-- Step 3: setup token -->
    <section v-else-if="step === 3" class="ems-form">
      <div class="ems-alert ems-alert--success" role="status">Payment received (simulated). Your setup token has been issued.</div>
      <p class="ems-note">
        Copy this token now — it is shown only once. You will be asked to enter it to confirm your setup payment
        before creating your account.
      </p>
      <EmsField v-model="rawToken" label="Setup activation token" />
      <button type="button" class="ems-btn ems-btn--primary ems-btn--block" :disabled="!rawToken" @click="continueToAccountSetup">
        Continue to payment confirmation
      </button>
    </section>
  </EmsAuthLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import axios from 'axios'
import EmsAuthLayout from '@/main/ems/components/EmsAuthLayout.vue'
import EmsField from '@/main/ems/components/EmsField.vue'
import EmsSignInPill from '@/main/ems/components/EmsSignInPill.vue'

const router = useRouter()
const baseURL = `${import.meta.env.VITE_APP_BASE_URL}`

const stepLabels = ['Package', 'Configure', 'Quotation & payment', 'Setup token']
const phase = ref('loading')
const step = ref(0)
const loading = ref(false)
const errorMessage = ref('')
const stepError = ref('')

const packages = ref([])
const locations = ref([])
const selectedPackageNumber = ref('')
const config = reactive({ users: 1, devices: 1, locations: 1, method: '', location: '', transport_km: 0, service_codes: [] })
const order = ref(null)
const quote = ref(null)
const rawToken = ref('')
const customQuoteNote = ref('')

const selectedPackage = computed(() => packages.value.find((p) => p.number === selectedPackageNumber.value) || null)
const methods = computed(() => (selectedPackage.value?.methods ? String(selectedPackage.value.methods).split(',').map((m) => m.trim()).filter(Boolean) : []))
const services = computed(() => {
  try {
    return JSON.parse(selectedPackage.value?.services_json || '[]')
  } catch (error) {
    return []
  }
})
const selectedLocationKm = computed(() => {
  const match = locations.value.find((l) => l.name === config.location)
  return match ? match.distance_km : 0
})

function money(ugx) {
  const n = Number(ugx || 0)
  return `UGX ${n.toLocaleString('en-UG')}`
}

function apiError(error, fallback) {
  return error?.response?.data?.message || fallback
}

async function loadPackages() {
  phase.value = 'loading'
  try {
    const response = await axios.get(`${baseURL}/setup/packages`, { headers: { Accept: 'application/json' }, timeout: 15000 })
    packages.value = response?.data?.data || []
    phase.value = 'ready'
    if (!packages.value.length) {
      errorMessage.value = 'No installation packages are available yet. Please contact the administrator.'
      phase.value = 'error'
    }
  } catch (error) {
    errorMessage.value = 'Could not load installation packages. Please check your connection and try again.'
    phase.value = 'error'
  }
}

onMounted(async () => {
  await loadPackages()

  // Location catalogue for on-site transport (self-hosted; no external map API).
  try {
    const response = await axios.get(`${baseURL}/setup/locations`, { headers: { Accept: 'application/json' }, timeout: 15000 })
    locations.value = response?.data?.data || []
  } catch (error) {
    locations.value = []
  }
})

async function createOrder() {
  stepError.value = ''
  if (config.method === 'onsite' && !config.location) {
    stepError.value = 'Select the installation location in Uganda for an on-site installation.'
    return
  }
  loading.value = true
  try {
    const response = await axios.post(`${baseURL}/setup/orders`, {
      package_number: selectedPackageNumber.value,
      users: Number(config.users) || 0,
      devices: Number(config.devices) || 0,
      locations: Number(config.locations) || 0,
      method: config.method,
      location: config.location,
      service_codes: config.service_codes,
    }, { headers: { Accept: 'application/json' }, timeout: 15000 })
    order.value = response?.data?.data?.order || null
    quote.value = response?.data?.data?.quote || null
    step.value = 2
  } catch (error) {
    const message = apiError(error, '')
    // A test reset deletes the catalogue, so a selection made before the reset
    // can reference a package number that no longer exists. Refresh the list so
    // the operator can re-select instead of retrying a dead package.
    if (error?.response?.status === 400 && /installation package/i.test(message)) {
      selectedPackageNumber.value = ''
      await loadPackages()
      stepError.value = 'The installation catalogue was refreshed after a reset. Please select a package again.'
      return
    }
    stepError.value = message || 'Could not create the quotation. Check the configuration and try again.'
  } finally {
    loading.value = false
  }
}

// Custom Deployment has no fixed price: it must not proceed to payment. The
// customer is directed to arrange a manual quotation after assessment.
function requestCustomQuote() {
  customQuoteNote.value =
    'A custom deployment is quoted after an assessment of your requirements. Please contact the EMS team to arrange your custom quotation — no fixed price is offered online.'
}

async function simulatePayment(scenario) {
  stepError.value = ''
  loading.value = true
  try {
    const response = await axios.post(`${baseURL}/setup/orders/${order.value.number}/simulate-payment`, { scenario }, { headers: { Accept: 'application/json' }, timeout: 15000 })
    const token = response?.data?.data?.token
    if (!token) {
      stepError.value = 'The simulated payment did not issue a token (payment not successful).'
      return
    }
    rawToken.value = token
    step.value = 3
  } catch (error) {
    if (error?.response?.status === 404) {
      stepError.value = 'Simulated payments are disabled in this environment.'
    } else if (error?.response?.status === 402) {
      stepError.value = 'The simulated payment was not successful, so no token was issued.'
    } else {
      stepError.value = apiError(error, 'The simulated payment could not be processed.')
    }
  } finally {
    loading.value = false
  }
}

function continueToAccountSetup() {
  // The setup token is confirmed (asked for) on the account-setup page, which
  // gates entry on a validated, paid setup token.
  router.push({ name: 'ems-setup' })
}
</script>

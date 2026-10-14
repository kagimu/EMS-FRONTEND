<template>
  <div class="ems-form">
    <div class="ems-alert ems-alert--info" role="status">
      DEVELOPMENT / TEST PAYMENT ONLY. NO REAL MONEY WILL BE PROCESSED.
    </div>

    <p class="ems-small ems-muted">
      Choose your subscription period. A successful payment issues your <strong>activation token</strong>, which you
      use to activate your account. Minimum 7 days at UGX 1,200 per day.
    </p>

    <div class="ems-toolbar">
      <button
        v-for="preset in presets"
        :key="preset.days"
        type="button"
        class="ems-btn"
        :class="{ 'ems-btn--primary': days === preset.days }"
        @click="setDays(preset.days)"
      >
        {{ preset.label }}
      </button>
      <EmsField v-model.number="days" label="Or enter days (min 7)" type="number" inputmode="numeric" />
      <button type="button" class="ems-btn ems-btn--primary" :disabled="loading || days < 7" @click="quote">
        {{ loading ? 'Calculating…' : 'Get price' }}
      </button>
    </div>

    <p v-if="quotation" class="ems-note">
      {{ quotation.duration_days }} days × {{ money(quotation.daily_rate_ugx) }} =
      <strong>{{ money(quotation.total_ugx) }}</strong>
    </p>

    <div v-if="order" class="ems-form">
      <p class="ems-small ems-muted">Order {{ order.number }} — {{ money(order.total_ugx) }} ({{ order.status }})</p>
      <div class="ems-actions">
        <button type="button" class="ems-btn ems-btn--primary" :disabled="loading" @click="pay('success')">Simulate successful payment</button>
        <button type="button" class="ems-btn" :disabled="loading" @click="pay('failed')">Simulate failed</button>
        <button type="button" class="ems-btn" :disabled="loading" @click="pay('pending')">Simulate pending</button>
      </div>
    </div>

    <div v-if="activateToken" class="ems-form">
      <div class="ems-alert ems-alert--success" role="status">
        Payment received. Your <strong>activation token</strong> has been issued — copy it now (shown once).
      </div>
      <EmsField v-model="activateToken" label="Activation token" />
      <button
        v-if="!onboarding"
        type="button"
        class="ems-btn ems-btn--primary ems-btn--block"
        :disabled="loading || !activateToken"
        @click="activate"
      >
        {{ loading ? 'Activating…' : 'Activate subscription' }}
      </button>
      <p v-else class="ems-small ems-muted">
        Continue to the next step to activate your account with this token.
      </p>
    </div>

    <div v-if="status && !onboarding" class="ems-form">
      <div class="ems-alert ems-alert--success" role="status">Your account and subscription are active.</div>
      <dl class="ems-kv-card">
        <dt>Licence</dt><dd>{{ status.licence?.effective_status || 'ACTIVE' }}</dd>
        <dt>Valid to</dt><dd>{{ status.licence?.valid_to || '—' }}</dd>
        <dt>Subscription orders</dt><dd>{{ status.orders?.length || 0 }}</dd>
      </dl>
    </div>

    <div v-if="stepError" class="ems-alert ems-alert--error" role="alert">{{ stepError }}</div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

import api from '@/config/api.js'
import EmsField from '@/main/ems/components/EmsField.vue'

const props = defineProps({
  // 'account' = authenticated subscription (organisation); 'onboarding' = public
  // subscription bound to a paid setup token, before sign-in.
  mode: { type: String, default: 'account' },
  setupToken: { type: String, default: '' },
})

const emit = defineEmits(['activated', 'issued'])

const onboarding = computed(() => props.mode === 'onboarding')

const loading = ref(false)
const stepError = ref('')
const days = ref(7)
const quotation = ref(null)
const order = ref(null)
const activateToken = ref('')
const status = ref(null)

const presets = [
  { label: '7 days', days: 7 },
  { label: '14 days', days: 14 },
  { label: '28 days', days: 28 },
  { label: 'Monthly (30 days)', days: 30 },
  { label: 'Yearly (365 days)', days: 365 },
]

function money(ugx) {
  return `UGX ${Number(ugx || 0).toLocaleString('en-UG')}`
}

function setDays(value) {
  days.value = value
  quotation.value = null
  order.value = null
  activateToken.value = ''
  stepError.value = ''
}

function apiError(error, fallback) {
  return error?.response?.data?.message || fallback
}

async function loadStatus() {
  if (onboarding.value) {
    return
  }
  try {
    const response = await api.get('main/ems/subscription/status')
    status.value = response?.data?.data || null
  } catch (error) {
    status.value = null
  }
}

async function quote() {
  stepError.value = ''
  quotation.value = null
  order.value = null
  activateToken.value = ''
  loading.value = true
  try {
    const qRes = await api.post('setup/subscription-quotation', { duration_days: days.value })
    quotation.value = qRes?.data?.data || null
    if (onboarding.value) {
      const oRes = await api.post('setup/subscription', { setup_token: props.setupToken, duration_days: days.value })
      order.value = oRes?.data?.data || null
    } else {
      const oRes = await api.post('main/ems/subscription/orders', { duration_days: days.value })
      order.value = oRes?.data?.data || null
    }
  } catch (error) {
    stepError.value = apiError(error, 'Could not create the subscription order.')
  } finally {
    loading.value = false
  }
}

async function pay(scenario) {
  stepError.value = ''
  loading.value = true
  try {
    const url = onboarding.value
      ? `setup/subscription/orders/${order.value.number}/simulate-payment`
      : `main/ems/subscription/orders/${order.value.number}/simulate-payment`
    const response = await api.post(url, { scenario })
    const token = response?.data?.data?.token
    if (!token) {
      stepError.value = 'The simulated payment did not issue an activation token.'
      return
    }
    activateToken.value = token
    emit('issued', token)
  } catch (error) {
    if (error?.response?.status === 404) {
      stepError.value = 'Simulated payments are disabled in this environment.'
    } else if (error?.response?.status === 402) {
      stepError.value = 'The simulated payment was not successful, so no activation token was issued.'
    } else {
      stepError.value = apiError(error, 'The simulated payment could not be processed.')
    }
  } finally {
    loading.value = false
  }
}

async function activate() {
  stepError.value = ''
  loading.value = true
  try {
    await api.post('main/ems/subscription/activate', { token: activateToken.value })
    activateToken.value = ''
    order.value = null
    quotation.value = null
    await loadStatus()
    emit('activated')
  } catch (error) {
    stepError.value = apiError(error, 'The activation token could not be redeemed.')
  } finally {
    loading.value = false
  }
}

onMounted(loadStatus)
</script>

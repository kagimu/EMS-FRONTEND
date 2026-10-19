<template>
  <button
    type="button"
    class="ems-pill ems-pill--reset"
    aria-label="Reset the test installation"
    @click="open"
  >
    <svg
      class="ems-pill__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 4 3 10 9 10" />
    </svg>
    <span>Reset test</span>
  </button>

  <Teleport to="body">
    <div v-if="isOpen" class="ems-modal" role="dialog" aria-modal="true" aria-label="Reset test installation">
      <div class="ems-modal__overlay" @click="close"></div>

      <div class="ems-glass ems-glass--wide ems-modal__card">
        <p class="ems-glass__eyebrow">Developer test tool</p>
        <h2 class="ems-glass__heading">Reset test installation</h2>
        <p class="ems-glass__sub">
          Permanently clears every record in the dedicated testing database and keeps the schema. This cannot be undone.
        </p>

        <!-- Step 1 — password gate -->
        <div v-if="step === 'password'" class="ems-form">
          <label class="ems-field">
            <span class="ems-field__label">Reset password</span>
            <span class="ems-field__control" :class="{ 'ems-field__control--error': !!error }">
              <input
                ref="passwordInput"
                v-model="password"
                class="ems-field__input"
                type="password"
                autocomplete="off"
                placeholder="Enter the reset password"
                @keyup.enter="submitPassword"
              />
            </span>
            <span v-if="error" class="ems-field__error">{{ error }}</span>
          </label>
          <div class="ems-actions">
            <button type="button" class="ems-btn ems-btn--primary ems-btn--block" @click="submitPassword">
              Continue
            </button>
            <button type="button" class="ems-btn ems-btn--ghost ems-btn--block" @click="close">Cancel</button>
          </div>
        </div>

        <!-- Step 2 — final confirmation -->
        <div v-else-if="step === 'confirm'" class="ems-form">
          <div class="ems-alert ems-alert--error" role="alert">
            <strong>This deletes every user, organisation, subscription, order, licence, notification, audit entry
            and all Education records in the testing database.</strong>
            The schema is preserved. This cannot be undone.
          </div>
          <div class="ems-actions">
            <button type="button" class="ems-btn ems-btn--primary ems-btn--block" :disabled="busy" @click="doReset">
              {{ busy ? 'Resetting…' : 'Reset now' }}
            </button>
            <button type="button" class="ems-btn ems-btn--ghost ems-btn--block" :disabled="busy" @click="close">
              Cancel
            </button>
          </div>
        </div>

        <!-- Step 3 — result -->
        <div v-else class="ems-form">
          <div class="ems-alert" :class="result.ok ? 'ems-alert--success' : 'ems-alert--error'" role="status">
            {{ result.message }}
          </div>
          <div class="ems-actions">
            <button
              v-if="result.ok"
              type="button"
              class="ems-btn ems-btn--primary ems-btn--block"
              @click="restartSetup"
            >
              Start setup again
            </button>
            <button
              v-if="result.ok || result.unknown"
              type="button"
              class="ems-btn ems-btn--block"
              :disabled="verifying"
              @click="verifyReset"
            >
              {{ verifying ? 'Verifying…' : 'Verify Reset Status' }}
            </button>
            <button type="button" class="ems-btn ems-btn--ghost ems-btn--block" @click="close">Close</button>
          </div>
          <div
            v-if="verification"
            class="ems-alert"
            :class="verification.ok ? 'ems-alert--success' : 'ems-alert--info'"
            role="status"
          >
            {{ verification.message }}
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { nextTick, ref } from 'vue'

import axios from 'axios'
import api from '@/config/api.js'
import { clearLocalSession } from '@/main/ems/services/session.js'
import { fetchSetupStatus } from '@/main/ems/services/setupStatus.js'
import { fetchSetupProgress } from '@/main/ems/services/setupProgress.js'

// Testing-phase gate. The password is verified SERVER-SIDE (DEV_RESET_PASSWORD,
// default "12345"); the client only requires that it is entered. This is a
// deliberate test-phase convenience, not a security boundary — the server still
// refuses protected databases and performs its own identity checks.
// The exact phrase the backend requires in the request body.
const PHRASE = 'RESET EMS TEST SYSTEM'
// Bounded timeout (> the backend lock-wait window); a lock wait is answered by
// the server rather than surfacing as an ambiguous client timeout.
const RESET_TIMEOUT_MS = 70000

const baseURL = `${import.meta.env.VITE_APP_BASE_URL}`

const isOpen = ref(false)
const step = ref('password') // 'password' | 'confirm' | 'result'
const password = ref('')
const error = ref('')
const passwordInput = ref(null)
const busy = ref(false)
const result = ref({ ok: false, unknown: false, message: '' })
const verifying = ref(false)
const verification = ref(null)

function open() {
  step.value = 'password'
  password.value = ''
  error.value = ''
  verification.value = null
  isOpen.value = true
  nextTick(() => passwordInput.value && passwordInput.value.focus())
}

function close() {
  if (busy.value) {
    return
  }
  isOpen.value = false
}

function submitPassword() {
  if (!password.value) {
    error.value = 'Enter the reset password.'
    return
  }
  error.value = ''
  step.value = 'confirm'
}

// A full navigation (not just a router push) guarantees the commercial/setup
// pages re-mount with a fresh catalogue and no stale session or in-memory state.
function restartSetup() {
  clearLocalSession()
  window.location.assign('/setup/commercial')
}

async function doReset() {
  if (busy.value) {
    return
  }
  const confirmed = window.confirm(
    'FINAL CONFIRMATION: permanently delete ALL records in the dedicated testing database? This cannot be undone.',
  )
  if (!confirmed) {
    return
  }

  busy.value = true
  try {
    await api.post(
      'setup/dev/reset-onboarding',
      { confirmation: PHRASE, password: password.value },
      { timeout: RESET_TIMEOUT_MS },
    )
    clearLocalSession()
    result.value = {
      ok: true,
      unknown: false,
      message:
        'Reset succeeded. All test records were deleted and the schema was preserved. Verify the reset status, then start setup again.',
    }
  } catch (err) {
    result.value = mapError(err)
  } finally {
    busy.value = false
    step.value = 'result'
  }
}

function serverMessage(err) {
  const message = err && err.response && err.response.data && err.response.data.message
  return typeof message === 'string' && message ? message : ''
}

function mapError(err) {
  if (!err || !err.response) {
    // Timeout or network failure: the outcome is unknown.
    return {
      ok: false,
      unknown: true,
      message:
        'The outcome could not be confirmed (timeout or network error). Do not retry automatically — check the installation status first; the reset may or may not have completed.',
    }
  }
  switch (err.response.status) {
    case 403:
      return {
        ok: false,
        unknown: false,
        message: serverMessage(err) || 'The reset password is incorrect.',
      }
    case 401:
      return {
        ok: false,
        unknown: false,
        message: serverMessage(err) || 'The server refused the request as unauthorized.',
      }
    case 404:
      return { ok: false, unknown: false, message: 'Test reset is not enabled on this backend.' }
    case 409:
      return {
        ok: false,
        unknown: false,
        message:
          serverMessage(err) ||
          'The backend refused the reset for a safety reason (protected database, database mismatch, or another installation operation in progress). This is not bypassable.',
      }
    case 400:
      return { ok: false, unknown: false, message: serverMessage(err) || 'The request was rejected by the backend.' }
    default:
      return { ok: false, unknown: false, message: 'The reset request failed. No further action was taken automatically.' }
  }
}

async function verifyReset() {
  verifying.value = true
  verification.value = null
  try {
    const status = await fetchSetupStatus()
    const progress = await fetchSetupProgress()
    const steps = (progress && progress.steps) || {}
    const stepsClear =
      progress &&
      progress.next_action === 'commercial_setup' &&
      ['users_exist', 'admin_active', 'owner_exists', 'organisation_exists', 'subscription_active', 'education_entitled'].every(
        (key) => steps[key] === false,
      )

    if (status === 'uninitialized' && stepsClear) {
      verification.value = { ok: true, message: 'Reset verified: the installation reports a fresh, uninitialized state.' }
    } else {
      verification.value = {
        ok: false,
        message:
          'The reset could not yet be verified — the installation does not report a fully fresh state. Check again shortly; do not reset automatically.',
      }
    }
  } catch (err) {
    verification.value = {
      ok: false,
      message: 'The reset could not yet be verified. Check your connection and try again; do not reset automatically.',
    }
  } finally {
    verifying.value = false
  }
}
</script>

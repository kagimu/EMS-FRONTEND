import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// EMS Developer Test Console — first-time onboarding progress (developer-only).
//
// Persists ONLY non-secret milestones so the console can decide whether the
// First-Time Setup wizard or the standalone Session tab is the right entry
// point after a page reload. Passwords and activation tokens are NEVER stored
// here — they live only in component memory for the duration of one request.
//
// A milestone is advanced ONLY after the backend confirms the operation
// (result.ok). A registration *attempt* is never treated as account creation.
const STORAGE_KEY = 'dev-ems-onboarding'

function emptyState() {
  return {
    accountCreated: false, // POST /auth/register returned 200
    accountActivated: false, // POST /auth/set-password returned 200
    signedInOnce: false, // POST /auth/login returned 200
    signInRequested: false, // developer explicitly chose "already have an account"
    registerEmail: '', // non-secret; prefills sign-in only
  }
}

function readState() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return emptyState()
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return emptyState()
    }
    const parsed = JSON.parse(raw)
    return { ...emptyState(), ...(parsed && typeof parsed === 'object' ? parsed : {}) }
  } catch (error) {
    return emptyState()
  }
}

export const useDevOnboardingStore = defineStore('devOnboarding', () => {
  const state = ref(readState())

  function persist() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
    } catch (error) {
      // Non-fatal: progress simply will not survive a reload.
    }
  }

  // Call ONLY after the backend confirms the operation.
  function markRegistered({ email } = {}) {
    state.value.accountCreated = true
    if (email) {
      state.value.registerEmail = email
    }
    persist()
  }

  function markActivated() {
    state.value.accountActivated = true
    persist()
  }

  function markSignedIn() {
    state.value.signedInOnce = true
    persist()
  }

  // Returning user opting into the standalone sign-in path.
  function requestSignIn() {
    state.value.signInRequested = true
    persist()
  }

  function reset() {
    state.value = emptyState()
    persist()
  }

  const accountCreated = computed(() => state.value.accountCreated)
  const accountActivated = computed(() => state.value.accountActivated)
  const signedInOnce = computed(() => state.value.signedInOnce)
  const signInRequested = computed(() => state.value.signInRequested)
  const registerEmail = computed(() => state.value.registerEmail)

  // An account exists and normal sign-in is meaningful.
  const accountReady = computed(
    () => state.value.accountCreated || state.value.accountActivated || state.value.signedInOnce,
  )

  return {
    state,
    accountCreated,
    accountActivated,
    signedInOnce,
    signInRequested,
    registerEmail,
    accountReady,
    markRegistered,
    markActivated,
    markSignedIn,
    requestSignIn,
    reset,
  }
})

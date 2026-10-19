import { useAuthStore } from '@/main/auth/store/auth.js'

// Clear every piece of browser-held authentication/onboarding state.
//
// Used in two situations:
//   1. After a test reset — the caller's account has just been deleted.
//   2. Whenever the installation reports a fresh, uninitialized state — no
//      stored token/profile can be valid, so a leftover session must not keep
//      routing the browser into the EMS area (or bounce it to login on a 401).
export function clearLocalSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('userProfile')
  localStorage.removeItem('abilities')
  sessionStorage.clear()

  const authStore = useAuthStore()
  authStore.token = null
  authStore.userNumber = null
  authStore.profile = null
  authStore.loginResponse = null
}

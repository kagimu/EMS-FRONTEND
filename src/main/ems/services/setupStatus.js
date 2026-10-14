import axios from 'axios'

// Public, read-only installation-status call used by the EMS root route.
//
// Deliberately uses a bare axios call (NOT the shared `api` instance) so that a
// public status request never attaches a bearer token and never trips the
// shared 401 -> login redirect interceptor.
const baseURL = `${import.meta.env.VITE_APP_BASE_URL}`

export const SETUP_INITIALIZED = 'initialized'
export const SETUP_UNINITIALIZED = 'uninitialized'

// fetchSetupStatus resolves to one of the two known states, or throws so the
// caller can show a retry state (it never guesses "new" or "complete").
export async function fetchSetupStatus() {
  const response = await axios.get(`${baseURL}/setup/status`, {
    headers: { Accept: 'application/json' },
    timeout: 15000,
  })

  const state = response?.data?.state
  if (state !== SETUP_INITIALIZED && state !== SETUP_UNINITIALIZED) {
    throw new Error('Unexpected setup status response')
  }

  return state
}

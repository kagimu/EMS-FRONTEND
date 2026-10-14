import axios from 'axios'

// Public, read-only installation-progress call used to determine which
// first-installation steps are complete and the single next action.
//
// Uses a bare axios call (NOT the shared `api` instance) so it never attaches a
// bearer token and never trips the shared 401 -> login redirect interceptor.
const baseURL = `${import.meta.env.VITE_APP_BASE_URL}`

// fetchSetupProgress resolves to { state, steps, next_action } or throws so the
// caller can show a retry state. It never guesses.
export async function fetchSetupProgress() {
  const response = await axios.get(`${baseURL}/setup/progress`, {
    headers: { Accept: 'application/json' },
    timeout: 15000,
  })
  return response?.data || null
}

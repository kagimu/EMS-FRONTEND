import { ref } from 'vue'

import { sendRequest } from '@/dev/api/devApi.js'
import { useDevInspectorStore } from '@/dev/store/devInspector.js'
import { useDevSessionStore } from '@/dev/store/devSession.js'

// EMS Developer Test Console — shared request runner for EMS panels (H2.2).
//
// Every call uses the CURRENTLY SELECTED H2.1 session's token and feeds the
// shared H2.1 response inspector. It never falls back to another session and
// never sets a User-Number header (that is guaranteed by devApi.js).
export function useDevRequest() {
  const inspector = useDevInspectorStore()
  const sessionStore = useDevSessionStore()

  const busy = ref(false)
  const lastResult = ref(null)
  const errorMessage = ref(null)

  async function run({ method = 'GET', url, data, params } = {}) {
    const session = sessionStore.activeSession
    if (!session || !session.token) {
      errorMessage.value = 'Selected session is not authenticated.'
      const result = { ok: false, status: 0, method, url, body: null, error: errorMessage.value }
      lastResult.value = result
      return result
    }

    busy.value = true
    errorMessage.value = null

    const result = await sendRequest({ token: session.token, method, url, data, params })
    inspector.record({ actor: session.label, ...result })
    lastResult.value = result

    if (!result.ok) {
      errorMessage.value =
        (result.body && result.body.message) || result.error || `Request failed (${result.status})`
    }

    busy.value = false
    return result
  }

  return { busy, lastResult, errorMessage, run }
}

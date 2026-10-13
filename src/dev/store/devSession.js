import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { fetchCurrentEntity, login as apiLogin } from '@/dev/api/devApi.js'
import { useDevInspectorStore } from '@/dev/store/devInspector.js'

// EMS Developer Test Console — session store (developer-only).
//
// Supports multiple independent test sessions (e.g. Requester / Approver /
// Administrator), each holding its own JWT and identity so a developer can act
// as different users and switch the active token. Passwords are NEVER stored;
// only the returned token, identity and current entity are retained in memory
// (a page reload clears all sessions).
let seq = 0

function newSession(label) {
  seq += 1
  return {
    id: `session-${seq}`,
    label: label || `Session ${seq}`,
    token: null,
    identity: null,
    entity: null,
    status: 'anonymous', // 'anonymous' | 'authenticated' | 'error'
    lastError: null,
  }
}

export const useDevSessionStore = defineStore('devSession', () => {
  const inspector = useDevInspectorStore()

  const sessions = ref([
    newSession('Requester'),
    newSession('Approver'),
    newSession('Administrator'),
  ])
  const activeId = ref(sessions.value[0].id)
  const busy = ref(false)

  const activeSession = computed(
    () => sessions.value.find((session) => session.id === activeId.value) || null,
  )

  function addSession(label) {
    const session = newSession(label)
    sessions.value.push(session)
    return session
  }

  function removeSession(id) {
    const index = sessions.value.findIndex((session) => session.id === id)
    if (index === -1) {
      return
    }
    sessions.value.splice(index, 1)
    if (activeId.value === id) {
      activeId.value = sessions.value.length > 0 ? sessions.value[0].id : null
    }
  }

  function setActive(id) {
    if (sessions.value.some((session) => session.id === id)) {
      activeId.value = id
    }
  }

  // Authenticate one session independently. On success the session holds its own
  // token/identity; other sessions are untouched.
  async function login(id, email, password) {
    const session = sessions.value.find((item) => item.id === id)
    if (!session) {
      return null
    }

    busy.value = true
    session.lastError = null

    const result = await apiLogin(email, password)
    inspector.record({ actor: session.label, ...result })

    if (!result.ok || !result.body || !result.body.token) {
      session.status = 'error'
      session.token = null
      session.identity = null
      session.entity = null
      session.lastError = (result.body && result.body.message) || result.error || 'Login failed'
      busy.value = false
      return session
    }

    session.token = result.body.token
    session.identity = result.body.data || null
    session.status = 'authenticated'

    // Best-effort organisation/entity context (supported by the backend).
    try {
      const entityResult = await fetchCurrentEntity(session.token)
      inspector.record({ actor: session.label, ...entityResult })
      if (entityResult.ok && entityResult.body) {
        session.entity = entityResult.body.data || null
      }
    } catch (error) {
      // Entity context is optional; never fail login because of it.
      session.entity = null
    }

    busy.value = false
    return session
  }

  function logout(id) {
    const session = sessions.value.find((item) => item.id === id)
    if (!session) {
      return
    }
    session.token = null
    session.identity = null
    session.entity = null
    session.status = 'anonymous'
    session.lastError = null
  }

  // Clear every session's token/identity/entity (used after a full developer
  // test-system reset, when no token can be trusted to still resolve to a user).
  function logoutAll() {
    for (const session of sessions.value) {
      logout(session.id)
    }
  }

  return {
    sessions,
    activeId,
    busy,
    activeSession,
    addSession,
    removeSession,
    setActive,
    login,
    logout,
    logoutAll,
  }
})

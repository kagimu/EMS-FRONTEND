import { defineStore } from 'pinia'
import { ref } from 'vue'

import api from '@/config/api.js'

// Shared, request-deduplicated organisation identity for the EMS shell and
// dashboard. The backend resolves the current organisation from the authenticated
// context; the client never supplies an organisation id.
export const useEmsOrganisationStore = defineStore('emsOrganisation', () => {
  const current = ref(null)
  const loading = ref(false)
  const loaded = ref(false)
  let pending = null

  async function load(force = false) {
    if (!force && loaded.value) {
      return current.value
    }
    if (!force && pending) {
      return pending
    }

    loading.value = true
    pending = (async () => {
      try {
        const response = await api.get('main/eos/entity/current', { timeout: 15000 })
        current.value = response?.data?.data || null
      } catch (error) {
        current.value = null
      } finally {
        loaded.value = true
        loading.value = false
        pending = null
      }
      return current.value
    })()

    return pending
  }

  return { current, loading, load }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'

// EMS Developer Test Console — response inspector store (developer-only).
//
// Holds a bounded log of the most recent API requests/responses so the console
// can display method/route/status/duration/body. It stores no credentials.
export const useDevInspectorStore = defineStore('devInspector', () => {
  const records = ref([])
  const limit = 50

  function record(entry) {
    records.value.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      at: new Date().toISOString(),
      ...entry,
    })
    if (records.value.length > limit) {
      records.value.length = limit
    }
  }

  function clear() {
    records.value = []
  }

  return { records, limit, record, clear }
})

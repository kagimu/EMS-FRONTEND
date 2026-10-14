<template>
  <div>
    <EmsContentPanel
      title="Add-ons"
      icon="bi bi-grid-3x3-gap"
      description="Modules available to your organisation."
      :count="addons.length"
      count-noun="add-on"
      count-noun-plural="add-ons"
      :state="panelState"
      :error-message="errorMessage"
    >
      <div class="ems-dash__grid">
        <section v-for="module in addons" :key="module.code" class="ems-card">
          <h3 class="ems-card__title">
            <i :class="iconFor(module.code)" aria-hidden="true"></i> {{ module.name || module.code }}
          </h3>
          <p class="ems-small ems-muted" style="margin-top: -4px;">{{ descriptionFor(module.code) }}</p>
          <p class="ems-small">
            <span class="ems-badge" :class="module.enabled ? 'ems-badge--ok' : 'ems-badge--muted'">
              {{ module.enabled ? 'Enabled' : 'Disabled' }}
            </span>
            <span class="ems-badge" :class="entitled(module.code) ? 'ems-badge--ok' : 'ems-badge--warn'">
              {{ entitled(module.code) ? 'Licensed' : 'Not entitled' }}
            </span>
          </p>
          <div v-if="module.code === 'education'" class="ems-actions">
            <button
              type="button"
              class="ems-btn ems-btn--primary"
              :disabled="!entitled('education')"
              @click="openEducation"
            >
              Open Education
            </button>
          </div>
          <p v-if="module.code === 'education' && !entitled('education')" class="ems-small ems-muted">
            Education is not included in your current licence. Activate a subscription that includes it, or contact
            the administrator.
          </p>
        </section>
      </div>
    </EmsContentPanel>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import EmsContentPanel from '@/main/ems/components/EmsContentPanel.vue'
import { fetchList, fetchObject } from '@/main/ems/services/emsApi.js'

const router = useRouter()

const modules = ref([])
const licence = ref(null)
const phase = ref('loading')
const errorMessage = ref('')

const addons = computed(() => modules.value.filter((m) => String(m.code || '').toLowerCase() !== 'core'))

const panelState = computed(() => {
  if (phase.value === 'loading') return 'loading'
  if (phase.value === 'error') return 'error'
  return addons.value.length ? 'ready' : 'empty'
})

function licensedAddons() {
  const value = licence.value?.licensed_addons
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      return []
    }
  }
  return []
}

function entitled(code) {
  return licensedAddons().map((c) => String(c).toLowerCase()).includes(String(code).toLowerCase())
}

function iconFor(code) {
  return String(code).toLowerCase() === 'education' ? 'bi bi-mortarboard' : 'bi bi-puzzle'
}

function descriptionFor(code) {
  return String(code).toLowerCase() === 'education'
    ? 'The Education management addon — schools, campuses, students, staff, curriculum and academics.'
    : 'An EMS add-on module.'
}

function openEducation() {
  // The Education dashboard is the existing Education route (name 'home'),
  // guarded by the existing authentication and licence enforcement.
  router.push({ name: 'home' })
}

onMounted(async () => {
  phase.value = 'loading'
  errorMessage.value = ''
  try {
    const result = await fetchList('/main/ems/modules')
    if (!result.available) {
      errorMessage.value = result.reason
      phase.value = 'error'
      return
    }
    modules.value = result.list
    // Licence status is best-effort; a failure here must not break the page.
    const licenceResult = await fetchObject('/main/ems/licence')
    licence.value = licenceResult.available ? licenceResult.object : null
    phase.value = 'ready'
  } catch (error) {
    errorMessage.value = 'Could not load the module catalogue.'
    phase.value = 'error'
  }
})
</script>

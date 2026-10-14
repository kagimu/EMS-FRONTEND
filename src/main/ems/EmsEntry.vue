<template>
  <EmsAuthLayout>
    <EmsStateBlock
      :state="phase === 'error' ? 'error' : 'loading'"
      :title="phase === 'error' ? 'We could not confirm the setup status' : 'Establishing installation status'"
      :message="phase === 'error' ? errorMessage : 'Checking whether this installation is ready…'"
      @retry="load"
    />

    <!-- On failure only a retry or a normal sign-in are offered. Registration,
         payment and activation all require the live backend, so the setup
         wizard must NOT be reachable while the installation status is unknown. -->
    <div v-if="phase === 'error'" class="ems-actions">
      <button type="button" class="ems-btn ems-btn--primary ems-btn--block" @click="load">Try again</button>
      <button type="button" class="ems-btn ems-btn--ghost ems-btn--block" @click="goToLogin">Sign in</button>
    </div>

    <p v-if="phase === 'error'" class="ems-small ems-muted" style="margin-top: 12px;">
      The EMS backend did not confirm the installation status. Commercial setup, payment and activation cannot
      proceed until the server is reachable.
    </p>
  </EmsAuthLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import EmsAuthLayout from '@/main/ems/components/EmsAuthLayout.vue'
import EmsStateBlock from '@/main/ems/components/EmsStateBlock.vue'
import { SETUP_UNINITIALIZED, fetchSetupStatus } from '@/main/ems/services/setupStatus.js'

const router = useRouter()

// phase: 'loading' | 'error' | 'ready'
const phase = ref('loading')
const errorMessage = ref('')

onMounted(async () => {
  // Already authenticated in this browser → go straight into the EMS area.
  const profile = localStorage.getItem('userProfile')
  const token = localStorage.getItem('token')
  if (profile && token) {
    router.replace({ name: 'ems-dashboard' })
    return
  }
  await load()
})

async function load() {
  phase.value = 'loading'
  errorMessage.value = ''
  try {
    const state = await fetchSetupStatus()
    if (state === SETUP_UNINITIALIZED) {
      // Fresh installation: the commercial setup purchase and the setup-token
      // validation are required before the installation wizard. Direct the
      // visitor to the installation package selection.
      router.replace({ name: 'ems-commercial' })
      return
    }
    // An already-initialized installation signs in (and does NOT repeat the
    // commercial purchase).
    router.replace({ name: 'login' })
  } catch (error) {
    // Never assume the installation is new or complete on failure.
    errorMessage.value = 'We could not establish the installation status. Check your connection, then try again.'
    phase.value = 'error'
  }
}

function goToLogin() {
  router.push({ name: 'login' })
}
</script>

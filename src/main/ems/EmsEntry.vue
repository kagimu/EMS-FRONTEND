<template>
  <EmsAuthLayout v-if="phase !== 'ready'">
    <EmsStateBlock
      :state="phase === 'error' ? 'error' : 'loading'"
      :title="phase === 'error' ? 'We could not confirm the setup status' : 'Establishing installation status'"
      :message="phase === 'error' ? errorMessage : 'Checking whether this installation is ready…'"
      @retry="load"
    />

    <!-- Explicit, user-driven continuations. These never assume the installation
         state silently — the visitor chooses what to open. -->
    <div v-if="phase === 'error'" class="ems-actions">
      <button type="button" class="ems-btn ems-btn--primary ems-btn--block" @click="continueToSetup">
        Continue to first-time setup
      </button>
      <button type="button" class="ems-btn ems-btn--ghost ems-btn--block" @click="continueToLogin">
        Continue to sign in
      </button>
    </div>

    <p v-if="phase === 'error'" class="ems-small ems-muted" style="margin-top: 12px;">
      The EMS backend did not confirm the installation status. This usually means the backend is offline, or it
      is running an older version that does not yet expose <code>/setup/status</code>. You can still open the
      interface to review the design.
    </p>
  </EmsAuthLayout>

  <EmsWelcome v-else-if="state === SETUP_UNINITIALIZED" />
  <EmsLogin v-else />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import EmsAuthLayout from '@/main/ems/components/EmsAuthLayout.vue'
import EmsStateBlock from '@/main/ems/components/EmsStateBlock.vue'
import EmsLogin from '@/main/ems/EmsLogin.vue'
import EmsWelcome from '@/main/ems/EmsWelcome.vue'
import { SETUP_UNINITIALIZED, fetchSetupStatus } from '@/main/ems/services/setupStatus.js'

const router = useRouter()

// phase: 'loading' | 'error' | 'ready'
const phase = ref('loading')
const state = ref(null)
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
    state.value = await fetchSetupStatus()
    phase.value = 'ready'
  } catch (error) {
    // Never assume the installation is new or complete on failure.
    errorMessage.value =
      'We could not establish the installation status. Check your connection, then try again.'
    phase.value = 'error'
  }
}

// Explicit continuations shown only when the status could not be confirmed.
// `preview=1` tells the setup wizard to skip its status gate (clearly labelled
// as a preview) so the interface can still be reviewed.
function continueToSetup() {
  router.push({ name: 'ems-setup', query: { preview: '1' } })
}

function continueToLogin() {
  router.push({ name: 'login' })
}
</script>

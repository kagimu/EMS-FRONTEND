<template>
  <EmsAuthLayout
    eyebrow="Welcome"
    heading="Welcome to EMS"
    subheading="Your central platform for managing your organisation, people, operations and business functions."
  >
    <p class="ems-note">
      Set up your EMS installation to get started. You will create the initial owner account, activate it,
      sign in, register your organisation and establish ownership.
    </p>

    <div class="ems-actions">
      <button type="button" class="ems-btn ems-btn--primary ems-btn--block" @click="startSetup">
        Set Up Your EMS
      </button>
      <button type="button" class="ems-btn ems-btn--ghost ems-btn--block" @click="goToLogin">
        Already Have an Account? Sign In
      </button>
    </div>

    <p class="ems-small ems-muted" style="margin-top: 14px;">
      A new installation begins here. If EMS is already configured, use <strong>Sign In</strong>.
    </p>
  </EmsAuthLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'

import EmsAuthLayout from '@/main/ems/components/EmsAuthLayout.vue'

const router = useRouter()

function startSetup() {
  router.push({ name: 'ems-commercial' })
}

function goToLogin() {
  router.push({ name: 'login' })
}
</script>

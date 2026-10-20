<template>
  <EmsAuthLayout test-reset eyebrow="Sign in" heading="Welcome back" subheading="Sign in to your EMS account.">
    <form class="ems-form" novalidate @submit.prevent="doLogin">
      <div v-if="formError" class="ems-alert ems-alert--error" role="alert">{{ formError }}</div>

      <EmsField
        v-model="form.email"
        label="Email address"
        type="email"
        placeholder="you@organisation.com"
        autocomplete="username"
        inputmode="email"
        :error="errors.email"
        required
      />

      <EmsField
        v-model="form.password"
        label="Password"
        type="password"
        placeholder="Your password"
        autocomplete="current-password"
        :error="errors.password"
        required
      />

      <button type="submit" class="ems-btn ems-btn--primary ems-btn--block" :disabled="loading || !canSubmit">
        <span v-if="loading" class="ems-btn__spinner" aria-hidden="true"></span>
        {{ loading ? 'Signing in…' : 'Sign In' }}
      </button>
    </form>

    <div class="ems-links">
      <router-link class="ems-link" :to="{ name: 'reset-password' }">Forgot password?</router-link>
      <router-link class="ems-link" :to="{ name: 'ems-setup' }">First-time setup</router-link>
    </div>
  </EmsAuthLayout>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/main/auth/store/auth.js'
import EmsAuthLayout from '@/main/ems/components/EmsAuthLayout.vue'
import EmsField from '@/main/ems/components/EmsField.vue'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const formError = ref('')
const loading = ref(false)

const canSubmit = computed(() => form.email.length > 0 && form.password.length > 0)

function validate() {
  errors.email = ''
  errors.password = ''
  if (!form.email) {
    errors.email = 'Enter your email address.'
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!form.password) {
    errors.password = 'Enter your password.'
  }
  return !errors.email && !errors.password
}

async function doLogin() {
  formError.value = ''
  if (!validate()) {
    return
  }
  loading.value = true
  try {
    await authStore.userLogin({ email: form.email, password: form.password })

    // Generic failure message — never disclose whether an account exists.
    if (!authStore.token) {
      formError.value = 'Incorrect email or password. Please try again.'
      return
    }

    await authStore.userProfile()
    const profile = authStore.profile
    if (!profile) {
      formError.value = 'You signed in, but your profile could not be loaded. Please try again.'
      return
    }

    routeAfterLogin(profile)
  } catch (error) {
    formError.value = 'Sign-in failed due to a connection problem. Please try again.'
  } finally {
    form.password = ''
    loading.value = false
  }
}

function routeAfterLogin(profile) {
  if (profile.type === 'Admin') {
    router.push({ name: 'ems-dashboard' })
    return
  }
  // Non-administrators continue into the existing product (Education addon).
  router.push({ name: 'dashboard' })
}
</script>

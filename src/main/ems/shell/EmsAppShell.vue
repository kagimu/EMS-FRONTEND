<template>
  <div class="ems-app">
    <header class="ems-topbar">
      <div class="ems-topbar__inner">
        <div class="ems-topbar__brand">
          <img class="ems-topbar__logo" :src="logoUrl" alt="EMS" />
          <span class="ems-topbar__titles">
            <span class="ems-topbar__name">EMS</span>
            <span class="ems-topbar__sub">Enterprise Management Suite</span>
          </span>
        </div>

        <div class="ems-topbar__right">
          <span v-if="orgName" class="ems-org" :title="orgName">
            <i class="bi bi-building" aria-hidden="true"></i>
            <span class="ems-org__name">{{ orgName }}</span>
          </span>

          <span class="ems-user">
            <span class="ems-user__avatar" aria-hidden="true">{{ initials }}</span>
            <span class="ems-user__meta">
              <span class="ems-user__name">{{ displayName }}</span>
              <span class="ems-user__role">{{ profile?.type || 'Member' }}</span>
            </span>
          </span>

          <button type="button" class="ems-topbar__logout" @click="signOut">
            <i class="bi bi-box-arrow-right" aria-hidden="true"></i> Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Title + horizontal navigation share one line (as in the reference). -->
    <div class="ems-subbar">
      <div class="ems-subbar__inner">
        <div class="ems-subbar__titles">
          <h1 class="ems-page__title">{{ pageTitle }}</h1>
          <p v-if="pageSubtitle" class="ems-page__sub">{{ pageSubtitle }}</p>
        </div>

        <nav class="ems-nav" aria-label="EMS sections">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            class="ems-nav__item"
            :class="{ 'ems-nav__item--active': item.name === activeName }"
            :to="{ name: item.name }"
            :aria-current="item.name === activeName ? 'page' : undefined"
          >
            <i :class="item.icon" aria-hidden="true"></i>
            {{ item.label }}
          </router-link>
        </nav>
      </div>
    </div>

    <main class="ems-page">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import api from '@/config/api.js'
import logoUrl from '@/main/ems/assets/ems-logo.svg'
import { useAuthStore } from '@/main/auth/store/auth.js'
import '@/main/ems/ems-shell.css'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Only routes that actually exist are exposed.
const navItems = [
  { name: 'ems-dashboard', label: 'Dashboard', icon: 'bi bi-speedometer2' },
  { name: 'ems-organisation', label: 'Organisation', icon: 'bi bi-diagram-3' },
  { name: 'ems-stakeholders', label: 'Stakeholders', icon: 'bi bi-people' },
  { name: 'ems-workflows', label: 'Workflows', icon: 'bi bi-diagram-2' },
  { name: 'ems-addons', label: 'Add-ons', icon: 'bi bi-grid-3x3-gap' },
  { name: 'ems-notifications', label: 'Notifications', icon: 'bi bi-bell' },
  { name: 'ems-audit', label: 'Audit', icon: 'bi bi-clipboard-data' },
  { name: 'ems-licensing', label: 'Licensing', icon: 'bi bi-patch-check' },
  { name: 'ems-settings', label: 'Settings', icon: 'bi bi-gear' },
  { name: 'ems-subscription', label: 'Subscription', icon: 'bi bi-arrow-repeat' },
]

const activeName = computed(() => String(route.name || ''))
const pageTitle = computed(() => String(route.meta?.title || 'Dashboard'))
const pageSubtitle = computed(() => String(route.meta?.subtitle || ''))

const orgName = ref('')
const profile = ref(authStore.profile || readStoredProfile())

const displayName = computed(() => {
  const p = profile.value
  if (!p) return 'there'
  return [p.first_name, p.second_name].filter(Boolean).join(' ') || 'there'
})

const initials = computed(() => {
  const p = profile.value
  const first = p?.first_name?.[0] || ''
  const second = p?.second_name?.[0] || ''
  return (first + second).toUpperCase() || 'E'
})

function readStoredProfile() {
  try {
    const raw = localStorage.getItem('userProfile')
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    return null
  }
}

onMounted(async () => {
  if (!profile.value) {
    try {
      const response = await api.get('main/profile')
      profile.value = response?.data?.data || null
    } catch (error) {
      // Non-fatal: the header simply shows a generic label.
    }
  }

  try {
    const response = await api.get('main/eos/entity/current')
    const entity = response?.data?.data
    if (entity && entity.name) {
      orgName.value = entity.name
    }
  } catch (error) {
    // Non-fatal: organisation name is best-effort.
  }
})

function signOut() {
  localStorage.removeItem('token')
  localStorage.removeItem('userProfile')
  localStorage.removeItem('abilities')
  sessionStorage.clear()
  authStore.token = null
  authStore.userNumber = null
  authStore.profile = null
  authStore.loginResponse = null
  router.push({ name: 'ems-entry' })
}
</script>

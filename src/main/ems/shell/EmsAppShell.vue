<template>
  <MotionConfig reducedMotion="user">
  <div class="ems-app">
    <div class="ems-scroll-progress" aria-hidden="true">
      <span :style="{ transform: `scaleX(${scrollProgress})` }"></span>
    </div>

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
            v-for="item in visibleNavItems"
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
      <router-view v-slot="{ Component, route: currentRoute }">
        <AnimatePresence mode="wait">
          <motion.div
            v-if="Component"
            :key="currentRoute.path"
            class="ems-route"
            :initial="{ opacity: 0, y: 18, scale: 0.995 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :exit="{ opacity: 0, y: -12, scale: 0.995 }"
            :transition="{ type: 'spring', stiffness: 280, damping: 28, mass: 0.8 }"
          >
            <component :is="Component" />
          </motion.div>
        </AnimatePresence>
      </router-view>
    </main>
  </div>
  </MotionConfig>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAbility } from '@casl/vue'
import { AnimatePresence, MotionConfig, motion } from 'motion-v'

import api from '@/config/api.js'
import logoUrl from '@/main/ems/assets/ems-logo.svg'
import { useAuthStore } from '@/main/auth/store/auth.js'
import { useEmsOrganisationStore } from '@/main/ems/store/organisation.js'
import '@/main/ems/ems-shell.css'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const orgStore = useEmsOrganisationStore()
const { can } = useAbility()

// Only routes that actually exist are exposed. Each item is shown only when the
// current user holds its view permission (installation Admins see all).
const navItems = [
  { name: 'ems-dashboard', label: 'Dashboard', icon: 'bi bi-speedometer2' },
  { name: 'ems-organisation', label: 'Organisation', icon: 'bi bi-diagram-3', permission: 'view_ems_organisation' },
  { name: 'ems-stakeholders', label: 'Stakeholders', icon: 'bi bi-people', permission: 'view_ems_stakeholders' },
  { name: 'ems-workflows', label: 'Workflows', icon: 'bi bi-diagram-2', permission: 'view_ems_workflow' },
  { name: 'ems-addons', label: 'Add-ons', icon: 'bi bi-grid-3x3-gap', permission: 'view_ems_modules' },
  { name: 'ems-notifications', label: 'Notifications', icon: 'bi bi-bell', permission: 'view_ems_notifications' },
  { name: 'ems-audit', label: 'Audit', icon: 'bi bi-clipboard-data', permission: 'view_ems_audit' },
  { name: 'ems-licensing', label: 'Licensing', icon: 'bi bi-patch-check', permission: 'view_licence_status' },
  { name: 'ems-settings', label: 'Settings', icon: 'bi bi-gear' },
  { name: 'ems-subscription', label: 'Subscription', icon: 'bi bi-arrow-repeat' },
]

const activeName = computed(() => String(route.name || ''))
const pageTitle = computed(() => String(route.meta?.title || 'Dashboard'))
const pageSubtitle = computed(() => String(route.meta?.subtitle || ''))

const profile = ref(authStore.profile || readStoredProfile())
const orgName = computed(() => orgStore.current?.name || '')
const scrollProgress = ref(0)
let scrollFrame = 0

const isAdmin = computed(() => (profile.value?.type || authStore.profile?.type) === 'Admin')
const visibleNavItems = computed(() =>
  navItems.filter(
    (item) =>
      !item.permission ||
      isAdmin.value ||
      can(item.permission, 'general') ||
      can(item.permission, 'all'),
  ),
)

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
      if (profile.value) {
        authStore.profile = profile.value
      }
    } catch (error) {
      // Non-fatal: the header simply shows a generic label.
    }
  }

  await orgStore.load()
})

watch(
  () => route.path,
  () => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  },
)

function updateScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
}

function onScroll() {
  if (scrollFrame) {
    return
  }
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0
    updateScrollProgress()
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  updateScrollProgress()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (scrollFrame) {
    window.cancelAnimationFrame(scrollFrame)
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

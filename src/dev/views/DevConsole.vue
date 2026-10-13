<template>
  <div class="dev-console">
    <header class="dev-console__header">
      <div class="dev-console__brand">
        EMS Developer Test Console
        <span class="dev-console__badge">DEV ONLY</span>
      </div>
      <div class="dev-console__session" v-if="activeSession">
        Session: {{ activeSession.label }}
        <span :class="activeSession.status === 'authenticated' ? 'dev-ok' : 'dev-muted'">
          ({{ activeSession.status }})
        </span>
      </div>
      <div class="dev-console__base">API: {{ baseURL }}</div>
    </header>

    <template v-if="isDev">
      <nav class="dev-console__tabs">
        <button
          v-for="tab in visibleTabs"
          :key="tab.key"
          class="dev-tab"
          :class="{ 'dev-tab--active': tab.key === activeTab }"
          type="button"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span
            v-if="tab.requiresAuth && !isAuthenticated"
            class="dev-tab__auth"
            title="Requires an authenticated session"
            >*</span
          >
        </button>
      </nav>

      <p v-if="showAuthNotice" class="dev-console__notice">
        Not signed in — this panel calls the real EMS APIs and requires an authenticated session.
        Use <strong>First-Time Setup</strong> to register a new account, or the <strong>Session</strong>
        tab to sign in.
      </p>
      <p
        v-else-if="activeTab === 'setup-wizard' && !isAuthenticated"
        class="dev-console__notice dev-console__notice--info"
      >
        <strong>First-Time Setup</strong> is the entry point for a new EMS installation. Steps 1–2
        (registration and activation) need no session; the wizard signs you in at Step 3. Panels marked
        <span class="dev-tab__auth">*</span> require an authenticated session.
      </p>

      <main class="dev-console__body">
        <SessionPanel v-if="activeTab === 'session'" />
        <KeepAlive>
          <component :is="currentPanel" v-if="activeTab !== 'session'" @navigate="onNavigate" />
        </KeepAlive>

        <ResponseInspector />
      </main>
    </template>

    <main v-else class="dev-console__body">
      <p class="dev-console__disabled">The Developer Test Console is disabled outside development.</p>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

import '@/dev/assets/dev.css'
import ResponseInspector from '@/dev/components/ResponseInspector.vue'
import SessionPanel from '@/dev/components/SessionPanel.vue'
import AssignmentsPanel from '@/dev/panels/AssignmentsPanel.vue'
import AuthorityPanel from '@/dev/panels/AuthorityPanel.vue'
import OrganisationUnitsPanel from '@/dev/panels/OrganisationUnitsPanel.vue'
import OwnershipPanel from '@/dev/panels/OwnershipPanel.vue'
import WorkflowPanel from '@/dev/panels/WorkflowPanel.vue'
import DeadlinesPanel from '@/dev/panels/DeadlinesPanel.vue'
import NotificationsPanel from '@/dev/panels/NotificationsPanel.vue'
import AuditPanel from '@/dev/panels/AuditPanel.vue'
import LicensingPanel from '@/dev/panels/LicensingPanel.vue'
import SetupStatusPanel from '@/dev/panels/SetupStatusPanel.vue'
import SetupWizardPanel from '@/dev/panels/SetupWizardPanel.vue'
import StakeholdersPanel from '@/dev/panels/StakeholdersPanel.vue'
import { baseURL } from '@/dev/api/devApi.js'
import { useDevOnboardingStore } from '@/dev/store/devOnboarding.js'
import { useDevSessionStore } from '@/dev/store/devSession.js'

const isDev = import.meta.env.DEV
const sessionStore = useDevSessionStore()
const onboarding = useDevOnboardingStore()
const activeSession = computed(() => sessionStore.activeSession)
const isAuthenticated = computed(() => activeSession.value?.status === 'authenticated')

const tabs = [
  { key: 'setup-wizard', label: 'First-Time Setup', component: SetupWizardPanel },
  { key: 'session', label: 'Session' },
  { key: 'units', label: 'Organisation Units', component: OrganisationUnitsPanel, requiresAuth: true },
  { key: 'stakeholders', label: 'Stakeholders', component: StakeholdersPanel, requiresAuth: true },
  { key: 'assignments', label: 'Assignments', component: AssignmentsPanel, requiresAuth: true },
  { key: 'ownership', label: 'Ownership', component: OwnershipPanel, requiresAuth: true },
  { key: 'authority', label: 'Authority', component: AuthorityPanel, requiresAuth: true },
  { key: 'workflow', label: 'Workflow', component: WorkflowPanel, requiresAuth: true },
  { key: 'deadlines', label: 'Deadlines', component: DeadlinesPanel, requiresAuth: true },
  { key: 'notifications', label: 'Notifications', component: NotificationsPanel, requiresAuth: true },
  { key: 'audit', label: 'Audit', component: AuditPanel, requiresAuth: true },
  { key: 'licensing', label: 'Licensing', component: LicensingPanel, requiresAuth: true },
  { key: 'setup', label: 'Setup Status', component: SetupStatusPanel, requiresAuth: true },
]

// Session tab visibility rule (Phase 4).
// The standalone Session tab is shown when normal sign-in is meaningful: a
// session is already authenticated, an account was created/activated, a sign-in
// has succeeded before, or the developer explicitly opted into sign-in. On a
// brand-new installation with no session and no onboarding progress, First-Time
// Setup is the only entry point.
//
// LIMITATION: the backend exposes no safe "do any users exist?" probe, so a
// returning user on a fresh browser (no localStorage, no session) is NOT
// auto-detected. The First-Time Setup panel always offers an explicit
// "Already have an account? Sign in" path so returning users are never blocked.
const sessionTabVisible = computed(
  () =>
    isAuthenticated.value ||
    onboarding.accountReady ||
    onboarding.signedInOnce ||
    onboarding.signInRequested,
)

const visibleTabs = computed(() =>
  tabs.filter((tab) => tab.key !== 'session' || sessionTabVisible.value),
)

// Default entry point: First-Time Setup unless setup has progressed enough that
// normal sign-in is the expected next action.
const defaultTab = computed(() => {
  if (isAuthenticated.value) return 'session'
  if (onboarding.accountReady || onboarding.signInRequested) return 'session'
  return 'setup-wizard'
})

const activeTab = ref(defaultTab.value)

const currentPanel = computed(() => {
  const tab = tabs.find((item) => item.key === activeTab.value)
  return tab && tab.component ? tab.component : null
})

const showAuthNotice = computed(
  () => !isAuthenticated.value && activeTab.value !== 'session' && activeTab.value !== 'setup-wizard',
)

// Never leave the console on a hidden tab.
watch(sessionTabVisible, (visible) => {
  if (!visible && activeTab.value === 'session') {
    activeTab.value = 'setup-wizard'
  }
})

function onNavigate(key) {
  if (tabs.some((tab) => tab.key === key)) {
    activeTab.value = key
  }
}
</script>

<style scoped>
.dev-console {
  min-height: 100vh;
  background: #eef1f5;
  color: #1f2733;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.dev-console__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: #1f2733;
  color: #fff;
}
.dev-console__brand {
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}
.dev-console__badge {
  background: #d98a00;
  color: #1f2733;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}
.dev-console__session {
  font-size: 12px;
}
.dev-console__base {
  font-size: 12px;
  color: #c3cbd6;
}
.dev-console__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 10px 20px 0;
  max-width: 1080px;
  margin: 0 auto;
}
.dev-tab {
  border: 1px solid #cfd6df;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  background: #f6f8fb;
}
.dev-tab--active {
  background: #fff;
  border-color: #2f6fed;
  color: #2f6fed;
  font-weight: 600;
}
.dev-console__body {
  max-width: 1080px;
  margin: 0 auto;
  padding: 16px 20px 40px;
}
.dev-console__notice {
  max-width: 1080px;
  margin: 10px auto 0;
  padding: 8px 12px;
  background: #fff6e5;
  border: 1px solid #f0d59a;
  border-radius: 6px;
  font-size: 12px;
  color: #8a6100;
}
.dev-console__notice--info {
  background: #eef4ff;
  border-color: #c3d4fb;
  color: #274b9a;
}
.dev-tab__auth {
  color: #d98a00;
  font-weight: 700;
  margin-left: 2px;
}
.dev-console__disabled {
  text-align: center;
  padding: 60px 20px;
  color: #b3261e;
}
.dev-ok {
  color: #7ee2a8;
}
.dev-muted {
  color: #c3cbd6;
}
</style>

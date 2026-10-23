<template>
  <div class="ems-dash">
    <section class="ems-dash-welcome">
      <div class="ems-dash-welcome__body">
        <p class="ems-dash-welcome__eyebrow">{{ greeting }}</p>
        <h2 class="ems-dash-welcome__title">Welcome back<span v-if="userName">, {{ userName }}</span></h2>
        <p class="ems-dash-welcome__org">
          <i class="bi bi-building" aria-hidden="true"></i>
          {{ organisationName }}
        </p>
        <p class="ems-dash-welcome__msg">Here is your organisation's current overview.</p>
      </div>
      <div class="ems-dash-welcome__actions">
        <router-link
          v-if="canViewOrganisation"
          class="ems-btn ems-btn--primary"
          :to="{ path: '/ems/organisation' }"
        >
          Open Organisation
        </router-link>
        <router-link
          v-if="canViewWorkflow"
          class="ems-btn"
          :to="{ path: '/ems/organisation', query: { tab: 'approvals' } }"
        >
          Review approvals
        </router-link>
      </div>
    </section>

    <div v-if="statCards.length" class="ems-cards">
      <EmsSummaryCard
        v-for="card in statCards"
        :key="card.key"
        :label="card.label"
        :icon="card.icon"
        :tone="card.tone"
        :value="card.value"
        :available="card.available"
        :reason="card.reason"
        :to="card.to"
      />
    </div>

    <EmsContentPanel
      v-if="quickAccess.length"
      title="Quick access"
      icon="bi bi-grid-1x2"
      description="Jump to the workspace area you need."
      :state="'ready'"
    >
      <div class="ems-quick-grid">
        <router-link
          v-for="item in quickAccess"
          :key="item.key"
          class="ems-quick-card"
          :class="`ems-quick-card--${quickTones[item.key] || 'indigo'}`"
          :to="item.to"
        >
          <span class="ems-quick-card__icon" aria-hidden="true"><i :class="item.icon"></i></span>
          <span class="ems-quick-card__body">
            <strong>{{ item.label }}</strong>
            <span class="ems-small ems-muted">{{ item.description }}</span>
          </span>
          <i class="bi bi-arrow-right ems-quick-card__arrow" aria-hidden="true"></i>
        </router-link>
      </div>
    </EmsContentPanel>

    <div v-if="canViewWorkflow || canViewOrganisation || canViewModules" class="ems-dash-grid">
      <EmsContentPanel
        v-if="canViewWorkflow"
        title="Action required"
        icon="bi bi-exclamation-circle"
        description="Approval tasks and requests that need attention."
        :count="priorityItems.length"
        count-noun="item"
        count-noun-plural="items"
        :state="priorityState"
        :error-message="priorityReason"
      >
        <template #actions>
          <router-link
            class="ems-btn ems-btn--ghost"
            :to="{ path: '/ems/organisation', query: { tab: 'approvals' } }"
          >
            Open approvals
          </router-link>
        </template>

        <div v-if="priorityItems.length" class="ems-priority-list">
          <router-link
            v-for="item in priorityItems"
            :key="item.key"
            class="ems-priority-item"
            :to="item.to"
          >
            <span class="ems-priority-item__main">
              <span class="ems-priority-item__title">{{ item.title }}</span>
              <span class="ems-small ems-muted">{{ item.subtitle }}</span>
            </span>
            <span class="ems-badge" :class="item.badgeClass">{{ item.badge }}</span>
          </router-link>
        </div>
        <div v-else class="ems-empty">
          <p class="ems-empty__title">{{ priorityEmptyTitle }}</p>
          <p class="ems-empty__msg">{{ priorityEmptySub }}</p>
        </div>
      </EmsContentPanel>

      <EmsOrganisationSetupGuide v-if="canViewOrganisation" compact />

      <EmsContentPanel
        v-if="canViewModules"
        title="EMS Addons"
        icon="bi bi-grid-3x3-gap"
        description="Add-on modules available to your organisation. EMS Core is part of the base suite and is not listed as an add-on."
        :count="addons.length"
        count-noun="add-on"
        count-noun-plural="add-ons"
        :state="modulesState"
        :error-message="modulesReason"
      >
        <template #actions>
          <router-link class="ems-btn ems-btn--ghost" to="/ems/add-ons">Manage add-ons</router-link>
        </template>

        <template #empty>
          <p class="ems-empty__title">No add-ons available</p>
          <p class="ems-empty__msg">Only add-on modules appear here; EMS Core is part of the base suite.</p>
        </template>

        <div v-if="addons.length" class="ems-addon-grid">
          <section v-for="module in addons" :key="module.code" class="ems-addon-card">
            <div class="ems-addon-card__top">
              <span class="ems-addon-card__icon"><i :class="iconFor(module.code)" aria-hidden="true"></i></span>
              <div class="ems-addon-card__body">
                <h3 class="ems-addon-card__title">{{ module.name || module.code }}</h3>
                <p class="ems-small ems-muted" style="margin: 3px 0 0;">{{ descriptionFor(module.code) }}</p>
              </div>
            </div>

            <div class="ems-addon-card__badges">
              <span class="ems-badge" :class="module.enabled ? 'ems-badge--ok' : 'ems-badge--muted'">
                {{ module.enabled ? 'Enabled' : 'Disabled' }}
              </span>
              <span class="ems-badge" :class="entitled(module.code) ? 'ems-badge--ok' : 'ems-badge--warn'">
                {{ entitled(module.code) ? 'Licensed' : licenceAvailable ? 'Not entitled' : 'Licence unavailable' }}
              </span>
            </div>

            <div v-if="module.code === 'education'" class="ems-addon-card__actions">
              <button
                type="button"
                class="ems-btn ems-btn--primary ems-btn--block"
                @click="openEducation"
              >
                Go to Education
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
              </button>
              <p v-if="!entitled('education')" class="ems-small ems-muted" style="margin: 8px 0 0;">
                {{ licenceAvailable ? 'Education access is subject to your current licence.' : 'Licence status could not be loaded.' }}
              </p>
            </div>
          </section>
        </div>
      </EmsContentPanel>
    </div>

    <EmsContentPanel
      v-if="canViewAudit"
      title="Recent activity"
      icon="bi bi-clock-history"
      description="Latest audit facts for your organisation."
      :count="recentActivity.length"
      count-noun="event"
      count-noun-plural="events"
      :state="activityState"
      :error-message="activityReason"
    >
      <template #actions>
        <router-link class="ems-btn ems-btn--ghost" to="/ems/audit">Open audit</router-link>
      </template>
      <template #empty>
        <p class="ems-empty__title">No recent activity</p>
        <p class="ems-empty__msg">Audit events will appear here when organisation records change.</p>
      </template>

      <div v-if="recentActivity.length" class="ems-activity-list">
        <div
          v-for="item in recentActivity"
          :key="item.number || `${item.action}-${item.created_at}`"
          class="ems-activity-item"
        >
          <span>
            <span class="ems-activity-item__title">{{ humanize(item.action) }}</span>
            <span class="ems-small ems-muted">{{ item.resource_type || 'Record' }} · {{ formatDate(item.created_at) }}</span>
          </span>
          <span class="ems-badge ems-badge--muted">{{ item.resource_type || 'Activity' }}</span>
        </div>
      </div>
    </EmsContentPanel>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAbility } from '@casl/vue'

import { useAuthStore } from '@/main/auth/store/auth.js'
import EmsContentPanel from '@/main/ems/components/EmsContentPanel.vue'
import EmsOrganisationSetupGuide from '@/main/ems/components/EmsOrganisationSetupGuide.vue'
import EmsSummaryCard from '@/main/ems/components/EmsSummaryCard.vue'
import { fetchList, fetchObject } from '@/main/ems/services/emsApi.js'
import { useEmsOrganisationStore } from '@/main/ems/store/organisation.js'

const authStore = useAuthStore()
const orgStore = useEmsOrganisationStore()
const router = useRouter()
const { can } = useAbility()

const isAdmin = computed(() => authStore.profile?.type === 'Admin')
function canView(permission) {
  return isAdmin.value || can(permission, 'general') || can(permission, 'all')
}

const canViewOrganisation = computed(() => canView('view_ems_organisation'))
const canViewStakeholders = computed(() => canView('view_ems_stakeholders'))
const canViewAssignments = computed(() => canView('view_ems_assignments'))
const canViewAuthority = computed(() => canView('view_ems_authority'))
const canViewWorkflow = computed(() => canView('view_ems_workflow'))
const canViewNotifications = computed(() => canView('view_ems_notifications'))
const canViewAudit = computed(() => canView('view_ems_audit'))
const canViewLicence = computed(() => canView('view_licence_status'))
const canViewModules = computed(() => canView('view_ems_modules'))

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const userName = computed(() => {
  const profile = authStore.profile
  if (!profile) return ''
  return [profile.first_name, profile.second_name].filter(Boolean).join(' ')
})

const organisationName = computed(() => orgStore.current?.name || 'Your organisation')

const stats = reactive({
  units: { available: false, reason: 'Checking…', value: '—' },
  stakeholders: { available: false, reason: 'Checking…', value: '—' },
  tasks: { available: false, reason: 'Checking…', value: '—' },
  notifications: { available: false, reason: 'Checking…', value: '—' },
  licence: { available: false, reason: 'Checking…', value: '—' },
})

const licenceData = ref(null)
const licenceAvailable = ref(false)

const statCards = computed(() => {
  const cards = []

  if (canViewOrganisation.value) {
    cards.push({
      key: 'units',
      label: 'Organisation units',
      icon: 'bi bi-diagram-3',
      tone: 'blue',
      value: stats.units.value,
      available: stats.units.available,
      reason: stats.units.reason,
      to: { path: '/ems/organisation', query: { tab: 'structure' } },
    })
  }
  if (canViewStakeholders.value) {
    cards.push({
      key: 'stakeholders',
      label: 'Stakeholder records',
      icon: 'bi bi-people',
      tone: 'green',
      value: stats.stakeholders.value,
      available: stats.stakeholders.available,
      reason: stats.stakeholders.reason,
      to: { path: '/ems/organisation', query: { tab: 'people' } },
    })
  }
  if (canViewWorkflow.value) {
    cards.push({
      key: 'tasks',
      label: 'Approvals awaiting you',
      icon: 'bi bi-check2-square',
      tone: 'orange',
      value: stats.tasks.value,
      available: stats.tasks.available,
      reason: stats.tasks.reason,
      to: { path: '/ems/organisation', query: { tab: 'approvals' } },
    })
  }
  if (canViewNotifications.value) {
    cards.push({
      key: 'notifications',
      label: 'Unread notifications',
      icon: 'bi bi-bell',
      tone: 'purple',
      value: stats.notifications.value,
      available: stats.notifications.available,
      reason: stats.notifications.reason,
      to: '/ems/notifications',
    })
  }
  if (canViewLicence.value) {
    cards.push({
      key: 'licence',
      label: 'Licence',
      icon: 'bi bi-patch-check',
      tone: 'indigo',
      value: stats.licence.value,
      available: stats.licence.available,
      reason: stats.licence.reason,
      to: '/ems/licensing',
    })
  }

  return cards
})

const quickTones = {
  organisation: 'indigo',
  structure: 'blue',
  people: 'green',
  assignments: 'teal',
  reporting: 'purple',
  authority: 'orange',
  approvals: 'blue',
  notifications: 'purple',
  audit: 'teal',
}

const quickAccess = computed(() =>
  [
    {
      key: 'organisation',
      label: 'Organisation',
      description: 'Profile and organisation settings.',
      icon: 'bi bi-building',
      to: { path: '/ems/organisation', query: { tab: 'profile' } },
      show: canViewOrganisation.value,
    },
    {
      key: 'structure',
      label: 'Structure',
      description: 'Departments, branches and organisational units.',
      icon: 'bi bi-diagram-3',
      to: { path: '/ems/organisation', query: { tab: 'structure' } },
      show: canViewOrganisation.value,
    },
    {
      key: 'people',
      label: 'People & Ownership',
      description: 'Stakeholders, owners and effective ownership.',
      icon: 'bi bi-people',
      to: { path: '/ems/organisation', query: { tab: 'people' } },
      show: canViewStakeholders.value,
    },
    {
      key: 'assignments',
      label: 'Assignments',
      description: 'Who works where, and in what position.',
      icon: 'bi bi-person-badge',
      to: { path: '/ems/organisation', query: { tab: 'assignments' } },
      show: canViewAssignments.value,
    },
    {
      key: 'reporting',
      label: 'Reporting',
      description: 'Who reports to whom.',
      icon: 'bi bi-diagram-2',
      to: { path: '/ems/organisation', query: { tab: 'reporting' } },
      show: canViewAssignments.value,
    },
    {
      key: 'authority',
      label: 'Decision Authority',
      description: 'Who can approve which decisions.',
      icon: 'bi bi-shield-check',
      to: { path: '/ems/organisation', query: { tab: 'authority' } },
      show: canViewAuthority.value,
    },
    {
      key: 'approvals',
      label: 'Approvals',
      description: 'Requests awaiting a decision.',
      icon: 'bi bi-check2-square',
      to: { path: '/ems/organisation', query: { tab: 'approvals' } },
      show: canViewWorkflow.value,
    },
    {
      key: 'notifications',
      label: 'Notifications',
      description: 'Updates addressed to you.',
      icon: 'bi bi-bell',
      to: '/ems/notifications',
      show: canViewNotifications.value,
    },
    {
      key: 'audit',
      label: 'Audit',
      description: 'Organisation activity history.',
      icon: 'bi bi-clipboard-data',
      to: '/ems/audit',
      show: canViewAudit.value,
    },
  ].filter((item) => item.show),
)

const approvalTasks = ref([])
const blockedRequests = ref([])
const returnedRequests = ref([])
const priorityState = ref('loading')
const priorityReason = ref('')
const priorityPartial = ref(false)

const priorityItems = computed(() => {
  const items = []

  for (const task of approvalTasks.value) {
    if (items.length >= 5) break
    const resource = [task.module, task.resource_type, task.resource_number].filter(Boolean).join(' / ')
    items.push({
      key: `task-${task.assignment_number || task.request_number}`,
      title: `Approval required: ${task.decision_type}`,
      subtitle: `${resource}${resource ? ' · ' : ''}Level ${task.approval_level}`,
      badge: task.overdue ? 'Overdue' : task.reminder ? 'Due soon' : 'Awaiting you',
      badgeClass: task.overdue ? 'ems-badge--danger' : task.reminder ? 'ems-badge--warn' : 'ems-badge--muted',
      to: { path: '/ems/organisation', query: { tab: 'approvals' } },
    })
  }

  for (const request of blockedRequests.value) {
    if (items.length >= 5) break
    const resource = [request.module, request.resource_type, request.resource_number].filter(Boolean).join(' / ')
    items.push({
      key: `blocked-${request.number}`,
      title: `Blocked: ${request.decision_type}`,
      subtitle: resource || 'No eligible approver identified.',
      badge: 'Blocked',
      badgeClass: 'ems-badge--danger',
      to: { path: '/ems/organisation', query: { tab: 'approvals' } },
    })
  }

  for (const request of returnedRequests.value) {
    if (items.length >= 5) break
    const resource = [request.module, request.resource_type, request.resource_number].filter(Boolean).join(' / ')
    items.push({
      key: `returned-${request.number}`,
      title: `Returned for changes: ${request.decision_type}`,
      subtitle: resource || 'The requester must submit a corrected request.',
      badge: 'Returned',
      badgeClass: 'ems-badge--warn',
      to: { path: '/ems/organisation', query: { tab: 'approvals' } },
    })
  }

  return items
})

const priorityEmptyTitle = computed(() =>
  priorityPartial.value ? 'Some items could not be loaded' : "You're all caught up.",
)
const priorityEmptySub = computed(() =>
  priorityPartial.value
    ? 'Refresh the page to try again.'
    : 'No approval tasks, blocked requests or returned requests need your attention.',
)

const recentActivity = ref([])
const activityState = ref('loading')
const activityReason = ref('')

const modules = ref([])
const modulesState = ref('loading')
const modulesReason = ref('')

const addons = computed(() =>
  modules.value.filter((module) => String(module.code || '').toLowerCase() !== 'core'),
)

function licensedAddonCodes() {
  const value = licenceData.value?.licensed_addons
  if (Array.isArray(value)) {
    return value
  }
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
  return licensedAddonCodes()
    .map((item) => String(item).toLowerCase())
    .includes(String(code).toLowerCase())
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
  router.push({ name: 'home' })
}

async function loadListStat(key, url, params, filter) {
  const result = await fetchList(url, params)
  if (!result.available) {
    stats[key].available = false
    stats[key].reason = result.reason
    stats[key].value = '—'
    return result
  }

  const list = filter ? result.list.filter(filter) : result.list
  stats[key].available = true
  stats[key].reason = ''
  stats[key].value = filter ? list.length : typeof result.total === 'number' ? result.total : list.length
  return result
}

async function loadLicence() {
  const result = await fetchObject('/main/ems/licence')
  licenceAvailable.value = result.available
  if (result.available) {
    licenceData.value = result.object || null
    stats.licence.available = true
    stats.licence.reason = ''
    stats.licence.value =
      result.object?.effective_status || result.object?.status || (result.object ? 'Active' : 'No licence')
  } else {
    licenceData.value = null
    stats.licence.available = false
    stats.licence.reason = result.reason
    stats.licence.value = '—'
  }
}

async function loadWorkflow() {
  priorityState.value = 'loading'
  priorityReason.value = ''
  priorityPartial.value = false

  const [tasks, blocked, returned] = await Promise.all([
    fetchList('/main/ems/approval-tasks'),
    fetchList('/main/ems/approvals', { status: 'BLOCKED', limit: 3 }),
    fetchList('/main/ems/approvals', { status: 'RETURNED', limit: 3 }),
  ])

  if (tasks.available) {
    stats.tasks.available = true
    stats.tasks.reason = ''
    stats.tasks.value = tasks.list.length
    approvalTasks.value = tasks.list
  } else {
    stats.tasks.available = false
    stats.tasks.reason = tasks.reason
    stats.tasks.value = '—'
    approvalTasks.value = []
  }

  blockedRequests.value = blocked.available ? blocked.list : []
  returnedRequests.value = returned.available ? returned.list : []

  const failures = [tasks, blocked, returned].filter((result) => !result.available).length
  priorityPartial.value = failures > 0

  if (failures === 3) {
    priorityState.value = 'error'
    priorityReason.value = tasks.reason || blocked.reason || returned.reason || 'Unavailable'
    return
  }

  priorityState.value = 'ready'
}

async function loadActivity() {
  activityState.value = 'loading'
  activityReason.value = ''
  const result = await fetchList('/main/ems/audit')
  if (!result.available) {
    activityState.value = 'error'
    activityReason.value = result.reason
    return
  }

  recentActivity.value = result.list.slice(0, 5)
  activityState.value = recentActivity.value.length ? 'ready' : 'empty'
}

async function loadModules() {
  modulesState.value = 'loading'
  modulesReason.value = ''
  const result = await fetchList('/main/ems/modules')
  if (!result.available) {
    modulesReason.value = result.reason
    modulesState.value = 'error'
    return
  }

  modules.value = result.list
  modulesState.value = modules.value.some(
    (module) => String(module.code || '').toLowerCase() !== 'core',
  )
    ? 'ready'
    : 'empty'
}

function humanize(value) {
  return String(value || '')
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  orgStore.load()

  const jobs = []
  if (canViewOrganisation.value) {
    jobs.push(loadListStat('units', '/main/ems/organisation-units'))
  }
  if (canViewStakeholders.value) {
    jobs.push(loadListStat('stakeholders', '/main/ems/stakeholders'))
  }
  if (canViewNotifications.value) {
    jobs.push(loadListStat('notifications', '/main/ems/notifications', { unread: 'true' }))
  }
  if (canViewLicence.value) {
    jobs.push(loadLicence())
  }
  if (canViewWorkflow.value) {
    jobs.push(loadWorkflow())
  }
  if (canViewAudit.value) {
    jobs.push(loadActivity())
  }
  if (canViewModules.value) {
    jobs.push(loadModules())
  }

  Promise.all(jobs)
})
</script>

<style scoped>
.ems-dash {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ems-dash :deep(.ems-panel) {
  margin-bottom: 0;
}

.ems-dash-welcome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  padding: 22px 24px;
  border: 1px solid #2b3f9e;
  border-radius: 16px;
  background: linear-gradient(135deg, #2c2f8c 0%, #2455b8 55%, #1e88e5 100%);
  color: #fff;
  box-shadow: 0 14px 34px rgba(44, 47, 140, 0.22);
}

.ems-dash-welcome__eyebrow {
  margin: 0 0 4px;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #c7d7ff;
}

.ems-dash-welcome__title {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  color: #fff;
}

.ems-dash-welcome__org {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 10px 0 0;
  padding: 4px 10px;
  width: fit-content;
  max-width: 100%;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.ems-dash-welcome__org i {
  color: #c7d7ff;
}

.ems-dash-welcome__msg {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: 13.5px;
}

.ems-dash-welcome__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ems-dash-welcome__actions .ems-btn {
  background: #fff;
  border-color: #fff;
  color: var(--ems-brand);
}

.ems-dash-welcome__actions .ems-btn:hover {
  background: #eef1ff;
  border-color: #eef1ff;
  color: var(--ems-brand);
}

.ems-dash-welcome__actions .ems-btn + .ems-btn {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.45);
  color: #fff;
}

.ems-dash-welcome__actions .ems-btn + .ems-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.7);
  color: #fff;
}

.ems-dash-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  align-items: stretch;
}

.ems-dash-grid > * {
  height: 100%;
  min-width: 0;
}

@media (min-width: 1100px) {
  .ems-dash-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.ems-addon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  height: 100%;
}

.ems-addon-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border: 1px solid #e2d8f7;
  border-radius: 14px;
  background: linear-gradient(135deg, #f6f0ff, #ffffff 72%);
  box-shadow: 0 1px 2px rgba(45, 34, 90, 0.05);
}

.ems-addon-card__top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.ems-addon-card__body {
  min-width: 0;
}

.ems-addon-card__icon {
  width: 42px;
  height: 42px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: #7b2fd0;
  color: #fff;
  font-size: 19px;
  box-shadow: 0 4px 10px rgba(123, 47, 208, 0.25);
}

.ems-addon-card__title {
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  color: var(--ems-ink);
}

.ems-addon-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ems-addon-card__actions {
  margin-top: auto;
  padding-top: 4px;
}

.ems-addon-card__actions .ems-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.ems-quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.ems-dash :deep(.ems-panel__title) i {
  color: var(--ems-brand);
}

.ems-quick-card {
  --ems-quick-accent: #2c2f8c;
  --ems-quick-tint: #eef0ff;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border: 1px solid #e6e9f0;
  border-left: 3px solid var(--ems-quick-accent);
  border-radius: 12px;
  background: linear-gradient(135deg, var(--ems-quick-tint), #ffffff 88%);
  color: var(--ems-ink);
  text-decoration: none;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.08s;
}

.ems-quick-card--indigo { --ems-quick-accent: #2c2f8c; --ems-quick-tint: #eef0ff; }
.ems-quick-card--blue { --ems-quick-accent: #1e88e5; --ems-quick-tint: #eaf4ff; }
.ems-quick-card--green { --ems-quick-accent: #12955a; --ems-quick-tint: #eafaf1; }
.ems-quick-card--teal { --ems-quick-accent: #0b7285; --ems-quick-tint: #e8f8fb; }
.ems-quick-card--purple { --ems-quick-accent: #7b2fd0; --ems-quick-tint: #f5edff; }
.ems-quick-card--orange { --ems-quick-accent: #e0521a; --ems-quick-tint: #fff2ea; }

.ems-quick-card:hover {
  border-color: var(--ems-quick-accent);
  border-left-color: var(--ems-quick-accent);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.09);
  transform: translateY(-1px);
}

.ems-quick-card__icon {
  width: 36px;
  height: 36px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--ems-quick-accent);
  color: #fff;
  font-size: 17px;
}

.ems-quick-card__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ems-quick-card__arrow {
  margin-left: auto;
  color: var(--ems-quick-accent);
  opacity: 0.7;
}

.ems-priority-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ems-priority-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 16px 18px;
  border: 1px solid #e6e9f0;
  border-radius: 10px;
  background: #fbfcfe;
  color: inherit;
  text-decoration: none;
}

.ems-priority-item:hover {
  border-color: #c9d3ea;
  background: #f6f8fd;
}

.ems-priority-item__main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ems-priority-item__title {
  font-size: 13px;
  font-weight: 700;
}

.ems-activity-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ems-activity-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #eef1f6;
}

.ems-activity-item:last-child {
  border-bottom: 0;
}

.ems-activity-item__title {
  display: block;
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 700px) {
  .ems-dash-welcome {
    padding: 16px;
  }

  .ems-dash-welcome__title {
    font-size: 20px;
  }

  .ems-dash-welcome__actions {
    width: 100%;
  }

  .ems-dash-welcome__actions .ems-btn {
    flex: 1 1 auto;
  }
}

/* Staggered entrance for dashboard blocks (paired with the Motion route spring). */
.ems-dash > * {
  animation: ems-dash-stagger 0.48s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.ems-dash > *:nth-child(2) { animation-delay: 0.05s; }
.ems-dash > *:nth-child(3) { animation-delay: 0.1s; }
.ems-dash > *:nth-child(4) { animation-delay: 0.15s; }
.ems-dash > *:nth-child(5) { animation-delay: 0.2s; }

@keyframes ems-dash-stagger {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ems-dash > * {
    animation: none;
  }
}
</style>

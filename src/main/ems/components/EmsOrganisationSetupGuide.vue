<template>
  <section class="ems-panel ems-setup-guide" :class="{ 'ems-setup-guide--compact': compact }">
    <div class="ems-setup-guide__head">
      <div>
        <h2 class="ems-panel__title">
          <i class="bi bi-signpost-2" aria-hidden="true"></i>
          Set up your organisation
        </h2>
        <p class="ems-small ems-muted" style="margin: 4px 0 0;">
          Follow these steps in order — each one builds on the previous one.
          Core setup: <strong>{{ configuredCoreCount }} of 5</strong> configured<span v-if="unassessedCoreCount"> ({{ unassessedCoreCount }} not assessed)</span>.
        </p>
      </div>
      <div v-if="compact" class="ems-actions">
        <button type="button" class="ems-btn ems-btn--ghost" :disabled="loading" @click="loadCounts">
          Refresh
        </button>
        <router-link
          class="ems-btn ems-btn--primary"
          :to="{ path: '/ems/organisation' }"
        >
          Open Organisation
        </router-link>
      </div>
      <div v-else class="ems-actions">
        <button type="button" class="ems-btn ems-btn--ghost" :disabled="loading" @click="loadCounts">
          Refresh
        </button>
        <button type="button" class="ems-btn ems-btn--ghost" @click="toggle">
          {{ collapsed ? 'Show steps' : 'Hide steps' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="ems-small ems-muted" style="margin-top: 8px;">Checking your setup…</div>

    <div v-if="nextStep" class="ems-alert ems-alert--info ems-setup-guide__next" role="status">
      <div>
        <strong>Next recommended step:</strong> {{ nextStep.next }}
      </div>
      <router-link class="ems-link" :to="{ path: '/ems/organisation', query: { tab: nextStep.tab } }">
        Open {{ nextStep.short }} →
      </router-link>
    </div>
    <div v-else-if="!loading && allAssessed" class="ems-alert ems-alert--success" role="status">
      Core setup is configured. Review decision authority and approvals as needed.
    </div>
    <div v-else-if="!loading" class="ems-alert ems-alert--info" role="status">
      Some setup information could not be assessed. Review the steps below.
    </div>

    <div v-if="compact" class="ems-setup-compact">
      <router-link
        v-for="step in coreSteps"
        :key="step.key"
        class="ems-setup-compact__item"
        :to="{ path: '/ems/organisation', query: { tab: step.tab } }"
      >
        <span class="ems-setup-compact__dot" :class="`is-${step.status.key}`"></span>
        <span class="ems-setup-compact__name">{{ step.short }}</span>
        <span class="ems-small ems-muted">{{ step.status.label }}</span>
      </router-link>
    </div>

    <div v-if="!collapsed && !compact" class="ems-setup-grid">
      <article
        v-for="step in steps"
        :key="step.key"
        class="ems-setup-step"
        :class="`ems-setup-step--${step.status.key}`"
      >
        <div class="ems-setup-step__top">
          <span class="ems-setup-step__number">{{ step.number }}</span>
          <span class="ems-badge" :class="step.status.badge">{{ step.status.label }}</span>
        </div>
        <h3 class="ems-setup-step__title">{{ step.title }}</h3>
        <p class="ems-small ems-muted ems-setup-step__summary">{{ step.summary }}</p>
        <div class="ems-setup-step__foot">
          <span v-if="step.countLabel" class="ems-small ems-muted">{{ step.countLabel }}</span>
          <router-link
            class="ems-btn ems-btn--ghost ems-setup-step__open"
            :to="{ path: '/ems/organisation', query: { tab: step.tab } }"
          >
            Open {{ step.short }}
          </router-link>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

import api from '@/config/api.js'

defineProps({
  compact: { type: Boolean, default: false },
})

const COLLAPSE_KEY = 'ems_organisation_setup_guide_collapsed'

const counts = reactive({
  units: null,
  stakeholders: null,
  assignments: null,
  reporting: null,
  authority: null,
})
const loading = ref(true)
const collapsed = ref(readCollapsed())

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === 'true'
  } catch (error) {
    return false
  }
}

function toggle() {
  collapsed.value = !collapsed.value
  try {
    localStorage.setItem(COLLAPSE_KEY, String(collapsed.value))
  } catch (error) {
    // Preference persistence is best-effort.
  }
}

async function loadCounts() {
  const sources = [
    ['units', 'main/ems/organisation-units'],
    ['stakeholders', 'main/ems/stakeholders'],
    ['assignments', 'main/ems/user-assignments'],
    ['reporting', 'main/ems/reporting-lines'],
    ['authority', 'main/ems/decision-authorities'],
  ]

  loading.value = true
  const results = await Promise.allSettled(
    sources.map(([, url]) =>
      api.get(url, {
        timeout: 15000,
        // Setup counts must never be served from an HTTP cache: the user may
        // have just changed a unit, person, assignment, reporting line or rule.
        params: { _setup_ts: Date.now() },
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      }),
    ),
  )
  results.forEach((result, index) => {
    const [key] = sources[index]
    if (result.status === 'fulfilled' && Array.isArray(result.value?.data?.data)) {
      counts[key] = result.value.data.data.length
    } else {
      // Never guess a completion state: an unavailable count is "not assessed".
      counts[key] = null
    }
  })
  loading.value = false
}

function statusFor(key, options = {}) {
  if (options.review) {
    return { key: 'review', label: 'Review this step', badge: 'ems-badge--muted' }
  }

  const count = counts[key]
  if (count === null) {
    return { key: 'unknown', label: 'Not yet assessed', badge: 'ems-badge--muted' }
  }
  if (count > 0) {
    return { key: 'done', label: 'Configured', badge: 'ems-badge--ok' }
  }
  if (options.optional) {
    return { key: 'optional', label: 'Optional — not set', badge: 'ems-badge--muted' }
  }
  return { key: 'todo', label: 'Not configured', badge: 'ems-badge--warn' }
}

function countLabel(key, singular, plural) {
  const count = counts[key]
  if (count === null) {
    return ''
  }
  return `${count} ${count === 1 ? singular : plural}`
}

const steps = computed(() => [
  {
    key: 'profile',
    number: 1,
    short: 'Profile',
    tab: 'profile',
    title: 'Organisation profile',
    summary: 'Review the organisation name and contact details. This identifies the business throughout EMS.',
    status: statusFor('profile', { review: true }),
    countLabel: '',
  },
  {
    key: 'structure',
    number: 2,
    short: 'Structure',
    tab: 'structure',
    title: 'Organisation structure',
    summary: 'Create the departments, branches or divisions that make up the business. Units are created before people are assigned.',
    status: statusFor('structure'),
    countLabel: countLabel('units', 'unit', 'units'),
    next: 'Create your first department or organisational unit.',
  },
  {
    key: 'people',
    number: 3,
    short: 'People',
    tab: 'people',
    title: 'People & ownership',
    summary: 'Record owners, directors, employees and other stakeholders. A stakeholder is not automatically an EMS login; existing user accounts are required.',
    status: statusFor('people'),
    countLabel: countLabel('stakeholders', 'stakeholder record', 'stakeholder records'),
    next: 'Record the people associated with the organisation. Existing EMS user accounts are required.',
  },
  {
    key: 'assignments',
    number: 4,
    short: 'Assignments',
    tab: 'assignments',
    title: 'Assignments',
    summary: 'Connect a person to a unit and position title. A position title is not a software role, and one person can have several assignments.',
    status: statusFor('assignments'),
    countLabel: countLabel('assignments', 'assignment', 'assignments'),
    next: 'Create assignments to connect people to their positions.',
  },
  {
    key: 'reporting',
    number: 5,
    short: 'Reporting',
    tab: 'reporting',
    title: 'Reporting',
    summary: 'Define which assignment reports to which manager. Both need active assignments; reporting does not grant software permissions.',
    status: statusFor('reporting'),
    countLabel: countLabel('reporting', 'reporting line', 'reporting lines'),
    next: 'Create reporting relationships to establish who reports to whom.',
  },
  {
    key: 'authority',
    number: 6,
    short: 'Decision Authority',
    tab: 'authority',
    title: 'Decision authority',
    summary: 'Configure who may approve each decision type, at which level and within which limits. Authority uses roles or stakeholder types — not individual people.',
    status: statusFor('authority', { optional: true }),
    countLabel: countLabel('authority', 'authority rule', 'authority rules'),
    next: 'Configure decision authority if your organisation requires formal approval controls.',
  },
  {
    key: 'approvals',
    number: 7,
    short: 'Approvals',
    tab: 'approvals',
    title: 'Approvals',
    summary: 'Raise and process approval requests. Requests use the authority rules and may be blocked if no eligible approver is found.',
    status: { key: 'optional', label: 'Optional', badge: 'ems-badge--muted' },
    countLabel: '',
  },
])

const coreSteps = computed(() =>
  steps.value.filter((step) =>
    ['structure', 'people', 'assignments', 'reporting', 'authority'].includes(step.key),
  ),
)

const configuredCoreCount = computed(
  () =>
    ['units', 'stakeholders', 'assignments', 'reporting', 'authority'].filter(
      (key) => typeof counts[key] === 'number' && counts[key] > 0,
    ).length,
)
const unassessedCoreCount = computed(
  () =>
    ['units', 'stakeholders', 'assignments', 'reporting', 'authority'].filter(
      (key) => counts[key] === null,
    ).length,
)
const allAssessed = computed(() =>
  ['units', 'stakeholders', 'assignments', 'reporting', 'authority'].every(
    (key) => typeof counts[key] === 'number',
  ),
)

const nextStep = computed(() => {
  const step = (key) => steps.value.find((item) => item.key === key)

  if (counts.units === 0) return step('structure')
  if (counts.stakeholders === 0) return step('people')
  if (counts.assignments === 0) return step('assignments')
  if (counts.reporting === 0 && typeof counts.assignments === 'number' && counts.assignments > 0) {
    return step('reporting')
  }
  if (counts.authority === 0) return step('authority')
  return null
})

function refreshWhenVisible() {
  if (document.visibilityState === 'visible') {
    loadCounts()
  }
}

onMounted(() => {
  loadCounts()
  window.addEventListener('focus', refreshWhenVisible)
  document.addEventListener('visibilitychange', refreshWhenVisible)
})

onBeforeUnmount(() => {
  window.removeEventListener('focus', refreshWhenVisible)
  document.removeEventListener('visibilitychange', refreshWhenVisible)
})
</script>

<style scoped>
.ems-setup-guide {
  margin-bottom: 16px;
}

.ems-setup-guide--compact {
  margin-bottom: 0;
  padding: 18px 20px;
}

.ems-setup-guide--compact .ems-setup-guide__head {
  padding: 0 0 12px;
}

.ems-setup-compact {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
}

.ems-setup-compact__item {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--ems-ink);
  border-radius: 6px;
  padding: 2px 4px;
}

.ems-setup-compact__item:hover {
  background: #f1f4fb;
}

.ems-setup-compact__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #c7cdd8;
  flex: none;
}

.ems-setup-compact__dot.is-done { background: #34a06b; }
.ems-setup-compact__dot.is-todo { background: #e0a52e; }

.ems-setup-compact__name {
  font-size: 12.5px;
  font-weight: 700;
}

.ems-setup-guide__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 6px 8px 12px;
  border-bottom: 1px solid #eef1f6;
  margin-bottom: 6px;
}

.ems-setup-guide__next {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.ems-setup-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.ems-setup-step {
  border: 1px solid #e6e9f0;
  border-left-width: 4px;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fbfcfe;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ems-setup-step--done { border-left-color: #34a06b; }
.ems-setup-step--todo { border-left-color: #e0a52e; }
.ems-setup-step--review,
.ems-setup-step--optional,
.ems-setup-step--unknown { border-left-color: #c7cdd8; }

.ems-setup-step__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ems-setup-step__number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #eef2fb;
  color: var(--ems-brand);
  font-size: 11.5px;
  font-weight: 800;
}

.ems-setup-step__title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 800;
  color: var(--ems-ink);
}

.ems-setup-step__summary {
  margin: 0;
  flex: 1;
}

.ems-setup-step__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.ems-setup-step__open {
  padding: 5px 9px;
  font-size: 12px;
}
</style>

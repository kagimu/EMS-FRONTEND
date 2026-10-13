<template>
  <div>
    <!-- A — NOTIFICATION INBOX -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Foundation G3 — Notification Inbox (current session)</h2>
        <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="loadInbox">Load notifications</button>
      </div>

      <p class="dc-note">
        Recipient-scoped and organisation-scoped. The backend returns only notifications addressed to the
        authenticated session's user. Filters are backend-supported only: <code>type</code> (free text),
        <code>unread=true</code>, <code>limit</code> (default 50, max 200) and <code>offset</code>.
      </p>

      <div class="dc-form">
        <label class="dc-field">
          <span>type</span>
          <input v-model.trim="filters.type" class="dc-input" placeholder="free text (optional)" />
        </label>
        <label class="dc-field">
          <span>unread</span>
          <select v-model="filters.unread" class="dc-select">
            <option value="">(any)</option>
            <option value="true">unread only</option>
          </select>
        </label>
        <label class="dc-field">
          <span>limit (1–200)</span>
          <input v-model.trim="filters.limit" class="dc-input" type="number" min="1" max="200" style="min-width: 90px;" />
        </label>
        <label class="dc-field">
          <span>offset</span>
          <input v-model.trim="filters.offset" class="dc-input" type="number" min="0" style="min-width: 90px;" />
        </label>
      </div>

      <p class="dc-small dc-muted">Total matching: {{ total === null ? '—' : total }}</p>

      <p v-if="items.length === 0" class="dc-muted dc-small">No notifications loaded.</p>

      <table v-else class="dc-table">
        <thead>
          <tr><th>number</th><th>type</th><th>title</th><th>state</th><th>created_at</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.number" :class="{ 'dc-row--selected': item.number === selectedNumber }">
            <td class="dc-small">{{ item.number }}</td>
            <td class="dc-small">{{ item.type }}</td>
            <td>{{ item.title }}</td>
            <td>
              <span class="dc-status" :class="item.read_at ? 'dc-status--active' : 'dc-status--pending'">
                {{ item.read_at ? 'READ' : 'UNREAD' }}
              </span>
            </td>
            <td class="dc-small">{{ item.created_at }}</td>
            <td><button class="dc-btn dc-btn--ghost" type="button" @click="openNotification(item.number)">Open</button></td>
          </tr>
        </tbody>
      </table>

      <p v-if="errorMessage" class="dc-error">{{ errorMessage }}</p>
    </section>

    <!-- B — NOTIFICATION DETAIL -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>Notification Detail</h2>
        <button class="dc-btn" type="button" :disabled="!selectedNumber || busy" @click="openNotification(selectedNumber)">Refresh</button>
      </div>

      <div class="dc-form">
        <label class="dc-field">
          <span>notification number</span>
          <input v-model.trim="selectedNumber" class="dc-input" placeholder="notification number" />
        </label>
      </div>

      <p v-if="!selected" class="dc-muted dc-small">Enter a notification number or open one from the inbox.</p>

      <div v-else>
        <dl class="dc-kv">
          <dt>number</dt><dd>{{ selected.number }}</dd>
          <dt>organisation_number</dt><dd>{{ selected.organisation_number }}</dd>
          <dt>recipient_user_number</dt><dd>{{ selected.recipient_user_number }}</dd>
          <dt>type</dt><dd>{{ selected.type }}</dd>
          <dt>title</dt><dd>{{ selected.title }}</dd>
          <dt>body</dt><dd>{{ selected.body || '—' }}</dd>
          <dt>state</dt>
          <dd>
            <span class="dc-status" :class="selected.read_at ? 'dc-status--active' : 'dc-status--pending'">
              {{ selected.read_at ? 'READ' : 'UNREAD' }}
            </span>
          </dd>
          <dt>read_at</dt><dd>{{ selected.read_at || '—' }}</dd>
          <dt>created_at</dt><dd>{{ selected.created_at }}</dd>
        </dl>

        <h3 class="dc-small">payload (raw JSON)</h3>
        <pre class="dc-detail">{{ prettyPayload(selected.payload) }}</pre>
      </div>

      <!-- C — READ ACTIONS -->
      <div class="dc-actions" style="flex-wrap: wrap; margin-top: 10px;">
        <button
          class="dc-btn dc-btn--primary"
          type="button"
          :disabled="!selected || busy"
          :title="selected && selected.read_at ? 'already read' : 'mark this notification as read'"
          @click="markRead"
        >
          Mark as read
        </button>
      </div>
      <p v-if="actionNote" class="dc-ok">{{ actionNote }}</p>
      <p v-if="errorMessage" class="dc-error">{{ errorMessage }}</p>
    </section>

    <!-- D — TEST GUIDANCE -->
    <section class="dc-panel">
      <div class="dc-panel__title">
        <h2>How to generate notifications (real EMS actions)</h2>
      </div>

      <p class="dc-note">
        Notifications are produced by the backend from authoritative EMS actions — the console does not create
        them. Use the other tabs with the relevant session, then inspect the inbox here.
      </p>

      <ul class="dc-small">
        <li><strong>Workflow (Workflow tab):</strong> create request → <code>approval.create</code> (current-level
          eligible approvers, ACTION REQUIRED); advance → <code>approval.advance</code> (new current level); approve →
          <code>approval.approve</code> (requester, INFORMATIONAL); reject → <code>approval.reject</code> (requester);
          return → <code>approval.return</code> (requester, ACTION REQUIRED); cancel → no notification (audit only).</li>
        <li><strong>Assignments (Assignments tab):</strong> create → <code>assignment.create</code> (assignee, ACTION
          REQUIRED); update → <code>assignment.update</code> (assignee, INFORMATIONAL).</li>
        <li><strong>Stakeholders (Stakeholders tab):</strong> change → <code>stakeholder.changed</code> (affected
          stakeholder, INFORMATIONAL).</li>
        <li><strong>Licensing (registry / client):</strong> licence issued/configured/renewed/replaced → active owner
          (INFORMATIONAL); installation released → owner (INFORMATIONAL); licence suspended/revoked → owner +
          <code>manage_licence_registry</code> holders (ACTION REQUIRED); client renewal requested →
          <code>manage_licence_registry</code> holders (ACTION REQUIRED); installation activated/reactivated/deactivated
          → <code>manage_licence_registry</code> holders (INFORMATIONAL).</li>
      </ul>

      <p class="dc-note">
        E4 reminder/overdue are <strong>derived read-time conditions</strong>, NOT durable notifications — they never
        appear here as notification rows. Notification preferences/opt-out, email/SMS/push and deletion/purge are out
        of scope (G-Q2/Q3/Q4).
      </p>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

import { useDevRequest } from '@/dev/composables/useDevRequest.js'

const { busy, errorMessage, run } = useDevRequest()

const filters = reactive({ type: '', unread: '', limit: '50', offset: '0' })
const items = ref([])
const total = ref(null)

const selectedNumber = ref('')
const selected = ref(null)
const actionNote = ref(null)

function prettyPayload(payload) {
  if (payload === null || payload === undefined || payload === '') return '(none)'
  try {
    return JSON.stringify(payload, null, 2)
  } catch (error) {
    return String(payload)
  }
}

async function loadInbox() {
  const params = {}
  if (filters.type) params.type = filters.type
  if (filters.unread === 'true') params.unread = 'true'
  if (filters.limit) params.limit = filters.limit
  if (filters.offset) params.offset = filters.offset
  const result = await run({ method: 'GET', url: '/main/ems/notifications', params })
  if (result.ok) {
    items.value = result.body?.data || []
    total.value = typeof result.body?.total === 'number' ? result.body.total : null
  }
}

async function openNotification(number) {
  actionNote.value = null
  selectedNumber.value = number
  const result = await run({ method: 'GET', url: `/main/ems/notifications/${number}` })
  if (result.ok) selected.value = result.body?.data || null
}

async function markRead() {
  if (!selected.value) return
  actionNote.value = null
  const result = await run({ method: 'POST', url: `/main/ems/notifications/${selected.value.number}/read` })
  if (result.ok) {
    selected.value = result.body?.data || selected.value
    actionNote.value = 'Marked read (backend response in inspector).'
    await loadInbox()
  }
}
</script>

<style scoped>
ul {
  padding-left: 18px;
}
ul li {
  margin: 3px 0;
}
</style>

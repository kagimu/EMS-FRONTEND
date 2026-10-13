<template>
  <section class="dc-panel">
    <div class="dc-panel__title">
      <h2>Foundation C4 — Ownership</h2>
      <button class="dc-btn dc-btn--primary" type="button" :disabled="busy" @click="load">Load owners</button>
    </div>

    <p class="dc-note">
      Ownership is represented by <strong>stakeholder_type = "owner"</strong> — there is no separate ownership
      table or endpoint. Rules enforced by the backend: multiple active owners are allowed; a person may hold
      only one active owner row; the final active owner cannot be removed; owners are not administrators.
      Transfer = create the new owner, then end the old owner.
    </p>

    <form class="dc-form" @submit.prevent="createOwner">
      <label class="dc-field">
        <span>user_number</span>
        <input v-model.trim="form.user_number" class="dc-input" placeholder="existing user number" required />
      </label>
      <label class="dc-field">
        <span>title</span>
        <input v-model.trim="form.title" class="dc-input" />
      </label>
      <label class="dc-field">
        <span>share_percentage</span>
        <input v-model.trim="form.share_percentage" class="dc-input" placeholder="0–100" />
      </label>
      <label class="dc-field">
        <span>shares</span>
        <input v-model.trim="form.shares" class="dc-input" />
      </label>
      <button class="dc-btn dc-btn--primary" type="submit" :disabled="busy">Create owner</button>
    </form>

    <p v-if="errorMessage" class="dc-error">{{ errorMessage }}</p>

    <p class="dc-small">
      Active owners: <strong>{{ activeOwners.length }}</strong> · Total owner rows: <strong>{{ items.length }}</strong>
    </p>

    <p v-if="items.length === 0" class="dc-muted dc-small">No owner records loaded.</p>

    <table v-else class="dc-table">
      <thead>
        <tr>
          <th>number</th><th>user_number</th><th>title</th><th>share %</th><th>status</th>
          <th>valid from</th><th>valid to</th><th>login?</th><th>actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.number">
          <td class="dc-small">{{ item.number }}</td>
          <td class="dc-small">{{ item.user_number }}</td>
          <td>{{ item.title || '—' }}</td>
          <td>{{ item.share_percentage ?? '—' }}</td>
          <td><span class="dc-status" :class="statusClass(item.status)">{{ item.status }}</span></td>
          <td class="dc-small">{{ short(item.valid_from) }}</td>
          <td class="dc-small">{{ short(item.valid_to) }}</td>
          <td class="dc-small">{{ item.can_authenticate ? 'yes' : 'no' }}</td>
          <td class="dc-actions">
            <button
              class="dc-btn dc-btn--danger"
              type="button"
              :disabled="item.status !== 'ACTIVE'"
              @click="endOwner(item)"
            >
              End ownership
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

import { useDevRequest } from '@/dev/composables/useDevRequest.js'

const { busy, errorMessage, run } = useDevRequest()

const items = ref([])
const form = reactive({ user_number: '', title: '', share_percentage: '', shares: '' })

const activeOwners = computed(() => items.value.filter((owner) => owner.status === 'ACTIVE'))

function statusClass(status) {
  return `dc-status--${String(status || '').toLowerCase()}`
}

function short(value) {
  return value ? String(value).slice(0, 10) : '—'
}

async function load() {
  const result = await run({
    method: 'GET',
    url: '/main/ems/stakeholders',
    params: { stakeholder_type: 'owner' },
  })
  if (result.ok) items.value = result.body?.data || []
}

async function createOwner() {
  const payload = { user_number: form.user_number, stakeholder_type: 'owner' }
  if (form.title) payload.title = form.title
  if (form.share_percentage) payload.share_percentage = Number(form.share_percentage)
  if (form.shares) payload.shares = Number(form.shares)

  const result = await run({ method: 'POST', url: '/main/ems/stakeholders', data: payload })
  if (result.ok) {
    form.user_number = ''
    form.title = ''
    form.share_percentage = ''
    form.shares = ''
    await load()
  }
}

async function endOwner(owner) {
  const result = await run({
    method: 'PATCH',
    url: `/main/ems/stakeholders/${owner.number}/status`,
    data: { status: 'ENDED' },
  })
  if (result.ok) await load()
}
</script>

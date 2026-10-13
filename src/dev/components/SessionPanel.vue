<template>
  <section class="dev-panel">
    <header class="dev-panel__title">
      <h2>Session &amp; Identity</h2>
      <button class="dev-btn dev-btn--ghost" type="button" @click="addSession">+ Add session</button>
    </header>

    <div class="dev-sessions">
      <div
        v-for="session in sessionStore.sessions"
        :key="session.id"
        class="dev-session"
        :class="{ 'dev-session--active': session.id === sessionStore.activeId }"
      >
        <div class="dev-session__top">
          <button class="dev-session__label" type="button" @click="sessionStore.setActive(session.id)">
            <span class="dev-session__dot" :class="`dev-session__dot--${session.status}`"></span>
            {{ session.label }}
          </button>
          <span class="dev-session__badge">{{ session.status }}</span>
        </div>
        <div class="dev-session__meta">
          <span v-if="session.identity">{{ session.identity.firstName }} {{ session.identity.secondName }}</span>
          <span v-else class="dev-muted">not authenticated</span>
          <span class="dev-session__actions">
            <button class="dev-btn dev-btn--ghost" type="button" @click="sessionStore.setActive(session.id)">
              Switch
            </button>
            <button
              class="dev-btn dev-btn--ghost"
              type="button"
              :disabled="session.status !== 'authenticated'"
              @click="sessionStore.logout(session.id)"
            >
              Logout
            </button>
            <button
              class="dev-btn dev-btn--danger"
              type="button"
              :disabled="sessionStore.sessions.length <= 1"
              @click="sessionStore.removeSession(session.id)"
            >
              Remove
            </button>
          </span>
        </div>
      </div>
    </div>

    <div class="dev-active">
      <p class="dev-active__heading">
        Active session:
        <strong>{{ sessionStore.activeSession ? sessionStore.activeSession.label : 'none' }}</strong>
      </p>

      <form v-if="activeSession && activeSession.status !== 'authenticated'" class="dev-form" @submit.prevent="submitLogin">
        <label class="dev-field">
          <span>Email</span>
          <input v-model.trim="email" type="email" autocomplete="off" required />
        </label>
        <label class="dev-field">
          <span>Password</span>
          <input v-model="password" type="password" autocomplete="off" required />
        </label>
        <button class="dev-btn dev-btn--primary" type="submit" :disabled="sessionStore.busy">
          {{ sessionStore.busy ? 'Signing in…' : 'Sign in' }}
        </button>
        <p v-if="activeSession.lastError" class="dev-error">{{ activeSession.lastError }}</p>
        <p class="dev-muted dev-small">Passwords are used for the login request only and are never stored.</p>
      </form>

      <div v-else-if="activeSession" class="dev-identity">
        <dl class="dev-kv">
          <dt>User number</dt>
          <dd>{{ activeSession.identity?.number || '—' }}</dd>
          <dt>Name</dt>
          <dd>{{ activeSession.identity?.firstName }} {{ activeSession.identity?.secondName }}</dd>
          <dt>User type</dt>
          <dd>{{ activeSession.identity?.type || '—' }}</dd>
          <dt>Roles</dt>
          <dd>{{ roleCount(activeSession) }}</dd>
          <dt>Permissions</dt>
          <dd>{{ permissionCount(activeSession) }}</dd>
          <dt>Organisation / entity</dt>
          <dd>
            <template v-if="activeSession.entity && activeSession.entity.number">
              {{ activeSession.entity.name || '(unnamed)' }} ({{ activeSession.entity.number }})
            </template>
            <span v-else class="dev-muted">no active entity set</span>
          </dd>
        </dl>
        <p class="dev-muted dev-small">Token is held in memory for this session only. Reload clears all sessions.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useDevSessionStore } from '@/dev/store/devSession.js'

const sessionStore = useDevSessionStore()

const email = ref('')
const password = ref('')

const activeSession = computed(() => sessionStore.activeSession)

function roleCount(session) {
  const roles = session.identity?.roles
  return Array.isArray(roles) ? roles.length : 0
}

function permissionCount(session) {
  const permissions = session.identity?.permissions
  return Array.isArray(permissions) ? permissions.length : 0
}

async function submitLogin() {
  if (!activeSession.value) {
    return
  }
  const id = activeSession.value.id
  const submittedEmail = email.value
  const submittedPassword = password.value
  password.value = ''
  await sessionStore.login(id, submittedEmail, submittedPassword)
}

function addSession() {
  sessionStore.addSession()
}
</script>

<style scoped>
.dev-panel {
  border: 1px solid #d7dce3;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
  margin-bottom: 16px;
}
.dev-panel__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dev-panel__title h2 {
  font-size: 15px;
  margin: 0;
}
.dev-sessions {
  display: grid;
  gap: 8px;
  margin: 12px 0;
}
.dev-session {
  border: 1px solid #e3e7ee;
  border-radius: 6px;
  padding: 8px 10px;
}
.dev-session--active {
  border-color: #2f6fed;
  box-shadow: 0 0 0 1px #2f6fed inset;
}
.dev-session__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dev-session__label {
  background: none;
  border: 0;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}
.dev-session__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #b6bcc7;
}
.dev-session__dot--authenticated {
  background: #2e9e5b;
}
.dev-session__dot--error {
  background: #d64545;
}
.dev-session__badge {
  font-size: 11px;
  text-transform: uppercase;
  color: #5a6472;
}
.dev-session__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  margin-top: 4px;
}
.dev-session__actions {
  display: flex;
  gap: 4px;
}
.dev-active {
  border-top: 1px solid #eef1f5;
  padding-top: 12px;
}
.dev-active__heading {
  font-size: 13px;
  margin: 0 0 8px;
}
.dev-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-end;
}
.dev-field {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  gap: 2px;
}
.dev-field input {
  border: 1px solid #cfd6df;
  border-radius: 4px;
  padding: 6px 8px;
  font-size: 13px;
}
.dev-btn {
  border: 1px solid #cfd6df;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
  background: #f6f8fb;
}
.dev-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.dev-btn--primary {
  background: #2f6fed;
  border-color: #2f6fed;
  color: #fff;
}
.dev-btn--danger {
  color: #b3261e;
}
.dev-btn--ghost {
  background: transparent;
}
.dev-kv {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 4px 12px;
  font-size: 13px;
  margin: 0;
}
.dev-kv dt {
  color: #5a6472;
}
.dev-kv dd {
  margin: 0;
}
.dev-error {
  color: #b3261e;
  font-size: 12px;
  width: 100%;
  margin: 4px 0 0;
}
.dev-muted {
  color: #8a93a0;
}
.dev-small {
  font-size: 11px;
}
</style>

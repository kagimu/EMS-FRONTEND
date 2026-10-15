<template>
  <router-link :to="{ name: 'login' }" class="ems-pill" aria-label="Sign in to an existing account">
    <svg
      class="ems-pill__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
    <span>Sign in</span>
  </router-link>
</template>

<script setup>
// Escape hatch for someone who already has an account but landed at the start
// of the first-time setup procedure: sends them to the EMS sign-in page so they
// are not trapped in the register-and-set-up flow. Purely presentational; the
// frosted-glass styling lives in ems.css (.ems-pill).
</script>

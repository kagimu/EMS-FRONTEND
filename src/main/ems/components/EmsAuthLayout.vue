<template>
  <div class="ems-auth" :class="{ 'ems-auth--no-photo': !photoOk }">
    <div v-if="photoOk" class="ems-auth__bg" :style="{ backgroundImage: `url(${backgroundUrl})` }"></div>
    <div class="ems-auth__overlay"></div>

    <div class="ems-auth__content">
      <div v-if="showTopbar" class="ems-auth__topbar">
        <component :is="EmsTestReset" v-if="showTestReset" />
        <slot name="topRight" />
      </div>

      <header class="ems-auth__brand">
        <img class="ems-auth__logo" :src="logoUrl" alt="EMS" />
        <div class="ems-auth__product">
          <span class="ems-auth__product-name">EMS</span>
          <span class="ems-auth__product-sub">Enterprise Management Suite</span>
        </div>
      </header>

      <main class="ems-glass" :class="{ 'ems-glass--wide': wide }">
        <p v-if="eyebrow" class="ems-glass__eyebrow">{{ eyebrow }}</p>
        <h1 v-if="heading" class="ems-glass__heading">{{ heading }}</h1>
        <p v-if="subheading" class="ems-glass__sub">{{ subheading }}</p>
        <slot />
      </main>

      <footer class="ems-auth__footer">
        &copy; {{ year }} EMS &middot; Enterprise Management Suite
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, onMounted, ref, useSlots } from 'vue'

import logoUrl from '@/main/ems/assets/ems-logo.svg'
import '@/main/ems/ems.css'

// Self-hosted business/enterprise photograph (bundled under public/img, so the
// page never depends on an external URL that could disappear). Source:
// Unsplash — https://unsplash.com/photos/photo-1497366216548-37526070297c
// (Unsplash License: free for commercial and non-commercial use).
const backgroundUrl = '/img/ems-business-bg.jpg'

const props = defineProps({
  heading: { type: String, default: '' },
  subheading: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  wide: { type: Boolean, default: false },
  // Testing phase only: show the top-right "Reset test" escape hatch next to
  // the Sign in pill. Ignored unless the build flag is also set.
  testReset: { type: Boolean, default: false },
})

const slots = useSlots()

// Testing-only reset control. Dynamically imported ONLY when the flag is set at
// build time, so it never enters a production module graph (no source default
// enables it).
const TEST_RESET_ENABLED = import.meta.env.VITE_ENABLE_TEST_RESET === 'true'
const EmsTestReset = TEST_RESET_ENABLED
  ? defineAsyncComponent(() => import('@/main/ems/components/EmsTestReset.vue'))
  : null

const showTestReset = computed(() => props.testReset && !!EmsTestReset)
// The top-right bar appears when there is a page action (e.g. Sign in) or the
// testing reset control.
const showTopbar = computed(() => !!slots.topRight || showTestReset.value)

const year = new Date().getFullYear()
const photoOk = ref(true)

// If the background photo is unavailable, fall back to a brand gradient rather
// than showing a broken/blank background.
onMounted(() => {
  const probe = new Image()
  probe.onerror = () => {
    photoOk.value = false
  }
  probe.src = backgroundUrl
})
</script>

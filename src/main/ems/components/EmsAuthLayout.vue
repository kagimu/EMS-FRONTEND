<template>
  <div class="ems-auth" :class="{ 'ems-auth--no-photo': !photoOk }">
    <div v-if="photoOk" class="ems-auth__bg" :style="{ backgroundImage: `url(${backgroundUrl})` }"></div>
    <div class="ems-auth__overlay"></div>

    <div class="ems-auth__content">
      <header class="ems-auth__brand">
        <img class="ems-auth__logo" :src="logoUrl" alt="Wholesome Education" />
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
import { onMounted, ref } from 'vue'

import logoUrl from '@/assets/images/victorious-logo.png'
import '@/main/ems/ems.css'

// Self-hosted business/enterprise photograph (bundled under public/img, so the
// page never depends on an external URL that could disappear). Source:
// Unsplash — https://unsplash.com/photos/photo-1497366216548-37526070297c
// (Unsplash License: free for commercial and non-commercial use).
const backgroundUrl = '/img/ems-business-bg.jpg'

defineProps({
  heading: { type: String, default: '' },
  subheading: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  wide: { type: Boolean, default: false },
})

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

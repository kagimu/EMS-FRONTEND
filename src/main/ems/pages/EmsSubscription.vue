<template>
  <div>
    <EmsContentPanel
      title="Subscription & activation"
      icon="bi bi-patch-check"
      description="Buy a subscription period; a successful payment issues your activation token."
      :count="null"
    >
      <EmsSubscriptionPanel />
    </EmsContentPanel>
  </div>
</template>

<script setup>
import EmsContentPanel from '@/main/ems/components/EmsContentPanel.vue'
import EmsSubscriptionPanel from '@/main/ems/components/EmsSubscriptionPanel.vue'
</script>

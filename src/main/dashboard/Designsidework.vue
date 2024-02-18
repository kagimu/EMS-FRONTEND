<template>
  <div>
    <div class="mb-2">
      <label class="textColor"><small>Actual Price</small></label>
      <input v-model="cost" @input="computeDiscountPercentage" style="outline: none 0 !important; box-shadow: none;" type="number" required class="form-control form-select-sm">
    </div>

    <div class="mb-2">
      <label class="textColor"><small>Discount Price</small></label>
      <input v-model="discountAmount" @input="computeDiscountPercentage" style="outline: none 0 !important; box-shadow: none;" type="number" required class="form-control form-select-sm">
    </div>

    <div class="mb-2">
      <label class="textColor"><small>Discount Percentage</small></label>
      <input v-model="discountPercentage" style="outline: none 0 !important; box-shadow: none;" type="number" required class="form-control form-select-sm" readonly>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import useNotificationStore from "@/composables/useNotification.js";

const cost = ref(null);
const discountAmount = ref(null);
const  notificationStore  = useNotificationStore()

const discountPercentage = computed(() => {
  if (cost.value !== null && discountAmount.value !== null) {
    const actualPrice = parseFloat(cost.value);
    const discountPrice = parseFloat(discountAmount.value);
    if (actualPrice > 0 && discountPrice > 0 && discountPrice <= actualPrice) {
      return ((actualPrice - discountPrice) / actualPrice) * 100;
    }
  }
  return null;
});

const computeDiscountPercentage = () => {
  // Validate that discount price is not greater than actual price
  if (discountAmount.value !== null && cost.value !== null) {
    const actualPrice = parseFloat(cost.value);
    const discountPrice = parseFloat(discountAmount.value);
    if (discountPrice > actualPrice) {
      // Reset discount price to actual price
      discountAmount.value = actualPrice;
      // Show toast notification
   
      notificationStore.errorToast("Error", 'Discount price cannot exceed actual price')
    }
  }
};

// Watch for changes in cost and discountAmount
watch([cost, discountAmount], () => {
  computeDiscountPercentage();
});

</script>

<style>
/* Add your styles here */
</style>

<template>
  <div>
    <form @submit.prevent="invoicePayment">

      <div class="options-menu">
        <button 
          v-for="option in paymentOptions" 
          :key="option.amount" 
          @click="toggleAmount(option.amount)"
          :class="{'selected': selectedAmounts.includes(option.amount)}"
          type="button" 
          class="payment-option"
        >
          <span>{{ option.label }}</span>
        </button>
      </div>

      <div class="mb-2">
        <label class="text-sm">Selected Amounts: </label>
        <div v-if="selectedAmounts.length">
          <ul>
            <li v-for="(amount, index) in selectedAmounts" :key="index">{{ amount }}</li>
          </ul>
        </div>
        <div v-else>
          <p>No amount selected yet</p>
        </div>
      </div>

      <div class="mb-2">
        <label class="text-sm">Date</label>
        <input
          v-model="formData.date"
          type="date"
          required
          class="form-control form-control-sm"
        />
      </div>

  
      <div class="flex justify-content-end mt-3" style="width: 100%;">
        <button type="submit" class="btn btn-primary border-0 btn-sm">
          <small>Pay</small>
          <span
            v-if="loader"
            style="width: 1.2rem; height: 1.2rem;"
            class="spinner-border text-light"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const formData = reactive({
  amount: null,
  date: null,
});

const selectedAmounts = ref([]); // Array to store selected amounts
const loader = ref(false);

const paymentOptions = [
  { label: 'Amount 1: $10', amount: 10 },
  { label: 'Amount 2: $20', amount: 20 },
  { label: 'Amount 3: $30', amount: 30 },
  { label: 'Amount 4: $50', amount: 50 }
];

// Toggle amount selection
const toggleAmount = (amount) => {
  const index = selectedAmounts.value.indexOf(amount);
  if (index === -1) {
    selectedAmounts.value.push(amount);
  } else {
    selectedAmounts.value.splice(index, 1);
  }
};

const invoicePayment = () => {
  if (selectedAmounts.value.length === 0 || !formData.date) {
    alert('Please select at least one amount and a date');
    return;
  }
  loader.value = true;

  // Simulate payment processing
  setTimeout(() => {
    loader.value = false;
    alert('Payment Successful for amounts: ' + selectedAmounts.value.join(', '));
  }, 2000);
};
</script>

<style scoped>
.options-menu {
  display: flex;
  gap: 10px;
}

.payment-option {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.payment-option.selected {
  background-color: #007bff;
  color: white;
}

.payment-option:hover {
  background-color: #ddd;
}
</style>

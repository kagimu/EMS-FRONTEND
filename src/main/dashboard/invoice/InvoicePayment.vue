<script setup>
import { reactive, ref, watch, defineProps,onMounted } from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useInvoiceStore } from "@/main/dashboard/invoice/store/invoice.js";
import useCommonsStore from "@/composables/useCommons.js";

const commons = useCommonsStore();
const selectedTab = ref("cash")
const creditsData = ref([])

const switchTabs = (tab) => {
   selectedTab.value = tab
}

onMounted(
    async () => {
     doFetchCredits()
    }
)


const props = defineProps({
  invoiceNumber: String,
  userNum:String
});

const invoiceStore = useInvoiceStore();
const notificationStore = useNotificationStore();
const errorMessage = ref(null);
const loader = ref(false);
const credits = ref(null)

const formData = reactive({
  invoice_number: props.invoiceNumber,
  amount: null,
  date: null,
  selectedAmounts:[]
});

const invoicePayment = () => {
  let myData = {
    invoice_number: formData.invoice_number,
    amount: parseInt(formData.amount),
    date: formData.date,
    credits:formData.selectedAmounts
  };

  if (!confirm("Are you sure?")) {
    return;
  }
  
  loader.value = true;
  // alert(JSON.stringify(myData))
  invoiceStore.createInvoicePayment(myData);
};


watch(
    () => invoiceStore.creditResponse,
    async (data) => {
      if(data){
        creditsData.value = data.data
      }
    },
    {deep:true}
)


watch(
  () => invoiceStore.newInvoicePaymentResponse,
  (data) => {
    if (data) {
      loader.value = false;
    }
  },
  { deep: true }
)



// Toggle amount selection
const toggleAmount = (amount) => {
  const index = formData.selectedAmounts.indexOf(amount);
  if (index === -1) {
    formData.selectedAmounts.push(amount);
  } else {
    formData.selectedAmounts.splice(index, 1);
  }
};

const doFetchCredits = () =>{
  let data = {
    user_number:props.userNum,
  }
  invoiceStore.fetchCredits(data)
}


</script>

<template>
<!-- {{ creditsData }} -->
<div>
        <div class="flex border-b mt-1">
          <div class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'cash' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('cash')">
            <div class="py-1 px-3">
              <i class="bi bi-cash mr-1"></i>
             Cash
            </div>
          </div>
          <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'credits' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('credits')">
            <div class="py-1 px-3">
              <i class="bi bi-credit-card mr-1"></i>
             Credits
            </div>
          </div>
        </div>

        <div v-if="selectedTab === 'cash'">
          <form @submit.prevent="invoicePayment">
  
  <!-- Amount -->
  <div class="mb-2">
    <label class="text-sm text-sm">Amount</label>
    <input
      @keypress="commons.numbersOnlyValidator($event)"
      maxlength="10"
      v-model="formData.amount"
      style="outline: none 0 !important; box-shadow: none;"
      type="text"
      required
      class="form-control form-control-sm"
    />
  </div>


  <div class="mb-2">
    <label class="text-sm text-sm">Date</label>
    <input
      v-model="formData.date"
      style="outline: none 0 !important; box-shadow: none;"
      type="date"
      required
      class="form-control form-control-sm"
    />
  </div>

  <!-- Submit Button -->
  <div class="flex justify-content-end mt-3" style="width: 100%;">
    <button
      type="submit"
      class="btn btn-primary border-0 btn-sm"
    >
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
        <div v-if="selectedTab === 'credits'">
          <form @submit.prevent="invoicePayment">

<div class="options-menu mt-2">
  <button 
    v-for="option in creditsData" 
    :key="option.amount" 
    @click="toggleAmount(option.amount_in_credit)"
    :class="{'selected': formData.selectedAmounts.includes(option.amount_in_credit)}"
    type="button" 
    class="payment-option"
  >
    <span>Credit : {{ option.amount_in_credit?.toLocaleString() }}<br>
    </span>
  </button>
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
     

      </div>

  <div>
 
  </div>
</template>



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
<template>
    <div>
    <form @submit.prevent="invoicePayment">
      <div class="mb-2">
        <label class="textColor text-sm">Payer</label>
        <input v-model="formData.payer"  style="outline: none 0 !important; box-shadow: none;" type="text" required class="form-control form-control-sm">
      </div>
      <div class="mb-2">
        <label class="textColor text-sm">Payment Reference</label>
        <input v-model="formData.payment_reference" style="outline: none 0 !important; box-shadow: none;" type="text" required class="form-control form-control-sm">
      </div>
      <div class="mb-2">
        <label class="textColor text-sm">Amount</label>
        <input v-model="formData.amount"  style="outline: none 0 !important; box-shadow: none;" type="number" required class="form-control form-control-sm">
      </div>
      <div class="mb-2">
        <label class="textColor text-sm">Balance</label>
        <input v-model="formData.balance"  style="outline: none 0 !important; box-shadow: none;" type="number" required class="form-control form-control-sm">
      </div>
      <div class="mb-2">
        <label class="textColor text-sm">Date</label>
        <input v-model="formData.date"  style="outline: none 0 !important; box-shadow: none;" type="date" required class="form-control form-control-sm">
      </div>

      <div class="flex justify-content-end mt-3" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0 btn-sm">
           <small>  <i class="bi bi-save2"></i>  Save </small>
              <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
                  <span class="visually-hidden">Loading...</span>
                </span>
        </button>
      </div>

    </form>
</div>
</template>

<script setup>
  import {onMounted,reactive, ref, watch,computed} from "vue";
  import useNotificationStore from "@/composables/useNotification.js"
  import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"
  import { useRouter } from 'vue-router'

  const invoiceStore = useInvoiceStore()
const notificationStore = useNotificationStore()
  const loader = ref(false)

  const formData = reactive({ 
    payer: null,
    payment_reference:null,
    amount: null, 
    balance:null,
    date:null,
    invoice_number:'2328282828919192'
  })

  const invoicePayment = () => {
  invoiceStore.createInvoicePayment(formData)
  }

  watch (
    () => invoiceStore.newInvoicePaymentResponse,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch (
    () => invoiceStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

</script>
<style>
</style>
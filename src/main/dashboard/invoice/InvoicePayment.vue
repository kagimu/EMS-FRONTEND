<template>
    <div>
      <!-- {{ refN }} -->
    <form @submit.prevent="invoicePayment">
      
      <div class="mb-2">
        <label class="textColor text-sm">Amount</label>
        <input   @keypress="commons.numbersOnlyValidator($event)"
            maxlength="10" v-model="formData.amount"  style="outline: none 0 !important; box-shadow: none;"
             type="text" required class="form-control form-control-sm">
      </div>

      <div class="mb-2">
        <label class="textColor text-sm">Date</label>
        <input v-model="formData.date"  style="outline: none 0 !important; box-shadow: none;" type="date" required class="form-control form-control-sm">
        <!-- <VueDatePicker
            text-input
            auto-apply
            style="font-size: 7px;"
            v-model="formData.date"
            :preview-format="format"
            :teleport="true"
        ></VueDatePicker> -->
      </div>

      <div class="flex justify-content-end mt-3" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0 btn-sm">
           <small> Pay </small>
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
  import VueDatePicker from "@vuepic/vue-datepicker";
  import useCommonsStore from "@/composables/useCommons.js";

  const commons = useCommonsStore()
  const props = defineProps({
  refN:String
  })

const invoiceStore = useInvoiceStore()
const notificationStore = useNotificationStore()
const errorMessage = ref(null)
const loader = ref(false)

  const formData = reactive({ 
    invoice_number:props.refN,
    amount:null,
    date:null
  })

  
const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `Selected date is ${day}/${month}/${year}`;
}


  const invoicePayment = () => {
    let myData = reactive({
    invoice_number:props.refN,
    amount:parseInt(formData.amount),
    date:formData.date
    })
    //  alert(JSON.stringify(myData))
  loader.value=true
  invoiceStore.createInvoicePayment(myData)

  }

  watch (
    () => invoiceStore.newInvoicePaymentResponse,
    async (data) => {
      if(data){
        loader.value = false
      }
    },
    {deep:true}
)

</script>
<style>
</style>
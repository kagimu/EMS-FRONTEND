<template>
    <div>
      <div class="row">
        <div class="col-12">
          <div class="card mt-3">
            <div class="card-header">
       <div class="row">
        <div class="col-lg-4">
            <h6 class="textColor" style="margin-top:20px; text-align: left;font-size: 15px;">
              <i class="bi bi-x-lg" @click="goBac()"></i>&nbsp;&nbsp;&nbsp;Offer Admission | School Requirements Invoice <b></b>    
            </h6>
        </div>
        <div class="col-lg-8">
          <RouterLink :to="{name : 'invoices'}" type="link" class="link-primary textColor" style="margin-top:20px;float: right;font-size: 15px;"><i class="bi bi-arrow-right" ></i>&nbsp;&nbsp;&nbsp;View Invoices</RouterLink>
        </div>
       </div>
           </div>
            <div class="card-body" style="padding: 0;">
        <div class="container mt-4">
          <form @submit.prevent="submitInvoice">
            <div class="row">      
              <div class="col-lg-12">              
                <div>
                  <div>
        <div class="mb-3">
          <div class="row align-services-center">
            <ul>
            <li class="list-group-item">
                <input class="form-check-input me-1" type="checkbox" :id="'selectAllCheckbox' + columnIndex" v-model="selectAllAll" @change="selectAllItems">
                <label class="form-check-label cursor-pointer textColor" :for="'selectAllCheckbox' + columnIndex">Select All</label>
              </li>
          </ul>

          <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="col-md-4">
            <ul class="list-group text-sm mb-4" style="border-radius: 0;">
              <li class="list-group-item" v-for="(item, index) in column" :key="index">
                <input class="form-check-input me-1" type="checkbox" :id="'itemCheckbox' + index" v-model="selectedItems" :value="(columnIndex * 7) + index">
                <label class="form-check-label cursor-pointer textColor" :for="'itemCheckbox' + index">{{ item.description }} - [ ugshs {{ item.cost }} ]</label>
              </li>
            </ul>
          </div>
          </div>
        </div>
  </div>  
      </div>

      <div class="text-end">
          <!-- <strong>Total: {{ total }}</strong> -->
        <div class="row">
          <div class="col-lg-7">
  
          </div>
          <div class="col-lg-2">
         <b>TOTAL</b> 
        </div>
        <div class="col-lg-3">
          <input style="color:rgb(15, 15, 15); border: none; font-size: 15px !important;font-weight: 600;" disabled  class="form-control" v-model="total">
        </div>
        </div>
  
      </div>
  
              </div>
  
            </div>
  
       
            <div class="row">
             
              <div class="col-lg-4">
              <button @click="goBack()" type="button" class="btn btn-sm btn-outline-danger mb-2 mr-4" style="float: left !important;margin-right: 0px;">
                <i class="bi bi-box-arrow-in-left"></i> back</button>
            </div>
            <div class="col-lg-4"></div>
            <div class="col-lg-4 ">
              <button type="submit" class="btn btn-sm btn-outline-primary mb-2 mt-1" style="float: right !important;margin-right: 0px;">
                <small><i class="bi bi-save"></i> Publish</small>
            <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
            </div>
           
            </div>  
            </form>
  
  
        </div>
    </div>
    </div>
    </div>
    </div>
  
   
    
    </div>
    </template>
  
  <script setup>
  import {onMounted,reactive, ref, watch,computed} from "vue";
  import useNotificationStore from "@/composables/useNotification.js"
  import { useRouter } from 'vue-router'
  import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js"
  import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"

const items = ref( [])
let errorMessage = ref(null)
const serviceId = ref(null)
const serviceStore= useServiceStore()
const  notificationStore  = useNotificationStore()
const  invoiceStore  = useInvoiceStore()

const router = useRouter()
const emit = defineEmits()


onMounted(
      async () => {
        await serviceStore.fetchServicesList()
      } )
      
      watch(
      () => serviceStore.servicesListResponse,
      async (data) => {
        if(data){
          items.value = data
        }
      },
      {deep:true}
  )
  const goBack = () => {
    //  window.history.back()
     emit("next", 1)
    }

const studentNumber = '1203039490402st';
const invoice = ref({
  items
})

const selectAllAll = ref(false)// Select all items across all columns
const selectedItems = ref([])

const total = computed(() => selectedItems.value.reduce((acc, index) => acc + invoice.value.items[index].cost, 0))

const columns = computed(() => {
  const items = invoice.value.items
  const numColumns = Math.ceil(items.length / 7)
  const columns = Array.from({ length: numColumns }, (_, columnIndex) => {
    const startIndex = columnIndex * 7
    return items.slice(startIndex, startIndex + 7)
  })
  return columns
})

const selectAllItems = () => {
  if (selectAllAll.value) {
    const allItems = invoice.value.items.map((_, index) => index)
    selectedItems.value = [...new Set([...selectedItems.value, ...allItems])] // Add all items
  } else {
    selectedItems.value = [] // Clear selected items
  }
}

const submitInvoice = () => {
  const selectedItemsData = selectedItems.value.map(index => {
    const item = invoice.value.items[index]
    return { description: item.description, price: item.price }
  })
  const data = {
    student_number: studentNumber,
    items: selectedItemsData
  }
  // alert(JSON.stringify(data))
  // router.push({ name: 'invoice-details', params: { studentNumber }})

  //create Invoice ======================
  invoiceStore.createNewInvoice(data)
}
watch (
    () => invoiceStore.newInvoiceResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        router.push({ name: 'invoice-details', params: { studentNumber }})

      }
    },
    {deep:true}
)
  
  watch (
      () => invoiceStore.errorMessage,
      async (data) => {
        if(data){
          errorMessage.value = data.message
          // notificationStore.errorToast("Error",data.message)
          router.push({ name: 'invoice-details', params: { studentNumber }})

        }
      },
      {deep:true}
  )


  </script>
  
  <style>
  .mb-8 {
    margin-bottom: 2rem;
    text-align: left;
       color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    font-size: 17px;
  }
  .mb-2 {
    text-align: left;
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    border-radius: 3px !important;
  }
  input{
  background-color: #f8f9fa;
  border-radius: 2px;
  font-size: 10px !important;
  }
  select{
  background-color: #f8f9fa;
  border-radius: 2px;
  font-size: 10px !important;
  }
  .star{
  color:red;
  }
  .textColor{
  font-size: 11px !important;
  }
  </style>
<template>
    <div>
      <div class="row">
        <div class="col-12">
            <div class="card-body" style="padding: 0;">
              <div class="container mt-4">
                <form @submit.prevent="createInvoice">
                <div class="row">
              
                  <div class="col-lg-12">
                    <!-- New Design -->
                      <table class="table bordered">
                        <thead>
                          <tr class="" style="padding: 0px;margin: 0px;">
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Amount</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(Service, index) in Services" :key="index" >
                            <td>
                              <select class="form-select form-select-sm form-control select-no-border" v-model="Service.name" @change="updateService(index)">
                                <option :value="option.name" v-for="option in availableOptions(index)">{{ option.name }}</option>
                              </select>
                            </td>
                            <td><input type="text" v-model="Service.quantity" @input="updateAmount(index)" placeholder="1.0" class="inp"></td>
                            <td><input type="text" v-model="Service.cost" @input="updateAmount(index)" placeholder="Unit Price" class="inp"></td>
                            <td>{{ Service.amount }}</td>
                            <td><button type="button" @click="removeService(index)"><i class="bi bi-x-circle" style="color:red"></i></button></td>
                          </tr>
                        </tbody>
                      </table>
                      <button class="btn btn-primary btn-sm text-sm" @click.prevent="addService" :disabled="isAddButtonDisabled"><small><i class="bi bi-plus-lg" title="Add Item"></i></small></button>
                      <div class="row mt-10">
                        <div class="col-lg-8"></div>
                        <div class="col-lg-4">
                          <ul style="float: right;">
                            <!-- <li>Subtotal - {{ calculateSubtotal() }}</li> -->
                            <li>Total : <span style="color:rgba(173, 12, 12, 0.92)">{{ calculateTotal() }}</span> </li>
                          </ul>
                        </div>
                      </div>
                  
                  </div>
                </div> 
                <div class="row">
               
               <div class="col-lg-4">
              
             </div>
             <div class="col-lg-4"></div>
             <div class="col-lg-4 ">
               <button type="submit" class="btn btn-sm btn-primary mb-2 mt-1" style="float: right !important;margin-right: 0px;">
                 <small>Create Invoice</small>
             <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
               <span class="visually-hidden">Loading...</span>
             </div>
           </button>
             </div>
            
             </div>
               </form>
              </div>
            </div>
            <hr>
          </div>
        
      </div>
    </div>
  </template>
  
  <script setup>
  import {onMounted, reactive, ref, watch, watchEffect, computed} from "vue"
  import useNotificationStore from "@/composables/useNotification.js"
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js"
  import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"
  import {useRouter} from "vue-router"
  
  import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js"
  import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"
  import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
  
  const studentInfoList = ref( [])
  const routerData = useRouter()
  const serviceStore= useServiceStore()
  const  invoiceStore  = useInvoiceStore()
  const router = useRouter()
  const applicationStore= useApplicationStore()
  
  let errorMessage = ref(null)
  const emit = defineEmits()
  const  notificationStore  = useNotificationStore()
  const classList = ref([])
  const schoolStore = useSchoolStore()
  const campusStore = useCampusStore()
  const studentNumber = routerData.currentRoute.value.query.id;
  
  
  
  // Creating invoice Logic =========================================================
  const Services = ref([]);
  const ServiceOptions = ref([])
  
  
  onMounted(
      async () => {
        await applicationStore.fetchApplicationList()
      } )
  
      watch(
      () => applicationStore.applicationListResponse,
      async (data) => {
        if(data){
          studentInfoList.value = data.data
         
        }
      },
      {deep:true}
      )
  
  
  function updateService(index) {
    const Service = Services.value[index];
    const selectedOption = ServiceOptions.value.find(option => option.name === Service.name);
    if (selectedOption) {
      Service.cost = selectedOption.cost;
      updateAmount(index);
    }
  }
  
  function updateAmount(index) {
    const Service = Services.value[index];
    Service.amount = Service.quantity * Service.cost;
  }
  
  function addService() {
    Services.value.push({ name: '', quantity: 1, cost: 0, amount: 0 });
  }
  
  function removeService(index) {
    Services.value.splice(index, 1);
  }
  
  function calculateTotal() {
    return Services.value.reduce((total, Service) => total + Service.amount, 0);
  }
  
  function availableOptions(index) {
    const selectedNames = Services.value.map(Service => Service.name);
    return ServiceOptions.value.filter(option => !selectedNames.includes(option.name) || option.name === Services.value[index].name);
  }
  
  const isAddButtonDisabled = ref(false);
  watch(Services, (newServices) => {
    isAddButtonDisabled.value = newServices.length === ServiceOptions.value.length;
  }, { deep: true });
  
  // =
  onMounted(
    async () => {
      // await serviceStore.fetchServicesList()
    } )
  
  watch(
    () => serviceStore.servicesListResponse,
    async (data) => {
      if (data) {
        ServiceOptions.value = data.map(option => ({ name: option.Item.name, cost: option.Item.cost }));
      }
    },
    { deep: true }
  )
  
  // Connect invoice store ==========================================
  const createInvoice = () => {
    const selectedData = Services.value.map(service => ({
        name: service.name,
        quantity: service.quantity,
        unitPrice: service.unitPrice,
        amount: service.amount
      }))
  
    const data = {
      student_number: 'studentNumber',
      selectedData
    }
    // alert(JSON.stringify(data))
    //create Invoice ======================
    invoiceStore.createNewInvoice(data)
  }
  
  
  watch (
    () => invoiceStore.newInvoiceResponse,
    async (data) => {
      if (data) {
        notificationStore.successToast("Success", data.message)
      }
    },
    { deep: true }
  )
  
  watch (
    () => invoiceStore.errorMessage,
    async (data) => {
      if (data) {
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    { deep: true }
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
    /* font-size: 10px !important; */
  }
  select{
    background-color: transparent;
    border-radius: 2px;
    font-size: 10px !important;
  }
  .star{
    color:red;
  }
  .text-sm2{
    /* font-size: 1px !important; */
  }
    .select-no-border {
      border: none !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      -moz-appearance: none !important; 
      outline: none !important;
      box-shadow: none !important;
    }
    .inp{
      border: none !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      -moz-appearance: none !important; 
      outline: none !important;
      box-shadow: none !important;
      background-color: transparent !important;
    }
  
  </style>
  
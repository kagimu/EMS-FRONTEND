<script setup>
import {onMounted, ref, watch,reactive} from "vue";
import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"
import useNotificationStore from "@/composables/useNotification.js"
import NewInvoice from "@/main/dashboard/invoice/NewInvoice.vue"
import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import {useRouter} from "vue-router"
const { can } = useAbility()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
import InvoicePayment from "./InvoicePayment.vue";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
const routerData = useRouter()
const applicationStore= useApplicationStore()
const studentNumber = routerData.currentRoute.value.query.st_id;
const userNumber = ref(null)
const invoiceData = ref([])
const invoiceStore = useInvoiceStore()
const  notificationStore  = useNotificationStore()
const mymodal = ref(false)
const invoiceNumber = ref("")
const errorMessage = ref(null)
const loader  = ref(false)
const showPayment = ref(false)
const userList = ref([])

const school_number = ref("")
const campus_number = ref("")
const schoolList = ref([])
const campusList = ref([])

const showModal = () =>{
  mymodal.value = true
}

const form = reactive({
  statusData:""
})

onMounted(
    async () => {
      await schoolStore.fetchSchools()
    }
)

const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number)
  doFetchInvoices()
}

const doFetchInvoices = () =>{
  let data = {
    status:form.statusData,
    school_number:school_number.value,
    campus_number:campus_number.value,
    user_number:userNumber.value
  }
  invoiceStore.fetchInvoice(data)
}

const paymentModal = (number) =>{
  showPayment.value = true
  invoiceNumber.value = number
}





watch (
    () => applicationStore.studentDataResponse,
    async (data) => {
      if (data) {

        userNumber.value = data.user_number
        userList.value = data
        doFetchInvoices()
      }
    }
)





watch(
    () => invoiceStore.invoiceResponse,
    async (data) => {
      if(data){
        invoiceData.value = data
      }
    },
    {deep:true}
)


watch (
    () => invoiceStore.newInvoiceResponse,
    async (data) => {
      if (data) {
        // let school_number ="", campus_number="",status=""
        // fetchAllInvoices()
        // await invoiceStore.fetchInvoice(school_number, campus_number, userNumber.value, status)
        mymodal.value=false

      }
    },
    { deep: true }
)

watch (
    () => invoiceStore.newInvoicePaymentResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        showPayment.value = false
        // fetchAllInvoices()
      }
    }
)

watch (
    () => invoiceStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
        loader.value = false
      }
    },
    {deep:true}
)

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    }
)


watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if (data) {
        campusList.value = data.data
      }
    }
)



</script>
<template>
  <div>


    <AppModal title="Creating New Invoice" v-model="mymodal" xl6>
    <NewInvoice :userNumber="userNumber"></NewInvoice>
    </AppModal>


    <AppModal title="Pay Invoice" v-model="showPayment" xs>
    <InvoicePayment :invoiceNumber="invoiceNumber" ></InvoicePayment>
    </AppModal>

    <div class="rw mt-3"  >
      <div class="">
     <div class="flex flex-grow justify-end">
      <div v-if="studentNumber">
        <button  @click="showModal()" class="btn btn-primary btn-sm mb-2" style="float: right;" v-if="can('add_custom_invoice','general')">
        <small><i class="bi bi-plus"> Add New Invoice</i></small></button></div>
     </div>
       
          <div class="card-bdy" style="padding: 0;">
  <div class="mt-4">

    <div class="row">
      <div class="col-3">
        <div class="mb-2">
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="school_number"
              @change="fetchCampuses(school_number)"
          >
            <option disabled value=""> -Filter By School-</option>
            <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="col-3">
        <div class="mb-2">
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="campus_number" required
              @change="doFetchInvoices"
          >
            <option disabled value="">-filter By Campus-</option>
            <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
            </option>
          </select>
        </div>
      </div>

    <div class="col-3">
          <div class="mb-2">
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="form.statusData"
                @change="doFetchInvoices()"
                >
                <option disabled value="">-filter By Status</option>
              <option value="PAID">PAID</option>
              <option value="PARTIALLY_PAID">PARTIALLY PAID</option>
              <option value="NOT_PAID" >NOT PAID</option>
           
            </select>
          </div>
      </div>
      </div>

    <table
      class="table table-hover caption-top mt-4 table-sm table-striped"
      style="font-size: 13px !important;width: 100%;"
    >
      <thead>
        <tr>
          <th>No.</th>
          <th>CreatedOn</th>
          <th>Due Date</th>
          <th>Total Amount</th>
          <th>Paid Amount</th>
          <th>Balance</th>
          <th>Status</th>
          <th style="width: 18%;"> Actions</th>
        </tr>
      </thead>
      <!-- "number": "c6ee1dc7-898c-4aaf-8d06-1192323cc5a3",
        "ref_number": "24055279",
        "date": "2024-05-13T11:18:19.477Z",
        "due_date": "2024-05-07T00:00:00Z",
        "total_amount": 0,
        "paid_amount": 0,
        "balance": 0,
        "status": "NOT_PAID" -->
      <tbody>
        <tr v-for="(list,index) in invoiceData"  :key="index">
        <td>{{ list?.ref_number }}</td>
        <td>{{ list?.date }}</td>
        <td>{{ list?.due_date }}</td>
        <td>{{ list?.total_amount }}</td>
        <td>{{ list?.paid_amount }}</td>
        <td>{{list?.balance}}</td>
        <td>
          <div :class="{'bg-green-700':list?.status==='PAID', 'bg-red-700':list?.status==='NOT_PAID', 'bg-purple-700':list?.status==='PARTIALLY_PAID'}" class="text-center text-white rounded-md px-3">
            {{ list?.status?.replace("_", " ")?.toLowerCase() }}
          </div>
        </td>
        <td>
          <button  @click="paymentModal(list.number)" class="btn btn-primary btn-sm mb-2" style="float: right;"
          v-if="can('pay_invoice','general')">
        <small>Pay</small></button>
         <router-link
              class="text-decoration-none"
              :to="{name:'invoice-details', query:{invoice_id:list.ref_number,st_id:studentNumber}}">
            <button class="text-[#0d6efd] border border-primary px-3 rounded-sm hover:bg-[#0d6efd] hover:text-white">
            <small>View</small>
            </button>
          </router-link>
        </td>
        </tr>
 
          
      </tbody>
    </table>
  </div>
  </div>
  </div>
  </div>


  </div>
  



  <div>




  </div>
  </template>




<style>

</style>

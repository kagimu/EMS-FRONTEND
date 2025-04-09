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
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js";
import ComboBox from "@/components/ComboBox.vue";
let profile = localStorage.getItem("userProfile")
import InvoiceDetails from "@/main/dashboard/invoice/InvoiceDetails.vue"


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
const itemsList = ref([])
const serviceStore= useServiceStore()
const showInvoiceDetails = ref(false)
 
const showModal = () =>{
  mymodal.value = true
}

const props = defineProps({
     studentDataInfo:[]
   })


const form = reactive({
  statusData:"",
  start_date:"",
  end_date:"",
  items:[]
})
const userType = ref(null)

onMounted(
    async () => {
      doFetchAllStatements()
      await schoolStore.fetchSchools()
       let user = JSON.parse(profile)
        userType.value = user.type

        fetchCurrentSchoolInfo()
    }
)



const fetchCurrentSchoolInfo = () => {
  let draft = props.studentDataInfo
  if(draft) {
    campus_number.value = draft?.current_enrollment?.campus_number
  }
}

watch (
    () => props.studentDataInfo,
    async (data) => {
      if (data) {
        fetchCurrentSchoolInfo()
      }
    }
)



const fetchCampuses = async (school_number) => {
  await campusStore.fetchCampuses(school_number)
  await serviceStore.fetchAllItems({school_number:school_number})
  doFetchAllStatements()
}

const doFetchAllStatements = () =>{
  let studentInfo = props.studentDataInfo
  let data = {
    status:form.statusData,
    school_number:school_number.value,
    campus_number:studentInfo?.current_enrollment?.campus_number,
    user_number:studentInfo?.user_number,
    start_date:form.start_date,
    end_date:form.end_date,
    items:form.items,
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
        doFetchAllStatements()
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


watch(
    () => serviceStore.allItemsListResponse,
    async (draft) => {
      if (draft) {
        if(draft && (draft.length > 0)){
          let arr = []
          draft.forEach(lst => {
            arr.push({text:lst?.name,value:lst?.number})
          })
          itemsList.value = arr
        }
      }
    }
)
const invoiceN = ref(null)
const studentN = ref(null)
const showInvoiceInfoModal = (refN,studentNo) =>{
  invoiceN.value = refN
  studentN.value = studentNo
  showInvoiceDetails.value = true
}

</script>
<template>
  <div>

<!-- {{ campus_number }} -->
    <AppModal title="Creating New Invoice" v-model="mymodal" xl6>
    <NewInvoice :userNumber="userNumber"  :studentDataInfo="studentDataInfo"></NewInvoice>
    </AppModal>

    <AppModal title="Invoice Details" v-model="showInvoiceDetails" xl6>
    <InvoiceDetails :invoiceNumber="invoiceNumber" :studentN="studentN" :invoiceN="invoiceN"></InvoiceDetails>
    </AppModal>


    <AppModal title="Pay Invoice" v-model="showPayment" xl>
    <InvoicePayment :invoiceNumber="invoiceNumber" :userNum="userNumber"></InvoicePayment>
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


    <div class="grid grid-cols-3 gap-2">

       <div>
        <div class="mb-1">
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="school_number"
              @change="fetchCampuses(school_number)"
          >
            <option disabled value=""> --Filter By School--</option>
            <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
            </option>
          </select>
        </div>
      </div>

       <div>
        <div class="mb-1">
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="campus_number" required
              @change="doFetchAllStatements"
          >
            <option disabled value="">--filter By Campus--</option>
            <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
            </option>
          </select>
        </div>
      </div>

    <div>
          <div class="mb-1">
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="form.statusData"
                @change="doFetchAllStatements()">
                <option disabled value="">--filter By Status--</option>
              <option value="PAID">PAID</option>
              <option value="PARTIALLY_PAID">PARTIALLY PAID</option>
              <option value="NOT_PAID" >NOT PAID</option>
           
            </select>
          </div>
      </div>

      <div>
        <div class="mb-1">
          <input
              class="form-control  shadow-none"
              type="date"
              v-model="form.start_date"
              pattern="\d{2}/\d{2}/\d{4}"
              @change="doFetchAllStatements()"
              placeholder="Start date">
          <div class="text-xs text-gray-600 ml-2">Start date</div>
        </div>
      </div>

      <div>
        <div class="mb-1">
          <input
              @change="doFetchAllStatements()"
              pattern="\d{2}/\d{2}/\d{4}"
              class="form-control shadow-none"
              type="date" v-model="form.end_date"
              placeholder="End date">
          <div class="text-xs text-gray-600 ml-2">End date</div>
        </div>
      </div>

      <div>
        <combo-box
            v-model:optionResponse="form.items"
            :optionList="itemsList"
            :optionDraft="form?.items"
            @change="doFetchAllStatements()"
        ></combo-box>
      </div>

      </div>




    <table
      class="table table-hover caption-top mt-4 table-sm table-striped"
      style="font-size: 13px !important;width: 100%;"
    >
      <thead>
        <tr>
          <th>#</th>
          <th>No.</th>
          <th>Client</th>
          <th>Total Amount</th>
          <th>Paid Amount</th>
          <th>Balance</th>
          <th>Status</th>
          <th>Due Date</th>
          <th>CreatedOn</th>
          <th> Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(list,index) in invoiceData"  :key="index">
        <td>{{ (index + 1) }}</td>
        <td>{{ list?.ref_number }}</td>
        <td style="text-transform: capitalize;">{{ list?.names}}</td>
        <td>{{ list?.total_amount?.toLocaleString()}}</td>
        <td>{{ list?.paid_amount?.toLocaleString()}}</td>
        <td>{{list?.balance?.toLocaleString()}}</td>
        <td>
          <div :class="{'bg-green-700':list?.status==='PAID', 'bg-red-700':list?.status==='NOT_PAID', 'bg-purple-700':list?.status==='PARTIALLY_PAID'}" class="text-center text-white rounded-md">
            {{ list?.status?.replace("_", " ")?.toLowerCase() }}
          </div>
        </td>
          <td>{{ list?.due_date }}</td>
          <td>{{ list?.date }}</td>
        <td>
        <div>
          <!-- <router-link
          v-if="userType != 'User'"
              class="text-decoration-none"
              :to="{name:'invoice-details', query:{invoice_id:list.ref_number,st_id:studentNumber}}">
            <button class="text-[#0d6efd] border border-primary px-3 rounded-sm hover:bg-[#0d6efd] hover:text-white">
              <small>View</small>
            </button>
          </router-link> -->


            <button 
             @click="showInvoiceInfoModal(list.ref_number,studentNumber)" class="text-[#0d6efd] border border-primary px-3 rounded-sm hover:bg-[#0d6efd] hover:text-white">
              <small>View</small>
            </button>
         

          <button
              @click="paymentModal(list.number)" class="bg-[#0d6efd] rounded-sm text-white px-4 btn-primary btn-sm ml-3"
              v-if="can('pay_invoice','general')">
            <small>Pay</small>
          </button>
        </div>
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

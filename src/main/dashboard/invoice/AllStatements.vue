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
import Statement from "@/main/dashboard/profiles/studentProfile/statement/Statement.vue";
import moment from "moment/moment.js";


const routerData = useRouter()
const applicationStore= useApplicationStore()
const studentNumber = routerData.currentRoute.value.query.st_id;
const userNumber = ref(null)
const statementData = ref([])
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
const showTransactionModal = ref(false)
const transactionInfo = ref(null)

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

  invoiceStore.fetchAllStatements(data)
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
    () => invoiceStore.allStatementResponse,
    async (data) => {
      if(data){
        statementData.value = data.data
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

const showTransactionDetails = (data) => {
  if(data){
    transactionInfo.value = data
    showTransactionModal.value = true
  }
}

const dateFormater = (date) => {
  if(date){
    // return date
    let formatted = moment(date).format("DD-MM-YYYY");
    // let formattedDate = new Date(date);
    formatted = (formatted === "01-01-0001") ? "" : formatted
    return formatted;
  }
  return ""
}


</script>
<template>
  <div>

    <AppModal :title="'Financial Statement for: '+transactionInfo?.learner_name" v-model="showTransactionModal" xl6>
      <Statement :studentNumber="transactionInfo?.student_number"></Statement>
    </AppModal>

<!-- {{ statementData }}-->
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


    <div class="grid grid-cols-2 gap-2">

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

<!--    <div>
          <div class="mb-1">
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="form.statusData"
                @change="doFetchAllStatements()">
                <option disabled value="">&#45;&#45;filter By Status&#45;&#45;</option>
              <option value="PAID">PAID</option>
              <option value="PARTIALLY_PAID">PARTIALLY PAID</option>
              <option value="NOT_PAID" >NOT PAID</option>
           
            </select>
          </div>
      </div>-->

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

<!--      <div>
        <combo-box
            v-model:optionResponse="form.items"
            :optionList="itemsList"
            :optionDraft="form?.items"
            @change="doFetchAllStatements()"
        ></combo-box>
      </div>-->

      </div>


    <table
        class="table table-hover caption-top mt-4 table-sm table-striped"
        style="font-size: 13px !important;width: 100%;"
    >
      <thead>
      <tr>
        <th>#</th>
        <th>Date Recorded</th>
        <th>Date Issued</th>
        <th>Learner</th>
        <th>Description</th>
        <th>Amount (In)</th>
        <th>Amount (Out)</th>
        <th>Balance</th>
        <th> Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(list,index) in statementData"  :key="index">
        <td>{{ (index + 1) }}</td>
        <td>{{ dateFormater(list.date_received) }}</td>
        <td>{{ dateFormater(list.issue_date) }}</td>
        <td class="capitalize">

          <span class="hover:text-gray-700">
          <router-link :to="{name:'student-profile-details', query:{st_id:list?.student_number	}}"
                       class="text-gray-700 text-decoration-none hover:underline">
            {{ list?.learner_name }}
          </router-link>
          </span>

        </td>
        <td>{{ list.description }}</td>
        <td><span v-if="list.type ==='IN'">{{ list.amount?.toLocaleString() }}</span>
          <span v-else> - </span>
        </td>
        <td><span v-if="list.type ==='OUT'">{{ list.amount?.toLocaleString() }}</span>
          <span v-else> - </span></td>
        <td>{{ list.balance?.toLocaleString() }}</td>
        <td>
<!--          <i class="bi bi-printer"></i>-->
          <button
              @click="showTransactionDetails(list)" class="text-[#0d6efd] border border-primary px-3 rounded-sm hover:bg-[#0d6efd] hover:text-white">
            <small>View</small>
          </button>

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

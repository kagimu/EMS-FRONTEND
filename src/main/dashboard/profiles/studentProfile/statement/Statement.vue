<script setup>
import {onMounted, ref, watch,reactive} from "vue";
import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"
import useNotificationStore from "@/composables/useNotification.js"
import { useAbility } from '@casl/vue';
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import {useRouter} from "vue-router"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js";

const { can } = useAbility()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const routerData = useRouter()
const applicationStore= useApplicationStore()
const studentNumber = routerData.currentRoute.value.query.st_id;
const userNumber = ref(null)
const statementsData = ref([])
const invoiceStore = useInvoiceStore()
const  notificationStore  = useNotificationStore()
const errorMessage = ref(null)
const loader  = ref(false)
const school_number = ref("")
const campus_number = ref("")
const schoolList = ref([])
const campusList = ref([])
const serviceStore= useServiceStore()
const creditsData = ref([])

const form = reactive({
  start_date:"",
  end_date:""
})

const props = defineProps({
  studentNumber: {
    type: String,
    default: null
  }
})

onMounted(
    async () => {
      await schoolStore.fetchSchools()
      await serviceStore.fetchAllItems()


      filterDraft()

    }
)

watch (
    () => props.studentNumber,
    async (data) => {
      if (data) {
        filterDraft()
      }
    }
)

const filterDraft = () => {
  let std = studentNumber || props.studentNumber
  if(std) {
     applicationStore.fetchStudent(std)
  }

}

watch (
    () => applicationStore.studentDataResponse,
    async (data) => {
      if (data) {
        userNumber.value = data.user_number
        if(userNumber.value){
         doFetchStatements()
         doFetchCredits()
     }
      }
    }
)


const doFetchStatements = () =>{
  let data = {
    user_number:userNumber.value,
    start_date:form.start_date,
    end_date:form.end_date,
 
  }
  invoiceStore.fetchStatements(data)
}

const doFetchCredits = () =>{
  let data = {
    user_number:userNumber.value,
  }
  invoiceStore.fetchCredits(data)
}





watch(
    () => invoiceStore.statementsResponse,
    async (data) => {
      if(data){
        statementsData.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => invoiceStore.creditResponse,
    async (data) => {
      if(data){
        creditsData.value = data.data
      }
    },
    {deep:true}
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

const showTransactionDetails = () => {
  const divContents = document.getElementById("transaction-details-info").innerHTML;
  const printWindow = window.open("", "", "height=600,width=800");
  printWindow.document.write("<html><head><title>Print</title></head><body>");
  printWindow.document.write(divContents);
  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.print();
}


</script>
<template>
  <div>
<!-- {{ creditsData }} -->
    <div class="rw mt-3"  >  
  <div class="card-bdy" style="padding: 0;">
  <div class="mt-4">
    <div class="grid grid-cols-5 gap-2 px-2">
      <div>
        <div class="mb-2">
            <input
              class="form-control  shadow-none"
              type="date"
              v-model="form.start_date"
              pattern="\d{2}/\d{2}/\d{4}"
              @change="doFetchStatements()"
              placeholder="Start date">
          <div class="text-xs text-gray-600 ml-2">Start date</div>
        </div>
      </div>

      <div>
        <div class="mb-2">
            <input
              @change="doFetchStatements()"
              pattern="\d{2}/\d{2}/\d{4}"
              class="form-control shadow-none"
              type="date" v-model="form.end_date"
              placeholder="End date">
          <div class="text-xs text-gray-600 ml-2">End date</div>
        </div>
      </div>

      <div class="col-span-3 flex justify-end ">
       <div>
         <button
             @click="showTransactionDetails()" class="text-[#0d6efd] border border-primary px-3 rounded-sm hover:bg-[#0d6efd] hover:text-white">
           <small>  <i class="bi bi-printer"></i> Print</small>
         </button>
       </div>
      </div>

    <div> 
      </div>
      </div>

<div  id="transaction-details-info">


    <table
      class="table table-hover caption-top mt-4 table-sm table-striped"
      style="font-size: 13px !important;width: 100%; text-align: left;"
    >
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>RecievedBy</th>
          <th>Description</th>
          <th>DR(Debit)</th>
          <th>CR(Credit)</th>
          <th>Balance</th>
<!--          <th> Actions</th>-->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(list,index) in statementsData"  :key="index">
        <td>{{ (index + 1) }}</td>
        <td>{{ list.date_received }}</td>
        <td>{{ list.received_by }}</td>
        <td>{{ list.description }}</td>
        <td><span v-if="list.type ==='IN'">{{ list.amount?.toLocaleString() }}</span>
            <span v-else> - </span>
        </td>
        <td><span v-if="list.type ==='OUT'">{{ list.amount?.toLocaleString() }}</span>
            <span v-else> - </span></td>
        <td>{{ list.balance?.toLocaleString() }}</td>
<!--        <td>
          <i class="bi bi-printer"></i>
        </td>-->
      
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

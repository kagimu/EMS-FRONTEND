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

const form = reactive({
  start_date:"",
  end_date:""
})

onMounted(
    async () => {
     schoolStore.fetchSchools()
     serviceStore.fetchAllItems()
     applicationStore.fetchStudent(studentNumber)
    }
)


watch (
    () => applicationStore.studentDataResponse,
    async (data) => {
      if (data) {
        userNumber.value = data.user_number
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





watch(
    () => invoiceStore.statementsResponse,
    async (data) => {
      if(data){
        statementsData.value = data.data
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


</script>
<template>
  <div>

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

    <div> 
      </div>
      </div>


    <table
      class="table table-hover caption-top mt-4 table-sm table-striped"
      style="font-size: 13px !important;width: 100%;"
    >
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>RecievedBy</th>
          <th>Description</th>
          <th>Amount (In)</th>
          <th>Amount (Out)</th>
          <th>Balance</th>
          <th> Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(list,index) in statementsData"  :key="index">
        <td>{{ (index + 1) }}</td>
        <td>{{ list.date_received }}</td>
        <td>{{ list.received_by }}</td>
        <td>{{ list.description }}</td>
        <td><span v-if="list.type ==='IN'">{{ list.amount }}</span>
            <span v-else> - </span>
        </td>
        <td><span v-if="list.type ==='OUT'">{{ list.amount }}</span>
            <span v-else> - </span></td>
        <td>{{ list.balance }}</td>
        <td>
          <i class="bi bi-printer"></i>
        </td>
      
        </tr>
 
          
      </tbody>
    </table>
  </div>
  </div>
  </div>
  </div>

  <div>

  </div>
  </template>




<style>

</style>

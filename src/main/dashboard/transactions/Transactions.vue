<script setup>
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js"
import NewTransaction from "@/main/dashboard/transactions/NewTransaction.vue"
import AppModal from "@/components/AppModal.vue";
import {useTransactionStore}  from "@/main/dashboard/transactions/store/transactions.js"
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import {useRouter} from "vue-router"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";

const routerData = useRouter()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const applicationStore= useApplicationStore()
const studentNumber = routerData.currentRoute.value.query.st_id;
const userNumber = ref("")
const school_number = ref("")
const campus_number = ref("")
const start_date = ref("")
const end_date = ref("")
const schoolList = ref([])
const campusList = ref([])


const  notificationStore  = useNotificationStore()
const mymodal = ref(false)
const transactionStore = useTransactionStore()
const transactionList = ref(null)



onMounted(() => {
      schoolStore.fetchSchools()
    }
)

const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number)
  fetchTransactionData()
}

const fetchTransactionData = () => {
  let data = {
    school_number:school_number.value,
    campus_number:campus_number.value,
    userNumber:userNumber.value,
    start_date:start_date.value,
    end_date:end_date.value
  }
  transactionStore.fetchTransactions(data)
}

watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if (data) {
        campusList.value = data.data
      }
    }
)

watch(
    () => transactionStore.transactionResponse,
    async (data) => {
      if (data) {
        transactionList.value = data.data
      }
    },
    {deep: true}
)

watch(
    () => transactionStore.errorMessage,
    async (data) => {
      if (data) {
        notificationStore.errorToast("Error", data.message)
      }
    },
    {deep: true}
)


watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    }
)

watch (
    () => applicationStore.studentDataResponse,
    async (data) => {
      if (data) {

        userNumber.value = data.user_number
        fetchTransactionData()

      }
    }
)

</script>
<template>
    <div>
  
  
      <AppModal title="Creating New Transaction" v-model="mymodal" xl6>
      <NewTransaction></NewTransaction>
      </AppModal>


      <div class="grid grid-cols-4 gap-2 px-2 mt-4">
        <div class="">
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
        <div class="">
          <div class="mb-2">
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="campus_number" required
                @change="fetchTransactionData"
            >
              <option disabled value="">-filter By Campus-</option>
              <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <div class="mb-2">
            <input
                class="form-control  shadow-none"
                type="date"
                v-model="start_date"
                pattern="\d{2}/\d{2}/\d{4}"
                @change="fetchTransactionData"
                placeholder="Start date">
            <div class="text-xs text-gray-600 ml-2">Start date</div>
          </div>
        </div>

        <div>
          <div class="mb-2">
            <input
                @change="fetchTransactionData"
                pattern="\d{2}/\d{2}/\d{4}"
                class="form-control shadow-none"
                type="date" v-model="end_date"
                placeholder="End date">
            <div class="text-xs text-gray-600 ml-2">End date</div>
          </div>
        </div>

      </div>




  
      <div class="row mt-0"  >
        <div class="col-12">    
       <div class="row">
        <div class="col-lg-4">
        </div>
        <div class="col-lg-8">
          <!-- <button  @click="showModal" class="btn btn-primary btn-sm mb-2" style="float: right;" >
          <small><i class="bi bi-plus"> Add New Transaction</i></small></button> -->
        </div>
       </div>
         
            <div class="card-body" style="padding: 0;">
    <div class="container mt-1">
      <table
        id="datatable"
        class="table table-hover caption-top mt-4 table-sm table-striped"
        style="font-size: 13px !important;"
      >
        <thead>
          <tr>
            <th>#</th>
            <th>No</th>
            <th>Amount</th>
            <th>Recorded By</th>
            <th>Recorded On</th>
          </tr>
     </thead>
     <tbody>
          <tr v-for="(list,index) in transactionList" :key="index">
          <td>{{ (index + 1) }}</td>
          <td>{{ list.invoice_ref_number }}</td>
          <td>{{ list.amount?.toLocaleString() }}</td>
          <td>{{ list.recorded_by }}</td>
          <td>{{ list.date_time }}</td>
          </tr>  
        </tbody>
      </table>
    </div>
    </div>
    </div>
    </div>
  
  
    </div>
    </template>
  

  
  
  <style>
  
  </style>
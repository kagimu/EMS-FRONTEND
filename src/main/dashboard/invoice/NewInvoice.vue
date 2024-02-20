<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-header">
     <div class="row">
      <div class="col-lg-4">
          <h6 class="textColor" style="margin-top:20px; text-align: left;font-size: 15px;">
            <i class="bi bi-x-lg" @click="goBack()"></i>&nbsp;&nbsp;&nbsp;Create Custom Invoice <b></b>    
          </h6>
      </div>
      <div class="col-lg-8">
        <button type="link" @click="goBack()" class="link-primary textColor" style="margin-top:20px;float: right;font-size: 15px;margin-left:"><i class="bi bi-arrow-right" ></i>&nbsp;&nbsp;&nbsp;View Invoices</button>
      </div>
     </div>
         </div>
          <div class="card-body" style="padding: 0;">
      <div class="container mt-4">
       
        
          <div class="row">
            
            <div class="col-lg-4">
              <form @submit.prevent="createInvoice">
              <p class="textColor" style="margin-bottom: -4px;">Payee Details</p>
              <div class="mb-2">
              <label class="textColor text-sm"><small>Student</small> <span class="star">*</span></label>
              <select class="form-control">
                <option>-select-</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="textColor"><small>Campus</small> </label>
              <input disabled type="text" class="form-control" value="Main Campus">
            </div>
            <div class="mb-2">
              <label class="textColor"><small>Class</small> </label>
              <input disabled type="text" class="form-control" value="P1">
            </div>
            <div class="mb-2">
              <label class="textColor"><small>Name</small></label>
              <input disabled type="text" class="form-control" value="collins Mpiima">
            </div>
            <div class="mb-2">
              <label class="textColor"><small>Email</small></label>
              <input disabled type="email" class="form-control" value="collinsmppima@gmail.com">
            </div>     </form>
            </div>
     

            <div class="col-lg-8">
              <!-- New Design -->
<form class="mt-4"> 
        <table class="table table-bordered">
          <thead>
            <tr class="textColor"  style="padding: 0px;margin: 0px;">
              <th>Service</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(Service, index) in Services" :key="index" class="textColor">
              <td>

                <select class="form-select form-select-lg form-control select-no-border" v-model="Service.name" @change="updateService(index)">
                  <option :value="option.Item.name" v-for="option in availableOptions(index)">{{ option.Item.name }}</option>
                </select>
              </td>
              <td><input   type="text" v-model="Service.quantity" @input="updateAmount(index)" placeholder="1.0" class="inp"></td>
              <td><input  type="text" v-model="Service.cost" @input="updateAmount(index)" placeholder="Unit Price" class="inp"></td>
              <td>{{ Service.amount }}</td>
              <td><button type="button" @click="removeService(index)"><i class="bi bi-x-circle" style="color:red"></i></button></td>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-primary btn-sm textColor" @click.prevent="addService" :disabled="isAddButtonDisabled"><small>ADD ANOTHER SERVICE</small></button>
        <div class="row mt-10">
          <div class="col-lg-8"></div>
          <div class="col-lg-4" >
            <ul style="float: right;">
              <!-- <li>Subtotal - {{ calculateSubtotal() }}</li> -->
              <li>Total : <span style="color:rgba(173, 12, 12, 0.92)">{{ calculateTotal() }}</span> </li>
            </ul>
          </div>
        </div>
      </form>
<!-- ends here -->
            </div>
            </div></div>
            
          
               
    
  



            </div>

          </div>

          <hr>
        
      


      </div>
  </div>
  </div>

  </template>

<script setup>
import {onMounted,reactive, ref, watch,watchEffect,computed} from "vue"
import useNotificationStore from "@/composables/useNotification.js"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js"
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"
import {useAdmissionStore} from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
import {useRouter} from "vue-router"
import { useConditionStore } from "../../settings/conditions/conditionStore"
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js"
import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"

const routerData = useRouter()

const admissionStore = useAdmissionStore()
const conditionStore = useConditionStore()
const buttonLoader = ref(false)

const services = ref( [])
const serviceId = ref(null)
const serviceStore= useServiceStore()
const  invoiceStore  = useInvoiceStore()
const router = useRouter()

let errorMessage = ref(null)
const emit = defineEmits()
const answer = ref('')
const selectAll = ref(false)
const selectedconditions = ref([])
const  notificationStore  = useNotificationStore()
const campusList = ref([])
const schoolList = ref([])
const classList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const studentNumber = routerData.currentRoute.value.query.id;

const conditions = ref([])

onMounted(
    async () => {
      await conditionStore.fetchOfferAdmissionCondition()
    } )
    watch(
    () => conditionStore.offerAdmissionConditionResponse,
    async (data) => {
      if(data){
        conditions.value = data
      }
    },
    {deep:true}
)


let student_number = ref(null)

onMounted(
  async () => {
    await admissionStore.fetchAdmissionOfferByStudentId(routerData.currentRoute.value.query.id)
  } )

  watch(
  () => admissionStore.admissionOfferByStudentIdResponse,
  async (data) => {
    if(data){
      admissionOfferList.value = data.data
      notificationStore.successToast("Success", data.message)
    }
  },
  {deep:true}
  )

  watchEffect(() => {
if (selectAll.value) {
  selectedconditions.value = conditions.slice() // Select all conditions
} else {
  selectedconditions.value = [] // Deselect all conditions
}
})

const goBack = () => {
   window.history.back()
  }


const form = reactive({ 
  selectedconditions,
    class_number:null,
    school_number:null,
    campus_number:null,
    student_number:routerData.currentRoute.value.query.id,
  })

  const admitStudent = () =>{
    alert(JSON.stringify(form))
    admissionStore.newAdmissionOffer(form)
}

watch(
  () => admissionStore.newAdmissionOfferResponse,
  async (data) => {
    if(data){
      // emit("next", 2 )
      admissionOfferList.value = data.data
      notificationStore.successToast("Success", data.message)
    }
  },
  {deep:true}
  )

//   watch(
//     () =>  admissionStore.errorMessage,
//     async (data) => {
//           if (data) {
//               notificationStore.errorToast("Error", data.message)
//           }
//     },
//     {deep: true}
// )

const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
}

const fetchClasses = (campus_number) => {
    campusStore.fetchClassesByCampus(campus_number)
}

onMounted(() => {
        schoolStore.fetchSchools()
    }
)

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
        if (data) {
            schoolList.value = data.data
        }
    },
    {deep: true}
)

watch(
    () => campusStore.campusListResponse,
    async (data) => {
        if (data) {
            campusList.value = data.data
        }
    },
    {deep: true}
)

watch(
    () => campusStore.campusClassesResponse,
    async (data) => {
        if (data) {
            classList.value = data.data
        }
    },
    {deep: true}
)

watch(
    () => campusStore.errorMessage,
    async (data) => {
          if (data) {
              notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}
)

// creaating invoice Logic =========================================================
const Services = ref([]);
// const ServiceOptions = ref([
//   { name: 'Fees', cost: 2000 },
//   { name: 'Toilet Paper', cost: 150 },
//   { name: 'Ream Of papers', cost: 2000 },
//   { name: 'Shoes', cost: 150 },
// ])

const ServiceOptions = ref([])

function updateService(index) {
  const Service = Services.value[index];
  const selectedOption = ServiceOptions.value.find(option => option.Itemname === Service.name);
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

function calculateSubtotal() {
  return Services.value.reduce((total, Service) => total + Service.amount, 0);
}

function calculateTotal() {
  return calculateSubtotal();
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
      await serviceStore.fetchServicesList()
    } )
    
    watch(
    () => serviceStore.servicesListResponse,
    async (data) => {
      if(data){
        ServiceOptions.value = data
      }
    },
    {deep:true}
)

//connect invoice store==========================================
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
        notificationStore.errorToast("Error",data.message)
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
<template>
  <div>
    <form @submit.prevent="admitStudent">
    <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
  <div class="container mt-4">
    <h6 style="margin-top:20px; text-align: left;font-size: 13px;"><small>Offer Admission</small> <b></b> 
      <hr style="color:rgba(192, 192, 192, 0.781); width:200px"></h6>
      <div class="row">
        <div class="col-lg-8">
          <p><small>Student Details </small></p>
          <table
      id="datatable"
      class="table table-striped border"
      style="font-size: 11px !important;border: 0px;">
      <thead>
        <tr>
          <th>#</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr >
          <td>Name</td>
          <td>
          <label class="textColor">Collins Mpiima</label>
        </td>
        </tr> 
        <tr >
          <td>Desired Class</td>
          <td>
          <label class="textColor">P.1</label>
        </td>
        </tr>    
        <tr >
          <td>Campus</td>
          <td>
          <label class="textColor">Kampala Campus</label>
        </td>
        </tr> 
      </tbody>
    </table>

        </div>
        <div class="col-lg-4">
          <p><small>Offer School</small></p>
          <div class="mb-2">
              <label class="textColor"><small>School</small> <span class="star">*</span></label>
              <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm" required
                      v-model="form.school_number"
                      @change="fetchCampuses(form.school_number)"
              >
                  <option disabled value="">Select School</option>
                  <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                  </option>
              </select>
          </div>

          <div class="mb-2">
              <label class="textColor"><small>Campus</small>  <span class="star">*</span></label>
              <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="form.campus_number" required
                      @change="fetchClasses(form.campus_number)"
              >
                  <option disabled value="">Select campus</option>
                  <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                  </option>
              </select>
          </div>
          <div class="mb-2">
              <label class="textColor"><small>Preferred Class</small> <span class="star">*</span></label>
              <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm" required
                      v-model="form.class_number"
              >
                  <option disabled value="">Select class</option>
                  <option v-for="(list, index) in classList" :key="index" :value="list.class_number">{{ list.class_name }}
                  </option>
              </select>
          </div>
        </div>
      </div>
    <label class="textColor mt-3 mb-2 textColor"><small>Are there conditions to fullfil ?</small></label><br>
    <input type="radio" v-model="answer" value="no" > <span class="textColor">No </span> &nbsp;&nbsp;&nbsp;
    <input type="radio" v-model="answer" value="yes"> <span class="textColor">Yes </span>
    <div class="mb-2" v-if="answer === 'yes'">
      <div class="mb-2">
       
        <label class="textColor mt-3 mb-2 textColor"><small>Select Condition</small></label>
        

        <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
          <li class="list-group-item" >
            <input type="checkbox" v-model="selectAll"> <span class="textColor link-secondary" ><b>Select all</b></span>
          </li>
          <li class="list-group-item"  v-for="(condition, index) in conditions" :key="index" >
            <input style="outline: none 0 !important; box-shadow: none;"
                class="form-check-input me-1" type="checkbox" v-model="selectedconditions" :value="condition.number">
                
            <label class="form-check-label cursor-pointer textColor" ><small>{{ condition.description}}</small></label>
          </li>
         
        </ul>
      </div>

    <label class="textColor text-sm"><small>Others</small></label>
    <div class="mb-2">
   <textarea class="form-control">
   </textarea>
     </div>
     </div>
    
<!-- Invoice Details -->
<div>
      <div class="row">
        <div class="col-12">
           </div>
            <div class="card-body" style="padding: 0;">
        <div class="container mt-4">
          <hr>
          <h1 class="textColor"><b>Invoice Details</b></h1>
            <div class="row">      
              <div class="col-lg-12">              
                <div>
                  <div>
        <div class="mb-3">
          <div class="row align-services-center">
            <form class="mt-20"> 
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
  
        </div>
    </div>
    </div>
    </div>

    <div class="row">
    <hr style="color: rgba(17, 17, 17, 0.265);margin-top: 8px;">
    <div class="col-lg-2">
    <button @click="goBack()" type="button" class="btn btn-sm btn-outline-danger mb-2 mr-4"><small><i class="bi bi-x-circle"></i> Cancel</small></button>
</div>
    <div class="col-lg-8">

    </div>
    
    <div class="col-lg-2">
        <button style="float: right" type="submit" class="btn btn-outline-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><small>Submit<i class="bi bi-box-arrow-in-right"></i></small></button>
</div>
</div>
  </div>
</div>
  </div>
  </div></div>
</form>

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
      student_number:studentNumber
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

    watch(
      () =>  admissionStore.errorMessage,
      async (data) => {
            if (data) {
              // emit("next", 2 )
                notificationStore.errorToast("Error", data.message)
            }
      },
      {deep: true}
  )

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
          // ServiceOptions.value = data
          ServiceOptions.value = data.map(option => ({ name: option.Item.name, cost: option.Item.cost }));

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


  
  <style scoped>
  
  </style>
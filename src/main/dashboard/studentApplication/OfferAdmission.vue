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
          <p><small>Offer School </small></p>
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
            <ul>
            <li class="list-group-item">
              <label class="form-check-label cursor-pointer textColor" :for="'selectAllCheckbox' + columnIndex"> <input class="form-check-input me-" type="checkbox" :id="'selectAllCheckbox' + columnIndex" v-model="selectAllAll" @change="selectAllservices">
                Select All</label>
              </li>
          </ul>

          <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="col-md-4">
            <ul class="list-group text-sm mb-4" style="border-radius: 0;">
              <li class="list-group-item" v-for="(item, index) in column" :key="index">
                <input class="form-check-input me-1" type="checkbox" :id="'itemCheckbox' + index" v-model="selectedservices" :value="(columnIndex * 7) + index">
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

// const conditions = [
//   'condition 1', 
//   'condition 2', 
//   'condition 3', 
//   'condition 4'
// ]


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

    // "class_number":"bcffbfed-ddfa-438f-a462-cac106658ea3",
    // "school_number":"{{SCHOOL_ID}}",
    // "campus_number":"2d8e19d3-78e4-450a-8fdc-1cabe7e63a16",
    // "student_number":"{{STUDENT_ID}}"

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

  // invoice
  
onMounted(
      async () => {
        await serviceStore.fetchServicesList()
      } )
      
      watch(
      () => serviceStore.servicesListResponse,
      async (data) => {
        if(data){
          services.value = data
        }
      },
      {deep:true}
  )

const studentNumber = routerData.currentRoute.value.query.id;
const invoice = ref({
  services
})

const selectAllAll = ref(false)// Select all services across all columns
const selectedservices = ref([])

const total = computed(() => selectedservices.value.reduce((acc, index) => acc + invoice.value.services[index].cost, 0))

const columns = computed(() => {
  const services = invoice.value.services
  const numColumns = Math.ceil(services.length / 7)
  const columns = Array.from({ length: numColumns }, (_, columnIndex) => {
    const startIndex = columnIndex * 7
    return services.slice(startIndex, startIndex + 7)
  })
  return columns
})

const selectAllservices = () => {
  if (selectAllAll.value) {
    const allservices = invoice.value.services.map((_, index) => index)
    selectedservices.value = [...new Set([...selectedservices.value, ...allservices])] // Add all services
  } else {
    selectedservices.value = [] // Clear selected services
  }
}

const submitInvoice = () => {
  const selectedservicesData = selectedservices.value.map(index => {
    const item = invoice.value.services[index]
    return  item.number
  })
  const data = {
    student_number: studentNumber,
    services: selectedservicesData
  }
  alert(JSON.stringify(data))
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
          notificationStore.errorToast("Error",data.message)
          router.push({ name: 'invoice-details', params: { studentNumber }})

        }
      },
      {deep:true}
  )

  
  </script>


  
  <style scoped>
  
  </style>
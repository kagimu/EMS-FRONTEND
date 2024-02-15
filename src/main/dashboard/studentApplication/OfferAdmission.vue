<template>
  <div>
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
      style="font-size: 11px !important;border: 0px;"
    >
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
                      v-model="school_number"
                      @change="fetchCampuses(school_number)"
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
                      v-model="form.preferred_campus_number" required
                      @change="fetchClasses(form.preferred_campus_number)"
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
     

    <form @submit.prevent="admitStudent">

    

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
                class="form-check-input me-1" type="checkbox" v-model="selectedconditions" :value="condition">
                
            <label class="form-check-label cursor-pointer textColor" ><small>{{ condition }}</small></label>
          </li>
         
         

        </ul>
      </div>

    <label class="textColor text-sm"><small>Others</small></label>
    <div class="mb-2">
   <textarea class="form-control">

   </textarea>
     </div>
     </div>
    <div class="row">
    <hr style="color: rgba(17, 17, 17, 0.265);">
    <div class="col-lg-2">
    <button @click="goBack()" type="button" class="btn btn-sm btn-outline-danger mb-2 mr-4"><small><i class="bi bi-x-circle"></i> Cancel</small></button>
</div>
    <div class="col-lg-8">

    </div>
    
    <div class="col-lg-2">
        <button style="float: right" type="submit" class="btn btn-outline-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><small>Next<i class="bi bi-box-arrow-in-right"></i></small></button>
</div>


</div>
  </form>
    
  </div>
  </div>
  </div>
  </div>
  </div>




  </div>
  </template>
  
  <script setup>
  import {onMounted,reactive, ref, watch,watchEffect} from "vue"
  import useNotificationStore from "@/composables/useNotification.js";
  import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
  import {useRouter} from "vue-router";

  let errorMessage = ref(null)

  const emit = defineEmits()

  const answer = ref('')
  const selectAll = ref(false)
  const selectedconditions = ref([])

  const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()
  const campusList = ref([])
  const schoolList = ref([])
  const classList = ref([])
  const schoolStore = useSchoolStore()
  const campusStore = useCampusStore()
  const school_number = ref(null)

  const conditions = [
  'condition 1', 
  'condition 2', 
  'condition 3', 
  'condition 4'
]


  const goBack = () => {
     window.history.back()
    }

  const form = reactive({ 
      conditions:[],
    })


watchEffect(() => {
  if (selectAll.value) {
    selectedconditions.value = conditions.slice(); // Select all conditions
  } else {
    selectedconditions.value = []; // Deselect all conditions
  }
})

const admitStudent = () =>{
  //go to invoice
  emit("next", 2 )
  
}

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

  


  </script>


  
  <style scoped>
  
  </style>
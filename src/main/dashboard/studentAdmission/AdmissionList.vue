<template>
<div>

  <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
       <div class="row">
        <div class="col-lg-6 "> 
              <input type="text" v-model="searchQuery" class="form-control mt-1 mb-0" placeholder="Search...">  
        </div>
        <div class="col-lg-6">
          <button  class="btn btn-outline-primary  btn-sm mt-1" style="float: right; border:none">
            <small><i class="bi bi-download">&nbsp;Download</i></small></button> 
            <button  class="btn btn-outline-secondary  btn-sm mt-1" style="float: right;border: none;">
            <small><i class="bi bi-printer">&nbsp;Print</i></small></button> 
        </div>

       </div>
           </div>
            <div class="card-body" >
              <div class="row">
      <div class="col-12">
        <div class="mt-3">

          <div class="row mx-auto">

            <div class="col-4 mb-5 mt-5">
              <div class="mb-2">
              <label class="textColor"><small>School</small></label>
              <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm" required
                      v-model="school_number"
                      @change="fetchCampuses(school_number)"   
              >
                  <option disabled value="">--Select School--</option>
                  <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                  </option>
              </select>
          </div>
            </div>

            <div class="col-4 mb-5 mt-5">
          
              <div class="mb-2">
              <label class="textColor"><small>Campus</small> </label>
              <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="campus_number" required
                      @change="fetchClasses(campus_number)"
              >
                  <option disabled value="">--Select campus--</option>
                  <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                  </option>
              </select>
          </div>
            </div>

            <div class="col-4 mb-5 mt-5">
             
          <div class="mb-2">
              <label class="textColor"><small>Class</small></label>
              <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm" required
                      v-model="class_number"
                      @change="fetchAdmissionByClass(class_number)"
              >
                  <option disabled value="">--Select class--</option>
                  <option v-for="(list, index) in classList" :key="index" :value="list.class_number">{{ list.class_name }}
                  </option>
              </select>
          </div>
            </div>

          </div>

        

        </div>
      </div>
    </div>



    <div>
       
  <table id="data"
      class="table table-striped"
      style="font-size: 11px !important;" >
    <thead>
    <tr>
      <th scope="col"> Name</th>
      <th scope="col">Gender</th>
      <th scope="col">Email</th>
      <th scope="col">Phone</th>
      <th>Actions</th>
    </tr>
    </thead>
    <tbody>
   
    </tbody>
  </table>


    </div>
    </div>
    </div>
    </div>
    </div>



  

</div>



</template>


<script setup>
    import {onMounted,reactive, computed,ref, watch} from "vue";
    import NewGradeScale from "@/main/dashboard/assessment/assessmentComponents/NewGradeScale.vue"
    import { useAssessmentStore } from "@/main/dashboard/assessment/store/assessment";
    import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
    import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
    import { useAdmissionStore } from "./newAdmissionComponents/store/adminission";
import useNotificationStore from "@/composables/useNotification.js";

    import { useAbility } from '@casl/vue';

    const { can } = useAbility()
    const admissionList = ref([])
    const assessmentStore = useAssessmentStore()
    const errorMessage = ref(null)
    const campusList = ref([])
    const schoolList = ref([])
    const classList = ref([])
    const schoolStore = useSchoolStore()
    const campusStore = useCampusStore()
    const school_number = ref(null)
    const campus_number = ref(null)
    const class_number = ref(null)
    const showDialog = ref(null)
    const searchQuery = ref('')

let studid = "002773383838383"

const admissionOfferList = ref( [])
const admissionStore= useAdmissionStore()
const  notificationStore  = useNotificationStore()


   

const infoData = ref([])
const filteredInfoData = computed(() => {
  return infoData.value.filter(infoData =>
  infoData.firstname.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
  infoData.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})


    const constent = reactive({
        sch:null,
        cmp:null,
        cla:null
    })

    //fetch
    // onMounted(
    // async () => {
    //   await assessmentStore.fetchAggregateScale()
    // } )


  
    const fetchCampuses = (school_number) => {
      campusStore.fetchCampuses(school_number)
      // assessmentStore.fetchAggregateScale(school_number)
      constent.sch = school_number
      
  }

  const fetchClasses = (campus_number) => {
      campusStore.fetchClassesByCampus(campus_number)
      constent.cmp = campus_number
  }

  const fetchAdmissionByClass = (class_number) =>{
    constent.cla = class_number
    // window.alert(class_number)
    fetchAdmission(constent.cmp)
  }
  
  const fetchAdmission = (a) =>{
    admissionStore.fetchAdmissionByClass(a)
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


// admissionList
  watch(
    () => assessmentStore.admissionByClassResponse,
    async (data) => {
      if(data){
        admissionList.value = data.data
      }
    },
    {deep:true}
    )

    watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        // notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
    )

    
    </script>




<style scoped>

</style>
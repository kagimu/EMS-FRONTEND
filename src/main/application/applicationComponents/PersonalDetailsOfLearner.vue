<template>
  <div>
  <p class="ml-4 mt-4 mb-10" style="text-align: center !important;">DETAILS OF THE LEARNER</p>
    <form @submit.prevent="addLearnerDetails" style="margin-top: 15px;">
    <div class="row">
      <div class="col-12">
          <div class="mb-2">
            <label class="textColor text-sm"><small>Surname</small> <span class="star">*</span></label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;"  v-model="form.surname"  required class="form-control form-control-sm">
          </div>
  
          <div class="mb-2">
            <label class="textColor text-sm"><small>Second name</small> <span class="star">*</span></label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.second_name"  required class="form-control form-control-sm">
          </div>
  
          <div class="mb-2">
            <label class="textColor text-sm"><small>Other names</small> </label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.other_name" class="form-control form-control-sm">
          </div>

          
          <div class="mb-2">
            <label class="textColor text-sm"><small>Reason to enroll </small> </label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.reason_for_choosing_school" class="form-control form-control-sm">
          </div>


          <div class="mb-2">
              <label class="textColor text-sm"><small>How did you know about us ? </small> </label>
              <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="form.source_of_school_info">
                  <option value="News paper" >News paper</option>
                  <option value="Old parent">Old parent</option>
                  <option value="Television">Television</option>
                  <option value="Internet">Internet</option>
              </select>
          </div>


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
                      v-model="form.campus_class_number"
              >
                  <option disabled value="">Select class</option>
                  <option v-for="(list, index) in classList" :key="index" :value="list.number">{{ list.class_name }}
                  </option>
              </select>
          </div>


          <div class="row">
            <div class="col-lg-6">
              <label class="textColor text-sm"><small>DOB</small> <span class="star">*</span></label>
            <input type="date" style="outline: none 0 !important; box-shadow: none;" v-model="form.date_of_birth"  required
             class="form-control form-control-sm">
            </div>
            <div class="col-lg-6">
              <label class="textColor text-sm"><small>gender</small> <span class="star">*</span></label>
            <select class="form-control form-control-sm"
             v-model="form.gender" style="outline: none 0 !important; box-shadow: none;">
              <option v-if="!form.gender" disabled>-select-</option>
              <option v-if="form.gender">{{ form.gender }}</option>
              <option  v-if="form.gender != 'Male'">Male</option>
              <option  v-if="form.gender !='Female'">Female</option>
            </select>
            </div>

          </div>
      </div>   
   
        <div class="text- mt-4">
          <div class="row" >
            <div class="col-lg-4">
              <button type="button" @click="goBack()" class="btn btn-sm btn-success mb-2 mr-4" style="color: white;">
           <small><i class="bi bi-box-arrow-in-left"></i> Back</small>
            <!-- <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
              <span class="visually-hidden">Loading...</span>
            </div> -->
          </button>
            </div>
            <div class="col-lg-4"></div>
            <div class="col-lg-4">
              <button type="submit" class="btn btn-sm btn-primary mb-2 mr-4 "
               style="color: white;float: right;">
               <small>Next &nbsp;<i class="bi bi-box-arrow-in-right"></i></small>  
        <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </div>
      </button>
            </div>
            
          </div>
        </div>
    </div>
    </form>
  </div>
  </template>
  
  <script setup>
  import {onMounted, reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
  import api from "@/config/api.js";
  import {useRouter} from "vue-router";

const routerData = useRouter()
let  applicationNumber = routerData.currentRoute.value.query.applicationId

const buttonLoader = ref(false)
let errorMessage = ref(null)
const emit = defineEmits()

const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()
  const campusList = ref([])
  const schoolList = ref([])
  const classList = ref([])
  const schoolStore = useSchoolStore()
  const campusStore = useCampusStore()
  const school_number = ref(null)
  
  const form = reactive({
  surname:null,
  second_name:null,
  other_name:null,
  preferred_type_of_enrollment:null,
  date_of_birth:null,
  gender:null,
  reason_for_choosing_school:null,
  preferred_campus_number: null,
  source_of_school_info: null,
  application_number: localStorage.getItem("applicationId"),
  campus_class_number: null,
  learner_number:null
})

const goBack = () =>{
  emit("next", 1 )
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

const addLearnerDetails = () => {
  if(!applicationNumber){
    buttonLoader.value = true
    form.application_number = localStorage.getItem("applicationId")
  applicationStore.newApplicationLeanerDetails(form)
  }else{
    buttonLoader.value = true
    form.application_number = localStorage.getItem("applicationId")
    if(form.learner_number){
      applicationStore.updateLearnerDetails(form.learner_number,form)
    }else{
      applicationStore.newApplicationLeanerDetails(form)
    }
 
  }
 
}

watch (
    () => applicationStore.newApplicationDetailsLearnerResponse,
    async (data) => {
      if(data){
        localStorage.setItem("CampusClassNumber", form.campus_class_number)
        localStorage.setItem("studentNumber", data.data.number)
        // alert(data.apn)
        buttonLoader.value = false
        // notificationStore.successToast("Successs", data.message)
        emit("next", 3 )
      }
    },
    {deep:true}
)


watch (
    () => applicationStore.updateLearnerPersonalDetailsresponse,
    async (data) => {
      if(data){
        localStorage.setItem("applicationId", data.application_number)
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        emit("next", 3 )
      }
    },
    {deep:true}
)


watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
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

  
  onMounted(
    () => {
      if(applicationNumber !=""){
      applicationStore.fetchApplicationById(applicationNumber)
      }
    }
)

watch (
    () => applicationStore.applicationByIdResponse,
    async (data) => {
      if(data){
        form.surname= data.Student.surname
        form.second_name=data.Student.second_name,
        form.other_name=data.Student.other_name,
        form.gender= data.Student.gender,
        form.date_of_birth=data.Student.date_of_birth,
        form.preferred_campus_number=data.Student.preferred_campus_number,
        form.reason_for_choosing_school=data.Student.reason_for_choosing_school
        form.source_of_school_info = data.Student.source_of_school_info
        form.learner_number = data.Student.number
        if(form.learner_number){
          setSchoolAndCampus(data)
       }
        
      }
    },
    {deep:true}
)



async function setSchoolAndCampus(data) {
         await api.get("main/school/all")
            .then((response) => {
                schoolList.value = response.data.data
                  api.get("main/campus/all")
            .then((responseData) => {
                campusList.value = responseData.data.data
                form.preferred_campus_number = data.Student.preferred_campus_number
                school_number.value=data.Student.PreferredCampus.school_number
                campusStore.fetchClassesByCampus(data.Student.preferred_campus_number)
                form.campus_class_number = data.Student.campus_class_number
            }).catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })

            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    
           
    }
 
  </script>
  
  <style scoped>
  .mb-8 {
    margin-bottom: 2rem;
    text-align: left;
       color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    font-size: 17px;
}
.mb-2 {
    /* margin-bottom: 2rem; */
    text-align: left;
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    border-radius: 3px !important;
    /* font-size: 17px; */
}
input{
  /* width:480px; */
  /* margin-top: 8px; */
  background-color: #f8f9fa;
  border-radius: 2px;
  font-size: 10px !important;
}
select{
  /* margin-top: 8px !important; */
  background-color: #f8f9fa;
  border-radius: 2px;
  font-size: 10px !important;
}
.star{
  color:red;
}
  </style>
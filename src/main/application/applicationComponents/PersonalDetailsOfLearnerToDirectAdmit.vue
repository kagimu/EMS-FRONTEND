<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import api from "@/config/api.js";
import {useRouter} from "vue-router";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
import {useStudyModeStore} from "@/main/settings/mode-of-study/store/studyMode.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";

const levelStore = useLevelStore()
const assessmentStore = useAssessmentStore()
const modeStudyStore = useStudyModeStore()
const modeOfSchoolData = ref([])
const classStore = useClassesStore()
const levelList = ref([])

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
const applicationId = ref(null)
const curriculumList = ref([])
const student_number = ref(null)


const form = reactive({
  surname:null,
  second_name:null,
  other_name:null,
  preferred_type_of_enrollment:null,
  date_of_birth:null,
  school_number:"",
  gender:"",
  reason_for_choosing_school:"",
  preferred_campus_number: "",
  source_of_school_info: "",
  application_number: applicationId.value,
  class_number: "",
  learner_number:null,
   mode_of_study_number:"",
   campus_curriculum_number:"",
   level:"",
   lin:null,
   adn:null,
   interview_number:""
})

onMounted(() => {
      schoolStore.fetchSchools(entity_number)
      // getModeOfStudyInfo()
    }
)


const getModeOfStudyInfo = () =>{
  let data = {
    school_number:form.school_number,
  }
  modeStudyStore.fetchModeOfStudy(data)
}


watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
      }
    },
    {deep:true}
)


watch(
    () => modeStudyStore.modeOfStudyInfoResponse,
    async (data) => {
      modeOfSchoolData.value = data.data
    },
    {deep: true}
)

const goBack = () =>{
  emit("next", {id:applicationId.value, step:1})
}

const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number)
  getModeOfStudyInfo()
}

const fetchClasses = (campus_number) => {
  levelStore.fetchCampusCurriculum(campus_number)
}


const fetchLevelClasses = (levelNumber) => {
   
  let data = {
    school_number:form.school_number,
    campus_level_number:levelNumber,
    campus_curriculum_number:form.campus_curriculum_number
  }
  campusStore.fetchClassesBySchool(data)
}



const fetchCampusLevel = (campus_curriculum_number) => {
   classStore.fetchCampusLevel(campus_curriculum_number)
}
  

let entity_number = localStorage.getItem('entity_number')






const addLearnerDetails = () => {
  // emit("next", {step:3})
  if(!applicationId.value){
    buttonLoader.value = true
    form.application_number = applicationId.value
    applicationStore.newApplicationLeanerDetails(form)
  }else{
    buttonLoader.value = true
    form.application_number = applicationId.value
    if(form.learner_number){
      applicationStore.updateLearnerDetails(form.learner_number,form)
    }else{
      localStorage.setItem('campus_curriculum_number', form.campus_curriculum_number)
      form.campus_number = form.preferred_campus_number
      applicationStore.newApplicationLeanerDetails(form)
    }

  }

}
const page = ref(1)
const per_page = ref(15)

watch (
    () => applicationStore.newApplicationDetailsLearnerResponse,
    async (data) => {
      if(data){
        localStorage.setItem("CampusClassNumber", form.class_number)
        localStorage.setItem("studentNumber", data.data.number)
        buttonLoader.value = false
        // assessmentStore.fetchAssessmentAreaByClass(form.class_number)

        emit("next", {id:applicationId.value, step:3})


        let dataa = {
          page: page.value,
          per_page: per_page.value,
          status: "SUBMITTED",
          school_number: "",
        }
        // await applicationStore.fetchApplicationList(dataa)
      }
    }
)


watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        levelList.value = data.data
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
    }
)



watch(
    () => campusStore.errorMessage,
    async (data) => {
      if (data) {
        notificationStore.errorToast("Error", data.message)
      }
    }
)




watch (
    () => applicationStore.applicationByIdResponse,
    async (data) => {
      if(data){
        let draft = data.student
        applicationId.value = data.number
        // form.surname= draft.surname
        // form.second_name=draft.second_name
        // form.other_name=draft.other_name
        // form.gender= draft.gender
        // form.date_of_birth=draft.date_of_birth
        // form.preferred_campus_number=draft.preferred_campus_number
        // form.class_number=draft.class_number
        // form.reason_for_choosing_school=draft.reason_for_choosing_school
        // form.source_of_school_info = draft.source_of_school_info
        // form.learner_number = draft.number
        // form.school_number = draft.school_number
        // form.lin = draft?.lin
        // student_number.value = draft.number
//         if(draft?.school_number) {
//         let dataa = {
//     school_number:draft?.school_number,
//   }
//   modeStudyStore.fetchModeOfStudy(dataa)
// }

        // form.mode_of_study_number = draft.mode_of_study_number

        // if(draft?.school_number) {
        //   fetchCampuses(draft.school_number)
        // }

        // if(draft?.preferred_campus_number) {
        //   fetchClasses(draft?.preferred_campus_number)
        //   form.campus_curriculum_number = draft?.campus_curriculum_number
        // }

        // if(draft?.campus_curriculum_number){
        //   fetchCampusLevel(draft?.campus_curriculum_number)
        //   form.level = draft?.campus_level_number
        // }

        // if(draft?.campus_level_number){
        //   fetchLevelClasses(draft?.campus_level_number)
        //   form.class_number = draft?.class_number
        // }
  
        }
      
      }
    
)


watch (
    () => applicationStore.updateLearnerPersonalDetailsresponse,
    async (data) => {
      if(data){
       
        localStorage.setItem("studentNumber", student_number.value)
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        emit("next", {id:applicationId.value, step:3})
      }
    }
)

watch(
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    }
)


  

</script>

<template>
  <div>
  <p class="ml-4 mt-4 mb-10" style="text-align: center !important;">DETAILS OF THE LEARNER</p>
    <form @submit.prevent="addLearnerDetails" style="margin-top: 15px;">
  
        <div class="row">
        <div class="col-6">
        <div class="mb-2">
            <label class="text-sm text-sm"><small>ADN</small> <span class="star">*</span></label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;"  v-model="form.adn" 
             required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="text-sm text-sm"><small>Surname</small> <span class="star">*</span></label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;"  v-model="form.surname"  required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
              <label class="text-sm text-sm"><small>Second name</small> <span class="star">*</span></label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.second_name"  required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm text-sm"><small>Other names</small> </label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.other_name" class="form-control form-control-sm">
            </div>


            <div class="row">
              <div class="col-6">
                <div class="mb-2">
              <label class="text-sm text-sm"><small>DOB</small> <span class="star">*</span></label>
            <input type="date" style="outline: none 0 !important; box-shadow: none;" v-model="form.date_of_birth"  required
             class="form-control form-control-sm">
            </div>
              </div>
              <div class="col-6">
                <div class="mb-2">
              <label class="text-sm text-sm"><small>Gender</small> <span class="star">*</span></label>
            <select class="form-control form-control-sm"
             v-model="form.gender" style="outline: none 0 !important; box-shadow: none;">
              <option value="" disabled>-Select Gender-</option>
              <option value="Male">Male</option>
              <option value="Female" >Female</option>
            </select>
            </div>
              </div>
            </div>
          

        <div class="mb-2">
              <label class="text-sm"><small>LIN</small></label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.lin" 
             class="form-control form-control-sm" >
          </div>

          
          <div class="mb-2">
              <label class="text-sm text-sm"><small>Reason to enroll </small> </label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.reason_for_choosing_school" class="form-control form-control-sm">
            </div>
    </div>

    
          <div class="col-6">
            <div class="mb-2">
              <label class="text-sm"><small>School</small> <span class="star">*</span></label>
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
              <label class="text-sm"><small>Campus</small>  <span class="star">*</span></label>
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
          <label class="text-sm"><small>Curriculum</small></label>
            <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
                v-model="form.campus_curriculum_number"  
                @change="fetchCampusLevel(form.campus_curriculum_number)"                                         
            >
                <option disabled value="" >--Select Curriculum--</option>
                <option  v-for="(lvl, index) in curriculumList" :key="index" :value="lvl.number">{{lvl.name}}</option>
            </select>
           </div>
        
         
            <div class="mb-2">
              <label class="text-sm"><small>Level</small></label>
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="form.level"
                  @change="fetchLevelClasses(form.level)"
              >
                <option disabled value="">-Filter by level-</option>
                <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.number">{{lvl.code+". "+lvl.name}}</option>
              </select>
            </div>
          

            <div class="mb-2">
              <label class="text-sm"><small>Preferred Class</small> <span class="star">*</span></label>
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.class_number"
                
              >
                <option disabled value="">Select class</option>
                <option v-for="(list, index) in classList" :key="index" :value="list.number">{{ list.name }}
                </option>
              </select>
            </div>
          
          <div class="mb-2">
              <label class="text-sm"><small>Mode Of Study</small>  <span class="star">*</span></label>
              <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="form.mode_of_study_number" required
              >
                  <option disabled value="">Select Mode Of Study</option>
                  <option v-for="(list, index) in modeOfSchoolData" :key="index" :value="list.mode_of_study_number">{{ list.name }}
                  </option>
              </select>
          </div>

            <div class="mb-2">
              <label class="text-sm text-sm"><small>How did you know about us ? </small> </label>
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="form.source_of_school_info">
                <option disabled value="">-Select Source of School Info-</option>
                <option value="News paper" >News paper</option>
                <option value="Old parent">Old parent</option>
                <option value="Television">Television</option>
                <option value="Internet">Internet</option>
              </select>
            
          </div>
          </div>
      </div>   
   
        
          <div class="row mt-4">
            <div class="col-lg-4">
              <button type="button" @click="goBack()" class="btn btn-sm btn-success mb-2 mr-4" style="color: white;">
           <small><i class="bi bi-box-arrow-in-left"></i> Back</small>
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

    </form>
  
  </div>
  </template>
  

  
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
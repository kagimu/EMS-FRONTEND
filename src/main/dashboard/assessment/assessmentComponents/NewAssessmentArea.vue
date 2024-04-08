<template>
<div>
    <form @submit.prevent="addAssesmentArea">
           
           <div class="mb-2">
             <label class="textColor"><small>Level</small> <span class="star">*</span></label>
                 <select
                     style="box-shadow: none;"
                     class="form-select form-select-sm"
                     v-model="level"
                     @click="filterClasses()">
                   <option disabled value="">Select Level</option>
                   <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.level_number">{{lvl.code+". "+lvl.name}}</option>
                 </select>
             </div>


               
         <div class="mb-2">
           <label class="textColor"><small>Class</small> <span class="star">*</span></label>
           <select
                     style="box-shadow: none;"
                     class="form-select form-select-sm"
                     v-model="form.curriculum_class_number"
                     @click="fetchSubject(form.curriculum_class_number)">
                   <option disabled value="">Select Class</option>
                   <option v-for="(cls, index) in classList" :key="index" :value="cls.number">{{cls.name}}</option>
                 </select>
         </div>


             <div class="mb-2">
             <label class="textColor"><small>Subjects</small> <span class="star">*</span></label>
             <select
                     style="box-shadow: none;"
                     class="form-select form-select-sm" 
                     v-model="form.subject_number"
             >                
                 <option v-for="(sbj, index) in subjectList" :key="index" :value="sbj.number">{{sbj.name}}</option>
                 <option  value="">Other</option>
             </select>
         </div>

         <div class="mb-2" v-if="form.subject_number === ''">
               <label class="textColor"><small>Specify Name</small></label>
               <input v-model="form.name"  type="text" required class="form-control">
             </div>

             
             <div class="text-right mt-4">
               <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
                 <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
                   <span class="visually-hidden">Loading...</span>
                 </div></button>
             </div>
           </form>
</div>
</template>

<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes";

import {useRouter} from "vue-router";
const routerData = useRouter()
import { useAbility } from '@casl/vue';

const { can } = useAbility()

const buttonLoader = ref(false)
const interviewDialog= ref(false)
let errorMessage = ref(null)
const levelStore = useLevelStore()
const classStore = useClassesStore()

const assessmentStore= useAssessmentStore()
const  notificationStore  = useNotificationStore()
const campusList = ref([])
const schoolList = ref([])
const classList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const school_number = ref(null)
const levelList = ref( [])
const level = ref( "")
const subjectList = ref([])

let  curriculumNumber = routerData.currentRoute.value.query.id

const preferred_campus_number = ref(null)

  const form = reactive({ 
    name:null,
    curriculum_class_number:[],
    subject_number:null
  })

  onMounted(
  async () => {
    await assessmentStore.fetchAssesmentArea()
  } )

  
onMounted(
  async () => {
    await levelStore.fetchCurriculumLevels(curriculumNumber)
  }
)

const subject_n = ref(null)

//fetching class
const fetchSubject = (a) =>{
subject_n.value = a
classStore.fetchCurriculumClassesByID(subject_n.value )
}

  watch(
  () => classStore.curriculumClassByIdResponse,
  async (data) => {  
  subjectList.value = data.data
  },
  {deep:true}
)
  


const filterClasses = () => {
  fetchClassList()
}

const fetchClassList = () => {
let data = {
  level:level.value,
  curriculum_number:curriculumNumber,
}
classStore.fetchCurriculumClasses(data)
}

watch(
  () => classStore.curriculumClassInfoResponse,
  async (data) => {
    if(data && data.data){
      let classData = data.data
      if(classData && (classData.length > 0)){
        classList.value = classData[0].class
      }
      
    }
  },
  {deep:true}
)

  watch(
  () => levelStore.curriculumLevelInfoResponse,
  async (data) => {
    if(data){
      levelList.value = data.data
    }
  },
  {deep:true}
)


//working on dialog
const closeInterviewDialog = () => {
interviewDialog.value = false;
};
const showInterviewDialog = () => {
interviewDialog.value = true;
}

  const addAssesmentArea = () => {

  // alert(JSON.stringify(form))
  interviewDialog.value = true;
   buttonLoader.value = true
   assessmentStore.createAssesmentAreas(form)
  }

  watch (
  () => assessmentStore.newAssesmentAreasResponse,
  async (data) => {
    if(data){
      buttonLoader.value = false
      assessmentStore.fetchAssesmentArea()
      notificationStore.successToast("Success", data.message)
      form.name=null,
    form.curriculum_class_number=null,
    form.subject_number=null
    }
  },
  {deep:true}
)

watch (
  () => assessmentStore.errorMessage,
  async (data) => {
    if(data){
       buttonLoader.value = true
      errorMessage.value = data.message
      buttonLoader.value = false
      notificationStore.errorToast("Error",data.message)
    }
  },
  {deep:true}
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

</script>



<style>

</style>
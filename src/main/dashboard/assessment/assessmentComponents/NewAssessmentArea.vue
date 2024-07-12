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



const buttonLoader = ref(false)
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
const levelList = ref( [])
const level = ref( "")
const subjectList = ref([])

let  curriculumNumber = routerData.currentRoute.value.query.id



const form = reactive({
  curriculum_class_number:[],
  subjects:[]
})

const addAssessmentArea = () => {
  buttonLoader.value = true
  assessmentStore.createAssessmentAreas(form)
}

onMounted(
    async () => {
      assessmentStore.fetchAssessmentArea()
      levelStore.fetchCurriculumLevels(curriculumNumber)
      schoolStore.fetchSchools()
    } )



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
  classList.value = []
  subjectList.value = []
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
    }
)

watch(
    () => levelStore.curriculumLevelInfoResponse,
    async (data) => {
      if(data){
        levelList.value = data.data
      }
    }
)

watch (
    () => assessmentStore.newAssessmentAreasResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
      }
    }
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
    }
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

watch(
    () => campusStore.campusClassesResponse,
    async (data) => {
      if (data) {
        classList.value = data.data
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





</script>
<template>
<div>
    <form @submit.prevent="addAssessmentArea">
           
           <div class="mb-2">
             <label class="textColor"><small>Level</small> <span class="star">*</span></label>
                 <select
                     style="box-shadow: none;"
                     class="form-select form-select-sm"
                     v-model="level"
                     @change="filterClasses()">
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
                     @change="fetchSubject(form.curriculum_class_number)">
                   <option disabled value="">Select Class</option>
                   <option v-for="(cls, index) in classList" :key="index" :value="cls.number">{{cls.name}}</option>
                 </select>
         </div>


             <div class="mb-2">
             <label class="textColor"><small>Subjects</small> <span class="star">*</span></label>


          <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
          <li class="list-group-item" v-for="(subject_numbers, index) in subjectList">
            <input
                v-model="form.subjects"
                style="outline: none 0 !important; box-shadow: none;"
                class="form-check-input me-1" type="checkbox" :value="subject_numbers.number" :id="index">
            <label class="form-check-label cursor-pointer" :for="index">{{subject_numbers.name}}</label>
          </li>
          </ul>

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



<style>

</style>
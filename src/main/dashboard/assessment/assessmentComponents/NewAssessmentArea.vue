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



const props = defineProps({
  closeAreaDialog: Function,
  curriculum_class_number:String,
  levelNum:String
})


const emit = defineEmits(["closeDialog"]);

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
    await levelStore.fetchCurriculumLevels(curriculumNumber)
    await schoolStore.fetchSchools()
    getAssessmentAreaDetails()
  } )

const getAssessmentAreaDetails = () => {
  if(props.levelNum){
    level.value = props.levelNum
  }
  fetchClassList()

  if(props.curriculum_class_number){
    form.curriculum_class_number = props.curriculum_class_number
  }
  fetchSubject(props.curriculum_class_number)
}


const checkedAssessmentAreaInfo = () => {
    let data = {
      curriculum_number:curriculumNumber,
      curriculum_class_number:form.curriculum_class_number,
      level_number:level.value
    }
    assessmentStore.fetchAssessmentArea(data)
}


watch(
    () => assessmentStore.assessmentAreaResponse,
    async (data) => {
      if(data){
        let info = data.data
        if(info && info.length > 0){
          form.subjects = info.map(item => item.subject_number)
        }
      }
    }
)

const subject_n = ref(null)

//fetching class
const fetchSubject = (a) =>{

  //fetch checked assessment area info
// alert(form.curriculum_class_number)

  if(form.curriculum_class_number != "") {
    checkedAssessmentAreaInfo()
  }



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
  },
  {deep:true}
)


const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number ?? "")
}

const fetchClasses = (campus_number) => {
    campusStore.fetchClassesByCampus(campus_number)
}



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


  
  const addSubject = () => {
    form.subject_numbers.push({number: ""})
  }
  
  const removeSubject = (index) => {
    form.subject_numbers.splice(index, 1)
  }


</script>

<template>
<div>
<!--  {{curriculum_class_number}}-&#45;&#45;{{levelNum}}-->
    <form @submit.prevent="addAssessmentArea">
           
           <div class="mb-2">
             <label class="text-sm"><small>Level</small> <span class="star">*</span></label>
                 <select
                     style="box-shadow: none;"
                     class="form-select form-select-sm"
                     v-model="level"
                     @change="filterClasses()"  required>
                   <option disabled value="">Select Level</option>
                   <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.level_number">{{lvl.code+". "+lvl.name}}</option>
                 </select>
             </div>


               
         <div class="mb-2">
           <label class="text-sm"><small>Class</small> <span class="star">*</span></label>
           <select
                     style="box-shadow: none;"
                     class="form-select form-select-sm"
                     v-model="form.curriculum_class_number"
                     @change="fetchSubject(form.curriculum_class_number)" required>
                   <option disabled value="">Select Class</option>
                   <option v-for="(cls, index) in classList" :key="index" :value="cls.number">{{cls.name}}</option>
                 </select>
         </div>


             <div class="mb-2">
             <label class="text-sm"><small>Subjects</small> <span class="star">*</span></label>

          <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
          <li class="list-group-item" v-for="(subject_numbers, index) in subjectList">
            <input
                v-model="form.subjects"
                style="outline: none 0 !important; box-shadow: none; width:17px; height:17px"
                class="form-check-input me-2 mr-2" type="checkbox" :value="subject_numbers.number" :id="index">
            <label class="form-check-label cursor-pointer" :for="index">{{subject_numbers.name}}</label>
          </li>
          </ul>

             <!-- <table style="width: 100%;">
                <tr v-for="(subject_numbers, index) in form.subject_numbers" :key="index">
                  <td>
                    <select v-model="subject_numbers.number" class="form-select form-select-sm">
                      <option v-for="option in subjectList" :key="option" :value="option.number">{{ option.name }}</option>
                    </select>
                  </td>
                  <td style="width: 2%;">
                   <i @click="removeSubject(index)"  class="bi bi-x" style="color: red;pointer-events:auto;"></i>
                  </td>
                </tr>
                <tr>
                    <td>
                        <button type="button" @click="addSubject" class="btn btn-primary mb-2 btn-sm p-0 mt-1" style="color:white !important"><i class="bi bi-plus"></i></button>
                    </td>
                    <td></td>
                </tr>
              </table> -->
         </div>
        

         <div class="mb-2" v-if="form.subject_number === ''">
               <label class="text-sm"><small>Specify Name</small></label>
               <input v-model="form.name"  type="text" required class="form-control">
             </div>

             
             <div class="row">
             <div class="mt-4 col-lg-6">
               <button  @click="$emit('closeDialog')" style="float: left" type="button" class="btn btn-danger btn-sm
                 mb-2 mr-4"><i class="bi bi-warning"></i>&nbsp;<small>close</small>
                 </button>
             </div>
             <div class="mt-4 col-lg-6">
               <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
                 <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
                   <span class="visually-hidden">Loading...</span>
                 </div></button>
             </div>
            </div>
           </form>
</div>
</template>

<style>

</style>
<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import { useAssessmentStore } from "../store/assessment";
import { useLevelStore } from "../../../settings/level/store/level";
import useCommonsStore from "@/composables/useCommons.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useRouter} from "vue-router";

const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()
const levelStore = useLevelStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const assessmentStore = useAssessmentStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()
const routerData = useRouter()

const classList = ref([])
const buttonLoader = ref(false)
const errorMessage = ref(null)
const levelData = ref([])
const gradeData = ref([])
const campusCurriculumDataInfo = ref(null)
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const campusLevelList = ref(null)
const campus_level_number = ref("")
const campusClassList = ref(null)
const campusNumber = routerData.currentRoute.value.query.id
const gradeDataInfo = ref([])
const editM = ref(false)

const props = defineProps({
  gradeScaleDatainfo:{}
})

const form = reactive({
  campus_class_number:"",
  campus_number: campusNumber,
  grading_standard_number:"",
})



onMounted(
    async () => {
      await levelStore.fetchCampusCurriculum(campusNumber)
      assessmentStore.fetchGrades()
      if(props.gradeScaleDatainfo.number){
        editM.value = true
      }
    }
)


const sectionPart = reactive([]);

const newSectionPart = () => {
    sectionPart.push({ code: null, grade_number: null,min_value:null,max_value:null})
}

function removeSectionPart(index) {
  sectionPart.splice(index, 1);
}

const convertFormValuesToInt = () => {
  sectionPart.forEach(field => {
    if (field.code !== null) {
      field.code = parseInt(field.code);
    }
    if (field.min_value !== null) {
      field.min_value = parseInt(field.min_value);
    }
    if (field.max_value !== null) {
      field.max_value = parseInt(field.max_value);
    }
  })
}

const createScale = () =>{
  convertFormValuesToInt()
  buttonLoader.value = true
  form.grades = sectionPart
  assessmentStore.createAggregateScale(form)
}


const doFetchGradingStandard = () => {
  let data = {
    campus_number:campusNumber,
    campus_class_number:form.campus_class_number
  }
  assessmentStore.fetchGradeStandard(data)
}


const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number ?? "")
}

const fetchClasses = (campus_number) => {
  campusStore.fetchClassesByCampus(campus_number)
}

onMounted(() => {
      schoolStore.fetchSchools()
      fetchCampusLevel()
    }
)


const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

const fetchClass = (campus_level_number) => {
  academicYearStore.fetchCampusClassByLevel(campus_level_number)
}



watch (
    () => assessmentStore.gradeResponse,
    async (data) => {
      if(data){
        gradeDataInfo.value = data
      }
    }
)

watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        campusCurriculumDataInfo.value = data.data
      }
    }
)

watch (
    () => assessmentStore.newAggregateScaleResponse,
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
        buttonLoader.value = false
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)


watch (
    () => assessmentStore.gradeStandardResponse,
    async (data) => {
      if(data){
        gradeData.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    }
)

watch(
    () => academicYearStore.campusClassByLevelResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
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

onMounted(() => {
      levelStore.fetchLevels()
    }
)
watch(
    () => levelStore.levelInfoResponse,
    async (data) => {
      if (data) {
        levelData.value = data.data
      }
    },
    {deep: true}
)




</script>
<template>
    <div>
      <!-- {{ gradeScaleDatainfo }} -->
        <div class="modal-content">

      <div class="modal-body">
        <form @submit.prevent="createScale()">


          <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Level</div>
            <select
                class="form-select form-select-sm shadow-none"
                v-model="campus_level_number"
                @change="fetchClass(campus_level_number)"
            >
              <option disabled value="">--Select Level--</option>
              <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
            </select>
          </div>



          <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Class</div>
            <select
                class="form-select form-select-sm shadow-none" required
                v-model="form.campus_class_number"
                @change="doFetchGradingStandard"
            >
              <option disabled :value="null">Select</option>
              <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
            </select>
          </div>


          <div class="mb-2">
            <div class="text-[13px] text-[#505050]">Grading Standard</div>
            <select
                class="form-select form-select-sm outline-none shadow-none"
                v-model="form.grading_standard_number"
            >
              <option disabled :value="null">Select</option>
              <option v-for="(gradeList,index) in gradeData" :key="index" :value="gradeList.number">{{ gradeList.name }}</option>
            </select>
          </div>
        
    <div >
        <div v-for="(field, index) in sectionPart" :key="index" class="row">
          <div class="col-lg-4">
            <div>
              <div class="text-[13px] text-[#505050]">Measures Of Assessment</div>
              <select
                  class="form-select form-select-sm shadow-none" required
                  v-model="field.grade_number"
              >
                <option disabled value="">-Select-</option>
                <option v-for="(list, index) in gradeDataInfo" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>
          </div>

          
          <div class="col-lg-1">
          <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Code</div>
            <input
                @keypress="commons.codeValidator($event)"
                maxlength="10"
                v-model="field.code"
                @paste.prevent
                required
                class="form-control form-select-sm shadow-none">
          </div>
        </div>

            <div class="col-lg-3">
              <div class="text-[13px] text-[#505050]">Minimum Scale</div>
               <input
                   maxlength="3"
                   @keypress="commons.numbersOnlyValidator($event)"
                   v-model="field.min_value"
                   placeholder="eg. 90"
                   type="text"
                   class="form-control outline-none shadow-none">
            </div>
            <div class="col-lg-3">
              <div class="text-[13px] text-[#505050]">Maximum Scale</div>
             <input
                 placeholder="eg. 100"
                 maxlength="3"
                 @keypress="commons.numbersOnlyValidator($event)"
                 v-model="field.max_value"
                 type="text"
                 class="form-control outline-none shadow-none">
            </div>
            <div class="col-lg-1">
              <i class="bi bi-x-circle p-0" style="color: red;cursor: pointer;float: left;margin-top: 68%; margin-left: -10px;" @click="removeSectionPart(index)"></i>
            </div>
        </div>
        <button @click="newSectionPart" type="button" class="btn btn-primary btn-small p-1 mb-2" style="width: 30px;text-align: center;"><i class="bi bi-plus"></i></button>
      </div>



     <div class="flex justify-content-end mt-4" style="width: 100%;">
            <button type="submit" class="btn btn-primary border-0 btn-sm">
                 <small><i class="bi bi-save"></i> submit</small>
                 <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                      role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span> 
                    </span>
            </button>
        </div>
    </form>
    </div>
    </div>
    </div>

</template>



<style scoped>

</style>
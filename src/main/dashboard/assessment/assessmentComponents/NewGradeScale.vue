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
const campus_curriculum_number = ref("")
const campusLevelList = ref(null)
const campus_level_number = ref("")
const campusClassList = ref(null)
const campusNumber = routerData.currentRoute.value.query.id


const form = reactive({
  code : null,
  name : null,
  min_value: null,
  max_value: null,
  weight: null,
  description: null,
  campus_class_number: null,
  campus_number: campusNumber,
  grading_standard_number:null
})


onMounted(
    async () => {
      await levelStore.fetchCampusCurriculum(campusNumber)
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

const createScale = () =>{
  form.code = parseInt(form.code)
  form.max_value = parseInt(form.max_value)
  form.min_value = parseInt(form.min_value)
  form.weight = parseInt(form.weight)
  assessmentStore.createAggregateScale(form)
}



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
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)


/*onMounted(
    async () => {
      await assessmentStore.fetchGradeStandard()
    } )*/

const doFetchGradingStandard = () => {
  let data = {
    campus_number:campusNumber,
    campus_class_number:form.campus_class_number
  }
  assessmentStore.fetchGradeStandard(data)
}

watch (
    () => assessmentStore.gradeStandardResponse,
    async (data) => {
      if(data){
        gradeData.value = data.data
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


const fetchCampusLevel = (campus_curriculum_number) => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

const fetchClass = (campus_level_number) => {
  academicYearStore.fetchCampusClassByLevel(campus_level_number)
}

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
        <div class="modal-content">

      <div class="modal-body">
        <form @submit.prevent="createScale()">



          <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Code</div>
            <input
                @keypress="commons.numbersOnlyValidator($event)"
                maxlength="10"
                v-model="form.code"
                required
                class="form-control form-select-sm shadow-none">
          </div>

          <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Curriculum</div>
            <select
                class="form-select form-select-sm shadow-none"
                v-model="campus_curriculum_number"
                @change="fetchCampusLevel(campus_curriculum_number)"
            >
              <option disabled value="">--Select Curriculum--</option>
              <option v-for="(list, index) in campusCurriculumDataInfo" :key="index" :value="list.number">{{list.name}}</option>
            </select>
          </div>



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
              <option disabled value="">Select</option>
              <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
            </select>
          </div>

      <div class="mb-2">
        <div class="text-[13px] text-[#505050]">Name</div>
        <input v-model="form.description" class="form-control outline-none shadow-none" placeholder="Distinction Two">
      </div>

          <div class="mb-2">
            <div class="text-[13px] text-[#505050]">Abbreviation</div>
            <input v-model="form.name" placeholder="D2" type="text" class="form-control outline-none shadow-none">
      </div>



          <div class="mb-2">
            <div class="text-[13px] text-[#505050]">Grading Standard</div>
              <select
                      class="form-select form-select-sm outline-none shadow-none"
                      required
                      v-model="form.grading_standard_number"
              >
                  <option disabled value="">Select</option>
                 <option v-for="(gradeList,index) in gradeData" :key="index" :value="gradeList.number">{{ gradeList.name }}</option>
              </select>
          </div>

          
      <div class="mb-2">
        <div class="row">
            <div class="col-lg-4">
              <div class="text-[13px] text-[#505050]">Minimum Value</div>
               <input
                   maxlength="3"
                   @keypress="commons.numbersOnlyValidator($event)"
                   v-model="form.min_value"
                   type="text"
                   class="form-control outline-none shadow-none">
            </div>
            <div class="col-lg-4">
              <div class="text-[13px] text-[#505050]">Maximum Value</div>
             <input
                 maxlength="3"
                 @keypress="commons.numbersOnlyValidator($event)"
                 v-model="form.max_value"
                 type="text"
                 class="form-control outline-none shadow-none">
            </div>

            <div class="col-lg-4">
              <div class="text-[13px] text-[#505050]">Weight</div>
             <input
                 maxlength="3"
                 @keypress="commons.numbersOnlyValidator($event)"
                 v-model="form.weight"
                 type="text"
                 class="form-control outline-none shadow-none"
                 placeholder="1">
            </div>
        </div>
      </div>

  
     <div class="flex justify-content-end mt-2" style="width: 100%;">
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
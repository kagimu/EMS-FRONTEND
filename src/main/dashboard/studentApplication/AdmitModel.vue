<template>
  <div>  
      <form @submit.prevent="Admit()">
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
            <label class="textColor"><small>Class</small> <span class="star">*</span></label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.class_number"
                    @change="fetchAcademicYear(form.class_number)"
            >
                <option disabled value="">Select class</option>
                <option v-for="(list, index) in classList" :key="index" :value="list.class_number">{{ list.class_name }}
                </option>
            </select>
        </div>


        <div class="mb-2">
            <label class="textColor"><small>Academic Year</small> <span class="star">*</span></label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.academic_year"
                    @change="fetchStudyPeriod(form.academic_year)"
            >
                <option disabled value="">Select Level</option>
               <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.number }}</option>
            </select>
        </div>

        <div class="mb-2">
            <label class="textColor"><small>Study Period</small> <span class="star">*</span></label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.study_period_number"
            >
                <option disabled value="">Select</option>
               <option v-for="(studyPeriodList,index) in studyPeriodData" :key="index" :value="studyPeriodList.number">{{ studyPeriodList.name }}</option>
            </select>
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


</template>

<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";

const  notificationStore  = useNotificationStore()
const campusList = ref([])
const schoolList = ref([])
const classList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const school_number = ref(null)
const buttonLoader = ref(false)
const assessmentStore = useAssessmentStore()
const errorMessage = ref(null)
// const academicData = ref([])
const academicYearStore = useAcademicYearStore()
const academicYearList = ref([])

const form = reactive({
academic_year: null,
study_period_number: null,
class_number: null,
school_number: null,
campus_number: null,
})

const Admit = () =>{
  // alert(JSON.stringify(form))
  assessmentStore.AdmitStudent(form)
}



watch (
  () => assessmentStore.newAggregateScaleResponse,
  async (data) => {
    if(data){
      assessmentStore.fetchAggregateScale()
      buttonLoader.value = false
      notificationStore.successToast("Success", data.message)
    }
  },
  {deep:true}
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


const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
}

const fetchClasses = (campus_number) => {
    campusStore.fetchClassesByCampus(campus_number)
}


//fetchacadmicYear
const fetchAcademicYear = (campusN) =>{
// alert(campusN)
academicYearStore.fetchAcademicYearByCampus(campusN)
}
watch(
    () => academicYearStore.academicYearByCampusResponse,
    async (data) => {
        if (data) {
          academicYearList.value = data.data
        }
    },
    {deep: true}
)


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
.noFocus:focus {
outline: none 0 !important;
box-shadow: none;
-moz-box-shadow: none;
-webkit-box-shadow: none;
}
</style>
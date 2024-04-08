<template>
    <div> 
      {{ studentN }} 
        <form @submit.prevent="Enrol()">
          <div class="mb-2">
            <label class="textColor"><small>School</small> </label>
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
            <label class="textColor"><small>Campus</small>  </label>
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
            <label class="textColor"><small>Class</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.campus_class_number"
                    @change="fetchAcademicYear(form.campus_class_number)"
            >
                <option disabled value="">Select class</option>
                <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">{{ claslist.class_name }}
                </option>
            </select>
        </div>

        <div class="mb-2">
            <label class="textColor"><small>Stream</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.stream_number"
             >
                <option disabled value="">Select Stream</option>
                <option v-for="(slist, index) in streamList" :key="index" :value="slist.number">{{ slist.name }}
                </option>
            </select>
        </div>

        <div class="mb-2">
            <label class="textColor"><small>Academic Year</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.academic_year_number"
            >
                <option disabled value="">Select Year</option>
               <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
            </select>
        </div>

        <div class="mb-2">
            <label class="textColor"><small>Study Period</small> 
            <!-- {{ studyPeriodList }} -->
            </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.study_period_number"
            >
                <option disabled value="">Select</option>
                <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>

            </select>
        </div>

  
         

          <div class="mb-2">
              <label class="textColor"><small>Enrolment Date</small> 
              </label>
              <input type="date" class="form-control" v-model="form.enrollment_date">
                <!-- <VueDatePicker
              text-input
              auto-apply
              :teleport="true"
              style="font-size: 7px;"
              v-model="form.enrollment_date"
              :preview-format="format"
              ></VueDatePicker> -->
             
          </div>
  
   
     <div class="flex justify-content-end mt-2" style="width: 100%;">
            <button type="submit" class="btn btn-primary border-0 btn-sm">
                 <small>Enrol <i class="bi bi-box-arrow-in-right"></i></small>
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
  import {useEnrolmentStore} from "@/main/dashboard/enrollment/store/enrollment.js"
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
  
  const  notificationStore  = useNotificationStore()
  const buttonLoader = ref(false)
  const errorMessage = ref(null)
  const enrolmentStore = useEnrolmentStore()
  const studentN = ref(null)
  const admissionStore = useAdmissionStore()


  const campusList = ref([])
const schoolList = ref([])
const classList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const school_number = ref(null)
const assessmentStore = useAssessmentStore()
// const academicData = ref([])
const academicYearStore = useAcademicYearStore()
const academicYearList = ref([])
const studyPeriodList  = ref([])
const classStore = useClassesStore()
const streamList = ref([])



const currentYear = ref((new Date()).getFullYear());
const date = ref();

const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `Selected date is ${day}/${month}/${year}`;
}


const props = defineProps({
  studN: String,
})



  const form = reactive({
  student_number:studentN,
  academic_year: null,
  StudyPeriod: null,
  class: null,
  campus: null,
  stream:null,
  school:null,
  enrollment_date:null,
  status:"active"
  })
  

  watch (
    () => props.studN,
    async (data) => {
    studentN.value = props.studN.Student.number
    //fetch admission by studentNumber
        form.academic_year = props.studN.number,
         form.StudyPeriod = props.studN.StudyPeriod.name,
         form.class = props.studN.Streams.class_name,
         form.campus = props.studN.Campus.name,
         form.stream = props.studN.Streams.name,
         form.school = props.studN.School.name,
        admissionStore.fetchAdmissionByStudentId(studentN)
    },
    {deep:true}
)


  watch(
      () => admissionStore.admissionByStudentResponse,
      async (data) => {
        if(data){
        //   notificationStore.successToast("Success", data.message )
         form.academic_year = data.academicYear.name,
         form.StudyPeriod = data.StudyPeriod.study_period_name,
         form.class = data.Stream.class_name ,
         form.campus = data.Campus.name,
         form.stream = data.Stream.stream_name ,
         form.school = data.School.name
        }
      },
      {deep:true}
  )

  watch (
      () => admissionStore.errorMessage,
      async (data) => {
        if(data){
          errorMessage.value = data.message
        }
      },
      {deep:true}
  )


const formData = reactive ({
    student_number:studentN,
    enrollment_date:null
} )




  const Enrol = () =>{
    // alert(JSON.stringify(formData))
    enrolmentStore.newEnrolment(form)
  }
  
  
  watch (
    () => enrolmentStore.newsEnrolmentResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
  )
  
  watch (
    () => enrolmentStore.errorMessage,
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
classStore.fetchClassStreams(campusN)

}
watch(
    () => academicYearStore.academicYearByCampusResponse,
    async (data) => {
        if (data) {
          academicYearList.value = data.data

          if(data && data.data){
        let studyData = data.data
        if(studyData && (studyData.length > 0)){
          studyPeriodList.value = studyData[0].studyPeriod
        }
      }
        }
    },
    {deep: true}
)



  watch(
    () => classStore.classStreams,
    async (data) => {
        if (data) {
          streamList.value = data.data
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
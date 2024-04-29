<template>
  <div>

    <div class="row">
      <div class="modal fade" id="admitMainModal" tabindex="-1" :class="{ show: admitshow }" aria-labelledby="" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header text-sm p-0">
          <h6 class="modal-title ml-8 mt-2 mb-2">OFFER ADMISSION</h6>
          <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mt-2 mb-2">
         <AdmitModel :selectedStudentNumber="selectedStudentNumber"></AdmitModel>
        </div>
        </div>
      </div>
    </div>
  </div>
  </div>
   

    <!-- end  -->
    <div class="row mt-3">
      <div class="col-12">
        <div class="">
          <div class="" style="padding: 0;">
  <div class="container mt-2">
      <div class="row">
        <div class="col-lg-12">
          <div class="">
            <div class="">
              <!-- {{student_number ? '' : 'disabbled'}} -->
                <h5 style="font-size: 14px;margin-top: 2px;">Learners Scheduled For {{ interviewM }} </h5>
         
      <div class="row">
    <div class="col-12">
      <div class="mt-2">
        <div class="row mx-auto">
      

          <form @submit.prevent="Admit()">
            <div class="row">
              <div class="col-3">
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
              </div>

              <div class="col-2">
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
      </div></div>


      <div class="col-1">
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
      </div>

      <div class="col-1">
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

      </div>

      <div class="col-3">
        <div class="mb-2">
          <label class="textColor"><small>Academic Year</small> </label>
          <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.academic_year"
          >
              <option disabled value="">Select Year</option>
             <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
          </select>
      </div>
      </div>

      <div class="col-2">
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
      </div>

      <!-- <div class="col-1 mt-2">
        <div class="flex justify-content-end mt-2" style="width: 100%;">
        <button type="submit" class="btn btn-primary border-0 btn-sm " >
             <small>Offer Admission</small>
             <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                  role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span> 
                </span>
        </button>
    </div>
      </div> -->

            </div>
    
</form>

</div>

        
     <!-- <div class="row" >
          <div class="col-8 mb-1"></div>
          <div class="col-4 mb-1">
            <input type="text" v-model="searchQuery" class="form-control mt-1 mb-0" placeholder="Search...">  
          </div>

        </div> -->
      </div>
    </div>
  </div>
            </div>
          </div>
        </div>
      </div>
      

<!-- {{ selectedStudentNumber }} -->
<div class="row">

  <div class="col-lg-10">
    <table
      id="datatable"
      class="table table-striped"
      style="font-size: 14px !important;"
    >
    <thead >
        <tr>
          <th style="width: 5px;"><input type="checkbox"   class="checkbox-primary"></th>
          <th>Student</th>
          <th>Action</th>
        </tr>
  <!-- <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
  </div> -->
      </thead>
      <tbody>
        <tr v-for="(student, index) in interviewStudentList" :key="index">
          <td><input type="checkbox"  v-model="selectedStudents[index]" class="checkbox-primary"></td>
          <td> 
            {{student.student_surname ? student.student_surname : ""}}
                 {{student.student_second_name ? " "+student.student_second_name : ""}}
                 {{student.student_other_name ? " "+student.student_other_name : ""}}</td>
        
          <td>
              <router-link style=""
                class="text-decoration-none"
                :to="{name:'interview-learners-details', query:{st_id:student.number,interview_id:interviewNumber,applicationN:student.number}}">
                <button type="button"
                  class="text-[#0d6efd] border border-primary px-3 rounded-sm hover:bg-[#0d6efd] hover:text-white"
              >view Details</button>

            </router-link>

             
             <span v-for="(listD, index) in scoreDataList " :key="index">
            <span>{{ listD.actual_score }}</span></span>
            
          </td>
        </tr>   
                  
      </tbody>
    </table>
  </div>
  <div class="col-lg-2">
<div class="ant-alert-action mt-3">
  <button  @click="showDialog" data-bs-toggle="modal" :data-bs-target="selectedStudentNumber.length > 0 ? '#admitMainModal' : ''" type="submit"
    class="mb-2 btn btn-primary btn-sm ml-2 mr-2 " 
    style="float: rigt;" ><i></i>Offer Admission</button>
</div>
  </div>
</div>


  
  </div>
  </div>
  </div>
  </div>
  </div>


  </div>
  </template>
  
  <script setup>
import {onMounted,reactive, ref,computed, watch} from "vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import { useStudentApplicationStore } from "./store/student_application"
import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";

import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";

import AdmitModel from "@/main/dashboard/studentApplication/AdmitModel.vue";


const interviewStudentList = ref( [])
let errorMessage = ref(null)
const buttonLoader = ref(false)
const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()
const routerData = useRouter()
const gradeDialog = ref( false)
const admissionStore = useAdmissionStore()

let  interviewNumber = routerData.currentRoute.value.query.interview_id
let assessmentricsNumber = routerData.currentRoute.value.query.assessment_metric_id
let interviewM = routerData.currentRoute.value.query.interview
const studentOnInterviewId= ref(null)
const studentData=ref(null)

const selectedStuds = ref([])

const studentNumber = ref(null)
const studentApplicationStore = useStudentApplicationStore()
const assessmentMetricsData = ref([])

const enterScoreDialog = ref(false)
const scoreDataList = ref([])



const campusList = ref([])
const schoolList = ref([])
const classList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const school_number = ref(null)
const assessmentStore = useAssessmentStore()
const academicYearStore = useAcademicYearStore()
const academicYearList = ref([])
const studyPeriodList  = ref([])
const classStore = useClassesStore()
const streamList = ref([])


const selectedStudents = ref([])
const admitshow  = ref(false)

  

const setStudentOnInterviewID = (id,studa) =>{
  studentOnInterviewId.value = id
  studentData.value=studa
  
}
const ScoreData = reactive ({
  score:null
})

onMounted(
    () => {
      applicationStore.fetchStudentsOnInterview(interviewNumber)
    }
)

onMounted(
    () => {
      studentApplicationStore.fetchAssessmentMetricsOnInterview(interviewNumber)
    }
)

watch(
    () => applicationStore.StudentsOnInterviewResponse,
    async (data) => {
      if(data){
        // notificationStore.successToast("Success", data.message)
        interviewStudentList.value = data.data
      }
    },
    {deep:true}
)

watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
      }
    },
    {deep:true}
)

watch (
      () => applicationStore.interviewResultesponse,
      async (data) => {
        if(data){     
          gradeDialog.value = false
          applicationStore.fetchStudentsOnInterview(interviewNumber)

        }
      },
      {deep:true}
  )


  watch(
    () => studentApplicationStore.assessmentMetricsOnInterviewResponse,
    async (data) => {
      if(data){
        // notificationStore.successToast("Success", data.message)
        assessmentMetricsData.value = data.data
      }
    },
    {deep:true}
)
const showD = (student) => {
  studentNumber.value = student
  // alert(studentNumber.value)
  enterScoreDialog.value = true
  // endpoint ===========

}



watch (
    () => studentApplicationStore.interviewAssessmentResultResponse,
    async (data) => {
      if(data){
        enterScoreDialog.value = false
      }
    },
    {deep:true}
)

const viewMark = (student,a) => {
  studentNumber.value = student
  // alert(studentNumber.value)
  ScoreData.score = student
  // endpoint ===========for view assessment
  studentApplicationStore.fetchAssessmentByStudent(ScoreData.score,assessmentricsNumber)
}
watch (
    () => studentApplicationStore.assessmentByStudentResponse,
    async (data) => {
      if(data){
       
          scoreDataList.value = data.data
      
      
      }
    },
    {deep:true}
)

const form = reactive({
academic_year: null,
study_period_number: null,
campus_class_number: null,
campus_number: null,
stream_number:null,
school_number:null
})


  const selectedStudentNumber = computed(() => {
  const selectedNames = [];
  selectedStudents.value.forEach((isSelected, index) => {
    if (isSelected) {
      selectedNames.push(interviewStudentList.value[index].number);
    }
  });
  return selectedNames;
})
  




const Admit = () => {
  const selectedStudentsData = selectedStudents.value
    .map((isSelected, index) => {
      if (isSelected) {
        const student = interviewStudentList.value[index];
        return student.Student.number;
      }
      return null;
    })
    .filter(data => data !== null);


    if (selectedStudentsData.length === 0) {
  notificationStore.errorToast("Error", "Please select at least one student to admit.");
  return;
}

// const confirmMessage = `Are you sure you want to admit the selected students: ${selectedStudentsData.join(', ')}?`;
  const confirmMessage = `Are you sure you want to admit the selected students ?`;
  if (window.confirm(confirmMessage)) {
    const formData = {
      student_number: selectedStudentsData,
      campus_class_number: form.campus_class_number, 
      campus_number: form.campus_number, 
      stream_number: form.stream_number, 
      study_period_number: form.study_period_number, 
      interview_number: interviewNumber, 
      academic_year_number:form.academic_year,
      school_number:form.school_number,
    };
    alert(JSON.stringify(formData))
   //endpoint to submit
  //  admissionStore.admitStudent(formData)

  } else {
    // User clicked Cancel, do nothing
    // Optionally, you can clear the selected students array or perform other actions
  }

}


watch (
() => admissionStore.admitStudentResponse,
async (data) => {
  if(data){
    notificationStore.successToast("Success", data.message)
  }
},
{deep:true}
)

watch (
() => admissionStore.errorMessage,
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


const showDialog = () => {
  // admitshow.value = true
  if (selectedStudentNumber.value.length === 0) {
    admitshow.value=false
    notificationStore.errorToast("Error", "Please select at least one student to offer admission.");
  } else {
    admitshow.value = true;
  }
}


  </script>


  
  <style scoped>

  </style>
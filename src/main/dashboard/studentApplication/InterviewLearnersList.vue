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
import AppModal from "@/components/AppModal.vue";
import AdmitModel from "@/main/dashboard/studentApplication/AdmitModel.vue";

import { useAbility } from '@casl/vue';
const { can } = useAbility()
const assessmentDataList = ref([])


const myAdmitModal = ref(false)
const showAdmitModal = () =>{
  if (selectedStudentNumber.value.length === 0) {
    myAdmitModal.value = false
    notificationStore.errorToast("Error", "Please select at least one student to offer admission.");
  } else {
    myAdmitModal.value = true
  }

   }

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
let assessmentNumber = routerData.currentRoute.value.query.assessment_metric_id
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
      // applicationStore.fetchStudentsOnInterview(interviewNumber)
      studentApplicationStore.fetchAssessmentMetricsOnInterview(interviewNumber)
      schoolStore.fetchSchools()
    }
)
const assessN = ref(null)
const fetchStudentOnInterview = (assessmentMetricNumber,interviewN) =>{
  assessN.value = assessmentMetricNumber

   let data = {
      interview_number:interviewN,
      assessment_metric_number:assessmentMetricNumber
   }
      applicationStore.fetchStudentsOnInterview(data) 
      
  }

  const refreshStudentOnInterviewList = () => {
    let data = {
      interview_number:interviewNumber,
      assessment_metric_number:assessN.value
   }
      applicationStore.fetchStudentsOnInterview(data) 
  }



watch(
      () => studentApplicationStore.assessmentMetricsOnInterviewResponse,
      async (data) => {
        if(data){
          assessmentDataList.value = data.data
        }
      },
      {deep:true}
  )

watch(
    () => applicationStore.StudentsOnInterviewResponse,
    async (data) => {
      if(data){
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
          let data = {
           interview_number:interviewNumber
          }
          applicationStore.fetchStudentsOnInterview(data)

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
campus_class_number: "",
campus_number: "",
school_number:""
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
    myAdmitModal.value=false
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

watch(
  () => admissionStore.admitStudentResponse,
  async (data) => {
      if (data) {
        showAdmitModal.value = false
        refreshStudentOnInterviewList()
      }
  },
  {deep: true}
)

const removeStudentFromInterview = (id,name) => {
if(!confirm("Are you sure, you want to remove: " + name)){
  return
}else{
  let data = {
    interview_number:interviewNumber,
    student_number:id
  }
  assessmentStore.removeStudentFromInterview(data)
}
}

watch(
  () => assessmentStore.removeStudentFromInterviewResponse,
  async (data) => {
      if (data) {
        refreshStudentOnInterviewList()
        notificationStore.successToast("Success", data.message)
      }
  },
  {deep: true}
)

  </script>

<template>
  <div>

  <AppModal title="Admit" v-model="myAdmitModal" xl6>
      <AdmitModel :selectedStudentNumber="selectedStudentNumber"></AdmitModel>
</AppModal>


    <!-- end  -->
    <div class="row mt-1">
  <div class="mt-2">
      <div class="row">
        <div class="col-lg-12">
          <div class="">
            <div class="">    
      <div class="row">
    <div class="col-12">
      <div class="mt-2">
        <div class="row mx-auto">
       <div class="row">
        <label style="font-size: 11px;"  class="alert alert-primary p-0">* Please Select Assessment schedule to View Applicants</label>
       </div>
    
<div class="row mt-2">
        <div class="col-lg-4">
           <div class="mb-2">
      
            <div class="input-group mt-1">
          <select
                 style="box-shadow: none;"
                 class="form-select form-select-sm"  id="inputGroupSelect02" required
                 v-model="assessmentNumber"
                 @change="fetchStudentOnInterview(assessmentNumber,interviewNumber)"
                 >
                 <option disabled value=""> - Select Assessment schedule - </option>
                 <option v-for="(assessment, index) in assessmentDataList" :key="index" :value="assessment.AssessmentMetric.number">{{assessment.AssessmentMetric.name  }}</option>
              </select>

</div>
           </div>
        </div>
        <div class="col-3">
                <div class="mb-2">
          <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.school_number"
                  @change="fetchCampuses(form.school_number)"
          >
              <option disabled value="">--filter By School --</option>
              <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
              </option>
          </select>
      </div>
              </div>

              
              <div class="col-2">
      <div class="mb-2">
          <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="form.campus_number" required
                  @change="fetchClasses(form.campus_number)"
          >
              <option disabled value="">--filter by Campus --</option>
              <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
              </option>
          </select>
      </div></div>

      <div class="col-3">
        <div class="mb-2">
          <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.campus_class_number"
                  @change="fetchAcademicYear(form.campus_class_number)"
          >
              <option disabled value="">--Filter by class--</option>
              <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">{{ claslist.class_name }}
              </option>
          </select>
      </div>
      </div>
     </div>


</div>

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
    <!-- <p class="alert alert-danger p-1 text-[11px] mt-2" >Select a Student or Students to Offer Admission Please !</p>
    {{ interviewStudentList }} -->
    <table
      id="datatable"
      class="table table-hover caption-top mt-1 table-sm table-striped"
      style="font-size: 14px !important;"
    >
    <thead >
        <tr>
          <th style="width: 1px;">#</th>
          <th>Name</th>
          <th>status</th>
          <th>#</th>
        </tr>

      </thead>
      <tbody>
        <tr style="text-transform: capitalize;" v-for="(student, index) in interviewStudentList" :key="index">
          <td>
            <input v-if="student.status != 'ADMITTED'" type="checkbox"  v-model="selectedStudents[index]" class="checkbox-primary">
          </td>
          <td> 
            {{student.student_surname ? student.student_surname : ""}}
                 {{student.student_second_name ? " "+student.student_second_name : ""}}
                 {{student.student_other_name ? " "+student.student_other_name : ""}}</td>
        
          <td>
          <span style="color:green;font-style: italic;font-size: 13px;" v-if="student.status == 'ADMITTED'">
             
                <RouterLink :to="{name : 'admission-list' }" class="link-success"  style="text-decoration: none;">
                  {{ student.status }}
                </RouterLink>  
            </span>
          <span style="color:red;font-style: italic;font-size: 13px;" v-if="student.status == 'Active'">  {{ student.status }}</span>
          <span v-if="student.status == 'ENROLLED'">  {{ student.status }}</span>
             <span v-for="(listD, index) in scoreDataList " :key="index">
            <span>{{ listD.actual_score }}</span></span>
          </td>
          <td>
            <button type="button" @click="removeStudentFromInterview(student.number,student.student_second_name)"><i class="bi bi-trash" style="color: red;" ></i></button>
          </td>
        </tr>   
                  
      </tbody>
    </table>
  </div>
  <div class="col-lg-2">
<div class="ant-alert-action mt-3">
  <button @click="showAdmitModal"  v-if="can('admit_student','manage')" type="button"
    class="mb-2 btn btn-primary btn-sm ml-2 mr-2 " 
    style="float: rigt;" ><i></i>Offer Admission</button>

    <!-- <button @click="showDialog"  data-bs-toggle="modal" :data-bs-target="selectedStudentNumber.length > 0 ? '#admitMainModal' : ''" type="submit"
    class="mb-2 btn btn-primary btn-sm ml-2 mr-2 " 
    style="float: rigt;" ><i></i>Offer Admission</button> -->
</div>
  </div>
</div>


  
  </div>

  </div>


  </div>
  </template>
  
 
  <style scoped>

  </style>
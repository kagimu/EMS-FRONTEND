<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";
import InterviewAssessment from "@/main/dashboard/studentApplication/InterviewAssessment.vue";
import InterviewAssessmentMetricsList from "@/main/dashboard/studentApplication/InterviewAssessmentMetricsList.vue"
import {useStudentApplicationStore} from "@/main/dashboard/studentApplication/store/student_application.js";
import AppModal from "@/components/AppModal.vue";
import NewInterview from "@/main/dashboard/studentApplication/NewInterview.vue"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
import InterviewScoreOfferAdmission from "./InterviewScoreOfferAdmission.vue";

const dialog = ref(false)
const fullscreenMode = ref(false);
const notifications = ref(false)
const sound = ref(true)
const widgets = ref(false)
const interviewInfoData = ref([])
const admissionLearnerDetails = ref({})
const assessmentDataData = ref([])
const studentApplicationStore = useStudentApplicationStore()
const interviewStudentListInfo = ref( [])

const openModal = (interviewInfoD) => {
  dialog.value = true
  interviewInfoData.value = interviewInfoD

  admissionLearnerDetails.value = {
    school_number : school_number.value,
    campus_number:campus_number.value,
    level_number:form.level,
    curriculum_number:form.curriculumNumber,
    campus_class_number:form.campus_class_number,
  }
}

const levelStore = useLevelStore()
const campusList = ref([])
const schoolList = ref("")
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const showingModal = ref(false)
const interviewList = ref( [])
let errorMessage = ref(null)
const buttonLoader = ref(false)
const interviewNumber = ref(null)
const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()
const interviewAssessmentDialog = ref(false)
const assesssmentMetricsDialog = ref(false)
const thisDialog = ref(false)
const loading = ref(false)
const classList  = ref(null)
const interviewListData = ref([])
const editMode = ref(false)
const namee = ref(null)
const school_number = ref("")
const campus_number = ref("")
const curriculumList = ref([])
const levelList = ref([])
const classStore = useClassesStore()
const errM = ref(false)

const showModal = () => {
  interviewListData.value = ""
  editMode.value = false
    showingModal.value = true
    thisDialog.value=false
}

const form = reactive({
  campus_class_number:"",
  curriculumNumber:"",
  level:"",
  interview_number:"",
  assessment_number:""
})

onMounted(
    async () => {
     loading.value = true
    //  getInterviewList()
     await schoolStore.fetchSchools()
    } )


    const fetchCampuses = (school) => {
      campusStore.fetchCampuses(school)
  }

    const getInterviewList = () => {
     let data = {
      campus_class_number:form.campus_class_number
     }
     applicationStore.fetchInterviewList(data).finally(() => {
  
  })
     
    }


const showInterviewAssessmentDialog = (interview) =>{
  interviewNumber.value = interview.number
  interviewAssessmentDialog.value = true

}


const fetchClasses = (campus_number) => {
      campusStore.fetchClassesByCampus(campus_number)
      levelStore.fetchCampusCurriculum(campus_number)
  }

const formData = reactive({ 
name:null,
interview_date:null,
venue:null,
message:null,
assessment:[]
})


const fetchCampusLevel = (curriculumNumber) => {
   classStore.fetchCampusLevel(curriculumNumber)
}

const fetchLevelClasses = (levelNumber) => {
   classStore.fetchClassLevel({campusCurriculumNumber: form.curriculumNumber, campusLevelNumber: levelNumber})
}


  const showAssesssmentMetricsDialog = (interview) =>{
  interviewNumber.value = interview.number

}

const editThisData = (List) => {
  editMode.value = true
  interviewListData.value = List
  namee.value = List.name
  showingModal.value = true
}


  const deleteThisData = (interview) => {
  if(!confirm("Are you sure, you want to delete: " + interview.name)){
    return
  }else{
    let data = {
      interview_number:interview.interview_number
    }
applicationStore.deleteInterviewList(data)
  }
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
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        levelList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => applicationStore.interviewDeleteByIdResponse,
    async (data) => {
        if (data) {
            notificationStore.successToast("Success", data.message)
            getInterviewList()
        }
    },
    {deep: true}
)
    


watch(
          () => applicationStore.updateInterviewResponse,
          async (data) => {
              if (data) {
               buttonLoader.value = false
               showingModal.value = false
               getInterviewList()
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
      () => schoolStore.schoolsResponse,
      async (data) => {
          if (data) {
              schoolList.value = data.data
          }
      },
      {deep: true}
  )


    watch(
    () => applicationStore.interviewListResponse,
    async (data) => {
      if(data){
        assesssmentMetricsDialog.value = false
        interviewList.value = data.data
      }
    },
    {deep:true}
)

watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        buttonLoader.value = false
        assesssmentMetricsDialog.value = false
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)



watch(
          () => applicationStore.newInterviewResponse,
          async (data) => {
              if (data) {
                showingModal.value = false
              }
          },
          {deep: true}
      )


  watch(
    () => classStore.classLevelInfoResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    },
    {deep:true}
)

const toggleFullscreen = () => {
  if (!fullscreenMode.value) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Safari
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE11
      document.documentElement.msRequestFullscreen();
    }
    fullscreenMode.value = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE11
      document.msExitFullscreen();
    }
    fullscreenMode.value = false;
  }
};

// Watch fullscreen state change
document.addEventListener("fullscreenchange", () => {
  fullscreenMode.value = !!document.fullscreenElement;
})



const getAssessmentSchedule = (num) => {
    studentApplicationStore.fetchAssessmentMetricsOnInterview(num)
}



watch(
      () => studentApplicationStore.assessmentMetricsOnInterviewResponse,
      async (data) => {
        if(data){
          assessmentDataData.value = data.data
        }
      },
      {deep:true}
  )

  const max_score_mark = ref(null)

  const fetchStudentOnInterviewDetails = (assNumber) => {

   let data = reactive({
      interview_number:form.interview_number,
      assessment_metric_number:assNumber
   })
      applicationStore.fetchStudentsOnInterview(data) 

//find max-score from assessmentDataData by assNumber
    let maxScore = assessmentDataData.value.find(item => item.number === assNumber)?.max_score
    if(maxScore){
      max_score_mark.value = maxScore
    }else{
      max_score_mark.value = null
    }

  }




    
  watch(
      () => applicationStore.StudentsOnInterviewResponse,
      async (data) => {
        if(data){
         errM.value = false
          interviewStudentListInfo.value = data.data
        }
      }
  )

  const submitMarks = (a,b,c) =>{
      buttonLoader.value=true
      let formDat = reactive({
      assessment_metric_number:form.assessment_number,
      comment:b,
      student_number:c,
      assessment_date:null,
      actual_score:parseInt(a)
  })
  studentApplicationStore.newInterviewAssessmentResult(formDat)
  }


  watch (
      () => studentApplicationStore.interviewAssessmentResultResponse,
      async (data) => {
        if(data){
          buttonLoader.value = false
          notificationStore.successToast("Success", data.message)
        }
      },
      {deep:true}
  )

  watch(
      () => studentApplicationStore.errorMessage,
      async (data) => {
        if(data){
          buttonLoader.value = false
          errorMessage.value = data.message
        //   notificationStore.errorToast("Error",data.message)
        }
      }
      )

  </script>

<template>
  <div>

    <div class="modal fade" id="assesssmentMetricsModal" tabindex="-1"  aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-8 mt-2 mb-2">Assessment</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <interview-assessment-metrics-list :interviewNumber="interviewNumber"></interview-assessment-metrics-list>
          </div>
          </div>

        </div>
      </div>
    </div>
    
    
    <AppModal :title="editMode ? 'Edit ' + namee:'Create Interview'" v-model="showingModal" xl4>
      <NewInterview :interviewListData="interviewListData"></NewInterview>
    </AppModal>


    <div class="modal fade" id="interviewAssessmentModal" tabindex="-1"  aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Interview Assessment </h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <interview-assessment :interviewNumber="interviewNumber"></interview-assessment>
            </div>
          </div>

        </div>
      </div>
    </div>

  <div class="container mt-1">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Enter Interview Score


      <div class="row mt-4">
        <div class="col-3">    
         <div class="mb-2">
            <label class="text-sm"><small>School</small></label>
         <select
                 style="box-shadow: none;"
                 class="form-select form-select-sm" required
                 v-model="school_number"
                 @change="fetchCampuses(school_number)"
         >
             <option disabled value="">-filter School -</option>
             <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
             </option>
         </select>
     </div>
     </div>
      
      <div class="col-3"> 
      <div class="mb-2">
            <label class="text-sm"><small>Campus</small></label>
            <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="campus_number" required
              @change="fetchClasses(campus_number)">
              <option disabled value="">Select campus</option>
              <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}</option>
            </select>
        </div>  
        </div> 

        <div class="col-2">
                                            <div class="mb-2">
                                              <label class="text-sm"><small>Curriculum</small></label>
                                                <select
                                                style="box-shadow: none;"
                                                class="form-select form-select-sm"
                                                   v-model="form.curriculumNumber"  
                                                   @change="fetchCampusLevel(form.curriculumNumber)"                                         
                                                >
                                                   <option disabled value="" >--Select Curriculum--</option>
                                                   <option  v-for="(lvl, index) in curriculumList" :key="index" :value="lvl.number">{{lvl.name}}</option>
                                                </select>
                                             </div>
                                             </div> 

        <div class="col-2" >
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
            </div>


        <div class="col-2"> 
        <div class="mb-2">
            <label class="text-sm"><small>Class</small></label>

                <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.campus_class_number"
                  @change="getInterviewList(form.campus_class_number)"
                  >
                <option disabled value="">-filter by class-</option>
                <template v-for="(classItem, index) in classList" :key="index">
                <option v-for="(classDetail, indx) in classItem.classes" :key="indx" :value="classDetail.number">
                {{ classDetail.name }}
                </option>
                </template>
                </select>

          </div>
        </div>

        <div class="col-4"> 
        <div class="mb-2">
            <label class="text-sm"><small>Interview</small></label>

                <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.interview_number"
                  @change="getAssessmentSchedule(form.interview_number)"
                  >
                <option disabled value="">-filter by interviews-</option>
                <option v-for="(lst, indx) in interviewList" :key="indx" :value="lst.interview_number">
              {{ lst.name }}
                </option>
                </select>

          </div>
        </div>
        
        <div class="col-4"> 
        <div class="mb-2">
            <label class="text-sm"><small>Interview Assessment Schedule</small></label>
            <select
                 class="form-select form-select-sm shadow-none"  id="inputGroupSelect02" required
                 v-model="form.assessment_number"
                 @change="fetchStudentOnInterviewDetails(form.assessment_number)"
                 >
                 <option disabled value=""> - Select Assessment Schedule- </option>
                 <option v-for="(assessment, index) in assessmentDataData" :key="index" 
                 :value="assessment.number">
                 {{assessment.metric_name  }} - [{{ assessment.assessment_area }}] ({{ assessment.description }} [{{ assessment.scheduled_on }}])
                 Max-score{{ assessment.max_score }}
                </option>
              </select>

          </div>
        </div>

      </div>

   </h6>
 <div>
<!--    
  {{ assessmentDataData }} -->
    <table   id="data"
        class="table table-striped table-hover caption-top table-sm text-sm">
        <thead>
           <tr>
              <th>Name</th>
              <th scope="col">Score/ (<b>{{ max_score_mark }}</b>)</th>
              <th scope="col">Comment <span v-if="buttonLoader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-dark" role="status">
                 <span class="visually-hidden">Loading...</span>
                 </span></th>
                 <th></th>
           </tr>
        </thead>
        <tbody>
           <tr v-for="(std,index) in interviewStudentListInfo.students" :key="index" >
              <td style="text-transform: capitalize;">
                 {{std.student_surname +" " +std.student_second_name + " "+ std.student_other_name}}
              </td>
              <td scope="col" style="width: 150px;">
                 <input
                     v-if="std.status === 'Active'"
                     type="text"
                     class="form-control shadow-none"
                     v-model="std.score"
                     @keypress="commons.numbersOnlyValidator($event)"
                      maxlength="10"
                     v-on:blur="submitMarks(std.score, std.comment, std.number)">

                     <input
                     v-else
                     disabled="true"
                     type="text"
                     class="form-control shadow-none"
                     v-model="std.score"
                     @keypress="commons.numbersOnlyValidator($event)"
                      maxlength="3"
                     v-on:blur="submitMarks(std.score, std.comment, std.number)">
              </td>
              <td scope="col">
                 <textarea
                  v-if="std.status === 'Active'"
                    type="text"
                    v-model="std.comment"
                    v-on:blur="submitMarks(std.score, std.comment, std.number)"
                    required
                    class="form-control form-select-sm h-1 shadow-none"></textarea>

                    <textarea
                  v-else
                    type="text"
                    disabled
                    v-model="std.comment"
                    v-on:blur="submitMarks(std.score, std.comment, std.number)"
                    required
                    class="form-control form-select-sm h-1 shadow-none"></textarea>
              </td>
              <td>
                <span style="font-size: 11px;color:green;font-style: italic" v-if="std.status === 'Active'">Active</span>
                <span  style="font-size: 11px;color:cadetblue;font-style: italic" v-else > Admitted</span>
              </td>
           </tr>
        </tbody>
     </table>



  </div>
  </div>


  <div v-if="dialog" class="modal fade show" style="display: block;" tabindex="-1" role="dialog" >
      <div class="modal-dialog modal-fullscreen" role="document" >
        <div class="modal-content" style="">
          <div class="modal-header" style="height: 15px;border: 0px;">
            <span class="modal-title"></span>
            <button style="width: 90px;font-size: 12px" @click="toggleFullscreen" class="btn btn-secondary btn-sm mb-3 p-0">
      {{ fullscreenMode ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
    </button>
           
            <button class="btn btn-danger" type="button "   @click="dialog = false" 
            style="border: 1 solid red; border-radius: 8px;padding: 2px; font-weight: 600;">
            <span style="width: 60px;">&times;</span>close
            </button>
          </div>
         <InterviewScoreOfferAdmission :interviewInfo="interviewInfoData" :admissionLearnerDetails="admissionLearnerDetails"></InterviewScoreOfferAdmission>
        </div>
      </div>
    </div>

  </div>
  </template>
  

<style scoped>
  .td{
    text-transform: capitalize !important;
  }
  .modal {
  display: none;
}

.modal.show {
  display: block;
}

.modal-dialog {
  margin-top: 5rem; /* Adjust this value as needed for more spacing from the top */
}
</style>
 
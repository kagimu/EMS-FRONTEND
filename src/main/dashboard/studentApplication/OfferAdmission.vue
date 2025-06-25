<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useStudentApplicationStore} from "@/main/dashboard/studentApplication/store/student_application.js";
import AppModal from "@/components/AppModal.vue";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
import AdmitModel from "@/main/dashboard/studentApplication/AdmitModel.vue";
import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";


import { useAbility } from '@casl/vue';
import AdmissionForm from "../studentAdmission/AdmissionForm.vue";

const { can } = useAbility();

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
const myAdmitModal = ref(false);
const admissionStore = useAdmissionStore()

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
const selectedStudentNumber = ref([])
const openAdmissionLetterModel = ref(false)
const schoolData = ref([])
const studentDataInfo = ref([])


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
      schoolStore.fetchSchools()

let defaultSchoolNo =   localStorage.getItem("defaultSchoolNo")
  let defaultCampusNo =   localStorage.getItem("defaultCampusNo")
  let defaultCampusCurriculumNo =   localStorage.getItem("defaultCampusCurriculumNo")

  if(defaultSchoolNo){
    school_number.value = defaultSchoolNo
    fetchCampuses(school_number.value)
    schoolStore.fetchSchoolData(school_number.value)
  }

  
  if(defaultCampusNo){
    campus_number.value = defaultCampusNo
    fetchClasses(campus_number.value)
  }

  if(defaultCampusCurriculumNo){
    form.curriculumNumber = defaultCampusCurriculumNo
    fetchCampusLevel(form.curriculumNumber)
  }
    } )


    const fetchCampuses = (school) => {
      campusStore.fetchCampuses(school)
      schoolStore.fetchSchoolData(school)
  }

  const className = ref(null)
    const getInterviewList = () => {
     let data = {
      campus_class_number:form.campus_class_number
     }
     applicationStore.fetchInterviewList(data).finally(() => {
  })

      let cls = classList.value.flatMap(grade => grade.classes).find(c => c.number === form.campus_class_number)
      className.value = cls.name

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


  const fetchStudentOnInterviewDetails = (assNumber) => {
   let data = reactive({
      interview_number:form.interview_number,
      // assessment_metric_number:assNumber
   })
      applicationStore.fetchStudentsOnInterview(data) 
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

const openAdmitModal = (studentNumber) => {
  
  admissionLearnerDetails.value = {
    school_number : school_number.value,
    campus_number:campus_number.value,
    level_number:form.level,
    curriculum_number:form.curriculumNumber,
    campus_class_number:form.campus_class_number,
    interview_number:form.interview_number
  }
  
  selectedStudentNumber.value = [studentNumber];
  myAdmitModal.value = true 
};


const showAdmitModal = () => {

  admissionLearnerDetails.value = {
    school_number : school_number.value,
    campus_number:campus_number.value,
    level_number:form.level,
    curriculum_number:form.curriculumNumber,
    campus_class_number:form.campus_class_number,
    interview_number:form.interview_number
  }


  if (selectedStudentNumber.value.length === 0) {
    myAdmitModal.value = false
    dialog.value = false
    notificationStore.errorToast("Error", "Please select at least one student to offer admission.");
  } else {
    dialog.value = true;
    myAdmitModal.value = true;
  }
}

watch (
    () => admissionStore.admitStudentResponse,
    async (data) => {
      if(data){
        // dialog.value = false
        fetchStudentOnInterviewDetails()
        myAdmitModal.value = false
         selectedStudentNumber.value = []
        notificationStore.successToast("Success", data.message)
      }
    }
  )

  const closeDialog = () => {
      myAdmitModal.value = false
}


const openAdmissionLetter = (list,std) => {
  openAdmissionLetterModel.value = true
  studentDataInfo.value = std
}


watch (
    () => schoolStore.schoolInfoResponse,
    async (data) => {
      if(data){
        schoolData.value = data.data
      }
    },
    {deep:true}
)

  </script>

<template>
  <div>


    <AppModal title="Admission Letter" v-model="openAdmissionLetterModel" xl4 class="app-modal">
      <AdmissionForm :schoolData="schoolData" :studentDataInfo="studentDataInfo"></AdmissionForm>
    </AppModal>


    <AppModal title="Admit" v-model="myAdmitModal" xl6 class="app-modal">
      <!-- <AdmitModel :selectedStudentNumber="selectedStudentNumber" class="app-modal"></AdmitModel> -->
      <AdmitModel :selectedStudentNumber="selectedStudentNumber" 
      :interviewInfo="form.interview_number" :admissionDetails="admissionLearnerDetails"  class="app-modal" @closeDialog="closeDialog"></AdmitModel>
    </AppModal>


  <div class="container mt-1">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;" >Offer Admission
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
                  @change="fetchStudentOnInterviewDetails(form.interview_number)"
                  >
                <option disabled value="">-filter by interviews-</option>
                <option v-for="(lst, indx) in interviewList" :key="indx" :value="lst.interview_number">
              {{ lst.name }}
                </option>
                </select>
          </div>
        </div>
        
        <!-- <div class="col-4"> 
        <div class="mb-2">
            <label class="text-sm"><small>Interview Assessment Schedule</small></label>
            <select
                 class="form-select form-select-sm shadow-none"  id="inputGroupSelect02" required
                 v-model="form.assessment_number"
                 @change="fetchStudentOnInterviewDetails(form.assessment_number)"
                 >
                 <option disabled value=""> - Select Assessment Schedule- </option>
                 <option v-for="(assessment, index) in assessmentDataData" :key="index" :value="assessment.number">{{assessment.metric_name  }} - [{{ assessment.assessment_area }}] ({{ assessment.description }} [{{ assessment.scheduled_on }}])</option>
              </select>
          </div>
        </div> -->

      </div>
   </h6>
 <div>
   

  <div class="row">
          <div class="col-lg-12">

            <div v-if="selectedStudentNumber.length > 1">
            <button
                @click="showAdmitModal"
                v-if="can('admit_student', 'manage')"
                class="btn btn-primary btn-sm ml-1 mr-4 mt-2 text-xs p-1"
                style="float: right;"
              >
               Offer Admission<i class="bi bi-box-arrow-in-right mr-1"></i>
              </button>
              </div>

            <table
              id="datatable"
              class="table table-hover caption-top mt-1 table-sm table-striped text-sm"
            >
              <thead>
                <tr>
                  <th style="width: 1px;">#</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Scores</th>
                  <th>Status</th>
                  <th style="width: 20%" >#</th>
                </tr>
              </thead>
              <tbody>
                <tr style="text-transform: capitalize;" v-for="(student, index) in interviewStudentListInfo.students" :key="index">
                  <td>
                    <input
                      v-if="student.status !== 'ADMITTED'"
                      v-model="selectedStudentNumber"
                      class="form-check-input me-1 shadow-none form-control"
                      type="checkbox"
                      :value="student.number"
                      :id="student.number"
                      style="outline: none 0 !important; box-shadow: none;width: 20px;height: 20px;"
                    />
                  </td>

                  <td>
                    {{ student.adn ? student.adn : student.apn }}
                    {{ student.student_surname ? student.student_surname : "" }}
                    {{ student.student_second_name ? " " + student.student_second_name : "" }}
                    {{ student.student_other_name ? " " + student.student_other_name : "" }}
                  </td>

                  <td>
                    {{className}}
                  </td>
                  <td>
                    <table
                      class="table table-hover caption-top mt-1 table-sm table-striped table-bordered"
                      style="font-size: 14px !important;"
                    >
                      <thead>
                        <tr>
                          <th>Assessment</th>
                          <th>Score</th>
                          <th>Actual Score</th>
                          <th>Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(listD, idx) in student.Assessments" :key="idx">
                          <td>{{ listD.assessment_area_name }}</td>
                          <td>{{ listD.score }}</td>
                          <td>{{ listD.actual_score }}</td>
                          <td>{{ listD.comment }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td>
                    <span style="color:green;font-style: italic;font-size: 13px;" v-if="student.status === 'ADMITTED'">
                      <RouterLink :to="{ name: 'admission-list' }" class="link-success" style="text-decoration: none;">
                        {{ student.status }}
                      </RouterLink>
                    </span>
                    <span style="color:red;font-style: italic;font-size: 13px;" v-if="student.status === 'Active'">
                      {{ student.status }}
                    </span>
                    <span v-if="student.status === 'ENROLLED'">
                      {{ student.status }}
                    </span>
                    <span v-for="(listD, index) in scoreDataList" :key="index">
                      <span>{{ listD.actual_score }}</span>
                    </span>
                  </td>

                  <td>
                    <!-- <button type="button" @click="removeStudentFromInterview(student.number, student.student_second_name)">
                      <i class="bi bi-trash" style="color: red;"></i>
                    </button> -->
                    <button v-if="student.status !== 'ADMITTED'" class="btn btn-outline-primary btn-sm"
                     @click="openAdmitModal(student.number)">Admit   <i class="bi bi-box-arrow-in-right mr-1"></i></button>

                    <button   v-if="student.status === 'ADMITTED'" @click="openAdmissionLetter(listD,student)"
                             class="btn btn-outline-primary mb-2 btn-sm"> <small>Admission Letter <i class="bi bi-box-arrow-in-right mr-1"></i>
                    </small></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
    
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
 
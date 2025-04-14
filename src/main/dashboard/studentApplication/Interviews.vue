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
const campus_number = ref("")

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

const closeDialog = () => {
    showingModal.value = false
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
// const campus_number = ref("")
const curriculumList = ref([])
const levelList = ref([])
const classStore = useClassesStore()

const showModal = () => {
  interviewListData.value = ""
  editMode.value = false
    showingModal.value = true
    thisDialog.value=false
}

const form = reactive({
  campus_class_number:"",
  curriculumNumber:"",
  level:""
})

onMounted(
    async () => {
     loading.value = true
    
      schoolStore.fetchSchools()
      getInterviewList()


  let defaultSchoolNo =   localStorage.getItem("defaultSchoolNo")
  let defaultCampusNo =   localStorage.getItem("defaultCampusNo")
  let defaultCampusCurriculumNo =   localStorage.getItem("defaultCampusCurriculumNo")

  if(defaultSchoolNo){
    school_number.value = defaultSchoolNo
    fetchCampuses(school_number.value)
  }

  
  if(defaultCampusNo){
    campus_number.value = defaultCampusNo
    fetchClasses(campus_number.value)
  }

  if(defaultCampusCurriculumNo){
    form.curriculumNumber = defaultCampusCurriculumNo
    fetchCampusLevel(form.curriculumNumber)
  }

  getInterviewList()
    } )


    const fetchCampuses = (school) => {
      campusStore.fetchCampuses(school)
  }

    const getInterviewList = () => {
     let data = {
      campus_class_number:form.campus_class_number
     }
     applicationStore.fetchInterviewList(data).finally(() => {
    loading.value = false; 
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
  
  interviewListData.value = {
    school_number : school_number.value,
    campus_number:campus_number.value,
    level_number:form.level,
    curriculum_number:form.curriculumNumber,
    campus_class_number:form.campus_class_number,
    interview_number:List.interview_number
  }
  
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
        assesssmentMetricsDialog.value = false
        errorMessage.value = data.message
        buttonLoader.value = false
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
});
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
      <NewInterview :interviewListData="interviewListData" @closeDialog="closeDialog"></NewInterview>
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
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Interview List

      <button style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
      @click="showModal">
      <i class="bi bi-plus"></i>&nbsp;<small>Create An Interview</small>
      </button>

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
        

      </div>

   </h6>
      <div v-if="loading" class="text-center my-4">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
        </div>

      <div v-else-if="interviewList.length === 0" class="text-center my-4">
                <span class="text-[12px] alert alert-success p-1" ><i>select  Class to view Interview List</i></span>
       </div>

 <div v-else>
    <table 
       class="table table-hover caption-top mt-4 table-sm table-striped"
      style="font-size: 13px !important;width: 100%;"
    >
      <thead>
        <tr>
          <th  class="w-[2%]">#</th>
          <th  class="w-[18%]">Name</th>
          <th  class="w-[10%]">ScheduledOn</th>
          <th  class="w-[10%]">Venue</th>
          <th class="w-[35%]">Comment</th>
          <th class="w-[5%]">Actions</th>
        </tr>

      </thead>
      <tbody>
        <tr v-for="(interview, index) in interviewList" :key="index">
          <td>{{ index+1 }}</td>
          <td>{{ interview.name}}</td>
          <td>{{ interview.interview_date }}</td>
          <td>{{ interview.venue }}</td>
          <td>{{ interview.message }}</td>
          <td>
            <div class="flex justify-content-between">
              <!-- <button class="mr-1 link-primary" @click="openModal(interview)">
                <i class="bi bi-box-arrow-in-right mr-1"></i> Manage Applicants
              </button> -->

            <button @click="editThisData(interview)"  class="link-primary" style="border-width: 0px;text-decoration: none;"><small>
              <i  style="font-size: 13px;color:rgb(5, 32, 171)" class="bi-pencil mr-2 cursor-pointer"></i></small>
            </button>
              <button class="mr-1" @click="deleteThisData(interview)">
                <i style="font-size: 13px;color:rgb(202, 11, 11)" class="bi-trash cursor-pointer"></i>
              </button>
            </div>

            <div>
          
            </div>


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
 
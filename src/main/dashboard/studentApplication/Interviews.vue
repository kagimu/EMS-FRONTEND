<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";
import NewSchool from "@/main/dashboard/manageSchool/NewSchool.vue";
import InterviewAssessment from "@/main/dashboard/studentApplication/InterviewAssessment.vue";
import InterviewAssessmentMetricsList from "@/main/dashboard/studentApplication/InterviewAssessmentMetricsList.vue"
import {useStudentApplicationStore} from "@/main/dashboard/studentApplication/store/student_application.js";
import AppModal from "@/components/AppModal.vue";
import NewInterview from "@/main/dashboard/studentApplication/NewInterview.vue"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";

const campusList = ref([])
const schoolList = ref("")
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const showingModal = ref(false)
const interviewList = ref( [])
let errorMessage = ref(null)

const buttonLoader = ref(false)
const interviewNumber = ref(null)
const studentApplicationStore = useStudentApplicationStore()
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
     getInterviewList()
     schoolStore.fetchSchools()
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
  }

const formData = reactive({ 
name:null,
interview_date:null,
venue:null,
message:null,
assessment:[]
})


const createInterview = () => {
// alert(JSON.stringify(formData))
applicationStore.createNewInterview(formData)
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
        // notificationStore.errorToast("Error",data.message)
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
      () => campusStore.campusClassesResponse,
      async (data) => {
          if (data) {
              classList.value = data.data
          }
      },
      {deep: true}
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
              <!-- <interview-assessment :interviewNumber="interviewNumber"></interview-assessment> -->
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
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Interview List

      <button style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
      @click="showModal" >
      <i class="bi bi-plus"></i>&nbsp;<small>Create An Interview</small>
      </button>

      <div class="row mt-4">
        <div class="col-4">    
         <div class="mb-2">
            <label class="textSize"><small>School</small></label>
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
      
      <div class="col-4"> 
      <div class="mb-2">
            <label class="textSize"><small>Campus</small></label>
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

        <div class="col-4">
                                            <div class="mb-2">
                                              <label class="textSize"><small>Curriculum</small></label>
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

                                             
                                            <div class="col-4" >
                                                <div class="mb-2">
                                                  <label class="textSize"><small>Level</small></label>
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


        <div class="col-4"> 
        <div class="mb-2">
            <label class="textSize"><small>Class</small></label>
            <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="form.campus_class_number"
              @change="getInterviewList(form.campus_class_number)"
            >
              <option disabled value="">Select class</option>
              <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">{{ claslist.class_name }}</option>
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
                <p>There is no data found</p>
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
          <th class="w-[25%]">Actions</th>
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
            <button @click="editThisData(interview)"  class="link-primary" style="border-width: 0px;text-decoration: none;"><small>
              <i  style="font-size: 13px;color:rgb(5, 32, 171)" class="bi-pencil mr-2 cursor-pointer"></i></small>
            </button>
              <button class="mr-1" @click="deleteThisData(interview)">
                <i style="font-size: 13px;color:rgb(202, 11, 11)" class="bi-trash cursor-pointer"></i>
              </button>

              <router-link style="display:non"
                  class="text-decoration-none"
                  :to="{name:'manage-interviews', query:{interview_id:interview.interview_number, interview:interview.name}}">
                <button class="text-[#0d6efd] border border-primary p-1 rounded-sm hover:bg-[#0d6efd] hover:text-white">
                <small>Enter interview scores</small>
                </button>
              </router-link>
            </div>

            <div>
          
            </div>


            </td>
        </tr>        
        
      </tbody>
    </table>
  </div>

  </div>

  

  </div>
  </template>
  

<style scoped>
  .td{
    text-transform: capitalize !important;
  }
</style>
 
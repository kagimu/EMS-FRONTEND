<script setup>
    import {onMounted,reactive, ref, watch} from "vue";
    import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
    import useNotificationStore from "@/composables/useNotification.js";
    import NewSchool from "@/main/dashboard/manageSchool/NewSchool.vue";
    import InterviewAssessment from "@/main/dashboard/studentApplication/InterviewAssessment.vue";
    import InterviewAssessmentMetricsList from "@/main/dashboard/studentApplication/InterviewAssessmentMetricsList.vue"
    import {useStudentApplicationStore} from "@/main/dashboard/studentApplication/store/student_application.js";
    import AppModal from "@/components/AppModal.vue";
    import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
    import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
    import { useAssessmentStore } from "@/main/dashboard/assessment/store/assessment.js";
    
    const showingModal = ref(false)
    const interviewList = ref( [])
    let errorMessage = ref(null)
    const assessmentStore = useAssessmentStore()
    const assessmentMetricList = ref([])
    const buttonLoader = ref(false)
    const interviewNumber = ref(null)
    const studentApplicationStore = useStudentApplicationStore()
    const applicationStore= useApplicationStore()
    const  notificationStore  = useNotificationStore()
    const interviewAssessmentDialog = ref(false)
    const assesssmentMetricsDialog = ref(false)
    const thisDialog = ref(false)
    const campusList = ref([])
   const schoolList = ref([])
   const schoolStore = useSchoolStore()
   const campusStore = useCampusStore()
   const school_number = ref(null)
   const classList  = ref(null)
   const campus_number = ref(null)

    const sectionPart = reactive([{ assessment_metric_number: ""}]);
    
    const showModal = () => {
        showingModal.value = true
        thisDialog.value=false
    }

    const formData = reactive({
      name:null,
      interview_date:null,
      venue:null,
      message:null,
      campus_class_number:null,
      assessment_metrics:[]
    })

    onMounted(
        async () => {
          // await applicationStore.fetchInterviewList()
          schoolStore.fetchSchools()
          getInterviewDetails()
        } )
    
const props = defineProps({
  interviewListData:{}
})


const getInterviewDetails = () =>{
  if(props.interviewListData.interview_number){
    let data = {
      interview_number : props.interviewListData.interview_number,
      campus_class_number:props.interviewListData.campus_class_number
    }
    applicationStore.fetchInterviewListById(data)
  }
}
  


    const fetchCampuses = (school) => {
      campusStore.fetchCampuses(school)
  }

    const createInterview = () => {
      if(props.interviewListData.interview_number){
        formData.interview_number = props.interviewListData.interview_number
        // alert(JSON.stringify(formData))
       applicationStore.updateInterview(formData)
      }else{
        applicationStore.createNewInterview(formData)
      }
      
    }

  const doFetchAssessmentMetrics = (campus_class_number) => {
    assessmentStore.fetchAssessmentMetrics({campus_class_number:campus_class_number})
  }


  const fetchClasses = (campus_number) => {
      campusStore.fetchClassesByCampus(campus_number)
  }

const checked = ref(false)
  watch(
        () => applicationStore.interviewListByIdResponse,
        async (data) => {
          if(data){
         formData.name = data.data.name
         formData.interview_date=data.data.interview_date
         formData.message = data.data.message
         formData.venue = data.data.venue
        school_number.value = data.data.school_number
        campus_number.value = data.data.campus_number
        
        if(school_number){
          campusStore.fetchCampuses(data.data.school_number)
          campus_number.value =data.data.campus_number
        }
        if(campus_number){
          campusStore.fetchClassesByCampus(data.data.campus_number)
          formData.campus_class_number = data.data.campus_class_number
          // assessmentMetricList.value = data.data.assessment_schedules
          assessmentStore.fetchAssessmentMetrics({campus_class_number:data.data.campus_class_number})
        }

          }
        }
    )


  watch(
      () => props.interviewListData,
      async (data) => {
          if (data) {
             getInterviewDetails()
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
        }
    )
    
    watch (
        () => applicationStore.errorMessage,
        async (data) => {
          if(data){
            assesssmentMetricsDialog.value = false
            errorMessage.value = data.message
            buttonLoader.value = false
            notificationStore.errorToast("Error",data.message)
          }
        },
        {deep:true}
    )
    
    const showInterviewAssessmentDialog = (interview) =>{
      interviewNumber.value = interview.number
      interviewAssessmentDialog.value = true
    
    }
    

    
    watch(
          () => applicationStore.newInterviewResponse,
          async (data) => {
              if (data) {
                  buttonLoader.value = false
                  assesssmentMetricsDialog.value = false
                  notificationStore.successToast("Success", data.message)
                  await applicationStore.fetchInterviewList()
    
              }
          },
          {deep: true}
      )

      watch(
          () => applicationStore.updateInterviewResponse,
          async (data) => {
              if (data) {
                  buttonLoader.value = false
                  assesssmentMetricsDialog.value = false
                  notificationStore.successToast("Success", data.message)
              }
          },
          {deep: true}
      )
    
    const showAssesssmentMetricsDialog = (interview) =>{
      interviewNumber.value = interview.number
    
    } 
    
    


const newSectionPart = () => {
    sectionPart.push({ assessment_metric_number: null})
}

function removeSectionPart(index) {
  sectionPart.splice(index, 1);
}


watch (
    () => assessmentStore.assessmentMetricsResponse,
    async (data) => {
      if(data && data.data){
        assessmentMetricList.value = data.data
      }
    },
    {deep:true}
)
 </script>

<template>
    <div>
       <form @submit.prevent="createInterview">

  <div class="row">
    <div class="col-lg-6">      
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

         
        <div class="mb-2">
            <label class="textSize"><small>Class</small></label>
            <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="formData.campus_class_number"
              @change="doFetchAssessmentMetrics(formData.campus_class_number)"
            >
              <option disabled value="">Select class</option>
              <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">{{ claslist.class_name }}</option>
            </select>
          </div>

          <div class="mb-2">
             <label class="textColor"><small>Title</small></label>
             <input v-model="formData.name" type="text" required class="form-control">
          </div>
          <div class="mb-2">
             <label class="textColor"><small>Interview Date</small></label>
             <input v-model="formData.interview_date"  type="date" required class="form-control">
          </div>
          <div class="mb-2">
             <label class="textColor"><small>Venue</small></label>
             <input v-model="formData.venue"  type="text" required class="form-control" >
          </div>
          <div class="mb-2">
             <label class="textColor"><small>Description</small></label>
             <textarea v-model="formData.message"  required class="form-control noFocus" id="floatingTextarea2" style="height: 100px"></textarea>
          </div>
    </div>

    <div class="col-lg-6">
      <div class="mb-2">
<!-- {{ formData.assessment_metrics }} -->

        <div class="mb-2">
          <label class="textColor mt-3 mb-2" v-if="assessmentMetricList.length > 0">Select Assessment Schedule</label>
          <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;" v-if="assessmentMetricList.length > 0">
            <li class="list-group-item" v-for="(lvl,idx) in assessmentMetricList">
              <input
                  v-model="formData.assessment_metrics"
                  class="form-check-input me-1 shadow-none" type="checkbox" :value="lvl.number" :id="idx">
              <label class="form-check-label cursor-pointer" :for="idx">{{lvl.metric_name}} ({{ lvl.description }})</label>
            </li>

          </ul>
        </div>

      </div>

    </div>

</div>


          <div class="text-right mt-4">
             <button style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog">
                <i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
                <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
                   <span class="visually-hidden">Loading...</span>
                </div>
             </button>
          </div>
       </form>
    </div>
 </template>
 
 <style scoped>
 .textColor{
  font-size: 13px !important;
 }
 </style>
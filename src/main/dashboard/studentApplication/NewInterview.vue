<template>
    <div>
       <form @submit.prevent="createInterview">
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
              v-model="formData.campus_class_number">
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
    const campusList = ref([])
   const schoolList = ref([])
   const schoolStore = useSchoolStore()
   const campusStore = useCampusStore()
   const school_number = ref(null)
   const classList  = ref(null)
   const campus_number = ref(null)
    
    const showModal = () => {
        showingModal.value = true
        thisDialog.value=false
    }
    
    
    onMounted(
        async () => {
          await applicationStore.fetchInterviewList()
          schoolStore.fetchSchools()
        } )


        const fetchCampuses = (school) => {
      campusStore.fetchCampuses(school)
  }

  const fetchClasses = (campus_number) => {
      campusStore.fetchClassesByCampus(campus_number)
  }

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
            notificationStore.errorToast("Error",data.message)
          }
        },
        {deep:true}
    )
    
    const showInterviewAssessmentDialog = (interview) =>{
      interviewNumber.value = interview.number
      interviewAssessmentDialog.value = true
    
    }
    
    
    
    const formData = reactive({ 
    name:null,
    interview_date:null,
    venue:null,
    message:null,
    campus_class_number:null
    })
    
    
    const createInterview = () => {
    // alert(JSON.stringify(formData))
    applicationStore.createNewInterview(formData)
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
    
      const showAssesssmentMetricsDialog = (interview) =>{
      interviewNumber.value = interview.number
    
    }  
 </script>
 <style scoped>
 </style>
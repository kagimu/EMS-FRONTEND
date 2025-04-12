<script setup>
  import {onMounted, reactive, ref, watch, watchEffect, computed } from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
  import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
  import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
  import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
  import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
  import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
  import {useLevelStore} from "@/main/settings/level/store/level.js";
  import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
  

  const levelList = ref([])
  const levelStore = useLevelStore()
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
  const academicYearStore = useAcademicYearStore()
  const academicYearList = ref([])
  const studyPeriodList  = ref([])
  const admissionStore = useAdmissionStore()
  const classStore = useClassesStore()
  const streamList = ref([])
  const curriculumList = ref([])
  const studyPeriodStore = useStudyPeriodStore()
  const campusClassNumber = ref(null)
  const studentInfoList = ref( [])
  const applicationStore= useApplicationStore()

  
  const studentNumber = "";
  const interviewNumber = ref(null);
  const student_number = ref([])
  const interviewList = ref( [])
  
    const emit = defineEmits(["closeDialog"]);
    onMounted( async () => {
    schoolStore.fetchSchools()  
      }
  )

 
  
  const form = reactive({
  student_number,
  academic_year_number: null,
  study_period_number: null,
  campus_class_number: null,
  campus_number: null,
  stream_number:null,
  school_number:null,
  curriculumNumber:null,
  level:null
  })
  


   
const getCampusN = (streamN) => {
let data = streamList.value

let no = streamN
campusClassNumber.value = data.find(item => item.stream_number === no)?.campus_class_number;
// alert(streamN)
  }


  watch (
    () => admissionStore.admitStudentResponse,
    async (data) => {
      if(data){
      form.academic_year_number=null,
      form.study_period_number=null,
      form.campus_class_number=null,
      form.campus_number- null,
      form.stream_number=null,
      form.school_number=null
      buttonLoader.value=false
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
      levelStore.fetchCampusCurriculum(campus_number)
  }
  


  const fetchStudyPeriodData = (clasN) => {

    let sData = {
     campus_number:form.campus_number,
     class_number:clasN,
     campus_curriculum_number:form.curriculumNumber,
    }
    classStore.fetchClassStreams(sData)


    studyPeriodStore.fetchStudyPeriod(
      {
        academic_year_number:form.academic_year_number,
        class_number:clasN,
        school_number:form.school_number
      } 
  )
  getInterviewList(clasN)
  }

  const getInterviewList = (clasN) => {
     let data = {
      campus_class_number:clasN
     }
     applicationStore.fetchInterviewList(data).finally(() => {
  
  })
     
    }

  
  const fetchCampusLevel = (curriculumNumber) => {
   classStore.fetchCampusLevel(curriculumNumber)
}

const fetchLevelClasses = (levelNumber) => {
  academicYearStore.fetchAcademicYearByLevel(levelNumber)
  let data = {
    school_number:form.school_number,
    campus_level_number:levelNumber
  }
  campusStore.fetchClassesBySchool(data)

  classStore.fetchClassLevel({campusCurriculumNumber: form.curriculumNumber, campusLevelNumber: levelNumber})
}



watch(
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    }
)



watch(
    () => academicYearStore.academicYearByLevelResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
      }
    }
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
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
      }
    },
    {deep:true}
)

  
  watch(
    () => studyPeriodStore.studyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    }
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
      () => campusStore.errorMessage,
      async (data) => {
            if (data) {
                notificationStore.errorToast("Error", data.message)
            }
      },
      {deep: true}
  )
  
  
     watch(
      () => applicationStore.applicationListResponse,
      async (data) => {
        if(data){
          studentInfoList.value = data.data
         
        }
      },
      {deep:true}
      )
 
  
  const Admit = () =>{
    buttonLoader.value = true
    admissionStore.admitStudent(data)
  }
  
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

  
</script>

<template>
  <div class="m-4">
    <form @submit.prevent="Admit()">
      <div class="row">
        <div class="col-lg-12">
          <p class="alert alert-primary p-1" style="" ><small>Please ,Choose a class Your admiting this Student !</small> </p>
          <div class="mb-2">
            <label class="text-sm"><small>School</small></label>
            <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="form.school_number"
              @change="fetchCampuses(form.school_number)">
              <option disabled value="">Select School</option>
              <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}</option>
            </select>
          </div>
    
   
          <div class="mb-2">
            <label class="text-sm"><small>Campus</small></label>
            <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="form.campus_number" required
              @change="fetchClasses(form.campus_number)">
              <option disabled value="">Select campus</option>
              <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}</option>
            </select>
          </div>
        
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

          <div class="mb-2">
            <label class="text-sm"><small>Academic Year</small></label>
            <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="form.academic_year_number">
              <option disabled value="">Select Year</option>
              <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
            </select>
          </div>


          <div class="mb-2">
            <label class="text-sm"><small>Class</small></label>
     
                <select
                class="form-select form-select-sm shadow-none" required
                v-model="class_number"
                @change="fetchStudyPeriodData(class_number)"
                >
              <option disabled :value=null>--Select Class--</option>
              <option v-for="(list, index) in classList" :key="index" :value="list.number">{{list?.name+" [ "+list?.abbreviation+" ]"}}</option>
            </select>


          </div>
  
          <div class="mb-2">
            <label class="text-sm"><small>Stream</small></label>

            <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="form.stream_number"
             @change="getCampusN(form.stream_number)"
              >
              <option disabled value="">Select Stream</option>
              <option v-for="(slist, index) in streamList" :key="index" :value="slist.stream_number">{{ slist.name }}</option>
            </select>
            
          </div>
     

         
        

      
          <div class="mb-2">
            <label class="text-sm"><small>Study Period</small></label>
            <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="form.study_period_number">
              <option disabled value="">Select</option>
              <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>
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
                  >
                <option disabled value="">-filter by interviews-</option>
                <option v-for="(lst, indx) in interviewList" :key="indx" :value="lst.interview_number">
              {{ lst.name }}
                </option>
                </select>

          </div>
        </div>

      </div>
      <hr style="color: whitesmoke;">
      <div class="flex justify-between mt-3" style="width: 100%;box-shadow: 1cap;">
        <button
            type="button"
            class="btn btn-danger border-0 mr-2"
            @click="$emit('closeDialog')">
          Cancel
        </button>

        <button type="submit" class="btn btn-primary border-0 mb-2">
          <b>Admit &nbsp;<i class="bi bi-box-arrow-in-right mr-1"></i></b>
          <span style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span></span>
        </button>
      </div>
    </form>
  </div>
</template>
<style scoped>
  .noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  }


.app-modal {
  z-index: 10910; /* Higher than Bootstrap's 1050 */
}


</style>
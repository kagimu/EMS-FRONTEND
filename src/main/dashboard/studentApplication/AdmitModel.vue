<template>
    <div>
  
      <div class="col-12 mt-2" >
          
        <form @submit.prevent="addInterviewAssesmentMetrics">
            <div class="mb-2">
                <label class="textColor"><small>School</small> <span class="star">*</span></label>
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm" required
                        v-model="school_number"
                        @change="fetchCampuses(school_number)"
                >
                    <option disabled value="">Select School</option>
                    <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                    </option>
                </select>
            </div>


            <div class="mb-2">
                <label class="textColor"><small>Campus</small>  <span class="star">*</span></label>
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm" required
                        v-model="campus_number"
                        @change="fetchLevel(campus_number)"
                >
                    <option disabled value="">Select Campus</option>
                    <option v-for="(lvl,idx) in campusList" :key="idx" :value="lvl.number">{{lvl.numb}}
                    </option>
                </select>
            </div>
               
    <div class="mb-2">
        <label class="textColor"><small>Level</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="campus_level_number"
            @change="fetchCurriculumClass(campus_level_number)"
        >
          <option disabled value="">Select Level</option>
          <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>


            <div class="mb-2">
                <label class="textColor"><small>Class</small> <span class="star">*</span></label>
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="form.campus_class_number"
                >
                    <option disabled value="">Select Class</option>
                     <option v-for="(clist, index) in classLevelList" :key="index" :value="clist.number">{{clist.name}}</option>
                </select>
            </div>


      <div class="mb-2">
        <label class="textColor"><small>Academic Year</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="academic_year_number"
            @change="fetchStudyPeriod(academic_year_number)" >
          <option disabled value="">Select Class</option>
          <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
            {{list.code+". "+list.academic_year_name}}
          </option>
        </select>
      </div>


      <div class="mb-2">
                <label class="textColor"><small>Study Period</small> <span class="star">*</span></label>
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="form.study_period_number"
                >
                    <option disabled value="">Select Study Period</option>
                    <option v-for="(list, index) in studyPeriodList" :key="index" :value="list.number">{{ list.study_period_name }}
                    </option>
                </select>
            </div>

                <div class="text-right mt-4">
                  <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>Admit</small>
                    <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
                      <span class="visually-hidden">Loading...</span>
                    </div></button>
                </div>
              </form>
  
  
 
  

    </div>
    </div>
    </template>
    
    <script setup>
    import {onMounted,reactive, ref, watch} from "vue";
    import useNotificationStore from "@/composables/useNotification.js";
    import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
    import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
    import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
    import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
    import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
   import { useStudyPeriodStore } from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod";
   import {useLevelStore} from "@/main/settings/level/store/level.js";
   const levelStore = useLevelStore()

   import VueDatePicker from '@vuepic/vue-datepicker';
    const academicYearStore = useAcademicYearStore()

    import {useRouter} from "vue-router";
    const routerData = useRouter()
    let  curriculumNumber = routerData.currentRoute.value.query.crr
  
    import { useAbility } from '@casl/vue';
  
  const { can } = useAbility()
  
    const buttonLoader = ref(false)
    const AsessmentMetricsData = ref([])
    const interviewDialog= ref(false)
    let errorMessage = ref(null)
  
    const schoolList = ref([])

    const classStore = useClassesStore()
    const assessmentStore= useAssessmentStore()
    const  notificationStore  = useNotificationStore()
    const campusList = ref([])
    const assessmentMetricsList = ref([])
    const classList = ref([])
    const schoolStore = useSchoolStore()
    const campusStore = useCampusStore()
    const school_number = ref(null)
    const AsessmentListData = ref([])
    const gradeData = ref([])
    const campusLevelList = ref([])
    const classLevelList = ref([])
    const preferred_campus_number = ref(null)
    const metricListData = ref([])
    const academicYearList = ref([])
    const studyPeriodStore = useStudyPeriodStore()
    const studyPeriodList = ref([])
    const campus_level_number = ref(null)
    const academic_year_number = ref(null)

      const form = reactive({ 
        campus_numbers:null,
        study_period_number:null
      })


const currentYear = ref((new Date()).getFullYear());
const date = ref();

const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `Selected date is ${day}/${month}/${year}`;
}



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



const fetchLevel = (campusNo) =>{ 
// alert(campusNo)
campusStore.fetchCampusLevel(campusNo)
}


watch(
    () => campusStore.campusLevelListResponse,
    async (data) => {
        if (data) {
            campusLevelList.value = data.data
        }
    },
    {deep: true}
)










const fetchCurriculumClass = (campus_lnumber) =>{
//fetch classes
// alert (campus_lnumber)
// campusCurriculumNumber, campusLevelNumber
classStore.fetchClassByLevel(curriculumNumber,campus_lnumber)
academicYearStore.fetchAcademicYearByLevel(campus_lnumber)

}



watch(
    () => classStore.classLevelByLevelResponse,
    async (data) => {
        if (data) {
            //notificationStore.successToast("Success", data.message)
            // alert(JSON.stringify(data.data))
            if(data && data.data){
        let classData = data.data
        if(classData && (classData.length > 0)){
          classLevelList.value = classData[0].classes
        }
        
      }
            // classLevelList.value = data
        }
    },
    {deep: true}
)


onMounted(
        async () => {
          await assessmentStore.fetchMetrics()
        } )
    watch(
        () => assessmentStore.metricResponse,
        async (data) => {
          if(data){
            metricListData.value = data.data
          }
        },
        {deep:true}
    )




      onMounted(
      async () => {
        await assessmentStore.fetchAssessmentMetrics()
      } )
      watch(
    () => assessmentStore.assesmentAreaResponse,
    async (data) => {
      if(data){
        AsessmentListData.value = data.data
      }
    },
    {deep:true}
)
  

      onMounted(
    async () => {
      await assessmentStore.fetchAssesmentArea()
    } )

   //working on dialog
  const closeDialog = () => {
    interviewDialog.value = false;
  };
  const showDialog = () => {
    interviewDialog.value = true;
  }
      const addInterviewAssesmentMetrics = () => {
      //  alert(JSON.stringify(form))
       interviewDialog.value = true;
       buttonLoader.value = true
       assessmentStore.createAssessmentMetrics(form)
      }
    
      watch (
      () => assessmentStore.newAssessmentMetricResponse,
      async (data) => {
        if(data){
          buttonLoader.value = false
           assessmentStore.fetchAssessmentMetrics()
          notificationStore.successToast("Success", data.message)
         form.name= ""
         form.class_number=""
        }
      },
      {deep:true}
  )
  
  watch (
      () => assessmentStore.errorMessage,
      async (data) => {
        if(data){
          errorMessage.value = data.message
          buttonLoader.value = false
          notificationStore.errorToast("Error",data.message)
        }
      },
      {deep:true}
  )
  
      watch(
      () => assessmentStore.assessmentMetricsResponse,
      async (data) => {
        if(data){
          AsessmentMetricsData.value = data.data
         // notificationStore.successToast("Success", data.message)
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
  
    onMounted(() => {
            schoolStore.fetchSchools()
        }
    )
  
    watch(
        () => schoolStore.schoolsResponse,
        async (data) => {
            if (data) {
                assessmentMetricsList.value = data.data
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
  
    onMounted(
    async () => {
      await assessmentStore.fetchGradeStandard()
    } )
    
watch (
    () => assessmentStore.gradeStandardResponse,
    async (data) => {
      if(data){
        gradeData.value = data.data
      }
    },
    {deep:true}
)


// watch(
//     () => classStore.campusLevelResponse,
//     async (data) => {
//       if(data){
//         campusLevelList.value = data.data
//       }
//     },
//     {deep:true}
// )


watch(
    () => academicYearStore.academicYearByLevelResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
      }
    },
    {deep:true}
)

const fetchStudyPeriod = (academic_num) =>{
  studyPeriodStore.fetchStudyPeriodByAcademicYear(academic_num)
}


watch(
    () => studyPeriodStore.studyPeriodByAcademicYearResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    },
    {deep:true}
)


    </script>
  
  
    
    <style scoped>
    .textColor{
      font-size: 11px;
    }
    
    </style>
<script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
  import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
  import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
  import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
  import { useStudyPeriodStore } from "../../manageLevel/studyPeriod/store/studyPeriod";
  const academicYearStore = useAcademicYearStore()
  
  import {useRouter} from "vue-router";
  const routerData = useRouter()
  const commons = useCommonsStore()
  let  curriculumNumber = routerData.currentRoute.value.query.crr
  let  curriculumNumberParent = routerData.currentRoute.value.query.cr
  const campus_curriculum_number = routerData.currentRoute.value.query.crr
  
  import { useAbility } from '@casl/vue';
  import useCommonsStore from "@/composables/useCommons.js";
  
  const { can } = useAbility()
  
  const buttonLoader = ref(false)
  const assessmentMetricsData = ref([])
  const interviewDialog= ref(false)
  let errorMessage = ref(null)
  
  const classStore = useClassesStore()
  const assessmentStore= useAssessmentStore()
  const studyPeriodStore = useStudyPeriodStore()
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
  const studyPeriodList = ref([])
  const campus_level_number = ref(null)
  const academic_year_number = ref(null)
  const campusNumber = routerData.currentRoute.value.query.id
  
    const form = reactive({ 
      name:null,
      code:null,
      assessment_area_number:null,
      weight:null,
      description:null,
      max_score:null,
      metric_number:null,
      campus_class_number:null,
      grading_standard_number:null,
      study_period_number:null,
      scheduled_on:null
    })
  
  
  const currentYear = ref((new Date()).getFullYear());
  const date = ref();
  
  const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  return `Selected date is ${day}/${month}/${year}`;
  }
  
  
  const fetchCurriculumClass = (campus_lnumber) =>{
  classStore.fetchClassByLevel(curriculumNumber,campus_lnumber)
  academicYearStore.fetchAcademicYearByLevel(campus_lnumber)
  
  }
  
  
  const  fetchAssessmentAreaList = (campus_class_number) => {
  if(campus_class_number) {
    doFetchGradingStandard()
    let curriculum_class_number = classLevelList.value.find(item => item.number === campus_class_number).curriculum_class_number
    assessmentStore.fetchAssessmentArea(curriculum_class_number)
  }
  }
  
  watch(
  () => classStore.classLevelByLevelResponse,
  async (data) => {
      if (data) {
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
  
  const doFetchGradingStandard = () => {
   let data = {
     campus_number:campusNumber,
     campus_class_number:form.campus_class_number
   }
    assessmentStore.fetchGradeStandard(data)
  }
  
  onMounted(
      async () => {
        await classStore.fetchCampusLevel(campus_curriculum_number)
        await assessmentStore.fetchMetrics(curriculumNumberParent)
        await assessmentStore.fetchAssessmentMetrics()
        await schoolStore.fetchSchools()
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
  
  
  
  
    watch(
  () => assessmentStore.assessmentAreaResponse,
  async (data) => {
    if(data){
      AsessmentListData.value = data.data
    }
  },
  {deep:true}
  )
  
  
  
  
  //working on dialog
  const closeDialog = () => {
  interviewDialog.value = false;
  };
  const showDialog = () => {
  interviewDialog.value = true;
  }
    const addInterviewAssesmentMetrics = () => {
      // parseInt
    //  alert(JSON.stringify(form))
     interviewDialog.value = true;
     buttonLoader.value = true
      form.code = form.code ? parseInt(form.code) : form.code
      form.max_score = form.max_score ? parseInt(form.max_score) : form.max_score
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
       form.assessment_area_number=null,
       form.weight=null,
       form.description=null,
       form.max_score=null,
       form.metric_number=null,
       form.campus_class_number=null,
       form.grading_standard_number=null,
       form.study_period_number=null,
       form.scheduled_on=null
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
        assessmentMetricsData.value = data.data
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
  
  
  
  watch (
  () => assessmentStore.gradeStandardResponse,
  async (data) => {
    if(data){
      gradeData.value = data.data
    }
  },
  {deep:true}
  )
  
  
  watch(
  () => classStore.campusLevelResponse,
  async (data) => {
    if(data){
      campusLevelList.value = data.data
    }
  },
  {deep:true}
  )
  
  
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

<template>
  <div>
     <form @submit.prevent="addInterviewAssesmentMetrics">
        <div class="row">
           <div class="col-lg-6">

             <div class="mb-2">
               <label class="textColor"><small>Code</small></label>
               <input
                   @keypress="commons.numbersOnlyValidator($event)"
                   maxlength="10"
                   type="text"
                   style="outline: none 0 !important;
            box-shadow: none;"
                   v-model="form.code"
                   required
                   class="form-control form-select-sm">
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
                    @change="fetchAssessmentAreaList(form.campus_class_number)"
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

        <div class="mb-2">
                 <label class="textColor"><small>Metric</small> <span class="star">*</span></label>
                 <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.metric_number"
                    >
                    <option disabled value="">Select</option>
                    <option v-for="(list, index) in metricListData" :key="index" :value="list.number">{{ list.name }}
                    </option>
                 </select>
              </div>

        </div>
           <div class="col-lg-6">
          
          
              <div class="mb-2">
                 <label class="textColor"><small>Assessment Area</small> <span class="star">*</span></label>
                 <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.assessment_area_number"
                    >
                    <option disabled value="">Select</option>
                    <option v-for="(list, index) in AsessmentListData" :key="index" :value="list.number">{{ list.name }}
                    </option>
                 </select>
              </div>
           
        <div class="mb-2">
           <div class="row">
              <div class="col-lg-6">           
                 <label class="textColor"><small>Weight</small></label>
                 <input v-model="form.weight"  type="text" required class="form-control"  @keypress="commons.numbersOnlyValidator($event)"
            maxlength="10">
              </div>
              <div class="col-lg-6">
                 <label class="textColor"><small>Max_Score</small></label>
                 <input v-model="form.max_score"  type="text" required class="form-control" @keypress="commons.numbersOnlyValidator($event)"
            maxlength="10">
              </div>
           </div>
        </div>
      
              <div class="mb-2">
                 <label class="textColor"><small>Grading Standard</small> <span class="star">*</span></label>
                 <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.grading_standard_number"
                    >
                    <option disabled value="">Select</option>
                    <option v-for="(gradeList,index) in gradeData" :key="index" :value="gradeList.number">{{ gradeList.name }}</option>
                 </select>
              </div>
           
              <div class="mb-2">
                 <label class="textColor"><small>Scheduled On</small></label>
                 <input type="date" class="form-control" v-model="form.scheduled_on">
              </div>
           
          <div class="mb-2">
             <label class="textColor"><small>Description</small></label>
             <textarea class="form-control textColor"  rows="3" v-model="form.description">
             </textarea>
          </div>

        </div>
        </div>
        <div class="text-right mt-4">
           <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog">
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
  font-size: 11px;
  }
</style>
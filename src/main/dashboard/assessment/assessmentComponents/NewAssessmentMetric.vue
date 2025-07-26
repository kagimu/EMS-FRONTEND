<script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
  import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
  import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
  import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
  import { useStudyPeriodStore } from "../../manageLevel/studyPeriod/store/studyPeriod";
  import {useRouter} from "vue-router";
  import { useAbility } from '@casl/vue';
  import useCommonsStore from "@/composables/useCommons.js";
  const routerData = useRouter()
  const commons = useCommonsStore()
  const  notificationStore  = useNotificationStore()
  const { can } = useAbility()

  let  curriculumNumberParent = routerData.currentRoute.value.query.cr
  const campus_curriculum_number = routerData.currentRoute.value.query.crr
  let schoolNumber = routerData.currentRoute.value.query.sch


  const academicYearStore = useAcademicYearStore()
  const classStore = useClassesStore()
  const assessmentStore= useAssessmentStore()
  const studyPeriodStore = useStudyPeriodStore()
  const schoolStore = useSchoolStore()
  const campusStore = useCampusStore()
  
  const buttonLoader = ref(false)
  const interviewDialog= ref(false)
  let errorMessage = ref(null)

  const campusList = ref([])
  const classList = ref([])

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
  const assessment_schedule_number = ref(null)
  const academic_year_number = ref(null)
  const campusNumber = routerData.currentRoute.value.query.id


  const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  return `Selected date is ${day}/${month}/${year}`;
  }


  const props = defineProps({
    assessmentMetricList:{}
   })

  const date = ref();
  
  onMounted(
      async () => {
        await classStore.fetchCampusLevel(campus_curriculum_number)
        await assessmentStore.fetchMetrics(curriculumNumberParent)
        getAssessmentScheduleInfo()
      })
  
    const form = reactive({ 

      code:null,
      assessment_area_number:null,
      description:null,
      max_score:null,
      metric_number:null,
      class_number:null,
      // grading_standard_number:null,
      study_period_number:null,
      scheduled_on:null,
      require_comment:null,
      campus_number:campusNumber,
      curriculum_number:curriculumNumberParent
    })

  watch(
      () => props.assessmentMetricList,
      async (data) => {
        if(data){
          fetchCurriculumClass()
          getAssessmentScheduleInfo()
        }
      }
  )

    const getAssessmentScheduleInfo = () =>{
      let draft = props.assessmentMetricList
      
       if(draft.number){
      form.code = draft.key
      form.description = draft.description
      form.max_score = draft.max_score
      form.metric_number = draft.metric_number
      form.scheduled_on = draft.scheduled_on
      form.require_comment = draft.require_comment
      campus_level_number.value = draft.campus_level_number
      assessment_schedule_number.value = draft.number

      form.assessment_area_number = draft.assessment_area_number

      if(draft.campus_level_number){
         academicYearStore.fetchAcademicYearByLevel(draft.campus_level_number)   
        
        let data = {
    school_number:schoolNumber,
    campus_level_number:draft.campus_level_number
  }
  campusStore.fetchClassesBySchool(data) 
  form.class_number = draft.class_number
  academic_year_number.value = draft.academic_year_number 

  studyPeriodStore.fetchStudyPeriod(
      {
        campus_curriculum_number:campus_curriculum_number,
        academic_year_number:draft.academic_year_number,
        class_number:draft.class_number,
        school_number:schoolNumber
      } 
    )
  form.study_period_number = draft.study_period_number


  let datas = {
    curriculum_number:curriculumNumberParent,
    class_number:draft.class_number
  }
  assessmentStore.fetchAssessmentArea(datas)
  form.assessment_area_number = draft.assessment_area_number

      }
     
   }
       
    }



  const fetchCurriculumClass = (campuslevelnumber) =>{

    if(props.assessmentMetricList.number){
      academicYearStore.fetchAcademicYearByLevel(props.assessmentMetricList.campus_level_number)
    }else {
      academicYearStore.fetchAcademicYearByLevel(campus_level_number.value)
    }
    academicYearStore.fetchAcademicYearByLevel(campuslevelnumber)

    let data = {
    school_number:schoolNumber,
    campus_level_number:campuslevelnumber
  }
  campusStore.fetchClassesBySchool(data)


  }
  
  
  const  fetchAssessmentAreaList = (class_number) => {

  let data = {
    curriculum_number:curriculumNumberParent,
    class_number:class_number
  }
  assessmentStore.fetchAssessmentArea(data)

  studyPeriodStore.fetchStudyPeriod(
      {
        campus_curriculum_number:campus_curriculum_number,
        academic_year_number:academic_year_number.value,
        class_number:class_number,
        school_number:schoolNumber
      }
  )


  }
  


  watch(
      () => assessmentStore.assessmentAreaResponse,
      async (data) => {
        if(data){
          AsessmentListData.value = data.data
        }
      }
  )



      
  watch(
      () => assessmentStore.metricResponse,
      async (data) => {
        if(data){
          metricListData.value = data.data
        }
      }
  )
  

    const addInterviewAssesmentMetrics = () => {

     interviewDialog.value = true;
     buttonLoader.value = true
      form.code = form.code ? parseInt(form.code) : form.code
      form.max_score = form.max_score ? parseInt(form.max_score) : form.max_score
      if(assessment_schedule_number.value){
        form.assessment_metric_number = assessment_schedule_number.value
        assessmentStore.updateAssessmentMetrics(form)
      }else{
        assessmentStore.createAssessmentMetrics(form)
      }
   
    }


  
    watch (
    () => assessmentStore.newAssessmentMetricResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
       form.assessment_area_number=null
       form.description=null
       form.max_score=null
       form.metric_number=null
       form.class_number=null
       // form.grading_standard_number=null
       form.study_period_number=null
       form.scheduled_on=null
      }
    }
  )
  
  watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    }
  )
  

  
  
  const fetchCampuses = (school_number) => {
      campusStore.fetchCampuses(school_number ?? "")
  }
  
  // const fetchClasses = (campus_number) => {
  //     campusStore.fetchClassesByCampus(campus_number)
  // }
  

  

  
  watch(
      () => campusStore.campusListResponse,
      async (data) => {
          if (data) {
              campusList.value = data.data
          }
      },
      {deep: true}
  )
  
  // watch(
  //     () => campusStore.campusClassesResponse,
  //     async (data) => {
  //         if (data) {
  //             classList.value = data.data
  //         }
  //     },
  //     {deep: true}
  // )
  

  watch(
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    }
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
    () => studyPeriodStore.studyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    }
)
  
  
</script>

<template>
  <div>
<!-- {{ assessmentMetricList }} -->
     <form @submit.prevent="addInterviewAssesmentMetrics">
        <div class="row">
           <div class="col-lg-6">

             <div class="mb-2">
               <label class="text-sm"><small>Code</small></label>
               <input
                   @keypress="commons.codeValidator($event)"
                   maxlength="10"
                   type="text"
                   v-model="form.code"
                   required
                   class="form-control form-select-sm shadow-none">
             </div>

              <div class="mb-2">
                 <label class="text-sm"><small>Level</small></label>
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
                 <label class="text-sm"><small>Academic Year</small></label>
                 <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="academic_year_number"
                     >
                    <option disabled value="">Select Academic Year</option>
                    <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
                       {{list.code+". "+list.academic_year_name}}
                    </option>
                 </select>
           </div>

         
              <div class="mb-2">
                 <label class="text-sm"><small>Class</small> <span class="star">*</span></label>
                 <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.class_number"
                    @change="fetchAssessmentAreaList(form.class_number)">
                    <option disabled value="">Select Class</option>
                    <option v-for="(list, index) in classList" :key="index" :value="list.number">{{list?.name+" [ "+list?.abbreviation+" ]"}}</option>
                 </select>
              </div>

            

           <div class="mb-2">
                 <label class="text-sm"><small>Study Period</small> <span class="star">*</span></label>
                 <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.study_period_number"
                    >
                    <option disabled value="">Select Study Period</option>
                    <option v-for="(list, index) in studyPeriodList" :key="index" :value="list.study_period_number">{{ list.study_period_name }}
                    </option>
                 </select>
        </div>

        <div class="mb-2">
                 <label class="text-sm"><small>Metric</small> <span class="star">*</span></label>
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
               <label class="text-sm"><small>Assessment Area</small> <span class="star">*</span></label>
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
                 <label class="text-sm"><small>Requires A comment ?</small> <span class="star">*</span></label>
                 <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.require_comment"
                    >
                    <option value="YES">Mandatory</option>
                    <option value="NO">Optional</option>
                 </select>
              </div>

        <div class="mb-2">
                 <label class="text-sm"><small>Maximum Score</small></label>
                 <input
                     v-model="form.max_score"
                     type="text" required
                     class="form-control shadow-none"
                     @keypress="commons.numbersOnlyValidator($event)"
                      maxlength="10">
        </div>
      

              <div class="mb-2">
                 <label class="text-sm">Scheduled On</label>
                 <input type="date" class="form-control shadow-none" v-model="form.scheduled_on">
              </div>
           
          <div class="mb-2">
            <label class="text-sm">Title</label>
             <textarea
                 class="form-control shadow-none text-sm"
                 rows="3"
                 v-model="form.description">
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
  .text-sm2{
  font-size: 11px;
  }
</style>
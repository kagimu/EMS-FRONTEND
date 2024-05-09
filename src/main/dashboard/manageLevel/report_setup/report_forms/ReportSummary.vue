<script setup>
  import {onMounted,reactive, computed,ref, watch} from "vue";
   import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
   import {useReportCardStore} from "@/main/dashboard/report-card/store/report-card.js";
   import AppModal from "@/components/AppModal.vue";
   import ManageReportDetails from "@/main/dashboard/manageLevel/report_setup/report_forms/ManageReportDetails.vue";
  const routerData = useRouter()
   import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
  import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
  import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
  import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
  import {useRouter} from "vue-router";

  const campus_curriculum_number = routerData.currentRoute.value.query.crr
   const reportSetupStore = useReportSetupStore()
   const reportStore = useReportCardStore()
   const reportSummaryList = ref([])
   const showStudentsMarks = ref(false)
   //filter

  const campusList = ref([])
  const schoolList = ref([])
  const classList = ref([])
  const schoolStore = useSchoolStore()
  const campusStore = useCampusStore()
  const school_number = ref(null)
  const assessmentStore = useAssessmentStore()
  const academicYearStore = useAcademicYearStore()
  const academicYearList = ref([])
  const studyPeriodList  = ref([])
  const classStore = useClassesStore()
  const streamList = ref([])
  const page = ref(1)
  const per_page = ref(15)
   
const form = reactive({
academic_year: "",
study_period_number: "",
campus_class_number: "",
campus_number: "",
stream_number:"",
interview_number:""
})

   onMounted(
       async () => {
         await academicYearStore.fetchAcademicYearByCampus(campus_curriculum_number)
         await classStore.fetchClassStreams(campus_curriculum_number)
         // await reportStore.fetchReportSummary()
         fetchAcademicYear()
       }
   )
   
   const showStudentReport = (summary) => {
     if(summary) {
       showStudentsMarks.value = true
       reportStore.fetchReportDetailsInfo(summary.number)
     }
   }
   

   
   const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number)
}

const fetchClasses = (campus_number) => {
  campusStore.fetchClassesByCampus(campus_number)
}

const fetchAcademicYear = () =>{


  let options = {
    page: page.value,
    per_page: per_page.value,
    student_number: "",
    study_period_number: "",
    stream_number: "",
    grade: "",
    campus_curriculum_number: "",
  }

  reportStore.fetchReportSummary(options)
  // reportStore.fetchReportSummary(studentN,study_period_number,campusClassN,stream_number,grade)

}

watch(
  () => academicYearStore.academicYearByCampusResponse,
  async (data) => {
      if (data) {
        academicYearList.value = data.data

        if(data && data.data){
      let studyData = data.data
      if(studyData && (studyData.length > 0)){
        studyPeriodList.value = studyData[0].studyPeriod
      }
    }
      }
  },
  {deep: true}
)


const filterByStream = (streamN) => {
  let studentN = ""
  let study_period_number = ""
  let grade=""
  reportStore.fetchReportSummary(studentN,study_period_number,form.campus_class_number,streamN,grade)
}

const filterByStudyPeriod = (study_period) => {
  let studentN = ""
  let grade=""
  reportStore.fetchReportSummary(studentN,study_period,form.campus_class_number,form.stream_number,grade)
}
const filterByAcademicYear = (academicN) =>{
  // let studentN = ""
  // let grade=""
  // reportStore.fetchReportSummary(studentN,study_period,form.campus_class_number,form.stream_number,grade)
}

   

watch(
  () => classStore.classStreams,
  async (data) => {
      if (data) {
        streamList.value = data.data
      }
  },
  {deep: true}
)




onMounted(() => {
      schoolStore.fetchSchools()
  }
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




  const filterSummaryReport = (data) => {
    if(data) {
      let current_page = data.page
      page.value = current_page

      let per_page_item = data.per_page;
      per_page.value = per_page_item;

      let objArray = data.content


      if(objArray && objArray.length > 0){
        objArray.forEach((list, i) => {

          list.key =  (current_page - 1) * per_page_item + i + 1

          const index = reportSummaryList.value.findIndex(object => object.number === list.number);

          if (index === -1) {
            reportSummaryList.value.push(list);
          }

        })
      }


    }
  }

  watch(
      () => reportStore.reportSummaryResponse,
      async (data) => {
        if(data){
          filterSummaryReport(data)
        }
      }
  )


   
</script>
<template>
   <div>
      <AppModal title="Preview Report" v-model="showStudentsMarks" xl6>
         <manage-report-details></manage-report-details>
      </AppModal>
      <div class="row">
         <div class="col-12">
            <div class="mt-4">
               <div class="row mx-auto">
                  <form @submit.prevent="Admit()">
                     <div class="row">
                        <div class="col-4">
                           <div class="mb-2">
                              <label class="textColor"><small>School</small> </label>
                              <select
                                 style="box-shadow: none;"
                                 class="form-select form-select-sm" required
                                 v-model="form.school_number"
                                 @change="fetchCampuses(form.school_number)"
                                 >
                                 <option disabled value="">Select School</option>
                                 <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                                 </option>
                              </select>
                           </div>
                        </div>
                        <div class="col-4">
                           <div class="mb-2">
                              <label class="textColor"><small>Campus</small>  </label>
                              <select
                                 style="box-shadow: none;"
                                 class="form-select form-select-sm"
                                 v-model="form.campus_number" required
                                 @change="fetchClasses(form.campus_number)"
                                 >
                                 <option disabled value="">Select campus</option>
                                 <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                                 </option>
                              </select>
                           </div>
                        </div>
                        <div class="col-4">
                           <div class="mb-2">
                              <label class="textColor"><small>Class</small> </label>
                              <select
                                 style="box-shadow: none;"
                                 class="form-select form-select-sm" required
                                 v-model="form.campus_class_number"
                                 @change="fetchAcademicYear(form.campus_class_number)"
                                 >
                                 <option disabled value="">Select class</option>
                                 <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">{{ claslist.class_name }}
                                 </option>
                              </select>
                           </div>
                        </div>
                        </div>
                        <div class="row">
                        <div class="col-4">
                           <div class="mb-2">
                              <label class="textColor"><small>Stream</small> </label>
                              <select
                                 style="box-shadow: none;"
                                 class="form-select form-select-sm" required
                                 v-model="form.stream_number"
                                 @change="filterByStream(form.stream_number)"
                                 >
                                 <option disabled value="">Select Stream</option>
                                 <option v-for="(slist, index) in streamList" :key="index" :value="slist.number">{{ slist.name }}
                                 </option>
                              </select>
                           </div>
                        </div>
                        <div class="col-4">
                           <div class="mb-2">
                              <label class="textColor"><small>Academic Year</small> </label>
                              <select
                                 style="box-shadow: none;"
                                 class="form-select form-select-sm" required
                                 v-model="form.academic_year"
                                 onchange="filterByAcademicYear(form.academic_year)"
                                 >
                                 <option disabled value="">Select Year</option>
                                 <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
                              </select>
                           </div>
                        </div>
                        <div class="col-4">
                           <div class="mb-2">
                              <label class="textColor">
                                 <small>Study Period</small>
                              </label>
                              <select
                                 style="box-shadow: none;"
                                 class="form-select form-select-sm" required
                                 v-model="form.study_period_number"
                                 @change="filterByStudyPeriod(form.study_period_number)"
                                 >
                                 <option disabled value="">Select</option>
                                 <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </div>
      <div class="row">
         <div class="col-12">
            <div class="flex justify-content-between mt-3">
               <div class="ml-4">Student Report Summary</div>
            </div>
            <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
               <thead>
                  <tr>
                     <th scope="col" style="width: 2%;">#</th>
                     <th scope="col">Student</th>
                     <th scope="col">Grade</th>
                     <th>StudyPeriod</th>
                     <th>Stream</th>
                     <th>Class</th>
                     <th scope="col">Action</th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="(summary, idx) in reportSummaryList" :key="idx">
                     <td> {{summary.key}}</td>
                     <td> {{summary.student_name}}</td>
                     <td> {{summary.grade}}</td>
                     <td>{{ summary.study_period }}</td>
                     <td>{{ summary.stream }}</td>
                     <td>{{ summary.class }}</td>
                     <td>
                        <div>
                           <button
                              @click="showStudentReport(summary)"
                              type="button"
                              class="bg-[#1062da] text-white rounded-sm px-3 py-1 text-[12px]">
                           View Details
                           </button>
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
</style>
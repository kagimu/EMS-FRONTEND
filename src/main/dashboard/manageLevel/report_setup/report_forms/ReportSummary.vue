<script setup>

import {onMounted, ref, watch} from "vue";
import {useReportCardStore} from "@/main/dashboard/report-card/store/report-card.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
const reportStore = useReportCardStore()    
const levelStore = useLevelStore()
const classStore = useClassesStore()
const studyPeriodStore = useStudyPeriodStore()
const academicYearStore = useAcademicYearStore()
const notificationStore  = useNotificationStore()
const routerData = useRouter()

const campus_curriculum_number = routerData.currentRoute.value.query.crr
const campusCurriculumDataInfo = ref(null)
const campus_level_number = ref("")
const academic_year_number = ref("")
const study_period_number = ref("")
const campus_class_number = ref("")
const campusLevelList = ref(null)
const academicYearList = ref(null)
const studyPeriodList = ref(null)
const campusClassList = ref(null)
const reportSummaryList = ref([])
const page = ref(1)
const per_page = ref(15)

onMounted(
    async () => {
      await doFilterReportSummary()
      await fetchCampusLevel()
    }
)


// const filterReportSummary = () => {
//   if(study_period_number.value && campus_class_number.value) {
//     let data = {
//       study_period_number: study_period_number.value,
//       campus_class_number: campus_class_number.value,
//     }
//     alert(JSON.stringify(data))
//   reportStore.fetchReportSummary(data)
//   }
// }

const doFilterReportSummary = () =>{
  let options = {
    page: page.value,
    per_page: per_page.value,
    student_number: "",
    study_period_number: study_period_number.value,
    campus_class_number: campus_class_number.value,
    stream_number: "",
    grade: "",
  }

  reportStore.fetchReportSummary(options)

}


const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

const fetchAcademicYea = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)
  academicYearStore.fetchCampusClassByLevel(campus_level_number)
}

const fetchStudyPeriod = (academic_num) =>{
  studyPeriodStore.fetchStudyPeriodByAcademicYear(academic_num)
}


watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        campusCurriculumDataInfo.value = data.data

      }
    }
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


watch(
    () => studyPeriodStore.studyPeriodByAcademicYearResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    }
)

watch(
    () => academicYearStore.campusClassByLevelResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
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
    
      <div class="row">
         <div class="col-12">
            <div class="mt-4">
               <div class="row mx-auto">
                 
    <div class="col-3">
      <label class="textColor"><small>Level</small></label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="campus_level_number"
          @change="fetchAcademicYea(campus_level_number)"
      >
        <option disabled value="">--Select Level--</option>
        <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
      </select>
    </div>

    <div class="col-3">
      <label class="textColor">Academic Year</label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="academic_year_number"
          @change="fetchStudyPeriod(academic_year_number)"
      >
        <option disabled value="">--Select Academic Year--</option>
        <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
          {{list.code+". "+list.academic_year_name}}
        </option>
      </select>
    </div>

    <div class="col-3">
      <label class="textColor"><small>Study Period</small>
      </label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="study_period_number"
          @change="doFilterReportSummary"
      >
        <option disabled value="">Select</option>
        <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>

      </select>
    </div>
    <div class="col-3">
      <label class="textColor"><small>Class</small>
      </label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="campus_class_number"
          @change="doFilterReportSummary"
      >
        <option disabled value="">Select</option>
        <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
      </select>
    </div>
               </div>
            </div>
         </div>
      </div>

      <hr />
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
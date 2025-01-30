<script setup>

import {onMounted, ref, watch} from "vue";
import {useReportCardStore} from "@/main/dashboard/report-card/store/report-card.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import ManageReportDetails from "@/main/dashboard/manageLevel/report_setup/report_forms/ManageReportDetails.vue";
import AppModal from "@/components/AppModal.vue";
import {useRouter} from "vue-router";
import {useTeacherCommentStore} from "@/main/dashboard/manageLevel/report_setup/comments/store/teacherComment.js";
import NewCommentFromTeacher from "@/main/dashboard/manageLevel/report_setup/comments/NewCommentFromTeacher.vue";
import PaginationTemplate from "@/components/PaginationTemplate.vue";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"

const campusStore = useCampusStore()

const reportStore = useReportCardStore()    
const levelStore = useLevelStore()
const classStore = useClassesStore()
const studyPeriodStore = useStudyPeriodStore()
const academicYearStore = useAcademicYearStore()
const teacherCommentStore = useTeacherCommentStore()
const routerData = useRouter()
const showStudentsMarks = ref(false)
const reportSummaryNumber = ref("")
const schoolN = routerData.currentRoute.value.query.sch
const campusNumber = routerData.currentRoute.value.query.id

const campus_curriculum_number = routerData.currentRoute.value.query.crr
const campusCurriculumDataInfo = ref(null)
const campus_level_number = ref("")
const academic_year_number = ref("")
const study_period_number = ref("")
const class_number = ref("")
const campusLevelList = ref(null)
const academicYearList = ref(null)
const studyPeriodList = ref(null)
const campusClassList = ref(null)
const reportSummaryList = ref([])
const page = ref(1)
const per_page = ref(20)
const total_items = ref(0)
const total_rows = ref(0)
 const tableLoader = ref(true)
const reportSummaryData = ref([])

onMounted(
    async () => {
       doFilterReportSummary()
       fetchCampusLevel()
    }
)

const showStudentReport = (summary) => {
  if(summary) {
    showStudentsMarks.value = true
    reportSummaryData.value = summary

    let data = {
      report_summary_number:summary.number,
      html_report_template:"victorious-report-primary"
    }
    reportStore.fetchReportDetailsInfo(data)
  }
}



const doFilterReportSummary = () =>{
  reportSummaryList.value.splice(0)
  let options = {
    page: 1,
    per_page: per_page.value,
    student_number: "",
    study_period_number: study_period_number.value,
    class_number: class_number.value,
    campus_number:campusNumber,
    stream_number: "",
    grade: "",
  }

  reportStore.fetchReportSummary(options)


  //get studyPeriod
  studyPeriodStore.fetchStudyPeriod(
      {
        campus_curriculum_number:campus_curriculum_number,
        academic_year_number:academic_year_number.value,
        class_number:class_number.value,
        school_number:schoolN
      } 
    )

}


function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
  if (scrollTop + clientHeight >= scrollHeight) {

    tableLoader.value = true
    let options = {
    page: (page.value+1),
    per_page: per_page.value,
    student_number: "",
    study_period_number: study_period_number.value,
    class_number: class_number.value,
    stream_number: "",
    grade: "",
  }

  reportStore.fetchReportSummary(options)

  }
}


const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
  
}

const fetchAcademicYea = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)


  let data = {
    school_number:schoolN,
    campus_level_number:campus_level_number
  }
  campusStore.fetchClassesBySchool(data)
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
    () => studyPeriodStore.studyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    }
)


watch(
    () => campusStore.schoolClassesResponse,
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
      tableLoader.value = false

      let per_page_item = data.per_page;
      per_page.value = per_page_item;

      let objArray = data.content

      let count_items = (current_page * per_page_item)
      let totalItems = data?.total_rows


      if(objArray && objArray.length > 0){

      per_page.value = per_page_item;
      page.value = current_page
      total_rows.value = totalItems

      total_items.value = (count_items > totalItems) ? totalItems : count_items
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
const showAddCommentModal = ref(false)

const showAddComment = (num) =>{
  reportSummaryNumber.value = num
  showAddCommentModal.value = true
}

watch(
    () => teacherCommentStore.newCommentFromTeacherResponse,
    async (data) => {
      if(data){
        showAddCommentModal.value = false
      }
    }
)

</script>
<template>
   <div>

 
     <AppModal title="Preview Report" v-model="showStudentsMarks" xl6>
       <manage-report-details :reportData="reportSummaryData"></manage-report-details>
     </AppModal>

     <AppModal title="Add Teachers Comment" v-model="showAddCommentModal" lg>
        <NewCommentFromTeacher :reportSummaryNumber="reportSummaryNumber"></NewCommentFromTeacher>
    </AppModal>



     <div class="row">
         <div class="col-12">
            <div class="mt-4">
               <div class="row mx-auto">
                 
    <div class="col-3">
      <label class="text-sm"><small>Level</small></label>
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
      <label class="text-sm">Academic Year</label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="academic_year_number"
      >
        <option disabled value="">--Select Academic Year--</option>
        <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
          {{list.code+". "+list.academic_year_name}}
        </option>
      </select>
    </div>

    <div class="col-3">
      <label class="text-sm"><small>Class</small>
      </label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="class_number"
          @change="doFilterReportSummary()"
      >
        <option disabled value="">Select</option>
        <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.name+" [ "+list.abbreviation+" ]"}}</option>
      </select>
    </div>

    <div class="col-3">
      <label class="text-sm"><small>Study Period</small>
      </label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="study_period_number"
          @change="doFilterReportSummary"
      >
        <option disabled value="">Select</option>
        <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>
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
            <PaginationTemplate
                    @perPageChanged="doFilterReportSummary"
                    v-model:perPage="per_page"
                    :per_page="per_page"
                    :total_items="total_items"
                    :total_rows="total_rows"></PaginationTemplate>

                    <div
                    class="w-full overflow-auto max-h-[520px] scrollbar-thin"
                    @scroll="onScroll">

            <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
               <thead>
                  <tr class="text-gray-600 text-sm">
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
                  <tr class="text-gray-600 text-sm" v-for="(summary, idx) in reportSummaryList" :key="idx">
                     <td> {{summary.key}}</td>
                     <td class="capitalize"> {{summary.student_name}}</td>
                     <td> {{summary.grade}}</td>
                     <td>{{ summary.study_period }}</td>
                     <td>{{ summary.stream }}</td>
                     <td>{{ summary.class }}</td>
                     <td>
                        <div>

                          <button
                              @click="showAddComment(summary.number)"
                              type="button"
                              class="bg-[#1062da] text-white rounded-sm px-3 text-[12px] mb-2 mr-1">
                             Add Class Teacher's Comment
                           </button>

                           <button
                              @click="showStudentReport(summary)"
                              type="button"
                              class="bg-green-800 text-white rounded-sm px-3 text-[12px]">
                           View Report
                           </button>

                        </div>
                     </td>
                  </tr>
               </tbody>
            </table>
            </div>


         </div>
      </div>
   </div>
</template>
<style scoped>
</style>
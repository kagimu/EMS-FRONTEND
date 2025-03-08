<script setup>

import {onMounted, ref, watch} from "vue";
import {useUserStore} from "@/main/dashboard/profiles/store/users.js";
import {useRouter} from "vue-router";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
import AppModal from "@/components/AppModal.vue";
import NewNarrativeReport from "@/main/dashboard/profiles/studentProfile/NewNarrativeReport.vue";
import NarrativeReportList from "@/main/dashboard/profiles/studentProfile/NarrativeReportList.vue";
const routerData = useRouter()

const userStore = useUserStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const levelStore = useLevelStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()
const studyPeriodStore = useStudyPeriodStore()
const assessmentStore= useAssessmentStore()
const student_number = routerData.currentRoute.value.query.st_id

const school_number = ref("")
const campus_number = ref("")
const campus_curriculum_number = ref("")
const campus_level_number = ref("")
const academic_year_number = ref("")
const campus_class_number = ref("")
const study_period_number = ref("")
const assessment_area_number = ref("")
const reportDialog = ref( false)



const narrativeList = ref([])
const schoolsList = ref([])
const campusList = ref([])
const campusCurriculumDataList = ref([])
const campusLevelList = ref([])
const campusClassList = ref([])
const academicYearList = ref([])
const studyPeriodList = ref([])
const assessmentListData = ref([])

onMounted(
    async () => {
      fetchNarrativeInfo()
      await schoolStore.fetchSchools()
    }
)

const fetchNarrativeInfo = () => {
  let data = {
    student_number:student_number,
    assessment_area_number:assessment_area_number.value,
    study_period_number:study_period_number.value,
    campus_class_number:campus_class_number.value,
    academic_year_number:academic_year_number.value
  }

   userStore.fetchNarrativeReport(data)
}

const fetchCampusBySchool = () => {
  campus_number.value = ""
  campusStore.fetchCampuses(school_number.value)
}

const doFetchCurriculum = (campus_number) => {
  levelStore.fetchCampusCurriculum(campus_number)
}

const fetchLevel = (campus_curriculum_number) => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

const fetchCampusClass = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)
  academicYearStore.fetchCampusClassByLevel(campus_level_number)

}

const fetchStudyPeriod = (academic_num) =>{
  studyPeriodStore.fetchStudyPeriodByAcademicYear(academic_num)
  fetchNarrativeInfo()
}

const fetchAssessmentArea = (campus_class_number) =>{
  if(campus_class_number) {
    fetchNarrativeInfo()
    let data = {
      curriculum_number:campus_curriculum_number.value,
       class_number:campus_class_number
    }
    assessmentStore.fetchAssessmentArea(data)
  }
}

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if(data){
        schoolsList.value = data.data
      }
    }
)


watch(
    () => userStore.narrativeReportResponse,
    async (data) => {
      if(data && data.data){
      narrativeList.value = data.data
      }
    }
)

watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if (data) {
        campusList.value = data.data
      }
    }
)


watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
         campusCurriculumDataList.value = data.data
      }
    }
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
    () => academicYearStore.campusClassByLevelResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
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
    () => studyPeriodStore.studyPeriodByAcademicYearResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    }
)

watch(
    () => assessmentStore.assessmentAreaResponse,
    async (data) => {
      if(data){
        assessmentListData.value = data.data
      }
    }
)

const addANarrativeReport = () => {
  reportDialog.value = true
}

const closeDialog = () => {
  reportDialog.value = false
}

</script>

<template>
<div>


  <AppModal title="Add Narrative Report" v-model="reportDialog" lg>
      <new-narrative-report v-on:next="closeDialog" :student_number="student_number"></new-narrative-report>
  </AppModal>


  <div class="flex justify-content-between mt-3">
    <div class="ml-4">Narrative Report</div>
    <button
        type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addANarrativeReport">
      <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
      Add a narrative report
    </button>
  </div>


  <narrative-report-list></narrative-report-list>


<!--
  <div class="row mt-5 mb-2 mx-auto">
    <div class="col-3">
      <div class="mb-2">
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="school_number"
            @change="fetchCampusBySchool()"
        >
          <option disabled value="">&#45;&#45;Filter by School&#45;&#45;</option>
          <option v-for="(lvl, index) in schoolsList" :key="index" :value="lvl.number">{{lvl.name}}</option>
        </select>
      </div>
    </div>
    <div class="col-3">
      <div class="mb-2">
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="campus_number" required
            @change="doFetchCurriculum(campus_number)"
        >
          <option disabled value="">&#45;&#45;Filter by campus&#45;&#45;</option>
          <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="col-3">
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="campus_curriculum_number"
          @change="fetchLevel(campus_curriculum_number)"
      >
        <option disabled value="">&#45;&#45;Select Curriculum&#45;&#45;</option>
        <option v-for="(list, index) in campusCurriculumDataList" :key="index" :value="list.number">{{list.name}}</option>
      </select>
    </div>

    <div class="col-3">
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="campus_level_number"
          @change="fetchCampusClass(campus_level_number)"
      >
        <option disabled value="">&#45;&#45;Select Level&#45;&#45;</option>
        <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
      </select>
    </div>

    <div class="col-3">
&lt;!&ndash;      <label class="text-sm"><small>Academic Year</small></label>&ndash;&gt;
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="academic_year_number"
          @change="fetchStudyPeriod(academic_year_number)"
      >
        <option disabled value="">&#45;&#45;Select Academic Year&#45;&#45;</option>
        <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
          {{list.code+". "+list.academic_year_name}}
        </option>
      </select>
    </div>

    <div class="col-3">
&lt;!&ndash;      <label class="text-sm"><small>Study Period</small>&ndash;&gt;
&lt;!&ndash;      </label>&ndash;&gt;
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="study_period_number"
          @change="fetchNarrativeInfo"
      >
        <option disabled value="">&#45;&#45;Select Study period&#45;&#45;</option>
        <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>

      </select>
    </div>
    <div class="col-3">
&lt;!&ndash;      <label class="text-sm"><small>Class</small>&ndash;&gt;
&lt;!&ndash;      </label>&ndash;&gt;
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="campus_class_number"
          @change="fetchAssessmentArea(campus_class_number)"
      >
        <option disabled value="">&#45;&#45;Select Class&#45;&#45;</option>
&lt;!&ndash;                  <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>&ndash;&gt;
        <option v-for="(list, index) in campusClassList" :key="index" :value="list.curriculum_class_number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
      </select>
    </div>

    <div class="col-3">
&lt;!&ndash;      <label class="text-sm"><small>Assessment Area</small></label>&ndash;&gt;
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="assessment_area_number"
          @change="fetchNarrativeInfo"
      >
        <option disabled value="">&#45;&#45;Select Assessment Area&#45;&#45;</option>
        <option v-for="(list, index) in assessmentListData" :key="index" :value="list.number">{{ list.name }}
        </option>
      </select>
    </div>



  </div>


  <table class="table table-hover caption-top mt-3 table-sm" style="font-size: 14px;">
    <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Date</th>
      <th scope="col">Teacher</th>
      <th scope="col">Academic Year</th>
      <th scope="col">Study Period</th>
      <th scope="col">Class</th>
      <th scope="col">Assessment Area</th>
      <th scope="col">Narration</th>
&lt;!&ndash;      <th scope="col">Action</th>&ndash;&gt;
    </tr>
    </thead>
    <tbody>
    <tr v-for="(info, index) in narrativeList" :key="index">
      <td> {{(index + 1)}}</td>
      <td> {{info?.date ?? ""}}</td>
      <td> {{info?.teacher ?? ""}}</td>
      <td> {{info?.academic_year ?? ""}}</td>
      <td> {{info?.study_period ?? ""}}</td>
      <td> {{info?.class ?? ""}}</td>
      <td> {{info?.assessment_area ?? ""}}</td>
      <td> {{info?.narration ?? ""}}</td>
&lt;!&ndash;      <td>
        <div>
          <i
              v-if="can('edit_level','general')"
              style="font-size: 13px;"
              data-bs-toggle="modal" data-bs-target="#levelModal"
              class="bi-pencil mr-2 cursor-pointer" @click="editLevel(levelInfo)"></i>
          <i
              v-if="can('delete_level','general')"
              style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteLevel(levelInfo, index)"></i>
          <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </td>&ndash;&gt;
    </tr>
    </tbody>
  </table>
-->

</div>
</template>

<style scoped>

</style>
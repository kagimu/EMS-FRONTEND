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
   userStore.fetchNarrativeReport(student_number)
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
    assessmentStore.fetchAssessmentArea(campus_class_number)
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

</script>

<template>
<div>

  <div class="flex justify-content-between mt-1">
    <div class="ml-4">Narrative Report</div>
  </div>


  <div class="row mt-5 mb-2 mx-auto">
    <div class="col-3">
      <div class="mb-2">
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="school_number"
            @change="fetchCampusBySchool()"
        >
          <option disabled value="">--Filter by School--</option>
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
          <option disabled value="">--Filter by campus--</option>
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
        <option disabled value="">--Select Curriculum--</option>
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
        <option disabled value="">--Select Level--</option>
        <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
      </select>
    </div>

    <div class="col-3">
<!--      <label class="text-sm"><small>Academic Year</small></label>-->
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
<!--      <label class="text-sm"><small>Study Period</small>-->
<!--      </label>-->
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="study_period_number"
          @change="fetchNarrativeInfo"
      >
        <option disabled value="">--Select Study period--</option>
        <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>

      </select>
    </div>
    <div class="col-3">
<!--      <label class="text-sm"><small>Class</small>-->
<!--      </label>-->
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="campus_class_number"
          @change="fetchAssessmentArea(campus_class_number)"
      >
        <option disabled value="">--Select Class--</option>
<!--                  <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>-->
        <option v-for="(list, index) in campusClassList" :key="index" :value="list.curriculum_class_number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
      </select>
    </div>

    <div class="col-3">
<!--      <label class="text-sm"><small>Assessment Area</small></label>-->
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="assessment_area_number"
          @change="fetchNarrativeInfo"
      >
        <option disabled value="">--Select Assessment Area--</option>
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
<!--      <th scope="col">Action</th>-->
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
<!--      <td>
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
      </td>-->
    </tr>
    </tbody>
  </table>

</div>
</template>

<style scoped>

</style>
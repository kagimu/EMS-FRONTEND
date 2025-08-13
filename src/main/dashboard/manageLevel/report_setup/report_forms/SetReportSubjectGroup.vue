<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useSchoolStore } from "@/main/dashboard/manageSchool/store/school.js";
import { useCampusStore } from "@/main/dashboard/manageCampus/store/campus.js";
import { useAssessmentStore } from "@/main/dashboard/assessment/store/assessment.js"
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes.js";
import { useAcademicYearStore } from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
// import { useStudyPeriodStore } from "../../manageLevel/studyPeriod/store/studyPeriod";
import { useStudyPeriodStore } from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";

import { useRouter } from "vue-router";
import { useAbility } from '@casl/vue';
import useCommonsStore from "@/composables/useCommons.js";
const metricListData = ref([])

const routerData = useRouter()
const commons = useCommonsStore()
const notificationStore = useNotificationStore()
const { can } = useAbility()

let curriculumNumberParent = routerData.currentRoute.value.query.cr
const campus_curriculum_number = routerData.currentRoute.value.query.crr
let schoolNumber = routerData.currentRoute.value.query.sch
const campusNumber = routerData.currentRoute.value.query.id

const academicYearStore = useAcademicYearStore()
const classStore = useClassesStore()
const assessmentStore = useAssessmentStore()
const studyPeriodStore = useStudyPeriodStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()

const buttonLoader = ref(false)
let errorMessage = ref(null)
const campusList = ref([])
const classList = ref([])
const campusLevelList = ref([])
const academicYearList = ref([])
const studyPeriodList = ref([])
const AsessmentListData = ref([])
const campus_level_number = ref(null)
const academic_year_number = ref(null)

const props = defineProps({
  reportSettingNum:String
})

const form = reactive({
  subject_group_name: null,
  report_settings_number:props.reportSettingNum,
  metric_number: null,
  class_number: null,
  study_period_number: null,
  campus_number: campusNumber,
  curriculum_number: curriculumNumberParent,
  campus_curriculum_number: campus_curriculum_number,
  assessmentAreas: [],
})

const addAssesArea = () => {
  form.assessmentAreas.push({
    assessment_area_number: null,
  })
}

const removeAssesArea = (index) => {
  form.assessmentAreas.splice(index, 1)
}

const onLevelChange = () => {
  if (campus_level_number.value) {
    academicYearStore.fetchAcademicYearByLevel(campus_level_number.value)
    campusStore.fetchClassesBySchool({
      school_number: schoolNumber,
      campus_level_number: campus_level_number.value,
    })
  }
}

onMounted( () => {
   classStore.fetchCampusLevel(campus_curriculum_number)
   assessmentStore.fetchMetrics(curriculumNumberParent)
  getReportSettingsNum()
})

const getReportSettingsNum = () => {
  if (props.reportSettingNum) {
    form.report_settings_number = props.reportSettingNum
  }
}

watch(() => props.reportSettingNum,
    async (data) => {
      if (data) {
        getReportSettingsNum()
      }
    }
)


watch(
    () => assessmentStore.assessmentAreaResponse,
    async (data) => {
      if (data) AsessmentListData.value = data.data
    })

watch(() => assessmentStore.metricResponse, async (data) => {
  if (data) metricListData.value = data.data
})

watch(() => campusStore.schoolClassesResponse, async (data) => {
  if (data) classList.value = data.data
})

watch(() => academicYearStore.academicYearByLevelResponse, async (data) => {
  if (data) academicYearList.value = data.data
})

watch(() => studyPeriodStore.studyPeriodResponse, async (data) => {
  if (data) studyPeriodList.value = data.data
})

watch(() => classStore.campusLevelResponse, (data) => {
  if (data) campusLevelList.value = data.data
})

const addReportSubjectGroup = () => {
  buttonLoader.value = true;
  // alert(JSON.stringify(form))
    assessmentStore.createReportSubjectGroup(form)

}

watch(() => assessmentStore.newReportSubjectGroupResponse, async (data) => {
  if (data) {
    buttonLoader.value = false
    notificationStore.successToast("Success", data.message)
    form.description = null
    form.metric_number = null
    form.class_number = null
    form.study_period_number = null
    form.assessmentAreas = []
  }
})

watch(() => assessmentStore.errorMessage, async (data) => {
  if (data) {
    errorMessage.value = data.message
    buttonLoader.value = false
    notificationStore.errorToast("Error", data.message)
  }
})


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
</script>
<template>
  <form @submit.prevent="addReportSubjectGroup" class="p-4 bg-white rounded shadow-sm space-y-4">

    <!-- First Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="text-sm font-medium">Subject Group Name</label>
        <input type="text" v-model="form.subject_group_name" class="form-control form-control-sm shadow-none" required/>
      </div>

      <div>
        <label class="text-sm font-medium">Level</label>
        <select class="form-select form-select-sm shadow-none" v-model="campus_level_number" @change="onLevelChange">
          <option disabled value="">Select Level</option>
          <option v-for="item in campusLevelList" :key="item.number" :value="item.number">
            {{ item.code }} - {{ item.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="text-sm font-medium">Academic Year</label>
        <select class="form-select form-select-sm shadow-none" v-model="academic_year_number">
          <option disabled value="">Select Academic Year</option>
          <option v-for="item in academicYearList" :key="item.number" :value="item.number">
            {{ item.code }} - {{ item.academic_year_name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Second Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="text-sm font-medium">Class</label>
        <select class="form-select form-select-sm shadow-none" v-model="form.class_number" @change="fetchAssessmentAreaList(form.class_number)">
          <option disabled value="">Select Class</option>
          <option v-for="(list, index) in classList" :key="index" :value="list.number">
            {{ list?.name + " [ " + list?.abbreviation + " ]" }}
          </option>
        </select>
      </div>

      <div>
        <label class="text-sm font-medium">Study Period</label>
        <select class="form-select form-select-sm shadow-none" v-model="form.study_period_number">
          <option disabled value="">Select Study Period</option>
          <option v-for="item in studyPeriodList" :key="item.study_period_number" :value="item.study_period_number">
            {{ item.study_period_name }}
          </option>
        </select>
      </div>

      <div>
        <label class="text-sm font-medium">Metric</label>
        <select class="form-select form-select-sm shadow-none" v-model="form.metric_number">
          <option disabled value="">Select Metric</option>
          <option v-for="item in metricListData" :key="item.number" :value="item.number">
            {{ item.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Assessment Schedules Section -->
    <div class="border rounded">
      <div class="grid grid-cols-12 gap-2 bg-gray-100 rounded-t px-3 py-2 text-sm font-semibold">
        <div class="col-span-10">Assessment Area</div>
        <div class="col-span-2 text-right">Action</div>
      </div>

      <div v-for="(schedule, index) in form.assessmentAreas" :key="index" class="grid grid-cols-12 gap-2 items-center px-3 py-2 bg-white border-t">
        <div class="col-span-10">
          <select class="form-select form-select-sm w-full" v-model="schedule.assessment_area_number">
            <option disabled value="">Select Assessment Area</option>
            <option v-for="item in AsessmentListData" :key="item.number" :value="item.number">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="col-span-2 text-right">
          <button class="btn btn-sm btn-danger" @click.prevent="removeAssesArea(index)">Remove</button>
        </div>
      </div>

      <div class="px-3 py-2">
        <button class="btn btn-sm btn-secondary" @click.prevent="addAssesArea">+ Add Schedule</button>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="text-end pt-2">
      <button type="submit" class="btn btn-primary btn-sm">
        <i class="bi bi-arrow-right-circle"></i> Submit
        <span v-if="buttonLoader" class="spinner-border spinner-border-sm" role="status"></span>
      </button>
    </div>

  </form>
</template>

<style scoped>
.text-sm {
  font-size: 14px;
}
</style>

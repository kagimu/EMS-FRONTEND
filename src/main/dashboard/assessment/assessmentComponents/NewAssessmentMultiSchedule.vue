<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useSchoolStore } from "@/main/dashboard/manageSchool/store/school.js";
import { useCampusStore } from "@/main/dashboard/manageCampus/store/campus.js";
import { useAssessmentStore } from "@/main/dashboard/assessment/store/assessment.js"
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes.js";
import { useAcademicYearStore } from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import { useStudyPeriodStore } from "../../manageLevel/studyPeriod/store/studyPeriod";
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
const interviewDialog = ref(false)
let errorMessage = ref(null)

const campusList = ref([])
const classList = ref([])
const AsessmentListData = ref([])
const gradeData = ref([])
const campusLevelList = ref([])
const academicYearList = ref([])
const studyPeriodList = ref([])

const campus_level_number = ref(null)
const academic_year_number = ref(null)
const assessment_schedule_number = ref(null)

const props = defineProps({
  assessmentMetricList: {}
})

const form = reactive({
  code: null,
  description: null,
  metric_number: null,
  class_number: null,
  study_period_number: null,
  campus_number: campusNumber,
  curriculum_number: curriculumNumberParent,
  campus_curriculum_number: campus_curriculum_number,
  schedules: []
})

const addSchedule = () => {
  form.schedules.push({
    max_score: null,
    assessment_area_number: null,
    require_comment: "NO",
    scheduled_on: null
  })
}

const removeSchedule = (index) => {
  form.schedules.splice(index, 1)
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

onMounted(async () => {
  await classStore.fetchCampusLevel(campus_curriculum_number)
  await assessmentStore.fetchMetrics(curriculumNumberParent)
  getAssessmentScheduleInfo()
})

const getAssessmentScheduleInfo = () => {
  let draft = props.assessmentMetricList
  if (draft.number) {
    form.code = draft.key
    form.description = draft.description
    form.metric_number = draft.metric_number
    form.class_number = draft.class_number
    form.study_period_number = draft.study_period_number
    form.curriculum_number = draft.curriculum_number
    form.campus_number = draft.campus_number
    form.schedules = draft.schedules || []
    campus_level_number.value = draft.campus_level_number
    academic_year_number.value = draft.academic_year_number
  }
}

watch(() => props.assessmentMetricList,
    async (data) => {
  if (data) {
    getAssessmentScheduleInfo()
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

const addInterviewAssesmentMetrics = () => {
  interviewDialog.value = true;
  buttonLoader.value = true;
  form.code = form.code ? parseInt(form.code) : form.code;

  if (assessment_schedule_number.value) {
    form.assessment_metric_number = assessment_schedule_number.value;
    assessmentStore.updateAssessmentMetrics(form);
  } else {
    assessmentStore.createAssessmentMultiSchedule(form);
  }
}

watch(() => assessmentStore.newAssessmentSchedulesResponse, async (data) => {
  if (data) {
    buttonLoader.value = false
    notificationStore.successToast("Success", data.message)
    form.description = null
    form.metric_number = null
    form.class_number = null
    form.study_period_number = null
    form.schedules = []
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
  <form @submit.prevent="addInterviewAssesmentMetrics" class="p-3 bg-white rounded shadow-sm">
    <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
      <div>
        <label class="text-sm font-medium">Code</label>
        <input type="text" v-model="form.code" class="form-control form-control-sm shadow-none" required @keypress="commons.codeValidator($event)" />
      </div>

      <div>
        <label class="text-sm font-medium">Level</label>
        <select class="form-select form-select-sm shadow-none" v-model="campus_level_number" @change="onLevelChange">
          <option disabled value="">Select Level</option>
          <option v-for="item in campusLevelList" :key="item.number" :value="item.number">{{ item.code }} - {{ item.name }}</option>
        </select>
      </div>

      <div>
        <label class="text-sm font-medium">Academic Year</label>
        <select class="form-select form-select-sm shadow-none" v-model="academic_year_number">
          <option disabled value="">Select Academic Year</option>
          <option v-for="item in academicYearList" :key="item.number" :value="item.number">{{ item.code }} - {{ item.academic_year_name }}</option>
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

      <div>
        <label class="text-sm font-medium">Study Period</label>
        <select class="form-select form-select-sm shadow-none" v-model="form.study_period_number">
          <option disabled value="">Select Study Period</option>
          <option v-for="item in studyPeriodList" :key="item.study_period_number" :value="item.study_period_number">{{ item.study_period_name }}</option>
        </select>
      </div>

      <div>
        <label class="text-sm font-medium">Metric</label>
        <select class="form-select form-select-sm shadow-none" v-model="form.metric_number">
          <option disabled value="">Select Metric</option>
          <option v-for="item in metricListData" :key="item.number" :value="item.number">{{ item.name }}</option>
        </select>
      </div>


    </div>


<!--    <div class="grid grid-cols-6 md:grid-cols-6 gap-6 mt-4">-->
<!--      <div class="md:col-span-2">-->
<!--        <label class="text-sm font-medium">Schedules</label>-->
<!--        <div v-for="(schedule, index) in form.schedules" :key="index" class="border rounded p-3 mb-3 bg-light">-->
<!--          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">-->
<!--            <div>-->
<!--              <label class="text-sm">Assessment Area</label>-->
<!--              <select class="form-select form-select-sm" v-model="schedule.assessment_area_number">-->
<!--                <option disabled value="">Select</option>-->
<!--                <option v-for="item in AsessmentListData" :key="item.number" :value="item.number">{{ item.name }}</option>-->
<!--              </select>-->
<!--            </div>-->

<!--            <div>-->
<!--              <label class="text-sm">Max Score</label>-->
<!--              <input type="number" class="form-control form-control-sm" v-model="schedule.max_score" @keypress="commons.numbersOnlyValidator($event)" />-->
<!--            </div>-->

<!--            <div>-->
<!--              <label class="text-sm">Scheduled On</label>-->
<!--              <input type="date" class="form-control form-control-sm" v-model="schedule.scheduled_on" />-->
<!--            </div>-->

<!--            <div>-->
<!--              <label class="text-sm">Require Comment?</label>-->
<!--              <select class="form-select form-select-sm" v-model="schedule.require_comment">-->
<!--                <option value="YES">Mandatory</option>-->
<!--                <option value="NO">Optional</option>-->
<!--              </select>-->
<!--            </div>-->

<!--            <div class="md:col-span-2 text-right">-->
<!--              <button class="btn btn-sm btn-danger" @click.prevent="removeSchedule(index)">Remove</button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

<!--        <button class="btn btn-sm btn-secondary" @click.prevent="addSchedule">+ Add Schedule</button>-->
<!--      </div>-->
<!--    </div>-->

    <div class="mt-2">
      <label class="text-sm font-medium mb-2 block">Schedules</label>

      <div class="grid grid-cols-12 gap-2 bg-gray-100 rounded-t px-3 py-2 text-sm font-semibold">
        <div class="col-span-3">Assessment Area</div>
        <div class="col-span-2">Max Score</div>
        <div class="col-span-3">Scheduled On</div>
        <div class="col-span-2">Require Comment?</div>
        <div class="col-span-2 text-right">Action</div>
      </div>

      <div
          v-for="(schedule, index) in form.schedules"
          :key="index"
          class="grid grid-cols-12 gap-2 items-center border-b px-3 py-2 bg-white"
      >
        <div class="col-span-3">
          <select class="form-select form-select-sm w-full" v-model="schedule.assessment_area_number">
            <option disabled value="">Select</option>
            <option v-for="item in AsessmentListData" :key="item.number" :value="item.number">
              {{ item.name }}
            </option>
          </select>
        </div>

        <div class="col-span-2">
          <input
              type="number"
              class="form-control form-control-sm w-full"
              v-model="schedule.max_score"
              @keypress="commons.numbersOnlyValidator($event)"
          />
        </div>

        <div class="col-span-3">
          <input type="date" class="form-control form-control-sm w-full" v-model="schedule.scheduled_on" />
        </div>

        <div class="col-span-2">
          <select class="form-select form-select-sm w-full" v-model="schedule.require_comment">
            <option value="YES">Mandatory</option>
            <option value="NO">Optional</option>
          </select>
        </div>

        <div class="col-span-2 text-right">
          <button class="btn btn-sm btn-danger" @click.prevent="removeSchedule(index)">Remove</button>
        </div>
      </div>

      <div class="text-left mt-3">
        <button class="btn btn-sm btn-secondary" @click.prevent="addSchedule">+ Add Schedule</button>
      </div>
    </div>

    <div class="mt-2">
      <label class="text-sm font-medium">Title</label>
      <textarea class="form-control form-control-sm shadow-none" rows="3" v-model="form.description"></textarea>
    </div>


    <div class="text-end mt-4">
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

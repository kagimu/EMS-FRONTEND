<script setup>
import { onMounted, ref, watch, reactive } from "vue";
import { useAssessmentStore } from "@/main/dashboard/assessment/store/assessment.js";
import { useStudentApplicationStore } from "@/main/dashboard/studentApplication/store/student_application.js";
import useNotificationStore from "@/composables/useNotification.js";
import { useRouter } from "vue-router";
import { useApplicationStore } from "@/main/application/applicationComponents/store/application.js";
import InterviewAssessment from "@/main/dashboard/studentApplication/InterviewAssessment.vue";
import AppModal from "@/components/AppModal.vue";
import useCommonsStore from "@/composables/useCommons.js";
import { useReportSetupStore } from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";

const reportSetupStore = useReportSetupStore();
const commons = useCommonsStore();
const studentsList = ref(null);
const showingModal = ref(false);
const assessmentNumber = ref("");
const interviewStudentListData = ref([]);
const assessmentStore = useAssessmentStore();
const studentApplicationStore = useStudentApplicationStore();
const routerData = useRouter();
let interviewNumber = routerData.currentRoute.value.query.interview_id;
let interviewM = routerData.currentRoute.value.query.interview_m;
const notificationStore = useNotificationStore();
const applicationStore = useApplicationStore();
const assessmentDataData = ref([]);
const assessment_metric_number = ref(null);
const errorMessage = ref(null);
const buttonLoader = ref(false);
const comm = ref(null);
const score = ref(null);
const studentNumber = ref(null);
const errM = ref(false);

const showModal = () => {
  showingModal.value = true;
};

const form = reactive({
  assessmentN: "",
});

onMounted(() => {
  studentApplicationStore.fetchAssessmentMetricsOnInterview(interviewNumber);
});

const fetchStudentOnInterview = (assNumber) => {
  let data = reactive({
    interview_number: interviewNumber,
    assessment_metric_number: assNumber,
  });
  applicationStore.fetchStudentsOnInterview(data);
};

watch(
  () => studentApplicationStore.assessmentMetricsOnInterviewResponse,
  async (data) => {
    if (data) {
      assessmentDataData.value = data.data;
    }
  },
  { deep: true }
);

watch(
  () => applicationStore.StudentsOnInterviewResponse,
  async (data) => {
    if (data) {
      errM.value = false;
      interviewStudentListData.value = data.data;
    }
  },
  { deep: true }
);

const submitMarks = (a, b, c) => {
  buttonLoader.value = true;
  let formDat = reactive({
    assessment_metric_number: form.assessmentN,
    comment: b,
    student_number: c,
    assessment_date: null,
    actual_score: parseInt(a),
  });
  studentApplicationStore.newInterviewAssessmentResult(formDat);
};

watch(
  () => studentApplicationStore.interviewAssessmentResultResponse,
  async (data) => {
    if (data) {
      buttonLoader.value = false;
      notificationStore.successToast("Success", data.message);
    }
  },
  { deep: true }
);
watch(
  () => applicationStore.errorMessage,
  async (data) => {
    if (data) {
      errM.value = true;
      errorMessage.value = data.message;
      notificationStore.errorToast("Error", data.message);
    }
  },
  { deep: true }
);

watch(
  () => studentApplicationStore.errorMessage,
  async (data) => {
    if (data) {
      buttonLoader.value = false;
      errorMessage.value = data.message;
      notificationStore.errorToast("Error", data.message);
    }
  }
);
</script>

<template>
  <div>
    <AppModal title="Attach Assessment Schedules To An Interview" v-model="showingModal" lg>
      <interview-assessment :interviewNumber="interviewNumber"></interview-assessment>
    </AppModal>

    <div class="row mt-4">
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <label class="alert alert-primary p-1" style="font-size: 11px;">* Please Select Assessment Schedule to Enter/View Marks</label>
            <div class="input-group mt-2">
              <select
                class="form-select form-select-sm shadow-none"
                id="inputGroupSelect02"
                v-model="form.assessmentN"
                @change="fetchStudentOnInterview(form.assessmentN)"
              >
                <option disabled value="">- Select Assessment Schedule -</option>
                <option v-for="(assessment, index) in assessmentDataData" :key="index" :value="assessment.AssessmentMetric.number">
                  {{ assessment.AssessmentMetric.number }}
                </option>
              </select>
              <button class="btn btn-outline-secondary" @click="showModal">
                <i class="bi bi-plus-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="card">
          <div class="card-body">
            <div v-if="errM" class="alert alert-danger p-2">
              {{ errorMessage }}
            </div>
            <div v-else>
              <ul class="list-group">
                <li v-for="(std, index) in interviewStudentListData.students" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6>{{ std.student_second_name + " " + std.student_second_name + " " + std.student_other_name }}</h6>
                  </div>
                  <div class="input-group" style="width: 200px;">
                    <input
                      type="text"
                      class="form-control shadow-none"
                      v-model="std.score"
                      @keypress="commons.numbersOnlyValidator($event)"
                      maxlength="10"
                      v-on:blur="submitMarks(std.score, std.comment, std.number)"
                    />
                    <textarea
                      type="text"
                      v-model="std.comment"
                      v-on:blur="submitMarks(std.score, std.comment, std.number)"
                      class="form-control form-control-sm shadow-none"
                      placeholder="Comment"
                    ></textarea>
                    <span v-if="buttonLoader" class="spinner-border text-dark spinner-border-sm" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  margin-bottom: 1rem;
}
</style>

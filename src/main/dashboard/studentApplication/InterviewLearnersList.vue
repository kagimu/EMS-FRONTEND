<template>
  <div>
    <AppModal title="Admit" v-model="myAdmitModal" xl6 class="app-modal">
      <AdmitModel :selectedStudentNumber="selectedStudentNumber" class="app-modal"></AdmitModel>
    </AppModal>

    <!-- Overlay for the modal -->
    <div v-if="dialog" class="modal-overlay"></div>

    <div class="row mt-1" style="background-color: white;">
      <div class="mt-2">
        <div class="row">
          <div class="col-lg-10">
            <table
              id="datatable"
              class="table table-hover caption-top mt-1 table-sm table-striped"
              style="font-size: 14px !important;"
            >
              <thead>
                <tr>
                  <th style="width: 1px;">#</th>
                  <th>Name</th>
                  <th>Scores</th>
                  <th>Status</th>
                  <th>#</th>
                </tr>
              </thead>
              <tbody>
                <tr style="text-transform: capitalize;" v-for="(student, index) in interviewLearnerList.students" :key="index">
                  <td>
                    <input
                      v-if="student.status !== 'ADMITTED'"
                      v-model="selectedStudentNumber"
                      class="form-check-input me-1 shadow-none form-control"
                      type="checkbox"
                      :value="student.number"
                      :id="student.number"
                      style="outline: none 0 !important; box-shadow: none;width: 20px;height: 20px;"
                    />
                  </td>
                  <td>
                    {{ student.student_surname ? student.student_surname : "" }}
                    {{ student.student_second_name ? " " + student.student_second_name : "" }}
                    {{ student.student_other_name ? " " + student.student_other_name : "" }}
                  </td>
                  <td>
                    <table
                      class="table table-hover caption-top mt-1 table-sm table-striped table-bordered"
                      style="font-size: 14px !important;"
                    >
                      <thead>
                        <tr>
                          <th>Assessment</th>
                          <th>Score</th>
                          <th>Actual Score</th>
                          <th>Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(listD, idx) in student.Assessments" :key="idx">
                          <td>{{ listD.assessment_area_name }}</td>
                          <td>{{ listD.score }}</td>
                          <td>{{ listD.actual_score }}</td>
                          <td>{{ listD.comment }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td>
                    <span style="color:green;font-style: italic;font-size: 13px;" v-if="student.status === 'ADMITTED'">
                      <RouterLink :to="{ name: 'admission-list' }" class="link-success" style="text-decoration: none;">
                        {{ student.status }}
                      </RouterLink>
                    </span>
                    <span style="color:red;font-style: italic;font-size: 13px;" v-if="student.status === 'Active'">
                      {{ student.status }}
                    </span>
                    <span v-if="student.status === 'ENROLLED'">
                      {{ student.status }}
                    </span>
                    <span v-for="(listD, index) in scoreDataList" :key="index">
                      <span>{{ listD.actual_score }}</span>
                    </span>
                  </td>
                  <td>
                    <button type="button" @click="removeStudentFromInterview(student.number, student.student_second_name)">
                      <i class="bi bi-trash" style="color: red;"></i>
                    </button>
                    <button v-if="student.status !== 'ADMITTED'" class="btn btn-outline-primary ml-6" @click="openAdmitModal(student.number)">Admit   <i class="bi bi-box-arrow-in-right mr-1"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-lg-2">
            <div class="ant-alert-action mt-3">
              <button
                @click="showAdmitModal"
                v-if="can('admit_student', 'manage')"
                type="button"
                class="mb-2 btn btn-primary btn-sm ml-2 mr-2"
              >
              <i class="bi bi-box-arrow-in-right mr-1"></i> Offer Admission
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="dialog" class="modal fade show" style="display: block;" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content" style="">
          <div class="modal-header" style="height: 15px; border: 0px;">
            <span class="modal-title"></span>
            <button type="button" class="p-2" @click="dialog = false" 
            style="color: white; border: 1 solid red; border-radius: 8px;font-weight: bold; background-color: red;">
              <span style="width: 60px;"><b>&times;</b></span>
            </button>
          </div>
          <AdmitModel :selectedStudentNumber="selectedStudentNumber" :interviewInfo="interviewInfoDataa" 
          :admissionDetails="admissionLearnerDetailsInfo" class="app-modal"></AdmitModel>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { useApplicationStore } from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";
import { useRouter } from "vue-router";
import { useStudentApplicationStore } from "./store/student_application";
import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
import { useSchoolStore } from "@/main/dashboard/manageSchool/store/school.js";
import { useCampusStore } from "@/main/dashboard/manageCampus/store/campus.js";
import { useAssessmentStore } from "@/main/dashboard/assessment/store/assessment.js";
import { useAcademicYearStore } from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
import AppModal from "@/components/AppModal.vue";
import AdmitModel from "@/main/dashboard/studentApplication/AdmitModel.vue";
import { useAbility } from '@casl/vue';

const { can } = useAbility();
const assessmentDataList = ref([]);
const myAdmitModal = ref(false);
const form = reactive({
  campus_class_number: "",
  campus_number: "",
  school_number: "",
});

const interviewLearnerList = ref([]);
let errorMessage = ref(null);
const buttonLoader = ref(false);
const applicationStore = useApplicationStore();
const notificationStore = useNotificationStore();
const routerData = useRouter();
const gradeDialog = ref(false);
const admissionStore = useAdmissionStore();
const interviewNumber = ref(null);
const studentOnInterviewId = ref(null);
const studentData = ref(null);
const selectedStuds = ref([]);
const selectedStudentNumber = ref([]);
const studentApplicationStore = useStudentApplicationStore();
const scoreDataList = ref([]);
const campusList = ref([]);
const schoolList = ref([]);
const classList = ref([]);
const schoolStore = useSchoolStore();
const campusStore = useCampusStore();
const assessmentStore = useAssessmentStore();
const academicYearStore = useAcademicYearStore();
const academicYearList = ref([]);
const studyPeriodList = ref([]);
const classStore = useClassesStore();
const streamList = ref([]);

const props = defineProps({
  interviewInfoDataa: {},
  admissionLearnerDetailsInfo:{}
});

onMounted(() => {
  interviewNumber.value = props.interviewInfoDataa.interview_number;
  studentApplicationStore.fetchAssessmentMetricsOnInterview(interviewNumber.value);
  schoolStore.fetchSchools();
  fetchStudentOnInterview();
});

const showAdmitModal = () => {
  if (selectedStudentNumber.value.length === 0) {
    // myAdmitModal.value = false;
    dialog.value = false
    notificationStore.errorToast("Error", "Please select at least one student to offer admission.");
  } else {
    dialog.value = true;
  }
};

const dialog = ref(false);

const openAdmitModal = (studentNumber) => {
  selectedStudentNumber.value = [studentNumber]; 
  dialog.value = true;
};

const fetchStudentOnInterview = () => {
  let data = {
    interview_number: props.interviewInfoDataa.interview_number,
  };
  applicationStore.fetchStudentsOnInterview(data);
};

// Fetch students on interview response
watch(() => applicationStore.StudentsOnInterviewResponse, (data) => {
  if (data) {
    interviewLearnerList.value = data.data;
  }
});



watch (
    () => admissionStore.admitStudentResponse,
    async (data) => {
      if(data){
        dialog.value = false
        fetchStudentOnInterview()
        notificationStore.successToast("Success", data.message)
      }
    }
  )
</script>

<style scoped>
.app-modal {
  z-index: 1090; 
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); 
  z-index: 1010;
  display: block;
}
</style>

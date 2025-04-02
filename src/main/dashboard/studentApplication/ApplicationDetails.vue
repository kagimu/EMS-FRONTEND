<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import useCommons from "@/composables/useCommons.js";
import { useApplicationStore } from "@/main/application/applicationComponents/store/application.js";
import { useSchoolStore } from "@/main/dashboard/manageSchool/store/school.js";
import { useCampusStore } from "@/main/dashboard/manageCampus/store/campus.js";

const applicationStore = useApplicationStore();
const notificationStore = useNotificationStore();
const buttonLoader = ref(false);
const interviewListData = ref([]);
let errorMessage = ref(null);
const useCommonsStore = useCommons();
const previousSchoolResultsData = ref([]);
const campusList = ref([]);
const schoolList = ref([]);
const schoolStore = useSchoolStore();
const campusStore = useCampusStore();
const school_number = ref(null);

onMounted(async () => {
  // applicationStore.fetchApplicationList();
  // applicationStore.fetchPreviousSchoolResultsAll();
  applicationStore.fetchApplicationById(props.applicationNumber);
  schoolStore.fetchSchools();
});

const props = defineProps({
  applicationNumber: String,
});

const appDatails = reactive({
  surname: null,
  second_name: null,
  other_name: null,
  application_number: null,
  main_telephone_number: null,
  alternative_telephone_number: null,
  email: null,
  alternative_email: null,
  studentSurname: null,
  Studentsecond_name: null,
  StudentOther_name: null,
  StudentGender: null,
  StudentDate_of_birth: null,
  preferred_type_of_enrollment: null,
  preferred_campus_number: null,
  reason: null,
  status: null,
  previousSchools: [],
  student_number: null,
  preferred_campus:null,
  previousSchoolsResults: [],
});

function getAge(dob) {
  return useCommonsStore.getAgeFromDateOfBirth(dob);
}

watch(
  () => props.applicationNumber,
  async (data) => {
    if (data) {
      applicationStore.fetchApplicationById(data);
    }
  },
  { deep: true }
);

watch(
  () => applicationStore.applicationByIdResponse,
  async (data) => {
    if (data) {
      // alert(JSON.stringify(data.student.campus_class_number))
      appDatails.surname = data.parent.surname;
      appDatails.second_name = data.parent.second_name;
      appDatails.other_name = data.parent.other_names;
      appDatails.main_telephone_number = data.parent.telephone_number;
      appDatails.alternative_telephone_number = data.parent.alternative_number;
      appDatails.email = data.parent.email;
      appDatails.alternative_email = data.parent.alternative_email;
      appDatails.studentSurname = data.student.surname;
      appDatails.Studentsecond_name = data.student.second_name;
      appDatails.StudentOther_name = data.student.other_name;
      appDatails.StudentGender = data.student.gender;
      appDatails.StudentDate_of_birth = data.student.date_of_birth;
      appDatails.preferred_type_of_enrollment = data.preferred_type_of_enrollment;
      appDatails.preferred_campus_number = data.student.campus_class;
      appDatails.reason = data.student.reason_for_choosing_school;
      appDatails.status = data.status;
      appDatails.previousSchools = data.previous_schools;
      appDatails.student_number = data.student.number;
      appDatails.preferred_campus=data.student.preferred_campus;
      appDatails.previousSchoolsResults = data.previous_school_result

      let dataInfo = {
    campus_class_number:data.student.campus_class_number ,
  }
  applicationStore.fetchInterviewList(dataInfo)
    }
  },
  { deep: true }
);

// const getInterviewListData = (campusClassNumber) => {
//   let data = {
//     campus_class_number: campusClassNumber,
//   };
//   applicationStore.fetchInterviewList(data);
// };

const formData = reactive({
  interview_number: null,
});

function scheduleInterview() {
  buttonLoader.value = true;
  formData.student_number = appDatails.student_number;
  applicationStore.addStudentToInterview(formData);
}

const fetchCampuses = (school) => {
  campusStore.fetchCampuses(school);
};

watch(
  () => applicationStore.addStudentToInterviewResponse,
  async (data) => {
    if (data) {
      formData.interview_number = null;
      buttonLoader.value = false;
      // applicationStore.fetchApplicationList();
      notificationStore.successToast("Success", data.message);
    }
  },
  { deep: true }
);

watch(
  () => applicationStore.errorMessage,
  async (data) => {
    if (data) {
      formData.interview_number = null;
      errorMessage.value = data.message;
      buttonLoader.value = false;
    }
  },
  { deep: true }
);

watch(
  () => applicationStore.interviewListResponse,
  async (data) => {
    if (data) {
      interviewListData.value = data.data;
    }
  },
  { deep: true }
);

// watch(
//   () => applicationStore.previousSchoolResultsByStudentResponse,
//   async (data) => {
//     if (data) {
//       previousSchoolResultsData.value = data.data;
//     }
//   },
//   { deep: true }
// );

watch(
  () => campusStore.campusListResponse,
  async (data) => {
    if (data) {
      campusList.value = data.data;
    }
  },
  { deep: true }
);

watch(
  () => schoolStore.schoolsResponse,
  async (data) => {
    if (data) {
      schoolList.value = data.data;
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="container mt-2 mb-2">
    <div class="row mx-auto">
      <!-- Guardian/parent Details Card -->
      <div class="col-md-3">
        <div class="card mb-3">
          <div class="card-header">Guardian/parent Details</div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item" ><strong>Surname:</strong> {{ appDatails.surname }}</li>
            <li class="list-group-item"><strong>Second name:</strong> {{ appDatails.second_name }}</li>
            <li class="list-group-item"><strong>Other names:</strong> {{ appDatails.other_name }}</li>
            <li class="list-group-item"><strong>Telephone No.:</strong> {{ appDatails.main_telephone_number }}</li>
            <li class="list-group-item"><strong>Alternative No.:</strong> {{ appDatails.alternative_telephone_number }}</li>
            <li class="list-group-item"><strong>Email:</strong> {{ appDatails.email }}</li>
            <li class="list-group-item"><strong>Alternative Email:</strong> {{ appDatails.alternative_email }}</li>
          </ul>
        </div>
      </div>
      
      <!-- Learner Details Card -->
      <div class="col-md-3">
        <div class="card mb-3">
          <div class="card-header">Learner Details</div>
          <ul class="list-group list-group-flush">
           
            <li class="list-group-item"><strong>Surname:</strong> {{ appDatails.studentSurname }}</li>
            <li class="list-group-item"><strong>Second name:</strong> {{ appDatails.Studentsecond_name }}</li>
            <li class="list-group-item"><strong>Other names:</strong> {{ appDatails.StudentOther_name }}</li>
            <li class="list-group-item"><strong>Preferred Campus:</strong> {{ appDatails.preferred_campus }}</li>
            <li class="list-group-item"><strong>Preferred Class:</strong> {{ appDatails.preferred_campus_number }}</li>
            <li class="list-group-item"><strong>Reason:</strong> <i>{{ appDatails.reason }}</i></li>
            <li class="list-group-item"><strong>Age:</strong> {{ getAge(appDatails.StudentDate_of_birth) }}</li>
          </ul>
        </div>
      </div>
      
      <!-- Previous School Details Card -->
      <div class="col-md-3">
        <div class="card mb-3">
          <div class="card-header">Previous School Details</div>
          <ul class="list-group list-group-flush">
            {{ appDatails.previous_schools }}
            <li v-for="(school, index) in appDatails.previousSchools" :key="index" class="list-group-item">
              <strong>School:</strong> {{ school.name }}
              <ul>
                <li v-for="(cls, idx) in school.classes" :key="idx">
                  <strong>Class:</strong> {{ cls.class }}, <strong>Year:</strong> {{ cls.year }}
                </li>
              </ul>
            </li>
          </ul>

        

          <div class="container mt-3">
   <h4>Report</h4>
   <a :href="appDatails.previousSchoolsResults.report_file" download class="btn btn-primary mb-3">Download Report</a>
   
   <table class="table table-bordered table-striped" style="font-size: 14px;">
      <thead>
         <tr>
            <th>Subject</th>
            <th>Score</th>
         </tr>
      </thead>
      <tbody>
         <tr v-for="(subject, indx) in appDatails.previousSchoolsResults.subjects " :key="indx">
            <td>{{ subject.name }}</td>
            <td>{{ subject.score }}</td>
         </tr>
      </tbody>
   </table>
</div>

        </div>
      </div>

      <div class="col-md-3" v-if="appDatails.status === 'INTERVIEW_SCHEDULED'">
        <div class="card mb-3">
          <div class="card-header" style="background-color: #198754;"><b>STUDENT SCHEDULED FOR INTERVIEW ...</b> </div>
     
        </div>
      </div>
      
      <!-- Interview Scheduling Form Card -->
      <div class="col-md-3" v-if="appDatails.status === 'SUBMITTED'">
        <div class="card mb-3">
          <div class="card-header" style="background-color: #198754 !important; color:white;" >Interview Scheduling</div>
          <div class="card-body">
          
            <form @submit.prevent="scheduleInterview" v-if="interviewListData.length != 0">
              <div class="form-group">
                <label for="interview">Select Interview</label>
                <select v-model="formData.interview_number" id="interview" class="form-control" required>
                  <option v-for="interview in interviewListData" :value="interview.interview_number">{{ interview.name }}</option>
                </select>
              </div>
              <button type="submit" class="btn btn-success mt-3" :disabled="buttonLoader">
                {{ buttonLoader ? 'Scheduling...' : 'Schedule Interview' }}
              </button>
            </form>
         <p v-else class="alert alert-danger">No Interview(s) found  for <span style="color:green"> {{ appDatails.preferred_campus_number }}</span> !</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #007bff;
}

.card-header {
  background-color: #007bff;
  color: white;
}

.table th,
.table td {
  text-align: center;
}
.list-group-item{
  text-transform: capitalize !important;
}
</style>

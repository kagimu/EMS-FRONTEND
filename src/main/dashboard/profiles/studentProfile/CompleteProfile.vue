<script setup>
import {onMounted, ref, watch} from "vue"
import {useRouter} from "vue-router";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import { useAbility } from '@casl/vue';
const { can } = useAbility()
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import router from "@/config/router.js";
import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";
import { useUserStore } from "@/main/dashboard/profiles/store/users.js"
import api from "@/config/api.js";
import useCommonsStore from "@/composables/useCommons.js";
import printJS from "print-js";
const commons = useCommonsStore()
   
const userStore = useUserStore()
const enrollmentStore = useEnrolmentStore()
const studentNum = ref(null)
const routerData = useRouter()
const student_number = routerData.currentRoute.value.query.st_id
const applicationStore = useApplicationStore()
const studentName = ref(null)
const className= ref(null)
const dob = ref(null)
const academicYear = ref(null)
const studentPhoto = ref(null)
const studyPeriod=ref(null)
const stream = ref(null)
const status = ref(null)
const campus = ref(null)
const school = ref(null)
const actionType = ref(null)
const cateringStore = useCateringStore()
const errorMessage  = ref(null)
const studentProfileData  = ref(null)
const uploadDialog = ref( false)
const studentCateringData = ref([])
const studentProfileDataInLocalStorage = ref(null)

const familyStructureDataFather = ref([])
const familyStructureDataMother = ref([])
const familyStructureDataGuardian = ref([])
const languagesData = ref([])
const familyStructureData = ref([])
const emergencyData = ref([])
const medicalRecordsData = ref([])


onMounted(
     () => {
      getStudentProfileInfo()
       fetchFamilyStructure(routerData.currentRoute.value.query.st_id)
       fetchEmergencyData(routerData.currentRoute.value.query.st_id)
       fetchMedicalData(routerData.currentRoute.value.query.st_id)
    } )

const getStudentProfileInfo = () => {
  if(localStorage.getItem("studentProfileData")) {
    studentProfileDataInLocalStorage.value = JSON.parse(localStorage.getItem("studentProfileData"))
    studentProfileData.value = JSON.parse(localStorage.getItem("studentProfileData"))
    studentName.value = studentProfileDataInLocalStorage.value.surname + " " + studentProfileDataInLocalStorage.value.second_name+" "+ studentProfileDataInLocalStorage.value.other_name
    dob.value = studentProfileDataInLocalStorage.value.date_of_birth
    className.value = studentProfileDataInLocalStorage.value.current_enrollment.class
    studyPeriod.value = studentProfileDataInLocalStorage.value.current_enrollment.study_period
    stream.value = studentProfileDataInLocalStorage.value.current_enrollment.stream
    status.value = studentProfileDataInLocalStorage.value.current_enrollment.status
    campus.value = studentProfileDataInLocalStorage.value.current_enrollment.campus
    school.value = studentProfileDataInLocalStorage.value.current_enrollment.school
    academicYear.value = studentProfileDataInLocalStorage.value.current_enrollment.academic_year
    studentPhoto.value = studentProfileDataInLocalStorage.value.photo
    studentCateringData.value = localStorage.getItem("feedingGroupName")

  }else {
     applicationStore.fetchStudent(student_number)
  }
}

watch (
    () => applicationStore.studentDataResponse,
    async (data) => {
      if (data) {
        studentProfileData.value = data
        localStorage.setItem("studentProfileData", JSON.stringify(data))
        studentName.value = data.surname + " " + data.second_name+" "+ data.other_name
        dob.value = data.date_of_birth
        className.value = data.current_enrollment.class
        studyPeriod.value = data.current_enrollment.study_period
        stream.value = data.current_enrollment.stream
        status.value = data.current_enrollment.status
        campus.value = data.current_enrollment.campus
        school.value = data.current_enrollment.school
        academicYear.value = data.current_enrollment.academic_year
        studentPhoto.value = data.photo
         cateringStore.FeedingGroupByUserId(data.user_number)
      }
    },
    { deep: true }
)


watch (
    () => cateringStore.feedingGroupByUserIResponse,
    async (data) => {
      if (data) {
        studentCateringData.value = data.data.group_name
        localStorage.setItem("feedingGroupName",studentCateringData.value)
      }
    },
    { deep: true }
)

//terminate
const showActionDialog = ref(false)
const terminateEnrollment = (studentNo) =>{
  studentNum.value = studentNo
  actionType.value = "terminate"
  showActionDialog.value=true
}


watch (
    () => cateringStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
      }
    }
)

const  fetchFamilyStructure = async (data) => {
  await api.get("main/students/family-structure/"+data)
      .then((response) => {
        familyStructureData.value = response.data.data
        familyStructureDataFather.value = response.data.data.family_members.filter((item) => item.relationship === "FATHER")
        familyStructureDataMother.value = response.data.data.family_members.filter((item) => item.relationship === "MOTHER")
        familyStructureDataGuardian.value = response.data.data.family_members.filter((item) => item.relationship === "GUARDIAN")
        languagesData.value = response.data.data.languages

      })
      .catch((error) => {
        if(error && error.response){
        }
      })
}

const  fetchEmergencyData = async (data) => {
  await api.get("main/students/emergency-information/"+data)
      .then((response) => {
        emergencyData.value = response.data.data

      })
      .catch((error) => {
        if(error && error.response){

        }
      })
}

const  fetchMedicalData = async (data) => {
  await api.get("main/students/medical-records/"+data)
      .then((response) => {

        medicalRecordsData.value = response.data.data
      })
      .catch((error) => {
        if(error && error.response){
        }
      })
}

const printProfile = () => {
  printJS({
    printable: "profile",
    type: "html",
    targetStyles: ["*"],
    scanStyles: false,
    style: `
      body {
        font-family: Arial, sans-serif;
        color: #000;
        margin: 20px;
      }
    `,
    documentTitle: `StudentProfile`,
    showModal: true,
  });
};



</script>
<template>
  <button style="float:right;" class="btn btn-outline-primary btn-sm mb-2" @click="printProfile">Print</button>
  <section id="profile" style="background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div class="container py-5">
        <div class="row">

          <!-- Left Column: Student Photo & Bio -->
          <div class="col-lg-4">
            <div class="card shadow-sm border-0 mb-4 rounded-4">
              <div class="card-body text-center">
                <div class="mb-3">
                  <img v-if="studentPhoto" :src="studentPhoto" alt="Student Photo"
                       class="rounded-circle border border-2 border-primary shadow-sm"
                       style="width: 150px; height: 150px; object-fit: cover;" />
                  <i v-else class="bi-person-circle text-secondary" style="font-size: 100px;"></i>
                </div>
                <h5 class="card-title text-capitalize fw-semibold text-primary">{{ studentName }}</h5>
                <p class="text-muted"><i class="bi-calendar-date me-2"></i>{{ dob }}</p>
              </div>
            </div>

            <!-- Languages Spoken -->
            <div v-if="languagesData.length" class="card shadow-sm border-0 mb-4 rounded-4">
              <div class="card-body">
                <h5 class="mb-3 text-primary">Languages Spoken</h5>
                <ul class="list-unstyled mb-0">
                  <li v-for="lg in languagesData" :key="lg.number" class="text-muted"><i class="bi bi-check2-circle text-success me-2"></i>{{ lg.name }}</li>
                </ul>
              </div>
            </div>

            <!-- Emergency Contact -->
            <div v-if="emergencyData" class="card shadow-sm border-0 mb-4 rounded-4">
              <div class="card-body">
                <h5 class="mb-3 text-primary">Emergency Contact</h5>
                <p><strong>Primary Contact:</strong> <span class="text-muted">{{ emergencyData.contact_person }}</span></p>
                <p><strong>Phone:</strong> <span class="text-muted">{{ emergencyData.contact_person_phone }}</span></p>
                <p><strong>Alternative Contact:</strong> <span class="text-muted">{{ emergencyData.contact_person_alternative }}</span></p>
                <p><strong>Alt. Phone:</strong> <span class="text-muted">{{ emergencyData.contact_person_alternative_phone }}</span></p>
                <p><strong>Doctor:</strong> <span class="text-muted">{{ emergencyData.contact_doctor_name }}</span></p>
                <p><strong>Doctor's Phone:</strong> <span class="text-muted">{{ emergencyData.contact_doctor_phone }}</span></p>
              </div>
            </div>

            <!-- Medical Records -->
            <div v-if="medicalRecordsData" class="card shadow-sm border-0 rounded-4">
              <div class="card-body">
                <h5 class="mb-3 text-primary">Medical Records</h5>
                <p><strong>Blood Group:</strong> <span class="text-muted">{{ medicalRecordsData.blood_type_group }}</span></p>
                <p><strong>Allergies:</strong> <span class="text-muted">{{ medicalRecordsData.allergies }}</span></p>
                <p><strong>Condition:</strong> <span class="text-muted">{{ medicalRecordsData.existing_condition }}</span></p>
                <p><strong>Medication:</strong> <span class="text-muted">{{ medicalRecordsData.regular_medication }}</span></p>
                <p><strong>Doctor:</strong> <span class="text-muted">{{ medicalRecordsData.doctor_name }}</span></p>
                <p><strong>Doctor's Phone:</strong> <span class="text-muted">{{ medicalRecordsData.doctor_phone }}</span></p>
              </div>
            </div>
          </div>

          <!-- Right Column: Full Details -->
          <div class="col-lg-8">
            <!-- Academic Details -->
            <div class="card shadow-sm border-0 mb-4 rounded-4">
              <div class="card-body">
                <h5 class="mb-3 text-primary">Academic Details</h5>
                <div class="row">
                  <div class="col-md-6 mb-2"><strong>School:</strong> <span class="text-muted">{{ school }}</span></div>
                  <div class="col-md-6 mb-2"><strong>Campus:</strong> <span class="text-muted">{{ campus }}</span></div>
                  <div class="col-md-6 mb-2"><strong>Academic Year:</strong> <span class="text-muted">{{ academicYear }}</span></div>
                  <div class="col-md-6 mb-2"><strong>Study Period:</strong> <span class="text-muted">{{ studyPeriod }}</span></div>
                  <div class="col-md-6 mb-2"><strong>Class:</strong> <span class="text-muted">{{ className }}</span></div>
                  <div class="col-md-6 mb-2"><strong>Stream:</strong> <span class="text-muted">{{ stream }}</span></div>
                  <div class="col-md-6 mb-2"><strong>Feeding Group:</strong> <span class="text-muted">{{ studentCateringData }}</span></div>
                  <div class="col-md-6 mb-2">
                    <strong>Status:</strong>
                    <span :class="['badge rounded-pill px-3 py-1', status === 'ACTIVE' ? 'bg-success' : 'bg-danger']">{{ status }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Family Information -->
            <div v-if="familyStructureDataFather.length" class="card shadow-sm border-0 mb-4 rounded-4">
              <div class="card-body">
                <h5 class="mb-3 text-primary">Father</h5>
                <div v-for="father in familyStructureDataFather" :key="father.number" class="row">
                  <div class="col-md-6"><strong>Name:</strong> <span class="text-muted">{{ father.surname }} {{ father.other_name }}</span></div>
                  <div class="col-md-6"><strong>Living:</strong> <span class="text-muted">{{ father.is_living }}</span></div>
                  <div class="col-md-6"><strong>Employment:</strong> <span class="text-muted">{{ father.place_of_employment }}</span></div>
                  <div class="col-md-6"><strong>Address:</strong> <span class="text-muted">{{ father.physical_contact_address }}</span></div>
                  <div class="col-md-6"><strong>Phone:</strong> <span class="text-muted">{{ father.contacts?.[0]?.phone_number || 'N/A' }}</span></div>
                  <div class="col-md-6"><strong>Email:</strong> <span class="text-muted">{{ father.contacts?.[0]?.email || 'N/A' }}</span></div>
                </div>
              </div>
            </div>

            <div v-if="familyStructureDataMother.length" class="card shadow-sm border-0 mb-4 rounded-4">
              <div class="card-body">
                <h5 class="mb-3 text-primary">Mother</h5>
                <div v-for="mother in familyStructureDataMother" :key="mother.number" class="row">
                  <div class="col-md-6"><strong>Name:</strong> <span class="text-muted">{{ mother.surname }} {{ mother.other_name }}</span></div>
                  <div class="col-md-6"><strong>Living:</strong> <span class="text-muted">{{ mother.is_living }}</span></div>
                  <div class="col-md-6"><strong>Employment:</strong> <span class="text-muted">{{ mother.place_of_employment }}</span></div>
                  <div class="col-md-6"><strong>Address:</strong> <span class="text-muted">{{ mother.physical_contact_address }}</span></div>
                  <div class="col-md-6"><strong>Phone:</strong> <span class="text-muted">{{ mother.contacts?.[0]?.phone_number || 'N/A' }}</span></div>
                  <div class="col-md-6"><strong>Email:</strong> <span class="text-muted">{{ mother.contacts?.[0]?.email || 'N/A' }}</span></div>
                </div>
              </div>
            </div>

            <div v-if="familyStructureDataGuardian.length" class="card shadow-sm border-0 rounded-4">
              <div class="card-body">
                <h5 class="mb-3 text-primary">Guardian</h5>
                <div v-for="guardian in familyStructureDataGuardian" :key="guardian.number" class="row">
                  <div class="col-md-6"><strong>Name:</strong> <span class="text-muted">{{ guardian.surname }} {{ guardian.other_name }}</span></div>
                  <div class="col-md-6"><strong>Living:</strong> <span class="text-muted">{{ guardian.is_living }}</span></div>
                  <div class="col-md-6"><strong>Employment:</strong> <span class="text-muted">{{ guardian.place_of_employment }}</span></div>
                  <div class="col-md-6"><strong>Address:</strong> <span class="text-muted">{{ guardian.physical_contact_address }}</span></div>
                  <div class="col-md-6"><strong>Phone:</strong> <span class="text-muted">{{ guardian.contacts?.[0]?.phone_number || 'N/A' }}</span></div>
                  <div class="col-md-6"><strong>Email:</strong> <span class="text-muted">{{ guardian.contacts?.[0]?.email || 'N/A' }}</span></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
</template>


  
  

  
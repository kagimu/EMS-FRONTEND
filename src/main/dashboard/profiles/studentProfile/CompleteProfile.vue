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
        margin: 5px;
      }
    `,
    documentTitle: `StudentProfile`,
    showModal: true,
  });
};



</script>
<template>
  <button style="float:right;" class="btn btn-outline-primary btn-sm mb-2" @click="printProfile">Print</button>
<div id="profile">
  <section id="profile" style="background-color:#f8f9fa; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:40px 0;">
    <div style="width:100%; max-width:1200px; margin:0 auto;">
      <div style="display:flex; flex-wrap:wrap; gap:30px;">

        <!-- Left Column -->
        <div style="flex:1; min-width:300px; max-width:400px;">

          <!-- Profile Card -->
          <div style="background-color:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); padding:20px; text-align:center; margin-bottom:30px;">
            <div style="margin-bottom:20px;">
              <img v-if="studentPhoto" :src="studentPhoto" alt="Student Photo" style="border-radius:50%; border:2px solid #0d6efd; width:150px; height:150px; object-fit:cover;" />
              <i v-else class="bi-person-circle" style="font-size:100px; color:#6c757d;"></i>
            </div>
            <h5 style="text-transform:capitalize; color:#0d6efd; margin-bottom:10px;">{{ studentName }}</h5>
            <p style="color:#6c757d; margin:0;"><i class="bi-calendar-date" style="margin-right:8px;"></i>{{ dob }}</p>
          </div>

          <!-- Languages -->
          <div v-if="languagesData.length" style="background-color:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); padding:20px; margin-bottom:30px;">
            <h5 style="color:#0d6efd; margin-bottom:16px;">Languages Spoken</h5>
            <ul style="list-style-type:none; padding-left:0; margin:0;">
              <li v-for="lg in languagesData" :key="lg.number" style="color:#6c757d; margin-bottom:8px;">• {{ lg.name }}</li>
            </ul>
          </div>

          <!-- Emergency Contact -->
          <div v-if="emergencyData" style="background-color:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); padding:20px; margin-bottom:30px;">
            <h5 style="color:#0d6efd; margin-bottom:16px;">Emergency Contact</h5>
            <p><strong>Primary Contact:</strong> <span style="color:#6c757d;">{{ emergencyData.contact_person }}</span></p>
            <p><strong>Phone:</strong> <span style="color:#6c757d;">{{ emergencyData.contact_person_phone }}</span></p>
            <p><strong>Alternative Contact:</strong> <span style="color:#6c757d;">{{ emergencyData.contact_person_alternative }}</span></p>
            <p><strong>Alt. Phone:</strong> <span style="color:#6c757d;">{{ emergencyData.contact_person_alternative_phone }}</span></p>
            <p><strong>Doctor:</strong> <span style="color:#6c757d;">{{ emergencyData.contact_doctor_name }}</span></p>
            <p><strong>Doctor's Phone:</strong> <span style="color:#6c757d;">{{ emergencyData.contact_doctor_phone }}</span></p>
          </div>

          <!-- Medical Records -->
          <div v-if="medicalRecordsData" style="background-color:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); padding:20px;">
            <h5 style="color:#0d6efd; margin-bottom:16px;">Medical Records</h5>
            <p><strong>Blood Group:</strong> <span style="color:#6c757d;">{{ medicalRecordsData.blood_type_group }}</span></p>
            <p><strong>Allergies:</strong> <span style="color:#6c757d;">{{ medicalRecordsData.allergies }}</span></p>
            <p><strong>Condition:</strong> <span style="color:#6c757d;">{{ medicalRecordsData.existing_condition }}</span></p>
            <p><strong>Medication:</strong> <span style="color:#6c757d;">{{ medicalRecordsData.regular_medication }}</span></p>
            <p><strong>Doctor:</strong> <span style="color:#6c757d;">{{ medicalRecordsData.doctor_name }}</span></p>
            <p><strong>Doctor's Phone:</strong> <span style="color:#6c757d;">{{ medicalRecordsData.doctor_phone }}</span></p>
          </div>
        </div>

        <!-- Right Column -->
        <div style="flex:2; min-width:300px;">

          <!-- Academic Details -->
          <div style="background-color:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); padding:20px; margin-bottom:30px;">
            <h5 style="color:#0d6efd; margin-bottom:20px;">Academic Details</h5>
            <div style="display:flex; flex-wrap:wrap;">
              <div style="width:50%; padding:5px;"><strong>School:</strong> <span style="color:#6c757d;">{{ school }}</span></div>
              <div style="width:50%; padding:5px;"><strong>Campus:</strong> <span style="color:#6c757d;">{{ campus }}</span></div>
              <div style="width:50%; padding:5px;"><strong>Academic Year:</strong> <span style="color:#6c757d;">{{ academicYear }}</span></div>
              <div style="width:50%; padding:5px;"><strong>Study Period:</strong> <span style="color:#6c757d;">{{ studyPeriod }}</span></div>
              <div style="width:50%; padding:5px;"><strong>Class:</strong> <span style="color:#6c757d;">{{ className }}</span></div>
              <div style="width:50%; padding:5px;"><strong>Stream:</strong> <span style="color:#6c757d;">{{ stream }}</span></div>
              <div style="width:50%; padding:5px;"><strong>Feeding Group:</strong> <span style="color:#6c757d;">{{ studentCateringData }}</span></div>
              <div style="width:50%; padding:5px;"><strong>Status:</strong>
                <span :style="status === 'ACTIVE' ? 'color:white; background-color:green; border-radius:20px; padding:4px 12px;' : 'color:white; background-color:red; border-radius:20px; padding:4px 12px;'">{{ status }}</span>
              </div>
            </div>
          </div>

          <!-- Father -->
          <div v-if="familyStructureDataFather.length" style="background-color:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); padding:20px; margin-bottom:30px;">
            <h5 style="color:#0d6efd; margin-bottom:20px;">Father</h5>
            <div v-for="father in familyStructureDataFather" :key="father.number" style="margin-bottom:15px;">
              <p><strong>Name:</strong> <span style="color:#6c757d;">{{ father.surname }} {{ father.other_name }}</span></p>
              <p><strong>Living:</strong> <span style="color:#6c757d;">{{ father.is_living }}</span></p>
              <p><strong>Employment:</strong> <span style="color:#6c757d;">{{ father.place_of_employment }}</span></p>
              <p><strong>Address:</strong> <span style="color:#6c757d;">{{ father.physical_contact_address }}</span></p>
              <p><strong>Phone:</strong> <span style="color:#6c757d;">{{ father.contacts?.[0]?.phone_number || 'N/A' }}</span></p>
              <p><strong>Email:</strong> <span style="color:#6c757d;">{{ father.contacts?.[0]?.email || 'N/A' }}</span></p>
            </div>
          </div>

          <!-- Mother -->
          <div v-if="familyStructureDataMother.length" style="background-color:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); padding:20px; margin-bottom:30px;">
            <h5 style="color:#0d6efd; margin-bottom:20px;">Mother</h5>
            <div v-for="mother in familyStructureDataMother" :key="mother.number" style="margin-bottom:15px;">
              <p><strong>Name:</strong> <span style="color:#6c757d;">{{ mother.surname }} {{ mother.other_name }}</span></p>
              <p><strong>Living:</strong> <span style="color:#6c757d;">{{ mother.is_living }}</span></p>
              <p><strong>Employment:</strong> <span style="color:#6c757d;">{{ mother.place_of_employment }}</span></p>
              <p><strong>Address:</strong> <span style="color:#6c757d;">{{ mother.physical_contact_address }}</span></p>
              <p><strong>Phone:</strong> <span style="color:#6c757d;">{{ mother.contacts?.[0]?.phone_number || 'N/A' }}</span></p>
              <p><strong>Email:</strong> <span style="color:#6c757d;">{{ mother.contacts?.[0]?.email || 'N/A' }}</span></p>
            </div>
          </div>

          <!-- Guardian -->
          <div v-if="familyStructureDataGuardian.length" style="background-color:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); padding:20px;">
            <h5 style="color:#0d6efd; margin-bottom:20px;">Guardian</h5>
            <div v-for="guardian in familyStructureDataGuardian" :key="guardian.number" style="margin-bottom:15px;">
              <p><strong>Name:</strong> <span style="color:#6c757d;">{{ guardian.surname }} {{ guardian.other_name }}</span></p>
              <p><strong>Living:</strong> <span style="color:#6c757d;">{{ guardian.is_living }}</span></p>
              <p><strong>Employment:</strong> <span style="color:#6c757d;">{{ guardian.place_of_employment }}</span></p>
              <p><strong>Address:</strong> <span style="color:#6c757d;">{{ guardian.physical_contact_address }}</span></p>
              <p><strong>Phone:</strong> <span style="color:#6c757d;">{{ guardian.contacts?.[0]?.phone_number || 'N/A' }}</span></p>
              <p><strong>Email:</strong> <span style="color:#6c757d;">{{ guardian.contacts?.[0]?.email || 'N/A' }}</span></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</div>
</template>





  
  

  
<script setup>

import {reactive, ref, onMounted, watch} from "vue";
import api from "@/config/api.js";
import useNotificationStore from "@/composables/useNotification.js";

const buttonLoader = ref(false)
const emit = defineEmits()
const notificationStore  = useNotificationStore()
const medicalRecordsData = ref([])

const props = defineProps({
  studentProfileData:{},
})


onMounted(() => {
  getStudentNumber()
} )


const getStudentNumber = () => {
  let draftData = props.studentProfileData?.current_enrollment?.student_number
  if(draftData) {
    fetchMedicalData(draftData)
  }
}


watch(
    () => props.studentProfileData,
    async (data) => {
      if(data){
        getStudentNumber()
      }
    }
)

const form = reactive({
  blood_type_group:null,
  allergies:null,
  existing_condition:null,
  regular_medication:null,
  doctor_name:null,
  doctor_phone:null,
})

const addMedicalRecords = () => {
  buttonLoader.value = true
  form.value.student_number = props.studentProfileData?.current_enrollment?.student_number
  saveMedicalRecords(form.value)
  // emit("next", 5)
}

const  saveMedicalRecords = async (data) => {
  await api.post("main/students/medical-records", data)
      .then((response) => {
        buttonLoader.value = false
        // levelResponse.value = response.data
        notificationStore.successToast("Success",response.data.message)
      })
      .catch((error) => {
        if(error && error.response){
          notificationStore.errorToast("Error",error.response.data.message)
        }
      })
}

/*const backPage = () => {
  emit("next", 3 )
}*/


const  fetchMedicalData = async (data) => {
  await api.get("main/students/medical-records/"+data)
      .then((response) => {
        buttonLoader.value = false
        // notificationStore.successToast("Success",response.data.message)
        medicalRecordsData.value = response.data.data
        form.blood_type_group = medicalRecordsData.value.blood_type_group
            form.allergies = response.data.data.allergies
            form.existing_condition = response.data.data.existing_condition
            form.regular_medication = response.data.data.regular_medication
            form.doctor_name = response.data.data.doctor_name
            form.doctor_phone = response.data.data.doctor_phone

      })
      .catch((error) => {
        if(error && error.response){
          notificationStore.errorToast("Error",error.response.data.message)
        }
      })
}

const medicalFields = {
  blood_type_group: "Blood Type",
  allergies: "Allergies",
  existing_condition: "Existing Condition",
  regular_medication: "Regular Medication",
  doctor_name: "Doctor's Name",
  doctor_phone: "Doctor's Phone"
};

</script>
<template>


  <section class="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-10" v-if="medicalRecordsData.length !== 0">
    <!-- Medical Records -->
    <div>
      <div class="flex items-center justify-between mb-6 border-b pb-2">
        <h3 class="text-xs font-semibold text-gray-800">Medical Records</h3>
        <button class="text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md shadow-sm transition">
          Update
        </button>
      </div>
      <div class="overflow-x-auto bg-gray-50 border rounded-xl p-5 shadow-sm">
        <table class="min-w-full text-sm text-left text-gray-700">
          <tbody>
          <tr v-for="(label, key) in medicalFields" :key="key" class="border-b">
            <th class="py-3 pr-6 font-medium text-gray-600 w-1/3">{{ label }}</th>
            <td class="py-3 text-gray-800">{{ medicalRecordsData[key] || 'N/A' }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>


  <div v-else>
    <p class="ml-4 mt-4 mb-10"> MEDICAL RECORDS </p>

    <form @submit.prevent="addMedicalRecords">
      <div class="row mx-auto">
        <div class="col-6">


          <div>
            <div class="mb-2">
              <label class="text-sm">Blood Type/Group</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;"  v-model="form.blood_type_group" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Allergies</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.allergies" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Existing Conditions</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.existing_condition" required class="form-control form-control-sm">
            </div>

          </div>


        </div>
        <div class="col-6">

          <div>
            <div class="mb-2">
              <label class="text-sm">Regular Medication</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.regular_medication" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Doctor's Name</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.doctor_name" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Doctor's Phone</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.doctor_phone" required class="form-control form-control-sm">
            </div>

          </div>


        </div>
      </div>

      <hr />

      <div class="flex justify-end mt-4">

<!--        <button type="button" @click="backPage" class="btn btn-outline-secondary mb-2 ml-4">
          Back
        </button>-->

        <button type="submit" class="btn btn-primary mb-2 mr-4" v-if="medicalRecordsData.length === 0">
          Submit
          <span class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </span>
        </button>
        <button type="submit" class="btn btn-secondary mb-2 mr-4" v-else>
          Update
          <span class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </span>
        </button>


      </div>


    </form>

  </div>
</template>



<style scoped>

</style>
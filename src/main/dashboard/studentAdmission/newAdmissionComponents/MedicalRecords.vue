<script setup>

import {reactive, ref, onMounted, watch} from "vue";
import api from "@/config/api.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";

const routerData = useRouter()
const student_number = routerData.currentRoute.value.query.st_id
const buttonLoader = ref(false)
const emit = defineEmits()
const notificationStore  = useNotificationStore()
const medicalRecordsData = ref([])
const studentNo = ref(null)

const props = defineProps({
  studentProfileData:{},
  studentNumber:String
})


onMounted(() => {
  getStudentNumber()
} )


const getStudentNumber = () => {
  let no = props.studentNumber
  if(no) {
    studentNo.value = no
    // form.value.student_number = no
    fetchMedicalData(no)
  }else if(student_number){
    studentNo.value = student_number
    fetchMedicalData(student_number)
  }
}


watch(
    () => props.studentNumber,
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
  student_number:null
})

const addMedicalRecords = () => {
  buttonLoader.value = true
  form.student_number = studentNo.value
  saveMedicalRecords(form)
  // emit("next", 5)
}

const  saveMedicalRecords = async (data) => {
  await api.post("main/students/medical-records", data)
      .then((response) => {
        buttonLoader.value = false
        // levelResponse.value = response.data
        notificationStore.successToast("Success",response.data.message)
        emit("next", {step:3})
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
          // notificationStore.errorToast("Error",error.response.data.message)
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

const backPage = () => {
  emit("next", {step:1})
}
</script>
<template>


  <div>
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

      <div :class="!student_number ? 'flex justify-between mt-4':'flex justify-end mt-4'" >

     <button v-if="!student_number" type="button" @click="backPage" class="btn btn-outline-secondary mb-2 ml-4">
          Back
        </button>

        <button type="submit" class="btn btn-primary mb-2 mr-4" >
         <span v-if="!student_number"> <small>Submit</small></span><span v-else><small>Update</small></span>
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
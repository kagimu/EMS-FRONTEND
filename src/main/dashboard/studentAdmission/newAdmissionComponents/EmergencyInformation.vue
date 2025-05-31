<script setup>

import {reactive, ref,onMounted,watch} from "vue";
import api from "@/config/api.js";
import useNotificationStore from "@/composables/useNotification.js";
import useCommonsStore from "@/composables/useCommons.js";

const buttonLoader = ref(false)
const emit = defineEmits()
const commons = useCommonsStore()
const notificationStore  = useNotificationStore()
const emergencyData = ref([])

const form = reactive({
  contact_person:null,
  contact_person_phone:null,
  contact_person_alternative:null,
  contact_person_alternative_phone:null,
  contact_doctor_name:null,
  contact_doctor_phone:null,
})

const props = defineProps({
  studentProfileData:{},
})


onMounted(() => {
  getStudentNumber()
} )


const getStudentNumber = () => {
  let draftData = props.studentProfileData?.current_enrollment?.student_number
  if(draftData) {
    fetchEmergencyData(draftData)
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

const addEmergencyInformation = () => {
  // emit("next", 6)
  buttonLoader.value = true
  form.student_number = props.studentProfileData?.current_enrollment?.student_number
  saveEmergencyInformation(form)
}

/*const backPage = () => {
  // emit("next", 4 )
}*/


const  saveEmergencyInformation = async (data) => {
  await api.post("main/students/emergency-information", data)
      .then((response) => {
        buttonLoader.value = false
        // levelResponse.value = response.data
        notificationStore.successToast("Success",response.data.message)
      })
      .catch((error) => {
        if(error && error.response){
          // errorMessage.value = error.response.data.message

          buttonLoader.value = false
          notificationStore.errorToast("Error",error.response.data.message)
        }
      })
}
const handleInput3 = () => {
  if (form.contact_person_phone.length > 15) {
    form.contact_person_phone = form.contact_person_phone.slice(0, 15);
  }
}

const handleInput2 = () => {
  if (form.contact_person_alternative_phone.length > 15) {
    form.contact_person_alternative_phone = form.contact_person_alternative_phone.slice(0, 15);
  }
}

const handleInput = () => {
  if (form.contact_doctor_phone.length > 15) {
    form.contact_doctor_phone = form.contact_doctor_phone.slice(0, 15);
  }
}


const  fetchEmergencyData = async (data) => {
  await api.get("main/students/emergency-information/"+data)
      .then((response) => {
        buttonLoader.value = false
        // notificationStore.successToast("Success",response.data.message)
        emergencyData.value = response.data.data
        
        
      })
      .catch((error) => {
        if(error && error.response){
          notificationStore.errorToast("Error",error.response.data.message)
        }
      })
}




const emergencyFields = {
  contact_person: "Primary Contact Person",
  contact_person_phone: "Primary Contact Phone",
  contact_person_alternative: "Alternative Contact Person",
  contact_person_alternative_phone: "Alternative Contact Phone",
  contact_doctor_name: "Doctor's Name",
  contact_doctor_phone: "Doctor's Phone"
};


</script>
<template>

  <section class="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-10" v-if="emergencyData.length !== 0">
    <!-- Emergency Contacts -->
    <div>
      <div class="flex items-center justify-between mb-6 border-b pb-2">
        <h3 class="text-xs font-semibold text-gray-800">Emergency Contact Information</h3>
        <button class="text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md shadow-sm transition">
          Update
        </button>
      </div>
      <div class="overflow-x-auto bg-gray-50 border rounded-xl p-5 shadow-sm">
        <table class="min-w-full text-sm text-left text-gray-700">
          <tbody>
          <tr v-for="(label, key) in emergencyFields" :key="key" class="border-b">
            <th class="py-3 pr-6 font-medium text-gray-600 w-1/3">{{ label }}</th>
            <td class="py-3 text-gray-800">{{ emergencyData[key] || 'N/A' }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>



  <div v-else>
    <p class="ml-4 mt-4 mb-10"> EMERGENCY INFORMATION </p>


    <form @submit.prevent="addEmergencyInformation">
      <div class="row mx-auto">
        <div class="col-6">


          <div>
            <div class="mb-2">
              <label class="text-sm">Full Name of person to be contacted first in case of emergency</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.contact_person" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Telephone Contact of first person</label>
              <vue-tel-input
                  @input="handleInput3"
                  @keypress="commons.onlyNumberValidator($event)"
                  style="padding:0; outline: none 0 !important; box-shadow: none;"
                  class="form-control"
                  :input-options="{placeholder: ''}"
                  v-model="form.contact_person_phone"
                  :dropdown-options="{ showDialCodeInSelection: true, showFlags: true, showDialCodeInList: true}"
                  :preferredCountries="['UG']"
                  mode="international"></vue-tel-input>
            </div>

            <div class="mb-2">
              <label class="text-sm">Full Name of Alternative person to be contacted in case of emergency</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.contact_person_alternative" required class="form-control form-control-sm">
            </div>

          </div>


        </div>
        <div class="col-6">

          <div>
            <div class="mb-2">
              <label class="text-sm">Telephone Contact of alternative person</label>
              <vue-tel-input
                  @input="handleInput2"
                  @keypress="commons.onlyNumberValidator($event)"
                  style="padding:0; outline: none 0 !important; box-shadow: none;"
                  class="form-control"
                  :input-options="{placeholder: ''}"
                  v-model="form.contact_person_alternative_phone"
                  :dropdown-options="{ showDialCodeInSelection: true, showFlags: true, showDialCodeInList: true}"
                  :preferredCountries="['UG']"
                  mode="international"></vue-tel-input>
            </div>

            <div class="mb-2">
              <label class="text-sm">Full Name of Doctor to be contacted in case of direct emergency attention</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.contact_doctor_name" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Telephone contact of Doctor</label>
              <vue-tel-input
                  @input="handleInput"
                  @keypress="commons.onlyNumberValidator($event)"
                  style="padding:0; outline: none 0 !important; box-shadow: none;"
                  class="form-control"
                  :input-options="{placeholder: ''}"
                  v-model="form.contact_doctor_phone"
                  :dropdown-options="{ showDialCodeInSelection: true, showFlags: true, showDialCodeInList: true}"
                  :preferredCountries="['UG']"
                  mode="international"></vue-tel-input>
            </div>

          </div>


        </div>
      </div>

<!--      <hr />-->



      <div class="flex justify-end mt-4 w-full">

<!--        <button type="button" @click="backPage" class="btn btn-outline-secondary mb-2 ml-4">
          Back
        </button>-->

       <div>
         <button type="submit" class="btn btn-primary mb-2 mr-4">
           Save
           <span class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </span>
         </button>
       </div>

      </div>


    </form>

  </div>
</template>



<style scoped>

</style>
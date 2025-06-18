<script setup>

import {reactive, ref,onMounted,watch} from "vue";
import api from "@/config/api.js";
import useNotificationStore from "@/composables/useNotification.js";
import useCommonsStore from "@/composables/useCommons.js";
import {useRouter} from "vue-router";
const routerData = useRouter()
const student_number = routerData.currentRoute.value.query.st_id

const buttonLoader = ref(false)
const emit = defineEmits()
const commons = useCommonsStore()
const notificationStore  = useNotificationStore()
const emergencyData = ref([])
const studentNo = ref(null)



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
    fetchEmergencyData(no)
  }else if(student_number){
     studentNo.value = student_number
    // form.value.student_number = no
    fetchEmergencyData(student_number)
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

const addEmergencyInformation = () => {
  // emit("next", 6)
  buttonLoader.value = true
  form.student_number = studentNo.value
  saveEmergencyInformation(form)
}

const backPage = () => {
  emit("next", {step:2})
}

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
        form.contact_person = emergencyData.value.contact_person
        form.contact_person_phone = emergencyData.value.contact_person_phone
        form.contact_person_alternative = emergencyData.value.contact_person_alternative
        form.contact_person_alternative_phone = emergencyData.value.contact_person_alternative_phone
        form.contact_doctor_name = emergencyData.value.contact_doctor_name
        form.contact_doctor_phone = emergencyData.value.contact_doctor_phone

      })
      .catch((error) => {
        if(error && error.response){
          // notificationStore.errorToast("Error",error.response.data.message)
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

  <div >
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



      <div >

<!--        <button type="button" @click="backPage" class="btn btn-outline-secondary mb-2 ml-4">
          Back
        </button>-->

       <div class="flex justify-end mt-4 w-full" v-if="student_number" >

         <button type="submit" class="btn btn-primary mb-2 mr-4">
           <small>Update</small>
           <span class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </span>
         </button>
       </div>
        <div class="flex justify-between mt-4 w-full" v-else >
          <button  type="button" @click="backPage" class="btn btn-outline-secondary">Back</button>
          <button type="submit" class="btn btn-primary mb-2 mr-4">
            Submit
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
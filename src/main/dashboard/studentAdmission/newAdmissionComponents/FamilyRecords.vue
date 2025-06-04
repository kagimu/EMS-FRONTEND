<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import api from "@/config/api.js";
import useNotificationStore from "@/composables/useNotification.js";
import useCommonsStore from "@/composables/useCommons.js";

const emit = defineEmits()
const commons = useCommonsStore()
const notificationStore  = useNotificationStore()
const familyStructureData = ref([])
const buttonLoader = ref(false)
const phoneList = ref([{ phone_number: "", email: "" }])
const LanguagesList = ref([{ code:1,languages: "" }])
const addPhone = () => phoneList.value.push({ phone_number: "", email: "" })
const removePhone = (index) => phoneList.value.splice(index, 1)
const addLanguage = () => LanguagesList.value.push({ code:1,languages: "" })
const removeLanguage = (index) => LanguagesList.value.splice(index, 1)
const familyMembers = []

const props = defineProps({
  studentProfileData:{},
})

const studentNumber = props.studentProfileData?.current_enrollment?.student_number

const form = ref({
  relationship:null,
  surname: null,
  other_name: null,
  parent_living: null,
  place_of_employment: null,
  physical_contact_address: null,
})


onMounted(() => {
  getStudentNumber()
} )


const getStudentNumber = () => {
let draftData = props.studentProfileData?.current_enrollment?.student_number
  if(draftData) {
    fetchFamilyStructure(draftData)
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

const contactDetails = []
phoneList.value.forEach(p => {
  if (p.phone_number) contactDetails.push(p.phone_number)
  if (p.email) contactDetails.push(p.email)
})



const addAnotherFamilyMember = () => {

}


const submitForm = () => {
  buttonLoader.value = true
  const LanguageListData = []
  LanguagesList.value.forEach(p => {
    if (p.code) LanguageListData.push(p.code)
    if (p.languages) LanguageListData.push(p.languages)
  })



  if (form.value.surname || form.value.other_name) {
    familyMembers.push({
      relationship: form.value.relationship,
      student_number: studentNumber,
      surname: form.value.surname,
      other_name: form.value.other_name,
      place_of_employment: form.value.place_of_employment,
      physical_contact_address: form.value.physical_contact_address,
      contacts: contactDetails
    })
  }


  const finalData = {
    student_number: studentNumber,
    family_members: familyMembers,
    languages: LanguagesList.value
  }

  buttonLoader.value = true
  form.value.student_number = props.studentProfileData?.current_enrollment?.student_number
  saveFamilyStructure(finalData)
  // alert(JSON.stringify(finalData))
  buttonLoader.value = false
}

const  saveFamilyStructure = async (data) => {
  await api.post("main/students/family-structure", data)
      .then((response) => {
        buttonLoader.value = false
        notificationStore.successToast("Success",response.data.message)
        emit("next", {step:2})
      })
      .catch((error) => {
        if(error && error.response){
          notificationStore.errorToast("Error",error.response.data.message)
        }
      })
}


const  fetchFamilyStructure = async (data) => {
  await api.get("main/students/family-structure/"+data)
    .then((response) => {
      buttonLoader.value = false
      // notificationStore.successToast("Success",response.data.message)
      familyStructureData.value = response.data.data
    })
    .catch((error) => {
      if(error && error.response){
        notificationStore.errorToast("Error",error.response.data.message)
      }
    })
}

</script>

<template>
  <div>
    <form @submit.prevent="submitForm">
      <div class="row mx-auto">
        <div class="col-12">

          <table>
            <tr>
          <div>
            <div class="row mx-auto mt-2">
              <div class="col-6 ">

                <div class="mb-2">
                  <label class="text-sm">Surname Name *</label>
                  <input type="text" v-model="form.surname" required class="form-control form-control-sm">
                </div>
                <div class="mb-2">
                  <label class="text-sm">Other Names *</label>
                  <input type="text" v-model="form.other_name" required class="form-control form-control-sm">
                </div>

                <div class="row">
                  <div class="mb-2 col-8">
                    <label class="text-sm">Relationship *</label>
                    <input type="text" v-model="form.relationship" required class="form-control form-control-sm" placeholder="Father , Mother, Guardian ...">
                  </div>

                  <div class="mb-2 col-4">
                    <label class="text-sm">Is Living *</label>
                    <select class="form-select form-control-sm" v-model="form.parent_living" required>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                </div>

              </div>
              <div class="col-6">
                <div class="mb-2">
                  <label class="text-sm">Place of Employment *</label>
                  <input type="text" v-model="form.place_of_employment" required class="form-control form-control-sm">
                </div>

                <div class="mb-2">
                  <label class="text-sm">Physical Contact Address *</label>
                  <input type="text" v-model="form.physical_contact_address" required class="form-control form-control-sm">
                </div>
                <div class="mb-2">
                  <label class="text-sm">Contact Details</label>
                  <table>
                    <tr v-for="(lst, index) in phoneList" :key="index">
                      <td><input type="text" v-model="lst.phone_number" required class="form-control form-control-sm" placeholder="Phone number"></td>
                      <td><input type="email" v-model="lst.email" required class="form-control form-control-sm" placeholder="Email"></td>
                      <td>
                        <button class="btn-sm" @click.prevent="removePhone(index)">🗑</button>
                      </td>
                    </tr>
                  </table>
                  <button style="float: right" class="btn btn-primary btn-sm mt-2" @click.prevent="addPhone">+ Add Contacts</button>
                </div>
              </div>
            </div>
          </div>
            </tr>
          </table>

          <button class="btn btn-outline-success  mt-2 btn-sm2" @click.prevent="addAnotherFamilyMember">+ Add Another Family Member</button>
        </div>
      </div>


      <hr />
      <div class="row mx-auto mt-2">
        <div class="col-12">
      <label class="text-sm">Languages</label>
      <table>
        <tr v-for="(lst, index) in LanguagesList" :key="index">
          <td><input type="number" v-model="lst.code" required class="form-control" placeholder="code"></td>
          <td><input type="text" v-model="lst.languages" required class="form-control" placeholder="Language"></td>
          <td><button class="btn-sm" @click.prevent="removeLanguage(index)">🗑</button></td>
        </tr>
      </table>
      <button class="btn btn-primary btn-sm mt-2 " @click.prevent="addLanguage">+ Add Language</button>
      </div>
      </div>
      <hr />

      <div class="flex justify-between mt-4">
        <button  type="button" @click="" class="btn btn-outline-secondary">Back</button>
        <button type="submit" class="btn btn-primary">NEXT
          <span v-if="buttonLoader" class="spinner-border spinner-border-sm"></span>
        </button>
      </div>
    </form>
  </div>
</template>


<style scoped>
button.btn-sm {
  background-color: transparent;
  border: none;
  color: #d70606;
  font-size: 13px;
}

button.btn-sm2 {
  //background-color: transparent;
  border: none;
  font-size: 13px;
}
</style>

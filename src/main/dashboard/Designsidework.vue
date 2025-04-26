<script setup>

import {ref} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import api from "@/config/api.js";
const buttonLoader = ref(false)
const emit = defineEmits()
const notificationStore  = useNotificationStore()

const phoneList = ref([
  {phone_number: ""}
])

const emailList = ref([
  {email: ""}
])

const phoneMotherList = ref([
  {mothers_phone: ""}
])

const emailMotherList = ref([
  {mothers_email: ""}
])
// LanguagesList

const LanguagesList = ref([
  {languages: ""}
])

const phoneGuadianList = ref([
  {guardians_phone: ""}
])


const emailGuadianList = ref([
  {guardians_email: ""}
])

const form = ref({
  surname:null,
  place_of_employment:null,
  parent_living:null,
  other_name:null,
  physical_contact_address:null,
  family_name_of_mother:null,
  mothers_place_of_employment:null,
  mother_living:null,
  mothers_other_names:null,
  family_name_of_guardian:null,
  guardians_place_of_employment:null,
  guardians_other_names:null,
  guardians_physical_contact_address:null,
})

const props = defineProps({
  studentProfileData:{},
})


const  saveFamilyStructure = async (data) => {
  await api.post("main/students/family-structure", data)
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

const addPhone = () => {
  phoneList.value.push({"phone_number":""})
}

const removePhone = (index) => {
  phoneList.value.splice(index,1)
}

const addEmail = () => {
  emailList.value.push({"email":""})
}

const removeEmail = (index) => {
  emailList.value.splice(index,1)
}

const addMotherEmail = () => {
  emailMotherList.value.push({"mothers_email":""})
}

const removeMotherEmail = (index) => {
  emailMotherList.value.splice(index,1)
}

const addMotherPhone = () => {
  phoneMotherList.value.push({"mothers_phone":""})
}

const removeMotherPhone = (index) => {
  phoneMotherList.value.splice(index,1)
}

const addLanguage = () => {
  LanguagesList.value.push({"languages":""})
}

const removeLanguage = (index) => {
  LanguagesList.value.splice(index,1)
}


const addGuadianPhone = () => {
  phoneGuadianList.value.push({"languages":""})
}

const removeGuadianPhone = (index) => {
  phoneGuadianList.value.splice(index,1)
}


const addGuadianEmail = () => {
  emailGuadianList.value.push({"guardians_email":""})
}

const removeGuadianEmail = (index) => {
  emailGuadianList.value.splice(index,1)
}


const addFamilyStructure = () => {
  // form.value.student_number = props.studentProfileData?.current_enrollment?.student_number
  // form.phone_number = phoneList.value
  // form.email = emailList.value
  // form.mothers_phone = phoneMotherList.value
  // form.mothers_email = emailMotherList.value
  // form.guardians_phone = phoneGuadianList.value
  // form.guardians_email = emailGuadianList.value
  // form.languages = LanguagesList.value

  let data = {
    surname: form.value.surname,
    place_of_employment: form.value.place_of_employment,
    parent_living: form.value.parent_living,
    other_name: form.value.other_name,
    physical_contact_address: form.value.physical_contact_address,
    family_name_of_mother: form.value.family_name_of_mother,
    mothers_place_of_employment: form.value.mothers_place_of_employment,
    mother_living: form.value.mother_living,
    mothers_other_names: form.value.mothers_other_names,
    family_name_of_guardian: form.value.family_name_of_guardian,
    guardians_place_of_employment: form.value.guardians_place_of_employment,
    guardians_other_names: form.value.guardians_other_names,
    guardians_physical_contact_address: form.value.guardians_physical_contact_address,
    student_number: props.studentProfileData?.current_enrollment?.student_number,
    phone_number:phoneList.value,
    email:emailList.value,
    mothers_phone:phoneMotherList.value,
    mothers_email:emailMotherList.value,
    guadian_phone:phoneGuadianList.value,
    guadian_email:emailGuadianList.value,
    language:LanguagesList.value

  }

  alert(JSON.stringify(data))

  // saveFamilyStructure(form.value)
}



</script>
<template>
<div>

  <p class="ml-4 mt-4 mb-10"> FAMILY STRUCTURE </p>

  <form @submit.prevent="addFamilyStructure">
    <div class="row mx-auto">
      <div class="col-6">

<p>Father</p>
        <hr />
        <div class="row mx-auto">
          <div class="col-12">

            <div class="mb-2">
              <label class="text-sm">Family Name of Father *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" 
              v-model="form.surname" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Fathers Other names  *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.other_name" required class="form-control form-control-sm">
            </div>

            
            <div class="mb-2">
              <label class="text-sm">Is Father Living *</label>
              <select style="font-size: 13px; outline: none 0 !important; box-shadow: none;" class="form-select form-control-sm" v-model="form.parent_living" aria-label="Default select example">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div class="mb-2">
              <label class="text-sm">Father's Place of Employment *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.place_of_employment" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Father's Physical Contact Address  *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.physical_contact_address" required class="form-control form-control-sm">
            </div>
          </div>


         <div>
            <div class="mb-2" >
              <label class="text-sm">Father's Phone</label>
              <table>
                <tr v-for="(lst, index) in phoneList" :key="index">
                  <td><input  style="outline: none 0 !important; box-shadow: none;" type="text" v-model="lst.phone_number" 
                  required class="form-control form-control-sm" placeholder="Phone number "> </td>
                  <td>
                   
                    <button
                class="link link-danger btn-sm text-xs"
                @click.prevent="removePhone(index)" style="color:red; border:1px solid red;border-radius:16px;">
                <i class="bi bi-x"></i>
            </button>
                  </td>
                </tr>
                <button
                class="btn btn-primary btn-sm text-xs"
                @click.prevent="addPhone">
                <i class="bi bi-plus"></i>
            </button>
              </table>
            </div>

            <div class="mb-2">
              <label class="text-sm">Father's Email </label>

              <table>
                <tr v-for="(lst, index) in emailList" :key="index">
                  <td><input  style="outline: none 0 !important; box-shadow: none;" type="email" v-model="lst.email" 
                  required class="form-control form-control-sm" placeholder="Phone number "> </td>
                  <td>
                   
                    <button
                class="link link-danger btn-sm text-xs"
                @click.prevent="removeEmail(index)" style="color:red; border:1px solid red;border-radius:16px;">
                <i class="bi bi-x"></i>
            </button>
                  </td>
                </tr>
                <button
                class="btn btn-primary btn-sm text-xs"
                @click.prevent="addEmail">
                <i class="bi bi-plus"></i>
            </button>
              </table>
            </div>


          </div>
        
        </div>

      </div>
      <div class="col-6">
        <p>Mother</p>
        <hr />


        <div class="row mx-auto">
          <div class="col-12">

            <div class="mb-2">
              <label class="text-sm">Family Name of Mother *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.family_name_of_mother" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Mother Other names  *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.mothers_other_names" required class="form-control form-control-sm">
            </div>

            
            <div class="mb-2">
              <label class="text-sm">Is Mother Living *</label>
              <select style="font-size: 13px; outline: none 0 !important; box-shadow: none;" class="form-select form-control-sm" v-model="form.mother_living" aria-label="Default select example">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div class="mb-2">
              <label class="text-sm">Mother's Place of Employment *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.mothers_place_of_employment" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Mother's Physical Contact Address  *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.mothers_physical_contact_address" required class="form-control form-control-sm">
            </div>
          </div>


         <div>
            <div class="mb-2" >
              <label class="text-sm">Mother's Phone</label>
              <table>
                <tr v-for="(lst, index) in phoneMotherList" :key="index">
                  <td><input  style="outline: none 0 !important; box-shadow: none;" type="text" v-model="lst.mothers_phone" 
                  required class="form-control form-control-sm" placeholder="Phone number "> </td>
                  <td>
                   
                    <button
                class="link link-danger btn-sm text-xs"
                @click.prevent="removeMotherPhone(index)" style="color:red; border:1px solid red;border-radius:16px;">
                <i class="bi bi-x"></i>
            </button>
                  </td>
                </tr>
                <button
                class="btn btn-primary btn-sm text-xs"
                @click.prevent="addMotherPhone">
                <i class="bi bi-plus"></i>
            </button>
              </table>
            </div>

            <div class="mb-2">
              <label class="text-sm">Mother's Email </label>

              <table>
                <tr v-for="(lst, index) in emailMotherList" :key="index">
                  <td><input  style="outline: none 0 !important; box-shadow: none;" type="email" v-model="lst.mother_email" 
                  required class="form-control form-control-sm" placeholder="Email .."> </td>
                  <td>
                   
                    <button
                class="link link-danger btn-sm text-xs"
                @click.prevent="removeMotherEmail(index)" style="color:red; border:1px solid red;border-radius:16px;">
                <i class="bi bi-x"></i>
            </button>
                  </td>
                </tr>
                <button
                class="btn btn-primary btn-sm text-xs"
                @click.prevent="addMotherEmail">
                <i class="bi bi-plus"></i>
            </button>
              </table>
            </div>


          </div>
        
        </div>

      </div>

      <div class="col-12">
        <div class="mt-5">
            <p>Guardian</p>
            <hr />
            <div class="row mx-auto">
              <div class="col-6">

                <div class="mb-2">
                  <label class="text-sm">Family Name of Guardian</label>
                  <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.family_name_of_guardian" required class="form-control form-control-sm">
                </div>

                <div class="mb-2">
                  <label class="text-sm">Guardian's Other names</label>
                  <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.guardians_other_names" required class="form-control form-control-sm">
                </div>

                <div class="mb-2">
                  <label class="text-sm">Guardian's Physical Contact Address</label>
                  <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.guardians_physical_contact_address" required class="form-control form-control-sm">
                </div>

                <div class="mb-2">
                  <label class="text-sm">Guardian's Place of Employment</label>
                  <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.guardians_place_of_employment" required class="form-control form-control-sm">
                </div>

                <div class="mb-2">
                  <label class="text-sm">Guardian's Phone</label>
                </div>
                <table>
                <tr v-for="(lst, index) in phoneGuadianList" :key="index">
                  <td><input  style="outline: none 0 !important; box-shadow: none;" type="text" v-model="lst.guardians_phone" 
                  required class="form-control form-control-sm" placeholder="Phone number "> </td>
                  <td>
                   
                    <button
                class="link link-danger btn-sm text-xs"
                @click.prevent="removeGuadianPhone(index)" style="color:red; border:1px solid red;border-radius:16px;">
                <i class="bi bi-x"></i>
            </button>
                  </td>
                </tr>
                <button
                class="btn btn-primary btn-sm text-xs"
                @click.prevent="addGuadianPhone">
                <i class="bi bi-plus"></i>
            </button>
              </table>

                <div class="mb-2">
                  <label class="text-sm">Guardian's Email</label>
                                
                  <table>
                <tr v-for="(lst, index) in emailGuadianList" :key="index">
                  <td><input  style="outline: none 0 !important; box-shadow: none;" type="text" v-model="lst.guardians_email" 
                  required class="form-control form-control-sm" placeholder="Phone number "> </td>
                  <td>
                   
                    <button
                class="link link-danger btn-sm text-xs"
                @click.prevent="removeGuadianEmail(index)" style="color:red; border:1px solid red;border-radius:16px;">
                <i class="bi bi-x"></i>
            </button>
                  </td>
                </tr>
                <button
                class="btn btn-primary btn-sm text-xs"
                @click.prevent="addGuadianEmail">
                <i class="bi bi-plus"></i>
            </button>
              </table> 
                </div>
              </div>
              <div class="col-6">
                <p>Language</p>
                <hr />

                <table>
                <tr v-for="(lst, index) in LanguagesList" :key="index">
                  <td><input  style="outline: none 0 !important; box-shadow: none;" type="text" v-model="lst.languages" 
                  required class="form-control form-control-sm" placeholder="Enter Lanaguage"> </td>
                  <td>
                   
                    <button
                class="link link-danger btn-sm text-xs"
                @click.prevent="removeLanguage(index)" style="color:red; border:1px solid red;border-radius:16px;">
                <i class="bi bi-x"></i>
            </button>
                  </td>
                </tr>
                <button
                class="btn btn-primary btn-sm text-xs"
                @click.prevent="addLanguage">
                <i class="bi bi-plus"></i>
            </button>
          </table>

              </div>
            </div>
           
        </div>
      </div>

     

    </div>

    <hr />

    <div class="flex justify-end mt-4">

<!--      <button type="button" @click="backPage" class="btn btn-outline-secondary mb-2 ml-4">
        Back
      </button>-->

      <button type="submit" class="btn btn-primary mb-2 mr-4">
        Next
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
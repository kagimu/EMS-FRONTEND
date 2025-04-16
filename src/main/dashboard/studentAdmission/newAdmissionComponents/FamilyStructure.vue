<script setup>

import {ref} from "vue";
import api from "@/config/api.js";
const buttonLoader = ref(false)
const emit = defineEmits()
const form = ref({
  family_name_of_father:null,
  fathers_place_of_employment:null,
  fathers_phone1:null,
  fathers_email1:null,
  father_living:null,
  fathers_other_names:null,
  fathers_physical_contact_address:null,
  fathers_phone2:null,
  fathers_email2:null,
  family_name_of_mother:null,
  mothers_place_of_employment:null,
  mothers_phone1:null,
  mothers_email1:null,
  mother_living:null,
  mothers_other_names:null,
  mothers_phone2:null,
  mothers_email2:null,
  family_name_of_guardian:null,
  guardians_place_of_employment:null,
  guardians_phone1:null,
  guardians_email1:null,
  guardians_other_names:null,
  guardians_physical_contact_address:null,
  guardians_phone2:null,
  guardians_email2:null,
  languages:null,
})

const addFamilyStructure = () => {
  // emit("next", 4)
  form.value.student_number = props.studentProfileData?.current_enrollment?.student_number
  saveFamilyStructure(form.value)
}

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
          <div class="col-6">

            <div class="mb-2">
              <label class="text-sm">Family Name of Father *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.family_name_of_father" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Father's Place of Employment *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.fathers_place_of_employment" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Father's Phone 1  *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.fathers_phone1" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Father's Email 1</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.fathers_email1" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Is Father Living *</label>
              <select style="font-size: 13px; outline: none 0 !important; box-shadow: none;" class="form-select form-control-sm" v-model="form.father_living" aria-label="Default select example">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

          </div>
          <div class="col-6">

            <div class="mb-2">
              <label class="text-sm">Fathers Other names  *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.fathers_other_names" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Father's Physical Contact Address  *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.fathers_physical_contact_address" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Father's Phone 2</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.fathers_phone2" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Fathers Email 2</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.fathers_email2" required class="form-control form-control-sm">
            </div>

          </div>
        </div>

      </div>
      <div class="col-6">
        <p>Mother</p>
        <hr />
        <div class="row mx-auto">
          <div class="col-6">

            <div class="mb-2">
              <label class="text-sm">Family Name of Mother *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.family_name_of_mother" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Mother's Place of Employment  *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.mothers_place_of_employment" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Mothers Phone 1  *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.mothers_phone1" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Mother's Email 1</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.mothers_email1" required class="form-control form-control-sm">
            </div>


            <div class="mb-2">
              <label class="text-sm">Is Mother Living *</label>
              <select style="font-size: 13px; outline: none 0 !important; box-shadow: none;" class="form-select form-control-sm" v-model="form.mother_living" aria-label="Default select example">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>


          </div>
          <div class="col-6">

            <div class="mb-2">
              <label class="text-sm">Mothers Other names *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.mothers_other_names" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Mother's Physical Contact Address  *</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.mothers_other_names" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Mother's Phone 2</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.mothers_phone2" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Mother's Email 2</label>
              <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.mothers_email2" required class="form-control form-control-sm">
            </div>

          </div>
        </div>

      </div>

      <div class="col-6">
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
                  <label class="text-sm">Guardian's Place of Employment</label>
                  <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.guardians_place_of_employment" required class="form-control form-control-sm">
                </div>

                <div class="mb-2">
                  <label class="text-sm">Guardian's Phone 1</label>
                  <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.guardians_phone1" required class="form-control form-control-sm">
                </div>

                <div class="mb-2">
                  <label class="text-sm">Guardian's Email 1</label>
                  <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.guardians_email1" required class="form-control form-control-sm">
                </div>


              </div>
              <div class="col-6">

                <div class="mb-2">
                  <label class="text-sm">Guardian's Other names</label>
                  <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.guardians_other_names" required class="form-control form-control-sm">
                </div>

                <div class="mb-2">
                  <label class="text-sm">Guardian's Physical Contact Address</label>
                  <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.guardians_physical_contact_address" required class="form-control form-control-sm">
                </div>

                <div class="mb-2">
                  <label class="text-sm">Guardian's Phone 2</label>
                  <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.guardians_phone2" required class="form-control form-control-sm">
                </div>

                <div class="mb-2">
                  <label class="text-sm">Guardian's Email 2</label>
                  <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.guardians_email2" required class="form-control form-control-sm">
                </div>

              </div>
            </div>
        </div>
      </div>

      <div class="col-6">
        <div class="mt-5">
          <p>Language</p>
          <hr />
          <div>
          <div class="mb-2">
            <label class="text-sm">1st Language at Home  *</label>
            <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.languages" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="text-sm">2nd Language at Home</label>
            <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.languages" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="text-sm">3rd Language at Home</label>
            <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.languages" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="text-sm">4th Language at Home</label>
            <input style="outline: none 0 !important; box-shadow: none;" type="text" v-model="form.languages" required class="form-control form-control-sm">
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
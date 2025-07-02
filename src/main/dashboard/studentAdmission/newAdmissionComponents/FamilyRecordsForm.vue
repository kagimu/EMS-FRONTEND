<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import api from "@/config/api.js";
import useNotificationStore from "@/composables/useNotification.js";
import useCommonsStore from "@/composables/useCommons.js";
const emit = defineEmits()
const commons = useCommonsStore()
const notificationStore  = useNotificationStore()
const buttonLoader = ref(false)


const props = defineProps({
  studentProfileData:{},
  title:String,
  familyStructureData:{}
})

const studentNumber = props.studentProfileData?.current_enrollment?.student_number

const form = ref({
  relationship:null,
  surname: null,
  other_name: null,
  parent_living: null,
  place_of_employment: null,
  physical_contact_address: null,
  contacts:[]
})

const addPhone = () => {
 form.value.contacts.push({phone_number:null,email:null})
}

const removePhone = (index) => {
  form.value.contacts.splice(index, 1)
}

onMounted(() => {
  getFamilyData()
} )


// function handleInput(data) {
//   if (data ==="contacts" && form.value.contacts[0].phone_number.length > 15) {
//     form.main_telephone_number = form.main_telephone_number.slice(0, 15);
//   }
// }

watch(
    () => form.value,
    async (data) => {
      if(data){
        emit("parentInfo", data)
      }
    },
    { deep: true }
)

const getFamilyData = () => {
  let draft = props.familyStructureData[0]
  if (draft) {
    // alert(draft.relationship)
    form.value.relationship = draft.relationship
    form.value.surname = draft.surname
    form.value.other_name = draft.other_name
    form.value.parent_living = draft.is_living
    form.value.place_of_employment = draft.place_of_employment
    form.value.physical_contact_address = draft.physical_contact_address
    form.value.contacts = draft.contacts || []
  }
}

watch(
    () => props.familyStructureData,
    async (data) => {
      if(data){
        getFamilyData()
      }
    },
    { deep: true }
)
</script>

<template>
  <div>
    {{title}}
<!--    {{familyStructureData}}-->
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
                  <table >
                    <tr v-for="(lst, index) in form.contacts" :key="index">
<!--                      <td><input type="text" v-model="lst.phone_number" required class="form-control form-control-sm" placeholder="Phone number"></td>-->
                      <td><vue-tel-input
                          @input="handleInput('contacts')"
                          @keypress="commons.onlyNumberValidator($event)"
                          style="padding:0; outline: none 0 !important; box-shadow: none;"
                          class="form-control"
                          :input-options="{placeholder: ''}"
                          v-model="lst.phone_number"
                          :dropdown-options="{ showDialCodeInSelection: true, showFlags: true, showDialCodeInList: true}"
                          :preferredCountries="['UG']"
                          mode="international"></vue-tel-input></td>
                      <td><input type="email"  v-model="lst.email" required class="form-control " placeholder="Email"></td>
                      <td>
                        <button class="btn-sm" @click.prevent="removePhone(index)">x
                        </button>
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

        </div>
      </div>
      <hr />


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

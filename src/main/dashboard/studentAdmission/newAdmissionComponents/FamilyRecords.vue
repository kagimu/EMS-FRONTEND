<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import api from "@/config/api.js";
import useNotificationStore from "@/composables/useNotification.js";
import useCommonsStore from "@/composables/useCommons.js";
import FamilyRecordsForm from "./FamilyRecordsForm.vue";

const emit = defineEmits()
const commons = useCommonsStore()
const notificationStore  = useNotificationStore()
const familyStructureData = ref([])
const buttonLoader = ref(false)
const phoneList = ref([{ phone_number: "", email: "" }])
const LanguagesList = ref([{ code:1,languages: "" }])
const addPhone = () => phoneList.value.push({ phone_number: "", email: "" })
const removePhone = (index) => phoneList.value.splice(index, 1)
const familyMembers = []

const studentNo = ref(null)
const props = defineProps({
  studentProfileData:{},
  studentNumber:String
})


const form = ref({
    student_number:null,
    family_members :[
  // {
  //   relationship:null,
  //   student_number:null,
  //   surname:null,
  //   other_name:null,
  //   place_of_employment:null,
  //   physical_contact_address:null,
  //   contacts:[]
  // }
],
    languages:[{code:1,name:null}]
})

onMounted(() => {
  getStudentNumber()
} )



const getStudentNumber = () => {
  let no = props.studentNumber
  if(no) {
    studentNo.value = no
    form.value.student_number = no
    fetchFamilyStructure(no)
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

const addLanguage = () => {
  form.value.languages.push({code:(form.value.languages.length + 1),name: null })
}

const removeLanguage = (index) => {
  form.value.languages.splice(index, 1)
}


const submitForm = () => {
  // alert(JSON.stringify(form.value))
  saveFamilyStructure(form.value)
}

const  saveFamilyStructure = async (data) => {
  await api.post("main/students/family-structure", data)
      .then((response) => {
        buttonLoader.value = true
        notificationStore.successToast("Success",response.data.message)
        familyStructureData.value = response.data
        emit("next", {step:2})
      })
      .catch((error) => {
        if(error && error.response){
          notificationStore.errorToast("Error",error.response.data.message)
        }
      })
}

const familyStructureDataFather = ref([])
const familyStructureDataMother = ref([])
const familyStructureDataGuardian = ref([])
const languagesData = ref([])

const  fetchFamilyStructure = async (data) => {
  await api.get("main/students/family-structure/"+data)
    .then((response) => {
      buttonLoader.value = false
      // notificationStore.successToast("Success",response.data.message)
      familyStructureData.value = response.data.data
      familyStructureDataFather.value = response.data.data.family_members.filter((item) => item.relationship === "FATHER")
      familyStructureDataMother.value = response.data.data.family_members.filter((item) => item.relationship === "MOTHER")
      familyStructureDataGuardian.value = response.data.data.family_members.filter((item) => item.relationship === "GUARDIAN")
      languagesData.value = response.data.data.languages

      form.value.languages  = languagesData.value.map(lang => ({
        name: lang.Name,
        code: lang.Code
      }));


    })
    .catch((error) => {
      if(error && error.response){
        // notificationStore.errorToast("Error",error.response.data.message)
      }
    })
}

const updateFatherDetails = (data) => {

  if(data){
    data.relationship = "FATHER"
    data.student_number = studentNo.value
    form.value.family_members[0] = data
  }

}
const updateMotherDetails = (data) => {
  if(data){
    data.relationship = "MOTHER"
    data.student_number = studentNo.value
    form.value.family_members[1] = data
  }
}
const updateGuardianDetails = (data) => {
  if(data){
    data.relationship = "GUARDIAN"
    data.student_number = studentNo.value
    form.value.family_members[2] = data
  }
}

</script>

<template>
<!--{{form}}-->
<!--  {{familyStructureData}}-->
<!--  {{languagesData}}-->
  <div>
    <!--father-->
    <family-records-form
        title="Father"
        @parentInfo="updateFatherDetails"
        :familyStructureData="familyStructureDataFather"
    >
    </family-records-form>
    <!-- mother-->
    <family-records-form
        title="Mother"
        @parentInfo="updateMotherDetails"
        :familyStructureData="familyStructureDataMother"
    >
    </family-records-form>
    <!-- guardian-->
    <family-records-form
        title="Guardian"
        @parentInfo="updateGuardianDetails"
        :familyStructureData="familyStructureDataGuardian"
    >
    </family-records-form>
    <div class="row mx-auto mt-2">
      <div class="col-12">
<!--        {{form.languages }}-->
<!--        {{form.languages}}-->
        <label class="text-sm">Languages</label>
        <table>
          <tr v-for="(lst, index) in form.languages" :key="index">
            <td class="w-[25%]"><input  type="number" v-model="lst.code" required class="form-control" placeholder="code"></td>
            <td><input type="text" v-model="lst.name" required class="form-control" placeholder="Language"></td>
            <td><button class="btn-sm" @click.prevent="removeLanguage(index)">x
            </button></td>
          </tr>
        </table>
        <button class="btn btn-primary btn-sm mt-2 " @click.prevent="addLanguage">+ Add Language</button>
      </div>
    </div>

    <div class="flex justify-end mt-4">
<!--      <button  type="button" @click="" class="btn btn-outline-secondary">Back</button>-->

      <button type="submit" class="btn btn-primary" @click.prevent="submitForm">Submit
        <span v-if="buttonLoader" class="spinner-border spinner-border-sm"></span>
      </button>
    </div>
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

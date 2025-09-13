<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAbility } from '@casl/vue';
import useCommonsStore from "@/composables/useCommons.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useStudyModeStore} from "@/main/settings/mode-of-study/store/studyMode.js";

const { can } = useAbility()
const errorMessage = ref(null)

const  notificationStore  = useNotificationStore()
const buttonLoader = ref(false)
const commons = useCommonsStore()
const schoolStore = useSchoolStore()
const schoolList = ref([])
const mode_of_study_number = ref(null)
const modeStudyStore = useStudyModeStore()

const props = defineProps(
    {
        modeOfStudyList:{}
    }
)


const form = reactive({
  code:null,
  name:null,
  school_number:null,
})

onMounted(() => {
      schoolStore.fetchSchools()
      checkModeOfStudyInfo()
    }
)

watch (
    () => props.modeOfStudyList,
    async (data) => {
      if(data){
        checkModeOfStudyInfo()
      }
    }
)

const checkModeOfStudyInfo = () => {
  let draft = props.modeOfStudyList
  if(draft){
        // form.code = draft?.code
        form.name = draft?.name
        form.school_number = draft?.school_number
    form.code = draft?.code
        mode_of_study_number.value = draft?.mode_of_study_number
  }
}


const createModeOfStudy = () => {

  buttonLoader.value = true
  form.code = parseInt(form.code)

  if(mode_of_study_number.value){
    form.mode_of_study_number = mode_of_study_number.value
    modeStudyStore.editModeOfStudy(form)
  }else {
    // alert(JSON.stringify(form))
    modeStudyStore.newModeOfStudy(form)
  }

}
watch (
    () => modeStudyStore.newModeOfStudyResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        // form.code = null
        form.name = null
        form.school_number = null
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch (
    () => modeStudyStore.updateModeOfStudyInfoResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        form.name = null
        form.school_number = null
        notificationStore.successToast("Success", data.message)
      }
    }
)


// watch(() => form.code, (newValue, oldValue) => {
//   if (newValue !== null && isNaN(newValue)) {
//     form.code = oldValue
//     notificationStore.errorToast("Warning", "Code must be a number.")
//   }
// })


watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    }
)

watch (
    () => modeStudyStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    }
)

</script>
<template>
    <div>
<form @submit.prevent="createModeOfStudy">
<div class="">

  <div class="mb-2">
    <label class="text-sm"><small>Code</small></label>
    <input
        v-model="form.code"
        @keypress="commons.codeValidator($event)"
        maxlength="10"
        @paste.prevent
        type="text"
        required class="form-control shadow-none">
  </div>

  <div class="mb-2">
  <label class="text-sm"><small>School</small> </label>
  <select
      v-model="form.school_number"
      class="form-select form-select-sm" required
      style="box-shadow: none;"
  >
    <option disabled :value="null">--Select School--</option>
    <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
    </option>
  </select>
</div>



            <div class="mb-2">
            <label class="text-sm"><small>Name</small></label>
            <input v-model="form.name"   type="text" required class="form-control shadow-none">


    </div>




<div class="flex flex-grow justify-between mt-4">
  &nbsp;
    <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-10">
      <i class="bi bi-arrow-right-circle"></i>&nbsp;<small class="ml-1">{{mode_of_study_number ? "Update" : "submit"}}</small>
    <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
        <span class="visually-hidden">Loading...</span>
    </div></button>
</div>

</div>

</form>
    </div>
</template>
 

<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAssessmentStore } from "../store/assessment";
import useCommonsStore from "@/composables/useCommons.js";
import {useRouter} from "vue-router";

const commons = useCommonsStore()
const assessmentStore = useAssessmentStore()

const  notificationStore  = useNotificationStore()
const routerData = useRouter()
const buttonLoader = ref(false)
const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const yesd = ref(null)
onMounted(
    () =>{
      getGradeDataInfo()
    }
)

const props = defineProps({
  gradeDataInfo:{}
})

const form = reactive({
  code: null,
  name:null,
})

const chan = () => {
  yesd.value = "yes"
}

const addGrade = () => {
  buttonLoader.value = true
  if(props.gradeDataInfo.number){
    let formData = {
    name: form.name,
    code :parseInt(form.code),
    number:props.gradeDataInfo.number
    }
    // alert(JSON.stringify(formData))
    assessmentStore.updateGrade(formData)
  }else{
  form.code = parseInt(form.code)
  buttonLoader.value = true
  assessmentStore.createGrade(form)
  }
 
  // form.code = parseInt(form.code)
  // buttonLoader.value = true
  // assessmentStore.createGrade(form)
}

const getGradeDataInfo= () => {
  if(props.gradeDataInfo){
    let draft = props.gradeDataInfo
     form.name = draft.name
     form.code = draft.code   
  }
}

watch(
    () => assessmentStore.newGradeResponse,
    async (data) => {
      if(data){
            form.name = null
      }
    }
)

watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

watch(
    () => assessmentStore.updateGradeResponse,
    async (data) => {
      if(data){
        gradeDataInfo.value = null
      }
    }
)
</script>

<template>
    <div>
        <div class="modal-content">
<!-- {{ gradeDataInfo.number }} -->
      <div class="modal-body">
        <form @submit.prevent="addGrade()">


          <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Code</div>
            <input
                @keypress="commons.codeValidator($event)"
                maxlength="10"
                v-model="form.code"
                required
                @paste.prevent
                class="form-control form-select-sm shadow-none">
          </div>

        <div class="mb-2">
          <div class="text-[13px] text-[#505050]"> Name</div>
         <input v-model="form.name" type="text" class="form-control shadow-none" placeholder="F9, D1">
        </div>

        <div class="mb-2">
          <div class="text-[13px] text-[#505050]">   <input @change="chan" v-model="yesd" type="checkbox"> &nbsp; Requires Attachment    </div>
        </div>

        <div class="mb-2" v-if="yesd == 'yes'">
          <div class="text-[13px] text-[#505050]">   Upload Attachment    </div>
          <input  class="form-control" type="file">
        </div>

     <div class="flex justify-content-end mt-4" style="width: 100%;">
            <button type="submit" class="btn btn-primary border-0 btn-sm">
                 <small><i class="bi bi-save"></i> submit</small>
                 <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                      role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span> 
                    </span>
            </button>
        </div>
    </form>
    </div>
    </div>
    </div>

</template>



<style scoped>
.noFocus:focus {
outline: none 0 !important;
box-shadow: none;
-moz-box-shadow: none;
-webkit-box-shadow: none;
}
</style>
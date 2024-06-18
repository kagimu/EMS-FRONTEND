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
let schoolNumber = routerData.currentRoute.value.query.sch


const props = defineProps({
  gradeDataInfo:{}
})

const form = reactive({
  code: null,
  name:null,
  short_name:null,
  weight:null,
  description:null,
})


onMounted(
    () =>{
      getGradeDataInfo()
    }
)


watch(
    () => props.gradeDataInfo,
    async (data) => {
      if(data){
        getGradeDataInfo()
      }
    }
)


const getGradeDataInfo = () => {
  if(props.gradeDataInfo){
    let draft = props.gradeDataInfo
        form.code = draft?.code ?? ""
        form.name  = draft?.name ?? ""
        form.short_name  = draft?.short_name ?? ""
        form.weight  = draft?.weight ?? ""
        form.description  = draft?.description ?? ""
  }
}






const addGrade = () => {
  buttonLoader.value = true

  form.code = parseInt(form.code)
  form.weight = parseInt(form.weight)
  form.school_number = schoolNumber
  if(props.gradeDataInfo.number){
    form.number = props.gradeDataInfo.number
    assessmentStore.updateGrade(form)
  }else{
  buttonLoader.value = true
  assessmentStore.createGrade(form)
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
            <div class="text-[13px] text-[#505050]"> Sorting Code</div>
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
         <input v-model="form.name" type="text" class="form-control shadow-none" placeholder="Distinction 1, Fail 9">
        </div>

          <div class="mb-2">
          <div class="text-[13px] text-[#505050]"> Short Name</div>
         <input v-model="form.short_name" type="text" class="form-control shadow-none" placeholder="D1, F9">
        </div>

          <div class="mb-2">
          <div class="text-[13px] text-[#505050]"> Weight</div>
         <input v-model="form.weight" type="text" class="form-control shadow-none" placeholder="1,9">
        </div>

          <div class="mb-2">
            <label class="textColor"><small>Description</small></label>
            <textarea
                placeholder="Very Good"
                style="outline: none 0 !important; box-shadow: none;"
                type="text" v-model="form.description"
                required
                class="form-control form-select-sm"></textarea>
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
<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAssessmentStore } from "../store/assessment";
import useCommonsStore from "@/composables/useCommons.js";
import {useRouter} from "vue-router";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

const emit = defineEmits(["closeGrade"])
const routerData = useRouter()
let schoolNumber = routerData.currentRoute.value.query.sch
const commons = useCommonsStore()
const assessmentStore = useAssessmentStore()
const schoolStore = useSchoolStore()
const  notificationStore  = useNotificationStore()



const aggregateGroupData = ref([])
const schoolList = ref([])
const errorMessage = ref("")
const buttonLoader = ref(false)

const props = defineProps({
  gradeDataInfo:{}
})

const form = reactive({
  code: null,
  name:null,
  short_name:null,
  school_number:schoolNumber,
  // grade_group_number:""
})


onMounted(
    () =>{
      schoolStore.fetchSchools()
      getGradeDataInfo()
      assessmentStore.fetchAggregateGroupName(schoolNumber)
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
  let draft = props.gradeDataInfo
  if(draft){
    form.code = draft?.code ?? ""
    form.name  = draft?.name ?? ""
    form.short_name  = draft?.short_name ?? ""
    // form.grade_group_number  = draft?.group_number ?? ""
  }
}






const addGrade = () => {
  buttonLoader.value = true
  errorMessage.value = ""

  form.code = parseInt(form.code)
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
    () => assessmentStore.aggregateNameGroupResponse,
    async (data) => {
      if(data){
        aggregateGroupData.value = data.gradeGroups
      }
    }
)

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    }
)


watch(
    () => assessmentStore.newGradeResponse,
    async (data) => {
      if(data){
            form.name = null
            form.code = null
            form.short_name = null
            buttonLoader.value = false

      }
    }
)

watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        buttonLoader.value = false
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    }
)

watch(
    () => assessmentStore.updateGradeResponse,
    async (data) => {
      if(data){
        gradeDataInfo.value = null
      }
    }
)

const closeGradeModal = () => {
  emit("closeGrade")
}
</script>

<template>
    <div>
        <div class="modal-content">

      <div class="modal-body">

        <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
          {{errorMessage}}
        </div>

        <form @submit.prevent="addGrade()">


          <div class="mb-2">
            <div class="text-[13px] text-[#505050]">Code</div>
            <input
                @keypress="commons.codeValidator($event)"
                maxlength="10"
                v-model="form.code"
                required
                @paste.prevent
                class="form-control form-select-sm shadow-none">
          </div>


<!--
          <div class="mb-2">
            <div class="text-[13px] text-[#505050]">Aggregate Group Name</div>
              <select
                  class="form-select form-select-sm shadow-none" required
                  v-model="form.grade_group_number"
              >
                <option disabled value="">&#45;&#45;Select Aggregate Group&#45;&#45;</option>
                <option v-for="(list,index) in aggregateGroupData" :key="index" :value="list.number">{{ list.name }}</option>
              </select>
            </div>
-->

          <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Short Code</div>
            <input v-model="form.short_name" type="text" class="form-control shadow-none" placeholder="D1, F9">
          </div>

        <div class="mb-2">
          <div class="text-[13px] text-[#505050]"> Name</div>
         <input v-model="form.name" type="text" class="form-control shadow-none" placeholder="Distinction 1, Fail 9">
        </div>



        <div class="flex justify-content-between mt-4" style="width: 100%;">
          <button type="button" class="btn btn-danger border-0 btn-sm" @click="closeGradeModal">
            <div class="px-3">
              <small>Close</small>
            </div>
          </button>
            <button type="submit" class="btn btn-primary border-0 btn-sm">
              <div class="px-3">
                <small> {{gradeDataInfo?.number ? "Edit" : "Submit"}} </small>
                <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                       role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span>
                    </span>
              </div>
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
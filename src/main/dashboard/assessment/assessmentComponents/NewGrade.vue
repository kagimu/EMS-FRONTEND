<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAssessmentStore } from "../store/assessment";
import useCommonsStore from "@/composables/useCommons.js";
import {useRouter} from "vue-router";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

const commons = useCommonsStore()
const assessmentStore = useAssessmentStore()
const requiresAttachment = ref(false)
const schoolList = ref([])
const schoolStore = useSchoolStore()
const  notificationStore  = useNotificationStore()
const routerData = useRouter()
const buttonLoader = ref(false)
let schoolNumber = routerData.currentRoute.value.query.sch
const aggregateGroupData = ref([])

const props = defineProps({
  gradeDataInfo:{}
})

const form = reactive({
  code: null,
  name:null,
  short_name:null,
  school_number:null,
  grade_group_number:null
})


onMounted(
    () =>{
      schoolStore.fetchSchools()
      getGradeDataInfo()
      fetchAggregateGroup()
    }
)

const fetchAggregateGroup = () =>{
  assessmentStore.fetchAggregateGroupName(form)
}

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
  }
}






const addGrade = () => {
  buttonLoader.value = true

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
    },
    {deep:true}
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

      <div class="modal-body">
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
<!-- {{ aggregateGroupData }} -->
<div class="mb-2 ">
  <div class="text-[13px] text-[#505050]">School</div>
          <select
              v-model="form.school_number"
              class="form-select form-select-sm" required
              style="box-shadow: none;"
              @change="fetchAggregateGroup(form.school_number)"
          >
            <option disabled value="">--Select School--</option>
            <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
            </option>
          </select>
      </div>
          <div class="mb-2">
            <div class="text-[13px] text-[#505050]">Aggregate Group Name</div>
                    <select
                        class="form-select form-select-sm shadow-none" required
                        v-model="form.grade_group_number"
                    >
                      <option disabled value="">--Select Aggregate Group--</option>
                      <option v-for="(list,index) in aggregateGroupData" :key="index" :value="list.number">{{ list.name }}</option>
                    </select>
                  </div>

          <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Short Code</div>
            <input v-model="form.short_name" type="text" class="form-control shadow-none" placeholder="D1, F9">
          </div>

        <div class="mb-2">
          <div class="text-[13px] text-[#505050]"> Name</div>
         <input v-model="form.name" type="text" class="form-control shadow-none" placeholder="Distinction 1, Fail 9">
        </div>



        <div class="flex justify-content-end mt-4" style="width: 100%;">
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
<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAssessmentStore } from "../store/assessment";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import useCommonsStore from "@/composables/useCommons.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useRouter} from "vue-router";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
const commons = useCommonsStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()
const assessmentStore = useAssessmentStore()
const levelStore = useLevelStore()
const campusStore = useCampusStore()

const  notificationStore  = useNotificationStore()

const routerData = useRouter()
const buttonLoader = ref(false)
const campusCurriculumDataInfo = ref(null)
const campusLevelList = ref(null)
const campus_level_number = ref("")
const campusClassList = ref(null)
const aggregateScaleList = ref(null)
const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = routerData.currentRoute.value.query.crr
let schoolNumber = routerData.currentRoute.value.query.sch

const props = defineProps({
  gradeDataList:{}
})


const form = reactive({
  code: null,
  classes: [{scale_number:"", campus_class_number:""}],
  name:null,
  description:null,
  school_number:schoolNumber
})


onMounted(
    async () => {
        campusStore.fetchClassesByCampus(campusNumber)
        campusStore.fetchAggregateScales(schoolNumber)
        fetchCampusLevel()
        getGradeInfo()
    }
)


watch(
    () => props.gradeDataList,
    async (data) => {
      if(data){
        getGradeInfo()
      }
    }
)



const getGradeInfo = () => {
    let draft = props.gradeDataList
    if(draft) {
      form.code = draft.code
      form.name = draft.name
      form.description = draft.description

    }
}


const addGradeStandard = () => {
  buttonLoader.value = true
  form.code = parseInt(form.code)
  let draft = props.gradeDataList
  if(draft){
      form.grading_standard_number = draft.number

      assessmentStore.updateGradeStandard(form)
  }else{
      assessmentStore.createGradeStandard(form)
  }
 
}

watch(
    () => assessmentStore.newGradeStandardResponse,
    async (data) => {
      if(data){
            form.campus_class_number = null
            form.name = null
            form.description = null
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


const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    }
)

watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        campusCurriculumDataInfo.value = data.data
      }
    }
)


const fetchClass = (campus_level_number) => {
  academicYearStore.fetchCampusClassByLevel(campus_level_number)
}

watch(
    () => campusStore.campusClassesResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)

watch(
    () => campusStore.aggregateScaleResponse,
    async (data) => {
      if(data){
       aggregateScaleList.value = data.data
      }
    }
)


const removeClass = (index) => {
  form.classes.splice(index, 1);
}

const newClass = () => {
  form.classes.push({scale_number:null, campus_class_number:null})
}

</script>

<template>
    <div>
        <div class="modal-content">

      <div class="modal-body">
        <!-- {{ gradeDataList }} -->
        <form @submit.prevent="addGradeStandard()">


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
         <input v-model="form.name" type="text" class="form-control shadow-none" placeholder="UNEB , MOCK">
        </div>








          <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Description</div>
            <textarea class="form-control shadow-none text-[13px] text-[#505050] textColor" v-model="form.description"></textarea>
          </div>


          <div>


            <table

                class="table table-hover caption-top mt-1 table-sm table-striped mt-3"
                style="font-size: 12px !important;"
            >
              <thead>
              <tr>
                <td class="w-[10%]">#</td>
                <td class="w-[45%]">Class</td>
                <td class="w-[40%]">Scale</td>
                <td></td>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(classInfo, index) in form?.classes" :key="index">
                <td>{{index+1}}</td>
                <td>
                  <div class="">
                    <select
                        class="form-select form-select-sm shadow-none" required
                        v-model="classInfo.campus_class_number"
                    >
                      <option disabled value="">--Select Class--</option>
                      <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list?.code+". "+list?.class_name+" [ "+list?.class_abbreviation+" ]"}}</option>
                    </select>
                  </div>
                </td>
                <td>
                  <div class="">

                    <select
                        class="form-select form-select-sm shadow-none" required
                        v-model="classInfo.scale_number"
                    >
                      <option disabled value="">--Select Scale--</option>
                      <option v-for="(list, index) in aggregateScaleList" :key="index" :value="list.scale_number">{{list.scale_name}}</option>
                    </select>
                  </div>
                </td>
                <td>
                  <div class="mt-1">
                    <i class="bi bi-x-circle cursor-pointer text-[red]" @click="removeClass(index)"></i>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>


            <button @click="newClass" type="button" class="bg-[#0d6efd] text-white text-sm px-2 rounded-sm" style="text-align: center;"><i class="bi bi-plus"></i>Add</button>



          </div>
          
     <div class="flex justify-content-end mt-4" style="width: 100%;">
            <button type="submit" class="btn btn-primary border-0 btn-sm">
                 <small><i class="bi bi-save"></i> {{gradeDataList ? "Edit" : "submit"}} </small>
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
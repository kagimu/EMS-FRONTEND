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
const campusClassList = ref(null)
const aggregateScaleList = ref(null)
const classScaleInfo = ref(null)
const campus_curriculum_number = routerData.currentRoute.value.query.crr
let schoolNumber = routerData.currentRoute.value.query.sch

const props = defineProps({
  gradeDataList:{}
})


const form = reactive({
  code: null,
  classes: [{scale_number:"", class_number:""}],
  name:null,
  description:null,
  school_number:schoolNumber
})


onMounted(
    async () => {
        campusStore.fetchClassesBySchool(schoolNumber)
        // campusStore.fetchClassesByCampus(campusNumber)
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
      form.code = draft?.code
      form.name = draft?.name
      form.description = draft?.description
      assessmentStore.fetchStandardGradeDetails(draft?.number)
    }
}

watch(
    () => assessmentStore.updateGradeStandardScaleDetailsResponse,
    async (data) => {
      if(data && data.data){
        let arr = []
        let classesInfo = data.data?.standard_classes
        classScaleInfo.value =  classesInfo
        if(classesInfo && classesInfo.length) {
          classesInfo?.forEach(lst => {
            arr.push({scale_number: lst?.scale?.scale_number, class_number: lst?.class?.number})
          })
          form.classes = arr
        }
      }
    }
)


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
            form.class_number = null
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
    }
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

/*watch(
    () => campusStore.campusClassesResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)*/

watch(
    () => campusStore.schoolClassesResponse,
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
  form.classes.push({scale_number:null, class_number:null})
}

</script>

<template>
    <div>


      <div class="text-gray-600">
        <div class="flex">
          <div class="text-xs">Name</div>
          <div class="text-[9px] ml-2 border-2 rounded-md px-2" :class="[gradeDataList?.status === 'ACTIVE' ? 'text-[green] border-[green]':'text-[red] border-[red]'] ">{{ gradeDataList?.status }}</div>
        </div>

        <div class="text-sm mb-4 ml-2">{{ gradeDataList?.name }}</div>

        <div class="text-xs">Description</div>
        <div class="text-sm ml-2 mb-4">{{ gradeDataList?.description }}</div>


        <table

            class="table table-hover caption-top mt-1 table-sm table-striped mt-3"
            style="font-size: 12px !important;"
        >
          <thead>
          <tr>
            <td class="w-[10%]">#</td>
            <td class="w-[45%]">Class</td>
            <td class="w-[40%]">Scale</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(classInfo, index) in classScaleInfo" :key="index">
            <td>{{index+1}}</td>
            <td>
              {{classInfo?.class?.name}}
            </td>
            <td>
              {{classInfo?.scale?.scale_name}}
            </td>
          </tr>
          </tbody>
        </table>


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
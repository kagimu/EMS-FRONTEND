<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import { useAssessmentStore } from "../store/assessment";
import { useLevelStore } from "../../../settings/level/store/level";
import useCommonsStore from "@/composables/useCommons.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useRouter} from "vue-router";

const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()
const levelStore = useLevelStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const assessmentStore = useAssessmentStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()
const routerData = useRouter()

const classList = ref([])
const buttonLoader = ref(false)
const errorMessage = ref(null)
const levelData = ref([])
const gradeData = ref([])
const campusCurriculumDataInfo = ref(null)
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const campusLevelList = ref(null)
const campusClassList = ref(null)
const campusNumber = routerData.currentRoute.value.query.id
const gradeDataInfo = ref([])
const editM = ref(false)
let schoolNumber = routerData.currentRoute.value.query.sch
const props = defineProps({
  gradeScaleDatainfo:{}
})

const form = reactive({
  scale_name:"",
  count:"",
})
const sectionPart = ref([{ code: null, grade_number: "",min_value:null,max_value:null,weight:null,remark:null}])

onMounted(
    async () => {

      schoolStore.fetchSchools()
      fetchCampusLevel()

      await levelStore.fetchCampusCurriculum(campusNumber)
      assessmentStore.fetchGrades()
      let draft = props.gradeScaleDatainfo

      if(draft){
        editM.value = true
        form.count = draft?.count
        form.scale_name = draft?.scale_name
        let gradesInfo = draft?.grades
        gradesInfo.forEach(lst => {
          lst.remark = lst.description
        }) 

        sectionPart.value = gradesInfo

      }
    }
)


const newSectionPart = (count) => {
  sectionPart.value = []
  if(count > 0) {
    for (let i = 0; i < count; i++) {
      let maxValue = (i === 0) ?  100 : null
      let minValue = ((i+1) === parseInt(count)) ? 0 : null
      sectionPart.value.push({code: (i+1), grade_number: "", min_value: minValue, max_value: maxValue, weight: (i+1) , remark: null})
    }

  }
}

const autoFillMaxValue = (min_value, index) => {
  if(((parseInt(index) + 1) < sectionPart.value.length) && min_value) {
    sectionPart.value[(parseInt(index) + 1)].max_value = (parseInt(min_value) - 0.6)
  }
}



const convertFormValuesToInt = () => {
  sectionPart.value.forEach(field => {
    if (field.code !== null) {
      field.code = parseInt(field.code);
    }
    if (field.min_value !== null) {
      field.min_value = parseInt(field.min_value);
    }
    if (field.max_value !== null) {
      field.max_value = parseInt(field.max_value);
    }
    if (field.weight !== null) {
      field.weight = parseFloat(field.weight);
    }
  })
}

const createScale = () =>{
  buttonLoader.value = true
  form.count =  parseInt(form.count)
  form.grades = sectionPart
  form.school_number = schoolNumber
  if(props.gradeScaleDatainfo.scale_number){
    convertFormValuesToInt()
    form.scale_number = props.gradeScaleDatainfo.scale_number

    assessmentStore.updateAggregateScale(form)

  }else{
    convertFormValuesToInt()
    assessmentStore.createAggregateScale(form)
  }
  
}




const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}



watch (
    () => assessmentStore.gradeResponse,
    async (data) => {
      if(data){
        gradeDataInfo.value = data
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

watch (
    () => assessmentStore.newAggregateScaleResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
      }
    }
)

watch (
    () => assessmentStore.updateAggregateScaleResponse,
    async (data) => {
      if(data){
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
    },
    {deep:true}
)


watch (
    () => assessmentStore.gradeStandardResponse,
    async (data) => {
      if(data){
        gradeData.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    }
)

watch(
    () => academicYearStore.campusClassByLevelResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)

watch(
    () => campusStore.campusClassesResponse,
    async (data) => {
      if (data) {
        classList.value = data.data
      }
    },
    {deep: true}
)

watch(
    () => campusStore.errorMessage,
    async (data) => {
      if (data) {
        notificationStore.errorToast("Error", data.message)
      }
    },
    {deep: true}
)

onMounted(() => {
      levelStore.fetchLevels()
    }
)
watch(
    () => levelStore.levelInfoResponse,
    async (data) => {
      if (data) {
        levelData.value = data.data
      }
    },
    {deep: true}
)




</script>
<template>
    <div>

        <div class="modal-content">

      <div class="modal-body">
        <form @submit.prevent="createScale()">


          <div class="mb-2">
            <div class="text-[13px] text-[#505050]">Count of Scale</div>
            <input
                @keypress="commons.codeValidator($event)"
                v-on:blur="newSectionPart(form.count)"
                maxlength="10"
                v-model="form.count"
                required
                @paste.prevent
                class="form-control form-select-sm shadow-none">
          </div>


          <div class="mb-2">
            <div class="text-[13px] text-[#505050]">Scale Name</div>
            <input v-model="form.scale_name" type="text" class="form-control shadow-none" placeholder="Scale of 5">
          </div>


          <table
              id="datatable"
              class="table table-hover text-sm"
              style="font-size: 12px !important;"
          >
            <thead>
            <tr>
              <td class="w-[10%]">#Code</td>
              <td class="w-[15%]">Minimum Scale</td>
              <td class="w-[15%]">Maximum Scale</td>
              <td class="w-[10%]">Weight</td>
              <td>Remark</td>
              <td>Name Of Aggregate</td>
<!--              <td></td>-->
            </tr>
            </thead>
            <tbody>
            <tr v-for="(field, index) in sectionPart" :key="index">
              <td>
                <div class="mb-2">
                  <input
                      @keypress="commons.codeValidator($event)"
                      maxlength="10"
                      v-model="field.code"
                      @paste.prevent
                      required
                      class="form-control form-select-sm shadow-none">
                </div>
              </td>
              <td>
                <input
                    maxlength="4"
                    @keypress="commons.numbersOnlyValidator($event)"
                    v-model="field.min_value"
                    v-on:blur="autoFillMaxValue(field.min_value, index)"
                    placeholder="eg. 90"
                    type="text"
                    class="form-control outline-none shadow-none">
              </td>
              <td>
                <input
                    placeholder="eg. 100"
                    maxlength="4"
                    @keypress="commons.numbersOnlyValidator($event)"
                    v-model="field.max_value"
                    type="text"
                    class="form-control outline-none shadow-none">
              </td>
              <td>
                <input
                    readonly
                    placeholder="4"
                    maxlength="4"
                    @keypress="commons.numbersOnlyValidator($event)"
                    v-model="field.weight"
                    type="text"
                    class="form-control outline-none shadow-none">
              </td>
              <td>
                <textarea
                    placeholder="Very Good"
                    v-model="field.remark"
                    class="form-control noFocus text-xs shadow-none textColor"
                    id="floatingTextarea2"
                    style="height: 10px"></textarea>
              </td>
              <td>
                <div>
                  <select
                      class="form-select form-select-sm shadow-none" required
                      v-model="field.grade_number"
                  >
                    <option disabled value="">--Select Name Of Aggregate--</option>
                    <option v-for="(list, index) in gradeDataInfo" :key="index" :value="list?.number">{{list?.code+". "+list?.name}} ( {{list?.short_name}} )</option>
                  </select>
                </div>
              </td>
<!--              <td>
                <div class="mt-1">
                <i class="bi bi-x-circle cursor-pointer text-[red]" @click="removeSectionPart(index)"></i>
                </div>
              </td>-->
            </tr>

            </tbody>
          </table>




<!--     <button v-if="sectionPart.length < form.count" @click="newSectionPart" type="button" class="bg-[#0d6efd] text-white text-sm px-2 rounded-sm" style="text-align: center;"><i class="bi bi-plus"></i>Add</button>-->

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

</style>
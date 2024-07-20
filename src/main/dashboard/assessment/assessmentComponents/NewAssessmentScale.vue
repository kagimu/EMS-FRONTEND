<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import { useAssessmentStore } from "../store/assessment";
import { useLevelStore } from "../../../settings/level/store/level";
import useCommonsStore from "@/composables/useCommons.js";
import {useRouter} from "vue-router";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()
const routerData = useRouter()
const classStore = useClassesStore()
const assessmentStore = useAssessmentStore()

const campusStore = useCampusStore()
const buttonLoader = ref(false)
const errorMessage = ref(null)
const levelData = ref([])
const levelStore = useLevelStore()
const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = routerData.currentRoute.value.query.crr

const campusLevelList = ref(null)
const campusClassList = ref(null)
let   schoolNumber = routerData.currentRoute.value.query.sch
const aggregateData = ref([])


const props = defineProps({
  scaleD:{},
})

onMounted(
    async () => {
      filterAssessmentGrade()
       fetchCampusLevel()
       fetchGradeScale()
       campusStore.fetchClassesBySchool(schoolNumber)
    }
)


const form = reactive({
  assessment_grade_number:null,
  assessment_area_count:null,
  classes: [],
  assessment_grade_items:[{code:"",name:"",minimum_points:"",maximum_points:"",remarks:"",abbreviation:"",description:""}]
})


const fetchGradeScale = () =>{
  let data = {
    school_number:schoolNumber
  }
  assessmentStore.fetchAggregateScale(data)
}

watch (
    () => props.scaleD,
    async (data) => {
      if(data){
        filterAssessmentGrade()
      }
    }
)

const filterAssessmentGrade = () =>{
  let draft = props.scaleD
  if(draft){
    form.assessment_area_count = draft?.assessment_area_count
    form.classes = draft?.classes?.map(item => item.number);
    form.assessment_grade_items = draft?.assessment_grade_items
    form.assessment_grade_number = draft?.assessment_grade_number
  }
}

const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}


const createScale = () =>{

  buttonLoader.value = true

  form.assessment_grade_items.forEach(scale => {
    scale.code = scale.code ? parseInt(scale.code) : null
    scale.minimum_points = scale.minimum_points ? parseFloat(scale.minimum_points) : null
    scale.maximum_points = scale.maximum_points ? parseFloat(scale.maximum_points) : null
  })

  form.assessment_area_count = form.assessment_area_count ? parseInt(form.assessment_area_count) : null

  form.school_number = schoolNumber

  // Edit
  if(form.assessment_grade_number){
    assessmentStore.updateAssessmentGrade(form)
  }else{
    assessmentStore.createAssessmentGrade(form)
  }

}


const removeGradeScale = (index) => {
  form.assessment_grade_items.splice(index, 1);
}

const newGradeScale = () => {
  form.assessment_grade_items.push({code:null, name:null,abbreviation:null,minimum_points:null,maximum_points:null,remarks:null,description:null})
}

const addRequirements = (class_number) => {
  if (form.classes.includes(class_number)) {
    form.classes = form.classes.filter(item => item !== class_number);
  } else {
    form.classes.push(class_number);
  }
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
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)




watch(
    () => assessmentStore.aggregateScaleResponse,
    async (data) => {
      if(data){
        aggregateData.value = data.data
      }
    }
)


watch (
    () => assessmentStore.newAssessmentScaleResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
      }
    }
)



watch (
    () => assessmentStore.updateAssessmentScaleResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data?.message)

      }
    }
)


watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        buttonLoader.value = false
        errorMessage.value = data?.message
        notificationStore.errorToast("Error",data?.message)
      }
    }
)

watch(
    () => campusStore.errorMessage,
    async (data) => {
      if (data) {
        notificationStore.errorToast("Error", data.message)
      }
    }
)


watch(
    () => levelStore.levelInfoResponse,
    async (data) => {
      if (data) {
        levelData.value = data.data
      }
    }
)

</script>

<template>
    <div>
    <form @submit.prevent="createScale()">
  <div>
    <div class="mb-2">
      <label>Count</label>
        <input
      maxlength="3"
      @keypress="commons.numbersOnlyValidator($event)"
      v-model="form.assessment_area_count"
      type="text"
      class="form-control outline-none shadow-none"
    >
     
      </div>




    <div class="mb-2 mt-3">
      <label class="text-xs font-bold">Select Class(es)</label>
      <div class="border p-3 rounded-md">
        <div class="grid grid-cols-4 gap-2 text-sm" style="border-radius: 0 0 0 0;">
          <div class="list-group-item mb-2 hover:bg-[#e3e0e0] hover:rounded-md cursor-pointer py-1" v-for="(classInfo) in campusClassList" @click="addRequirements(classInfo?.number)">
            <div class="px-3">
              <input
                  v-model="form.classes"
                  style="outline: none 0 !important; box-shadow: none;"
                  class="w-[15px] h-[15px] text-indigo-600 cursor-pointer"
                  type="checkbox"
                  :value="classInfo.number"  :id="classInfo.number">
              <label @click="addRequirements(classInfo.number)" class="form-check-label cursor-pointer capitalize ml-3" :for="classInfo.number">{{classInfo?.name+" [ "+classInfo?.abbreviation+" ]"}}</label>
            </div>
          </div>
        </div>
      </div>

    </div>



</div>
<div>

  <label class="mt-6"><small>GradeScale</small></label>
<table
    class="table table-hover caption-top table-sm table-striped"
    style="font-size: 12px !important;"
>
  <thead>
  <tr>
    <td class="w-[5%]">code</td>
    <td >Name</td>
    <td>Abbrev</td>
    <td>Minimum Point</td>
    <td >Maximum Point</td>
    <td>Remark</td>
    <td>Description</td>
    <td></td>
  </tr>
  </thead>
  <tbody>
  <tr v-for="(gradeScaleInfo, index) in form?.assessment_grade_items" :key="index">
    <td> 
       <div class="mb-2">
            <input
                @keypress="commons.codeValidator($event)"
                maxlength="10"
                v-model="gradeScaleInfo.code"
                required
                @paste.prevent
                class="form-control form-select-sm shadow-none">
          </div>
      </td>
    <td>   
      <div class="mb-2">
         <input v-model="gradeScaleInfo.name" placeholder="First Grade, Second Grade ..." type="text" class="form-control outline-none shadow-none">
        </div>
    </td>
    <td>
      <div class="mb-2">
      <input v-model="gradeScaleInfo.abbreviation" placeholder="Division 1 / Result 1" type="text" class="form-control outline-none shadow-none">
      </div>
    </td>
    <td>
    <input
      maxlength="3"
      @keypress="commons.numbersOnlyValidator($event)"
      v-model="gradeScaleInfo.minimum_points"
      type="text"
      class="form-control outline-none shadow-none"
    >
    </td>

    <td>
    <input
      maxlength="3"
      @keypress="commons.numbersOnlyValidator($event)"
      v-model="gradeScaleInfo.maximum_points"
      type="text"
      class="form-control outline-none shadow-none">    
    </td>

    <td>
      <textarea v-model="gradeScaleInfo.remarks" class="form-control textColor outline-none shadow-none">
      </textarea>
    </td>

    <td>
      <textarea v-model="gradeScaleInfo.description" class="form-control textColor outline-none shadow-none">
      </textarea>
    </td>

    <td>
      <div class="mt-1">
        <i class="bi bi-x-circle cursor-pointer text-[red]" @click="removeGradeScale(index)"></i>
      </div>
    </td>
  </tr>
  </tbody>
</table>
<button @click="newGradeScale" type="button" class="bg-[#0d6efd] text-white text-sm px-2 rounded-sm" style="text-align: center;"><i class="bi bi-plus"></i>Add</button>
</div>

<div class="flex justify-content-end mt-2" style="width: 100%;">
            <button type="submit" class="btn btn-primary border-0 btn-sm">
                 <small><i class="bi bi-save"></i> submit</small>
                 <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                      role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span> 
                    </span>
            </button>
        </div>
    </form>
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
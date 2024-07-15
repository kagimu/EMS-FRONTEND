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
const academicYearStore = useAcademicYearStore()
const assessmentStore = useAssessmentStore()

const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const school_number = ref(null)
const buttonLoader = ref(false)
const errorMessage = ref(null)
const levelData = ref([])
const levelStore = useLevelStore()
const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const campusCurriculumDataInfo = ref(null)
const campusLevelList = ref(null)
const campus_level_number = ref("")
const campusClassList = ref(null)
let schoolNumber = routerData.currentRoute.value.query.sch
const aggregateData = ref([])
const scaleDataList = ref(null)

onMounted(
    async () => {
      await levelStore.fetchCampusCurriculum(campusNumber)
       fetchCampusLevel()
       getAssessmentScaleDataInfo()
       fetchGradeScale()
       campusStore.fetchClassesBySchool()
    }
)


const form = reactive({
  assessment_area_count:null,
  classes: [{class_number:""}],
  assessment_grade_items:[{code:"",name:"",minimum_points:"",maximum_points:"",remarks:"",abbreviation:"",description:""}]
})

const props = defineProps({
  scaleD:String,
  assessmentGradeListD:{}
})
const fetchGradeScale = () =>{
  let data = {
    school_number:schoolNumber
  }
  assessmentStore.fetchAggregateScale(data)
}

const getAssessmentScaleDataInfo = () =>{
  if(props.assessmentGradeListD){
    form.code = props.assessmentGradeListD.code
       form.name = props.assessmentGradeListD.name
       form.maximum_points=props.assessmentGradeListD.maximum_points
       form.minimum_points=props.assessmentGradeListD.minimum_points
       form.campus_class_number=props.assessmentGradeListD.campus_class_number
       form.grade=props.assessmentGradeListD.Grade
       form.description=props.assessmentGradeListD.description
       form.abbreviation=props.assessmentGradeListD.abbreviation
       form.remarks=props.assessmentGradeListD.remarks
  }
}

const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

const fetchClass = (campus_level_number) => {
  academicYearStore.fetchCampusClassByLevel(campus_level_number)
}



const createScale = () =>{

  buttonLoader.value = true
  if(props.assessmentGradeListD.number){
    form.assessment_grade_number = props.assessmentGradeListD.number
    alert(JSON.stringify(form))
    assessmentStore.updateAssessmentScale(form)

  }else{
  const transformedClasses = form.classes.map(classInfo => classInfo.class_number);

  const transformedGradeScales = form.assessment_grade_items.map(scale => ({
    ...scale,
    code: parseInt(scale.code),
    minimum_points: parseInt(scale.minimum_points),
    maximum_points: parseInt(scale.maximum_points)
  }))

  const finalData = {
  assessment_area_count:  parseInt(form.assessment_area_count),
  classes: transformedClasses,
  assessment_grade_items: transformedGradeScales
}

    alert(JSON.stringify(finalData))
    assessmentStore.createAssessmentScale(form)
  }

}

const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number ?? "")
}

const fetchClasses = (campus_number) => {
  campusStore.fetchClassesByCampus(campus_number)
}

const removeClass = (index) => {
  form.classes.splice(index, 1);
}

const newClass = () => {
 form.classes.push({class_number:""})
}


const removeGradeScale = (index) => {
  form.assessment_grade_items.splice(index, 1);
}

const newGradeScale = () => {
  form.assessment_grade_items.push({code:null, name:null,abbreviation:null,minimum_points:null,maximum_points:null,remarks:null,description:null})
}


watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        campusCurriculumDataInfo.value = data.data
      }
    }
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
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)


watch (
    () => props.scaleD,
    async (data) => {
      if(data){
        scaleDataList.value =props.scaleD
      }
    },
    {deep:true}
)

watch(
    () => assessmentStore.aggregateScaleResponse,
    async (data) => {
      if(data){
        aggregateData.value = data.data
      }
    },
    {deep:true}
)


watch (
    () => assessmentStore.newAssessmentScaleResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
            form.name = null
            form.maximum_points=null
            form.minimum_points=null
            form.campus_class_number=null
            form.grade=null
            form.description=null
            form.abbreviation=null
            form.remarks=null
      }
    }
)



watch (
    () => assessmentStore.updateAssessmentScaleResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        form.name = null
            form.maximum_points=null
            form.minimum_points=null
            form.campus_class_number=null
            form.grade=null
            form.description=null
            form.abbreviation=null
            form.remarks=null
            form.school_number=null
      }
    },
    {deep:true}
)


watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
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
<table

    class="table table-hover caption-top mt-1 table-sm table-striped"
    style="font-size: 12px !important;"
>
  <thead>
  <tr>
    <td class="">Class</td>
    <td class="w-[8%]"></td>
  </tr>
  </thead>
  <tbody>
  <tr v-for="(classInfo, index) in form?.classes" :key="index">
    <td>
      <div class="">
        <select
            class="form-select form-select-sm shadow-none" required
            v-model="classInfo.class_number"
        >
          <option disabled value="">--Select Class--</option>
          <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list?.name+" [ "+list?.abbreviation+" ]"}}</option>
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
<button @click="newClass" type="button" class="bg-[#0d6efd] text-white text-sm px-2 rounded-sm" style="text-align: center;"><i class="bi bi-plus"></i></button>
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
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
const aggregateData = ref([])
const props = defineProps({
  gradeScaleDatainfo:{}
})

const form = reactive({
  scale_name:"",
  count:"",
  classes: [],
  assessment_grade_items:[{code:"",name:"",minimum_points:"",maximum_points:"",remarks:"",abbreviation:"",description:""}]
})
const sectionPart = ref([])

onMounted(
    async () => {

      schoolStore.fetchSchools()
      fetchCampusLevel()
      await levelStore.fetchCampusCurriculum(campusNumber)
      assessmentStore.fetchGrades()
      campusStore.fetchClassesBySchool(schoolNumber)
      fetchGradeScale()
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

const fetchGradeScale = () =>{
  let data = {
    school_number:schoolNumber
  }
  assessmentStore.fetchAggregateScale(data)
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
    () => assessmentStore.aggregateScaleResponse,
    async (data) => {
      if(data){
        aggregateData.value = data.data
      }
    }
)


const newSectionPart = (checkReset) => {

  if(props.gradeScaleDatainfo?.scale_number && !checkReset){
    return
  }

  let count = parseInt(form.count)

  sectionPart.value = []
  if(count && (count > 0)) {
    for (let i = 0; i < count; i++) {
      let maxValue = (i === 0) ?  100 : null
      let minValue = ((i+1) === parseInt(count)) ? 0 : null
      sectionPart.value.push({code: (i+1), grade_number: "", min_value: minValue, max_value: maxValue, weight: (i+1) , remark: null})
    }

  }
}

const autoFillMaxValue = (min_value, index) => {

  if(((parseInt(index) + 1) < sectionPart.value.length)) {

    for (let i = (parseInt(index) + 1); i < sectionPart.value.length; i++) {
      sectionPart.value[i].min_value = ((i + 1) === sectionPart.value.length) ? 0 : null
      sectionPart.value[i].max_value = null
    }

    if (min_value) {
      sectionPart.value[(parseInt(index) + 1)].max_value = (parseInt(min_value) - 0.6)
    }

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

  convertFormValuesToInt()

  if(props.gradeScaleDatainfo.scale_number){
    form.scale_number = props.gradeScaleDatainfo.scale_number
    assessmentStore.updateAggregateScale(form)
  }else{
    alert(JSON.stringify(form))
    // assessmentStore.createAggregateScale(form)
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

// watch(
//     () => academicYearStore.campusClassByLevelResponse,
//     async (data) => {
//       if(data){
//         campusClassList.value = data.data
//       }
//     }
// )

watch(
    () => campusStore.schoolClassesResponse,
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


        <div class="">

      <div class="">
        <form @submit.prevent="createScale()">


          <div class="row">
            <div class="col-lg-5">
              <div class="mb-2">
            <div class="text-[13px] text-[#505050]">Count of Scale</div>
            <input
                @keypress="commons.codeValidator($event)"
                v-on:blur="newSectionPart('')"
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

          <div class="flex justify-end mt-5 mb-4" v-if="gradeScaleDatainfo?.scale_number">

          <div>
            <button
                type="button"  class="text-[#2c2f8c]  rounded-md text-xs hover:bg-[#2c2f8c] hover:text-white" style="border: 1px solid #2c2f8c;"  @click="newSectionPart('reset')">
                  <div class="px-3 py-1">
                    <i style="font-size: 15px;"  class="bi-reply mr-1"></i>
                    Reset
                  </div>
            </button>
          </div>

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
            </tr>
            </thead>
            <tbody>
            <tr v-for="(field, index) in sectionPart" :key="index">
              <td>
                <div class="mb-2">
                  <input
                      readonly
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
            </tr>

            </tbody>
          </table>
            </div>

            <div class="col-lg-7">

              <div class="mb-2 mt-3">
      <label class="text-xs font-bold">Select Class(es)</label>
      <div class="border p-3 rounded-md">
        <div class="grid grid-cols-3 gap-2 text-sm" style="border-radius: 0 0 0 0;">
          <div class="list-group-item mb-2 hover:bg-[#e3e0e0] hover:rounded-md cursor-pointer py-1" v-for="(classInfo) in campusClassList" @click="addRequirements(classInfo?.number)">
            <div class="px-3">
              <input
                  v-model="form.classes"
                  style="outline: none 0 !important; box-shadow: none;"
                  class="w-[15px] h-[15px] text-indigo-600 cursor-pointer"
                  type="checkbox"
                  :value="classInfo.number"  :id="classInfo.number">
              <label style="font-size: 11px;" @click="addRequirements(classInfo.number)" class="form-check-label cursor-pointer capitalize ml-3" :for="classInfo.number">{{classInfo?.name+" [ "+classInfo?.abbreviation+" ]"}}</label>
            </div>
          </div>
        </div>
      </div>


      
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
            </div>

          </div>
        




     <div class="flex justify-content-end mt-4" style="width: 100%;">
            <button type="submit" class="btn btn-primary border-0 btn-sm">
                 <small><i class="bi bi-save"></i>
                  {{gradeScaleDatainfo?.scale_number ? "Edit" : "Submit"}}
                 </small>
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
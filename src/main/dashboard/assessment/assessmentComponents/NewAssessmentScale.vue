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


const form = reactive({
  code:null,
  name : null,
  maximum_points: null,
  minimum_points: null,
  campus_class_number:null,
  description: null,
  abbreviation: null,
  remarks:null,
  campus_number:campusNumber
})

const scaleDataList = ref(null)

const props = defineProps({
  scaleD:String,
  assessmentGradeListD:{}
})


onMounted(
    async () => {
      await levelStore.fetchCampusCurriculum(campusNumber)
       fetchCampusLevel()
       getAssessmentScaleDataInfo()
    }
)


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

watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        campusCurriculumDataInfo.value = data.data
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

const fetchClass = (campus_level_number) => {
  academicYearStore.fetchCampusClassByLevel(campus_level_number)
}

watch(
    () => academicYearStore.campusClassByLevelResponse,
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
      //  form.name = props.scaleD.name
      //  form.maximum_points=props.scaleD.maximum_points
      //  form.minimum_points=props.scaleD.minimum_points
      //  form.campus_class_number=props.scaleD.campus_class_number
      //  form.grade=props.scaleD.Grade
      //  form.description=props.scaleD.description
      //  form.abbreviation=props.scaleD.abbreviation
      //  form.remarks=props.scaleD.remarks
      }
    },
    {deep:true}
)
const createScale = () =>{
  buttonLoader.value = true
  form.code = parseInt(form.code)
  form.maximum_points = parseInt(form.maximum_points)
  form.minimum_points = parseInt(form.minimum_points)
  if(props.scaleD.number){
    assessmentStore.updateAssessmentScale(form,props.scaleD.number)

  }else{
    assessmentStore.createAssessmentScale(form)
  }

}






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




const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number ?? "")
}

const fetchClasses = (campus_number) => {
  campusStore.fetchClassesByCampus(campus_number)
}







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
 <!-- {{ assessmentGradeListD }} -->
    <form @submit.prevent="createScale()">
       <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Level</div>
            <select
                class="form-select form-select-sm shadow-none"
                v-model="campus_level_number"
                @change="fetchClass(campus_level_number)"
            >
              <option disabled value="">--Select Level--</option>
              <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
            </select>
          </div>

          <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Class</div>
            <select
                class="form-select form-select-sm shadow-none" required
                v-model="form.campus_class_number"
            >
              <option disabled value="">--Select Class--</option>
              <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
            </select>

            <!-- <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
            <li class="list-group-item" v-for="(list, index) in campusClassList" :key="index" :value="list.number">
            <input
              v-model="form.campus_class_number"

              style="outline: none 0 !important; box-shadow: none;"
              class="form-check-input me-1" type="checkbox" :value="list.number" :id="list.number">
            <label class="textColor" :for="list.number"><small>{{list.name+" [ "+list.abbreviation+" ]"}}</small></label>
            </li>

            </ul> -->
          </div>


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




            <div class="row">
                <div class="col-6">
                <div class="mb-2">
                  <div class="text-[13px] text-[#505050]"> Name</div>
                <input v-model="form.name" placeholder="First Grade, Second Grade ..." type="text" class="form-control outline-none shadow-none">
                </div>
                </div>
                <div class="col-6">
                <div class="mb-2">
                  <div class="text-[13px] text-[#505050]"> Abbreviation</div>
                <input v-model="form.abbreviation" placeholder="Division 1 / Result 1" type="text" class="form-control outline-none shadow-none">
                </div>
                </div>
            </div>
          
      <div class="mb-2">
        <div class="row">
            <div class="col-lg-6">
              <div class="text-[13px] text-[#505050]">Minimum aggregate sum</div>
               <input
                   maxlength="3"
                   @keypress="commons.numbersOnlyValidator($event)"
                   v-model="form.minimum_points"
                   type="text"
                   class="form-control outline-none shadow-none"
               >
            </div>
            <div class="col-lg-6">
              <div class="text-[13px] text-[#505050]">Maximum aggregate sum</div>
              <input
                 maxlength="3"
                 @keypress="commons.numbersOnlyValidator($event)"
                 v-model="form.maximum_points"
                 type="text"
                 class="form-control outline-none shadow-none">
            </div>

        </div>
      </div>

      <div class="mb-2">
        <div class="text-[13px] text-[#505050]">Description</div>
        <textarea v-model="form.description" class="form-control textColor outline-none shadow-none">
        </textarea>
      </div>
      
      <div class="mb-2">
        <div class="text-[13px] text-[#505050]">Remarks</div>
        <textarea v-model="form.remarks" class="form-control textColor outline-none shadow-none">
        </textarea>
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
<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAssessmentStore } from "../store/assessment";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import useCommonsStore from "@/composables/useCommons.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useRouter} from "vue-router";
const commons = useCommonsStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()
const  notificationStore  = useNotificationStore()
const levelStore = useLevelStore()
const routerData = useRouter()
const buttonLoader = ref(false)
const assessmentStore = useAssessmentStore()
const campus_curriculum_number = ref("")
const campusCurriculumDataInfo = ref(null)
const campusLevelList = ref(null)
const campus_level_number = ref("")
const campusClassList = ref(null)
const campusNumber = routerData.currentRoute.value.query.id


const form = reactive({
  code: null,
  campus_class_number: null,
  type:"",
  name:null,
  description:null
})




const addGradeStandard = () => {
  form.code = parseInt(form.code)
  buttonLoader.value = true
  assessmentStore.createGradeStandard(form)
}

watch(
    () => assessmentStore.newGradeStandardResponse,
    async (data) => {
      if(data){
        // await assessmentStore.fetchGradeStandard()
            form.campus_class_number = null
            form.type = null
            form.name = null
            form.description = null
        // notificationStore.successToast("Success", data.message)
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


onMounted(
    async () => {
      await levelStore.fetchCampusCurriculum(campusNumber)
    }
)





const fetchCampusLevel = (campus_curriculum_number) => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        campusCurriculumDataInfo.value = data.data
      }
    }
)


const fetchAcademicYea = (campus_level_number) => {
  // academicYearStore.fetchAcademicYearByLevel(campus_level_number)
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


</script>

<template>
    <div>
        <div class="modal-content">

      <div class="modal-body">
        <form @submit.prevent="addGradeStandard()">


          <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Code</div>
            <input
                @keypress="commons.numbersOnlyValidator($event)"
                maxlength="10"
                v-model="form.code"
                required
                class="form-control form-select-sm shadow-none">
          </div>

          <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Curriculum</div>
            <select
                class="form-select form-select-sm shadow-none"
                v-model="campus_curriculum_number"
                @change="fetchCampusLevel(campus_curriculum_number)"
            >
              <option disabled value="">--Select Curriculum--</option>
              <option v-for="(list, index) in campusCurriculumDataInfo" :key="index" :value="list.number">{{list.name}}</option>
            </select>
          </div>



          <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Level</div>
            <select
                class="form-select form-select-sm shadow-none"
                v-model="campus_level_number"
                @change="fetchAcademicYea(campus_level_number)"
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
              <option disabled value="">Select</option>
              <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
            </select>
          </div>



        <div class="mb-2">
          <div class="text-[13px] text-[#505050]"> Name</div>
         <input v-model="form.name" type="text" class="form-control shadow-none" placeholder="UNEB , MOCK">
        </div>






          <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Type <!--<i class="bi-asterisk text-[10px] mt-1 ml-1 text-[red]"></i>--></div>
              <select

                      class="form-select form-select-sm shadow-none" required
                      v-model="form.type"
              >
                  <option disabled value="">Select Type</option>
                  <option value="internal">Internal
                  </option>
                  <option value="external">External
                  </option>
                  
              </select>
          </div>

          <div class="mb-2">
            <div class="text-[13px] text-[#505050]"> Description</div>
            <textarea class="form-control shadow-none" v-model="form.description"></textarea>
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
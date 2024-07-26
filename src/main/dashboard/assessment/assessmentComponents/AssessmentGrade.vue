<script setup>
import {onMounted,reactive, computed,ref, watch} from "vue";
import NewAssessmentScale from "@/main/dashboard/assessment/assessmentComponents/NewAssessmentScale.vue"
import { useAssessmentStore } from "../store/assessment";
import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import NewGradeScale from "@/main/dashboard/assessment/assessmentComponents/NewGradeScale.vue";
import {useRouter} from "vue-router";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";

const { can } = useAbility()

const routerData = useRouter()
const assessmentStore = useAssessmentStore()
const levelStore = useLevelStore()
const classStore = useClassesStore()
const campusStore = useCampusStore()
const academicYearStore = useAcademicYearStore()
const notificationStore  = useNotificationStore()



const assessmentScaleData = ref([])
const scaleD = ref({})
const deletionLoader = ref(undefined)

const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const schoolNumber = routerData.currentRoute.value.query.sch
const campus_level_number = ref("")
const class_number = ref("")
const campusCurriculumDataInfo = ref(null)
const campusLevelList = ref(null)
const campusClassList = ref(null)
const showAssessmentScaleModal = ref(false)



onMounted(() => {
    campusStore.fetchClassesBySchool(schoolNumber)
    filterAssessmentGrades()
    }
)


const filterAssessmentGrades = () =>{
  let data = {
    campus_number:campusNumber,
    class_number:class_number.value
  }
  assessmentStore.fetchAssessmentGrades(data)
}


const addAssessmentScale = () =>{
  scaleD.value = null
  showAssessmentScaleModal.value = true

}


const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

const fetchClass = (campus_level_number) => {
  academicYearStore.fetchCampusClassByLevel(campus_level_number)
}



const deleteGrade = (data, index) => {
  if(!confirm("Are you sure, you want to delete this aggregate scale")){
    return
  }

  deletionLoader.value = index

  assessmentStore.deleteAssessmentGrade(data?.assessment_grade_number)
}

watch(
    () => assessmentStore.deleteAssessmentGradeResponse,
    async (data) => {
      if(data){
        filterAssessmentGrades()
        deletionLoader.value = undefined
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch(
    () => assessmentStore.updateAssessmentScaleResponse,
    async (data) => {
      if(data){
        showAssessmentScaleModal.value = false
        filterAssessmentGrades()
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
    () => assessmentStore.assessmentScaleResponse,
    async (data) => {
      if(data){
        assessmentScaleData.value = data.data   
      }
    },
    {deep:true}
)

const showEditModal = (scaleInfo) =>{
  scaleD.value = scaleInfo
  showAssessmentScaleModal.value = true
}

watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        notificationStore.errorToast("Error", data.message)
      }
    },
    {deep:true}
)

watch (
    () => assessmentStore.newAssessmentScaleResponse,
    async (data) => {
      if(data){
        showAssessmentScaleModal.value = false
        notificationStore.successToast("Success", data.message)
      }
    }
)



</script>

<template>
    <div>

      <AppModal :title="scaleD ? 'Edit Assessment Grade' : 'Add Assessment Grade'"  v-model="showAssessmentScaleModal" xl6>
        <NewAssessmentScale :scaleD="scaleD"></NewAssessmentScale>
      </AppModal>
    

      <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="m-3">
           <div class="row">
            <div class="col-lg-6 "> 
                 
            </div>
            <div class="col-lg-6">
                <button
                    @click="addAssessmentScale"
                v-if="can('add_grade_scale','general')"
                 style="float: right; margin-right: 5px;"
                   type="button"
                  class="btn btn-primary btn-sm"><i class="bi bi-plus"></i> New Assessment Grade </button>
            </div>
    
           </div>
               </div>
                <div class="card-body" >
        <div >
          <div class="row">
      <div class="col-12">
        <div class="mt-3">

          <div class="mt-[50px]">
            <div class="row mx-auto">


              <div class="col-lg-4 mb-3">
                <select
                    class="form-select form-select-sm shadow-none" required
                    v-model="class_number"
                    @change="filterAssessmentGrades"
                >
                  <option disabled value="">--Select Class--</option>
                  <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list?.name+" [ "+list?.abbreviation+" ]"}}</option>
                </select>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>  



    <div  v-for="(scaleD, index) in assessmentScaleData" :key="index" class="text-xs border rounded-md mx-3 mb-4">
        <div class="bg-[#ededed] rounded-t-md">
          <div class="flex ml-5 py-2">
            <div class="mr-2 flex flex-grow justify-between">
             <div>
               <span>CLASSES</span>:  <span  v-for="(cl, idx) in scaleD.classes" :key="idx">{{ cl.name }} [{{ cl.abbreviation }}],{{ " " }}</span>
             </div>
              <div>
                <button @click="showEditModal(scaleD)"   type="button">
                  <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
                </button>
                &nbsp;<span style="color: rgba(200, 195, 195, 0.363);">|</span>&nbsp;
                <button type="button" @click="deleteGrade(scaleD, index)">
                  <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
                  <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
              </div>
            </div>
            <!-- <div> None</div> -->
          </div>
        </div>

        <table class="table table-hover caption-top table-sm text-[10px]">
          <thead>
          <tr>
            <th scope="col" class="w-[2%]">#</th>
            <th scope="col" class="w-[15%]">Summation(Min - Max)</th>
            <th scope="col" class="w-[10%]">Name</th>
            <th scope="col" class="w-[5%]">Abbreviation</th>
            <th scope="col" class="w-[25%]">Remarks</th>
            <th scope="col" class="w-[25%]">Description</th>
          
          </tr>
          </thead>
          <tbody>
          <tr v-for="(scaleData, idx) in scaleD.assessment_grade_items" :key="idx">
            <td> {{(idx + 1)}}</td>
            <td>{{ scaleData.minimum_points + " - " + scaleData.maximum_points }}</td>
            <td>{{scaleData.name}}</td>
            <td>{{scaleData.abbreviation}}</td>
            <td>{{scaleData.remarks}}</td>
            <td>{{scaleData.description}}</td>
      

          </tr>
          </tbody>
        </table>


      </div>

    
        </div>
        </div>
        </div>
        </div>
        </div>
    </div>
    
    
    
    </template>
    

    
    <style scoped>
    
    </style>
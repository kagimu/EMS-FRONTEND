<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import NewGradeScale from "@/main/dashboard/assessment/assessmentComponents/NewGradeScale.vue"
import { useAssessmentStore } from "../store/assessment";

import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useRouter} from "vue-router";
import useNotificationStore from "@/composables/useNotification.js";
const  notificationStore  = useNotificationStore()
const assessmentStore = useAssessmentStore()
const levelStore = useLevelStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()
const routerData = useRouter()

const { can } = useAbility()
const aggregateData = ref([])
const errorMessage = ref(null)
const showAggregateScaleModal = ref(false)
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const campusCurriculumDataInfo = ref(null)
const campusLevelList = ref(null)
const campusClassList = ref(null)
const editMode = ref(false)
const gradeScaleDatainfo = ref([])
let schoolNumber = routerData.currentRoute.value.query.sch
const deletionLoader = ref(false)

onMounted(() => {
      fetchGradeScale()
      fetchCampusLevel()
    }
)

const addAggregateScale = () => {
  editMode.value = false
  gradeScaleDatainfo.value = ""
  showAggregateScaleModal.value = true
}

const openEditModal = (gradeInf) =>{
  gradeScaleDatainfo.value = gradeInf
  editMode.value = true
  showAggregateScaleModal.value = true
}

const fetchGradeScale = () =>{
  let data = {
    school_number:schoolNumber
  }
  assessmentStore.fetchAggregateScale(data)
}


const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}



const deleteThisData = (info) => {
if(!confirm("Are you sure, you want to delete: " + info.scale_name)){
  return
}
deletionLoader.value = true
assessmentStore.deleteAggregateScale(info.scale_number)
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
    () => academicYearStore.campusClassByLevelResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
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






// aggregateData
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
    () => assessmentStore.newAggregateScaleResponse,
    async (data) => {
      if(data){
        showAggregateScaleModal.value = false
         fetchGradeScale()
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch (
    () => assessmentStore.updateAggregateScaleResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        fetchGradeScale()
        showAggregateScaleModal.value = false
      }
    }
  )



watch (
    () => assessmentStore.deleteAggregateScaleResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        fetchGradeScale()
        deletionLoader.value = false

      }
    }
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


</script>
<template>
    <div>

      <AppModal :title="editMode? 'Edit Aggregate Scale': 'Add Aggregate Scale'" v-model="showAggregateScaleModal" xl8>
        <NewGradeScale :gradeScaleDatainfo="gradeScaleDatainfo"></NewGradeScale>
      </AppModal>



      <div class="row">
            <div class="col-12">
              <div class="">

           <div class="flex flex-grow justify-between">
            <div>
               <p class="mt-3 ml-4 text-gray-600">Aggregate Scale</p>
            </div>
            <div>
                <button
                    @click="addAggregateScale"
                      v-if="can('add_grade_scale','general')"
                      style="float: right; margin-right: 5px;"
                      type="button"
                      class="btn btn-primary btn-sm m-4">
                    <i class="bi bi-plus"></i>
                    New Aggregate Scale
                </button>

            </div>
    
           </div>
              
                <div class="card-body" >
        <div >
          <div class="row">
      <div class="col-12">


      </div>
    </div>   
      <table id="data"
          class="table table-striped"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
          <th>#</th>
          <th scope="col">Name</th>
          <th scope="col">Grades</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for="(aggregateList,index) in aggregateData" :key="index">
            <td>{{ index+1 }}</td>
            <td>{{ aggregateList.scale_name }}</td>
        
            <td>
       
          <table 
          class="table  table-hover"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">(Min - Max) Value</th>
          <th scope="col">weight</th>
          <th scope="col">Name Of Aggregate</th>
          <th>Remark</th>
        </tr>
        <tr v-for="(list,idx) in aggregateList.grades" :key="idx">
          <td>{{ list?.code }}</td>
           <td>{{ list?.min_value}} - {{ list?.max_value }}</td>
           <td>{{ list?.weight }}</td>
           <td>{{ list?.name }} ( {{ list?.short_name }} )</td>
           <td>{{ list?.description }}</td>
        </tr>
        </thead>

         </table>


            </td>
           
            <td>
          <button @click="openEditModal(aggregateList)">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);">|</span>&nbsp;
          <button type="button" @click="deleteThisData(aggregateList)">
            <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
          </button></td>
        </tr>
    
      
        </tbody>
      </table>
        </div>
        </div>
        </div>
        </div>
        </div>
    </div>
    
    
    
    </template>
    

    
    <style scoped>
    
    </style>
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
const campusList = ref([])
const schoolList = ref([])
const classList = ref([])
const school_number = ref(null)
const campus_number = ref(null)
const class_number = ref(null)
const showDialog = ref(null)
const showAggregateScaleModal = ref(false)
const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const campus_level_number = ref("")
const campus_class_number = ref("")
const campusCurriculumDataInfo = ref(null)
const campusLevelList = ref(null)
const campusClassList = ref(null)

onMounted(() => {
      fetchGradeScale()
      fetchCampusLevel()
    }
)

const fetchGradeScale = () =>{
  let data = {
    campus_number:campusNumber,
    campus_class_number:campus_class_number.value
  }
  assessmentStore.fetchAggregateScale(data)
}

const addAggregateScale = () => {
  showAggregateScaleModal.value = true
}


const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

const fetchClass = (campus_level_number) => {
  academicYearStore.fetchCampusClassByLevel(campus_level_number)
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
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        // notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

watch (
    () => assessmentStore.newAggregateScaleResponse,
    async (data) => {
      if(data){
        showAggregateScaleModal.value = false
        await fetchGradeScale()
        notificationStore.successToast("Success", data.message)
      }
    }
)


</script>
<template>
    <div>

      <AppModal title="Add Aggregate Scale" v-model="showAggregateScaleModal" xl2>
        <NewGradeScale></NewGradeScale>
      </AppModal>




      <div class="row">
            <div class="col-12">
              <div class="card">
           <div class="row">
            <div class="col-lg-6 "> 
                  
            </div>
            <div class="col-lg-6">
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

        <div class="mt-[50px]">
          <div class="row mx-auto">


            <div class="col-lg-4  mb-2">
              <select
                  class="form-select form-select-sm shadow-none"
                  v-model="campus_level_number"
                  @change="fetchClass(campus_level_number)"
              >
                <option disabled value="">--Select Level--</option>
                <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>



            <div class="col-lg-4  mb-2">
              <select
                  class="form-select form-select-sm shadow-none" required
                  v-model="campus_class_number"
                  @change="fetchGradeScale"
              >
                <option disabled value="">--Select Class--</option>
                <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
              </select>
            </div>

          </div>
        </div>



      </div>
    </div>   
      <table id="data"
          class="table table-striped"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
          <th>#</th>
          <th scope="col">Name</th>
          <th scope="col">Class (s)</th>
          <th scope="col">Values(Min - Max)</th>
          <th scope="col">Weight</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for="(aggregateList,index) in aggregateData" :key="index">
            <td>{{ index+1 }}</td>
            <td>{{ aggregateList.name }}</td>
            <td>{{aggregateList.class_name}}</td>
            <td>{{  aggregateList.min_value}} - {{  aggregateList.max_value}}</td>
            <td>{{aggregateList.weight}}</td>
            <td>
          <button  data-bs-toggle="modal" data-bs-target="#updateRoleModel" type="button" aria-controls="rolesDialog">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);">|</span>&nbsp;
          <button type="button">
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
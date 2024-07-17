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

const { can } = useAbility()

const routerData = useRouter()
const assessmentStore = useAssessmentStore()
const levelStore = useLevelStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()
const notificationStore  = useNotificationStore()

const errorMessage = ref(null)
const showDialog = ref(null)
const assessmentScaleData = ref([])
const scaleD = ref([])

const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const campus_level_number = ref("")
const campus_class_number = ref("")
const campusCurriculumDataInfo = ref(null)
const campusLevelList = ref(null)
const campusClassList = ref(null)
const showAssessmentScaleModal = ref(false)

const namee = ref(null)
const assessmentGradeListD = ref([])
const editModel = ref(false)

onMounted(() => {
    filterAssessmentGrades()
    fetchCampusLevel()
    }
)


const filterAssessmentGrades = () =>{
  let data = {
    campus_number:campusNumber,
    campus_class_number:campus_class_number.value
  }
  assessmentStore.fetchAssessmentGrades(data)
}


const addAssessmentScale = () =>{
  assessmentGradeListD.value = ""
  showAssessmentScaleModal.value = true
  editModel.value = false
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
    () => assessmentStore.assessmentScaleResponse,
    async (data) => {
      if(data){
        assessmentScaleData.value = data.data   
      }
    },
    {deep:true}
)

const openEditModal = (a) =>{
  scaleD.value=a
  showDialog.value = true
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


const editThisData = (List) => {
  editModel.value = true
  assessmentGradeListD.value = List
  namee.value = List.name
  showAssessmentScaleModal.value = true
}

const deleteThisData = (id,name) => {
  if(!confirm("Are you sure, you want to delete: " + name)){
    return
  }else{

  }

}

</script>

<template>
    <div>

      <AppModal :title="editModel ? 'Edit ' + namee:'Add Assessment Grade'"  v-model="showAssessmentScaleModal" xl6>
        <NewAssessmentScale :scaleD="scaleD" :assessmentGradeListD="assessmentGradeListD"></NewAssessmentScale>
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
                    @change="filterAssessmentGrades"
                >
                  <option disabled value="">--Select Class--</option>
                  <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
                </select>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>  
    <!-- {{assessmentScaleData}}  -->


    <div  v-for="(scaleD, index) in assessmentScaleData" :key="index" class="text-xs border rounded-md mx-3 mb-4">
        <div class="bg-[#ededed] rounded-t-md">
          <div class="flex ml-5 py-2">
            <div class="mr-10">#{{scaleD.assessment_area_count}}</div>
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
            <th  scope="col" class="w-[25%]">Classes</th>
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
            <td>
              <ul class="list-group text-sm" style="border-radius: 0 0 0 0;" >
                <li class="list-group-item" v-for="(cl, idx) in scaleD.classes" :key="idx">{{ cl.name }} [{{ cl.abbreviation }}]</li>
              </ul>
            </td>
            <td>
            </td>

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
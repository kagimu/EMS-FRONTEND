<script setup>
import {onMounted,ref, watch} from "vue";
import NewGradeStandard from "@/main/dashboard/assessment/assessmentComponents/NewGradeStandard.vue"
import { useAssessmentStore } from "../store/assessment";
import { useAbility } from '@casl/vue';
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import {useRouter} from "vue-router";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";

const { can } = useAbility()
const assessmentStore = useAssessmentStore()
const levelStore = useLevelStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()

const gradeStandardData = ref([])
const errorMessage = ref(null)
const notificationStore = useNotificationStore()
const showGradeStandardModal = ref(false)
const routerData = useRouter()
const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = ref("")
const campus_level_number = ref("")
const campus_class_number = ref("")
const campusCurriculumDataInfo = ref(null)
const campusLevelList = ref(null)
const campusClassList = ref(null)



onMounted(
    async () => {
      await doFetchGradingStandard()
    } )

const doFetchGradingStandard = () => {
  let data = {
    campus_number:campusNumber,
    campus_class_number:campus_class_number.value
  }
  assessmentStore.fetchGradeStandard(data)
}

const addGradingStandard = () => {
  showGradeStandardModal.value = true
}

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
    () => assessmentStore.gradeStandardResponse,
    async (data) => {
      if(data){
        gradeStandardData.value = data.data
      }
    }
)
watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
      }
    }
)

watch(
    () => assessmentStore.newGradeStandardResponse,
    async (data) => {
      if(data){
        showGradeStandardModal.value = false
        await doFetchGradingStandard()
        notificationStore.successToast("Success", data.message)
      }
    }
)

</script>
<template>
    <div>

      <AppModal title="Add Grade Standard" v-model="showGradeStandardModal" lg>
        <NewGradeStandard></NewGradeStandard>
      </AppModal>

    




     <div class="px-2 py-2 border-b">
           <div class="row">
            <div class="col-lg-6 ">
            </div>
            <div class="col-lg-6">
                <button
                    @click="addGradingStandard"
                v-if="can('add_grade_standard','general')"
                 style="float: right; margin-right: 5px;" data-bs-toggle="modal" data-bs-target="#addAccount"  type="button"  aria-controls="rolesDialog" class="btn btn-primary btn-sm"><i class="bi bi-plus"></i> New Grade-Standard </button>
            </div>
           </div>
     </div>


      <div class="mt-[50px]">
        <div class="row mx-auto">

        <div class="col-lg-4  mb-2">

          <select
              class="form-select form-select-sm shadow-none"
              v-model="campus_curriculum_number"
              @change="fetchCampusLevel(campus_curriculum_number)"
          >
            <option disabled value="">--Select Curriculum--</option>
            <option v-for="(list, index) in campusCurriculumDataInfo" :key="index" :value="list.number">{{list.name}}</option>
          </select>
        </div>



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
              @change="doFetchGradingStandard"
          >
            <option disabled value="">Select</option>
            <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
          </select>
        </div>

      </div>
      </div>


      <div class="mt-10">
        <table
          class="table table-striped"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Type</th>
          <th>Descriptions</th>
          <th>Class</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(gradeList, index) in gradeStandardData " :key="index">
          <td>{{ gradeList.code }}</td>
          <td>{{ gradeList.name }}</td>
          <td>{{ gradeList.type }}</td>
          <td>{{ gradeList.description }}</td>
          <td>{{ gradeList.class }}</td>

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
    
    
    
    </template>
    

    
    <style scoped>
    
    </style>
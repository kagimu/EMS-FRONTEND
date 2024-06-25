<script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
  import {useRouter} from "vue-router";
  const routerData = useRouter()
  import { useAbility } from '@casl/vue';
  import NewAssessmentArea from "./NewAssessmentArea.vue";
  import {useLevelStore} from "@/main/settings/level/store/level.js";
  import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
  import AppModal from "@/components/AppModal.vue";


const { can } = useAbility()
const areaDialog = ref(false)

  const assessmentListData = ref([])
  let errorMessage = ref(null)
  const assessmentStore= useAssessmentStore()
  const  notificationStore  = useNotificationStore()
  const levelStore = useLevelStore()
  const classStore = useClassesStore()
  let  curriculumNumber = routerData.currentRoute.value.query.id
  const level = ref( "")
  const curriculum_class_number = ref( "")

  const levelList = ref( [])
  const classList = ref( [])
  const editMode = ref(false)
  const namee = ref(null)
  const assessmentAreaInfo = ref([])


    onMounted(
    async () => {
      await levelStore.fetchCurriculumLevels(curriculumNumber)
      fetchAssessmentAreaInfo()
    } )


  const fetchAssessmentAreaInfo = () => {
  if(curriculum_class_number.value){
     assessmentStore.fetchAssessmentArea(curriculum_class_number.value)
    }
  }



  const filterClasses = () => {
    let data = {
      level:level.value,
      curriculum_number:curriculumNumber,
    }
    classStore.fetchCurriculumClasses(data)
  }


  watch(
      () => classStore.curriculumClassInfoResponse,
      async (data) => {
        if(data){
          classList.value = data.data
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
    () => assessmentStore.assessmentAreaResponse,
    async (data) => {
      if(data){
        assessmentListData.value = data.data
      //  notificationStore.successToast("Success", data.message)
      }
    }
)

const showAreaDialog = () =>{
  assessmentAreaInfo.value = ""
  editMode.value = false
  areaDialog.value = true
}

const closeAreaDialog = () =>{
  areaDialog.value = false
}

  watch(
      () => levelStore.curriculumLevelInfoResponse,
      async (data) => {
        if(data){
          levelList.value = data.data
        }
      },
      {deep:true}
  )

  watch (
      () => assessmentStore.newAssessmentAreasResponse,
      async (data) => {
        if(data){
          fetchAssessmentAreaInfo()
          areaDialog.value = false
          notificationStore.successToast("Success", data.message)
        }
      }
  )


  const deleteThisData = (id,name) => {
if(!confirm("Are you sure, you want to delete: " + name)){
  return
}
}

const openEditModel = (num,name) =>{
  editMode.value = true
  areaDialog.value = true
  namee.value = name
}
  </script>



<template>
  <div>

    <!-- :title="mealEditMode ? 'Edit Meal' : 'Add Meal Course'" -->
    <AppModal  :title="editMode ? 'Edit Assessment Area '+ namee : 'New Assessment Area'" v-model="areaDialog" xl2>
      <NewAssessmentArea></NewAssessmentArea>
    </AppModal>

    <div class="col-12">
              <div class="card">
                <div class="card-header">
           <div class="row">
            <div class="col-lg-6 "> 
            </div>
            <div class="col-lg-6">
              <button
                  v-if="can('add_assessment_area','general')"
                  style="float: right" type="button"
                  class="btn btn-primary btn-sm float-end mb-2 mr-4"
                  @click="showAreaDialog">
                <b><i class="bi bi-plus"></i></b>
                <small>Add Assessment Area</small>
              </button>
            </div>
    
           </div>
               </div>
                <div class="card-body" >
        <div >



          <div class="row mx-auto mt-5">

            <div class="col-3">
              <div class="mb-2">
                <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="level"
                    @change="filterClasses()"
                >
                  <option disabled value="">--Filter by Level--</option>
                  <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.level_number">{{lvl.code+". "+lvl.name}}</option>
                </select>
              </div>

            </div>

            <div class="col-3">
              <div class="mb-2">
                <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="curriculum_class_number"
                    @change="fetchAssessmentAreaInfo">
                  <option disabled value="">--Filter by Class--</option>
                  <option v-for="(list, index) in classList[0]?.class" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
                </select>
              </div>

            </div>

          </div>

    <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <!-- <th>Interview</th> -->
          <th>Name</th>
          <th>#</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(assessmentData, index) in assessmentListData " :key="index">
          <td>{{ assessmentData.name}}</td>
          <td>
          <button  type="button" @click="openEditModel(assessmentData.number,assessmentData.name)">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);">|</span>&nbsp;
          <button type="button" @click="deleteThisData(assessmentData.number,assessmentData.name)">
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
  </template>
  
  <style scoped>
  .textColor{
    font-size: 11px;
  }
  
  </style>
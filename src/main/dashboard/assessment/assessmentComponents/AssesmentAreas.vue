<template>
  <div>

    <div class="col-12">
              <div class="card">
                <div class="card-header">
           <div class="row">
            <div class="col-lg-6 "> 
<!--                  <input type="text" class="form-control mt-1 mb-0" placeholder="Search...">  -->
            </div>
            <div class="col-lg-6">
              <button
                  v-if="can('add_assessment_area','general')"
                  style="float: right" type="button"
                  class="btn btn-primary btn-sm float-end mb-2 mr-4"
                  data-bs-toggle="offcanvas"
                  aria-controls="rolesDialogg"
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
                    @click="filterClasses()"
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
                    @click="fetchAssessmentAreaInfo(curriculum_class_number)">
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
        <tr v-for="(assesmentData, index) in AsessmentListData " :key="index">
          <td>{{ assesmentData.name}}</td>
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

  <!-- schedule interview -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialogg" :class="{ show: areaDialog }" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel"><small>Assessment Area</small></h5>
            <button type="button" class="btn-close"  data-bs-dismiss="offcanvas" aria-label="Close" @click="closeAreaDialog"></button>
          </div>
          <div class="offcanvas-body">
          <NewAssessmentArea></NewAssessmentArea>
          </div>
        </div>
<!-- wnd  -->
  </div>
  </div>
  </div>
  </div>
  </template>
  
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

const { can } = useAbility()
const areaDialog = ref(false)

  const AsessmentListData = ref([])
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


    onMounted(
    async () => {
      await levelStore.fetchCurriculumLevels(curriculumNumber)

    } )

  const fetchAssessmentAreaInfo = (curriculum_class_number) => {
  if(curriculum_class_number){
     assessmentStore.fetchAssessmentArea(curriculum_class_number)
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
    () => assessmentStore.assesmentAreaResponse,
    async (data) => {
      if(data){
        AsessmentListData.value = data.data
      //  notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

const showAreaDialog = () =>{
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

  </script>


  
  <style scoped>
  .textColor{
    font-size: 11px;
  }
  
  </style>
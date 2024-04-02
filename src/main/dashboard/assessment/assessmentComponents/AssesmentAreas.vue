<template>
  <div>

    <div class="col-12">
              <div class="card">
                <div class="card-header">
           <div class="row">
            <div class="col-lg-6 "> 
                  <input type="text" class="form-control mt-1 mb-0" placeholder="Search...">  
            </div>
            <div class="col-lg-6">
              <button
              v-if="can('add_assessment_area','general')"
               style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
      data-bs-toggle="offcanvas" aria-controls="rolesDialogg" @click="showAreaDialog">
     <b><i class="bi bi-plus"></i></b> <small>
      Add Assessment Area</small></button>
            </div>
    
           </div>
               </div>
                <div class="card-body" >
        <div >






  
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

const { can } = useAbility()
const areaDialog = ref(false)

  const AsessmentListData = ref([])
  let errorMessage = ref(null)
  const assessmentStore= useAssessmentStore()
  const  notificationStore  = useNotificationStore()


    onMounted(
    async () => {
      await assessmentStore.fetchAssesmentArea()
    } )

    

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
  </script>


  
  <style scoped>
  .textColor{
    font-size: 11px;
  }
  
  </style>
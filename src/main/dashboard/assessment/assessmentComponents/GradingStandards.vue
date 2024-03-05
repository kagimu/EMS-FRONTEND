<template>
    <div>
    
        <div class="modal fade" id="addAccount" tabindex="-1"  aria-labelledby="" aria-hidden="true" :class="{ show: showDialog }">
      <div class="modal-dialog">
       <NewGradeStandard></NewGradeStandard>
        </div>
      </div>

      <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
           <div class="row">
            <div class="col-lg-6 "> 
                  <input type="text" class="form-control mt-1 mb-0" placeholder="Search...">  
            </div>
            <div class="col-lg-6">
                <button
                v-if="can('add_grade_standard','general')"
                 style="float: right; margin-right: 5px;" data-bs-toggle="modal" data-bs-target="#addAccount"  type="button"  aria-controls="rolesDialog" class="btn btn-primary btn-sm"><i class="bi bi-plus"></i> New Grade-Standard </button>
 
                <!-- <button  class="btn btn-outline-secondary  btn-sm mt-1" style="float: right;border: none;">
                <small><i class="bi bi-printer">&nbsp;Print</i></small></button>  -->
            </div>
    
           </div>
               </div>
                <div class="card-body" >
        <div >
           
      <table id="data"
          class="table table-striped"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Type</th>
          <th>Descriptions</th>
          <th>Class</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for="(gradeList,index) in gradeStandardData" :key="index">
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
        </div>
        </div>
        </div>
    </div>
    
    
    
    </template>
    
    <script setup>
    import {onMounted,reactive, computed,ref, watch} from "vue";
    import NewGradeStandard from "@/main/dashboard/assessment/assessmentComponents/NewGradeStandard.vue"
    import { useAssessmentStore } from "../store/assessment";
    import { useAbility } from '@casl/vue';
    import useNotificationStore from "@/composables/useNotification.js";

    const { can } = useAbility()
    const assessmentStore = useAssessmentStore()
    const gradeStandardData = ref([])
    const errorMessage = ref(null)
    const notificationStore = useNotificationStore()

    onMounted(
    async () => {
      await assessmentStore.fetchGradeStandard()
    } )
    
watch (
    () => assessmentStore.newAccountResponse,
    async (data) => {
      if(data){
        agradeStandardData.value = false
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

    </script>
    
    <style scoped>
    
    </style>
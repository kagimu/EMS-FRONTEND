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
              v-if="can('add_examtype','general')"
               style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
      data-bs-toggle="offcanvas" aria-controls="rolesDialogg" @click="shoDialog">
     <b><i class="bi bi-plus"></i></b> <small>
      Add Exam Type</small></button>
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
          <th>Decription</th>
          <th>#</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(examTypeData, index) in examTypeListData " :key="index">
          <td>{{ examTypeData.name}}</td>
          <td>{{ examTypeData.description}}</td>
           <td>
            <button  data-bs-toggle="modal" data-bs-target="#updateRoleModel" type="button" aria-controls="rolesDialog">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>
          <button type="button">
            <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
          </button> 
            </td>
        </tr>  

      </tbody>
    </table>
  </div>

  <!-- schedule interview -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialogg" :class="{ show: showDialog }" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel"><small>Exam Type</small></h5>
            <button  type="button" class="btn-close"  data-bs-dismiss="offcanvas" aria-label="Close" @click="closeShowDialog()"></button>
          </div>
          <div class="offcanvas-body">
            <form @submit.prevent="addExamType">
             <div class="mb-2">
                <label class="textColor"><small>Name</small></label>
                <input v-model="form.name"  type="text" required class="form-control">
              </div>
              <div class="mb-2">
                <label class="textColor"><small>Description</small></label>
                <input v-model="form.description"  type="text" required class="form-control">
              </div>

              
              
              <div class="text-right mt-4">
                <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
                  <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
                    <span class="visually-hidden">Loading...</span>
                  </div></button>
              </div>
            </form>
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
  import { useAbility } from '@casl/vue';

const { can } = useAbility()

  const buttonLoader = ref(false)
  const examTypeListData = ref([])
  const showDialog= ref(false)
  let errorMessage = ref(null)

  const assessmentStore= useAssessmentStore()
  const  notificationStore  = useNotificationStore()


    const form = reactive({ 
      name:null,
      description:null

    })

 //working on dialog
const closeShowDialog = () => {
  showDialog.value = false;
};
const shoDialog = () => {
  showDialog.value = true;
}


    const addExamType = () => {
    //  alert(JSON.stringify(form))
    showDialog.value = true;
     buttonLoader.value = true
     assessmentStore.createExamType(form)  
     
    }
  
    
onMounted(
    async () => {
      await assessmentStore.fetchExamType()
    } )

    watch (
    () => assessmentStore.newExamTypeResponse,
    async (data) => {
      if(data){
        assessmentStore.fetchExamType()
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        
      }
    },
    {deep:true}
)

watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        buttonLoader.value = false
        // notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)


    watch(
    () => assessmentStore.examTypeResponse,
    async (data) => {
      if(data){
        examTypeListData.value = data.data

        // notificationStore.successToast("Success", data.message)
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
<template>
  <div>
  <div class="container mt-4">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Interview Assesment Area
      <button style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
      data-bs-toggle="offcanvas" aria-controls="rolesDialogg" @click="showInterviewDialog">
     <b><i class="bi bi-plus"></i></b> <small>
        Add</small></button>
      <hr style="width:30px;"></h6>
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
        <tr v-for="(interviewAssesmentData, index) in interviewAssesmentListData " :key="index">
          <td>{{ interviewAssesmentData.name}}</td>
           <td>
            <button data-bs-toggle="modal" data-bs-target="#infoModal" 
             class="link-primary" style="border-width: 0px;text-decoration: none;" title=""><small>
              <i class="bi bi-eye">&nbsp;View More</i></small></button>        
            </td>
        </tr>  

      </tbody>
    </table>
  </div>

  <!-- schedule interview -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialogg" :class="{ show: interviewDialog }" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Interview Assesment Area</h5>
            <button type="button" class="btn-close"  data-bs-dismiss="offcanvas" aria-label="Close" @click="closeInterviewDialog"></button>
          </div>
          <div class="offcanvas-body">
            <form @submit.prevent="addInterviewAssesment">
              <div class="mb-2">
                <label class="textColor"><small>Name</small></label>
                <input v-model="form.name"  type="text" required class="form-control">
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
  </template>
  
  <script setup>
    import {onMounted,reactive, ref, watch} from "vue";
    import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
    import useNotificationStore from "@/composables/useNotification.js";

    const buttonLoader = ref(false)
    const interviewAssesmentListData = ref([])
    const interviewDialog= ref(false)
    let errorMessage = ref(null)

    const applicationStore= useApplicationStore()
    const  notificationStore  = useNotificationStore()
    const form = reactive({ 
      name:null,
    })


 //working on dialog
const closeInterviewDialog = () => {
  interviewDialog.value = false;
};
const showInterviewDialog = () => {
  interviewDialog.value = true;
}


    const addInterviewAssesment = () => {
    //  alert(JSON.stringify(form))
    interviewDialog.value = true;
     buttonLoader.value = true
     applicationStore.createInterviewAssesmentAreas(form)  
     
    }
  

    watch (
    () => applicationStore.InterviewAssesmentAreasResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        // await applicationStore.fetchInterviewAssesment()
      }
    },
    {deep:true}
)

watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
         buttonLoader.value = true
        errorMessage.value = data.message
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

onMounted(
    async () => {
      await applicationStore.fetchInterviewAssesment()
    } )

    watch(
    () => applicationStore.interviewAssesmentResultsResponse,
    async (data) => {
      if(data){
        interviewAssesmentListData.value = data.data
      }
    },
    {deep:true}
)
  </script>


  
  <style scoped>
  
  </style>
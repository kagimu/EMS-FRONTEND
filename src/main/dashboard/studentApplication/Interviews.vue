<template>
  <div>
  <div class="container mt-4">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Interview List
      <button style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
      data-bs-toggle="offcanvas" data-bs-target="#rolesDialogg" aria-controls="rolesDialogg">
      <i class="bi bi-plus"></i>&nbsp;<small>
        Add Interview</small></button>
      <hr style="width:30px;"></h6>
    <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Scheduled_on</th>
          <th>Venue</th>
          <th>Message</th>
          <th>#</th>
        </tr>

      </thead>
      <tbody>
        <tr v-for="(interlist, index) in interviewList" :key="index">
          <td>{{ interlist.name}}</td>
          <td>{{ interlist.interview_date }}</td>
          <td>{{ interlist.venue }}</td>
          <td>{{ interlist.message }}</td>
          <td>
            
            <router-link
                  class="text-decoration-none"
                  :to="{name:'interview-details', query:{interview_id:interlist.number}}"
              ><button class="link-primary" style="border-width: 0px;text-decoration: none;" title=""><small>
              <i class="bi bi-eye">&nbsp;View Details</i></small></button>   
            </router-link>     
            </td>
        </tr>        
        
      </tbody>
    </table>
  </div>

  <!-- schedule interview -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialogg" aria-labelledby="offcanvasRightLabel" >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Create Interview</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <form @submit.prevent="createInterview">
              <div class="mb-2">
                <label class="textColor"><small>Title</small></label>
                <input v-model="formData.name" type="text" required class="form-control">
              </div>
              <div class="mb-2">
                <label class="textColor"><small>Interview Date</small></label>
                <input v-model="formData.interview_date"  type="date" required class="form-control">
              </div>
              <div class="mb-2">
                <label class="textColor"><small>Venue</small></label>
                <input v-model="formData.venue"  type="text" required class="form-control" >
              </div>

              <div class="mb-2">
                <label class="textColor"><small>Description</small></label>
                <textarea v-model="formData.message"  required class="form-control noFocus" id="floatingTextarea2" style="height: 100px"></textarea>
              </div>
              <div class="text-right mt-4">
                <button style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
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

const interviewList = ref( [])
let errorMessage = ref(null)

const buttonLoader = ref(false)

const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()

onMounted(
    async () => {
      await applicationStore.fetchInterviewList()
    } )

    watch(
    () => applicationStore.interviewListResponse,
    async (data) => {
      if(data){
        interviewList.value = data.data
      }
    },
    {deep:true}
)

watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

const formData = reactive({ 
name:null,
interview_date:null,
venue:null,
message:null,
})


const createInterview = () => {
alert(JSON.stringify(formData))
applicationStore.createNewInterview(formData)
}

watch(
      () => applicationStore.newInterviewResponse,
      async (data) => {
          if (data) {
              buttonLoader.value = false
              notificationStore.successToast("Success", data.message)
          }
      },
      {deep: true}
  )


  </script>


  
  <style scoped>
  
  </style>
<template>
  <div>
    <!-- modal for viewing more details -->
    <div class="modal fade" id="infoModal" tabindex="-1" :class="{ show: schoolDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <application-details></application-details>
      </div>
    </div>
    

  <div class="container mt-4">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Interview List
      <button style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
      data-bs-toggle="offcanvas" data-bs-target="#rolesDialogg" aria-controls="rolesDialogg">
      <i class="bi bi-save2"></i>&nbsp;<small>
        schedule Interview</small></button>
      <hr style="width:30px;"></h6>
    <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <th>APN</th>
          <th>Scheduled_on</th>
          <th>Venue</th>
          <th>Message</th>
          <th>#</th>
        </tr>
      <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
  </div>
      </thead>
      <tbody>
        <tr v-for="(interlist, index) in interviewList" :key="index">
          <td>{{ interlist.student_number }}</td>
          <td>{{ interlist.interview_date }}</td>
          <td>{{ interlist.venue }}</td>
          <td>{{ interlist.message }}</td>
          <td>
            <button data-bs-toggle="modal" data-bs-target="#infoModal" 
             class="link-primary" style="border-width: 0px;text-decoration: none;" title=""><small>
              <i class="bi bi-pencil">&nbsp;Grade</i></small></button>        
            </td>
        </tr>        
        


      </tbody>
    </table>
  </div>

  <!-- schedule interview -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialogg" aria-labelledby="offcanvasRightLabel" >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Schedule Interview</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <form>
              <div class="mb-2">
                <label class="textColor"><small>Date</small></label>
                <input  type="date" required class="form-control">
              </div>
              <div class="mb-2">
                <label class="textColor"><small>Venue</small></label>
                <input  type="text" required class="form-control" >
              </div>

              <div class="mb-2">
                <label class="textColor"><small>Message</small></label>
                <textarea  required class="form-control noFocus" id="floatingTextarea2" style="height: 100px"></textarea>
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
import ApplicationDetails from './ApplicationDetails.vue';
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";

const interviewList = ref( [])
let errorMessage = ref(null)

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

  </script>


  
  <style scoped>
  
  </style>
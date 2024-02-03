<template>
  <div>

    <!-- popup for putting number of interviews to admit -->
    <div class="modal fade" id="infoModal" tabindex="-1"  aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2"><small>Bulk Addmission</small></h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
            <form >
                <div class="row">
                    <div class="col-lg-3">
                        <label class="textColor text-sm"><small>No. Of <br>Students</small></label>
                    </div>
                    <div class="col-lg-5">
             
            <input type="number" style="outline: none 0 !important; box-shadow: none;"  required
             class="form-control form-control-sm">
            </div>
            <div class="col-lg-4">
                <label class="textColor text-sm"> <span class="star"></span></label>

             <button class="btn btn-primary btn-sm form-control form-control-sm"><small><i class="bi bi-arrow-right-short"></i>Admit</small></button>
            </div>
                </div>
            
            </form>
            </div>
        </div>
        </div>
      </div>
    </div>

  <div class="container mt-4">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Interview Results List
      <button style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
      data-bs-toggle="modal" data-bs-target="#infoModal" aria-controls="rolesDialogg">
      <i class="bi bi-box-arrow-in-right"></i>&nbsp;<small>
        Bulk Admission</small></button>
      <hr style="width:30px;"></h6>
    <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <th>Student</th>
          <th>Prefered Class</th>
          <th style="width:20px;">Av.Score</th>
          <th>#</th>
        </tr>

      </thead>
      <tbody>    
        <tr>
          <td>Collins Mpiima</td>
          <td>Primary One</td>
          <td><input disabled type="text" value="89"></td>
          <td>
            <router-link
                  class="text-decoration-none"
                  :to="{name:'admit-student'}"
              ><button class="link-primary" style="border-width: 0px;text-decoration: none;" title=""><small>
                <i class="bi bi-arrow-right-short"></i>Admit</small></button>   
            </router-link>     
            </td>
        </tr> 
      </tbody>
    </table>
  </div>


  </div>
  </template>
  
  <script setup>
import {onMounted,reactive, ref, watch} from "vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";

const interviewResultList = ref( [])
let errorMessage = ref(null)

const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()

onMounted(
    async () => {
      await applicationStore.fetchInterviewResultsAll()
    } )

    watch(
    () => applicationStore.interviewResultsResponse,
    async (data) => {
      if(data){
        interviewResultList.value = data.data
      }
    },
    {deep:true}
)

watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)
  </script>


  
  <style scoped>
  
  </style>
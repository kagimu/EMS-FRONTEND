<template>

    <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2"><small>Application Details {{ applicationNumber }}</small></h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">

  <div class="row mx-auto">
    <div class="col-4" style="border-right: 1px solid rgba(128, 128, 128, 0.137);">
        <p class="ml-4 mt-4 mb-10" style="text-align: left !important;">GUARDIAN/PARENT DETAILS</p>
        <div class="mb-2">
          <span class="textColor text-sm"><small>Surname : <span class="details">Mpiima</span></small></span>
        </div>

        <div class="mb-2">
          <span class="textColor text-sm"><small>Second name : <span class="details">Collins</span></small></span>
        </div>

        <div class="mb-2">
          <span class="textColor text-sm"><small>Other names: <span class="details">Mark</span></small> </span>
        </div>

        <div class="mb-2">
          <span class="textColor text-sm"> <small>Telephone No. : <span class="details">+256786950567</span></small></span>
        </div>

        <div class="mb-2">
          <span class="textColor text-sm"><small>Alternative No.: <span class="details">07625525612</span></small> </span>
        </div>
         <div class="row">
            <div class="mb-2">
          <span class="textColor text-sm"><small>Email: <span class="details">collinsmpiima@gmail.com</span></small></span>
        </div>
            <div class="mb-2">
          <span class="textColor text-sm"><small>Alternative Email: <span class="details">email@gmail.com</span></small></span>
        </div>
          </div>
        
    </div>


    <div class="col-4" style="border-right: 1px solid rgba(128, 128, 128, 0.137);">
        <p class="ml-4 mt-4 mb-10" style="text-align: left !important;">LEARNER DETAILS</p>
        <div class="mb-2">
          <span class="textColor text-sm"><small>Surname: <span class="details">Mutebi</span></small> </span>
        </div>

        <div class="mb-2">
          <span class="textColor text-sm"><small>Second name: <span class="details">Musa</span> </small></span>
        </div>

        <div class="mb-2">
          <span class="textColor text-sm"><small>Other names</small>: <span class="details">Sirina</span> </span>
        </div>

        <div class="mb-2">
          <span class="textColor text-sm"> <small>Prefered Class: <span class="details">Primary 4</span> </small></span>
        </div>

      
         <div class="row">
          
            <div class="mb-2">
          <span class="textColor text-sm"><small>Reason</small>: <span class="details"><i>Am tired fo the school</i></span> </span>
        </div>
         
          
            <div class="mb-2">
          <span class="textColor text-sm"><small>Age: <span class="details">15 years</span></small></span>
        </div>
          </div>
        
    </div>


    
    <div class="col-4" style="border-right: 1px solid rgba(128, 128, 128, 0.137);">
        <p class="ml-4 mt-4 mb-10" style="text-align: left !important;">PREVIOUS SCHOOL DETAILS</p>
        <div class="mb-2">
          <span class="textColor text-sm"><small>1. <span class="details">Paul Mukasa P/s | P.1 - 2020, P.3 - 2021 </span></small> </span>
        </div>
        <div class="mb-2">
          <span class="textColor text-sm"><small>2. <span class="details">Paul Mukasa P/s | P.1 - 2020, P.3 - 2021 </span></small> </span>
        </div>
        <div class="mb-2">
          <span class="textColor text-sm"><small>3. <span class="details">Paul Mukasa P/s | P.1 - 2020, P.3 - 2021 </span></small> </span>
        </div>



        
        
    </div>
<div class="row">
    <hr style="color: rgba(17, 17, 17, 0.265);">
    <div class="col-lg-8">

    </div>
    <div class="col-lg-2">
        <button style="float: right" type="button" class="btn btn-sm btn-primary mb-2 mr-4"><i class="bi bi-save2"></i>&nbsp;<small>Approve</small></button>
</div>
<div class="col-lg-2">
    <button style="margin-right: 5px;" type="button" class="btn btn-sm btn-danger mb-2 mr-4"><i class="bi bi-x-circle"></i>&nbsp;<small>Reject</small></button>
</div>

</div>
           
    </div>   
</div>
</div>
</div>
  </template>
  
  <script setup>
import {reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";

const ApplicationStore = useApplicationStore()
const notificationStore = useNotificationStore()

  defineProps({
    applicationNumber:String
  })

function appDetails(){
  let id = applicationNumber
  if(id == ""){
    ApplicationStore.fetchApplicationById(id)
  }else{
    notificationStore.errorToast("Error : ","Invalid Application Number")
  }
}
  </script>


  
  <style scoped>
  .mb-2 {
    text-align: left;

    font-family: Roboto, sans-serif;
    /* font-size: 17px; */
    border-radius: 3px !important;
}
  .details{
    color:rgba(0, 0, 0, 0.824);
  }
  </style>
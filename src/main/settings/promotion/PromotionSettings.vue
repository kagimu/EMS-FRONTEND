<template>
    <div>
  
  
      <div class="modal fade" id="levelModal" tabindex="-1"  aria-labelledby="" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header text-sm p-0">
              <h6 class="modal-title ml-3 mt-2 mb-2">Auto Promotion Setting</h6>
              <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mt-2 mb-2">
               <PromotionSetupModal></PromotionSetupModal>
              </div>
            </div>
          </div>
        </div>
      </div>
  
  
      <div class="row">
  
        <div class="col-12">
              <div class="flex justify-content-between mt-3">
                <div class="ml-4">Settings</div>
                <button 
                 type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  data-bs-toggle="modal" data-bs-target="#levelModal">
                  Promotion/Admission Setup
                </button>
              </div>
  
  
  
              <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
                <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th>Current Class</th>
                  <th>Next Class</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                <td>Promoted</td>
                 <td>P1</td>
                 <td>P2</td>
                 <td>90</td>
                 <td>Activate</td>
                 <td>Delete</td>
                </tr>
                <tr>
                <td>Admitted</td>
                 <td>P1</td>
                 <td>P2</td>
                 <td>90</td>
                 <td>Activate</td>
                 <td>#X</td>
                </tr>
                <tr>
                <td>Promoted</td>
                 <td>P1</td>
                 <td>P2</td>
                 <td>90</td>
                 <td>Activate</td>
                 <td>Delete</td>
                </tr>
                </tbody>
              </table>
  
            </div>
          </div>
  
  
  
    </div>
  </template>
  
  <script setup>
  
  import {onMounted, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import useCommonsStore from "@/composables/useCommons.js";
  import NewLevel from "@/main/settings/level/NewLevel.vue";
  import PromotionSetupModal from "./PromotionSetupModal.vue";
    

  
  </script>
  
  <style scoped>
  
  .linkStyle {
    text-decoration: none;
    color: #1867c0;
    font-size: 16px;
  }
  
  .linkStyle:hover {
    font-size: 16px;
    color: green;
    text-decoration: underline;
  }
  
  .viewButtonStyle{
    background-color: #2c6fb9;
    color: #ffffff;
    border-radius: 0;
  }
  
  .viewButtonStyle:hover {
    background-color: #0557b4;
    color: #ffffff;
  }
  
  </style>
<template>
    <div>
  
  
      <div class="modal fade" id="levelModal" tabindex="-1"  aria-labelledby="" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header text-sm p-0">
              <h6 class="modal-title ml-3 mt-2 mb-2">Promotion Value</h6>
              <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mt-2 mb-2">
              <PromotionValueModel></PromotionValueModel>
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
                  Promotion Value
                </button>
              </div>
  
  
  
              <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
                <thead>
                <tr>
                  <th scope="col">Promotion Setting</th>
                  <th>Score</th>
                  <th>Type</th>
                  <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
              
                <tr v-for="(promV,index) in promotionValueData" :key="index">
                <td>{{ promV.name }}</td>
                 <td>{{promV.name}}</td>
                 <td>{{promV.name}}</td>
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
  import {usePromotionStore} from "./store/promotion.js"
import PromotionValueModel from "./PromotionValueModel.vue";


  const promotionStore = usePromotionStore()
  const notificationStore = useNotificationStore()
  const promotionValueData = ref([])

  onMounted(() => {
    promotionStore.fetchPromotionSettingValue()
    }
)

watch(
    () => promotionStore.promotionSettingValueResponse,
    async (data) => {
        if (data) {
          promotionValueData.value = data.data
           notificationStore.successToast("Success", data.message)
        }
    },
    {deep: true}
)

watch(
    () => promotionStore.errorMessage,
    async (data) => {
          if (data) {
              notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}
)

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
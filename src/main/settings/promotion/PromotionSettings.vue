<script setup>
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import useCommonsStore from "@/composables/useCommons.js";
import NewLevel from "@/main/settings/level/NewLevel.vue";
import PromotionSetupModal from "./PromotionSetupModal.vue";
import {usePromotionStore} from "./store/promotion.js"
import AppModal from "@/components/AppModal.vue";

const promotionStore = usePromotionStore()
const notificationStore = useNotificationStore()
const promotionData = ref([])
const  shDialog = ref(false)
const  promotionSettingData = ref(null)

onMounted(() => {
  promotionStore.fetchPromotionSetting()
  }
)

const openModal = () =>{
shDialog.value = true
}

watch(
  () => promotionStore.PromotionSettingResponse,
  async (data) => {
      if (data) {
        shDialog.value = false
        promotionData.value = data.data
        // notificationStore.s`uccessToast("Success application submitted", data.message)
      }
  },
  {deep: true}
)

watch(
  () => promotionStore.errorMessage,
  async (data) => {
        if (data) {
          shDialog.value = false
            notificationStore.errorToast("Error", data.message)
        }
  },
  {deep: true}
)

const promotionSettingInfo = ref(null)

const openEditModal = (promotion) => {
  promotionSettingInfo.value = promotion
  shDialog.value = true
}

</script>


<template>
    <div>
  
  
      <!-- <div class="modal fade" id="levelModal" tabindex="-1"  aria-labelledby="" aria-hidden="true" :class="{ show: shDialog }">
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
      </div> -->

      <AppModal title="Auto Promotion Setting" v-model="shDialog" xl2>
        <PromotionSetupModal :promotionSettingInfo="promotionSettingInfo"></PromotionSetupModal>
    </AppModal>


  
      <div class="card">
  <div class="card-body">
      <div class="row">
  
        <div class="col-12">
              <div class="flex justify-content-between mt-3">
                <div class="ml-4">Settings</div>
                <button @click="openModal()"
                 type="button"  class="btn btn-sm buttonStyle btn-primary mr-2" >
                  Promotion/Admission Setup
                </button>
              </div>
  
  
  
              <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
                <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th>Current Class</th>
                  <th>Next Class</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
              
                <tr v-for="(prom,index) in promotionData" :key="index">
                <td>{{ prom.name }}</td>
                 <td>{{prom.previous_class.class_name}}</td>
                 <td>{{ prom.next_class.class_name }}</td>
                 <td>{{ prom.type }}</td>
                 <td>{{ prom.status }}</td>
                 <td> <button><i class="bi bi-trash"></i></button> &nbsp;
                <button @click="openEditModal(prom)"><i class="bi bi-pencil"></i></button></td>
                </tr>
                </tbody>
              </table>
  
            </div>
          </div>
        </div>
  
      </div>
  </div>
  </template>
  
 
  
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
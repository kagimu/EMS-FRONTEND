<script setup>
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import useCommonsStore from "@/composables/useCommons.js";
import NewLevel from "@/main/settings/level/NewLevel.vue";
import PromotionSetupModal from "./PromotionSetupModal.vue";
import {usePromotionStore} from "./store/promotion.js"
import AppModal from "@/components/AppModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import PromotionValueInfo from "@/main/settings/promotion/PromotionValueInfo.vue";
const confirmationRef = ref(null);

const promotionStore = usePromotionStore()
const notificationStore = useNotificationStore()
const promotionData = ref([])
const  shDialog = ref(false)
const  promotionSettingData = ref(null)
const  promotionSettingDialog = ref(false)

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



watch(
  () => promotionStore.newPromotionSettingResponse,
  async (data) => {
      if (data) {
        shDialog.value = false
        await promotionStore.fetchPromotionSetting()
       
      }
  }
)

const openPromotionValueDialog = (prom) => {
  promotionSettingData.value = prom
  promotionSettingDialog.value = true
}

</script>


<template>
    <div>

      <AppModal title="Promotion Value" v-model="promotionSettingDialog" xl2>
        <PromotionValueInfo :promotionSettingData="promotionSettingData"></PromotionValueInfo>
      </AppModal>


      <AppModal title="Auto Promotion Setting" v-model="shDialog" xl2>
        <PromotionSetupModal :promotionSettingInfo="promotionSettingInfo"></PromotionSetupModal>
      </AppModal>

      <ConfirmationModal ref="confirmationRef"></ConfirmationModal>
  
  <div>
      <div class="row">
  
        <div class="col-12">
              <div class="flex justify-content-between mt-3">
                <div class="ml-4">Settings</div>
                <button @click="openModal()"
                 type="button"  class="btn btn-sm buttonStyle btn-primary mr-2" >
                  New Setup
                </button>
              </div>
  
  
  
              <table class="table table-hover caption-top mt-5 table-striped" style="font-size: 13px;">
                <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th>Current Class</th>
                  <th>Next Class</th>
                  <th>Study Period</th>
                  <th>Curriculum</th>
                  <th>Campus</th>
                  <th>Type</th>
                  <th>Status</th>
                   <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
              
                <tr v-for="(prom,index) in promotionData" :key="index">
                <td>{{ prom.name }}</td>
                 <td>{{prom.previous_class.name}} [{{ prom.previous_class.abbreviation	 }}]</td>
                 <td>{{ prom.next_class.name }} [{{ prom.next_class.abbreviation	 }}]</td>
                 <td>{{ prom.study_period.name }}</td>
                 <td>{{ prom.curriculum.name }}</td>
                 <td>{{ prom.campus.name }}</td>
                 <td>{{ prom.type }}</td>
                 <td>{{ prom.status }}</td>
                 <td>
<!--                    <button style="color: red;" @click="deletePromoSetting(prom)"><i class="bi bi-trash"></i></button>-->
                    <button
                        @click="openPromotionValueDialog(prom)"
                        class="rounded text-[#0d6efd] font-normal"
                        style="border: 1px solid #0d6efd;">
                          <i class="bi bi-eye mr-2"></i>
                          Promotion Value
                    </button>
                 </td>
                </tr>
                </tbody>
              </table>
  
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
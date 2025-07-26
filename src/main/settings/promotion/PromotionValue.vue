<script setup>
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {usePromotionStore} from "./store/promotion.js"
import PromotionValueModel from "./PromotionValueModel.vue";
import AppModal from "@/components/AppModal.vue";

const type = ref("")
const promotionStore = usePromotionStore()
const notificationStore = useNotificationStore()
const promotionValueData = ref([])
const shDialog = ref(false)
const promotion_setting_number = ref("")
const promoSettingList = ref([])

  onMounted(() => {
    filterPromotionSettings()
    promotionStore.fetchPromotionSetting()
    }
)

const openModal = () =>{
shDialog.value = true
}



const filterPromotionSettings = (promotion_setting_number) => {
  promotionStore.fetchPromotionSettingValue(promotion_setting_number)
}




watch(
    () => promotionStore.promotionSettingValueResponse,
    async (data) => {
        if (data) {
          shDialog.value = false
          promotionValueData.value = data.data
        //    notificationStore.successToast("Success", data.message)
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
    }
)

const filterType = (ty) =>{
  type.value = ty
}

watch(
    () => promotionStore.newPromotionSettingValueResponse,
    async (data) => {
      if (data) {
        shDialog.value = false
        notificationStore.successToast("Success", data.message)
         filterPromotionSettings()

      }
    }
)

watch(
    () => promotionStore.PromotionSettingResponse,
    async (data) => {
      if (data) {
        promoSettingList.value = data.data
      }
    }
)

  </script>


<template>
    <div>
  
      <AppModal title="Promotion Value" v-model="shDialog" xl4>
        <PromotionValueModel></PromotionValueModel>
      </AppModal>
  

      <div class="row">
  
        <div class="col-12">


        
          <div class="" style="width: 300px;">


            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="promotion_setting_number"
                  required
                  @change="filterPromotionSettings(promotion_setting_number)"
              >
                <option disabled value="">
                  --Filter by promotion Setting--
                </option>
                <option v-for="(list, index) in promoSettingList" :key="index" :value="list.promotion_settings_number">
                  {{ list.name }}
                </option>
              </select>
            </div>



        </div>
  
  
        <div>
  
              <table class="table table-striped table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
                <thead>
                <tr>
                  <th>Promotion Setting</th>
                  <th>Maximum Aggregate</th>
                  <th>Minimum Score</th>
                  
                  <!-- <th scope="col">Action</th> -->
                </tr>
                </thead>
                <tbody>
              
                <tr v-for="(promV,index) in promotionValueData" :key="index">
                <td>{{ promV.PromotionSetting.name}}</td>
                <td>{{promV.MinimumPoints}}</td>
                 <td>{{promV.Score}}</td>
                 
               
                 <!-- <td> <button><i class="bi bi-trash"></i></button> &nbsp;
                <button><i class="bi bi-pencil"></i></button></td> -->
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
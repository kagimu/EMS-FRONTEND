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

  onMounted(() => {
    promotionStore.fetchPromotionSettingValue()
    }
)

const openModal = () =>{
shDialog.value = true
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
        await promotionStore.fetchPromotionSettingValue()

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
              <div class="flex justify-content-between mt-4">
                <div>Promotion Configurations</div>
                <button 
                 type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"   @click="openModal()">
                  New Configuration
                </button>
              </div>

        
          <div class="" style="width: 300px;">
            <label class="text-sm"><small>Type</small>  </label><br>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="type"
                    @change="filterType(type)"     
            >
                <option disabled value="">Select Type</option>
                <option value="score">Score</option>
                <option value="aggregate">Aggregate</option>
                <option value="grade">Grade</option>
                <option value="assessment">Assessment Area
                </option>
            </select>
        </div>
  
  
        <div v-if="type=='score'">
  
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

<div v-if="type=='assessment'">

  <div class="row">
    <div class="col-12">
      <div class="flex justify-content-between mt-4">
        <div></div>
        <button @click="adjustConfig()"
  type="button"  class="btn btn-sm  btn-outline-danger mr-2 text-xs" style="font-size: 12px !important;" >
  <i class="bi bi-arrow-left"></i> Adjust Configurations
      </button>

      </div>
      </div>
  </div>

 <table class="table table-responsive table-striped table-hover text-sm p-2 mt-3">
    <thead>
      <tr>
        <th>Assessment Area</th>
        <th>Score</th>
        <th>Aggregate</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Mathematics</td>
        <td>88</td>
        <td>Distinction (D1)</td>
      </tr>
      <tr>
        <td>SST</td>
        <td>89</td>
        <td>Distinction (D1)</td>
      </tr>
      <tr>
        <td>Science</td>
        <td>99</td>
        <td>Distinction (D1)</td>
      </tr>
    </tbody>
  </table>
</div>

<div v-if="type=='aggregate'">

</div>


<div v-if="type=='grade'">

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
<script setup>
import {onMounted, ref, watch} from "vue";
import {usePromotionStore} from "@/main/settings/promotion/store/promotion.js";

const promotionStore = usePromotionStore()

const props = defineProps({
  promotionSettingData:{}
})
const promotionValueData = ref(null)

onMounted(()=>{
  fetchDetails()
})

watch (
    () => props.promotionSettingData,
    async (data) => {
      if(data){
        fetchDetails()
      }
    }
)

const fetchDetails = async () => {
  let promotion_setting_number = props.promotionSettingData?.promotion_settings_number
  await promotionStore.fetchPromotionSettingValue(promotion_setting_number)
}


watch(
    () => promotionStore.promotionSettingValueResponse,
    async (data) => {
      if (data) {
        promotionValueData.value = data.data
      }
    }
)


</script>

<template>
<div>
<!--  {{promotionValueData}}-->

 <div class="text-gray-600">
   <div>
     <span class="text-xs">Promotion Settings name:</span><br />
     {{promotionValueData?.name}}
   </div>

   <div class="grid grid-cols-2 mt-4">
     <div>
       <span class="text-xs">Status:</span><br />
       <span class="text-success">{{promotionValueData?.status}}</span>
     </div>

     <div>
       <span class="text-xs">Type:</span><br />
       {{promotionValueData?.type}}
     </div>
   </div>

   <div class="mt-4">
     <span class="text-xs">Assessment Grade:</span><br />

     {{promotionValueData?.assessment_grade_name}}

<span class="text-xs">[ Min Aggregate: {{promotionValueData?.minimum_aggregates}} <==> Min Score: {{promotionValueData?.minimum_score}} ]</span>

   </div>



   <div class="mt-3">
     <span class="text-xs">Assessment Areas:</span><br />
     <div class="grid grid-cols-2 mt-1 text-sm" v-for="(lst, idx) in promotionValueData?.assessment_areas" :key="idx">
      <div class="flex justify-between bg-gray-50 rounded-sm px-2 py-1">
        <div>{{(idx + 1)}}. {{lst.assessment_area}}</div>
        <div>{{lst.aggregate_scale}}</div>
      </div>
     </div>
   </div>

 </div>

</div>
</template>

<style scoped>

</style>
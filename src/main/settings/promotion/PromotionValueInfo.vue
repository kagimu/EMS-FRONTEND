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
        await fetchDetails()
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

 <div class="text-gray-600 border rounded-xl border-gray-200 p-4">

   <div class="border-b border-gray-100 pb-2">
     <span class="text-xs">Promotion Settings name:</span><br />
     {{promotionValueData?.name}}
   </div>

   <div class="grid grid-cols-3 mt-4 border-b border-gray-100 pb-2">
   <div>
     <span class="text-xs">Campus:</span><br />
     {{promotionValueData?.campus?.name}}
   </div>

   <div>
     <span class="text-xs">Curriculum:</span><br />
     {{promotionValueData?.curriculum?.name}}
   </div>

   <div>
     <span class="text-xs">Study Period:</span><br />
     {{promotionValueData?.study_period.name}} <small class="italic">( {{promotionValueData?.study_period?.date_added}} )</small>
   </div>

   </div>

   <div class="grid grid-cols-4 mt-4 border-b border-gray-100 pb-2">
   <div>
     <span class="text-xs">Previous Class:</span><br />
     {{promotionValueData?.previous_class.name}} [ {{promotionValueData?.previous_class.abbreviation	}} ]
   </div>

   <div>
     <span class="text-xs">Next Class:</span><br />
     {{promotionValueData?.next_class.name}} [ {{promotionValueData?.next_class.abbreviation	}} ]
   </div>
   </div>

   <div class="grid grid-cols-4 mt-4 border-b border-gray-100 pb-2">
     <div>
       <span class="text-xs">Status:</span><br />
       <span class="text-success">{{promotionValueData?.status}}</span>
     </div>

     <div>
       <span class="text-xs">Type:</span><br />
       {{promotionValueData?.type}}
     </div>
   </div>

   <div class="mt-4 border-b border-gray-100 pb-2">
     <span class="text-xs">Assessment Grade:</span><br />

     <div>{{promotionValueData?.assessment_grade_name}} </div>

        <div class="text-xs">[ Min Aggregate: {{promotionValueData?.minimum_aggregates}} <==> Min Score: {{promotionValueData?.minimum_score}} ]</div>

   </div>


  <div class="grid grid-cols-2">
    <div class="mt-3">
      <span class="text-xs">Assessment Areas:</span><br />
      <div class="mt-1 text-sm" v-for="(lst, idx) in promotionValueData?.assessment_areas" :key="idx">
        <div class="flex justify-between bg-gray-50 rounded-sm px-2 py-1">
          <div>{{(idx + 1)}}. {{lst.assessment_area}}</div>
          <div>{{lst.aggregate_scale}}</div>
        </div>
      </div>
    </div>
  </div>


 </div>

</div>
</template>

<style scoped>

</style>
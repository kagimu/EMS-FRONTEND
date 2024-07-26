<script setup>
import UnitsOfMeasure from "@/main/dashboard/catering/cateringComponents/UnitsOfMeasure.vue";
import NewUnitOfMeasurement from "@/main/dashboard/catering/cateringComponents/NewUnitOfMeasurement.vue";
import router from "@/config/router.js";
import { useAbility } from '@casl/vue';

const { can } = useAbility()

const selectedTab = router.currentRoute.value.query.type ?? 'unit'
const menu = router.currentRoute.value.query.m

const switchTabs = (data) => {
  router.push({name: "catering", query: {m:menu,type: data}});
}

</script>
<template>
    <div>


      <div class="flex border-b">
        <div class="cursor-pointer text-sm" :class="selectedTab === 'unit' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('unit')">
          <div class="py-2 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Unit Of Measurement
          </div>
        </div>
        <div class="cursor-pointer text-sm" :class="selectedTab === 'new-unit' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('new-unit')">
          <div class="py-2 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            New Unit Of Measure
          </div>
        </div>
      </div>


      <div v-if="selectedTab === 'unit'">
        <div v-if="can('view_unit_of_measure','manage')">
          <UnitsOfMeasure></UnitsOfMeasure>
        </div>
      </div>

      <div v-if="selectedTab === 'new-unit'">
       <div v-if="can('create_unit_of_measure','manage')">
        <div class="grid grid-cols-12 gap-2 px-4 mt-10">
         <div class="col-span-5">
           <NewUnitOfMeasurement></NewUnitOfMeasurement>
         </div>
        </div>
       </div>
      </div>



    </div>
</template>

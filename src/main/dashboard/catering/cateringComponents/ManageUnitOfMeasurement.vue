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


      <div class="flex border-b mt-1">
        <div class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'unit' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('unit')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Unit Of Measurement
          </div>
        </div>
        <div v-if="can('create_unit_of_measure','general')" class="cursor-pointer text-sm rounded-t-md mr-1" :class="selectedTab === 'new-unit' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('new-unit')">
          <div class="py-1 px-3">
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

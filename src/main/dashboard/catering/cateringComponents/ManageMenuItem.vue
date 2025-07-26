<script setup>
import FoodMenuItem from "@/main/dashboard/catering/cateringComponents/FoodMenuItem.vue";
import NewMenuItem from "@/main/dashboard/catering/cateringComponents/NewMenuItem.vue";
import AssembledItems from "./AssembledItems.vue";
import router from "@/config/router.js";

import { useAbility } from '@casl/vue';

const { can } = useAbility()

const selectedTab = router.currentRoute.value.query.type ?? 'ingredients'
const menu = router.currentRoute.value.query.m

const switchTabs = (data) => {
  router.push({name: "catering", query: {m:menu,type: data}});
}


</script>
<template>
    <div >


      <div class="flex border-b mt-1">
        <div  v-if="can('view_ingredients','general')" class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'ingredients' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('ingredients')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Ingredients
          </div>
        </div>
        <div  v-if="can('view_menu_Items','general')" class="cursor-pointer text-sm rounded-t-md mr-1" :class="selectedTab === 'menu-item' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('menu-item')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Menu Item
          </div>
        </div>

        <div  v-if="can('create_menu_item','general')" class="cursor-pointer text-sm rounded-t-md mr-1" :class="selectedTab === 'new-item' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('new-item')">
          <div  class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
              New Item
          </div>
        </div>
      </div>


   <div v-if="selectedTab === 'ingredients'">
     <FoodMenuItem></FoodMenuItem>
   </div>

   <div v-if="selectedTab === 'menu-item'">
     <AssembledItems></AssembledItems>
   </div>

   <div v-if="selectedTab === 'new-item'" class="m-6" >
     <NewMenuItem></NewMenuItem>
   </div>


    </div>
</template>

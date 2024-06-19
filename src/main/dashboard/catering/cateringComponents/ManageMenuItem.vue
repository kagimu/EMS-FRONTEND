<script setup>
import FoodMenuItem from "@/main/dashboard/catering/cateringComponents/FoodMenuItem.vue";
import NewMenuItem from "@/main/dashboard/catering/cateringComponents/NewMenuItem.vue";
import AssembledItems from "./AssembledItems.vue";
import router from "@/config/router.js";

const selectedTab = router.currentRoute.value.query.type ?? 'ingredients'
const menu = router.currentRoute.value.query.m

const switchTabs = (data) => {
  router.push({name: "catering", query: {m:menu,type: data}});
}


</script>
<template>
    <div>


      <div class="flex border-b">
        <div class="cursor-pointer text-sm" :class="selectedTab === 'ingredients' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('ingredients')">
          <div class="py-2 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Ingredients
          </div>
        </div>
        <div class="cursor-pointer text-sm" :class="selectedTab === 'menu-item' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('menu-item')">
          <div class="py-2 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Menu Item
          </div>
        </div>

        <div class="cursor-pointer text-sm" :class="selectedTab === 'new-item' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('new-item')">
          <div class="py-2 px-3">
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

   <div v-if="selectedTab === 'new-item'">
     <NewMenuItem></NewMenuItem>
   </div>


    </div>
</template>

<script setup>
import FeedingSession from "@/main/dashboard/catering/cateringComponents/FeedingSession.vue";
import NewFeedingSessionItem from "@/main/dashboard/catering/cateringComponents/NewFeedingSessionItem.vue";
import FeedingSessionsItems from "@/main/dashboard/catering/cateringComponents/FeedingSessionsItems.vue";
import DailyFeedingSession from "@/main/dashboard/catering/cateringComponents/DailyFeedingSession.vue";
import FeedingGroupSession from "@/main/dashboard/catering/cateringComponents/FeedingGroupSession.vue";
import router from "@/config/router.js";


const selectedTab = router.currentRoute.value.query.type ?? 'feeding-packs'
const menu = router.currentRoute.value.query.m

const switchTabs = (data) => {
  router.push({name: "catering", query: {m:menu,type: data}});
}



</script>
<template>
    <div>


      <div class="flex border-b mt-1">
        <div class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'feeding-packs' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('feeding-packs')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Menu Packs
          </div>
        </div>


      </div>

      <div v-if="selectedTab === 'feeding-packs'">
        <FeedingSession></FeedingSession>
      </div>

      <div v-if="selectedTab === 'new-feeding-pack-item'">
        <NewFeedingSessionItem></NewFeedingSessionItem>
      </div>

      <div v-if="selectedTab === 'feeding-pack-items'">
        <FeedingSessionsItems></FeedingSessionsItems>
      </div>



    </div>
</template>

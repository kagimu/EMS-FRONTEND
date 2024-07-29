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


      <div class="flex border-b">
        <div class="cursor-pointer text-sm" :class="selectedTab === 'feeding-packs' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('feeding-packs')">
          <div class="py-2 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Feeding Packs
          </div>
        </div>
        <!-- <div class="cursor-pointer text-sm" :class="selectedTab === 'new-feeding-pack-item' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('new-feeding-pack-item')">
          <div class="py-2 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            New Feeding Pack Item
          </div>
        </div> -->

        <!-- <div class="cursor-pointer text-sm" :class="selectedTab === 'feeding-pack-items' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('feeding-pack-items')">
          <div class="py-2 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Feeding Pack Items
          </div>
        </div> -->

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





<!--
        <div class="row">
        <div class="col-12">
          <div class=" mt-3 ">
            <div class="" style="padding: 0;">
               
                <div>
    <div class="m-3">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link navColor active" id="class-list-tab" data-bs-toggle="tab" data-bs-target="#class-list" type="button" role="tab" aria-controls="class-list" aria-selected="false"><small>Feeding Packs</small></button>
          <button class="nav-link navColor" id="class-attendance-tab" data-bs-toggle="tab" data-bs-target="#class-attendance" type="button" role="tab" aria-controls="class-attendance" aria-selected="false"><small><i class="bi bi-plus"></i> New Feeding Pack Item</small></button>
          <button class="nav-link navColor" id="feeding-item-tab" data-bs-toggle="tab" data-bs-target="#feeding-item" type="button" role="tab" aria-controls="feeding-item" aria-selected="false"><small> Feeding Pack Items</small></button>
          &lt;!&ndash; <button class="nav-link navColor" id="daily-item-tab" data-bs-toggle="tab" data-bs-target="#daily-item" type="button" role="tab" aria-controls="daily-item" aria-selected="false"><small> Daily Feeding Session</small></button> &ndash;&gt;
          &lt;!&ndash; <button class="nav-link navColor" id="session-tab" data-bs-toggle="tab" data-bs-target="#session" type="button" role="tab" aria-controls="session" aria-selected="false"><small> Feeding Session Group</small></button> &ndash;&gt;
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="class-list" role="tabpanel" aria-labelledby="class-list-tab" tabindex="0">
        <FeedingSession></FeedingSession>
        </div>
        <div class="tab-pane fade" id="class-attendance" role="tabpanel" aria-labelledby="class-attendance-tab" tabindex="0">
        <NewFeedingSessionItem></NewFeedingSessionItem>
        </div>
        <div class="tab-pane fade" id="feeding-item" role="tabpanel" aria-labelledby="feeding-item-tab" tabindex="0">
       <FeedingSessionsItems></FeedingSessionsItems>
        </div>
        <div class="tab-pane fade" id="daily-item" role="tabpanel" aria-labelledby="daily-item-tab" tabindex="0">
       <DailyFeedingSession></DailyFeedingSession>
        </div>
        <div class="tab-pane fade" id="session" role="tabpanel" aria-labelledby="session-tab" tabindex="0">
       <FeedingGroupSession></FeedingGroupSession>
        </div>
        
      </div>

    </div>
  </div>
  
  
            </div>
          </div>
        </div>
  
  
      </div>-->
    </div>
</template>

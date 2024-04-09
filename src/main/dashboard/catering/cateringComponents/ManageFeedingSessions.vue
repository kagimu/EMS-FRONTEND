<template>
    <div>
        <div class="row">
        <div class="col-12">
          <div class="card mt-3 ">
            <div class="card-body" style="padding: 0;">
                <div class="mb-10 ml-3 mt-2" style="float: right; margin-right: 10px;"><i @click="goBack()" class="bi bi-x-lg"></i></div>

                <div>
    <div class="m-4">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link navColor active" id="class-list-tab" data-bs-toggle="tab" data-bs-target="#class-list" type="button" role="tab" aria-controls="class-list" aria-selected="false"><small>Feeding Sessions</small></button>
          <button class="nav-link navColor" id="class-attendance-tab" data-bs-toggle="tab" data-bs-target="#class-attendance" type="button" role="tab" aria-controls="class-attendance" aria-selected="false"><small><i class="bi bi-plus"></i> New Feeding Sessions Item</small></button>
          <button class="nav-link navColor" id="feeding-item-tab" data-bs-toggle="tab" data-bs-target="#feeding-item" type="button" role="tab" aria-controls="feeding-item" aria-selected="false"><small> Feeding Session Items</small></button>
          <button class="nav-link navColor" id="daily-item-tab" data-bs-toggle="tab" data-bs-target="#daily-item" type="button" role="tab" aria-controls="daily-item" aria-selected="false"><small> Daily Feeding Session</small></button>
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
        
      </div>

    </div>
  </div>
  
  
            </div>
          </div>
        </div>
  
  
      </div>
    </div>
</template>
<script setup>
  import FeedingSession from "@/main/dashboard/catering/cateringComponents/FeedingSession.vue";
  import NewFeedingSessionItem from "@/main/dashboard/catering/cateringComponents/NewFeedingSessionItem.vue";
  import FeedingSessionsItems from "@/main/dashboard/catering/cateringComponents/FeedingSessionsItems.vue";
  import DailyFeedingSession from "@/main/dashboard/catering/cateringComponents/DailyFeedingSession.vue";


const goBack = () => {
  window.history.back()
}
</script>
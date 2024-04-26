<template>
    <div>
        <div class="row">
        <div class="col-12">
          <div class="mt-3 ">
            <div class="" style="padding: 0;">
                <div class="mb-10 ml-3 mt-2" style="float: right; margin-right: 10px;"><i @click="goBack()" class="bi bi-x-lg"></i></div>

                <div>
    <div class="m-4">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link navColor active" id="class-list-tab" data-bs-toggle="tab" data-bs-target="#class-list" type="button" role="tab" aria-controls="class-list" aria-selected="false"><small>Food MenuItem</small></button>
          <button class="nav-link navColor" id="class-attendance-tab" data-bs-toggle="tab" data-bs-target="#class-attendance" type="button" role="tab" aria-controls="class-attendance" aria-selected="false"><small><i class="bi bi-plus"></i>New MenuItem</small></button>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="class-list" role="tabpanel" aria-labelledby="class-list-tab" tabindex="0">
        <FoodMenuItem></FoodMenuItem>
        </div>
        <div class="tab-pane fade" id="class-attendance" role="tabpanel" aria-labelledby="class-attendance-tab" tabindex="0">
       <NewMenuItem></NewMenuItem>
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
  import NewStock from "@/main/dashboard/catering/cateringComponents/NewStock.vue";
  import FeedingSessionsItems from "@/main/dashboard/catering/cateringComponents/FeedingSessionsItems.vue";
  import FoodMenuItem from "@/main/dashboard/catering/cateringComponents/FoodMenuItem.vue";
  import NewMenuItem from "@/main/dashboard/catering/cateringComponents/NewMenuItem.vue";
  import UnitsOfMeasure from "@/main/dashboard/catering/cateringComponents/UnitsOfMeasure.vue";




const goBack = () => {
  window.history.back()
}
</script>
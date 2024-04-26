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
            <button class="nav-link navColor active" id="unit-tab" data-bs-toggle="tab" data-bs-target="#unit" type="button" role="tab" aria-controls="unit" aria-selected="false"><small>Unit Of Measurement</small></button>
          <button class="nav-link navColor " id="new-unit-tab" data-bs-toggle="tab" data-bs-target="#new-unit" type="button" role="tab" aria-controls="new-unit" aria-selected="false"><small><i class="bi bi-plus"></i> New Unit Of Measure</small></button>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="unit" role="tabpanel" aria-labelledby="unit-tab" tabindex="0">
        <UnitsOfMeasure></UnitsOfMeasure>
        </div>
        
        <div class="tab-pane fade " id="new-unit" role="tabpanel" aria-labelledby="new-unit-tab" tabindex="0">
            <NewUnitOfMeasurement></NewUnitOfMeasurement>
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
  import NewUnitOfMeasurement from "@/main/dashboard/catering/cateringComponents/NewUnitOfMeasurement.vue";




const goBack = () => {
  window.history.back()
}
</script>
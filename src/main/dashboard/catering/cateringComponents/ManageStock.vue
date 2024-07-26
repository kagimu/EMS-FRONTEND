<script setup>
import NewStock from "@/main/dashboard/catering/cateringComponents/NewStock.vue";
import Stock from "@/main/dashboard/catering/cateringComponents/Stock.vue";
import router from "@/config/router.js";


const selectedTab = router.currentRoute.value.query.type ?? 'stock'
const menu = router.currentRoute.value.query.m

const switchTabs = (data) => {
  router.push({name: "catering", query: {m:menu,type: data}});
}


</script>
<template>
    <div>


      <div class="flex border-b">
        <div class="cursor-pointer text-sm" :class="selectedTab === 'stock' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('stock')">
          <div class="py-2 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Stocking History
          </div>
        </div>
        <div class="cursor-pointer text-sm" :class="selectedTab === 'new-stock' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('new-stock')">
          <div class="py-2 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            New Stock
          </div>
        </div>
      </div>


      <div v-if="selectedTab === 'stock'">
        <Stock></Stock>
      </div>

      <div v-if="selectedTab === 'new-stock'">
        <NewStock></NewStock>
      </div>


<!--        <div class="row">
        <div class="col-12">
          <div class="mt-3 ">
            <div class="" style="padding: 0;">
                <div class="mb-10 ml-3 mt-2" style="float: right; margin-right: 10px;"><i @click="goBack()" class="bi bi-x-lg"></i></div>

                <div>
    <div class="m-4">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link navColor active" id="class-list-tab" data-bs-toggle="tab" data-bs-target="#class-list" type="button" role="tab" aria-controls="class-list" aria-selected="false"><small>Stock</small></button>
          <button class="nav-link navColor" id="class-attendance-tab" data-bs-toggle="tab" data-bs-target="#class-attendance" type="button" role="tab" aria-controls="class-attendance" aria-selected="false"><small><i class="bi bi-plus"></i> New Stock</small></button>

        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="class-list" role="tabpanel" aria-labelledby="class-list-tab" tabindex="0">
        <Stock></Stock>
        </div>
        <div class="tab-pane fade" id="class-attendance" role="tabpanel" aria-labelledby="class-attendance-tab" tabindex="0">
       <NewStock></NewStock>
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

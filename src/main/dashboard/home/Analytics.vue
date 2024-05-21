<script setup>
import {onMounted, ref, watch} from "vue";
import {useAnalyticsStore} from "@/main/dashboard/home/store/analytics-store.js";
const analyticsStore = useAnalyticsStore()
const dataAnalytics = ref(null)

onMounted(
    async () => {
      await   analyticsStore.fetchAnalyticsSummary()
    }
)


const analytics = ref([
  {title:"Learners", total:"198", icon:"bi-people-fill"},
  {title:"Parents", total:"122", icon:"bi-people"},
  {title:"Teaching Staff", total:"87", icon:"bi-person-lines-fill"},
  {title:"None Teaching Staff", total:"23", icon:"bi-person-fill-dash"}
])




watch(
    () => analyticsStore.analyticsSummaryResponse,
    async (data) => {
      if(data){
       dataAnalytics.value = data
      }
    }
)

</script>

<template>
  <div class="grid grid-cols-5 gap-4 mt-3">




        <div class="border rounded-md bg-white flex py-3">
          <div class=" ml-4 mr-3">
            <i  class="bi-people-fill text-[30px]"></i>
          </div>
            <div class="ml-2">
              <div class="text-[20px]">{{dataAnalytics?.total_students}}</div>
              <div class="text-sm">Students</div>
            </div>
        </div>


    <div class="border rounded-md bg-white flex py-3">
      <div class=" ml-4 mr-3">
        <i  class="bi-person-lines-fill text-[30px]"></i>
      </div>
      <div class="ml-2">
        <div class="text-[20px]">{{dataAnalytics?.total_teachers}}</div>
        <div class="text-sm">Teachers</div>
      </div>
    </div>


    <div class="border rounded-md bg-white flex py-3">
      <div class=" ml-4 mr-3">
        <i  class="bi-building-fill-up text-[30px]"></i>
      </div>
      <div class="ml-2">
        <div class="text-[20px]">{{dataAnalytics?.total_classes}}</div>
        <div class="text-sm">Classes</div>
      </div>
    </div>


    <div class="border rounded-md bg-white flex py-3">
      <div class=" ml-4 mr-3">
        <i  class="bi-building text-[30px]"></i>
      </div>
      <div class="ml-2">
        <div class="text-[20px]">{{dataAnalytics?.total_campuses}}</div>
        <div class="text-sm">Campus</div>
      </div>
    </div>


    <div class="border rounded-md bg-white flex py-3">
      <div class=" ml-4 mr-3">
        <i  class="bi-person-fill-dash text-[30px]"></i>
      </div>
      <div class="ml-2">
        <div class="text-[20px]">{{dataAnalytics?.total_parents}}</div>
        <div class="text-sm">Parents</div>
      </div>
    </div>







  </div>
</template>

<style scoped>

</style>
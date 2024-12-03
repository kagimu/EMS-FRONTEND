<script setup>
import { ref } from 'vue'
import {useAuthStore} from "@/main/auth/store/auth.js";
import LineGraph from "@/main/graphs/LineGraph.vue";
import Analytics from "@/main/dashboard/home/Analytics.vue";
import AnalyticsDashboard from "@/main/dashboard/AnalyticsDashboard.vue";

const authStore = useAuthStore()



const userProfile = ref(null)
const token = ref(null)
userProfile.value = authStore.profile
token.value = authStore.token


defineProps({
  msg: String,
})

const count = ref(0)
</script>
<template>

 <div>


<div>
  <analytics></analytics>
</div>


   <div class="mx-auto mt-3" style="width: 100%;">
     <div class="card mx-auto" style="width: 100%;">
       <div class="card-body">
         <div style="height: 400px; width: 100%; display: flex; justify-content: center;">
           <line-graph></line-graph>
         </div>
       </div>
     </div>
   </div>


   
   <div class="mx-auto mt-3" style="width: 100%;">
     <div class="card mx-auto" style="width: 100%;">
       <div class="card-body">
         <div style="height: 400px; width: 100%; display: flex; justify-content: left;">
          <AnalyticsDashboard></AnalyticsDashboard>
         </div>
       </div>
     </div>
   </div>





<!--


   <div class="row mb-8">
     <div class="col-6">
       <div class="mx-auto mt-3" style="width: 100%;">
         <div class="card mx-auto" style="width: 100%;">
           <div class="card-body">
             <bar-graph></bar-graph>
           </div>
         </div>
       </div>
     </div>

     <div class="col-6">
       <div class="mx-auto mt-3" style="width: 100%;">
         <div class="card mx-auto" style="width: 100%;">
           <div class="card-body">
               <div style="height: 370px; width: 100%; display: flex; justify-content: center;">
               <doughnut-graph></doughnut-graph>
             </div>
           </div>
         </div>
       </div>
     </div>

   </div>




   <div class="mx-auto mt-3" style="width: 100%;">
     <div class="card mx-auto" style="width: 100%;">
       <div class="card-body">
         <div style="height: 400px; width: 100%; display: flex; justify-content: center;">
         <bar-graph></bar-graph>
         </div>
       </div>
     </div>
   </div>


-->




 </div>

</template>




<style scoped>

</style>

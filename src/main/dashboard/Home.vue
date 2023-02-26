<template>

 <div>



     <div class="row">

       <div v-for="(lst,idx) in analytics" :key="idx" class="col-3">
         <div class="card mt-3">
           <div class="row g-0">
             <div class="col-md-2 text-center" style="display: flex; justify-content: center; align-items: center;">
               <i style="font-size: 30px;" :class="lst.icon"></i>
             </div>
             <div class="col-md-10">
               <div class="card-body">
                 <div><b>{{lst.total}}</b></div>
                 <small>{{lst.title}}</small>
               </div>
             </div>
           </div>
         </div>
       </div>

     </div>








   <div class="mx-auto mt-3" style="width: 100%;">
     <div class="card mx-auto" style="width: 100%;">
       <div class="card-body">
         My Home
       </div>
     </div>
   </div>


 </div>

</template>

<script setup>
import { ref } from 'vue'
import {useAuthStore} from "@/store/auth.js";

const authStore = useAuthStore()

const analytics = ref([
  {title:"Learners", total:"198", icon:"bi-people-fill"},
  {title:"Parents", total:"122", icon:"bi-people"},
  {title:"Teaching Staff", total:"87", icon:"bi-person-lines-fill"},
  {title:"None Teaching Staff", total:"23", icon:"bi-person-fill-dash"}
])

const userProfile = ref(null)
const token = ref(null)
userProfile.value = authStore.profile
token.value = authStore.token


defineProps({
  msg: String,
})

const count = ref(0)
</script>


<style scoped>
.read-the-docs {
  color: #888;
}
</style>

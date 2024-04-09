<template>
    <div>
<form @submit.prevent="addDailyFeedingSession">
   
<div class="mb-2">
    <label class="textColor"><small>Session</small>  </label>
    <select v-model="form.feeding_session_number" class="form-control form-select"> 
            <option disabled value="">Select</option>
            <option v-for="(list, index) in feedingSessionGroupData" :key="index" :value="list.number">{{list.name}}</option>
 </select>
</div>

<div class="mb-2">
    <label class="textColor"><small>Day</small></label>
    <input v-model="form.day"   type="day" required class="form-control">
    
</div>

<div class="text-right mt-4">
    <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
    <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
        <span class="visually-hidden">Loading...</span>
    </div></button>
</div>
</form>
    </div>
</template>
 
<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";

import { useAbility } from '@casl/vue';

const { can } = useAbility()

const  notificationStore  = useNotificationStore()
const buttonLoader = ref(false)
const cateringStore = useCateringStore()
const errorMessage = ref(null)
const feedingSessionGroupData = ref(null)

const form = reactive({
    day:null,
    feeding_session_number:null,
})

onMounted(
    async () => {
        cateringStore.fetchFeedingGroupSessions()
    } )

    watch(
  () => cateringStore.feedingGroupSessionsInfoResponse,
  async (data) => {
      feedingSessionGroupData.value = data.data
  },
  {deep: true}
)

const addDailyFeedingSession = () => {
    buttonLoader.true
    cateringStore.newDailySession(form)
    
}
watch (
    () => cateringStore.newDailySessionResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        cateringStore.fetchFeedingGroupSessions()
        cateringStore.fetchDailySession()
        form.day=null,
        form.feeding_session_number=null
      }
    },
    {deep:true}
)

watch (
      () => cateringStore.errorMessage,
      async (data) => {
        if(data){
        
          errorMessage.value = data.message
          notificationStore.errorToast("Error",data.message)        }
      },
      {deep:true}
  )
   
</script>
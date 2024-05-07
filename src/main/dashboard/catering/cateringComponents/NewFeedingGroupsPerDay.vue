<template>
    <div>
<form @submit.prevent="addFeedingGroupsPerDay">
   

 <div class="mb-2">
    <label class="mt-4"><small>Feeding Group</small></label>
<select class="form-select form-control" v-model="form.feeding_group_number" required>
    <option value="" disabled>-select</option>
    <option v-for="(list,index) in feedingGroupData" :key="index" :value="list.number">{{list.name  }}</option>
</select>
</div>

<div class="mb-2">
    <label class="textColor"><small>Day</small></label>
    <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
        <li v-for="(day, index) in daysOfWeek" :key="index" class="list-group-item">
            <input
                style="outline: none 0 !important; box-shadow: none;"
                class="form-check-input me-1"
                type="checkbox"
                :value="day"
                v-model="form.day">
            <label class="textColor"><small>{{ day }}</small></label>
        </li>
    </ul>
    </div>

<!-- <div class="mb-2">
    <label class="textColor"><small>Day</small></label>
 <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">

<li class="list-group-item">
    <input
            style="outline: none 0 !important; box-shadow: none;" 
            class="form-check-input me-1" type="checkbox" :value="Monday" v-model="form.day" >
    <label class="textColor" ><small>Monday</small></label>
</li>
<li class="list-group-item">
    <input
            style="outline: none 0 !important; box-shadow: none;"
            class="form-check-input me-1" type="checkbox" >
    <label class="textColor" ><small>Tuesday</small></label>
</li>
<li class="list-group-item">
    <input
            style="outline: none 0 !important; box-shadow: none;"
            class="form-check-input me-1" type="checkbox" >
    <label class="textColor" ><small>Wednesday</small></label>
</li>
<li class="list-group-item">
    <input
            style="outline: none 0 !important; box-shadow: none;"
            class="form-check-input me-1" type="checkbox" >
    <label class="textColor" ><small>Thursday</small></label>
</li>
<li class="list-group-item">
    <input
            style="outline: none 0 !important; box-shadow: none;"
            class="form-check-input me-1" type="checkbox" >
    <label class="textColor" ><small>Friday</small></label>
</li>
<li class="list-group-item">
    <input
            style="outline: none 0 !important; box-shadow: none;"
            class="form-check-input me-1" type="checkbox" >
    <label class="textColor" ><small>Saturday</small></label>
</li>
<li class="list-group-item">
    <input
            style="outline: none 0 !important; box-shadow: none;"
            class="form-check-input me-1" type="checkbox" >
    <label class="textColor" ><small>Sunday</small></label>
</li>
</ul>
</div> -->

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
const feedingGroupData = ref(null)

const form = reactive({
    day:[],
    feeding_group_number:null,
})

onMounted(
    async () => {
        cateringStore.fetchFeedingGroup()
    } )

    watch(
  () => cateringStore.feedingGroupInfoResponse,
  async (data) => {
      feedingGroupData.value = data.data
  },
  {deep: true}
)

const addFeedingGroupsPerDay = () => {
    buttonLoader.true
    alert(JSON.stringify(form))
    cateringStore.newGroupGroupsPerDay(form)  
}
watch (
    () => cateringStore.newFeedingGroupsPerDayResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        cateringStore.fetchFeedGroupsPerDay()
        form.feeding_group_number=null
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
   
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const toggleDay = (selectedDay) => {
    const index = form.day.indexOf(selectedDay);
    if (index === -1) {
        form.day.push(selectedDay);
    } else {
        form.day.splice(index, 1);
    }
}

const selectAll = () => {
    form.day = [...daysOfWeek]; 
}

const deselectAll = () => {
    form.day = []; 
}

</script>
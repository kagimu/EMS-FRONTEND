<template>
  <div>

    <div class="row mt-3">
      <div class="col-12">



        <button
            data-bs-toggle="offcanvas" data-bs-target="#newClass" aria-controls="offcanvasRight"
            @click="addCampus"
            type="button"
            class="btn buttonStyle btn-primary mr-2">
          <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
          Add School
        </button>

        <div class="offcanvas offcanvas-end" :class="{ show: schoolDialog }"    tabindex="-1" id="newClass" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add School</h5>
            <button type="button" class="btn-close noFocus" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
           <new-school></new-school>
          </div>
        </div>



      </div>
    </div>



    <div class="row">
      <div class="col-4" v-for="(school, index) in schoolsList" :key="index">
        <router-link
            class="linkStyle"
            :to="{name:'campus', query:{id:school.number}}"
        >
          <div class="card mt-3">
          <div class="card-body">
            <div class="mb-3" style="font-size: 20px;">

              {{school.name}}
            </div>
          </div>
        </div>
        </router-link>
      </div>


    </div>

  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewSchool from "@/main/dashboard/manageSchool/NewSchool.vue";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

const schoolStore = useSchoolStore()
const  notificationStore  = useNotificationStore()

const schoolDialog = ref( false)
const schoolsList = ref( [])


const addCampus = () => {
  schoolDialog.value = true
}

onMounted(
    () => {
      schoolStore.fetchSchools()
    }
)

watch(
    () => schoolStore.newSchoolResponse,
    async (data) => {
      if(data){
        schoolDialog.value = false
        schoolStore.fetchSchools()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if(data){
       schoolsList.value = data.data
      }
    },
    {deep:true}
)


</script>

<style scoped>

.linkStyle {
  text-decoration: none;
  color: #1867c0;
  font-size: 16px;
}

.linkStyle:hover {
  font-size: 16px;
  color: green;
  text-decoration: underline;
}

</style>
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
          Add Campus
        </button>

        <div class="offcanvas offcanvas-end" :class="{ show: campusDialog }"    tabindex="-1" id="newClass" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add Class</h5>
            <button type="button" class="btn-close noFocus" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <new-campus></new-campus>
          </div>
        </div>



      </div>
    </div>



    <div class="row">
      <div class="col-4" v-for="(campus, index) in campusList" :key="index">
        <div class="card mt-3">

          <router-link
              class="linkStyle"
              :to="{name:'level', query:{id:campus.number}}"
          >
              <div class="card-body linkStyle">
                <div class="mb-3" style="font-size: 20px;">{{campus.name}}</div>
                <small>
                  {{campus.email}}<br />
                  {{campus.phone}}<br />
                  {{campus.location}}
                </small>
              </div>
          </router-link>
        </div>
      </div>


    </div>

  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import useNotificationStore from "@/composables/useNotification.js";
import NewCampus from "@/main/dashboard/manageCampus/NewCampus.vue";
import {useRouter} from "vue-router";
const routerData = useRouter()

const campusStore = useCampusStore()
const  notificationStore  = useNotificationStore()

const campusDialog = ref( false)
const campusList = ref( [])


const addCampus = () => {
  campusDialog.value = true
}

onMounted(
    () => {
      campusStore.fetchCampuses(routerData.currentRoute.value.query.id)
    }
)

watch(
    () => campusStore.newCampusResponse,
    async (data) => {
      if(data){
        campusDialog.value = false
        notificationStore.successToast("Success", data.message)
        campusStore.fetchCampuses(routerData.currentRoute.value.query.id)
      }
    },
    {deep:true}
)

watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if(data){
        campusList.value = data.data
      }
    },
    {deep:true}
)


</script>

<style scoped>

input:focus {
  box-shadow: none;
}

.textColor{
  color: #717375;
}

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
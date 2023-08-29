<template>
  <div>

    <div class="row mt-3">
      <div class="col-12">



        <button
            data-bs-toggle="offcanvas" data-bs-target="#newClass" aria-controls="offcanvasRight"
            @click="addCampus"
            type="button"
            class="btn btn-sm buttonStyle btn-primary mr-2">
          <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
          Add Class
        </button>

        <div class="offcanvas offcanvas-end" :class="{ show: classDialog }"    tabindex="-1" id="newClass" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add Class</h5>
            <button type="button" class="btn-close noFocus" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <new-class></new-class>
          </div>
        </div>



      </div>
    </div>



    <div class="row">
      <div class="col-6" v-for="(school, index) in classList" :key="index">

        <div class="card mt-3">
          <div class="card-body">
            <div class="mb-3" style="font-size: 20px;">
              {{school.name}}
            </div>

            <div class="flex justify-content-between">
              &nbsp;
              <router-link
                  class="text-decoration-none"
                  :to="{name:'campus', query:{id:school.number}}"
              >
                <button
                    type="button"
                    class="btn-primary border-0 d-none d-lg-block viewButtonStyle">
                      <span class="mx-9 text-sm">
                        View
                      </span>
                </button>
              </router-link>
            </div>

          </div>
        </div>

      </div>


    </div>

  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewClass from "@/main/dashboard/manageLevel/class/NewClass.vue";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes";
import {useRouter} from "vue-router";
const routerData = useRouter()


const classStore = useClassesStore()
const  notificationStore  = useNotificationStore()

const classDialog = ref( false)
const classList = ref( [])
const campusLevel = routerData.currentRoute.value.query.l


const addCampus = () => {
  classDialog.value = true
}

onMounted(
    () => {
      classStore.fetchClasses(campusLevel)
    }
)

watch(
    () => classStore.classResponse,
    async (data) => {
      if(data){
        classDialog.value = false
        classStore.fetchClasses(campusLevel)
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => classStore.classInfoResponse,
    async (data) => {
      if(data){
        classList.value = data.data
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

.viewButtonStyle{
  background-color: #2c6fb9;
  color: #ffffff;
  border-radius: 0;
}

.viewButtonStyle:hover {
  background-color: #0557b4;
  color: #ffffff;
}

</style>
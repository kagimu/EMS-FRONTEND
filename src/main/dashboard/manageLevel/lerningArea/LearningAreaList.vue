<template>
  <div>

    <div class="row mt-3">
      <div class="col-12">


        <div class="flex justify-content-between mt-2 mr-3">
          &nbsp;
          <button
              data-bs-toggle="offcanvas" data-bs-target="#newLearningArea" aria-controls="offcanvasRight"
              @click="addLearningArea"
              type="button"
              class="btn btn-sm buttonStyle btn-primary mr-2">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
            Add Learning Area
          </button>
        </div>


        <div class="offcanvas offcanvas-end" :class="{ show: learningAreaDialog }"    tabindex="-1" id="newLearningArea" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add Learning Area</h5>
            <button type="button" class="btn-close noFocus" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
           <new-learning-area></new-learning-area>
          </div>
        </div>



      </div>
    </div>




    <table class="table table-hover caption-top" style="font-size: 14px;">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(classes, index) in learningAreaList" :key="index">
        <td>{{index+1}}</td>
        <td> {{classes.name}}</td>
        <td>
          <div>
            <i
                style="font-size: 13px;"
                data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                class="bi-pencil mr-2 cursor-pointer" @click="editClass(classes)"></i>
            <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteClass(classes)"></i>
          </div>
        </td>
      </tr>
      </tbody>
    </table>





  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import NewLearningArea from "@/main/dashboard/manageLevel/lerningArea/NewLearningArea.vue";
import {useLearningAreaStore} from "@/main/dashboard/manageLevel/lerningArea/store/learningArea.js";
const routerData = useRouter()


const learningAreaStore = useLearningAreaStore()
const  notificationStore  = useNotificationStore()

const learningAreaDialog = ref( false)
const learningAreaList = ref( [])
const campusNumber = routerData.currentRoute.value.query.id


const addLearningArea = () => {
  learningAreaDialog.value = true
}

const editClass = (data) => {
  alert(JSON.stringify(data))
}
const deleteClass = (data) => {
  alert(JSON.stringify(data))
}

onMounted(
    () => {
      learningAreaStore.fetchLearningArea(campusNumber)
    }
)

watch(
    () => learningAreaStore.learningAreaResponse,
    async (data) => {
      if(data){
        learningAreaDialog.value = false
        learningAreaStore.fetchLearningArea(campusNumber)
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => learningAreaStore.learningAreaInfResponse,
    async (data) => {
      if(data){
        learningAreaList.value = data.data
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
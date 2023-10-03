<template>
<div>

  <div class="modal fade" id="learningAreaModal" tabindex="-1" :class="{ show: curriculumDialog }" aria-labelledby="" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header text-sm p-0">
          <h6 class="modal-title ml-3 mt-2 mb-2">Add School</h6>
          <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mt-2 mb-2">
            <new-learning-area ref="learningAreaRef"></new-learning-area>
          </div>
        </div>

      </div>
    </div>
  </div>





  <div class="flex justify-content-between mt-3">
    <div class="ml-4">Learning Area</div>
    <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addCurriculum" data-bs-toggle="modal" data-bs-target="#learningAreaModal">
      <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
      Add Learning Area
    </button>
  </div>



  <table class="table table-hover caption-top" style="font-size: 14px;">
    <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Code</th>
      <th scope="col">Name</th>
      <th scope="col" class="text-end">Action</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(lst,index) in learningAreaList" :key="index" >
      <th scope="row">{{index+1}}</th>
      <td>
        {{lst.code}}
      </td>
      <td>
          {{lst.name}}
      </td>
      <td>
        <div class="float-end mr-2">
          <i
              style="font-size: 13px;"
              data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
              class="bi-pencil mr-2 cursor-pointer" @click="editClass(sbj)"></i>
          <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteClass(sbj)"></i>
        </div>
      </td>
    </tr>
    </tbody>
  </table>




</div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import NewLearningArea from "@/main/dashboard/curriculum/lerningArea/NewLearningArea.vue";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/lerningArea/store/learningArea.js";
import useNotificationStore from "@/composables/useNotification.js";


const curriculumDialog = ref( false)
const learningAreaList = ref( [])


const learningAreaStore = useLearningAreaStore()
const  notificationStore  = useNotificationStore()

const learningAreaRef = ref(null)


const addCurriculum = () => {
  learningAreaRef.value.autoInputFocusInfo()
  curriculumDialog.value = true
}



onMounted(
    () => {
      learningAreaStore.fetchLearningArea()
    }
)


watch(
    () => learningAreaStore.learningAreaResponse,
    async (data) => {
      if(data){
        // curriculumDialog.value = false
        await learningAreaStore.fetchLearningArea()
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

</style>
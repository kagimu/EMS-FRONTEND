<template>
  <div>


    <div class="row mt-3">
      <div class="col-12">

        <div class="offcanvas offcanvas-end" :class="{ show: curriculumDialog }"    tabindex="-1" id="newClass" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add School</h5>
            <button type="button" class="btn-close noFocus" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
              <new-learning-area></new-learning-area>
          </div>
        </div>



      </div>
    </div>


    <div class="flex justify-content-between mt-3">
    <div class="ml-4">Curriculum Setup</div>
    <button
        data-bs-toggle="offcanvas" data-bs-target="#newClass" aria-controls="offcanvasRight"
        @click="addCurriculum"
        type="button"
        class="btn btn-sm buttonStyle btn-primary mr-2">
      <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
      Add Learning Area
    </button>
    </div>


    <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

            <div class="mb-3 ml-5 mt-3" style="font-size: 18px;">Learning Area</div>

            <table class="table table-hover caption-top" style="font-size: 14px;">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col" class="text-end">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst,index) in learningAreaList" :key="index" >
                <th scope="row">{{index+1}}</th>
                <td>{{lst.name}}</td>
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
        </div>
      </div>


    </div>

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

const addCurriculum = () => {
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
        curriculumDialog.value = false
        learningAreaStore.fetchLearningArea()
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

input:focus {
  box-shadow: none;
}

.textColor{
  color: #717375;
}

</style>
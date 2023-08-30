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


        <div class="offcanvas offcanvas-end" :class="{ show: learningAreaSubjectDialog }"    tabindex="-1" id="newLearningAreaSubject" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add Subject to Learning Area</h5>
            <button type="button" class="btn-close noFocus" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <new-subject-learning-area :learningAreaNumber="learningAreaNumber"></new-subject-learning-area>
          </div>
        </div>



      </div>
    </div>




    <div class="row mx-auto">
      <div class="col-6" v-for="(item, index) in learningAreaList" :key="index">

        <div class="card mt-3">
          <div class="card-body p-0">
            <div class="p-0 py-2 flex justify-content-between" style="font-size: 12px;">
              <span class="ml-3 mt-2">
                 {{item.name}}
              </span>


              <button
                  data-bs-toggle="offcanvas" data-bs-target="#newLearningAreaSubject" aria-controls="offcanvasRight"
                  @click="addSubject(item)"
                  type="button"
                  class="btn btn-sm text-sm buttonStyle btn-primary mr-2">
                <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
                Add Subject
              </button>

            </div>


            <table class="table table-hover caption-top" style="font-size: 12px; width: 100%; border-top: 1px solid #e8e8e8;">
              <tbody>
              <tr>
                <td>1</td>
                <td>place</td>
                <td>
                  <div class="float-end mr-2">
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
        </div>

      </div>


    </div>









  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import NewLearningArea from "@/main/dashboard/manageLevel/lerningArea/NewLearningArea.vue";
import {useLearningAreaStore} from "@/main/dashboard/manageLevel/lerningArea/store/learningArea.js";
import NewSubjectLearningArea from "@/main/dashboard/manageLevel/lerningArea/NewSubjectLearningArea.vue";
const routerData = useRouter()


const learningAreaStore = useLearningAreaStore()
const  notificationStore  = useNotificationStore()

const learningAreaDialog = ref( false)
const learningAreaSubjectDialog = ref( false)
const learningAreaList = ref( [])
const campusNumber = routerData.currentRoute.value.query.id

const learningAreaNumber = ref("")

const addLearningArea = () => {
  learningAreaDialog.value = true
}

const editClass = (data) => {
  alert(JSON.stringify(data))
}
const deleteClass = (data) => {
  alert(JSON.stringify(data))
}

const addSubject = (item) => {
  learningAreaNumber.value = item.number
  learningAreaSubjectDialog.value = true
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
<template>
  <div>


    <div class="row mt-3">
      <div class="col-12">

        <div class="offcanvas offcanvas-end" :class="{ show: curriculumDialog }"    tabindex="-1" id="newClass" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add Subject Cluster</h5>
            <button type="button" class="btn-close noFocus" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <new-subject-cluster></new-subject-cluster>
          </div>
        </div>



      </div>
    </div>


    <div class="flex justify-content-between mt-3">
      <div class="ml-4">Subject Cluster</div>
      <button
          data-bs-toggle="offcanvas" data-bs-target="#newClass" aria-controls="offcanvasRight"
          @click="addCurriculum"
          type="button"
          class="btn btn-sm buttonStyle btn-primary mr-2">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Subject Cluster
      </button>
    </div>


    <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

            <div class="mb-3 ml-5 mt-3" style="font-size: 18px;">Subject Cluster</div>

            <table class="table table-hover caption-top" style="font-size: 14px;">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col" class="text-end">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst,index) in subjectClusterList" :key="index" >
                <th scope="row">{{index+1}}</th>
                <td>

                  <router-link
                      class="text-decoration-none"
                      :to="{name:'subject-cluster', query:{id:lst.number}}"
                  >
                    {{lst.name}}
                  </router-link>

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
        </div>
      </div>


    </div>

  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewSubjectCluster from "@/main/dashboard/curriculum/subjectCluster/NewSubjectCluster.vue";
import {useSubjectClusterStore} from "@/main/dashboard/curriculum/subjectCluster/store/subjectCluster.js";
import {useRouter} from "vue-router";
const routerData = useRouter()
const curriculumDialog = ref( false)
const subjectClusterList = ref( [])
const subjectClusterStore = useSubjectClusterStore()
const  notificationStore  = useNotificationStore()
const learningAreaNo = routerData.currentRoute.value.query.id

const addCurriculum = () => {
  curriculumDialog.value = true
}


onMounted(
    () => {
      subjectClusterStore.fetchSubjectCluster(learningAreaNo)
    }
)


watch(
    () => subjectClusterStore.subjectClusterResponse,
    async (data) => {
      if(data){
        curriculumDialog.value = false
        subjectClusterStore.fetchSubjectCluster(learningAreaNo)
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)


watch(
    () => subjectClusterStore.subjectClusterInfoResponse,
    async (data) => {
      if(data){
        subjectClusterList.value = data.data
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
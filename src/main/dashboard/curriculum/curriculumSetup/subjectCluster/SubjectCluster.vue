<template>
  <div>

    <div class="modal fade" id="subjectClusterModal" tabindex="-1" :class="{ show: curriculumDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Add Subject Cluster</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-subject-cluster></new-subject-cluster>
            </div>
          </div>

        </div>
      </div>
    </div>


    <div class="flex justify-content-between mt-3">
      <div class="ml-4">Subject Cluster</div>
      <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addCurriculum" data-bs-toggle="modal" data-bs-target="#subjectClusterModal">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Subject Cluster
      </button>
    </div>


    <div class="row">
      <div class="col-12">
        <div class="mt-3">


          <div class="row mx-auto">
            <div class="col-4 mb-5 mt-5">
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="learning_area_number"
                @click="fetchSubjectClusterList()"
                >
              <option disabled value="">Filter by Learning Area</option>
              <option value="">All</option>
              <option v-for="(list, index) in learningAreaList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
            </select>
          </div>
          </div>




          <div style="width: 100%; overflow-x: auto; white-space: nowrap; scrollbar-width: thin;">
            <table class="table table-hover caption-top" style="font-size: 12px;">
              <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Learning Area</th>
                <th scope="col">Subject Cluster Name</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst,index) in subjectClusterList" :key="index" >
                <td> {{lst.code}}</td>
                <td>
                  <div class="text-wrap" style="width: 150px;">{{lst.name}}</div>
                </td>
                <td>



                  <table class="table table-hover caption-top" style="font-size: 12px; width: 100%;">
                    <tbody>
                    <tr v-for="(sbct, idx) in lst.subject_cluster" :key="idx">
                      <td style="width: 5%;">{{sbct.code}}.</td>
                      <td style="width: 85%;">
                        <div class="text-wrap" style="width: 150px;">{{sbct.name}}</div>
                      </td>
                      <td>
                        <div>
                          <i
                              style="font-size: 13px;"
                              data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                              class="bi-pencil mr-2 cursor-pointer" @click="editSubjectCluster(sbct)"></i>
                          <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteSubjectCluster(sbct)"></i>
                          <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === sbct.number">
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                  </table>


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
import NewSubjectCluster from "@/main/dashboard/curriculum/curriculumSetup/subjectCluster/NewSubjectCluster.vue";
import {useSubjectClusterStore} from "@/main/dashboard/curriculum/curriculumSetup/subjectCluster/store/subjectCluster.js";
import {useRouter} from "vue-router";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/store/learningArea.js";
const routerData = useRouter()
const curriculumDialog = ref( false)
const subjectClusterList = ref( [])
const learning_area_number = ref( "")
const deletionLoader = ref( undefined)
const subjectClusterStore = useSubjectClusterStore()
const  notificationStore  = useNotificationStore()
const learningAreaStore = useLearningAreaStore()
const learningAreaList = ref([])
let  curriculumNumber = routerData.currentRoute.value.query.id

const addCurriculum = () => {
  curriculumDialog.value = true
}


const editSubjectCluster = (sbj) => {

}
const deleteSubjectCluster = (data) => {
  deletionLoader.value = data.number
  if(!confirm("Are you sure, you want to delete: "+data.name)){
    return
  }

  let info = {
    number:data.number
  }

  subjectClusterStore.deleteSubjectCluster(info)
}


onMounted(
    () => {
      fetchSubjectClusterList()
      learningAreaStore.fetchLearningArea(curriculumNumber)
    }
)

const fetchSubjectClusterList = () => {

  subjectClusterStore.fetchSubjectCluster({learning_area_number:learning_area_number.value, curriculum_number:curriculumNumber})
}


watch(
    () => subjectClusterStore.subjectClusterResponse,
    async (data) => {
      if(data){
        await fetchSubjectClusterList()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => subjectClusterStore.deleteSubjectClusterResponse,
    async (data) => {
      if(data){
        await fetchSubjectClusterList()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => subjectClusterStore.errorMessage,
    async (data) => {
      if(data){
         deletionLoader.value = false
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
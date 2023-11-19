<template>
  <div>

    <div class="modal fade" id="subjectModal" tabindex="-1" :class="{ show: subjectDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Add Subject</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-subject></new-subject>
            </div>
          </div>

        </div>
      </div>
    </div>



    <div class="flex justify-content-between mt-3">
      <div class="ml-4">Subjects</div>
      <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addSubject" data-bs-toggle="modal" data-bs-target="#subjectModal">
          <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Subject
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
                  @click="selectSubjectCluster(learning_area_number)"
                  >
                <option disabled value="">Filter by Learning Area</option>
                <option value="">All</option>
                <option v-for="(list, index) in learningAreaList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-5 mt-5">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="subject_cluster_number"
                  @click="filterSubjectCluster()"
                  >
                <option disabled value="">Filter by Subject Cluster</option>
                <option value="">All</option>
                <option v-for="(list, index) in subjectClusterList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>

          </div>

          <div style="width: 100%; overflow-x: auto; white-space: nowrap; scrollbar-width: thin;">
            <table class="table table-hover caption-top" style="font-size: 12px;">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Learning Area</th>
                <th scope="col">Subject Cluster Name</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst, index) in subjectList" :key="index">
                <td>{{lst.code}}</td>
                <td>
                  <div class="text-wrap" style="width: 150px;">{{lst.name}}</div>
                </td>
                <td>

                  <table class="table table-hover caption-top" style="font-size: 12px; width: 100%;">
                    <tbody>
                    <tr v-for="(sbct, idx) in lst.subject_cluster" :key="idx">
                      <td style="width: 5%;">{{sbct.code}}.</td>
                      <td style="width: 40%;">
                        <div class="text-wrap" style="width: 150px;">{{sbct.name}}</div>
                      </td>
                      <td style="width: 55%;">



                        <table class="table table-hover caption-top" style="font-size: 12px; width: 100%;">
                          <tbody>
                          <tr v-for="(sbt, idx) in sbct.subject" :key="idx">
                            <td style="width: 5%;">{{sbt.code}}.</td>
                            <td style="width: 70%;">
                              <div class="text-wrap" style="width: 150px;">{{sbt.name}}</div>
                            </td>
                            <td>
                              <div>
                                <i
                                    style="font-size: 13px;"
                                    data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                                    class="bi-pencil mr-2 cursor-pointer" @click="editSubject(sbt)"></i>
                                <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteSubject(sbt)"></i>
                              </div>
                            </td>
                          </tr>
                          </tbody>
                        </table>



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
import {useRouter} from "vue-router";
import NewSubject from "@/main/dashboard/curriculum/subject/NewSubject.vue";
import {useSubjectStore} from "@/main/dashboard/curriculum/subject/store/subject.js";
import {useSubjectClusterStore} from "@/main/dashboard/curriculum/subjectCluster/store/subjectCluster.js";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/lerningArea/store/learningArea.js";
const routerData = useRouter()


const subjectStore = useSubjectStore()
const learningAreaStore = useLearningAreaStore()
const  notificationStore  = useNotificationStore()

const subjectDialog = ref( false)
const subjectList = ref( [])
const subjectClusterList = ref([])
const learningAreaList = ref([])
const subject_cluster_number = ref("")
const learning_area_number = ref("")
const subjectClusterStore = useSubjectClusterStore()

const addSubject = () => {
  subjectDialog.value = true
}

const editSubject = (data) => {
  alert(JSON.stringify(data))
}
const deleteSubject = (data) => {
  alert(JSON.stringify(data))
}

const filterSubjectCluster = () => {
  filterSubjectList()
}

const selectSubjectCluster = (learning_area_number) => {
  filterSubjectList()
  subjectClusterStore.fetchSubjectClusterFilter(learning_area_number)
}

onMounted(
    () => {
      filterSubjectList()
      learningAreaStore.fetchLearningArea()
    }
)

const filterSubjectList = () => {
  let data = {
    learning_area_number:learning_area_number.value,
    subject_cluster_number:subject_cluster_number.value,
  }
  subjectStore.fetchSubjects(data)
}

watch(
    () => subjectStore.subjectResponse,
    async (data) => {
      if(data){
        // subjectDialog.value = false
        await filterSubjectList()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => subjectStore.subjectInfoResponse,
    async (data) => {
      if(data){
        subjectList.value = data.data
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

watch(
    () => subjectClusterStore.subjectClusterFilterResponse,
    async (data) => {
      if(data){
        subjectClusterList.value = data.data
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
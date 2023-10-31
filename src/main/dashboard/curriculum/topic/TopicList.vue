<template>
  <div>


    <div class="modal fade" id="subjectModal" tabindex="-1" :class="{ show: strandDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Add Topic</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
               <new-topic></new-topic>
            </div>
          </div>

        </div>
      </div>
    </div>





    <div class="flex justify-content-between mt-3">
      <div class="ml-4">Topic</div>
      <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addSubject" data-bs-toggle="modal" data-bs-target="#subjectModal">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Topic
      </button>
    </div>


    <div class="row">
      <div class="col-12">
        <div class="mt-3">

          <div class="row mx-auto mb-5 mt-5">

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  @click="selectSubjectCluster(learning_area_number)"
                  v-model="learning_area_number">
                <option disabled value="">Filter by Learning Area</option>
                <option value="">All</option>
                <option v-for="(list, index) in learningAreaList" :key="index" :value="list.number">{{list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  @click="selectSubject(subject_cluster_number)"
                  v-model="subject_cluster_number">
                <option disabled value="">Filter by Subject Cluster</option>
                <option value="">All</option>
                <option v-for="(list, index) in subjectClusterList" :key="index" :value="list.number">{{list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  @click="selectStrand(subject_number)"
                  v-model="subject_number">
                <option disabled value="">Filter by Subject</option>
                <option value="">All</option>
                <option v-for="(list, index) in subjectList" :key="index" :value="list.number">{{list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  @click="selectTopic(strand_number)"
                  v-model="strand_number"
              >
                <option disabled value="">Filter by Strand</option>
                <option value="">All</option>
                <option v-for="(list, index) in strandList" :key="index" :value="list.number">{{list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="class_number">
                <option disabled value="">Select Class</option>
                <option v-for="(list, index) in classList" :key="index" :value="list.number">{{list.name}}</option>
              </select>
            </div>

          </div>


            <table class="table table-hover caption-top" style="font-size: 14px;">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Code</th>
                <th class="text-end" scope="col">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst, index) in topicList" :key="index">
                <td>{{index+1}}</td>
                <td>
                  {{lst.name}}
                </td>
                <td>{{lst.code}}</td>
                <td>
                  <div class="float-end mr-2">
                    <i
                        style="font-size: 13px;"
                        data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                        class="bi-pencil mr-2 cursor-pointer" @click="editClass(lst)"></i>
                    <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteClass(lst)"></i>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>


        </div>
      </div>
    </div>



  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import NewTopic from "@/main/dashboard/curriculum/topic/NewTopic.vue";
import {useTopicStore} from "@/main/dashboard/curriculum/topic/store/topic.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/subject/store/subject.js";
import {useStrandStore} from "@/main/dashboard/curriculum/strands/store/strand.js";
import {useSubjectClusterStore} from "@/main/dashboard/curriculum/subjectCluster/store/subjectCluster.js";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/lerningArea/store/learningArea.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
const routerData = useRouter()


const subjectStore = useSubjectStore()
const subjectClusterStore = useSubjectClusterStore()
const topicStore = useTopicStore()
const learningAreaStore = useLearningAreaStore()
const strandStore = useStrandStore()
const classStore = useClassesStore()
const notificationStore  = useNotificationStore()

const strandDialog = ref( false)
const topicList = ref( [])
let strandNo = routerData.currentRoute.value.query.id
    strandNo = strandNo ? strandNo : ""

const learningAreaList = ref([])
const subjectClusterList = ref([])
const subjectList = ref([])
const strandList = ref([])
const classList = ref([])
const subject_cluster_number = ref("")
const subject_number = ref("")
const strand_number = ref("")
const learning_area_number = ref("")
const class_number = ref("")


const addSubject = () => {
  strandDialog.value = true
}

const editClass = (data) => {
  alert(JSON.stringify(data))
}
const deleteClass = (data) => {
  alert(JSON.stringify(data))
}

const selectSubject = (subject_cluster_number) => {
  subjectStore.fetchSubjects(subject_cluster_number)
}



const selectSubjectCluster = (learning_area_number) => {
  subjectClusterStore.fetchSubjectCluster(learning_area_number)
}

const selectStrand = (subject_number) => {
  strandStore.fetchStrands(subject_number)
  classStore.fetchClasses()
}
const selectTopic = (strand_number) => {
  topicStore.fetchTopics(strand_number)
}

onMounted(
    () => {
      topicStore.fetchTopics(strandNo)
      learningAreaStore.fetchLearningArea()
    }
)

watch(
    () => topicStore.topicResponse,
    async (data) => {
      if(data){
        // strandDialog.value = false
        topicStore.fetchTopics(strandNo)
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => topicStore.topicInfoResponse,
    async (data) => {
      if(data){
        topicList.value = data.data
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
    () => subjectClusterStore.subjectClusterInfoResponse,
    async (data) => {
      if(data){
        subjectClusterList.value = data.data
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
    () => strandStore.strandInfoResponse,
    async (data) => {
      if(data){
        strandList.value = data.data
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
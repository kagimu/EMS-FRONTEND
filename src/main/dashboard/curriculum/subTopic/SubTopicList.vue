<template>
  <div>

    <div class="modal fade" id="subjectModal" tabindex="-1" :class="{ show: subtopicDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Add Sub Topic</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-sub-topic></new-sub-topic>
            </div>
          </div>

        </div>
      </div>
    </div>




    <div class="flex justify-content-between mt-3">
      <div class="ml-4">Sub Topic</div>
      <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addSubtopic" data-bs-toggle="modal" data-bs-target="#subjectModal">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Sub Topic
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
                  v-model="learning_area_number"
                  @click="selectSubjectCluster(learning_area_number)"
                  >
                <option disabled value="">Filter by Learning Area</option>
                <option value="">All</option>
                <option v-for="(list, index) in learningAreaList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="subject_cluster_number"
                  @click="selectSubject(subject_cluster_number)"
                  >
                <option disabled value="">Filter by Subject Cluster</option>
                <option value="">All</option>
                <option v-for="(list, index) in subjectClusterList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="subject_number"
                  @click="selectStrand(subject_number)"
                  >
                <option disabled value="">Filter by Subject</option>
                <option value="">All</option>
                <option v-for="(list, index) in subjectList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>


            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="strand_number"
                  @click="selectTopic(strand_number)"
              >
                <option disabled value="">Filter by Strand</option>
                <option value="">All</option>
                <option v-for="(list, index) in strandList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>


            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="topic_number"
                  @click="fetchSubTopicLIst()"
              >
                <option disabled value="">Select Topic</option>
                <option value="">All</option>
                <option v-for="(list, index) in topicList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>


          </div>

          <div style="width: 100%; overflow-x: auto; white-space: nowrap; scrollbar-width: thin;">
            <table class="table table-hover caption-top" style="font-size: 12px;">
              <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Learning Area</th>
                <th scope="col">Subject Cluster</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst, index) in subtopicList" :key="index">
                <td>
                  {{lst.code}}
                </td>
                <td style="width: 20%;">
                  <div class="text-wrap" style="width: 150px;">{{lst.name}}</div>
                </td>
                <td>


                  <table class="table table-hover caption-top" style="font-size: 12px; width: 100%;">
                    <tbody>
                    <tr v-for="(sbct, idx) in lst.subject_cluster" :key="idx">
                      <td style="width: 5%;">{{sbct.code}}.</td>
                      <td style="width: 30%;">
                        <div class="text-wrap" style="width: 150px;">{{sbct.name}}</div>
                      </td>
                      <td style="width: 65%;">




                        <table class="table table-hover caption-top" style="font-size: 14px; width: 100%;">
                          <tbody>
                          <tr v-for="(sbt, idx) in sbct.subject" :key="idx">
                            <td style="width: 5%;">{{sbt.code}}.</td>
                            <td style="width: 40%;">
                              <div class="text-wrap" style="width: 150px;">{{sbt.name}}</div>
                            </td>
                            <td style="width: 55%;">



                              <table class="table table-hover caption-top" style="font-size: 12px; width: 100%;">
                                <tbody>
                                <tr v-for="(std, idx) in sbt.strand" :key="idx">
                                  <td style="width: 5%;">{{std.code}}.</td>
                                  <td style="width: 60%;">
                                    <div class="text-wrap" style="width: 150px;">{{std.name}}</div>
                                  </td>
                                  <td style="width: 60%;">




                                    <table class="table table-hover caption-top" style="font-size: 12px; width: 100%;">
                                      <tbody>
                                      <tr v-for="(tpc, idx) in std.topic" :key="idx">
                                        <td style="width: 5%;">{{tpc.code}}.</td>
                                        <td style="width: 60%;">
                                          <div class="text-wrap" style="width: 150px;">{{tpc.name}}</div>
                                        </td>
                                        <td style="width: 60%;">




                                          <table class="table table-hover caption-top" style="font-size: 12px; width: 100%;">
                                            <tbody>
                                            <tr v-for="(stpc, idx) in tpc.subtopic" :key="idx">
                                              <td style="width: 5%;">{{stpc.code}}.</td>
                                              <td style="width: 60%;">
                                                <div class="text-wrap" style="width: 150px;">{{stpc.name}}</div>
                                              </td>
                                              <td style="width: 60%;">{{stpc.estimated_time}} (min)</td>
                                              <td>
                                                <div>
                                                  <i
                                                      style="font-size: 13px;"
                                                      data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                                                      class="bi-pencil mr-2 cursor-pointer" @click="editClass(stpc)"></i>
                                                  <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteClass(stpc)"></i>
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
import NewSubTopic from "@/main/dashboard/curriculum/subTopic/NewSubTopic.vue";
import {useSubtopicStore} from "@/main/dashboard/curriculum/subTopic/store/subTopic.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/subject/store/subject.js";
import {useSubjectClusterStore} from "@/main/dashboard/curriculum/subjectCluster/store/subjectCluster.js";
import {useTopicStore} from "@/main/dashboard/curriculum/topic/store/topic.js";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/lerningArea/store/learningArea.js";
import {useStrandStore} from "@/main/dashboard/curriculum/strands/store/strand.js";
const routerData = useRouter()

const subjectStore = useSubjectStore()
const subjectClusterStore = useSubjectClusterStore()
const topicStore = useTopicStore()
const learningAreaStore = useLearningAreaStore()
const strandStore = useStrandStore()
const subtopicStore = useSubtopicStore()
const notificationStore  = useNotificationStore()


const learningAreaList = ref([])
const subjectClusterList = ref([])
const subjectList = ref([])
const strandList = ref([])
const topicList = ref([])
const classList = ref([])
const subject_cluster_number = ref("")
const subject_number = ref("")
const strand_number = ref("")
const topic_number = ref("")
const learning_area_number = ref("")



const subtopicDialog = ref( false)
const subtopicList = ref( [])



const addSubtopic = () => {
  subtopicDialog.value = true
}

const editClass = (data) => {
  alert(JSON.stringify(data))
}
const deleteClass = (data) => {
  alert(JSON.stringify(data))
}

const selectSubjectCluster = (learning_area_number) => {

  // learning_area_number.value = ""
  subject_cluster_number.value = ""
  subject_number.value = ""
  strand_number.value = ""
  topic_number.value = ""

  fetchSubTopicLIst()
  subjectClusterStore.fetchSubjectClusterFilter(learning_area_number)
}


const selectSubject = (subject_cluster_number) => {

  // learning_area_number.value = ""
  // subject_cluster_number.value = ""
  subject_number.value = ""
  strand_number.value = ""
  topic_number.value = ""

  fetchSubTopicLIst()
  subjectStore.fetchSubjectList(subject_cluster_number)
}


const selectStrand = (subject_number) => {

  // learning_area_number.value = ""
  // subject_cluster_number.value = ""
  // subject_number.value = ""
  strand_number.value = ""
  topic_number.value = ""

  fetchSubTopicLIst()
  strandStore.fetchStrandList(subject_number)
}


const selectTopic = (strand_number) => {

  // learning_area_number.value = ""
  // subject_cluster_number.value = ""
  // subject_number.value = ""
  // strand_number.value = ""
  topic_number.value = ""

  fetchSubTopicLIst()
  topicStore.fetchTopicList(strand_number)
}





onMounted(
    () => {
      fetchSubTopicLIst()
      learningAreaStore.fetchLearningArea()
      selectSubjectCluster("")
      selectSubject("")
      selectStrand("")
      selectTopic("")
    }
)

const fetchSubTopicLIst = () => {
  let data = {
    learning_area_number:learning_area_number.value,
    subject_cluster_number:subject_cluster_number.value,
    subject_number:subject_number.value,
    strand_number:strand_number.value,
    topic_number:topic_number.value,
  }
  subtopicStore.fetchSubTopics(data)
}

watch(
    () => subtopicStore.subtopicResponse,
    async (data) => {
      if(data){
        // subtopicDialog.value = false
        await fetchSubTopicLIst()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => subtopicStore.subtopicInfoResponse,
    async (data) => {
      if(data){
        subtopicList.value = data.data
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

watch(
    () => subjectStore.subjectListResponse,
    async (data) => {
      if(data){
        subjectList.value = data.data
      }
    },
    {deep:true}
)


watch(
    () => strandStore.strandListResponse,
    async (data) => {
      if(data){
        strandList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => topicStore.topicListResponse,
    async (data) => {
      if(data){
        topicList.value = data.data
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
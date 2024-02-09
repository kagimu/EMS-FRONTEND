<template>
  <div>

    <div class="modal fade" id="subTopicModal" tabindex="-1" :class="{ show: subtopicDialog }" aria-labelledby="" aria-hidden="true">
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



    <div class="modal fade" id="referenceModal" tabindex="-1" :class="{ show: referenceDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">References: <b>{{subTopicInfo.name}}</b> </h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-subtopic-reference :subTopicInfo="subTopicInfo" ref="referenceRef"></new-subtopic-reference>
            </div>
          </div>
        </div>`
      </div>
    </div>



    <div class="flex justify-content-between mt-3">
      <div class="ml-4">Sub Topic</div>
      <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addSubtopic" data-bs-toggle="modal" data-bs-target="#subTopicModal">
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

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="class_number"
                  @click="fetchSubTopicLIst()"
              >
                <option disabled value="">Filter by Class</option>
                <option value="">All</option>
<!--                <option v-for="(list, index) in classList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>-->
                <option v-for="(list, index) in classList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
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

                                                <div class="mt-2" style="width: 250px;">
                                                  <button type="button"  class="btn btn-sm  btn-primary mr-2 m-0 py-0"  @click="addReference(stpc)" data-bs-toggle="modal" data-bs-target="#referenceModal">
                                                    <small class="m-0 p-0">Reference(s) &nbsp;{{stpc.references ? '['+stpc.references.length+']' : ''}}</small>
                                                  </button>
                                                </div>

                                              </td>
                                              <td style="width: 60%;">{{stpc.estimated_time}} (min)</td>
                                              <td>
                                                <div>
                                                  <i
                                                      style="font-size: 13px;"
                                                      data-bs-toggle="modal" data-bs-target="#subTopicModal"
                                                      class="bi-pencil mr-2 cursor-pointer" @click="editSubTopic(stpc)"></i>
                                                  <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteSubTopic(stpc)"></i>
                                                  <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === stpc.number">
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
import NewSubTopic from "@/main/dashboard/curriculum/curriculumSetup/subTopic/NewSubTopic.vue";
import {useSubtopicStore} from "@/main/dashboard/curriculum/curriculumSetup/subTopic/store/subTopic.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";
import {useSubjectClusterStore} from "@/main/dashboard/curriculum/curriculumSetup/subjectCluster/store/subjectCluster.js";
import {useTopicStore} from "@/main/dashboard/curriculum/curriculumSetup/topic/store/topic.js";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/store/learningArea.js";
import {useStrandStore} from "@/main/dashboard/curriculum/curriculumSetup/strands/store/strand.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import NewLessonPlan from "@/main/dashboard/curriculum/schemeOfWork/NewLessonPlan.vue";
import NewSubtopicReference from "@/main/dashboard/curriculum/curriculumSetup/subTopic/NewSubtopicReference.vue";
const routerData = useRouter()

const subjectStore = useSubjectStore()
const subjectClusterStore = useSubjectClusterStore()
const topicStore = useTopicStore()
const classStore = useClassesStore()
const learningAreaStore = useLearningAreaStore()
const strandStore = useStrandStore()
const subtopicStore = useSubtopicStore()
const notificationStore  = useNotificationStore()
const deletionLoader = ref( undefined)

const referenceDialog = ref(false)
const subTopicInfo = ref({})
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
const class_number = ref("")
let  curriculumNumber = routerData.currentRoute.value.query.id



const subtopicDialog = ref( false)
const subtopicList = ref( [])



const addSubtopic = () => {
  subtopicDialog.value = true
}

const editSubTopic = (data) => {
  alert(JSON.stringify(data))
}
const deleteSubTopic = (data) => {
  if(!confirm("Are you sure, you want to delete: "+data.name)){
    return
  }

  deletionLoader.value = data.number

  let info = {
    number:data.number
  }

  subtopicStore.deleteSubTopic(info)
}

const selectSubjectCluster = (learning_area_number) => {

  // learning_area_number.value = ""
  subject_cluster_number.value = ""
  subject_number.value = ""
  strand_number.value = ""
  topic_number.value = ""

  fetchSubTopicLIst()
  subjectClusterStore.fetchSubjectClusterFilter({learning_area_number:learning_area_number, curriculum_number:curriculumNumber})
}


const selectSubject = (subject_cluster_number) => {

  subject_number.value = ""
  strand_number.value = ""
  topic_number.value = ""

  fetchSubTopicLIst()
  subjectStore.fetchSubjectList({subject_cluster_number:subject_cluster_number, curriculum_number:curriculumNumber})
}


const selectStrand = (subject_number) => {

  strand_number.value = ""
  topic_number.value = ""

  fetchSubTopicLIst()
  strandStore.fetchStrandList({subject_number:subject_number, curriculum_number:curriculumNumber})
}


const selectTopic = (strand_number) => {

  topic_number.value = ""

  fetchSubTopicLIst()
  topicStore.fetchTopicList({strand_number:strand_number, curriculum_number:curriculumNumber})
}


const addReference = (referenceData) => {
  if(referenceData) {
    subTopicInfo.value = referenceData
    referenceDialog.value = true
  }
}




onMounted(
    () => {
      fetchSubTopicLIst()
      learningAreaStore.fetchLearningArea(curriculumNumber)
      selectSubjectCluster("")
      selectSubject("")
      selectStrand("")
      selectTopic("")
      classStore.fetchClassesCurriculum(curriculumNumber)
    }
)

const fetchSubTopicLIst = () => {
  let data = {
    learning_area_number:learning_area_number.value,
    subject_cluster_number:subject_cluster_number.value,
    subject_number:subject_number.value,
    strand_number:strand_number.value,
    topic_number:topic_number.value,
    class_number:class_number.value,
    curriculum_number:curriculumNumber,
  }
  subtopicStore.fetchSubTopics(data)
}

watch(
    () => subtopicStore.subtopicResponse,
    async (data) => {
      if(data){
        await fetchSubTopicLIst()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => subtopicStore.deleteSubTopicResponse,
    async (data) => {
      if(data){
        await fetchSubTopicLIst()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => subtopicStore.errorMessage,
    async (data) => {
      if(data){
         deletionLoader.value = false
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


watch(
    () => classStore.classCurriculumResponse,
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
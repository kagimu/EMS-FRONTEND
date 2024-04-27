<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import NewTopic from "@/main/dashboard/curriculum/curriculumSetup/topic/NewTopic.vue";
import {useTopicStore} from "@/main/dashboard/curriculum/curriculumSetup/topic/store/topic.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";
import {useStrandStore} from "@/main/dashboard/curriculum/curriculumSetup/strands/store/strand.js";
import {useSubjectClusterStore} from "@/main/dashboard/curriculum/curriculumSetup/subjectCluster/store/subjectCluster.js";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/store/learningArea.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import AppModal from "@/components/AppModal.vue";
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
const deletionLoader = ref( undefined)
const topicEditMode = ref( false)


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
let  curriculumNumber = routerData.currentRoute.value.query.id


const addSubject = () => {
  topicEditMode.value = false
  strandDialog.value = true
}

const editTopic = (data) => {
  strandDialog.value = true
  topicEditMode.value = true
  topicStore.topicData(data.number)
}
const deleteTopic = (data) => {
  if(!confirm("Are you sure, you want to delete: "+data.name)){
    return
  }

  deletionLoader.value = data.number

  let info = {
    number:data.number
  }

  topicStore.deleteTopic(info)
}


const selectSubjectCluster = (learning_area_number) => {

  // learning_area_number.value = ""
  subject_cluster_number.value = ""
  subject_number.value = ""
  strand_number.value = ""

  fetchTopicList()
  subjectClusterStore.fetchSubjectClusterFilter({learning_area_number:learning_area_number, curriculum_number:curriculumNumber})
}

const selectSubject = (subject_cluster_number) => {

  // learning_area_number.value = ""
  // subject_cluster_number.value = ""
  subject_number.value = ""
  strand_number.value = ""

  fetchTopicList()
  subjectStore.fetchSubjectList({subject_cluster_number:subject_cluster_number, curriculum_number:curriculumNumber})
}





const selectStrand = (subject_number) => {

  strand_number.value = ""

  fetchTopicList()
  strandStore.fetchStrandList({subject_number:subject_number, curriculum_number:curriculumNumber})
}


onMounted(
    () => {
      fetchTopicList()
      learningAreaStore.fetchLearningArea(curriculumNumber)
      selectSubjectCluster("")
      selectSubject("")
      selectStrand("")
      classStore.fetchClassesCurriculum(curriculumNumber)
    }
)

const fetchTopicList = () => {
  let data = {
    learning_area_number:learning_area_number.value,
    subject_cluster_number:subject_cluster_number.value,
    subject_number:subject_number.value,
    strand_number:strand_number.value,
    class_number:class_number.value,
    curriculum_number:curriculumNumber,
  }
  topicStore.fetchTopics(data)
}

watch(
    () => topicStore.topicResponse,
    async (data) => {
      if(data){
        // strandDialog.value = false
        await  fetchTopicList()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => topicStore.deleteTopicResponse,
    async (data) => {
      if(data){
        await  fetchTopicList()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => topicStore.topicEditResponse,
    async (data) => {
      if(data){
        await  fetchTopicList()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => topicStore.errorMessage,
    async (data) => {
      if(data){
        deletionLoader.value = undefined
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
    () => classStore.classCurriculumResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    },
    {deep:true}
)


</script>
<template>
  <div>

    <AppModal :title="topicEditMode ? 'Edit Topic' : 'Add Topic'" v-model="strandDialog" lg>
      <new-topic></new-topic>
    </AppModal>





    <div class="flex justify-content-between mt-3">
      <div class="ml-4">Topic</div>
      <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addSubject">
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
                  v-model="learning_area_number"
                  @change="selectSubjectCluster(learning_area_number)"
                  >
                <option disabled value="">--Filter by Learning Area--</option>
                <option value="">All</option>
                <option v-for="(list, index) in learningAreaList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="subject_cluster_number"
                  @change="selectSubject(subject_cluster_number)"
                  >
                <option disabled value="">--Filter by Subject Cluster--</option>
                <option value="">All</option>
                <option v-for="(list, index) in subjectClusterList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="subject_number"
                  @change="selectStrand(subject_number)"
                 >
                <option disabled value="">--Filter by Subject--</option>
                <option value="">All</option>
                <option v-for="(list, index) in subjectList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="strand_number"
                  @change="fetchTopicList()"
              >
                <option disabled value="">--Filter by Strand--</option>
                <option value="">All</option>
                <option v-for="(list, index) in strandList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="class_number"
                  @change="fetchTopicList()"
              >
                <option disabled value="">--Filter by Class--</option>
                <option value="">All</option>
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
              <tr v-for="(lst, index) in topicList" :key="index">
                <td>{{lst.code}}</td>
                <td>
                  <div class="text-wrap" style="width: 150px;">{{lst.name}}</div>
                </td>

                <td>


                  <table class="table table-hover caption-top" style="font-size: 12px; width: 100%;">
                    <tbody>
                    <tr v-for="(sbct, idx) in lst.subject_cluster" :key="idx">
                      <td style="width: 5%;">{{sbct.code}}.</td>
                      <td style="width: 30%;">
                        <div class="text-wrap" style="width: 150px;"> {{sbct.name}} </div>
                      </td>
                      <td style="width: 65%;">




                        <table class="table table-hover caption-top" style="font-size: 12px; width: 100%;">
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
                                        <td>
                                          <div>
                                            <i
                                                style="font-size: 13px;"
                                                class="bi-pencil mr-2 cursor-pointer" @click="editTopic(tpc)"></i>
                                            <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteTopic(tpc)"></i>
                                            <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === tpc.number">
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
          </div>

        </div>
      </div>
    </div>



  </div>
</template>



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
<template>
  <div>

    <form @submit.prevent="addSubtopic">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>



      <div class="mb-2">
        <label class="textColor"><small>Learning Area</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="learning_area_number"
            @click="selectSubjectCluster(learning_area_number)"
        >
          <option disabled value="">Select Learning Area</option>
          <option v-for="(list, index) in learningAreaList" :key="index" :value="list.number">{{list.name}}</option>
        </select>
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Subject Cluster</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="subject_cluster_number"
            @click="selectSubject(subject_cluster_number)"
        >
          <option disabled value="">Select Subject Cluster</option>
          <option v-for="(list, index) in subjectClusterList" :key="index" :value="list.number">{{list.name}}</option>
        </select>
      </div>




      <div class="mb-2">
        <label class="textColor"><small>Subject</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="subject_number"
            @click="selectStrand(subject_number)"
        >
          <option disabled value="">Select Subject</option>
          <option v-for="(list, index) in subjectList" :key="index" :value="list.number">{{list.name}}</option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Strand</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="strand_number"
            @click="selectTopic(strand_number)"
        >
          <option disabled value="">Select Strand</option>
          <option v-for="(list, index) in strandList" :key="index" :value="list.number">{{list.name}}</option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Topic</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.topic_number">
          <option disabled value="">Select Topic</option>
          <option v-for="(list, index) in topicList" :key="index" :value="list.number">{{list.name}}</option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Sub Topic Name</small></label>
        <input type="text" v-model="form.name" required class="form-control form-select-sm">
      </div>



      <div class="flex justify-content-end" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
          Save
          <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
        </button>
      </div>

    </form>


  </div>
</template>

<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useSubtopicStore} from "@/main/dashboard/curriculum/subTopic/store/subTopic.js";
import {useTopicStore} from "@/main/dashboard/curriculum/topic/store/topic.js";
import {useSubjectClusterStore} from "@/main/dashboard/curriculum/subjectCluster/store/subjectCluster.js";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/lerningArea/store/learningArea.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/subject/store/subject.js";
import {useStrandStore} from "@/main/dashboard/curriculum/strands/store/strand.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()

const subtopicStore = useSubtopicStore()

const topicStore = useTopicStore()

const subjectClusterStore = useSubjectClusterStore()
const learningAreaStore = useLearningAreaStore()
const subjectStore = useSubjectStore()
const strandStore = useStrandStore()


const learningAreaList = ref([])
const subjectClusterList = ref([])
const subjectList = ref([])
const strandList = ref([])
const topicList = ref([])
const learning_area_number = ref("")
const subject_cluster_number = ref("")
const subject_number = ref("")
const strand_number = ref("")


const form = reactive({
  name:null,
  topic_number:"",
})


const addSubtopic = () =>{
  loader.value = true
  subtopicStore.newSubtopicData(form)
}


const selectSubjectCluster = (learning_area_number) => {
  subjectClusterStore.fetchSubjectCluster(learning_area_number)
}

const selectSubject = (subject_cluster_number) => {
  subjectStore.fetchSubjects(subject_cluster_number)
}


const selectStrand = (subject_number) => {
  strandStore.fetchStrands(subject_number)
}

const selectTopic = (strand_number) => {
  topicStore.fetchTopics(strand_number)
}

onMounted(
    () => {
      learningAreaStore.fetchLearningArea()
    }
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
    () => topicStore.topicInfoResponse,
    async (data) => {
      if(data){
        topicList.value = data.data
      }
    },
    {deep:true}
)

</script>

<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>
<template>
  <div>

    <form @submit.prevent="addTopic">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Code</small></label>
        <input
            @keypress="commons.numbersOnlyValidator($event)"
            maxlength="10"
            ref="nameRef"
            type="text"
            style="outline: none 0 !important; box-shadow: none;"
            v-model="form.code"
            required
            class="form-control form-select-sm">
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
          <option v-for="(list, index) in learningAreaList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
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
          <option v-for="(list, index) in subjectClusterList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
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
          <option v-for="(list, index) in subjectList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Strand</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.strand_number">
          <option disabled value="">Select Strand</option>
          <option v-for="(list, index) in strandList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Class</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.class_number">
          <option disabled value="">Select Class</option>
          <option v-for="(list, index) in classList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>



      <div class="mb-2">
        <label class="textColor"><small>Topic Name</small></label>
        <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.name" required class="form-control form-select-sm">
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
import {useTopicStore} from "@/main/dashboard/curriculum/curriculumSetup/topic/store/topic.js";
import {useSubjectClusterStore} from "@/main/dashboard/curriculum/curriculumSetup/subjectCluster/store/subjectCluster.js";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/store/learningArea.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";
import {useStrandStore} from "@/main/dashboard/curriculum/curriculumSetup/strands/store/strand.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()

const topicStore = useTopicStore()
const notificationStore  = useNotificationStore()

const subjectClusterStore = useSubjectClusterStore()
const learningAreaStore = useLearningAreaStore()
const subjectStore = useSubjectStore()
const strandStore = useStrandStore()
const classStore = useClassesStore()
const commons = useCommonsStore()

const learningAreaList = ref([])
const subjectClusterList = ref([])
const subjectList = ref([])
const strandList = ref([])
const classList = ref([])
const learning_area_number = ref("")
const subject_cluster_number = ref("")
const subject_number = ref("")


const form = reactive({
  code:null,
  name:null,
  class_number:"",
  strand_number:"",
})


const addTopic = () =>{
  loader.value = true
  topicStore.newTopicData(form)
}


const selectSubjectCluster = (learning_area_number) => {
  subjectClusterStore.fetchSubjectClusterFilter(learning_area_number)
}

const selectSubject = (subject_cluster_number) => {
  subjectStore.fetchSubjectList(subject_cluster_number)
}


const selectStrand = (subject_number) => {
  classStore.fetchClassesCurriculum()
  strandStore.fetchStrandList(subject_number)
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
    () => topicStore.topicResponse,
    async (data) => {
      if(data){
       loader.value = false
        form.name = null
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


watch(
    () => topicStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
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
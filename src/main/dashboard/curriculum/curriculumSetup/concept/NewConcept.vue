<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useConceptStore} from "@/main/dashboard/curriculum/curriculumSetup/concept/store/concept.js";
import {useSubtopicStore} from "@/main/dashboard/curriculum/curriculumSetup/subTopic/store/subTopic.js";
import {useTopicStore} from "@/main/dashboard/curriculum/curriculumSetup/topic/store/topic.js";
import {useSubjectClusterStore} from "@/main/dashboard/curriculum/curriculumSetup/subjectCluster/store/subjectCluster.js";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/store/learningArea.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";
import {useStrandStore} from "@/main/dashboard/curriculum/curriculumSetup/strands/store/strand.js";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()
const notificationStore  = useNotificationStore()

const conceptStore = useConceptStore()

const subtopicStore = useSubtopicStore()

const topicStore = useTopicStore()

const subjectClusterStore = useSubjectClusterStore()
const learningAreaStore = useLearningAreaStore()
const subjectStore = useSubjectStore()
const strandStore = useStrandStore()
const commons = useCommonsStore()



const learningAreaList = ref([])
const subjectClusterList = ref([])
const subjectList = ref([])
const strandList = ref([])
const topicList = ref([])
const subtopicList = ref([])
const learning_area_number = ref("")
const subject_cluster_number = ref("")
const subject_number = ref("")
const strand_number = ref("")
const topic_number = ref("")
const conceptNumber = ref("")
let  curriculumNumber = routerData.currentRoute.value.query.id


const props = defineProps({
  conceptNo: String,
})

onMounted(
    async () => {
      fetchConceptInfo()
    }
)

const fetchConceptInfo = () => {
  conceptStore.conceptData(props.conceptNo)
}

watch(
    () => props.conceptNo,
    async (data) => {
      if(data){
        fetchConceptInfo()
      }
    },
    {deep:true}
)


const form = reactive({
  code:null,
  name:null,
  sub_topic_number:"",
})


const addConcept = () =>{
  loader.value = true
  form.curriculum_number = curriculumNumber
  if(conceptNumber.value){
    form.concept_number = conceptNumber.value
    conceptStore.editConceptData(form)
  }else {
    conceptStore.newConceptData(form)
  }

}




const selectSubjectCluster = (learning_area_number) => {
  subjectClusterStore.fetchSubjectClusterFilter({learning_area_number:learning_area_number, curriculum_number:curriculumNumber})
}

const selectSubject = (subject_cluster_number) => {
  subjectStore.fetchSubjectList({subject_cluster_number:subject_cluster_number, curriculum_number:curriculumNumber})
}


const selectStrand = (subject_number) => {
  strandStore.fetchStrandList({subject_number:subject_number, curriculum_number:curriculumNumber})
}

const selectTopic = (strand_number) => {
  topicStore.fetchTopicList({strand_number:strand_number, curriculum_number:curriculumNumber})
}

const selectSubTopic = (topic_number) => {
  subtopicStore.fetchSubTopicList({topic_number:topic_number, curriculum_number:curriculumNumber})
}

onMounted(
    () => {
      learningAreaStore.fetchLearningArea(curriculumNumber)
    }
)

watch(
    () => conceptStore.conceptEditResponse,
    async (data) => {
      if(data){
        loader.value = false
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
    () => subtopicStore.subtopicListResponse,
    async (data) => {
      if(data){
        subtopicList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => conceptStore.conceptResponse,
    async (data) => {
      if(data){
        loader.value = false
        form.name = null
      }
    },
    {deep:true}
)

watch(
    () => conceptStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

watch(
    () => conceptStore.conceptDataInfoResponse,
    async (data) => {
      if(data){
        let info = data.data
        form.name = info.name ? info.name : ""
        form.code = info.code ? String(info.code) : ""
        form.sub_topic_number = info.sub_topic_number ? info.sub_topic_number : ""
        topic_number.value = info.topic_number ? info.topic_number : ""
        subject_number.value = info.subject_number ? info.subject_number : ""
        learning_area_number.value = info.learning_area_number ? info.learning_area_number : ""
        subject_cluster_number.value = info.subject_cluster_number ? info.subject_cluster_number : ""
        strand_number.value = info.strand_number ? info.strand_number : ""
        conceptNumber.value = info.number ? info.number : ""
      }
    },
    {deep:true}
)

</script>

<template>
  <div>

    <form @submit.prevent="addConcept">

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
            @change="selectSubjectCluster(learning_area_number)"
        >
          <option disabled value="">--Select Learning Area--</option>
          <option v-for="(list, index) in learningAreaList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Subject Cluster</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="subject_cluster_number"
            @change="selectSubject(subject_cluster_number)"
        >
          <option disabled value="">--Select Subject Cluster--</option>
          <option v-for="(list, index) in subjectClusterList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>



      <div class="mb-2">
        <label class="textColor"><small>Subject</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="subject_number"
            @change="selectStrand(subject_number)"
        >
          <option disabled value="">--Select Subject--</option>
          <option v-for="(list, index) in subjectList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Strand</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="strand_number"
            @change="selectTopic(strand_number)"
        >
          <option disabled value="">--Select Strand--</option>
          <option v-for="(list, index) in strandList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Topic</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="topic_number"
            @change="selectSubTopic(topic_number)"
        >
          <option disabled value="">--Select Topic--</option>
          <option v-for="(list, index) in topicList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Sub Topic</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.sub_topic_number">
          <option disabled value="">--Select Sub Topic--</option>
          <option v-for="(list, index) in subtopicList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>



      <div class="mb-2">
        <label class="textColor"><small>Concept Name</small></label>
        <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.name" required class="form-control form-select-sm">
      </div>



      <div class="flex justify-content-end" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
            {{conceptNumber ? "Edit" : "Save"}}
          <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
        </button>
      </div>

    </form>


  </div>
</template>



<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>
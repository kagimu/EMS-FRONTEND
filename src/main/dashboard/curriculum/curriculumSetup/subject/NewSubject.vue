<template>
  <div>

    <form @submit.prevent="addSubject">

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
            v-model="form.subject_cluster_number">
          <option disabled value="">Select Subject Cluster</option>
          <option v-for="(list, index) in subjectClusterList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Subject Name</small></label>
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
import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/store/learningArea.js";
import {useSubjectClusterStore} from "@/main/dashboard/curriculum/curriculumSetup/subjectCluster/store/subjectCluster.js";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
const commons = useCommonsStore()
const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()
const learning_area_number = ref("")
const learningAreaList = ref([])
const subjectClusterList = ref([])
const  notificationStore  = useNotificationStore()

const subjectStore = useSubjectStore()
const learningAreaStore = useLearningAreaStore()
const subjectClusterStore = useSubjectClusterStore()
let  curriculumNumber = routerData.currentRoute.value.query.id


const form = reactive({
  code:null,
  name:null,
  subject_cluster_number:""
})


const addSubject = () =>{
  loader.value = true
  subjectStore.newSubjectData(form)
}

const selectSubjectCluster = (learning_area_number) => {
  subjectClusterStore.fetchSubjectClusterFilter(learning_area_number)
}


onMounted(
    () => {
      learningAreaStore.fetchLearningArea(curriculumNumber)
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
    () => subjectStore.subjectResponse,
    async (data) => {
      if(data){
        loader.value = false
        form.name = null
        form.code = null
      }
    },
    {deep:true}
)

watch(
    () => subjectStore.errorMessage,
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
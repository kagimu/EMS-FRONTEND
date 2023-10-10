<template>
  <div>

    <form @submit.prevent="addSchemeOfWork">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Code</small></label>
        <input
            ref="nameRef"
            type="text"
            style="outline: none 0 !important; box-shadow: none;"
            v-model="form.code"
            required
            class="form-control form-select-sm">
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Sub Topic</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.sub_topic_number">
          <option disabled value="">Select Sub Topic</option>
          <option v-for="(list, index) in subtopicList" :key="index" :value="list.number">{{list.name}}</option>
        </select>
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
import {useLearningAreaStore} from "@/main/dashboard/curriculum/lerningArea/store/learningArea.js";
import {useSubtopicStore} from "@/main/dashboard/curriculum/subTopic/store/subTopic.js";
const subtopicStore = useSubtopicStore()
const errorMessage = ref(null)
const name = ref(null)
const loader = ref(false)
const subtopicList = ref([])
const nameRef = ref(null)
const routerData = useRouter()

const learningAreaStore = useLearningAreaStore()


const form = reactive({
  code:null,
  sub_topic_number:"",
})


const addSchemeOfWork = () =>{
  loader.value = true
  learningAreaStore.newLearningAreaData(form)
}

const  autoInputFocusInfo =  () => {
  nameRef.value.focus()
}

 defineExpose({
  autoInputFocusInfo
});

onMounted(
    () =>{
      subtopicStore.fetchSubTopics("")
    }
)

watch(
    () => learningAreaStore.learningAreaInfResponse,
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
    () => subtopicStore.subtopicInfoResponse,
    async (data) => {
      if(data){
        subtopicList.value = data.data
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
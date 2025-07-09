<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/store/learningArea.js";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
const commons = useCommonsStore()
const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const nameRef = ref(null)
const routerData = useRouter()
const  notificationStore  = useNotificationStore()
const learningAreaStore = useLearningAreaStore()
let  curriculumNumber = routerData.currentRoute.value.query.id
const learningAreaNumber = ref(null)
const emit = defineEmits(["closeDialog"])

const form = reactive({
  name:null,
  code:null,
  curriculum_number:curriculumNumber,
})


const addLearningArea = () =>{
  loader.value = true
  if(learningAreaNumber.value){
    form.learning_area_number = learningAreaNumber.value
    learningAreaStore.editLearningAreaData(form)
  }else {
    learningAreaStore.newLearningAreaData(form)
  }

}

const  autoInputFocusInfo =  () => {
  nameRef.value.focus()
}

defineExpose({
  autoInputFocusInfo
});

onMounted(
    () =>{

    }
)

watch(
    () => learningAreaStore.learningAreaResponse,
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
    () => learningAreaStore.learningAreaEditResponse,
    async (data) => {
      if(data){
        loader.value = false
      }
    },
    {deep:true}
)


watch(
    () => learningAreaStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

watch(
    () => learningAreaStore.learningAreaDataInfoResponse,
    async (data) => {
      if(data){
        let info = data.data
        form.name = info.name ? info.name : ""
        form.code = info.code ? String(info.code) : ""
        learningAreaNumber.value = info.number ? info.number : ""
      }
    },
    {deep:true}
)

const closeLearningAreaDialog = () => {
  emit("closeDialog")
}
</script>

<template>
  <div>

    <form @submit.prevent="addLearningArea">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>

      <div class="mb-2">
        <label class="text-sm"><small>Code</small></label>
        <input
            @keypress="commons.codeValidator($event)"
            maxlength="10"
            ref="nameRef"
            type="text"
            v-model="form.code"
            @paste.prevent
            required
            class="form-control form-select-sm shadow-none">
      </div>


      <div class="mb-2">
        <label class="text-sm"><small>Learning Area Name</small></label>
        <input
            ref="nameRef"
            type="text"
            style="outline: none 0 !important; box-shadow: none;"
            v-model="form.name"
            required
            class="form-control form-select-sm">
      </div>





      <div class="flex justify-content-between" style="width: 100%;">
        <button
            type="button"
            class="btn btn-danger border-0"
            @click="closeLearningAreaDialog">
          Close
        </button>
        <button
            type="submit"
            class="btn btn-primary border-0">
            {{learningAreaNumber ? "Edit" : "Save"}}
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
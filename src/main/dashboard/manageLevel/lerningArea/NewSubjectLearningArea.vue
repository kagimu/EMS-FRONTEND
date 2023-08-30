<template>
  <div>
    <form @submit.prevent="addSubjectLearningArea">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Learning Area</small></label>
        <input type="text" v-model="form.name" required class="form-control">
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Subject</small></label>
        <input type="text" v-model="form.name" required class="form-control">
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
import {useLearningAreaStore} from "@/main/dashboard/manageLevel/lerningArea/store/learningArea.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()

const learningAreaStore = useLearningAreaStore()
const campusNumber = routerData.currentRoute.value.query.id

const learningAreaNo = ref(null)


const form = reactive({
  name:null,
})


const props = defineProps({
  learningAreaNumber: String,
})




const addSubjectLearningArea = () =>{
  loader.value = true
  form.campus_number = campusNumber
  learningAreaStore.newLearningAreaData(form)
}



onMounted(
    () =>{

    }
)


watch(
    () => props.learningAreaNumber,
    async (data) => {
      if(data){
        learningAreaNo.value = data
      }
    },
    {deep:true}
)


/*
function saveCLass(){
  loader.value = true
  classError.value = ""
  let formData = {name: name.value, class_level_number:routerData.currentRoute.value.query.id}
  if(class_number.value) {
    formData.class_number = class_number.value
    classesStore.editClassData(formData)
  }else {
    classesStore.saveNewClass(formData)
  }
}



watch(
    () => classesStore.newCampusResponse,
    async (data) => {
      if(data){
        name.value = data.data.name
        class_number.value = data.data.number
      }
    },
    {deep:true}
)
*/




</script>

<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>
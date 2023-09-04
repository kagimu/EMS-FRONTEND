<template>
  <div>

    <form @submit.prevent="addSubtopic">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Sub Topic Name</small></label>
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

import {onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {useTopicStore} from "@/main/dashboard/curriculum/topic/store/topic.js";
import {useSubtopicStore} from "@/main/dashboard/curriculum/subTopic/store/subTopic.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()

const subtopicStore = useSubtopicStore()
const topicNo = routerData.currentRoute.value.query.id


const form = reactive({
  name:null,
})


const addSubtopic = () =>{
  loader.value = true
  form.topic_number = topicNo
  subtopicStore.newSubtopicData(form)
}



onMounted(
    () =>{
      /* if(props.classNumber){
         classesStore.classDetails(props.classNumber)
       }*/
    }
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
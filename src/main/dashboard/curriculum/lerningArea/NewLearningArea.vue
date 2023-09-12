<template>
  <div>

    <form @submit.prevent="addLearningArea">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Learning Area Name</small></label>
        <input
            ref="nameRef"
            type="text"
            style="outline: none 0 !important; box-shadow: none;"
            v-model="form.name"
            required
            class="form-control form-select-sm">
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

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const nameRef = ref(null)
const routerData = useRouter()

const learningAreaStore = useLearningAreaStore()


const form = reactive({
  name:null,
})


const addLearningArea = () =>{
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

    }
)

watch(
    () => learningAreaStore.learningAreaInfResponse,
    async (data) => {
      if(data){
        loader.value = false
        form.name = null
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
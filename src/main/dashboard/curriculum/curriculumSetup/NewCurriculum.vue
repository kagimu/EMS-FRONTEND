<template>
  <div>

    <form @submit.prevent="addCurriculum">
      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>

      <div class="mb-2">
        <label class="text-sm text-sm">Curriculum Name</label>
        <input
            style="outline: none 0 !important; box-shadow: none;"
            type="text"
            v-model="form.name"
            required
            class="form-control form-control-sm">
      </div>



      <div class="flex justify-content-end" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
                 {{curriculumNumber ? "Edit" : "Save"}}
              <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
                  <span class="visually-hidden">Loading...</span>
                </span>
        </button>
      </div>

    </form>


  </div>
</template>

<script setup>

import {watch, onMounted, reactive, ref} from "vue";
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";


const classError = ref(null)
const name = ref(null)
const school_number = ref(null)
const loader = ref(false)
const curriculumNumber = ref(null)


const curriculumStore = useCurriculumStore()


const form = reactive({
  name:null,
})


const addCurriculum = () =>{
  loader.value = true
  if(curriculumNumber.value){
    form.curriculum_number = curriculumNumber.value
    curriculumStore.editCurriculumData(form)
  }else {
  curriculumStore.newCurriculumData(form)
  }

}



onMounted(
    () =>{

    }
)




watch (
    () => curriculumStore.curriculumResponse,
    async (data) => {
      if(data){
        loader.value = false
        form.name = null
      }
    },
    {deep:true}
)

watch (
    () => curriculumStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

watch (
    () => curriculumStore.curriculumDataInfoResponse,
    async (data) => {
      if(data){
        let info = data.data
        form.name = info.name ? info.name : ""
        curriculumNumber.value = info.number ? info.number : ""
      }
    },
    {deep:true}
)


watch (
    () => curriculumStore.curriculumEditResponse,
    async (data) => {
      if(data){
        loader.value = false
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
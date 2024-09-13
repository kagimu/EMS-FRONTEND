<template>
  <div>

    <form @submit.prevent="addLevel">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>

      <div class="mb-2">
        <label class="text-sm"><small>Code</small></label>
        <input
            @keypress="commons.codeValidator($event)"
            maxlength="10"
            type="text"
            v-model="form.code"
            required
            @paste.prevent
            class="form-control form-select-sm shadow-none">
      </div>


      <div class="mb-2">
        <label class="text-sm"><small>Level Name</small></label>
        <input
            style="outline: none 0 !important; box-shadow: none;"
            type="text" v-model="form.name"
            required
            class="form-control form-select-sm">
      </div>




      <div class="flex justify-content-end mt-2" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
            {{levelNumber ? "Edit" : "Save"}}
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
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()

const levelStore = useLevelStore()
const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()

const levelNumber = ref("")

const form = reactive({
  code:null,
  name:null,
})


const clearLevelForm = () => {
  form.code = null
  form.name = null
  levelNumber.value = null
}

defineExpose({
  clearLevelForm
});


const addLevel = () =>{
  loader.value = true
  if(levelNumber.value){
    form.level_number = levelNumber.value
    levelStore.editLevelData(form)
  }else {
    levelStore.newLevelData(form)
  }

}



onMounted(
    () =>{
      /* if(props.classNumber){
         classesStore.classDetails(props.classNumber)
       }*/
    }
)


watch(
    () => levelStore.levelResponse,
    async (data) => {
      if(data){
        form.name = null
        form.code = null
        loader.value = false
      }
    },
    {deep:true}
)


watch(
    () => levelStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

watch(
    () => levelStore.levelDataInfoResponse,
    async (data) => {
      if(data){
        let info = data.data
            form.code = String(info.code)
            form.name = info.name
            levelNumber.value = info.number
      }
    },
    {deep:true}
)

watch(
    () => levelStore.levelEditResponse,
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
<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";

const classError = ref(null)
const name = ref(null)
const levelList = ref([])
const loader = ref(false)
const levelStore = useLevelStore()
const routerData = useRouter()

const classStore = useClassesStore()
const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()
let  curriculumNumber = routerData.currentRoute.value.query.id

const classNumber = ref(null)
let entityN = localStorage.getItem("entity_number")



const form = reactive({
  code:null,
  name:null,
  abbreviation:null,
  level:"",
  entity_number: entityN,
})


const addClass = () =>{
  loader.value = true
  form.code = parseInt(form.code)

  if(classNumber.value){
    form.class_number = classNumber.value
    classStore.editClassData(form)
  }else {
    classStore.newClassData(form)
    // alert(JSON.stringify(form))
  }

}



onMounted(
    () =>{
      levelStore.fetchLevels()
    }
)

const clearClassForm = () => {
  form.code = null
  form.name = null
  form.abbreviation = null
  form.level = ""
  classNumber.value = null
}

defineExpose({
  clearClassForm
});

watch(
    () => classStore.classResponse,
    async (data) => {
      if(data){
        form.name = null
        form.code = null
        form.abbreviation = null
        form.level = ""
        loader.value = false
      }
    },
    {deep:true}
)


watch(
    () => classStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

watch(
    () => levelStore.levelInfoResponse,
    async (data) => {
      if(data){
        levelList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => classStore.classDataInfoResponse,
    async (data) => {
      if(data){
        let info = data.data
        form.code = info.code ? String(info.code) : ""
        form.name  = info.name ? info.name : ""
        form.abbreviation  = info.abbreviation ? info.abbreviation : ""
        form.level  = info.level_number ? info.level_number : ""
        classNumber.value = info.number ? info.number : ""
      }
    },
    {deep:true}
)


watch(
    () => classStore.classEditResponse,
    async (data) => {
      if(data){
        loader.value = false
      }
    },
    {deep:true}
)

</script>
<template>
  <div>

    <form @submit.prevent="addClass">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>


      <div class="mb-2">
        <label class="text-sm"><small>Study Level</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.level">
          <option disabled value="">--Select Level--</option>
          <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.number">{{lvl.code+". "+lvl.name}}</option>
        </select>
      </div>


      <div class="mb-2">
        <label class="text-sm"><small>Code</small></label>
        <input
            @keypress="commons.codeValidator($event)"
            maxlength="10"
            type="text"
            v-model="form.code"
            @paste.prevent
            required
            class="form-control form-select-sm shadow-none">
      </div>


      <div class="mb-2">

        <label class="text-sm"><small>Class Name</small></label>
        <input
            style="outline: none 0 !important; box-shadow: none;"
            type="text" v-model="form.name"
            required
            class="form-control form-select-sm">
      </div>

      <div class="mb-2">
        <label class="text-sm"><small>Abbreviation</small></label>
        <input
            style="outline: none 0 !important; box-shadow: none;"
            type="text" v-model="form.abbreviation"
            required
            class="form-control form-select-sm">
      </div>



      <div class="flex justify-content-end" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
           {{classNumber ? "Edit" : "Save"}}
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
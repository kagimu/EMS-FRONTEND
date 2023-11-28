<template>
  <div>

    <form @submit.prevent="addClass">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Code</small></label>
        <input
            @keypress="commons.numbersOnlyValidator($event)"
            maxlength="10"
            type="text"
            style="outline: none 0 !important;
               box-shadow: none;"
            v-model="form.code"
            required
            class="form-control form-select-sm">
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Class Name</small></label>
        <input
            style="outline: none 0 !important; box-shadow: none;"
            type="text" v-model="form.name"
            required
            class="form-control form-select-sm">
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Abbreviation</small></label>
        <input
            style="outline: none 0 !important; box-shadow: none;"
            type="text" v-model="form.abbreviation"
            required
            class="form-control form-select-sm">
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Class Level</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.level">
          <option disabled value="">Select Level</option>
          <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.number">{{lvl.code+". "+lvl.name}}</option>
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
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useLevelStore} from "@/main/settings/level/store/levels.js";

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




const form = reactive({
  code:null,
  name:null,
  abbreviation:null,
  level:"",
  curriculum_number:curriculumNumber,
})


const addClass = () =>{
  loader.value = true
  classStore.newClassData(form)
}



onMounted(
    () =>{
      /* if(props.classNumber){
         classesStore.classDetails(props.classNumber)
       }*/
    }
)


watch(
    () => classStore.classResponse,
    async (data) => {
      if(data){
         form.name = null
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


</script>

<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>
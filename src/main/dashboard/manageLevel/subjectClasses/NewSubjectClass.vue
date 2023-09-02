<template>
  <div>
    <form @submit.prevent="addClassSubjects">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>




      <div class="mb-2">
        <label class="textColor"><small>Class</small></label>
        <select
            disabled
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.class_number">
          <option disabled value="">Select Class</option>
          <option v-for="(list, index) in classList" :key="index" :value="list.number">{{list.name}}</option>
        </select>
      </div>




      <div class="mb-2">
        <label class="textColor"><small>Subject</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            multiple
            v-model="form.subject_number">
          <option disabled value="">Select Subject</option>
          <option v-for="(list,idx) in subjectList" :key="idx" :value="list.number">{{list.name}}</option>
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
import {useSubjectStore} from "@/main/dashboard/manageLevel/subject/store/subject.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()
const classStore = useClassesStore()

const learningAreaStore = useLearningAreaStore()
const subjectStore = useSubjectStore()
const campusNumber = routerData.currentRoute.value.query.id
const campusLevel = routerData.currentRoute.value.query.l

const classList = ref([])
const subjectList = ref([])


const form = reactive({
  class_number:"",
  subject_number:[],
})


const props = defineProps({
  classNumber: String,
})




const addClassSubjects = () =>{
  loader.value = true
  form.campus_number = campusNumber
  form.level_number = campusLevel
  classStore.addClassSubjectData(form)
}



onMounted(
    () =>{

    }
)


watch(
    () => props.classNumber,
    async (data) => {
      if(data){
        form.class_number = data
      }
    },
    {deep:true}
)

watch(
    () => classStore.classInfoResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => subjectStore.subjectInfoResponse,
    async (data) => {
      if(data){
        subjectList.value = data.data
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
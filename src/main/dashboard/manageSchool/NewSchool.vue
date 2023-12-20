<template>
  <div>

    <form @submit.prevent="addSchool">
      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>




      <div class="mb-2">
        <label class="textColor text-sm">School Name</label>
        <input
            style="outline: none 0 !important; box-shadow: none;"
            type="text"
            v-model="form.name"
            required
            class="form-control form-control-sm">
      </div>

      <div class="mb-2">
        <label class="textColor text-sm">Commencement Date</label>
        <input
            style="outline: none 0 !important; box-shadow: none;"
            type="date"
            v-model="form.commencement_date"
            required
            class="form-control form-control-sm">
      </div>



      <div class="mb-2">
        <label class="textColor mt-3 mb-2"><small>Select Curriculum(s) to adopt to this School</small></label>
        <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
          <li class="list-group-item" v-for="(lvl,idx) in curriculumList">
            <input
                v-model="form.curriculum"
                style="outline: none 0 !important; box-shadow: none;"
                class="form-check-input me-1" type="checkbox" :value="lvl.number" :id="idx">
            <label class="form-check-label cursor-pointer" :for="idx">{{lvl.name}}</label>
          </li>

        </ul>
      </div>



      <div class="flex justify-content-end" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
            {{school_number ? "Edit":"Save"}}
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
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";

const classError = ref(null)
const name = ref(null)
const school_number = ref(null)
const loader = ref(false)
const curriculumList = ref([])
const curriculumStore = useCurriculumStore()

const schoolStore = useSchoolStore()


const form = reactive({
  name:null,
  commencement_date:null,
  curriculum:[],
})


const addSchool = () =>{
  loader.value = true
  if(school_number.value){
    form.school_number = school_number.value
    schoolStore.editSchoolData(form)
  }else {
    schoolStore.newSchoolData(form)
  }

}

onMounted(
    async () => {
      await  curriculumStore.fetchCurriculum()
    }
)




watch (
    () => schoolStore.schoolInfoResponse,
    async (data) => {
      if(data){
        form.name = data.data.name
        school_number.value = data.data.number
      }
    },
    {deep:true}
)

watch (
    () => schoolStore.newSchoolResponse,
    async (data) => {
      if(data){
        form.name = null
        loader.value = false
      }
    },
    {deep:true}
)


watch (
    () => schoolStore.editSchoolResponse,
    async (data) => {
      if(data){
        loader.value = false
      }
    },
    {deep:true}
)

watch (
    () => schoolStore.errorMessage,
    async (data) => {
      if(data){
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

watch(
    () => curriculumStore.curriculumDataResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
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
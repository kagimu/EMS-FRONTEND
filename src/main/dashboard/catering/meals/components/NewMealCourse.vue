<script setup>

import {onMounted, reactive, ref, watch } from "vue";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

const classError = ref(null)

const loader = ref(false)


const  mealStore  = useMealStore()
const schoolStore = useSchoolStore()
const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()
const schoolsList = ref( [])




const props = defineProps({
  mealCourseData:{}
})

const form = reactive({
  school_number:"",
  count:null,
  courses:[
    {
      code:1,
      name:null,
    }
  ]
})


onMounted(
    () =>{
      schoolStore.fetchSchools()
      filterMealCourseDraft()
    }
)

watch(
    () => props.mealCourseData,
    async (data) => {
      if(data){
        filterMealCourseDraft()
      }
    }
)

const filterMealCourseDraft = () => {
  if(props.mealCourseData){
    let draft = {...props.mealCourseData}
   if(draft.courses){
     form.school_number = draft.school_number
     form.count = draft.count
     form.courses = draft.courses
   }
  }
}



const addMealCourse = () =>{
  loader.value = true

  if(form.school_number){

  form.courses.forEach(course => {
    course.code = parseInt(course.code)
    course.meal_course_number = course.number
  })


  const data = {
    school_number:form.school_number,
    count: parseFloat(form.count),
    courses: form.courses
  }

    mealStore.updateMealCourse(data)

  }else{

  form.count = parseInt(form.count)
  form.courses.forEach(lst => {
    lst.code = parseInt(lst.code)
  })
    mealStore.createNewMealCourse(form)
  }
 
}


watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if(data){
        schoolsList.value = data.data
      }
    }
)


watch(
    () => mealStore.newMealCoursesResponse,
    async (data) => {
      if(data){
        loader.value = false
      }
    }
)



watch(
    () => mealStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    }
)


const addCourseInfo = () => {
  form.courses.push({ code:(form.courses.length + 1), name:null})
}

const removeCourse = (idx) => {
  form.courses.splice(idx, 1)
}



watch(
    () => mealStore.updateMealCoursesResponse,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.successToast("Success", data.message)
      }
    }
)


</script>
<template>
  <div>

    <form @submit.prevent="addMealCourse">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>


      <div class="mb-2">
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.school_number"
        >
          <option disabled value="">--Select School--</option>
          <option v-for="(lvl, index) in schoolsList" :key="index" :value="lvl.number">{{lvl.name}}</option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Count</small></label>
        <input
            @keypress="commons.numbersOnlyValidator($event)"
            maxlength="10"
            type="text"
            style="outline: none 0 !important;
               box-shadow: none;"
            v-model="form.count"
            required
            class="form-control form-select-sm">
      </div>


      <div class="border rounded-md p-2 mt-4">
        <p>Courses</p>
        <div class="row mx-auto">
          <div class="col-3">
            <label class="textColor"><small>Code</small></label>
          </div>
          <div class="col-8">
            <label class="textColor"><small>Name</small></label>
          </div>
        </div>

        <div class="row mx-auto" v-for="(course,idx) in form.courses" :key="idx">
          <div class="col-3">
            <div class="mb-1">
              <input
                  @keypress="commons.codeValidator($event)"
                  maxlength="10"
                  type="text"
                  v-model="course.code"
                  @paste.prevent
                  required
                  class="form-control form-select-sm shadow-none">
            </div>
          </div>
          <div class="col-8">
            <div class="mb-1">
              <input
                  style="outline: none 0 !important; box-shadow: none;"
                  type="text" v-model="course.name"
                  required
                  class="form-control form-select-sm">
            </div>
            <div class="mb-1">
              <input
                  style="outline: none 0 !important; box-shadow: none;"
                  type="hidden" v-model="course.number"
       
                  class="form-control form-select-sm">
            </div>
          </div>
          <div class="col-1 p-0">
              <div class="text-[20px] cursor-pointer text-red-700" v-if="idx > 0"><i @click="removeCourse(idx)" class="bi bi-x font-bold"></i></div>
          </div>
        </div>


        <button v-if="(form.count && (form.courses.length < form.count))" class="bg-green-700 rounded-sm text-xs text-white px-3 ml-3 mt-3" type="button" @click="addCourseInfo">
          <span class="text-sm">
            <i class="bi-plus text-[15px]"></i> Add
          </span>
        </button>

      </div>










      <div class="flex justify-content-end mt-3" style="width: 100%;">
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



<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>
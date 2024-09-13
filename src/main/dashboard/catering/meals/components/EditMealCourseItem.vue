<script setup>

import {onMounted, reactive, ref, watch,defineEmits } from "vue";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()

const  mealStore  = useMealStore()
const schoolStore = useSchoolStore()
const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()
const schoolsList = ref( [])


const emit = defineEmits(['schoolNumberEmitted'])

const props = defineProps({
    courseMealItemData:{},
    schoolN:String
})

const form = reactive({
//   school_number:"",
//   count:null,
  code:1,
  name:null,
  meal_course_number:null
})

const updateMealCourse = () => {
    loader.value = true
    mealStore.updateMealCourseItem(form)
    emit('schoolNumberEmitted', props.schoolN);

}


onMounted(
    () =>{
      schoolStore.fetchSchools()
      filterMealCourseDraft()
    }
)

watch(
    () => props.courseMealItemData,
    async (data) => {
      if(data){
        filterMealCourseDraft()
      }
    }
)

const filterMealCourseDraft = () => {
  if(props.courseMealItemData){
    let draft = props.courseMealItemData
     form.code = draft.code
     form.meal_course_number = draft.number
     form.name = draft.name
   
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
    () => mealStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)



watch(
    () => mealStore.updateMealCourseItemResponse,
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
<!-- {{ courseMealItemData }} -->
<!-- {{ schoolN }} -->
    <form @submit.prevent="updateMealCourse">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>


      <!-- <div class="mb-2">
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.school_number"
        >
          <option disabled value="">--Select School--</option>
          <option v-for="(lvl, index) in schoolsList" :key="index" :value="lvl.number">{{lvl.name}}</option>
        </select>
      </div> -->


      <!-- <div class="mb-2">
        <label class="text-sm"><small>Count</small></label>
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
 -->

      <div class="border rounded-md p-2 mt-4">
        <p>Courses</p>
        <div class="row mx-auto">
          <div class="col-3">
            <label class="text-sm"><small>Code</small></label>
            <input
                  @keypress="commons.codeValidator($event)"
                  maxlength="10"
                  type="text"
                  @paste.prevent
                  v-model="form.code"
                  required
                  class="form-control form-select-sm shadow-none">
          </div>
          <div class="col-8">
            <label class="text-sm"><small>Name</small></label>

            <input
                  style="outline: none 0 !important; box-shadow: none;"
                  type="text" v-model="form.name"
                  required
                  class="form-control form-select-sm">
            </div>
            <div class="mb-1">
              <input
                  style="outline: none 0 !important; box-shadow: none;"
                  type="hidden" v-model="form.meal_course_number"
                  class="form-control form-select-sm">
          </div>
        </div>

      </div>

      <div class="flex justify-content-end mt-3" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
          Update
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
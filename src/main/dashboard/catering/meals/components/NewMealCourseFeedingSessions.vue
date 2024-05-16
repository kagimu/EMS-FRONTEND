<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()

const  mealStore  = useMealStore()
const schoolStore = useSchoolStore()
const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()
const cateringStore = useCateringStore()

const school_number = ref("")
const schoolsList = ref([])
const mealCourseList = ref([])
const feedingSessionGroupList = ref([])

const form = reactive({
  meal_course_number:"",
  feeding_sessions:[]
})


onMounted(
    async () =>{
      await schoolStore.fetchSchools()
      await cateringStore.fetchFeedingGroupSessions()
    }
)



const addMealCourseFeedingSessionsDialog = () =>{
  loader.value = true
  mealStore.createMealCourseFeedingSessions(form)
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
    () => cateringStore.feedingGroupSessionsInfoResponse,
    async (data) => {
      feedingSessionGroupList.value = data.data
    }
)


const doFetchMealCourses = (school_number) => {
  mealStore.fetchMealCourses(school_number)
}


watch(
    () => mealStore.mealCoursesResponse,
    async (data) => {
      if(data){
        mealCourseList.value = data.data
      }
    }
)

watch(
    () => mealStore.newMealCourseFeedingSessionsResponse,
    async (data) => {
      if(data){
        // form.name = null
        // form.code = null
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


</script>
<template>
  <div>

    <form @submit.prevent="addMealCourseFeedingSessionsDialog">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>


      <div class="mb-2">
        <label class="textColor"><small>School</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="school_number"
            @change="doFetchMealCourses(school_number)"
        >
          <option disabled value="">--filter by School--</option>
          <option v-for="(lvl, index) in schoolsList" :key="index" :value="lvl.number">{{lvl.name}}</option>
        </select>
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Meal Course</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.meal_course_number">
          <option disabled value="">--select Meal Course--</option>
          <option v-for="(lvl, index) in mealCourseList?.courses" :key="index" :value="lvl.number">{{lvl.name}}</option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor mt-3 mb-2"><small>Select Feeding Session(s)</small></label>
        <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
          <li class="list-group-item" v-for="(lvl,idx) in feedingSessionGroupList">
            <input
                v-model="form.feeding_sessions"
                style="outline: none 0 !important; box-shadow: none;"
                class="form-check-input me-1" type="checkbox" :value="lvl.number" :id="idx">
            <label class="form-check-label cursor-pointer" :for="idx">{{lvl.name}}</label>
          </li>

        </ul>
      </div>



      <div class="flex justify-content-end mt-2" style="width: 100%;">
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
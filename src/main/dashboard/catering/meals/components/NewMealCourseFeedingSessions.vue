<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import ComboBox from "@/components/ComboBox.vue";

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

const props = defineProps({
  mealListData:{}
})




onMounted(
    async () =>{
      await schoolStore.fetchSchools()
    }
)


const doFetchFeedingSessions = () => {
    let data = {
     school_number:school_number.value
    }
    cateringStore.fetchFeedingGroupSessions(data)

}


const addMealCourseFeedingSessionsDialog = () =>{
  loader.value = true
  mealStore.createMealCourseFeedingSessions(form)
}




watch(
    () => cateringStore.feedingGroupSessionsInfoResponse,
    async (data) => {
      // feedingSessionGroupList.value = data.data

      let draft = data?.data 
        if(draft && (draft?.length > 0)){
          feedingSessionGroupList.value = []
          let arr = []
          draft?.forEach(lst => {
            arr.push({text:lst?.name,value:lst?.feeding_session_number})
          })
          feedingSessionGroupList.value = arr
        }
    }
)


const doFetchMealCourses = () => {
    mealStore.fetchMealCourses({school_number:school_number.value,status:'ACTIVE'})
    doFetchFeedingSessions()
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
    <!-- {{ mealListData }} -->

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
            @change="doFetchMealCourses()"
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
          <option disabled value="">--Select Meal Course--</option>
          <option v-for="(lvl, index) in mealCourseList?.courses" :key="index" :value="lvl.number">{{lvl.name}}</option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor mt-3 mb-2"><small>Select Menu Packs</small></label>
        <!-- <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
          <li class="list-group-item" v-for="(lvl,idx) in feedingSessionGroupList">
            <input
                v-model="form.feeding_sessions"
                style="outline: none 0 !important; box-shadow: none;"
                class="form-check-input me-1" type="checkbox" :value="lvl.feeding_session_number" :id="idx">
            <label class="form-check-label cursor-pointer" :for="idx">{{lvl.name}}</label>
          </li>
        </ul> -->

        
        <combo-box
            v-model:optionResponse="form.feeding_sessions"
            :optionList="feedingSessionGroupList"
            :optionDraft="form?.feeding_sessions"
        ></combo-box>
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
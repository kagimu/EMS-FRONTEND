<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import ComboBox from "@/components/ComboBox.vue";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()

const mealStore = useMealStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const commons = useCommonsStore()
const notificationStore = useNotificationStore()
const cateringStore = useCateringStore()

const school_number = ref("")
const schoolsList = ref([])
const mealCourseList = ref([])
const campusList = ref([])

const daysOfWeek = ref(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
const feedingSessionGroupList = ref([])

const form = reactive({
  meal_course_number:"",
  feeding_session_number:"",
  campuses:[],
  days:[]
})


onMounted(
    async () => {
      await schoolStore.fetchSchools()
      // await cateringStore.fetchFeedingGroupSessions()
    }
)


const addMealCourseFeedingSessionsDialog = () => {
  loader.value = true
  mealStore.activateMealCourse(form)
}




const doFetchMealCourses = () => {
    mealStore.fetchMealCourses({school_number:school_number.value,status:'ACTIVE'})
    campusStore.fetchCampuses(school_number.value)
}

const fetchAllMealCourseFeeding = async (meal_course_number) => {
  let data = {
    meal_course_number:meal_course_number
  }
  await mealStore.fetchMealCourseFeedingSessions(data)
}



watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolsList.value = data.data
      }
    }
)

watch(
    () => mealStore.mealCoursesResponse,
    async (data) => {
      if (data) {
        mealCourseList.value = data.data
      }
    }
)
watch(
    () => mealStore.activateMealCourseResponse,
    async (data) => {
      if (data) {
        // form.name = null
        // form.code = null
        loader.value = false
      }
    }
)




watch(
    () => mealStore.errorMessage,
    async (data) => {
      if (data) {
        loader.value = false
        notificationStore.errorToast("Error", data.message)
      }
    }
)

watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if (data) {
        // campusList.value = data.data

        let draft = data?.data 
        if(draft && (draft?.length > 0)){
          campusList.value = []
          let arr = []
          draft?.forEach(lst => {
            arr.push({text:lst?.name,value:lst?.number})
          })
          campusList.value = arr
        }
      }
    }
)

watch(
    () => mealStore.activateMealCourseResponse,
    async (data) => {
      if(data){
       loader.value = false
      }
    }
)

watch(
    () => mealStore.mealDataResponse,
    async (data) => {
      if(data){
        feedingSessionGroupList.value = data.data

        // let draft = data?.data 
        // if(draft && (draft?.length > 0)){
        //   feedingSessionGroupList.value = []
        //   let arr = []
        //   draft?.forEach(lst => {
        //     arr.push({text:lst?.name,value:lst?.feeding_session_number})
        //   })
        //   feedingSessionGroupList.value = arr
        // }
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

      <div class="row">
        <div class="col-lg-6">

          <div class="mb-2">
            <label class="text-sm"><small>School</small></label>
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="school_number"
                @change="doFetchMealCourses()"
            >
              <option disabled value="">--filter by School--</option>
              <option v-for="(lvl, index) in schoolsList" :key="index" :value="lvl.number">{{ lvl.name }}</option>
            </select>
          </div>

          <div class="mb-2">
            <label class="text-sm mt-3 mb-2"><small>Select Campus</small></label>
            <!-- <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
              <li class="list-group-item" v-for="(lst,idx) in campusList">
                <input
                    v-model="form.campuses"
                    style="outline: none 0 !important; box-shadow: none;"
                    class="form-check-input me-1" type="checkbox" :value="lst.number" :id="idx+'-campus'">
                <label class="form-check-label cursor-pointer" :for="idx+'-campus'">{{ lst.name }}</label>
              </li>
            </ul> -->

      
            <combo-box
            v-model:optionResponse="form.campuses"
            :optionList="campusList"
            :optionDraft="form?.campuses"
        ></combo-box>

          </div>

          <div class="mb-2">
            <label class="text-sm"><small>Meal Course</small></label>
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="form.meal_course_number"
                @change="fetchAllMealCourseFeeding(form.meal_course_number)"
            >
              <option disabled value="">--Select Meal Course--</option>
              <option v-for="(lvl, index) in mealCourseList?.courses" :key="index" :value="lvl.number">{{ lvl.name }}
              </option>
            </select>
          </div>


          <div class="mb-2">
            <label class="text-sm"><small>Menu Pack</small></label>
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="form.feeding_session_number">
              <option disabled value="">--Select Menu Pack--</option>
              <option v-for="(lst, index) in feedingSessionGroupList" :key="index" :value="lst.feeding_session_number">{{ lst.name }}
              </option>
            </select>

                  
        <!-- <combo-box
            v-model:optionResponse="form.feeding_session_number"
            :optionList="feedingSessionGroupList"
            :optionDraft="form?.feeding_session_number"
        ></combo-box> -->
          </div>



     


        </div>
        <div class="col-lg-6">
          <div class="mb-2">
            <label class="text-sm mt-3 mb-2"><small>Select Days of the week</small></label>
            <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
              <li class="list-group-item" v-for="(day,idx) in daysOfWeek">
                <input
                    v-model="form.days"
                    style="outline: none 0 !important; box-shadow: none;"
                    class="form-check-input me-1" type="checkbox" :value="day" :id="idx+'-day'">
                <label class="form-check-label cursor-pointer" :for="idx+'-day'">{{ day }}</label>
              </li>
            </ul>
          </div>
        </div>
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
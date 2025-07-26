<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import ComboBox from "@/components/ComboBox.vue";

const dayList = ref([])   
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
// const days = ref([]);
// const meal_courses = ref([])
const feedingGroupData = ref([])

const form = reactive({
  feeding_group_number:"",
  meal_courses:[],
  days:[]
})



onMounted(
    async () =>{
      await schoolStore.fetchSchools()
      theDays()
     
    }
)



const addMealCoursePerDay = () =>{
  loader.value = true
  mealStore.createMealCoursesPerDay(form)
}


const daysData = ref([
      { name: 'Sunday', abbreviation: 'Sun' },
      { name: 'Monday', abbreviation: 'Mon' },
      { name: 'Tuesday', abbreviation: 'Tue' },
      { name: 'Wednesday', abbreviation: 'Wed' },
      { name: 'Thursday', abbreviation: 'Thu' },
      { name: 'Friday', abbreviation: 'Fri' },
      { name: 'Saturday', abbreviation: 'Sat' },
    ]);



const theDays = () => {
  let draft = daysData.value
        if(draft && (draft?.length > 0)){
          dayList.value = []
          let arr = []
          draft?.forEach(lst => {
            arr.push({text:lst?.name,value:lst?.abbreviation})
          })
          dayList.value = arr
        }
}


watch(
  () => cateringStore.feedingGroupInfoResponse,
  async (data) => {
      feedingGroupData.value = data.data
  },
  {deep: true}
)

watch(
    () => cateringStore.feedingGroupSessionsInfoResponse,
    async (data) => {
      feedingSessionGroupList.value = data.data
    }
)


const doFetchMealCourses = () => {

    mealStore.fetchMealCourses({school_number:school_number.value,status:'ACTIVE'})
    cateringStore.fetchFeedingGroup(school_number.value)

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
        // mealCourseList.value = data.data

        
      let draft = data?.data?.courses
        if(draft && (draft?.length > 0)){
          mealCourseList.value = []
          let arr = []
          draft?.forEach(lst => {
            arr.push({text:lst?.name,value:lst?.number})
          })
          mealCourseList.value = arr
        }
      }
    }
)

watch(
    () => mealStore.newMealCoursesPerDayResponse,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.successToast("Success", data.message)
        form.feeding_group_number="",
        form.meal_courses=[],
        form.days=[]
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
  

    <form @submit.prevent="addMealCoursePerDay">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>


      <div class="mb-2">
        <label class="text-sm"><small>School</small></label>
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
    <label class="mt-4"><small>Feeding Group</small></label>
<select class="form-select form-control" v-model="form.feeding_group_number" required>
    <option value="" disabled>-select</option>
    <option v-for="(list,index) in feedingGroupData" :key="index" :value="list.number">{{list.name  }}</option>
</select>
</div>

      <div class="mb-2">
        <label class="text-sm"><small>Meal Course</small></label>
   
        <!-- <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
          <li class="list-group-item" v-for="(lvl, index) in mealCourseList?.courses" :key="index">
            <input
                v-model="form.meal_courses"
                style="outline: none 0 !important; box-shadow: none;"
                class="form-check-input me-1" type="checkbox" :value="lvl.number" :id="idx">
            <label class="form-check-label cursor-pointer" :for="idx">{{lvl.name}}</label>
          </li>
        </ul> -->

        <combo-box
            v-model:optionResponse="form.meal_courses"
            :optionList="mealCourseList"
            :optionDraft="form?.meal_courses"
        ></combo-box>


      </div>


      <div class="mb-2">
        <label class="text-sm mt-3 mb-2"><small>Select Day(s)</small></label>
        <!-- <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
          <li class="list-group-item" v-for="(lvl,idx) in daysData">
            <input
                v-model="form.days"
                style="outline: none 0 !important; box-shadow: none;"
                class="form-check-input me-1" type="checkbox" :value="lvl.abbreviation" :id="idx">
            <label class="form-check-label cursor-pointer" :for="idx">{{lvl.name}}</label>
          </li>

        </ul> -->

        <combo-box
            v-model:optionResponse="form.days"
            :optionList="dayList"
            :optionDraft="form?.days"
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
<script setup>

import {onMounted, ref, watch} from "vue";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import AppModal from "@/components/AppModal.vue";
import ActivateMealCourse from "@/main/dashboard/catering/meals/components/ActivateMealCourse.vue";

const mealCalendarList = ref([])
const  mealStore  = useMealStore()
const campusStore = useCampusStore()
const schoolStore = useSchoolStore()
const school_number = ref("")
const campus_number = ref("")
const schoolsList = ref([])
const campusList = ref([])
const mealActivateMealCourseDialog = ref(false)



onMounted(
    async () => {
      await schoolStore.fetchSchools()
    }
)

const fetchCampusBySchool = () => {
  campus_number.value = ""
  campusStore.fetchCampuses(school_number.value)
  // doFetchMealCourses()
}

const doFetchMealCourses = () => {
  let data = {
    school_number:school_number.value,
    campus_number:campus_number.value
  }
  mealStore.fetchMealCalendar(data)
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
    () => mealStore.mealCalendarResponse,
    async (data) => {
      if(data){
        mealCalendarList.value = data.data
      }
    }
)


watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if (data) {
        campusList.value = data.data
      }
    }
)

const doActivateMealCourse = () => {
  mealActivateMealCourseDialog.value = true
}


watch(
    () => mealStore.activateMealCourseResponse,
    async (data) => {
      if(data){
        doFetchMealCourses()
        // mealCalendarList.value = data.data
      }
    }
)

</script>

<template>
  <div>

    <AppModal title="Activate Meal Course" v-model="mealActivateMealCourseDialog" xl4>
      <ActivateMealCourse></ActivateMealCourse>
    </AppModal>



    <div class="row">

      <div class="col-12">


        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Meal Courses</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="doActivateMealCourse">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
            Activate Meal Course
          </button>
        </div>


        <div class="row mt-5 mb-2 mx-auto">
          <div class="col-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="school_number"
                  @change="fetchCampusBySchool()"
              >
                <option disabled value="">--Filter by School--</option>
                <option v-for="(lvl, index) in schoolsList" :key="index" :value="lvl.number">{{lvl.name}}</option>
              </select>
            </div>
          </div>
          <div class="col-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="campus_number" required
                  @change="doFetchMealCourses()"
              >
                <option disabled value="">--Filter by campus--</option>
                <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                </option>
              </select>
            </div>
          </div>
        </div>


        <table class="table table-hover caption-top table-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <td class="w-[10%] border  border-r" v-for="(header, idx) in mealCalendarList?.headers" :key="idx">{{header}}</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(calender, index) in mealCalendarList?.calendar_raw_response" :key="index">
            <td class="border-r"> {{calender.course_name}}</td>
            <td class="border-r hover:bg-[#dbdee1] cursor-pointer" v-for="(days, key) in calender?.day_items" :key="key">

              <div v-if="days.active">
                <div class="text-sm" v-for="(item, key) in days?.items" :key="key">
                  <small>
                    <!--                    <i style="font-size: 15px;"  class="bi-dot mr-2"></i>-->
                    {{(key + 1)}}.
                    {{item}}
                  </small>
                </div>
              </div>

              <div v-else >
                <i v-tooltip.right="days.error"  class="bi-exclamation-triangle mr-2 text-red-700 text-[20px]"></i>
              </div>


            </td>

          </tr>
          </tbody>
        </table>

      </div>
    </div>



  </div>
</template>

<style scoped>

</style>
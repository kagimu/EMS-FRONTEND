<script setup>

import AppModal from "@/components/AppModal.vue";
import {onMounted, ref, watch} from "vue";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import NewMealCoursePerDay from "@/main/dashboard/catering/meals/components/NewMealCoursePerDay.vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

const schoolStore = useSchoolStore()
const  mealStore  = useMealStore()
const  notificationStore  = useNotificationStore()

const school_number = ref("")
const schoolsList = ref([])

const mealCoursePerDayDialog = ref(false)
const mealCoursePerDayList = ref([])

const addMealCoursePerDay = () => {
  mealCoursePerDayDialog.value = true
}

onMounted(
    async () => {
        await schoolStore.fetchSchools()
    }
)

const doFetchMealCoursesPerDay = (school_number) => {
  if(school_number){
    mealStore.fetchMealCoursesPerDay(school_number)
  }
}


watch(
    () => mealStore.newMealCoursesPerDayResponse,
    async (data) => {
      if(data){
        mealCoursePerDayDialog.value = false
      }
    }
)

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if(data){
        schoolsList.value = data.data
      }
    }
)

watch(
    () => mealStore.mealCoursesPerDayResponse,
    async (data) => {
      if(data){
        mealCoursePerDayList.value = data.data
      }
    }
)

// watch(
//     () => mealStore.newMealCoursesPerDayResponse,
//     async (data) => {
//       if(data){
//         mealCoursePerDayDialog.value = false
//         notificationStore.successToast("Success", data.message)

//       }
//     }
// )

watch(
    () => mealStore.mealDataResponse,
    async (data) => {
      if(data){
        mealList.value = data.data
      }
    }
)



</script>

<template>
  <div>


    <AppModal title="Add New Meal Course Per Day" v-model="mealCoursePerDayDialog" lg>
      <NewMealCoursePerDay></NewMealCoursePerDay>
    </AppModal>



    <div class="row">

      <div class="col-12">



        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Meal Courses Per Day</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addMealCoursePerDay">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
            Add Meal Course Per Day
          </button>
        </div>

        <div class="row mt-5 mb-2 mx-auto">
          <div class="col-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="school_number"
                  @change="doFetchMealCoursesPerDay(school_number)"
              >
                <option disabled value="">--filter by School--</option>
                <option v-for="(lvl, index) in schoolsList" :key="index" :value="lvl.number">{{lvl.name}}</option>
              </select>
            </div>
          </div>
     
        </div>


        <table class="table table-hover caption-top table-sm text-[14px]">
          <thead>
          <tr>
            <td class="w-[10%] border  border-r" v-for="(header, idx) in mealCoursePerDayList?.headers" :key="idx">{{header}}</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(calender, index) in mealCoursePerDayList?.feeding_group" :key="index">
            <td class="border-r"> {{calender.group_name}}</td>
            <td class="border-r hover:bg-[#dbdee1] cursor-pointer" v-for="(days, key) in calender?.meal_courses" :key="key">

              <div v-if="days.active">
                <div class="text-sm" v-for="(item, key) in days?.meal_courses" :key="key">
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
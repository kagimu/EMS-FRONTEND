<script setup>

import AppModal from "@/components/AppModal.vue";
import {onMounted, ref, watch} from "vue";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import NewMealCourse from "@/main/dashboard/catering/meals/components/NewMealCourse.vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
const  mealStore  = useMealStore()
const schoolStore = useSchoolStore()
const  notificationStore  = useNotificationStore()

const mealCourseList = ref([])
const mealEditMode = ref(false)
const mealCourseDialog = ref(false)
const school_number = ref("")
const schoolsList = ref([])

const addCourse = () => {
  mealCourseDialog.value = true
}


onMounted(
    async () => {
      doFetchMealCourses()
      await schoolStore.fetchSchools()
    }
)

const doFetchMealCourses = (school_number) => {
   mealStore.fetchMealCourses(school_number)
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
    () => mealStore.newMealCoursesResponse,
    async (data) => {
      if(data){
        doFetchMealCourses()
        notificationStore.successToast("Success", data.message)
      }
    }
)



</script>

<template>
  <div>


    <AppModal :title="mealEditMode ? 'Edit Meal' : 'Add Meal Course'" v-model="mealCourseDialog" lg>
      <new-meal-course :mealCourseList="mealCourseList"></new-meal-course>
    </AppModal>




    <div class="row">

      <div class="col-12">



        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Meal Courses</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addCourse">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
            Add a Meal Course
          </button>
        </div>


        <div class="row mt-5 mb-2 mx-auto">
          <div class="col-3">
              <div class="mb-2">
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
          </div>
        </div>


    <div class="ml-4 mb-3" v-if="mealCourseList?.count">
      <small class="text-sm bg-[#1a7f37] text-white px-4 py-1  rounded-md">
        Number of meal courses per day:  {{mealCourseList?.count}}
      </small>
    </div>

        <table class="table table-hover caption-top table-sm text-sm border" style="font-size: 14px;">
          <thead>
          <tr>
            <th class="w-[30%] text-sm" scope="col">Code</th>
            <th class="text-sm" scope="col">Name</th>
<!--            <th class="text-sm" scope="col">Action</th>-->
          </tr>
          </thead>
          <tbody>
          <tr v-for="(levelInfo, index) in mealCourseList?.courses" :key="index">
            <td> {{levelInfo.code}}</td>
            <td> {{levelInfo.name}}</td>
<!--            <td>-->
<!--              <div>
                <i
                    style="font-size: 13px;"
                    data-bs-toggle="modal" data-bs-target="#levelModal"
                    class="bi-pencil mr-2 cursor-pointer" @click="editLevel(levelInfo)"></i>
                <i
                    style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteLevel(levelInfo, index)"></i>
                <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>-->
<!--            </td>-->
          </tr>
          </tbody>
        </table>

      </div>
    </div>



  </div>
</template>

<style scoped>

</style>
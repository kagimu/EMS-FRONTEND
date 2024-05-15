<script setup>

import AppModal from "@/components/AppModal.vue";
import {onMounted, ref, watch} from "vue";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import NewMealCourse from "@/main/dashboard/catering/meals/components/NewMealCourse.vue";
import useNotificationStore from "@/composables/useNotification.js";
const  mealStore  = useMealStore()
const  notificationStore  = useNotificationStore()

const mealCourseList = ref([])
const mealEditMode = ref(false)
const mealCourseDialog = ref(false)

const addCourse = () => {
  mealCourseDialog.value = true
}


onMounted(
    async () => {
      doFetchMealCourses()
    }
)

const doFetchMealCourses = () => {
   mealStore.fetchMealCourses()
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
      <new-meal-course></new-meal-course>
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



        <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th scope="col" style="width: 30%;">Code</th>
            <th scope="col">Name</th>
            <th scope="col">Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(levelInfo, index) in mealCourseList" :key="index">
            <td> {{levelInfo.code}}</td>
            <td> {{levelInfo.name}}</td>
            <td>
              <div>
                <i
                    style="font-size: 13px;"
                    data-bs-toggle="modal" data-bs-target="#levelModal"
                    class="bi-pencil mr-2 cursor-pointer" @click="editLevel(levelInfo)"></i>
                <i
                    style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteLevel(levelInfo, index)"></i>
                <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                  <span class="visually-hidden">Loading...</span>
                </div>
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
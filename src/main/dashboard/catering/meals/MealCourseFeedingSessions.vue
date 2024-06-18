<script setup>

import AppModal from "@/components/AppModal.vue";
import {onMounted, ref, watch} from "vue";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import NewMealCourseFeedingSessions from "@/main/dashboard/catering/meals/components/NewMealCourseFeedingSessions.vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
const  mealStore  = useMealStore()
const  notificationStore  = useNotificationStore()
const schoolStore = useSchoolStore()

const mealList = ref([])
const mealEditMode = ref(false)
const mealCourseFeedingSessionsDialog = ref(false)

const school_number = ref("")
const meal_course_number = ref("")
const schoolsList = ref([])
const mealCourseList = ref([])

const addMeal = () => {
  mealCourseFeedingSessionsDialog.value = true
  mealEditMode.value=false
}


onMounted(
    async () => {
      await schoolStore.fetchSchools()
    }
)


const doCourseFeedingSessionInfo = async () => {
  await fetchAllMealCourseFeeding()
}


const doFetchMealCourses = () => {
    mealStore.fetchMealCourses({school_number:school_number.value,status:'ACTIVE'})
}

const fetchAllMealCourseFeeding = async () => {
  let data = {
    meal_course_number:meal_course_number.value
  }
  await mealStore.fetchMealCourseFeedingSessions(data)
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
        mealCourseFeedingSessionsDialog.value = false
        notificationStore.successToast("Success", data.message)
        await fetchAllMealCourseFeeding()
      }
    }
)

watch(
    () => mealStore.mealDataResponse,
    async (data) => {
      if(data){
        mealList.value = data.data
      }
    }
)


//edit
const dataList = ref([])
 const namee = ref(null)
 const mealListData = ref([])

  const editThisData = (num) => {
    mealEditMode.value = true
    namee.value = num.name
    mealCourseFeedingSessionsDialog.value = true
    mealListData.value = num
  }
//delete
  const deleteThisData = (id,name) => {
if(!confirm("Are you sure, you want to delete: " + name)){
  return
}
// delete endpoint

}



</script>

<template>
  <div>


    <AppModal :title="mealEditMode ? 'Edit Meal Course Feeding Sessions' : 'Add Meal Course Feeding Sessions'" v-model="mealCourseFeedingSessionsDialog" lg>
      <NewMealCourseFeedingSessions :mealListData="mealListData"></NewMealCourseFeedingSessions>
    </AppModal>


    <div class="row">

      <div class="col-12">



        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Meal Course Feeding Sessions</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addMeal">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
            Add Meal Course Feeding Sessions
          </button>
        </div>


        <div class="row mt-5 mb-2 mx-auto">
          <div class="col-3">
            <div class="mb-2">
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
          </div>
          <div class="col-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="meal_course_number"
                  @change="doCourseFeedingSessionInfo()"
              >
                <option disabled value="">--Select Meal Course--</option>
                <option v-for="(lvl, index) in mealCourseList?.courses" :key="index" :value="lvl.number">{{lvl.name}}</option>
              </select>
            </div>
          </div>
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
          <tr v-for="(levelInfo, index) in mealList" :key="index">
            <td> {{levelInfo.code}}</td>
            <td> {{levelInfo.name}}</td>
            <td>
        <!-- <button @click="editThisData(levelInfo)" data-bs-toggle="offcanvas" aria-controls="rolesDialogg">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button> -->
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>&nbsp;
          <button type="button" @click="deleteThisData(levelInfo.number,levelInfo.name)">
            <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
          </button>
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
<script setup>

import AppModal from "@/components/AppModal.vue";
import {onMounted, ref, watch} from "vue";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import NewMealCourse from "@/main/dashboard/catering/meals/components/NewMealCourse.vue";
import EditMealCourseItem from "@/main/dashboard/catering/meals/components/EditMealCourseItem.vue";
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
const schoolN = ref(null)

const addCourse = () => {
  mealCourseDialog.value = true
  mealEditMode.value = false
  mealCourseList.value=""
}


onMounted(
    async () => {
      doFetchMealCourses()
      await schoolStore.fetchSchools()
    }
)

const doFetchMealCourses = (school_number) => {
   schoolN.value = school_number
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

//edit
const dataList = ref([])
 const namee = ref(null)

  const editThisData = (num) => {
    mealEditMode.value = true
    mealCourseDialog.value=true
    dataList.value = num
    namee.value = num.name
    showingModal.value = true
    mealCourseList.value=num
  }


//delete
const deleteThisData = (id,name) => {
if(!confirm("Are you sure, you want to delete: " + name)){
  return
}
}

const receivedSchoolNumber = ref('');
const handleSchoolNumberChanged = (schoolNumber) => {
  receivedSchoolNumber.value = schoolNumber;
}

watch(
    () => mealStore.updateMealCoursesResponse,
    async (data) => {
      if(data){
        mealStore.fetchMealCourses(receivedSchoolNumber.value)
        mealCourseDialog.value=false
      }
    }
)

const editMealCourseItemDialog = ref(false)
const courseMealItemData = ref(null)

const showEditCourseItemModal  = (courseMealItem) =>{
  editMealCourseItemDialog.value = true
  courseMealItemData.value = courseMealItem
  namee.value = courseMealItemData.name  
}




const recievedSchoolNumber = ref('');
const handleSchoolNumberEmitted = (schoolNumber) => {
  recievedSchoolNumber.value = schoolNumber;
}

watch(
    () => mealStore.updateMealCourseItemResponse,
    async (data) => {
      if(data){
        editMealCourseItemDialog.value = false
        mealStore.fetchMealCourses(recievedSchoolNumber.value )
      }
    }
)


</script>

<template>
  <div>


    <AppModal :title="mealEditMode ? 'Edit Meal' + namee : 'Add Meal Course'" v-model="mealCourseDialog" lg >
      <new-meal-course :mealCourseList="mealCourseList" @schoolNumberChanged="handleSchoolNumberChanged"></new-meal-course>
    </AppModal>

  
    <AppModal title="Edit Meal Course Item" v-model="editMealCourseItemDialog" lg >
      <EditMealCourseItem :courseMealItemData="courseMealItemData" :schoolN="schoolN" @schoolNumberEmitted="handleSchoolNumberEmitted"></EditMealCourseItem>
    </AppModal>
    <div class="row">

      <div class="col-12">

<!-- {{ receivedSchoolNumber }} -->

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
           <th class="text-sm" scope="col">Action  <button
              type="button"  class="btn btn-sm buttonStyle btn-warning ml-1 mr-2" @click="editThisData(mealCourseList)">
            <i style="font-size: 12px;"  class="bi-pencil mr-2"></i>
           Bulk Edit
          </button></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(levelInfo, index) in mealCourseList?.courses" :key="index">
            <td> {{levelInfo.code}}</td>
            <td> {{levelInfo.name}}</td>
              <td>
                <td>
          <button  @click="showEditCourseItemModal(levelInfo,levelInfo.name)">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>&nbsp;
          <button type="button" @click="deleteThisData(levelInfo.number,levelInfo.name)">
            <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
          </button>
      </td>
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
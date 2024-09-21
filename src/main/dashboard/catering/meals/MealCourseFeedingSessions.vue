<script setup>

import AppModal from "@/components/AppModal.vue";
import {onMounted, ref, watch} from "vue";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import NewMealCourseFeedingSessions from "@/main/dashboard/catering/meals/components/NewMealCourseFeedingSessions.vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import { useAbility } from '@casl/vue';
const { can } = useAbility()

const confirmationRef = ref(null);

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
  mealListData.value = ""
  mealCourseFeedingSessionsDialog.value = true
  mealEditMode.value=false
}


onMounted(
    async () => {
      await schoolStore.fetchSchools()
    }
)


const doCourseFeedingSessionInfo = async () => {
  fetchAllMealCourseFeeding()
}


const doFetchMealCourses = () => {
  fetchAllMealCourseFeeding()
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
 const feedingCourseNumber=ref(null)

  const editThisData = (num) => {
    feedingCourseNumber.value = meal_course_number.value
    mealEditMode.value = true
    namee.value = num.name
    mealCourseFeedingSessionsDialog.value = true
    mealListData.value = num
  }



const deleteThisData = async (id,name) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: " + name);
if (agreed) {
     let data = {
      feeding_session_number:id
    }
     mealStore.deleteMealCourseFeedingSessions(data)
}
}

watch(
    () => mealStore.deleteMealCourseFeedingSessionsResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch(
    () => mealStore.errorMessage,
    async (data) => {
      if(data){
        let message = data.message
        notificationStore.errorToast("Error",message)
      }
    }
)


</script>

<template>
  <div>
    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal :title="mealEditMode ? 'Edit Meal Course Menu Pack' : 'Add Meal Course Menu Pack'" v-model="mealCourseFeedingSessionsDialog" lg>
      <NewMealCourseFeedingSessions :mealListData="mealListData" :feeding_meal_course_number="feedingCourseNumber"></NewMealCourseFeedingSessions>
    </AppModal>


    <div class="row">

      <div class="col-12">


        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Meal Course Menu Pack</div>
          <button
          v-if="can('create_meal_course_menu_pack','general')" 
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addMeal">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
            Add Meal Course Menu Pack                                                   
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


        <!-- <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th scope="col" style="width: 30%;">#</th>
            <th scope="col">Name</th>
           <th scope="col">Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(levelInfo, index) in mealList" :key="index">
            <td> {{index+1}}</td>
            <td> {{levelInfo.name}}</td>
            <td>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>&nbsp;
          <button type="button" @click="deleteThisData(levelInfo.number,levelInfo.name)">
            <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
          </button>
      </td>
          </tr>
          </tbody>
        </table> -->

      </div>
    </div>



    <!-- <div class="row m-2">
      <div v-for="(list, index) in mealList" :key="index" class="col-md-6 mb-3 mt-2">
        <div class="card card-hover">
          <div class="bg-[#f7f7f7] px-2 py-2 rounded-t-md">
     
            <div class="">

              <div class="flex flex-grow justify-between text-xs text-gray-600">
              <div>
                <div class="font-bold">{{ list?.name }}</div>
                <div class="text-red-800 ">Cost: Shs {{ list?.pack_cost }}</div>
               
              </div>

              <div>
              
                <button type="button" @click="deleteThisData(list.feeding_session_number,list.name)">
                  <i class="bi bi-trash" style="color:rgb(201, 10, 10);"></i>
                </button>
              </div>

            </div>
            
            </div>



          </div>
            <table class="table table-hover table-sm table-striped text-[12px]">
              <th>Name</th>
              <th>Qty</th>
              <th>Consumption Unit</th>
              <tbody>
            <tr v-for="menuItem in list.pack_items" :key="menuItem.number" class="m-1">
              <td>{{ menuItem.name }}</td>
              <td>{{ menuItem.consumption_quantity }}</td>
              <td>{{ menuItem.unit_of_consumption.name }}</td>
            </tr>
          </tbody>
          </table>
          
        
        </div>
      </div>
    </div> -->



    <div class="row m-2">
  <div v-for="(list, index) in mealList" :key="index" class="col-md-6 mb-3 mt-2">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <div>
          <h6 class="mb-1">{{ list?.name }}</h6>
          <p class="text-danger mb-0">Cost: Shs {{ list?.pack_cost }}</p>
        </div>
        <button
        v-if="can('delete_meal_course_menu_pack','general')" 
        style="float: right;"
          type="button"
          class="btn btn-outline-danger btn-sm"
          @click="deleteThisData(list.feeding_session_number, list.name)"
          aria-label="Delete"
        >
          <i class="bi bi-trash"></i>
        </button>

        <button
        v-if="can('edit_meal_course_menu_pack','general')" 
          type="button"
          class="btn btn-outline-success btn-sm"
          @click="editThisData(list)"
          aria-label="edit"
        >
          <i class="bi bi-pencil"></i>
        </button>
      </div>
      <div class="card-body">
        <ul class="list-group list-group-flush">
          <li v-for="menuItem in list.pack_items" :key="menuItem.number" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{{ menuItem.name }}</strong>
              <p class="mb-0 small text-muted">Unit: {{ menuItem.unit_of_consumption.name }}</p>
            </div>
            <span class="badge bg-primary rounded-pill">{{ menuItem.consumption_quantity }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>


<!-- <div class="row m-2">
  <div v-for="(list, index) in mealList" :key="index" class="col-md-6 mb-3 mt-2">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-1">{{ list?.name }}</h5>
          <p class="text-danger mb-0">Cost: Shs {{ list?.pack_cost }}</p>
        </div>
        <button
          type="button"
          class="btn btn-outline-danger btn-sm"
          @click="deleteThisData(list.feeding_session_number, list.name)"
          aria-label="Delete"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>
      <div class="card-body p-3">
        <table class="table table-sm table-borderless mb-0">
          <thead>
            <tr class="text-muted">
              <th>Name</th>
              <th class="text-center">Qty</th>
              <th class="text-center">Consumption Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="menuItem in list.pack_items" :key="menuItem.number">
              <td>{{ menuItem.name }}</td>
              <td class="text-center">{{ menuItem.consumption_quantity }}</td>
              <td class="text-center">{{ menuItem.unit_of_consumption.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div> -->


  </div>
</template>

<style scoped>

</style>
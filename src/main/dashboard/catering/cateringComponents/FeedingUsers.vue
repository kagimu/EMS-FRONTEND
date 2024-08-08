<script setup>
import { onMounted, reactive, ref, computed, watch } from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useCateringStore } from "@/main/dashboard/catering/store/catering.js";
import {useAuthStore} from "@/main/auth/store/auth.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js"
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import useCommonsStore from "@/composables/useCommons.js";
import { useAbility } from '@casl/vue';

const { can } = useAbility()

const commons = useCommonsStore()

const  mealStore  = useMealStore()
const authStore = useAuthStore()

let p = authStore.profile
const cateringStore = useCateringStore();
const feedingSessionGroupData = ref(null);
let errorMessage = ref(null);
const buttonLoader = ref(false);
const notificationStore = useNotificationStore();
const school_number = ref("")
const mealCourseList = ref([])
const campusList = ref([])
const schoolList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()




function padZero(number) {
  return number < 10 ? `0${number}` : number;
}

const form = reactive({
  meal_course_number: "",
  campus_number:"",
  feeding_session_number:""
});


const userList = ref([])
onMounted(() => {
  schoolStore.fetchSchools()
})

const doGetUsersList = () =>{
  cateringStore.fetchMeals(form.campus_number, form.meal_course_number);
}



//submit Meals
const submitMeal = (userN,feeding_session_number) => {
  const now = new Date();
  let data = {
    meal_course_number:form.meal_course_number,
    feeding_session_number: feeding_session_number,
    user_number: userN,
    time: now.toLocaleTimeString(),
    campus_number: form.campus_number,
    staff_number:p.number,
    date:currentDateFormat(),
  }

  cateringStore.newMeal(data)
}

const currentDateFormat = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // January is 0!
  let dd = today.getDate();

// Pad with leading zeros if necessary
  mm = mm.toString().padStart(2, '0');
  dd = dd.toString().padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

watch(
    () => cateringStore.feedingGroupSessionsInfoResponse,
    async (data) => {
      feedingSessionGroupData.value = data.data
    }
)

watch(
    () => cateringStore.errorMessage,
    async (data) => {
      if (data) {
        // doGetUsersList()
        notificationStore.errorToast("Error", data.message);
      }
    }
);

watch(
    () => cateringStore.newMealsResponse,
    async (data) => {
      doGetUsersList()
      notificationStore.successToast("Success", data.message);
    }
);

watch(
    () => cateringStore.mealsResponse,
    async (data) => {
      userList.value = data.data
    }
);


watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    }
)

const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number ?? "")
}


watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if (data) {
        campusList.value = data.data
      }
    }
)


const doFetchMealCourses = (schoolN) => {

  mealStore.fetchMealCourses({school_number:schoolN,status:'ACTIVE'})
  campusStore.fetchCampuses(schoolN)

}


watch(
    () => mealStore.mealCoursesResponse,
    async (data) => {
      if(data){
        mealCourseList.value = data.data
      }
    }
)


</script>
<template>
  <div>
     <!-- end  -->
     <div class="alert alert-primary p-1 mt-3 ml-2 mr-2 "  style="font-size:13px">Select A meal Course for you to register A Meal Please ! ..</div>
     <div class="row mt-2">
        <div class="col-12">
           <div class="">
              <div class="" style="padding: 0;">
                 <div class="container mt-0">
                    <div class="row mt-3">
                    <div class="col-3">
                    <div class="mb-2">
                      <select
                          style="box-shadow: none;"
                          class="form-select form-select-sm"
                          v-model="school_number"
                          @change="doFetchMealCourses(school_number)"
                      >
                        <option disabled value="">-- Select School--</option>
                        <option v-for="(lvl, index) in schoolList" :key="index" :value="lvl.number">{{lvl.name}}</option>
                      </select>
                    </div>
                  </div>

                  <div class="col-lg-3">
                  <div class="mb-2">

                     <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="form.campus_number" required
                        >
                        <option disabled value="">--Select campus--</option>
                        <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                        </option>
                     </select>
                  </div>
                </div>

          <div class="col-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="form.meal_course_number"
                  @change="doGetUsersList()"
              >
                <option disabled value="">--Select Meal Course--</option>
                <option v-for="(lvl, index) in mealCourseList?.courses" :key="index" :value="lvl.number">{{lvl.name}}</option>
              </select>
            </div>
          </div>
          
<!--          <div class="col-3">
            <div class="mb-2">
            <select v-model="form.feeding_session_number" class="form-control form-select"> 
            <option disabled value="">Select</option>
            <option v-for="(list, index) in feedingSessionGroupData" :key="index" :value="list.number">{{list.name}}</option>
            </select>
            </div>
          </div>-->
                  
                         <div class="row">
                          <div class="table-responsive">

                             <table
                             v-if="can('record_meals','manage')"
                                id="datatable"
                                class="ext-sm table table-hover caption-top mt-1 table-sm table-striped"
                                style="font-size: 14px !important;"
                                >
                                <thead >
                                   <tr>
                                      <th class="w-[10%]">#</th>
                                      <th class="w-[20%]">Name</th>
                                      <th class="w-[30%]">Feeding Group</th>
                                      <th class="w-[20%]" >Meal</th>
                                      <th class="text-center">Took Meal</th>
                                   </tr>
                                </thead>
                                <tbody>
                                   <tr class="text-sm" v-for="(user, index) in userList" :key="index">
                                      <td>{{ index + 1 }}</td>
                                      <td>{{ user.name }}</td>
                                      <td>{{ user.feeding_group_name }}</td>
                                      <td>
                                         <div class="table-responsive">
                                            <table class="text-sm table table-sm table-striped table-bordered p-5">
                                                  <tr v-for="(meal, mealIndex) in user.meals" :key="mealIndex">
                                                     <td class="w-[70%]">{{ meal.menu_item_name }} <small>({{meal.quantity+" "+meal.unit_of_measure}})</small></td>
<!--                                                     <td>
                                                       <input
                                                           class="form-control shadow-none border bg-white"
                                                           style="font-size: 14px;"
                                                           @keypress="commons.numbersOnlyValidator($event)"
                                                           maxlength="10"
                                                           type="text"
                                                           v-model="meal.served_quantity"
                                                           v-on:blur="submitMeal(meal.served_quantity,meal.menu_item_number,user.user_number,user.feeding_session_number)">
                                                     </td>-->
                                                  </tr>
                                            </table>
                                         </div>
                                      </td>
                                     <td class="text-center align-middle">
                                       <input
                                           v-model="user.served"
                                           @click="submitMeal(user.user_number,user.feeding_session_number)"
                                           class="form-check-input me-1 shadow-none cursor-pointer"
                                           type="checkbox"
                                           style="transform: scale(0.7); width: 1.5rem; height: 1.5rem;"
                                       >
                                     </td>
                                   </tr>
                                </tbody>
                             </table>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     </div>
  </div>
</template>

<style scoped></style>
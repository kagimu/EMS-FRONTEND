<template>
  <div>
     <!-- end  -->
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
          
          <div class="col-3">
            <div class="mb-2">
            <select v-model="form.feeding_session_number" class="form-control form-select"> 
            <option disabled value="">Select</option>
            <option v-for="(list, index) in feedingSessionGroupData" :key="index" :value="list.number">{{list.name}}</option>
            </select>
            </div>
          </div>
                  
                         <div class="row">
                          <div class="table-responsive">
                             <table
                                id="datatable"
                                class="ext-sm table table-hover caption-top mt-1 table-sm table-striped"
                                style="font-size: 14px !important;"
                                >
                                <thead >
                                   <tr>
                                      <th>#</th>
                                      <th>Name</th>
                                      <th>Feeding Group</th>
                                      <th colspan="2">Meal</th>
                                   </tr>
                                </thead>
                                <tbody>
                                   <tr v-for="(user, index) in userList" :key="index">
                                      <td>{{ index + 1 }}</td>
                                      <td>{{ user.name }}</td>
                                      <td>{{ user.feeding_group_name }}</td>
                                      <td colspan="2">
                                         <div class="table-responsive">
                                            <table class="text-sm table table-sm table-striped table-bordered p-5">
                                               <thead>
                                                  <th></th>
                                                  <th></th>
                                               </thead>
                                               <tbody>
                                                  <tr v-for="(meal, mealIndex) in user.meals" :key="mealIndex">
                                                     <td>{{ meal.menu_item_name }}</td>
                                                     <td><input class="form-control"  style="width: 50px; font-size: 14px; text-align: center;"  @keypress="commons.numbersOnlyValidator($event)" maxlength="10" type="text"  v-model="user.meals[mealIndex].quantity" v-on:blur="submitMeal(user.meals[mealIndex].quantity,meal.menu_item_number,user.user_number)"></td>
                                                  </tr>
                                               </tbody>
                                            </table>
                                         </div>
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
<script setup>
  import { onMounted, reactive, ref, computed, watch } from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import { useCateringStore } from "@/main/dashboard/catering/store/catering.js";
  import {useAuthStore} from "@/main/auth/store/auth.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js"
  import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"
  import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
  import useCommonsStore from "@/composables/useCommons.js";
  
  const commons = useCommonsStore()

  const  mealStore  = useMealStore()
  const authStore = useAuthStore()
  
  let p = authStore.profile
  const cateringStore = useCateringStore();
  const feedingSessionGroupData = ref(null);
  const feedingGroupData = ref([]);
  let errorMessage = ref(null);
  const buttonLoader = ref(false);
  const notificationStore = useNotificationStore();
  const sessionNumber = ref(null);
  const groupNumber = ref(null);
  const currentDate = ref(new Date());
  const currentTime = ref(getCurrentTime());
  const school_number = ref("")
  const mealCourseList = ref([])
  const campusList = ref([])
  const schoolList = ref([])
  const schoolStore = useSchoolStore()
  const campusStore = useCampusStore()

  
  function getCurrentTime() {
    const date = new Date();
    return `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
  }
  
  function padZero(number) {
    return number < 10 ? `0${number}` : number;
  }
  
  const form = reactive({
   meal_course_number: "",
    campus_number:"",
    feeding_session_number:""
  });
  
  // const userList = reactive([
  //   {
  //     user_number: "771fbbec-37df-42bd-afb5-bd7e9ebce916",
  //     name: "Collins Mark",
  //     feeding_group_name: "None Staff",
  //     feeding_group_number: "6c7e1074-a02b-40f8-a49c-1ce58f5568cb",
  //     meals: [
  //       {
  //         menu_item_number: "42c3f7c0-3bc0-4c8c-95a1-d276d4d6aabd",
  //         menu_item_name: "Bread",
  //         quantity: 0
  //       },
  //       {
  //         menu_item_number: "fd4dea5d-f5d1-4cec-97d9-0ad103079ce7",
  //         menu_item_name: "Milk",
  //         quantity: 0
  //       },
  //       {
  //         menu_item_number: "4491348f-aeb8-40b3-b49b-49b95a49dd60",
  //         menu_item_name: "Juice",
  //         quantity: 0
  //       }
  //     ]
  //   }
  // ]);
  
  
  
  const userList = ref([])
  onMounted(() => {
    schoolStore.fetchSchools()
    cateringStore.fetchFeedingGroupSessions()
  })
  
  const doGetUsersList = () =>{
   cateringStore.fetchMeals(form.campus_number, form.meal_course_number);
  }


  
  //submit Meals
  const submitMeal = (qty,menuItemN,userN) => {
  
  let data = reactive({
      feeding_session_number: form.feeding_session_number,
      menu_item_number: menuItemN,
      user_number: userN,
      time: currentTime,
      campus_number: form.campus_number,
      quantity:parseInt(qty),
      staff_number:p.number,
      date:currentDate
  })
  // alert(JSON.stringify(data))
  cateringStore.newMeal(data)
  }
  
  
  watch(
  () => cateringStore.feedingGroupSessionsInfoResponse,
  async (data) => {
      feedingSessionGroupData.value = data.data
  },
  {deep: true}
)
  
  watch(
    () => cateringStore.errorMessage,
    async (data) => {
      if (data) {
        notificationStore.errorToast("Error", data.message);
      }
    },
    { deep: true }
  );
  
  watch(
    () => cateringStore.newMealsResponse,
    async (data) => {
      notificationStore.successToast("Success", data.message);
    },
    { deep: true }
  );
  
  watch(
    () => cateringStore.mealsResponse,
    async (data) => {
      // notificationStore.successToast("Success", data.message);
      userList.value = data.data
    },
    { deep: true }
  );
  
  
  watch(
      () => schoolStore.schoolsResponse,
      async (data) => {
          if (data) {
              schoolList.value = data.data
          }
      },
      {deep: true}
  )
  
    const fetchCampuses = (school_number) => {
      campusStore.fetchCampuses(school_number)
  }
  
  
  watch(
      () => campusStore.campusListResponse,
      async (data) => {
          if (data) {
              campusList.value = data.data
          }
      },
      {deep: true}
  )


  const doFetchMealCourses = (school_number) => {
  if(school_number){
    mealStore.fetchMealCourses(school_number)
    campusStore.fetchCampuses(school_number)
  }
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
<style scoped></style>
<script setup>
import {onMounted, ref, watch} from "vue";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import VueDatePicker from "@vuepic/vue-datepicker";
import useNotificationStore from "@/composables/useNotification.js";

const notificationStore  = useNotificationStore()
const cateringStore = useCateringStore()
const campusStore = useCampusStore()
const schoolStore = useSchoolStore()


const schoolsList = ref([])
const campusList = ref([])
const school_number = ref("")
const campus_number = ref("")
const start_date = ref("")
const end_date = ref("")
const mealProjections = ref([])




onMounted(
    async () => {
      await schoolStore.fetchSchools()

    }
)

const fetchCampusBySchool = () => {
  campus_number.value = ""
  campusStore.fetchCampuses(school_number.value)
}

const doFetchCostProjections = async () => {
    let data = {
        start_date:formatDate(start_date.value),
        end_date:formatDate(end_date.value),
        campus_number:campus_number.value
    }
  await cateringStore.fetchMealsCostProjection(data)
}


const formatDate = (dateString) => {
  if(dateString) {
    // Parse the input date string
    const date = new Date(dateString);

    // Extract the day, month, and year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    // Return the formatted date
    return `${year}-${month}-${day}`;
  }
}


const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `Selected date is ${day}/${month}/${year}`;
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
    () => campusStore.campusListResponse,
    async (data) => {
      if (data) {
        campusList.value = data.data
      }
    }
)


watch(
    () => cateringStore.mealsCostProjectionResponse,
    async (data) => {
      if(data){
        mealProjections.value = data.data
      }
    }
)

watch(
    () => cateringStore.errorMessage,
    async (data) => {
      if(data){
        notificationStore.errorToast("Error",data.message)
      }
    }
)




</script>

<template>

  <div class="row">

    <div class="col-12">


      <div class="flex justify-content-between mt-3">
        <div class="ml-4">Meals Cost Projections</div>
      </div>

      <div class="grid grid-cols-2 gap-2">

        <div class="grid grid-cols-2 gap-2">

          <div>
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

          <div>
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="campus_number" required
                  @change="doFetchCostProjections()"
              >
                <option disabled value="">--Filter by campus--</option>
                <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                </option>
              </select>
          </div>

          <div>
              <VueDatePicker
                  placeholder="Start date: dd/mm/yyy"
                  text-input
                  auto-apply
                  :teleport="true"
                  style="font-size: 7px;"
                  v-model="start_date"
                  :preview-format="format"
                  @update:modelValue="doFetchCostProjections()"
              ></VueDatePicker>
          </div>

          <div>
              <VueDatePicker
                  placeholder="End date: dd/mm/yyy"
                  text-input
                  auto-apply
                  :teleport="true"
                  style="font-size: 7px;"
                  v-model="end_date"
                  :preview-format="format"
                  @update:modelValue="doFetchCostProjections()"
              ></VueDatePicker>
          </div>

        </div>

        <div>Summary</div>
      </div>






      <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
        <thead>
        <tr>
          <th scope="col" class="w-[5%]">#</th>
          <th scope="col" class="w-[15%]">Date</th>
          <th scope="col" class="w-[70%]">Meals</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(projection, index) in mealProjections?.calender_items" :key="index">
          <td> {{(index + 1)}}</td>
          <td> {{projection.date}}  [ {{projection.day}} ]</td>

          <td>

            <table class="table table-hover caption-top table-sm" style="font-size: 14px;">
              <thead>
              <tr>
                <th scope="col" class="w-[5%]">#</th>
                <th scope="col" class="w-[20%]">Meal</th>
                <th scope="col" class="w-[30%]">Number of People</th>
                <th scope="col" class="w-[45%]">Items</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(meal, idx) in projection?.meals" :key="idx">
                <td> {{(idx + 1)}}</td>
                <td>{{meal.meal_name}}</td>
                <td>{{meal.number_of_people}}</td>
                <td>


                  <table v-if="meal?.items?.length > 0" class="table table-hover caption-top table-sm" style="font-size: 14px;">
                    <thead>
                    <tr>
                      <th scope="col" class="w-[5%]">#</th>
                      <th scope="col" class="w-[20%]">Name</th>
                      <th scope="col" class="w-[45%]">Unit</th>
                      <th scope="col" class="w-[30%]">Quantity</th>
                      <th scope="col" class="w-[45%]">Cost</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, item_key) in meal?.items" :key="item_key">
                      <td>{{(item_key + 1)}}</td>
                      <td>{{item?.name}}</td>
                      <td>{{item?.unit_of_measure}}</td>
                      <td>{{item?.quantity}}</td>
                      <td>{{item?.total_cost}}</td>
                    </tr>
                    </tbody>
                  </table>

                </td>

              </tr>
              </tbody>
            </table>

          </td>
        </tr>
        </tbody>
      </table>

    </div>
  </div>

</template>

<style scoped>

</style>
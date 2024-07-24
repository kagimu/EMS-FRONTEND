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


      <div class="flex justify-content-between mt-3 mb-4">
        <div class="ml-4">Meals Cost Projections</div>
      </div>



            <div class="grid grid-cols-4 gap-2 px-3">

              <div>
                <select
                    style="box-shadow: none;"
                    class="form-select py-2"
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
                    class="form-select py-2"
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





        <div class="text-sm px-3 mt-5 mb-5">
          <div class="mb-2">Summary</div>
          <div class="border rounded-md">
            <table class="table table-hover caption-top table-sm text-[10px]">
              <thead>
              <tr>
                <th scope="col" class="w-[1%]">#</th>
                <th scope="col" class="w-[20%]">Name</th>
                <th scope="col" class="w-[20%]">Unit</th>
                 <th scope="col" class="w-[20%]">Purchase quantity</th>
                 <th scope="col" class="w-[19%]">purchase_unit_of_measure</th>
                <th scope="col" class="w-[20%]">Cost</th>
               
              </tr>
              </thead>
              <tbody>
              <tr v-for="(summary, summary_index) in mealProjections?.items_summary" :key="summary_index">
                <td> {{(summary_index + 1)}}</td>
                <td> {{summary.name}}</td>
                <td><div class="flex">{{summary.quantity}} ( {{summary.unit_of_measure}} )</div></td>
                <td> {{summary.purchase_quantity}}</td>
                <td> {{summary.rate_to_purchase_unit}} ({{summary.purchase_unit_of_measure}})</td>
                <td> {{summary.total_cost}}</td>
               
              </tr>
              <tr class="font-bold">
                <td colspan="3">Total</td>
                <td>{{mealProjections?.total_cost}}</td>
              </tr>
              </tbody>
            </table>

          </div>
        </div>







      <div class="mt-5 mb-2 ml-3">Projection</div>


      <div v-for="(projection, index) in mealProjections?.calender_items" :key="index" class="text-xs border rounded-md mx-3 mb-4">
        <div class="bg-[#ededed] rounded-t-md">
          <div class="flex ml-5 py-2">
            <div class="mr-10">#{{(index + 1)}}</div>
            <div> {{projection.date}}  [ {{projection.day}} ]</div>
          </div>
        </div>

        <table class="table table-hover caption-top table-sm text-[10px]">
          <thead>
          <tr>
            <th scope="col" class="w-[5%]">#</th>
            <th scope="col" class="w-[30%]">Meal</th>
            <th scope="col" class="w-[15%]">Number of People</th>
            <th scope="col" class="w-[50%]">Items</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(meal, idx) in projection?.meals" :key="idx">
            <td> {{(idx + 1)}}</td>
            <td>{{meal.meal_name}}</td>
            <td>{{meal.number_of_people}}</td>
            <td>


              <table v-if="meal?.items?.length > 0" class="table table-hover caption-top table-sm text-[10px]">
                <thead>
                <tr>
                  <th scope="col" class="w-[5%]">#</th>
                  <th scope="col" class="w-[60%]">Name</th>
                  <th scope="col" class="w-[20%]">Unit</th>
                  <th scope="col" class="w-[15%]">Cost</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, item_key) in meal?.items" :key="item_key">
                  <td>{{(item_key + 1)}}</td>
                  <td>{{item?.name}}</td>
                  <td>{{item?.quantity}} ( {{item?.unit_of_measure}} )</td>
                  <td>{{item?.total_cost}}</td>
                </tr>
                </tbody>
              </table>

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
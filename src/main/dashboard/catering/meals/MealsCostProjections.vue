<script setup>
import {onMounted, ref, watch} from "vue";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import VueDatePicker from "@vuepic/vue-datepicker";

const cateringStore = useCateringStore()
const campusStore = useCampusStore()
const schoolStore = useSchoolStore()

const schoolsList = ref([])
const campusList = ref([])
const projectionList = ref([])
const school_number = ref("")
const campus_number = ref("")
const start_date = ref("")
const end_date = ref("")




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
    return `${day}/${month}/${year}`;
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
         alert(JSON.stringify(data))
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


      <div class="row mt-5 mb-2 mx-auto">
        <div class="col-3">
          <div class="mb-2">
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
        </div>
        <div class="col-3">
          <div class="mb-2">
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
        </div>

        <div class="col-3">
          <div class="mb-2">
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
        </div>

        <div class="col-3">
          <div class="mb-2">
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
        <tr v-for="(levelInfo, index) in projectionList" :key="index">
          <td> {{levelInfo.code}}</td>
          <td> {{levelInfo.name}}</td>
          <td>
            <div>
              <i
                  v-if="can('edit_level','general')"
                  style="font-size: 13px;"
                  data-bs-toggle="modal" data-bs-target="#levelModal"
                  class="bi-pencil mr-2 cursor-pointer" @click="editLevel(levelInfo)"></i>
              <i
                  v-if="can('delete_level','general')"
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

</template>

<style scoped>

</style>
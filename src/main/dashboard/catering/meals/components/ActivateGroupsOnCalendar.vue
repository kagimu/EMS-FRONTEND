<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()

const mealStore = useMealStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const commons = useCommonsStore()
const notificationStore = useNotificationStore()
const cateringStore = useCateringStore()

const school_number = ref("")
const schoolsList = ref([])
const mealCourseList = ref([])
const campusList = ref([])
const groupEventsData = ref([])


const feedingGroupData = ref([])

let entity_number = localStorage.getItem("entity_number")

const form = reactive({
feeding_groups:[],
calendar_events:[]
})


onMounted(
    async () => {
      await schoolStore.fetchSchools()
      mealStore.fetchCalendarsEvents()
    }
)

const fetchGroup = (school) => {
  cateringStore.fetchFeedingGroup(school)
}



watch(
    () => cateringStore.feedingGroupInfoResponse,
    async (data) => {
      feedingGroupData.value = data.data
    },
    {deep: true}
)

watch(
    () => mealStore.calendarsEventsResponse,
    async (data) => {
      groupEventsData.value = data.data
    },
    {deep: true}
)

watch(
    () => cateringStore.errorMessage,
    async (data) => {
      if (data) {
        notificationStore.errorToast("Error", data.message)
      }
    },
    {deep: true}
)


watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolsList.value = data.data
      }
    }
)


watch(
    () => mealStore.activateMealCourseResponse,
    async (data) => {
      if (data) {
        loader.value = false
      }
    }
)

watch(
    () => mealStore.errorMessage,
    async (data) => {
      if (data) {
        loader.value = false
        notificationStore.errorToast("Error", data.message)
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

</script>
<template>
  <div>

    <form @submit.prevent="addMealCourseFeedingSessionsDialog">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>

      <div class="row">
        <div class="col-lg-6">

            <div class="mb-2">
            <label class="textColor"><small>School</small></label>
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="school_number"
                @change="fetchGroup(school_number)"
            >
              <option disabled value="">--filter by School--</option>
              <option v-for="(lvl, index) in schoolsList" :key="index" :value="lvl.number">{{ lvl.name }}</option>
            </select>
          </div>


          <div class="mb-2">
            <label class="textColor"><small>Calendar Events</small></label>
            <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
              <li class="list-group-item" v-for="(lst,idx) in groupEventsData">
                <input
                    v-model="form.calendar_events"
                    style="outline: none 0 !important; box-shadow: none;"
                    class="form-check-input me-1" type="checkbox" :value="lst.number" :id="idx+'-campus'">
                <label class="form-check-label cursor-pointer" :for="idx+'-campus'">{{ lst.name }}</label>
              </li>
            </ul>
          </div>

        </div>
        <div class="col-lg-6">
          <div class="mb-2">
            <label class="textColor mt-1 mb-2">Feeding Group</label>
            <table
                id="datatable"
                class="table table-striped table table-hover caption-top table-sm"
                style="font-size: 14px !important;"
                >
                <thead >
                    <tr>
                    <th style="width: 2%;"></th>
                    <th></th>
                    </tr>
                <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                {{errorMessage}}
                </div>
                </thead>
                <tbody>
                <tr v-for="(list, index) in feedingGroupData" :key="index">
                <td><input
                    v-model="form.feeding_groups"
                    style="outline: none 0 !important; box-shadow: none;"
                    class="form-check-input me-1" type="checkbox" :value="list.number"></td>
                <td>{{ list.name }}</td>
                </tr>
                            
                </tbody>
                </table>
          </div>
        </div>
      </div>


      <div class="flex justify-content-end mt-2" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
          Save
          <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
        </button>
      </div>

    </form>


  </div>
</template>


<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>
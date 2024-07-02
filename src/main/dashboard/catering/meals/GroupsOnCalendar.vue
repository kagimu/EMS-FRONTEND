<script setup>

import {onMounted, ref, watch} from "vue";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import AppModal from "@/components/AppModal.vue";
import ActivateMealCourse from "@/main/dashboard/catering/meals/components/ActivateMealCourse.vue";
import useNotificationStore from "@/composables/useNotification.js";
import ActivateGroupsOnCalendar from "@/main/dashboard/catering/meals/components/ActivateGroupsOnCalendar.vue";

const  notificationStore  = useNotificationStore()
const groupCalendarList = ref([])
const  mealStore  = useMealStore()
const campusStore = useCampusStore()
const schoolStore = useSchoolStore()
const school_number = ref("")
const campus_number = ref("")
const schoolsList = ref([])
const campusList = ref([])
const mealActivateMealCourseDialog = ref(false)
const showActivateGroup = ref(false)

const doActivateGroupOnCalendar = () =>{
  showActivateGroup.value = true
}


onMounted(
    async () => {
      await schoolStore.fetchSchools()
    }
)

const fetchCampusBySchool = () => {
  campus_number.value = ""
  campusStore.fetchCampuses(school_number.value)
}

const doFetchGroupCalendarList = () => {
  // if(groupCalendarList.value && groupCalendarList.value.length > 0) {
    groupCalendarList.value = []
  // }
  let data = {
    school_number:school_number.value,
  }
  mealStore.fetchGroupOnCalendar(data)
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
    () => mealStore.groupOnCalendarResponse,
    async (data) => {
      if(data){
        groupCalendarList.value = data.data
      }
    }
)


</script>

<template>
  <div>


    <AppModal title="Activate Group On Calendar" v-model="showActivateGroup" xl4>
  <ActivateGroupsOnCalendar></ActivateGroupsOnCalendar>
    </AppModal>



    <div class="row">

      <div class="col-12">


        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Groups On Calendar</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="doActivateGroupOnCalendar">
            Activate Groups on Calendar
          </button>
        </div>

    
        <div class="row mt-5 mb-2 mx-auto">
          <div class="col-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="school_number"
                  @change="doFetchGroupCalendarList()"
              >
                <option disabled value="">--Filter by School--</option>
                <option v-for="(lvl, index) in schoolsList" :key="index" :value="lvl.number">{{lvl.name}}</option>
              </select>
            </div>
          </div>
        </div>

        <div style="width: 100%; overflow-x: auto; white-space: nowrap; scrollbar-width: thin;;">
            <table class="table table-hover caption-top table-sm text-[14px]">
          <thead>
          <tr class="bg-[#f3f4f4]">
            <td class="border  border-r" v-for="(header, idx) in groupCalendarList?.calendar_events" :key="idx">
              <div class="pl-1 pr-10 text-gray-600">{{header?.calendar_name}}</div>
            </td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(calender_group, index) in groupCalendarList?.calendar_groups" :key="index">
            <td class="border-r">
                <div class="pl-3 pr-10 py-2">
                  {{calender_group?.group_name}}
                </div>
              </td>
            <td class="border-r hover:bg-[#dbdee1] cursor-pointer" v-for="(calendar, key) in calender_group?.active_calendars" :key="key">

             <div class="pl-5 pr-10 text-xs">
               <div v-if="calendar.active" v-tooltip.right="calendar?.calendar_name">
                 {{calendar?.calendar_name}}.
               </div>

               <div v-else >
                 <i v-tooltip.right="calendar.message"  class="bi-exclamation-triangle mr-2 text-red-700 text-[20px]"></i>
               </div>
             </div>

            </td>

          </tr>
          </tbody>
        </table>
        </div>

      </div>
    </div>



  </div>
</template>

<style scoped>

</style>
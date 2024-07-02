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
          <!-- <div class="col-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="campus_number" required
                  @change="doFetchGroupCalendarList()"
              >
                <option disabled value="">--Filter by campus--</option>
                <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                </option>
              </select>
            </div>
          </div> -->
        </div>

{{ groupCalendarList }}
<table class="table table-hover caption-top table-sm text-[14px]">
          <thead>
          <tr>
            <td>Calendar</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(calender, index) in groupCalendarList" :key="index">
            
          </tr>
          </tbody>
        </table>


      </div>
    </div>



  </div>
</template>

<style scoped>

</style>
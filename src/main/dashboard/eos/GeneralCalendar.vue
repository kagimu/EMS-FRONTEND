<script setup>
import { Calendar } from 'v-calendar';
import 'v-calendar/style.css';
import {onMounted, ref, watch} from 'vue';
import NewCalendar from "@/main/dashboard/eos/components/NewCalendar.vue";
import NewCalendarEvent from "@/main/dashboard/eos/components/NewCalendarEvent.vue";
import {CalendarStore} from "@/main/dashboard/eos/store/EosStore.js";
import useNotificationStore from "@/composables/useNotification.js";
import router from "@/config/router.js";
import useCommonsStore from "@/composables/useCommons.js";
import NewCompany from "@/main/dashboard/eos/components/NewCompany.vue";
import { Calendar as CalendarIcon, ArrowRight as ArrowRightIcon, ArrowLeft as ArrowLeftIcon, Eye as EyeIcon } from "lucide-vue-next";


import { useAbility } from '@casl/vue';

const { can } = useAbility()

const calendars = ref([]);
const calendarDialog = ref(false);
const companyDialog = ref(false);
const calendarEventDialog = ref(false);


const  calendarStore  = CalendarStore()
const  notificationStore  = useNotificationStore()
const commonsStore = useCommonsStore()

onMounted(() =>{
  calendarStore.fetchCalendars()
})


function dateFormat(date){
  return commonsStore.getOrdinalDate(date)
}
function goToCalendar(number){
  // router push
  router.push({ name: "calendar-details", params:{"calendar_id":number}})
}

const  goToViewCalendar = (numb) => {
  // router push
  router.push({ name: "calendar-year-view", params:{"calendar_id":numb}})
}

function showAddCalendarDialog(){
  calendarDialog.value = true
}

function showAddCompanyDialog(){
  companyDialog.value = true
}

function showAddCalendarEventDialog(){
  calendarEventDialog.value = true
}



watch(
    () => calendarStore.calendarCreate,
    async (data) => {
      if(data){
        calendarDialog.value = false
        notificationStore.successToast("Success",data.message)
        calendarStore.fetchCalendars()
      }

    },
    {deep:true}
)

watch(
    () => calendarStore.calendarFetch,
    async (data) => {

      if(data){
        calendars.value = data
      }

    },
    {deep:true}
)

</script>
<template>
  <div class="w-full mx-auto p-6">
    <!-- Grid layout with 3 columns -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[1085px] overflow-y-auto scrollbar-thin">

      <div
          v-for="(calendar, idx) in calendars"
          :key="idx"
          class="bg-white border border-[#0d6efd] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-[#0d6efd]/40">
          <h2 class="text-base font-semibold text-gray-800 flex items-center gap-2">
            <CalendarIcon class="w-4 h-4 text-[#0d6efd]" />
            {{ calendar.name }}
          </h2>
<!--          <p class="text-sm text-gray-500 mt-1">{{ calendar.description }}</p>-->
        </div>

        <!-- Content -->
        <div class="px-4 py-3 flex-1 flex flex-col justify-between">
          <div class="space-y-2 text-xs text-gray-600">
            <p class="flex items-center gap-2">
              <ArrowRightIcon class="w-4 h-4 text-green-600" />
              <b>From:</b> {{ dateFormat(calendar.start_date) }}
            </p>
            <p class="flex items-center gap-2">
              <ArrowLeftIcon class="w-4 h-4 text-red-600" />
              <b>To:</b> {{ dateFormat(calendar.end_date) }}
            </p>
          </div>

          <div class="mt-4 flex justify-end">
            <router-link
                :to="{ name: 'calendar-year-view', query: { calendar_id: calendar.number } }"
            >
              <button
                  type="button"
                  class="flex items-center gap-2 bg-[#2c2f8c] hover:bg-[#0c62e1] text-white text-xs font-medium px-4 py-2 rounded-lg shadow transition duration-200"
              >
                <EyeIcon class="w-4 h-4" />
                View
              </button>
            </router-link>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>





<style scoped>

</style>
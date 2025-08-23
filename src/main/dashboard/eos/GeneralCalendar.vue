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
    <div>

        <div class="row">
            <div class="col">
                <div class="modal fade" id="newCalendar" tabindex="-1" :class="{ show: calendarDialog }" aria-labelledby="" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header text-sm p-0">
                                <h6 class="modal-title ml-3 mt-2 mb-2">Add Calendar</h6>

                            </div>
                            <div class="modal-body">
                                <div class="mt-2 mb-2">
                                    <new-calendar></new-calendar>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="col">
                <div class="modal fade" id="newCompany" tabindex="-1" :class="{ show: companyDialog }" aria-labelledby="" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header text-sm p-0">
                                <h6 class="modal-title ml-3 mt-2 mb-2">Add Calendar</h6>

                            </div>
                            <div class="modal-body">
                                <div class="mt-2 mb-2">
                                    <new-company></new-company>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <div class="col">
                <div class="modal fade" id="newCalendarEvent" tabindex="-1" :class="{ show: calendarDialog }" aria-labelledby="" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header text-sm p-0">
                                <h6 class="modal-title ml-3 mt-2 mb-2">Add  Calendar Event</h6>

                            </div>
                            <div class="modal-body">
                                <div class="mt-2 mb-2">
                                    <new-calendar-event :calendars="calendars" ></new-calendar-event>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>

        <div class="flex flex-grow justify-content-end mb-3">
            <div class="flex">
              <div>
                <button
                    v-if="can('add_company','general')"
                    class="btn btn-primary mx-2" data-bs-toggle="modal" data-bs-target="#newCompany" @click="showAddCompanyDialog" >Add Company</button>
              </div>
              <div >
                <button
                    v-if="can('add_calendar','general')"
                    class="btn btn-primary mx-2" data-bs-toggle="modal" data-bs-target="#newCalendar" @click="showAddCalendarDialog" >Add new Calendar</button>
              </div>
              <div >
                <button
                    v-if="can('add_events','general')"
                    class="btn btn-primary mx-2" data-bs-toggle="modal" data-bs-target="#newCalendarEvent" @click="showAddCalendarEventDialog" >Add Events</button>
              </div>
            </div>

        </div>

      <div class="flex w-full mx-auto">
        <div class="w-[30%] pr-4 max-h-[1085px] overflow-y-scroll scrollbar-thin rounded-md">

          <div v-for="(calendar,idx) in calendars" :key="idx" >
            <div class="border-b border-t border-l border-r rounded-md border-[#0d6efd] bg-white p-2 mb-2">
              <div>
                <div class="">{{calendar.name}}</div>
                <div class="text-sm mb-2">{{calendar.description}}</div>

                <div class="flex flex-grow justify-between">
                  <div class="">
                    <div class="text-xs mr-5"><b>From</b> : {{dateFormat(calendar.start_date)}}</div>
                    <div class="text-xs"><b>To</b> : {{dateFormat(calendar.end_date)}}</div>
                  </div>
                  <div>
                    <a
                        v-if="can('view_calendar','general')"
                          @click="goToCalendar(calendar.number)" class="no-underline bg-[#0d6efd] text-white text-sm px-3 rounded-sm cursor-pointer hover:bg-[#2c2f8c]"> View</a>



                    <router-link
                        class="text-decoration-none"
                        :to="{name:'calendar-year-view', query:{calendar_id:calendar.number}}"
                    >
                      <button
                          type="button"
                          class="bg-[#2c2f8c] hover:bg-[#0c62e1] text-white  text-center w-full rounded-bl-md pt-1 pb-2">
                      <span class="text-xs">
                        view
                      </span>
                      </button>
                    </router-link>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>


          <div class="w-[70%] overflow-y-scroll scrollbar-thin">
          <div class="mx-auto">
            <Calendar :rows="4" :columns="3" class="w-100%" ></Calendar>
          </div>
          </div>

      </div>





    </div>
</template>



<style scoped>

</style>
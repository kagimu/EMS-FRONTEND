

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

        <div class="my-2" style="display: flex; flex-direction: row; justify-content: flex-end" >

            <div >
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

        <div class="row">
            <div v-for="(calendar,idx) in calendars" :key="idx" class="col " >
                <div class="card border-primary mb-3" style="max-width: 18rem; max-height: 18rem">
<!--                    <img class="card-img-top" src="..." alt="Card image cap">-->
                    <div class="card-body ">
                        <h5 class="card-title">{{calendar.name}}</h5>
                        <p class="card-text">{{calendar.description}}</p>
                        <p class="card-text">From : {{dateFormat(calendar.start_date)}}</p>
                        <p class="card-text">To : {{dateFormat(calendar.end_date)}}</p>

                        <div class="card-footer bg-transparent border-success">
                            <a
                            v-if="can('view_calendar','general')"
                             href="#" @click="goToCalendar(calendar.number)" class="btn btn-primary"> View</a>
                        </div>
                    </div>
                    </div>

            </div>
        </div>
        <div class="row">
            <div class="col col-11 mx-auto" >
                <Calendar :rows="3" :columns="4" ></Calendar>
            </div>
        </div>



    </div>
</template>

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

const calendar = ref(null);
const calendars = ref([]);
const calendarDialog = ref(false);
const companyDialog = ref(false);
const calendarEventDialog = ref(false);
const attributes = ref(null);

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

<style scoped>

</style>
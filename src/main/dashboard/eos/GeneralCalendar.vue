<script setup>
import { Calendar } from 'v-calendar';
import 'v-calendar/style.css';
import {onMounted, ref, watch} from 'vue';
import NewCalendar from "@/main/dashboard/eos/components/NewCalendar.vue";
import NewCalendarEvent from "@/main/dashboard/eos/components/NewCalendarEvent.vue";
import {CalendarStore} from "@/main/dashboard/eos/store/EosStore.js";
import useNotificationStore from "@/composables/useNotification.js";
import router from "@/config/router.js";

const calendar = ref(null);
const calendars = ref([]);
const calendarDialog = ref(false);
const calendarEventDialog = ref(false);
const attributes = ref(null);

const  calendarStore  = CalendarStore()
const  notificationStore  = useNotificationStore()

onMounted(() =>{
    calendarStore.fetchCalendars()
})
function moveToday() {
    calendar.value.move(new Date());
    attributes.value =
        // This is a single attribute
        [ {

            // Attribute type definitions
            content: 'red',   // Boolean, String, Object
            highlight: true,  // Boolean, String, Object
            dot: true,        // Boolean, String, Object
            bar: true,        // Boolean, String, Object
            // popover: { ... }, // Only objects allowed
            // Your custom data object for later access, if needed
            customData: { "steve": "rocks" },
            // We also need some dates to know where to display the attribute
            // We use a single date here, but it could also be an array of dates,
            //  a date range or a complex date pattern.
            dates: new Date(),
            // Think of `order` like `z-index`
            order: 0
        }];



}
function goToCalendar(number){
    // router push
    router.push({ name: "calendar-details", params:{"calendar_id":number}})
}

function showAddCalendarDialog(){
    calendarDialog.value = true
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
                <div class="modal fade" id="newCalendarEvent" tabindex="-1" :class="{ show: calendarDialog }" aria-labelledby="" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header text-sm p-0">
                                <h6 class="modal-title ml-3 mt-2 mb-2">Add  Calendar Event</h6>

                            </div>
                            <div class="modal-body">
                                <div class="mt-2 mb-2">
                                    <new-calendar-event></new-calendar-event>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>

        <div class="row mt-2 mb-2">
            <div class="col col-8">
            </div>
            <div class="col col-2">
                <button class="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#newCalendar" @click="showAddCalendarDialog" >Add new Calendar</button>
            </div>
            <div class="col col-2">
                <button class="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#newCalendarEvent" @click="showAddCalendarEventDialog" >Add Events</button>
            </div>
        </div>

        <div class="row">
            <div v-for="(calendar,idx) in calendars" :key="idx" class="col " >
                <div class="card" style="width: 18rem;">
                    <img class="card-img-top" src="..." alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">{{calendar.name}}</h5>
                        <p class="card-text">{{calendar.description}}</p>
                        <a href="#" @click="goToCalendar(calendar.number)" class="btn btn-primary"> View</a>
                    </div>
                </div>
            </div>
        </div>



    </div>
</template>

<style scoped>

</style>
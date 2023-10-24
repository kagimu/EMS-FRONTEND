
<template>
<div>


    <div class="row mt-2 mb-2">
        <div class="col col-8">
            <label>
               There are  {{calendarObject.CalendarEvents.length}} events in this calendar
            </label>
        </div>


    </div>



    <div class="row">
        <div>
            <label>
                {{ calendarObject.name}}

            </label>
        </div>

        <div>
            <label>
                {{ calendarObject.description}}

            </label>
        </div>
    </div>

<!--  <Calendar  ref="calendar" expanded>
    <template v-slot:day-content="{ day, attributes }">
      <div class="custom-day-content" style="border-right: 1px solid #2c3034;border-left: 1px solid #2c3034;border-top: 1px solid #2c3034;border-bottom: 1px solid #2c3034;">
        <span class="day-label">{{ day.day }}</span>
        <ul class="events-list">
          <li v-for="event in attributes.events" :key="event.id">
            {{ event.title }}
          </li>
        </ul>
      </div>
    </template>
  </Calendar>-->

    <Calendar expanded
              ref="calendar"
              :attributes="attributes"
    >

    </Calendar>

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
import {useRoute} from "vue-router";

/*const events = ref([
  { id: 1, title: 'Meeting with client', date: new Date() },
  { id: 2, title: 'Lunch with friends', date: new Date() },
  { id: 3, title: 'Soccer practice', date: new Date() }
])*/

const calendarObject = ref({
    CalendarEvents:[]
});
const calendarDialog = ref(false);
const calendarEventDialog = ref(false);

// const attributes = ref([
//     {
//         highlight: 'blue',
//         dates: [
//             new Date(2022, 10, 4),
//             [new Date(2022, 10, 7), new Date(2022, 10, 9)],
//         ],
//     },
//     {
//         highlight: 'red',
//         // Wrap lone date range in separate array to avoid rendering as multiple dates
//         dates: [[new Date(2022, 10, 17), new Date(2022, 10, 19)]],
//     },
//     {
//         highlight: 'green',
//         dates: [[new Date(2022, 10, 20), new Date(2022, 10, 24)]],
//     },
// ]);
const attributes = ref([
  {
    key: 'today',
    highlight: true,
    dates: new Date(),
  },
/*    {
        highlight: true,
        dates: [
            {
                start: new Date(2023, 10, 7),
                end: new Date(2024, 10, 9),
                repeat: {
                    every: 'month',
                    ordinalWeekdays: [
                        [1, 2], // First Monday of the month
                        [-1, 2], // Last Monday of the month
                    ],
                },
            },
        ],
    },
    {
        highlight: 'red',
        // Wrap lone date range in separate array to avoid rendering as multiple dates
        dates: [[new Date(2022, 10, 17), new Date(2022, 10, 19)]],
    },*/
]);

const  calendarStore  = CalendarStore()
const  notificationStore  = useNotificationStore()

onMounted(() =>{
    const route = useRoute()
    let number = route.params.calendar_id
    calendarStore.fetchCalendarByNumber(number)


    /*attributes.value = [
        {
            highlight: 'blue',
            dates: [
                new Date(2023, 10, 4),
                [new Date(2023, 10, 7), new Date(2022, 10, 9)],
            ],
        },
        {
            highlight: 'red',
            // Wrap lone date range in separate array to avoid rendering as multiple dates
            dates: [[new Date(2023, 10, 17), new Date(2022, 10, 19)]],
        },
        {
            highlight: 'green',
            dates: [[new Date(2024, 10, 20), new Date(2022, 10, 24)]],
        },
    ];*/
})




function showAddCalendarEventDialog(){
    calendarEventDialog.value = true
}





watch(
    () => calendarStore.calendarFetchDetails,
    async (data) => {

        if(data){
            calendarObject.value = data

           /* attributes.value = []

            attributes.value = [
                {
                    highlight: true,
                    dates: [
                        {
                            start: new Date(calendarObject.start_date),
                            end: new Date(calendarObject.end_date),
                            repeat: {
                                every: 'month',
                                ordinalWeekdays: [
                                    [1, 3], // First Monday of the month
                                    [-1, 3], // Last Monday of the month
                                ],
                            },
                        },
                    ],
                },
            ]*/

        }

    },
    {deep:true}
)

</script>


<style scoped>

</style>
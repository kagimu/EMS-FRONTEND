
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
    },
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

            attributes.value = []

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
                                    [1, 2], // First Monday of the month
                                    [-1, 2], // Last Monday of the month
                                ],
                            },
                        },
                    ],
                },
            ]

        }

    },
    {deep:true}
)

</script>


<style scoped>

</style>
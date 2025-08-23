<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'
import { CalendarStore } from "@/main/dashboard/eos/store/EosStore.js";
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from "vue-router";

const calendarStore = CalendarStore()
const calendars = ref([])
const CalendarEvents = ref([])
const route = useRoute()
const routerData = useRouter()

// FullCalendar options
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin],
  initialView: 'multiMonthYear',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
  },
  multiMonthMaxColumns: 2,
  multiMonthMinWidth: 150,
  dayMaxEventRows: false,
  dayMaxEvents: false,
  fixedWeekCount: false,
  displayEventTime: false,
  events: [] // Will be filled dynamically from API
})

// Fetch calendars and specific calendar details on mount
onMounted(() => {
  calendarStore.fetchCalendars()
  const number = routerData.currentRoute.value.query.calendar_id
  calendarStore.fetchCalendarByNumber(number)
})

// Watch for calendars list update
watch(
    () => calendarStore.calendarFetch,
    (data) => {
      if (data) {
        calendars.value = data
      }
    },
    { deep: true }
)

watch(
    () => calendarStore.calendarFetchDetails,
    (data) => {
      if (data && Array.isArray(data.CalendarEvents)) {
        CalendarEvents.value = data.CalendarEvents

        const colors = [
          '#f97316', // Orange
          '#2563eb', // Blue
          '#10b981', // Green
          '#ef4444', // Red
          '#9333ea', // Purple
          '#3b82f6', // Light Blue
          '#f59e0b', // Amber
          '#14b8a6'  // Teal
        ]

        const mappedEvents = data.CalendarEvents.flatMap((term, index) => {
          const termColor = colors[index % colors.length]

          return [
            {
              title: `${term.name} Starts`,
              start: term.start_date,
              color: termColor,
            },
            {
              title: `${term.name} Ends`,
              start: term.end_date,
              color: termColor
            }
          ]
        })

        calendarOptions.value.events = mappedEvents
      }
    },
    { deep: true }
)


</script>
<template>
  <div>
<!--    {{calendars}}-->
<!--    {{calendarOptions}}-->
    <FullCalendar :options="calendarOptions" />
  </div>
</template>
<style scoped>
.fc {
  max-width: 100%;
  margin: 0 auto;
}

.fc-multimonth-view .fc-daygrid-day-frame {
  overflow: visible !important;
}

.fc-multimonth-title {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}
</style>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ref } from 'vue'

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  dayMaxEventRows: false,
  dayMaxEvents: false,
  fixedWeekCount: false,
  events: [
    { title: 'INV0158 - Invoice Review', date: '2025-07-31', color: 'green' },
    { title: 'INV0159 - Client Billing', date: '2025-07-31', color: 'green' },
    { title: 'GovNet Technology Meeting', date: '2025-08-01', color: 'purple' },
    { title: 'Nsubuga Lameck - Consultation', date: '2025-08-05', color: 'purple' },
    { title: 'Staff Training Session', date: '2025-08-12', color: '#f59e0b' },
    { title: 'Quarterly Review Meeting', date: '2025-08-15', color: '#2563eb' },
    { title: 'Team Building Activity', date: '2025-08-19', color: '#10b981' },
    { title: 'Client Demo Presentation', date: '2025-08-22', color: '#ef4444' },
    { title: 'Marketing Strategy Workshop', date: '2025-08-26', color: '#9333ea' },
    { title: 'INV0160 - Payment Follow-up', date: '2025-08-31', color: 'green' },
    { title: 'Audit Session', date: '2025-08-31', color: '#3b82f6' },
    { title: 'Project Kickoff', date: '2025-08-31', color: '#f97316' },
    { title: 'Client Call', date: '2025-08-31', color: '#ef4444' }
  ]
})
</script>

<template>
  <div>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<style scoped>
.fc {
  max-width: 100%;
  margin: 0 auto;
}

/* Make sure events look good inside cells */
.fc-daygrid-event {
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  display: block;
}

/* Prevent overflow clipping */
.fc-daygrid-day-frame {
  overflow: visible !important;
}
</style>

<script setup>
import { Calendar } from 'v-calendar';
import 'v-calendar/style.css';
import { ref } from 'vue';
import NewCalendar from "@/main/dashboard/eos/components/NewCalendar.vue";

const calendar = ref(null);
const calendarDialog = ref(false);
const attributes = ref(null);

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

function showAddCalendarDialog(){
    calendarDialog.value = true
}
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
    </div>

    <div class="row mt-2 mb-2">
        <div class="col col-10">
        </div>
        <div class="col col-2">
            <button class="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#newCalendar" @click="showAddCalendarDialog" >Add new Calendar</button>
        </div>
    </div>

    <Calendar expanded ref="calendar" :attributes="attributes">
        <template #footer>
            <div class="w-full px-4 pb-3">
                <button
                        class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full px-3 py-1 rounded-md"
                        @click="moveToday"
                >
                    Today
                </button>
            </div>
        </template>
    </Calendar>

</div>
</template>

<style scoped>

</style>
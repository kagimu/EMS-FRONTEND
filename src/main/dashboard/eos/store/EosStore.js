import {defineStore} from "pinia";
import api from "@/config/api.js";
import {ref} from "vue";

export  const CalendarStore = defineStore("calendar", () => {

    const calendarCreate = ref(null)
    const calendarError = ref(null)
    const calendarCreateSuccess = ref(null)
    const calendarFetch = ref(null)
    const calendarFetchError = ref(null)
    const calendarFetchAll = ref(null)
    const calendarFetchAllError = ref(null)
    const calendarFetchAllSuccess = ref(null)

    async function createCalendar(data) {
        return await api.post("main/eos/calendar/add", data)
            .then((response) => {
                calendarCreate.value = response.data
            })
            .catch((response) => {
                if(response){
                    calendarError.value = response.response.data
                }
            })

    }

    async function fetchCalendars(data) {
        return await api.get("main/calendar/all")
            .then((response) => {
                calendarFetch.value = response.data
            })
            .catch((response) => {
                if(response){
                    calendarError.value = response.response.data
                }
            })

    }

    async function fetchCalendarByNumber(data) {
        return await api.get("main/calendar/"+data)
            .then((response) => {
                calendarFetch.value = response.data
            })
            .catch((response) => {
                if(response){
                    calendarError.value = response.response.data
                }
            })

    }



    return {
        fetchCalendarByNumber,
        fetchCalendars,
        createCalendar,
        calendarCreate,
        calendarError,
        calendarCreateSuccess,
        calendarFetch,
        calendarFetchError,
    }
})
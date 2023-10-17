import {defineStore} from "pinia";
import api from "@/config/api.js";
import {ref} from "vue";

export  const CalendarStore = defineStore("calendar", () => {

    const calendarCreate = ref(null)
    const companyCreate = ref(null)
    const calendarError = ref(null)
    const calendarCreateSuccess = ref(null)
    const calendarFetch = ref(null)
    const calendarFetchError = ref(null)
    const calendarFetchAll = ref(null)
    const calendarFetchAllError = ref(null)
    const calendarFetchAllSuccess = ref(null)
    const calendarFetchDetails =  ref(null)

    async function createCalendar(data) {
        return await api.post("main/eos/calendars", data)
            .then((response) => {
                calendarCreate.value = response.data
            })
            .catch((response) => {
                if(response){
                    calendarError.value = response.response.data
                }
            })

    }

    async function createCompany(data) {
        return await api.post("main/eos/entity/add", data)
            .then((response) => {
                companyCreate.value = response.data
            })
            .catch((response) => {
                if(response){
                    calendarError.value = response.response.data
                }
            })

    }


    async function fetchCalendars(data) {
        return await api.get("main/eos/calendars")
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
        return await api.get("main/eos/calendars/"+data)
            .then((response) => {
                calendarFetchDetails.value = response.data
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
        createCompany,
        calendarCreate,
        calendarError,
        calendarCreateSuccess,
        calendarFetch,
        calendarFetchError,
        calendarFetchDetails
    }
})
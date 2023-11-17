import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useTimetableStore = defineStore("timetable", () => {
    let newPeriodResponse = ref(null)
    let deletePeriodResponse = ref(null)
    let PeriodListResponse = ref(null)
    let DistinctDays = ref(null)
    let editPeriodResponse = ref(null)
    let PeriodInfoResponse = ref(null)
    const errorMessage = ref(null)
    let studyTimetables = ref(null)



    async function newPeriodData(data) {
        return await api.post("main/timetable/add-timetable-period", data)
            .then((response) => {
                newPeriodResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function deletePeriod(data) {
        return await api.post("main/delete-Period", data)
            .then((response) => {
                deletePeriodResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function editPeriodData(data) {
        return await api.post("main/edit-Period", data)
            .then((response) => {
                editPeriodResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchPeriods(campus_number) {
        return await api.get("main/timetable/get-timetable-periods?campus_number"+campus_number)
            .then((response) => {
                PeriodListResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchDistinctDays(campus_number) {
        return await api.get("main/timetable/get-distinct-days?campus_number"+campus_number)
            .then((response) => {
                DistinctDays.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchPeriodData(data) {
        return await api.get("main/Period-info?Period_number="+data)
            .then((response) => {
                PeriodInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchTimetables(){
        return await api.get("main/timetable/all-study-timetables").then((response)=>{
            studyTimetables.value = response.data
        }).catch(error=>{
            errorMessage.value = error.response.data
        })
    }




    return {
        newPeriodResponse,
        PeriodListResponse,
        DistinctDays,
        PeriodInfoResponse,
        editPeriodResponse,
        deletePeriodResponse,
        errorMessage,
        newPeriodData,
        fetchPeriods,
        fetchDistinctDays,
        fetchPeriodData,
        editPeriodData,
        deletePeriod,
        fetchTimetables,
        studyTimetables
    }
})
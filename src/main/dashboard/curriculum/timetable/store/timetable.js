import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useTimetableStore = defineStore("timetable", () => {
    let newPeriodResponse = ref(null)
    let deletePeriodResponse = ref(null)
    let PeriodListResponse = ref(null)
    let editPeriodResponse = ref(null)
    let PeriodInfoResponse = ref(null)
    const errorMessage = ref(null)



    async function newPeriodData(data) {
        return await api.post("main/new-Period", data)
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

    async function fetchPeriods(school_number) {
        return await api.get("main/Periodes?school_number="+school_number)
            .then((response) => {
                PeriodListResponse.value = response.data
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




    return {
        newPeriodResponse,
        PeriodListResponse,
        PeriodInfoResponse,
        editPeriodResponse,
        deletePeriodResponse,
        errorMessage,
        newPeriodData,
        fetchPeriods,
        fetchPeriodData,
        editPeriodData,
        deletePeriod
    }
})
import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useCampusStore = defineStore("campus", () => {
    let newCampusResponse = ref(null)
    let deleteCampusResponse = ref(null)
    let campusListResponse = ref(null)
    let editCampusResponse = ref(null)
    let campusInfoResponse = ref(null)
    const errorMessage = ref(null)



    async function newCampusData(data) {
        return await api.post("main/new-campus", data)
            .then((response) => {
                newCampusResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function deleteCampus(data) {
        return await api.post("main/delete-campus", data)
            .then((response) => {
                deleteCampusResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function editCampusData(data) {
        return await api.post("main/edit-campus", data)
            .then((response) => {
                editCampusResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchCampuses(data) {
        return await api.get("main/campuses?school_number="+data)
            .then((response) => {
                campusListResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchCampusData(data) {
        return await api.get("main/campus-info?campus_number="+data)
            .then((response) => {
                campusInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    return {
        newCampusResponse,
        campusListResponse,
        campusInfoResponse,
        editCampusResponse,
        deleteCampusResponse,
        errorMessage,
        newCampusData,
        fetchCampuses,
        fetchCampusData,
        editCampusData,
        deleteCampus
    }
})
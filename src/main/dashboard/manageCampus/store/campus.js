import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useCampusStore = defineStore("campus", () => {
    let newCampusResponse = ref(null)
    let deleteCampusResponse = ref(null)
    let campusListResponse = ref(null)
    let editCampusResponse = ref(null)
    let campusInfoResponse = ref(null)
    let campusClassesResponse = ref(null)
    let campusLevelListResponse = ref(null)
    const errorMessage = ref(null)



    async function newCampusData(data) {
        return await api.post("main/campus/new", data)
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
        return await api.post("main/campus/delete", data)
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
        return await api.post("main/campus/edit", data)
            .then((response) => {
                editCampusResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchCampuses(school_number) {
        return await api.get("main/campus/all?school_number="+school_number)
            .then((response) => {
                campusListResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchCampusLevel(campus_number) {
        return await api.get("main/campus-level?campus_number="+campus_number)
            .then((response) => {
                campusLevelListResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchCampusData(data) {
        return await api.get("main/campus/info?campus_number="+data)
            .then((response) => {
                campusInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchClassesByCampus(campus_number) {
        return await api.get("main/class/by-campus-number/"+campus_number)
            .then((response) => {
                campusClassesResponse.value = response.data
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
        campusLevelListResponse,
        campusClassesResponse,
        newCampusData,
        fetchCampuses,
        fetchCampusData,
        editCampusData,
        deleteCampus,
        fetchCampusLevel,
        fetchClassesByCampus
    }
})
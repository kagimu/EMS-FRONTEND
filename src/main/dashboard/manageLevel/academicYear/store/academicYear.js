import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useAcademicYearStore = defineStore("academicYear", () => {
    let newAcademicYearResponse = ref(null)
    const errorMessage = ref(null)
    const academicYearResponse = ref(null)
    const deleteAcademicYearResponse = ref(null)



    async function newAcademicYear(data) {
        return await api.post("main/new-academic-year", data)
            .then((response) => {
                newAcademicYearResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function fetchAcademicYear(level) {
        return await api.get("main/fetch-academic-year?level="+level)
            .then((response) => {
                academicYearResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function deleteAcademicYear(data) {
        return await api.post("main/academic-year/delete", data)
            .then((response) => {
                deleteAcademicYearResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    return {
        newAcademicYearResponse,
        academicYearResponse,
        deleteAcademicYearResponse,
        errorMessage,
        newAcademicYear,
        fetchAcademicYear,
        deleteAcademicYear
    }
})
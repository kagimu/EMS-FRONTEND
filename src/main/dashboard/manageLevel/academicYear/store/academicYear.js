import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useAcademicYearStore = defineStore("academicYear", () => {
    let newAcademicYearResponse = ref(null)
    let academicYearByLevelResponse = ref(null)
    const errorMessage = ref(null)
    const academicYearResponse = ref(null)
    const deleteAcademicYearResponse = ref(null)
    const academicYearByCampusResponse = ref(null)



    async function newAcademicYear(data) {
        return await api.post("main/academic-year/new", data)
            .then((response) => {
                newAcademicYearResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function fetchAcademicYearByLevel(campus_level_number) {
        return await api.get("main/academic-year/by-level?campus_level_number="+campus_level_number)
            .then((response) => {
                academicYearByLevelResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchAcademicYear(campus_curriculum_number) {
        return await api.get("main/academic-year/all?campus_curriculum_number="+campus_curriculum_number)
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



    async function fetchAcademicYearByCampus(campus_class_number) {
        return await api.get("main/academic-year/by-campus-class?campus_class_number="+campus_class_number)
            .then((response) => {
                academicYearByCampusResponse.value = response.data
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
        academicYearByLevelResponse,
        errorMessage,
        newAcademicYear,
        fetchAcademicYear,
        deleteAcademicYear,
        fetchAcademicYearByLevel,
        fetchAcademicYearByCampus,
        academicYearByCampusResponse
    }
})
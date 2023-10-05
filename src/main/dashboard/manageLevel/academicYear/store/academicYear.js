import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useAcademicYearStore = defineStore("academicYear", () => {
    let newAcademicYearResponse = ref(null)
    const errorMessage = ref(null)



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



/*    async function fetchLevelsByCampusNumber(campusNumber) {
        return await api.get("main/timetable/fetch-levels-by-campus-number/"+campusNumber)
            .then((response) => {
                levelResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }*/





    return {
        newAcademicYearResponse,
        errorMessage,
        newAcademicYear
    }
})
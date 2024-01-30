import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useStudyPeriodStore = defineStore("studyPeriod", () => {
    const errorMessage = ref(null)
    const academicYearResponse = ref(null)
    const newStudyPeriodResponse = ref(null)
    const studyPeriodResponse = ref(null)
    const deleteStudyPeriodResponse = ref(null)



    async function newStudyPeriod(data) {
        return await api.post("main/new-study-period", data)
            .then((response) => {
                newStudyPeriodResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function fetchStudyPeriod(data) {
        return await api.get("main/fetch-study-period?level="+data.level+"&academic_year_number="+data.academic_year_number)
            .then((response) => {
                studyPeriodResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function deleteStudyPeriod(data) {
        return await api.post("main/study-period/delete", data)
            .then((response) => {
                deleteStudyPeriodResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    return {
        newStudyPeriodResponse,
        academicYearResponse,
        studyPeriodResponse,
        deleteStudyPeriodResponse,
        errorMessage,
        newStudyPeriod,
        fetchStudyPeriod,
        deleteStudyPeriod,
    }
})
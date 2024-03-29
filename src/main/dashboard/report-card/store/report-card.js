import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useReportCardStore = defineStore("ReportCard", () => {
    const reportSummaryResponse = ref(null)
    const errorMessage = ref(null)


    async function fetchReportSummary(data) {
        return await api.get("main/report-settings/report-settings-by-student",data)
            .then((response) => {
                reportSummaryResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    return {
        reportSummaryResponse,
        errorMessage,
        fetchReportSummary,
    }
})
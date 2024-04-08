import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useReportCardStore = defineStore("ReportCard", () => {
    const reportSummaryResponse = ref(null)
    const generateReportResponse = ref(null)
    const errorMessage = ref(null)


    async function fetchReportSummary(data) {
        return await api.get("main/report-settings/report-settings-by-student?study_period_number="+data.study_period_number+"&campus_class_number="+data.campus_class_number)
            .then((response) => {
                reportSummaryResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function generateReport(data) {
        return await api.post("main/report-settings/generate-report", data)
            .then((response) => {
                generateReportResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    return {
        reportSummaryResponse,
        generateReportResponse,
        errorMessage,
        fetchReportSummary,
        generateReport,
    }
})
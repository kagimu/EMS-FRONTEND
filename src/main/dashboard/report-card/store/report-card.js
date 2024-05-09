import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useReportCardStore = defineStore("ReportCard", () => {
    const reportSummaryResponse = ref(null)
    const reportDetailsResponse = ref(null)
    const generateReportResponse = ref(null)
    const reportGeneratedReportResponse = ref(null)
    const errorMessage = ref(null)


    async function fetchGeneratedReport(data) {
        return await api.get("main/report-settings/report-settings-by-student?study_period_number="+data.study_period_number+"&campus_class_number="+data.campus_class_number)
            .then((response) => {
                reportGeneratedReportResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchReportSummary(data) {
        return await api.get("main/report-settings/report-summary?page="+data.page+"&per_page="+data.per_page)
            .then((response) => {
                if(response && response.data) {
                    reportSummaryResponse.value = response.data
                }
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchReportDetailsInfo(report_summary_number) {
        return await api.get("main/report-settings/report-summary-details/"+report_summary_number)
            .then((response) => {
                reportDetailsResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function generateReport(data) {
        return await api.post("main/report-settings/generate-report", data)
            .then((response) => {
                generateReportResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }



    return {
        reportSummaryResponse,
        generateReportResponse,
        reportGeneratedReportResponse,
        reportDetailsResponse,
        errorMessage,
        fetchGeneratedReport,
        generateReport,
        fetchReportSummary,
        fetchReportDetailsInfo,
    }
})
import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useReportSetupStore = defineStore("report_setup", () => {

    const reportSettingsResponse = ref(null)
    const reportColumnResponse = ref(null)
    const reportColumnAssessmentResponse = ref(null)
    const reportSummaryResponse = ref(null)
    const reportScoreResponse = ref(null)
    const reportScoreSummaryResponse = ref(null)
    const reportSettingsListResponse = ref(null)
    const reportColumnListResponse = ref(null)
    const errorMessage = ref(null)

    async function newReportSettings(data) {
        return await api.post("main/report-settings", data)
            .then((response) => {
                reportSettingsResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function newReportColumn(data) {
        return await api.post("main/report-settings/columns", data)
            .then((response) => {
                reportColumnResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newReportColumnAssessment(data) {
        return await api.post("main/report-settings/columns", data)
            .then((response) => {
                reportColumnAssessmentResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newReportSummary(data) {
        return await api.post("main/report-settings/columns", data)
            .then((response) => {
                reportSummaryResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newReportScore(data) {
        return await api.post("main/report-settings/columns", data)
            .then((response) => {
                reportScoreResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newReportScoreSummary(data) {
        return await api.post("main/report-settings/columns", data)
            .then((response) => {
                reportScoreSummaryResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchReportSettings() {
        return await api.get("main/report-settings")
            .then((response) => {
                reportSettingsListResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchReportColumn() {
        return await api.get("main/report-settings/columns")
            .then((response) => {
                reportColumnListResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    return {
        errorMessage,
        reportSettingsResponse,
        reportColumnResponse,
        reportSummaryResponse,
        reportScoreResponse,
        reportScoreSummaryResponse,
        reportColumnAssessmentResponse,
        reportSettingsListResponse,
        reportColumnListResponse,
        newReportSettings,
        newReportColumn,
        newReportColumnAssessment,
        newReportSummary,
        newReportScore,
        newReportScoreSummary,
        fetchReportSettings,
        fetchReportColumn,
    }
})
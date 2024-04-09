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
    const studentsByAssessmentMetricResponse = ref(null)
    const reportColumnListResponse = ref(null)
    const reportColumnAssessmentListResponse = ref(null)
    const studentMarksResponse = ref(null)
    const assessmentAreaGradingStandardResponse = ref(null)
    const assessmentAreaGradingStandardInfoResponse = ref(null)
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

    async function newAssessmentAreaGradingStandard(data) {
        return await api.post("main/grading-standard/attach-assessment-area", data)
            .then((response) => {
                assessmentAreaGradingStandardResponse.value = response.data
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
        return await api.post("main/report-settings/report-column-assessment", data)
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

    async function fetchAssessmentAreaGradingStandardInfo() {
        return await api.get("main/grading-standard/assessment-areas")
            .then((response) => {
                assessmentAreaGradingStandardInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchStudentByAssessmentMetric(data) {
        return await api.get("main/students/by-assessment-metric/"+data)
            .then((response) => {
                studentsByAssessmentMetricResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function addStudentMarks(data) {
        return await api.post("main/assessments", data)
            .then((response) => {
                studentMarksResponse.value = response.data
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

    async function fetchReportColumnAssessment() {
        return await api.get("main/report-settings/report-column-assessment")
            .then((response) => {
                reportColumnAssessmentListResponse.value = response.data
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
        reportColumnAssessmentListResponse,
        studentsByAssessmentMetricResponse,
        studentMarksResponse,
        assessmentAreaGradingStandardResponse,
        assessmentAreaGradingStandardInfoResponse,
        newReportSettings,
        newReportColumn,
        newReportColumnAssessment,
        newReportSummary,
        newReportScore,
        newReportScoreSummary,
        fetchReportSettings,
        fetchReportColumn,
        fetchReportColumnAssessment,
        fetchStudentByAssessmentMetric,
        addStudentMarks,
        newAssessmentAreaGradingStandard,
        fetchAssessmentAreaGradingStandardInfo
    }
})
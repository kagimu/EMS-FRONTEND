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
    const reportTemplateResponse = ref(null)
    const reportTemplateListResponse = ref(null)
    const classToReportTemplateResponse = ref(null)
    const classesAddedToReportTemplateListResponse = ref(null)
    const removeClassFromReportTemplateResponse = ref(null)
    const deleteReportColumnResponse = ref(null)
    const deleteReportSettingsResponse = ref(null)
    const reportColumnByReportSettingResponse = ref(null)
    const reportSettingsUpdateResponse= ref(null)

    async function newReportSettings(data) {
        return await api.post("main/report-settings", data)
            .then((response) => {
                reportSettingsResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function updateReportSettings(data) {
        return await api.put("main/report-settings/update", data)
            .then((response) => {
                reportSettingsUpdateResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function newAssessmentAreaGradingStandard(data) {
        return await api.post("main/grading-standard/attach-assessment-area", data)
            .then((response) => {
                assessmentAreaGradingStandardResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    async function newReportColumn(data) {
        return await api.post("main/report-settings/columns", data)
            .then((response) => {
                reportColumnResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function newReportColumnAssessment(data) {
        return await api.post("main/report-settings/report-column-assessment", data)
            .then((response) => {
                reportColumnAssessmentResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function newReportSummary(data) {
        return await api.post("main/report-settings/columns", data)
            .then((response) => {
                reportSummaryResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function newReportScore(data) {
        return await api.post("main/report-settings/columns", data)
            .then((response) => {
                reportScoreResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function newReportScoreSummary(data) {
        return await api.post("main/report-settings/columns", data)
            .then((response) => {
                reportScoreSummaryResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    
    async function fetchReportSettings(data) {
        let academic_year_number = data?.academic_year_number ?? ""
        let study_period_number = data?.study_period_number ?? ""
        let class_number = data?.class_number ?? ""
        let campus_number = data?.campus_number
        let campus_curriculum_number = data?.campus_curriculum_number
        return await api.get("main/report-settings?academic_year_number="+academic_year_number+
                "&study_period_number="+study_period_number+
                "&class_number="+class_number+"&campus_number="+campus_number+
                "&campus_curriculum_number="+campus_curriculum_number
            )
            .then((response) => {
                reportSettingsListResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchAssessmentAreaGradingStandardInfo(grading_standard_number, school_number) {
        return await api.get("main/grading-standard/assessment-areas?grading_standard_number="+grading_standard_number+"&school_number="+school_number)
            .then((response) => {
                assessmentAreaGradingStandardInfoResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchStudentByAssessmentMetric(data) {
        return await api.get("main/students/by-assessment-metric/"+data)
            .then((response) => {
                studentsByAssessmentMetricResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function addStudentMarks(data) {
        return await api.post("main/assessments", data)
            .then((response) => {
                studentMarksResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    async function fetchReportColumn(report_setting_number) {
        return await api.get("main/report-settings/columns?report_setting_number="+report_setting_number)
            .then((response) => {
                reportColumnListResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchReportColumnAssessment(data) {
        let academic_year_number =   data?.academic_year_number ?? ""
        let study_period_number =    data?.study_period_number ?? ""
        let class_number =   data?.class_number ?? ""
        let assessment_area_number =   data?.assessment_area_number ?? ""
        let assessment_metric_number =  data?.assessment_metric_number ?? ""
        let  report_setting_number = data?.report_setting_number ?? ""
        let  report_column_number = data?.report_column_number ?? ""
        let campus_number = data?.campus_number ?? ""
        let campus_curriculum_number = data?.campus_curriculum_number ?? ""
        return await api.get("main/report-settings/report-column-assessment"+
                "?academic_year_number="+academic_year_number+
                "&study_period_number="+study_period_number+
                "&class_number="+class_number+
                "&assessment_area_number="+assessment_area_number+
                "&assessment_metric_number="+assessment_metric_number+
                "&report_setting_number="+report_setting_number+
                "&report_column_number="+report_column_number+
                "&campus_number="+campus_number+
                "&campus_curriculum_number="+campus_curriculum_number
            )
            .then((response) => {
                reportColumnAssessmentListResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    
    async function addReportTemplate(data) {
        return await api.post("main/school/report-templates/new", data)
            .then((response) => {
                reportTemplateResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchReportTemplate(schoolN) {
        return await api.get("main/school/report-templates/all?school_number="+schoolN)
            .then((response) => {
                reportTemplateListResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function addClassToReportTemplate(data) {
        return await api.post("main/school/report-templates/add-to-classes", data)
            .then((response) => {
                classToReportTemplateResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    // /main/school/report-templates/by-class?template_number=xyz&school_number=xyx
    async function fetchClassesAddedReportTemplate(templateN,schoolN) {
        return await api.get("main/school/report-templates/by-class?template_number="+templateN+"&school_number="+schoolN)
            .then((response) => {
                classesAddedToReportTemplateListResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function removeClassFromReportTemplate(data) {
        return await api.post("main/school/report-templates/remove-template", data)
            .then((response) => {
                removeClassFromReportTemplateResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function deleteReportColumn(data) {
        return await api.delete("main/report-settings/columns/"+data)
            .then((response) => {
                deleteReportColumnResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function deleteReportSettings(data) {
        return await api.delete("main/report-settings/"+data)
            .then((response) => {
                deleteReportSettingsResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }
    
    async function fetchReportColumnsByReportSettingId(report_setting_number) {
        return await api.get("main/report-settings?report_setting_number="+report_setting_number)
            .then((response) => {
                reportColumnByReportSettingResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
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
        reportColumnByReportSettingResponse,
        reportSettingsUpdateResponse,
        reportTemplateListResponse,
        reportTemplateResponse,
        classToReportTemplateResponse,
        classesAddedToReportTemplateListResponse,
        removeClassFromReportTemplateResponse,
        deleteReportColumnResponse,
        deleteReportSettingsResponse,
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
        fetchAssessmentAreaGradingStandardInfo,
        addReportTemplate,
        fetchReportTemplate,
        addClassToReportTemplate,
        fetchClassesAddedReportTemplate,
        removeClassFromReportTemplate,
        updateReportSettings,
        deleteReportColumn,
        deleteReportSettings,
    }
})
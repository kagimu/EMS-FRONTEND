import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useAssessmentStore = defineStore("assessment", () => {
    const newAssessmentResponse = ref(null)
    const errorMessage = ref(null)
    const markingGuideResponse = ref(null)
    const assessmentResponse = ref(null)
    const gradingStandardResponse = ref(null)
    const assessmentByStudentIdResponse = ref(null)
    const newAssessmentAreasResponse = ref(null)
    const assessmentAreaResponse = ref(null)
    const newAggregateScaleResponse = ref(null)
    const aggregateScaleResponse = ref(null)
    const newGradeStandardResponse = ref(null)
    const gradeStandardResponse = ref(null)
    const classGradeStandardResponse = ref(null)
    const newReportCardResponse = ref(null)
    const newAssessmentMetricResponse = ref(null)
    const assessmentMetricsResponse = ref(null)
    const newMetricResponse = ref(null)
    const updateMetricResponse = ref(null)
    const metricResponse = ref(null)
    const deleteMetricResponse = ref(null)
    const deleteAssessmentAreaGradingStandardResponse = ref(null)
    const newAssessmentScaleResponse = ref(null)
    const assessmentScaleResponse = ref(null)
    const updateAssessmentScaleResponse = ref(null)
    const assessmentAreaByClassResponse = ref(null)
    const gradeResponse = ref(null)
    const newGradeResponse = ref(null)
    const updateGradeResponse = ref(null)
    const deleteGradeResponse = ref(null)
    const deleteGradingScaleResponse = ref(null)
    const changeStatusGradingScaleResponse = ref(null)
    const updateGradeStandardResponse = ref(null)
    const updateGradeStandardScaleDetailsResponse = ref(null)
    const removeInterviewAssessmentScheduleResponse = ref(null)
    const removeStudentFromInterviewResponse = ref(null)
    const updateAggregateScaleResponse = ref(null)
    const deleteAggregateScaleResponse = ref(null)
    const deleteAssessmentGradeResponse = ref(null)
    const aggregateNameGroupResponse = ref(null)
    const newAggregateNameGroupResponse = ref(null)
    const updateAggregateNameGroupResponse = ref(null)
    const deleteAggregateNameGroupResponse = ref(null)
    const makeDefaultGradingScaleResponse = ref(null)
    const updateAssessmentMetricResponse = ref(null)
    const deleteAssessmentMetricResponse = ref(null)
    const newAssessmentSchedulesResponse = ref(null)
    const newReportSubjectGroupResponse = ref(null)

    async function createAssessmentAreas(data) {
        return await api.post("main/assessment-areas",data)
            .then((response) => {
                newAssessmentAreasResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchAssessmentArea(data) {
        let curriculum_class_number = data?.curriculum_class_number ?? ""
        let class_number = data?.class_number ?? ""
        let curriculum_number = data?.curriculum_number ?? ""
        let level_number =   data?.level_number ?? ""

        return await api.get("main/assessment-areas?level_number="+level_number+"&curriculum_number="+curriculum_number+"&curriculum_class_number="+curriculum_class_number+"&class_number="+class_number)
            .then((response) => {
                assessmentAreaResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function fetchAssessmentAreaByClass(campus_class_number) {
        campus_class_number = campus_class_number ? campus_class_number : ""
        return await api.get("main/assessment-areas/by-campus-class-number/"+campus_class_number)
            .then((response) => {
                assessmentAreaByClassResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function createNewAssessment(data) {
        return await api.post("main/assessments", data)
            .then((response) => {
                newAssessmentResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchAssessments() {
        return await api.get("main/assessments")
            .then((response) => {
                assessmentResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchGradingStandardData(data) {
        let campus_number = data?.campus_number ?? ""
        let campus_class_number = data?.campus_class_number ?? ""
        let school_number = data?.school_number ?? ""
        return await api.get("main/grading-standard" +
                "?campus_number="+campus_number+
                "&school_number="+school_number+
                "&campus_class_number="+campus_class_number
            )
            .then((response) => {
                gradingStandardResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchAssessmentsByStudentId(studentid,data) {
        return await api.get("main/assessments?student_number="+studentid,data)
            .then((response) => {
                assessmentByStudentIdResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function createAggregateScale(data) {
        return await api.post("main/assessments/aggregate-scales",data)
            .then((response) => {
                newAggregateScaleResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function updateAggregateScale(data) {
        return await api.post("main/assessments/aggregate-scales/update",data)
            .then((response) => {
                updateAggregateScaleResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function deleteAggregateScale(scale_number) {
        return await api.post("main/assessments/aggregate-scales/remove/"+scale_number)
            .then((response) => {
                deleteAggregateScaleResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function createGradeStandard(data) {
        return await api.post("main/grading-standard",data)
            .then((response) => {
                newGradeStandardResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchGradeStandard(data) {
        let school_number = data.school_number ?? ""
        let class_number = data.class_number ?? ""
        return await api.get("main/grading-standard?school_number="+school_number+"&class_number="+class_number)
            .then((response) => {
                gradeStandardResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchClassGradeStandardList(data) {
        let school_number = data.school_number ?? ""
        let class_number = data.class_number ?? ""
        return await api.get("main/grading-standard/classes?school_number="+school_number+"&class_number="+class_number)
            .then((response) => {
                classGradeStandardResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function createReportCard(data) {
        return await api.post("main/grading-standard",data)
            .then((response) => {
                newReportCardResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchAggregateScale(data) {
        // let campus_number = data.campus_number ?? ""
        // let campus_class_number =  data.campus_class_number ?? ""
        let school_number =  data.school_number ?? ""
        // return await api.get("main/assessments/aggregate-scales/all?school_number="+school_number+"&campus_number="+campus_number+"&campus_class_number="+campus_class_number)
        return await api.get("main/assessments/aggregate-scales/all?school_number="+school_number)
            .then((response) => {
                aggregateScaleResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function createAssessmentMetrics(data) {
        return await api.post("main/assessments/assessment-metrics",data)
            .then((response) => {
                newAssessmentMetricResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function deleteAssessmentMetrics(data) {
        return await api.delete("main/assessments/assessment-metrics/"+data.assessment_schedule_number)
            .then((response) => {
                deleteAssessmentMetricResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function updateAssessmentMetrics(data) {
        return await api.post("main/assessments/update",data)
            .then((response) => {
                updateAssessmentMetricResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchAssessmentMetrics(data) {
        let  page = data?.page ?? ""
        let  per_page =  data?.per_page ?? ""
        let  class_number =   data?.class_number ?? ""
        let  campus_number =   data?.campus_number ?? ""
        let  academic_year_number  =  data?.academic_year_number ?? ""
        let  study_period_number =  data?.study_period_number ?? ""
        let  metric_number =  data?.metric_number ?? ""
        let  assessment_area_number  =  data?.assessment_area_number ?? ""
        let  paginated  =  data?.paginated ?? "no"

        return await api.get("main/assessments/assessment-metrics?study_period_number="+study_period_number+
                "&page="+page+
                "&per_page="+per_page+
                "&assessment_area_number="+assessment_area_number+
                "&class_number="+class_number+
                "&academic_year_number="+academic_year_number+
                "&metric_number="+metric_number+
                "&campus_number="+campus_number+
                "&paginated="+paginated
            )
            .then((response) => {
                assessmentMetricsResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchMetrics(curriculumNumber) {
        return await api.get("main/assessments/metrics?curriculum_number="+curriculumNumber)
            .then((response) => {
                metricResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function deleteMetric(metricNumber) {
        return await api.delete("main/assessments/metrics/"+metricNumber)
            .then((response) => {
                deleteMetricResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function deleteAssessmentAreaGradingStandard(number) {
        return await api.delete("main/assessments/assessment-area-grading-standard/"+number)
            .then((response) => {
                deleteAssessmentAreaGradingStandardResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function createMetric(data) {
        return await api.post("main/assessments/metrics", data)
            .then((response) => {
                newMetricResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function updateMetric(data,metricNumber) {
        return await api.put("main/assessments/metrics/"+metricNumber, data)
            .then((response) => {
                updateMetricResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }



    // assessmentscale
    async function createAssessmentGrade(data) {
        return await api.post("main/assessments/assessment-grades",data)
            .then((response) => {
                newAssessmentScaleResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchAssessmentGrades(data) {
        let campus_number = data.campus_number ?? ""
        let class_number = data.class_number ?? ""
        return await api.get("main/assessments/assessment-grades?campus_number="+campus_number+"&class_number="+class_number)
            .then((response) => {
                assessmentScaleResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    // main/assessments/assessment-grades/53d9cee8-0419-45ae-b89d-252910b92d2c
    async function updateAssessmentGrade(data) {
        return await api.put("main/assessments/assessment-grades/update", data)
            .then((response) => {
                updateAssessmentScaleResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    // assessmentscale
    async function createGrade(data) {
        return await api.post("main/assessments/grades",data)
            .then((response) => {
                newGradeResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function updateGrade(data) {
        return await api.post("main/assessments/grades/update",data)
            .then((response) => {
                updateGradeResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchGrades(data) {
        let school_number = data?.school_number
        return await api.get("main/assessments/grades?school_number="+school_number)
            .then((response) => {
                gradeResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function deleteAssessmentGrade(assessmentGradeNumber) {
        return await api.delete("main/assessments/assessment-grades/delete/"+assessmentGradeNumber)
            .then((response) => {
                deleteAssessmentGradeResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function deleteGrade(gradeNumber) {
        return await api.post("main/assessments/grades/remove/"+gradeNumber)
            .then((response) => {
                deleteGradeResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function deleteGradeStandard(grade_standard_number) {
        return await api.post("main/grading-standard/remove/"+grade_standard_number)
            .then((response) => {
                deleteGradingScaleResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function changeStatusGradeStandard(data) {
        return await api.post("main/grading-standard/status",data)
            .then((response) => {
                changeStatusGradingScaleResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function doMakeGradingStandardDefault(data) {
        return await api.post("main/grading-standard/default-for-class",data)
            .then((response) => {
                makeDefaultGradingScaleResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function updateGradeStandard(data) {
        return await api.post("main/grading-standard/update",data)
            .then((response) => {
                updateGradeStandardResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchStandardGradeDetails(grade_standard_number) {
        return await api.get("main/grading-standard/details?grading_standard_number="+grade_standard_number)
            .then((response) => {
                updateGradeStandardScaleDetailsResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function removeInterviewAssessmentSchedule(data) {
        return await api.post("main/interviews/remove-interview-assessment-metric?interview_assessment_metric_number="+data.interview_assessment_metric_number)
            .then((response) => {
                removeInterviewAssessmentScheduleResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function removeStudentFromInterview(data) {
        return await api.post("main/interviews/remove-student-from-interview?interview_number="+data.interview_number+"&student_number="+data.student_number)
            .then((response) => {
                removeStudentFromInterviewResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function createAggregateGroupName(data) {
        return await api.post("main/assessments/grade-groups",data)
            .then((response) => {
                newAggregateNameGroupResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function updateAggregateGroupName(data) {
        return await api.post("main/assessments/grade-groups/update",data)
            .then((response) => {
                updateAggregateNameGroupResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function deleteAggregateGroupName(data) {
        return await api.post("main/assessments/grade-groups/remove/"+data.grade_group_number)
            .then((response) => {
                deleteAggregateNameGroupResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchAggregateGroupName(school_number) {
        return await api.get("main/assessments/grade-groups?school_number="+school_number)
            .then((response) => {
                aggregateNameGroupResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function uploadMarkingGuideFile(data) {
        return await api.post("main/assessments/script-marking-guide", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then((response) => {
                markingGuideResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function createAssessmentMultiSchedule(data) {
        return await api.post("main/assessments/schedules",data)
            .then((response) => {
                newAssessmentSchedulesResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function createReportSubjectGroup(data) {
        return await api.post("main/report-settings/subject-groups",data)
            .then((response) => {
                newReportSubjectGroupResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }
    return {
        newAssessmentAreasResponse,
        assessmentAreaResponse,
        gradingStandardResponse,
        newAssessmentResponse,
        deleteAssessmentGradeResponse,
        fetchAssessmentsByStudentId,
        assessmentResponse,
        errorMessage,
        assessmentByStudentIdResponse,
        newAggregateScaleResponse,
        aggregateScaleResponse,
        newGradeStandardResponse,
        gradeStandardResponse,
        createReportCard,
        newReportCardResponse,
        newAssessmentMetricResponse,
        assessmentMetricsResponse,
        newMetricResponse,
        metricResponse,
        newAssessmentScaleResponse,
        assessmentScaleResponse,
        updateAssessmentScaleResponse,
        assessmentAreaByClassResponse,
        newGradeResponse,
        gradeResponse,
        updateGradeResponse,
        deleteGradeResponse,
        updateGradeStandardResponse,
        deleteGradingScaleResponse,
        updateAggregateScaleResponse,
        deleteAggregateScaleResponse,
        removeStudentFromInterviewResponse,
        removeInterviewAssessmentScheduleResponse,
        updateGradeStandardScaleDetailsResponse,
        updateMetricResponse,
        deleteMetricResponse,
        changeStatusGradingScaleResponse,
        deleteAssessmentAreaGradingStandardResponse,
        aggregateNameGroupResponse,
        newAggregateNameGroupResponse,
        updateAggregateNameGroupResponse,
        deleteAggregateNameGroupResponse,
        classGradeStandardResponse,
        makeDefaultGradingScaleResponse,
        updateAssessmentMetricResponse,
        markingGuideResponse,
        deleteAssessmentMetricResponse,
        createAssessmentAreas,
        fetchAssessmentArea,
        fetchAssessments,
        createAggregateScale,
        fetchAggregateScale,
        createGradeStandard,
        fetchGradeStandard,
        createAssessmentMetrics,
        fetchAssessmentMetrics,
        createMetric,
        updateMetric,
        fetchMetrics,
        deleteMetric,
        createAssessmentGrade,
        fetchAssessmentGrades,
        updateAssessmentGrade,
        fetchGradingStandardData,
        fetchAssessmentAreaByClass,
        createGrade,
        fetchGrades,
        updateGrade,
        deleteGrade,
        updateGradeStandard,
        deleteGradeStandard,
        changeStatusGradeStandard,
        removeInterviewAssessmentSchedule,
        removeStudentFromInterview,
        updateAggregateScale,
        deleteAggregateScale,
        fetchStandardGradeDetails,
        deleteAssessmentGrade,
        deleteAssessmentAreaGradingStandard,
        createAggregateGroupName,
        fetchAggregateGroupName,
        updateAggregateGroupName,
        deleteAggregateGroupName,
        fetchClassGradeStandardList,
        doMakeGradingStandardDefault,
        updateAssessmentMetrics,
        uploadMarkingGuideFile,
        deleteAssessmentMetrics,
        newAssessmentSchedulesResponse,
        createAssessmentMultiSchedule,
        newReportSubjectGroupResponse,
        createReportSubjectGroup
    }
})
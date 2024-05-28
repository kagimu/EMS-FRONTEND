import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useAssessmentStore = defineStore("assessment", () => {
    const newAssessmentResponse = ref(null)
    const errorMessage = ref(null)
    const assessmentResponse = ref(null)
    const gradingStandardResponse = ref(null)
    const assessmentByStudentIdResponse = ref(null)
    const newAssessmentAreasResponse = ref(null)
    const assessmentAreaResponse = ref(null)
    const newAggregateScaleResponse = ref(null)
    const aggregateScaleResponse = ref(null)
    const newGradeStandardResponse = ref(null)
    const gradeStandardResponse = ref(null)
    const newReportCardResponse = ref(null)
    const newAssessmentMetricResponse = ref(null)
    const assessmentMetricsResponse = ref(null)
    const newMetricResponse = ref(null)
    const metricResponse = ref(null)
    const newAssessmentScaleResponse = ref(null)
    const assessmentScaleResponse = ref(null)
    const updateAssessmentScaleResponse = ref(null)
    const assessmentAreaByClassResponse = ref(null)


    async function createAssessmentAreas(data) {
        return await api.post("main/assessment-areas",data)
            .then((response) => {
             newAssessmentAreasResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchAssessmentArea(campus_class_number) {
        campus_class_number = campus_class_number ? campus_class_number : ""
        return await api.get("main/assessment-areas?curriculum_class_number="+campus_class_number)
            .then((response) => {
               assessmentAreaResponse.value = response.data
            })
            .catch((response) => {
                if(response){
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
                if(response){
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
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    
    async function fetchAssessments(data) {
        return await api.get("main/assessments")
            .then((response) => {
                assessmentResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchGradingStandardData(data) {
        let campus_number = data?.campus_number ?? ""
        let campus_class_number = data?.campus_class_number ?? ""
        return await api.get("main/grading-standard?campus_number="+campus_number+"&campus_class_number="+campus_class_number)
            .then((response) => {
                gradingStandardResponse.value = response.data
            })
            .catch((response) => {
                if(response){
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
                if(response){
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
            if(response){
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
            if(response){
                errorMessage.value = response.response.data
            }
        })
}

async function fetchGradeStandard(data) {
        let campus_number = data.campus_number ?? ""
        let campus_class_number = data.campus_class_number ?? ""
    return await api.get("main/grading-standard?campus_number="+campus_number+"&campus_class_number="+campus_class_number)
        .then((response) => {
            gradeStandardResponse.value = response.data
        })
        .catch((response) => {
            if(response){
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
            if(response){
                errorMessage.value = response.response.data
            }
        })
}

async function fetchAggregateScale(data) {
       let campus_number = data.campus_number ?? ""
       let campus_class_number =  data.campus_class_number ?? ""
    return await api.get("main/assessments/aggregate-scales?campus_number="+campus_number+"&campus_class_number="+campus_class_number)
        .then((response) => {
            aggregateScaleResponse.value = response.data
        })
        .catch((response) => {
            if(response){
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
            if(response){
                errorMessage.value = response.response.data
            }
        })
}

async function fetchAssessmentMetrics(data) {
    let  page = data?.page ?? ""
    let  per_page =  data?.per_page ?? ""
    let  campus_class_number =   data?.campus_class_number ?? ""
    let  academic_year_number  =  data?.academic_year_number ?? ""
    let  study_period_number =  data?.study_period_number ?? ""
    let  metric_number =  data?.metric_number ?? ""
    let  assessment_area_number  =  data?.assessment_area_number ?? ""
    let  paginated  =  data?.paginated ?? "no"
    return await api.get("main/assessments/assessment-metrics?study_period_number="+study_period_number+
            "&page="+page+
            "&per_page="+per_page+
            "&assessment_area_number="+assessment_area_number+
            "&campus_class_number="+campus_class_number+
            "&academic_year_number="+academic_year_number+
            "&metric_number="+metric_number+
            "&paginated="+paginated
        )
        .then((response) => {
            assessmentMetricsResponse.value = response.data
        })
        .catch((response) => {
            if(response){
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
                if(response){
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
            if(response){
                errorMessage.value = response.response.data
            }
        })
}



    // assessmentscale
    async function createAssessmentScale(data) {
        return await api.post("main/assessments/assessment-grades",data)
            .then((response) => {
             newAssessmentScaleResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    
    async function fetchAssessmentGrades(data) {
            let campus_number = data.campus_number ?? ""
            let campus_class_number = data.campus_class_number ?? ""
        return await api.get("main/assessments/assessment-grades?campus_number="+campus_number+"&campus_class_number="+campus_class_number)
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
    async function updateAssessmentScale(data,assessment_grade_id) {
        return await api.put("main/assessments/assessment-grades/update/"+assessment_grade_id,data)
            .then((response) => {
             updateAssessmentScaleResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    return {
        createAssessmentAreas,
        newAssessmentAreasResponse,
        assessmentAreaResponse,
        gradingStandardResponse,
        fetchAssessmentArea,
        newAssessmentResponse,
        createNewAssessment,
        fetchAssessments,
        fetchAssessmentsByStudentId,
        assessmentResponse,
        errorMessage,
        assessmentByStudentIdResponse,
        newAggregateScaleResponse,
        createAggregateScale,
        aggregateScaleResponse,
        fetchAggregateScale,
        newGradeStandardResponse,
        createGradeStandard,
        gradeStandardResponse,
        fetchGradeStandard,
        createReportCard,
        newReportCardResponse,
        newAssessmentMetricResponse,
        assessmentMetricsResponse,
        createAssessmentMetrics,
        fetchAssessmentMetrics,
        createMetric,
        newMetricResponse,
        metricResponse,
        fetchMetrics,
        newAssessmentScaleResponse,
        createAssessmentScale,
        fetchAssessmentGrades,
        assessmentScaleResponse,
        updateAssessmentScale,
        updateAssessmentScaleResponse,
        fetchGradingStandardData,
        fetchAssessmentAreaByClass,
        assessmentAreaByClassResponse
    }
})
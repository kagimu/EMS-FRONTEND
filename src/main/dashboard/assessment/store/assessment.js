import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useAssessmentStore = defineStore("assessment", () => {
    const newAssessmentResponse = ref(null)
    const errorMessage = ref(null)
    const assessmentResponse = ref(null)
    const gradingStandardResponse = ref(null)
    const newExamTypeResponse=ref(null)
    const examTypeResponse = ref(null)
    const assessmentByStudentIdResponse = ref(null)
    const newAssesmentAreasResponse = ref(null)
    const assesmentAreaResponse = ref(null)
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
    const assesmentAreaByClassResponse = ref(null)
    async function createAssesmentAreas(data) {
        return await api.post("main/assessment-areas",data)
            .then((response) => {
             newAssesmentAreasResponse.value = response.data
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
               assesmentAreaResponse.value = response.data
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
               assesmentAreaByClassResponse.value = response.data
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

    async function fetchGradingStandardData(assessment_area_number) {
        return await api.get("main/grading-standard")
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

// async function fetchAggregateScale() {
//     return await api.get("main/assessments/aggregate-scales")
//         .then((response) => {
//             aggregateScaleResponse.value = response.data
//         })
//         .catch((response) => {
//             if(response){
//                 errorMessage.value = response.response.data
//             }
//         })
// }

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

async function fetchGradeStandard() {
    return await api.get("main/grading-standard")
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

async function fetchAggregateScale(campus_number,school_number,class_number) {
    return await api.get("main/assessments/aggregate-scales?campus_number="+campus_number+"&school_number="+school_number+"&class_number="+class_number)
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
      let study_period_number = (data && data.study_period_number) ? data.study_period_number : ""
      let assessment_area_number = (data && data.assessment_area_number) ? data.assessment_area_number : ""
    return await api.get("main/assessments/assessment-metrics?study_period_number="+study_period_number+"&assessment_area_number="+assessment_area_number)
        .then((response) => {
            assessmentMetricsResponse.value = response.data
        })
        .catch((response) => {
            if(response){
                errorMessage.value = response.response.data
            }
        })
}

    async function fetchMetrics() {
        return await api.get("main/assessments/metrics")
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
    
    async function fetchAssessmentScale() {
        return await api.get("main/assessments/assessment-grades")
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
        createAssesmentAreas,
        newAssesmentAreasResponse,
        assesmentAreaResponse,
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
        fetchAssessmentScale,
        assessmentScaleResponse,
        updateAssessmentScale,
        updateAssessmentScaleResponse,
        fetchGradingStandardData,
        fetchAssessmentAreaByClass,
        assesmentAreaByClassResponse
    }
})
import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useAssessmentStore = defineStore("assessment", () => {
    const newAssessmentResponse = ref(null)
    const errorMessage = ref(null)
    const assessmentResponse = ref(null)
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


    async function fetchAssesmentArea(data) {
        return await api.get("main/assessment-areas")
            .then((response) => {
               assesmentAreaResponse.value = response.data
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
//exam type ==
async function createExamType(data) {
    return await api.post("main/assessments/examination-types", data)
        .then((response) => {
            newExamTypeResponse.value = response.data
        })
        .catch((response) => {
            if(response){
                errorMessage.value = response.response.data
            }
        })
}
async function fetchExamType() {
    return await api.get("main/assessments/examination-types")
        .then((response) => {
            examTypeResponse.value = response.data
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

async function fetchAssessmentMetrics() {
    return await api.get("main/assessments/assessment-metrics")
        .then((response) => {
            assessmentMetricsResponse.value = response.data
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




    return {
        createAssesmentAreas,
        newAssesmentAreasResponse,
        assesmentAreaResponse,
        fetchAssesmentArea,
        newAssessmentResponse,
        createNewAssessment,
        fetchAssessments,
        fetchAssessmentsByStudentId,
        assessmentResponse,
        errorMessage,
        newExamTypeResponse,
        createExamType,
        examTypeResponse,
        fetchExamType,
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
        newMetricResponse
    }
})
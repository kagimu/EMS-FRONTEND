import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useStudentApplicationStore = defineStore("student-application", () => {

    const interviewAssessmentResponse = ref(null)
    const errorMessage = ref(null)
    const interviewAssessment = ref()
    const assessmentMetricsOnInterviewResponse = ref(null)

    const interviewAssessmentResultResponse = ref(null)
    const assessmentByStudentResponse = ref(null)

    async function newInterviewAssessment(data) {
        return await api.post("main/interviews/add-interview-assessment-metric", data)
            .then((response) => {
                interviewAssessmentResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newInterviewAssessmentResult(data) {
        return await api.post("main/assessments", data)
            .then((response) => {
                interviewAssessmentResultResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchAssessmentMetricsOnInterview(interview_number) {
        return await api.get("/main/interviews/"+interview_number+"/interview-assessment-metrics")
            .then((response) => {
                assessmentMetricsOnInterviewResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    // assessments?student_number={{STUDENT_ID}}
    async function fetchAssessmentByStudent(studentNumber,AmetricNumber) {
        return await api.get("/main/assessments?student_number="+studentNumber+"&assessment_metric_number="+AmetricNumber)
            .then((response) => {
                assessmentByStudentResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    return {
        errorMessage,
        interviewAssessmentResponse,
        newInterviewAssessment,
        assessmentMetricsOnInterviewResponse,
        fetchAssessmentMetricsOnInterview,
        interviewAssessmentResultResponse,
        newInterviewAssessmentResult,
        fetchAssessmentByStudent,
        assessmentByStudentResponse
    }
})
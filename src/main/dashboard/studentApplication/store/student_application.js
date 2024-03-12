import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useStudentApplicationStore = defineStore("student-application", () => {

    const interviewAssessmentResponse = ref(null)
    const errorMessage = ref(null)


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




    return {
        errorMessage,
        interviewAssessmentResponse,
        newInterviewAssessment,
    }
})
import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useTeacherStore = defineStore("teacher", () => {
    const newAssessmentResponse = ref(null)
    const errorMessage = ref(null)


    async function createAssessmentAreas(data) {
        return await api.post("main/assessment-areas",data)
            .then((response) => {
                newAssessmentResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    return {

        newAssessmentResponse,
        createAssessmentAreas,
    }
})
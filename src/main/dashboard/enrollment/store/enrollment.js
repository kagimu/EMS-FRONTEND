import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useEnrolmentStore = defineStore("enrolment", () => {
    let newsEnrolmentResponse = ref(null)
    let  enrolmentResponse= ref(null)
    
    const errorMessage = ref(null)

    async function newEnrolment(data) {
        return await api.post("main/enrollment", data)
            .then((response) => {
                newsEnrolmentResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchEnrolment() {
        return await api.get("main/enrollment")
            .then((response) => {
                enrolmentResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    

    return {
        newEnrolment,
        fetchEnrolment,
        errorMessage,
        newsEnrolmentResponse,
        enrolmentResponse
    }
} )
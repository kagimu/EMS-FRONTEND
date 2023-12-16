import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useApplicationStore = defineStore("application", () => {
    let newApplicationDetailsResponse = ref(null)
    let newApplicationDetailsLearnerResponse = ref(null)
    const errorMessage = ref(null)

    async function newApplicationDetails(data) {
        return await api.post("main/application/parents", data)
            .then((response) => {
                newApplicationDetailsResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newApplicationLeanerDetails(data) {
        return await api.post("main/application/new-student", data)
            .then((response) => {
                newApplicationDetailsLearnerResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    return {
        newApplicationDetailsResponse ,
        errorMessage,
        newApplicationDetails,
        newApplicationLeanerDetails,
        newApplicationDetailsLearnerResponse ,
    }
})
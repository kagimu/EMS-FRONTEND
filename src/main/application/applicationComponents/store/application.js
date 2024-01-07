import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useApplicationStore = defineStore("application", () => {
    let newApplicationDetailsResponse = ref(null)
    let newApplicationDetailsLearnerResponse = ref(null)
    let newApplicationPreviousSchoolsResponse = ref(null)
    let applicationListResponse = ref(null)
    let interviewListResponse = ref(null)
    let applicationByIdResponse = ref(null)
    const errorMessage = ref(null)

    async function newApplicationDetails(data) {
        return await api.post("main/applications/new-parent", data)
            .then((response) => {
                newApplicationDetailsResponse.value = response.data.data

            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newApplicationLeanerDetails(data) {
        return await api.post("main/applications/new-student", data)
            .then((response) => {
                newApplicationDetailsLearnerResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newApplicationPrevSchoolDetails(applicationId,data) {
        return await api.post("main/applications/"+applicationId+"/previous-schools", data)
            .then((response) => {
                newApplicationPreviousSchoolsResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchApplicationList() {
        return await api.get("main/applications/all?page=1&limit=10")
            .then((response) => {
                applicationListResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchInterviewList() {
        return await api.get("main/applications?status=completed")
            .then((response) => {
                interviewListResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function fetchApplicationById(applicationId){
    return await api.get("main/applications/"+applicationId)
    .then((response) => {
        applicationByIdResponse.value = response.data
    })
    .catch((error) => {
        if(error){
            errorMessage.value = error.data
        } 
    } )
    }

    return {
        newApplicationDetailsResponse ,
        errorMessage,
        newApplicationDetails,
        newApplicationLeanerDetails,
        newApplicationDetailsLearnerResponse,
        fetchApplicationList,
        applicationListResponse,
        fetchInterviewList,
        interviewListResponse,
        fetchApplicationById,
        applicationByIdResponse,
        newApplicationPrevSchoolDetails,
        newApplicationPreviousSchoolsResponse
    }
})
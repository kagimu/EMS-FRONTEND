import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useSchemeOfWorkStore = defineStore("schemeOfWork", () => {
    let newSchemeOfWorkResponse = ref(null)
    let updateSchemeOfWorkResponse = ref(null)
    let schemeOfWorkByClassResponse = ref(null)
    const errorMessage = ref(null)


    async function newSchemeOfWorkData(data) {
        return await api.post("main/new-scheme-of-work", data)
            .then((response) => {
                newSchemeOfWorkResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function updateSchemeOfWorkData(data) {
        return await api.post("main/update-scheme-of-work", data)
            .then((response) => {
                updateSchemeOfWorkResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchSchemeOfWorkByClass(data) {
        return await api.get("main/fetch-scheme-of-work-by-class?class_number="+data)
            .then((response) => {
                schemeOfWorkByClassResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    return {
        newSchemeOfWorkResponse,
        updateSchemeOfWorkResponse,
        schemeOfWorkByClassResponse,
        errorMessage,
        newSchemeOfWorkData,
        fetchSchemeOfWorkByClass,
        updateSchemeOfWorkData
    }
})
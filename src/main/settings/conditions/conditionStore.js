import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useConditionStore = defineStore("conditions", () => {
    const newOfferAdmissionConditionResponse = ref(null)
    const errorMessage = ref(null)
    const offerAdmissionConditionResponse = ref(null)
    const deleteAdmissionConditionResponse = ref(null)
    const updateAdmissionConditionResponse = ref(null)

    async function newOfferAdmissionCondition(data) {
        return await api.post("main/admissions/admission-offer-conditions", data)
            .then((response) => {
                newOfferAdmissionConditionResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    
    async function fetchOfferAdmissionCondition(data) {
        return await api.get("main/admissions/admission-offer-conditions")
            .then((response) => {
                offerAdmissionConditionResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function deleteCondition(conditionid) {
        return await api.delete("main/conditions"+conditionid)
            .then((response) => {
                deleteAdmissionConditionResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.data
                }
            })
    }
    async function updateCondition(conditionid,data) {
        return await api.put("main/conditions/"+conditionid,data)
            .then((response) => {
                updateAdmissionConditionResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.data
                }
            })
    }

    return {
        newOfferAdmissionConditionResponse,
        errorMessage,
        newOfferAdmissionCondition,
        deleteCondition,
        deleteAdmissionConditionResponse,
        updateAdmissionConditionResponse,
        updateCondition,
        fetchOfferAdmissionCondition,
        offerAdmissionConditionResponse
    }
})
import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useCateringStore = defineStore("catering", () => {
    let newUnitOfMeasureInfoResponse = ref(null)
    let  UnitOfMeasureInfoResponse= ref(null)
    let  deleteUnitOfMeasureInfoResponse= ref(null)
    let updateUnitOfMeasureInfoResponse = ref(null)
    
    const errorMessage = ref(null)

    async function newUnitOfMeasureInfo(data) {
        return await api.post("main/catering/unit-of-measure", data)
            .then((response) => {
                newUnitOfMeasureInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchUnitOfMeasureInfo() {
        return await api.get("main/catering/unit-of-measure")
            .then((response) => {
                UnitOfMeasureInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function deleteUnitOfMeasure() {
        return await api.delete("main/")
            .then((response) => {
                deleteUnitOfMeasureInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function updateUnitOfMeasure() {
        return await api.put("main/")
            .then((response) => {
                updateUnitOfMeasureInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    return {
        newUnitOfMeasureInfoResponse,
        errorMessage,
        newUnitOfMeasureInfo,
        fetchUnitOfMeasureInfo,
        deleteUnitOfMeasure,
        UnitOfMeasureInfoResponse,
        deleteUnitOfMeasureInfoResponse,
        updateUnitOfMeasureInfoResponse,
        updateUnitOfMeasure,
    }
} )
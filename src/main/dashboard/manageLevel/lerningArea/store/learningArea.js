import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useLearningAreaStore = defineStore("learningArea", () => {
    let learningAreaResponse = ref(null)
    let learningAreaInfResponse = ref(null)
    const errorMessage = ref(null)


    async function newLearningAreaData(data) {
        return await api.post("main/new-learning-area", data)
            .then((response) => {
                learningAreaResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchLearningArea(data) {
        return await api.get("main/learning-areas?campus_number="+data)
            .then((response) => {
                learningAreaInfResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    return {
        learningAreaResponse,
        learningAreaInfResponse,
        errorMessage,
        newLearningAreaData,
        fetchLearningArea
    }
})
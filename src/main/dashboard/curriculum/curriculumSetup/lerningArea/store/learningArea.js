import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useLearningAreaStore = defineStore("learningArea", () => {
    let learningAreaResponse = ref(null)
    let learningAreaEditResponse = ref(null)
    let learningAreaInfResponse = ref(null)
    let deleteLearningAreaResponse = ref(null)
    const errorMessage = ref(null)
    const learningAreaDataInfoResponse = ref(null)


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

    async function editLearningAreaData(data) {
        return await api.post("main/learning-area/edit", data)
            .then((response) => {
                learningAreaEditResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function fetchLearningArea(data) {
        return await api.get("main/learning-areas?curriculum_number="+data)
            .then((response) => {
                learningAreaInfResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function deleteLearningArea(data) {
        return await api.post("main/learning-area/delete", data)
            .then((response) => {
                deleteLearningAreaResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function learningAreaData(data) {
        return await api.get("main/learning-area/info?learning_area_number="+data)
            .then((response) => {
                learningAreaDataInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    return {
        deleteLearningAreaResponse,
        learningAreaResponse,
        learningAreaInfResponse,
        learningAreaDataInfoResponse,
        learningAreaEditResponse,
        errorMessage,
        newLearningAreaData,
        editLearningAreaData,
        fetchLearningArea,
        deleteLearningArea,
        learningAreaData,
    }
})